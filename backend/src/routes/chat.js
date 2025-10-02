import express from "express";
import OpenAI from "openai";
import axios from "axios";

const router = express.Router();

// Initialize OpenAI client
let openai = null;
const getOpenAI = () => {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
};

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
};

// Chat endpoint for event-specific questions
router.post("/event/:eventId", requireAuth, async (req, res) => {
  try {
    const { eventId } = req.params;
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Extract company and person info from context
    const { personName, companyName, eventSummary } = context || {};

    // Use Tavily API for web search if person/company info is available
    let searchResults = [];
    if (personName && companyName) {
      try {
        const tavilyResponse = await axios.post(
          "https://api.tavily.com/search",
          {
            api_key: process.env.TAVILY_API_KEY,
            query: `${message} ${personName} ${companyName}`,
            search_depth: "advanced",
            include_answer: true,
            include_images: false,
            include_raw_content: false,
            max_results: 3,
          }
        );

        searchResults = tavilyResponse.data.results || [];
      } catch (error) {
        console.error("Tavily search error:", error);
        // Continue without search results
      }
    }

    // Create context-aware prompt
    const systemPrompt = `You are a meeting prep assistant. Give short, concise answers (2-3 sentences max). No markdown formatting - use plain text only.

Meeting: ${eventSummary || "Meeting"} with ${personName || "someone"} from ${
      companyName || "a company"
    }

${
  searchResults.length > 0
    ? `Search Results: ${searchResults
        .map((result) => `${result.title}: ${result.content}`)
        .join(" | ")}`
    : ""
}

Keep responses brief and actionable. If you don't know something, just say so.`;

    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const response = completion.choices[0].message.content;

    res.json({
      message: response,
      searchResults:
        searchResults.length > 0 ? searchResults.slice(0, 2) : null, // Include some search results for transparency
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      error: "Failed to process chat message",
      details: error.message,
    });
  }
});

export default router;
