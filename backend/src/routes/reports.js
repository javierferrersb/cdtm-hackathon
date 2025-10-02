import express from "express";
import Report from "../models/Report.js";
import { generateReport } from "../services/reportService.js";

const router = express.Router();

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).json({ error: "Authentication required" });
  }
};

// Get or generate report for an event
router.get("/event/:eventId", requireAuth, async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;

    // Check if report already exists (caching)
    let report = await Report.findOne({ eventId, userId });

    if (report) {
      return res.json(report);
    }

    // Generate new report
    const eventData = req.query; // Event details passed as query params
    report = await generateReport(eventId, userId, eventData);

    res.json(report);
  } catch (error) {
    console.error("Error getting/generating report:", error);
    res.status(500).json({ error: "Failed to generate report" });
  }
});

// Get all reports for user
router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const reports = await Report.find({ userId }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

// Clear all reports cache for a user
router.delete("/cache/clear", requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await Report.deleteMany({ userId });
    res.json({
      message: "Cache cleared successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error clearing cache:", error);
    res.status(500).json({ error: "Failed to clear cache" });
  }
});

// Delete a specific report
router.delete("/:reportId", requireAuth, async (req, res) => {
  try {
    const { reportId } = req.params;
    const userId = req.user._id;

    await Report.findOneAndDelete({ _id: reportId, userId });
    res.json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ error: "Failed to delete report" });
  }
});

export default router;
