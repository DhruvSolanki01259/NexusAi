import { errorResponse, successResponse } from "@/lib/api/apiResponse";
import { getErrorDetails } from "@/lib/api/errorHandler";
import { getAuthenticatedUser } from "@/lib/api/getAuthenticatedUser";
import { connectToMongoDB } from "@/lib/database/mongodb.database";
import Personalization from "@/lib/models/personalization.model";

export const POST = async () => {
  try {
    const auth = await getAuthenticatedUser();
    if ("error" in auth) {
      return auth.error;
    }

    const userId = auth.userId;

    await connectToMongoDB();

    const existingSettings = await Personalization.findOne({ userId });
    if (existingSettings) {
      return errorResponse("Personalization settings already exist", 409, {
        name: "ConflictError",
        message: "Personalization settings already exist for this user.",
        cause: undefined,
      });
    }

    const settings = await Personalization.create({
      userId,
    });

    return successResponse(
      "Personalization settings created successfully",
      201,
      settings,
    );
  } catch (error) {
    const { name, message, cause } = getErrorDetails(error);

    console.error("POST /api/personalization error:", {
      name,
      message,
      cause,
    });

    return errorResponse("Failed to create personalization settings", 500, {
      name,
      message,
      cause,
    });
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
