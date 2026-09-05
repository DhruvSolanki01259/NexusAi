import { errorResponse, successResponse } from "@/lib/api/apiResponse";
import { getErrorDetails } from "@/lib/api/errorHandler";
import { getAuthenticatedUser } from "@/lib/api/getAuthenticatedUser";
import { connectToMongoDB } from "@/lib/database/mongodb.database";
import Personalization, {
  IPersonalization,
} from "@/lib/models/personalization.model";
import { NextRequest } from "next/server";

export const GET = async () => {
  try {
    const auth = await getAuthenticatedUser();
    if ("error" in auth) {
      return auth.error;
    }

    const userId = auth.userId;

    await connectToMongoDB();

    const settings = await Personalization.findOne({ userId }).lean();

    if (!settings) {
      return errorResponse("Personalization settings not found", 404, {
        name: "SettingsNotFoundError",
        message: "No personalization settings were found for this user.",
        cause: undefined,
      });
    }

    return successResponse(
      "Personalization settings fetched successfully",
      200,
      settings,
    );
  } catch (error) {
    const errorDetails = getErrorDetails(error);

    console.error("GET /api/settings error:", {
      name: errorDetails.name,
      message: errorDetails.message,
      cause: errorDetails.cause,
    });

    return errorResponse("Failed to fetch personalization settings", 500, {
      name: errorDetails.name,
      message: errorDetails.message,
      cause: errorDetails.cause,
    });
  }
};

export const PATCH = async (request: NextRequest) => {
  try {
    const auth = await getAuthenticatedUser();
    if ("error" in auth) {
      return auth.error;
    }

    const {
      enabled,
      nickname,
      profession,
      interests,
      responseStyle,
      responseLength,
      technicalLevel,
      emojis,
      structuredResponses,
      instructions,
    } = await request.json();

    if (
      typeof enabled !== "boolean" ||
      typeof nickname !== "string" ||
      typeof profession !== "string" ||
      typeof interests !== "string" ||
      typeof responseStyle !== "string" ||
      typeof responseLength !== "string" ||
      typeof technicalLevel !== "string" ||
      typeof emojis !== "boolean" ||
      typeof structuredResponses !== "boolean" ||
      typeof instructions !== "string"
    ) {
      return errorResponse("Invalid personalization data", 400, {
        name: "ValidationError",
        message: "Invalid or missing personalization fields.",
        cause: undefined,
      });
    }

    const userId = auth.userId;

    await connectToMongoDB();

    const settings = await Personalization.findOne({ userId });
    if (!settings) {
      return errorResponse("Personalization settings not found", 404, {
        name: "SettingsNotFoundError",
        message: "No personalization settings were found for this user.",
        cause: undefined,
      });
    }

    const updates: Partial<IPersonalization> = {};

    if (enabled !== settings.enabled) updates.enabled = enabled;
    if (nickname.trim() !== settings.nickname)
      updates.nickname = nickname.trim();
    if (profession.trim() !== settings.profession)
      updates.profession = profession.trim();
    if (interests.trim() !== settings.interests)
      updates.interests = interests.trim();
    if (responseStyle !== settings.responseStyle)
      updates.responseStyle = responseStyle;
    if (responseLength !== settings.responseLength)
      updates.responseLength = responseLength;
    if (technicalLevel !== settings.technicalLevel)
      updates.technicalLevel = technicalLevel;
    if (emojis !== settings.emojis) updates.emojis = emojis;
    if (structuredResponses !== settings.structuredResponses)
      updates.structuredResponses = structuredResponses;
    if (instructions.trim() !== settings.instructions)
      updates.instructions = instructions.trim();

    if (Object.keys(updates).length === 0) {
      return successResponse(
        "Personalization settings are already up to date",
        200,
        settings,
      );
    }

    Object.assign(settings, updates);
    await settings.save();

    return successResponse("Settings /PATCH successfully", 201, settings);
  } catch (error) {
    const errorDetails = getErrorDetails(error);

    console.error("PATCH /api/settings error:", {
      name: errorDetails.name,
      message: errorDetails.message,
      cause: errorDetails.cause,
    });

    return errorResponse(
      "Failed to update personalization settings",
      500,
      errorDetails,
    );
  }
};

export const DELETE = async () => {
  try {
    const auth = await getAuthenticatedUser();
    if ("error" in auth) {
      return auth.error;
    }

    const userId = auth.userId;

    await connectToMongoDB();

    const deletedSettings = await Personalization.findOneAndDelete({
      userId,
    });

    if (!deletedSettings) {
      return errorResponse("Personalization settings not found", 404, {
        name: "SettingsNotFoundError",
        message: "No personalization settings were found for this user.",
        cause: undefined,
      });
    }

    return successResponse(
      "Personalization settings deleted successfully",
      200,
      deletedSettings,
    );
  } catch (error) {
    const errorDetails = getErrorDetails(error);

    console.error("DELETE /api/settings error:", {
      name: errorDetails.name,
      message: errorDetails.message,
      cause: errorDetails.cause,
    });

    return errorResponse(
      "Failed to delete personalization settings",
      500,
      errorDetails,
    );
  }
};
