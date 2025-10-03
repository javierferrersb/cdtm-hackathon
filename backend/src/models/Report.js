import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventDetails: {
      title: String,
      description: String,
      startTime: Date,
      endTime: Date,
      attendees: [String],
    },
    extractedInfo: {
      personName: String,
      companyName: String,
    },
    personIntelligence: {
      jobTitle: String,
      background: mongoose.Schema.Types.Mixed,
      recentNews: [String],
      linkedInProfile: String,
      source: String,
    },
    companyIntelligence: {
      description: String,
      industry: String,
      size: mongoose.Schema.Types.Mixed,
      recentNews: [String],
      website: String,
      source: String,
    },
    generatedSummary: String,
    preparationTips: [String],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
reportSchema.index({ userId: 1, eventId: 1 });
reportSchema.index({ createdAt: 1 });

export default mongoose.model("Report", reportSchema);
