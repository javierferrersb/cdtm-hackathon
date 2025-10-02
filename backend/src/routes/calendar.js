import express from "express";
import { google } from "googleapis";

const router = express.Router();

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).json({ error: "Authentication required" });
  }
};

// Get all upcoming events (debug route - shows all events)
router.get("/events/debug", requireAuth, async (req, res) => {
  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: req.user.accessToken,
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const now = new Date();
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(now.getDate() + 2);

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: now.toISOString(),
      timeMax: twoDaysFromNow.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.data.items || [];

    console.log(`Found ${events.length} total events in the next 2 days`);
    events.forEach((event, index) => {
      console.log(`Event ${index + 1}:`, {
        summary: event.summary,
        description: event.description || "No description",
        start: event.start?.dateTime || event.start?.date,
        attendees: event.attendees?.length || 0,
      });
    });

    res.json({
      totalEvents: events.length,
      events: events.map((event) => ({
        id: event.id,
        summary: event.summary,
        description: event.description,
        start: event.start,
        end: event.end,
        attendees: event.attendees,
      })),
    });
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    res.status(500).json({ error: "Failed to fetch calendar events" });
  }
});

// Get upcoming events (next 2 days)
router.get("/events", requireAuth, async (req, res) => {
  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: req.user.accessToken,
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const now = new Date();
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(now.getDate() + 2);

    console.log(
      `Fetching events from ${now.toISOString()} to ${twoDaysFromNow.toISOString()}`
    );

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: now.toISOString(),
      timeMax: twoDaysFromNow.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.data.items || [];
    console.log(`Found ${events.length} total events`);

    // Filter events with descriptions that might contain person/company info
    // Look for the pattern "Name - Company" in the description
    const relevantEvents = events.filter((event) => {
      const hasDescription =
        event.description && event.description.includes("-");
      const matchesPattern =
        event.description &&
        /([\p{L}]+\s+[\p{L}]+(?:\s+[\p{L}]+)*)\s*-\s*([\p{L}\p{N}\s&.,]+)/u.test(
          event.description
        );

      console.log(`Event "${event.summary}":`, {
        hasDescription,
        matchesPattern,
        description: event.description || "No description",
      });

      return hasDescription && matchesPattern;
    });

    console.log(`Filtered to ${relevantEvents.length} relevant events`);
    res.json(relevantEvents);
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    res.status(500).json({ error: "Failed to fetch calendar events" });
  }
});

export default router;
