import { errorResponse, successResponse } from "@/lib/api/apiResponse";
import { getErrorDetails } from "@/lib/api/errorHandler";
import { getAuthenticatedUser } from "@/lib/api/getAuthenticatedUser";
import { connectToMongoDB } from "@/lib/database/mongodb.database";
import Message from "@/lib/models/message.model";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const auth = await getAuthenticatedUser();
    if ("error" in auth) {
      return auth.error;
    }

    const userId = auth.userId;

    const { pathname } = request.nextUrl;
    const conversationId = pathname.split("/").at(-1);

    if (!conversationId) {
      return errorResponse("Invalid request", 400, {
        name: "ValidationError",
        message: "Conversation ID is required.",
        cause: undefined,
      });
    }

    await connectToMongoDB();

    const messages = await Message.find({
      userId,
      conversationId,
    }).sort({ createdAt: 1 });

    return successResponse("Messages fetched successfully", 200, messages);
  } catch (error) {
    const { name, message, cause } = getErrorDetails(error);

    console.error("GET /messages error:", {
      name,
      message,
      cause,
    });

    return errorResponse("Failed to fetch messages", 500, {
      name,
      message,
      cause,
    });
  }
};

export const DELETE = async (request: NextRequest) => {
  try {
    const auth = await getAuthenticatedUser();
    if ("error" in auth) {
      return auth.error;
    }

    const userId = auth.userId;

    const { pathname } = request.nextUrl;
    const conversationId = pathname.split("/").at(-1);

    if (!conversationId) {
      return errorResponse("Invalid request", 400, {
        name: "ValidationError",
        message: "Conversation ID is required.",
        cause: undefined,
      });
    }

    await connectToMongoDB();

    const result = await Message.deleteMany({
      userId,
      conversationId,
    });

    return successResponse("Messages deleted successfully", 200, {
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    const { name, message, cause } = getErrorDetails(error);

    console.error("DELETE /messages error:", {
      name,
      message,
      cause,
    });

    return errorResponse("Failed to delete messages", 500, {
      name,
      message,
      cause,
    });
  }
};
