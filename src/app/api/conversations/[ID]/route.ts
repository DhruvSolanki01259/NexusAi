import { errorResponse, successResponse } from "@/lib/api/apiResponse";
import { getErrorDetails } from "@/lib/api/errorHandler";
import { getAuthenticatedUser } from "@/lib/api/getAuthenticatedUser";
import { connectToMongoDB } from "@/lib/database/mongodb.database";
import { Conversation } from "@/lib/models/conversation.model";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const auth = await getAuthenticatedUser();

    if ("error" in auth) {
      return auth.error;
    }

    const userId = auth.userId;

    const conversationId = request.nextUrl.pathname.split("/").at(-1);
    if (!conversationId) {
      return errorResponse("Conversation ID is required", 400, {
        name: "ValidationError",
        message: "No conversation ID was provided in the URL.",
        cause: undefined,
      });
    }
    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return errorResponse("Invalid conversation ID", 400, {
        name: "ValidationError",
        message:
          "The provided conversation ID is not a valid MongoDB ObjectId.",
        cause: undefined,
      });
    }

    await connectToMongoDB();

    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId,
    }).lean();
    if (!conversation) {
      return errorResponse("Conversation not found", 404, {
        name: "ConversationNotFoundError",
        message:
          "The conversation does not exist or does not belong to the authenticated user.",
        cause: undefined,
      });
    }

    return successResponse(
      "Conversation fetched successfully",
      200,
      conversation,
    );
  } catch (error) {
    const { name, message, cause } = getErrorDetails(error);

    console.error("GET /api/conversations/[conversationId] error:", {
      name,
      message,
      cause,
    });

    return errorResponse("Failed to fetch conversation", 500, {
      name,
      message,
      cause,
    });
  }
};

export const PATCH = async (request: NextRequest) => {
  try {
    const auth = await getAuthenticatedUser();

    if ("error" in auth) {
      return auth.error;
    }

    const userId = auth.userId;

    const conversationId = request.nextUrl.pathname.split("/").at(-1);
    if (!conversationId) {
      return errorResponse("Conversation ID is required", 400, {
        name: "ValidationError",
        message: "No conversation ID was provided in the URL.",
        cause: undefined,
      });
    }
    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return errorResponse("Invalid conversation ID", 400, {
        name: "ValidationError",
        message:
          "The provided conversation ID is not a valid MongoDB ObjectId.",
        cause: undefined,
      });
    }

    const { title } = await request.json();
    if (!title || typeof title !== "string" || !title.trim()) {
      return errorResponse("Invalid title", 400, {
        name: "ValidationError",
        message: "A valid conversation title is required.",
        cause: undefined,
      });
    }

    await connectToMongoDB();

    const updatedConversation = await Conversation.findOneAndUpdate(
      {
        _id: conversationId,
        userId,
      },
      {
        $set: {
          title: title.trim(),
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedConversation) {
      return errorResponse("Conversation not found", 404, {
        name: "ConversationNotFoundError",
        message:
          "The conversation does not exist or does not belong to the authenticated user.",
        cause: undefined,
      });
    }

    return successResponse(
      "Conversation updated successfully",
      200,
      updatedConversation,
    );
  } catch (error) {
    const { name, message, cause } = getErrorDetails(error);

    console.error("PATCH /api/conversations/[conversationId] error:", {
      name,
      message,
      cause,
    });

    return errorResponse("Failed to update conversation", 500, {
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

    const conversationId = request.nextUrl.pathname.split("/").at(-1);
    if (!conversationId) {
      return errorResponse("Conversation ID is required", 400, {
        name: "ValidationError",
        message: "No conversation ID was provided in the URL.",
        cause: undefined,
      });
    }
    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return errorResponse("Invalid conversation ID", 400, {
        name: "ValidationError",
        message:
          "The provided conversation ID is not a valid MongoDB ObjectId.",
        cause: undefined,
      });
    }

    await connectToMongoDB();

    const deletedConversation = await Conversation.findOneAndDelete({
      _id: conversationId,
      userId,
    });
    if (!deletedConversation) {
      return errorResponse("Conversation not found", 404, {
        name: "ConversationNotFoundError",
        message:
          "The conversation does not exist or does not belong to the authenticated user.",
        cause: undefined,
      });
    }

    return successResponse(
      "Conversation deleted successfully",
      200,
      deletedConversation,
    );
  } catch (error) {
    const { name, message, cause } = getErrorDetails(error);

    console.error("DELETE /api/conversations/[conversationId] error:", {
      name,
      message,
      cause,
    });

    return errorResponse("Failed to delete conversation", 500, {
      name,
      message,
      cause,
    });
  }
};
