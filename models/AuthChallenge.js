const mongoose = require("mongoose");

const authChallengeSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    purpose: {
      type: String,
      enum: ["login", "register"],
      required: true,
    },
    codeHash: {
      type: String,
      required: true,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    attemptsRemaining: {
      type: Number,
      default: 5,
      min: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
    lastSentAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

authChallengeSchema.index({ email: 1, purpose: 1 }, { unique: true });

module.exports = mongoose.model("AuthChallenge", authChallengeSchema);
