import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";
import axios from "axios";
import Report from "../models/Report.js";

// Initialize OpenAI client lazily to ensure environment variables are loaded
let openai = null;
const getOpenAI = () => {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
};

// Helper function to clean JSON response from OpenAI (removes markdown code blocks)
function cleanJsonResponse(response) {
  if (!response) return "{}";

  // Remove markdown code blocks if present
  let cleaned = response.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }

  cleaned = cleaned.trim();

  // Validate that it's proper JSON
  try {
    JSON.parse(cleaned);
    return cleaned;
  } catch (error) {
    console.warn(
      "Failed to parse cleaned JSON, returning fallback:",
      error.message
    );
    return "{}";
  }
}

// Extract person and company info from event description
function extractPersonAndCompany(description) {
  // Pattern to match "Name LastName - Company Name" format (supports Unicode characters)
  const pattern =
    /([\p{L}]+\s+[\p{L}]+(?:\s+[\p{L}]+)*)\s*-\s*([\p{L}\p{N}\s&.,]+)/u;
  const match = description.match(pattern);

  if (match) {
    return {
      personName: match[1].trim(),
      companyName: match[2].trim(),
    };
  }

  return null;
}

// Get person intelligence using OpenAI and Tavily
async function getPersonIntelligence(personName, companyName) {
  try {
    // Use Tavily API for web search
    const tavilyResponse = await axios.post("https://api.tavily.com/search", {
      api_key: process.env.TAVILY_API_KEY,
      query: `${personName} ${companyName} linkedin profile job title`,
      search_depth: "advanced",
      include_answer: true,
      include_images: false,
      include_raw_content: false,
      max_results: 3,
    });

    const searchResults = tavilyResponse.data.results || [];

    // Use OpenAI to analyze and summarize the search results
    const prompt = `Analyze the following search results about ${personName} from ${companyName}. Extract key information including job title, background, and recent news. Format the response as JSON with fields: jobTitle, background, recentNews (array), linkedInProfile.

Search Results:
${searchResults
  .map((result) => `${result.title}: ${result.content}`)
  .join("\n")}`;

    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const cleanedResponse = cleanJsonResponse(
      completion.choices[0].message.content
    );
    const analysis = JSON.parse(cleanedResponse);

    return {
      ...analysis,
      source: "OpenAI + Tavily",
    };
  } catch (error) {
    console.error("Error getting person intelligence:", error);
    return {
      jobTitle: "Unknown",
      background: "Unable to retrieve information",
      recentNews: [],
      linkedInProfile: "",
      source: "Error",
    };
  }
}

// Get company intelligence using Tavily
async function getCompanyIntelligence(companyName) {
  try {
    const tavilyResponse = await axios.post("https://api.tavily.com/search", {
      api_key: process.env.TAVILY_API_KEY,
      query: `${companyName} company information business industry news`,
      search_depth: "advanced",
      include_answer: true,
      include_images: false,
      include_raw_content: false,
      max_results: 5,
    });

    const searchResults = tavilyResponse.data.results || [];

    // Use OpenAI to analyze and summarize
    const prompt = `Analyze the following search results about ${companyName}. Extract key company information including description, industry, size, recent news, and website. Format the response as JSON with fields: description, industry, size, recentNews (array), website.

Search Results:
${searchResults
  .map((result) => `${result.title}: ${result.content}`)
  .join("\n")}`;

    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const cleanedResponse = cleanJsonResponse(
      completion.choices[0].message.content
    );
    const analysis = JSON.parse(cleanedResponse);

    return {
      ...analysis,
      source: "Tavily + OpenAI",
    };
  } catch (error) {
    console.error("Error getting company intelligence:", error);
    return {
      description: "Unable to retrieve information",
      industry: "Unknown",
      size: "Unknown",
      recentNews: [],
      website: "",
      source: "Error",
    };
  }
}

// Generate meeting preparation summary and tips
async function generateMeetingPreparation(
  personInfo,
  companyInfo,
  eventDetails
) {
  try {
    const prompt = `As a business consultant, generate a professional meeting preparation summary and actionable tips based on the following information:

Meeting: ${eventDetails.title}
Person: ${personInfo.personName} - ${personInfo.jobTitle}
Company: ${companyInfo.companyName} - ${companyInfo.industry}

Person Background: ${personInfo.background}
Company Description: ${companyInfo.description}

Generate:
1. A concise meeting summary (2-3 sentences)
2. 5 actionable preparation tips for the consultant

Format as JSON with fields: summary, tips (array of strings)`;

    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const cleanedResponse = cleanJsonResponse(
      completion.choices[0].message.content
    );
    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error("Error generating meeting preparation:", error);
    return {
      summary: "Meeting preparation analysis unavailable.",
      tips: [
        "Review meeting agenda",
        "Prepare relevant questions",
        "Research company background",
      ],
    };
  }
}

// Main function to generate a complete report
export async function generateReport(eventId, userId, eventData) {
  try {
    // Extract person and company from description
    const extractedInfo = extractPersonAndCompany(eventData.description);

    if (!extractedInfo) {
      throw new Error(
        "Unable to extract person and company information from event description"
      );
    }

    // Get intelligence data
    const [personIntelligence, companyIntelligence] = await Promise.all([
      getPersonIntelligence(
        extractedInfo.personName,
        extractedInfo.companyName
      ),
      getCompanyIntelligence(extractedInfo.companyName),
    ]);

    // Generate meeting preparation
    const preparation = await generateMeetingPreparation(
      { ...extractedInfo, ...personIntelligence },
      { ...extractedInfo, ...companyIntelligence },
      eventData
    );

    // Create and save report
    const report = new Report({
      eventId,
      userId,
      eventDetails: {
        title: eventData.title,
        description: eventData.description,
        startTime: new Date(eventData.startTime),
        endTime: new Date(eventData.endTime),
        attendees: eventData.attendees || [],
      },
      extractedInfo,
      personIntelligence,
      companyIntelligence,
      generatedSummary: preparation.summary,
      preparationTips: preparation.tips,
    });

    await report.save();
    return report;
  } catch (error) {
    console.error("Error generating report:", error);
    throw error;
  }
}
