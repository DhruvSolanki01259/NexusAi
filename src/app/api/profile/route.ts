import { errorResponse, successResponse } from "@/lib/api/apiResponse";
import { getAuthenticatedUser } from "@/lib/api/getAuthenticatedUser";
import { getErrorDetails } from "@/lib/api/errorHandler";

import { Conversation } from "@/lib/models/conversation.model";
import Personalization from "@/lib/models/personalization.model";

export const GET = async () => {
  try {
    const auth = await getAuthenticatedUser();
    if ("error" in auth) {
      return auth.error;
    }

    const userId = auth.userId;

    const conversations = await Conversation.find({ userId })
      .select("_id")
      .lean();
    const totalConversations = conversations.length;

    const personalization = await Personalization.findOne({ userId })
      .select("enabled")
      .lean();
    const personalizationEnabled = personalization?.enabled ?? false;

    return successResponse("User statistics fetched successfully", 200, {
      total_conversations: totalConversations,
      personalization: personalizationEnabled,
    });
  } catch (error) {
    const { name, message, cause } = getErrorDetails(error);

    console.error("GET /api/profile error:", {
      name,
      message,
      cause,
    });

    return errorResponse("Failed to fetch user statistics", 500, {
      name,
      message,
      cause,
    });
  }
};
