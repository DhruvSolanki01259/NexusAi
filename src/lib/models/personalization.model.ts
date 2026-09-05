import mongoose, { Document, Model, Schema } from "mongoose";

export interface IPersonalization extends Document {
  userId: string;

  enabled: boolean;

  nickname: string;
  profession: string;
  interests: string;

  responseStyle: string;
  responseLength: string;
  technicalLevel: string;

  emojis: boolean;
  structuredResponses: boolean;

  instructions: string;

  createdAt: Date;
  updatedAt: Date;
}

const PersonalizationSchema = new Schema<IPersonalization>(
  {
    // Only userId is required when user is created
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    enabled: {
      type: Boolean,
      default: true,
    },

    nickname: {
      type: String,
      default: "",
      trim: true,
      maxlength: 100,
    },

    profession: {
      type: String,
      default: "",
      trim: true,
      maxlength: 150,
    },

    interests: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    responseStyle: {
      type: String,
      enum: ["balanced", "direct", "friendly", "professional"],
      default: "balanced",
    },

    responseLength: {
      type: String,
      enum: ["concise", "balanced", "detailed"],
      default: "concise",
    },

    technicalLevel: {
      type: String,
      enum: ["adaptive", "beginner", "intermediate", "advanced"],
      default: "adaptive",
    },

    emojis: {
      type: Boolean,
      default: false,
    },

    structuredResponses: {
      type: Boolean,
      default: true,
    },

    instructions: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2000,
    },
  },
  {
    timestamps: true,
  },
);

const Personalization: Model<IPersonalization> =
  mongoose.models.Personalization ||
  mongoose.model<IPersonalization>("Personalization", PersonalizationSchema);

export default Personalization;
