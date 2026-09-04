import { errorResponse, successResponse } from "@/lib/api/apiResponse";
import { getAuthenticatedUser } from "@/lib/api/getAuthenticatedUser";
import { connectToMongoDB } from "@/lib/database/mongodb.database";
import { Conversation } from "@/lib/models/conversation.model";
import { getErrorDetails } from "@/lib/api/errorHandler";

export const GET = async () => {
  try {
    const auth = await getAuthenticatedUser();

    if ("error" in auth) {
      return auth.error;
    }

    await connectToMongoDB();

    const conversations = await Conversation.find({
      userId: auth.userId,
    })
      .sort({ createdAt: -1 })
      .lean();

    return successResponse(
      "Conversations fetched successfully",
      200,
      conversations,
    );
  } catch (error) {
    const { name, message, cause } = getErrorDetails(error);

    console.error("GET /api/conversations error:", {
      name,
      message,
      cause,
    });

    return errorResponse("Failed to fetch conversations", 500, {
      name,
      message,
      cause,
    });
  }
};

export const POST = async () => {
  try {
    const auth = await getAuthenticatedUser();

    if ("error" in auth) {
      return auth.error;
    }

    await connectToMongoDB();

    const conversation = await Conversation.create({
      userId: auth.userId,
    });

    return successResponse(
      "Conversation created successfully",
      201,
      conversation,
    );
  } catch (error) {
    const { name, message, cause } = getErrorDetails(error);

    console.error("POST /api/conversations error:", {
      name,
      message,
      cause,
    });

    return errorResponse("Failed to create conversation", 500, {
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

    await connectToMongoDB();

    const result = await Conversation.deleteMany({
      userId: auth.userId,
    });

    return successResponse("All conversations deleted successfully", 200, {
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    const { name, message, cause } = getErrorDetails(error);

    console.error("DELETE /api/conversations error:", {
      name,
      message,
      cause,
    });

    return errorResponse("Failed to delete conversations", 500, {
      name,
      message,
      cause,
    });
  }
};
