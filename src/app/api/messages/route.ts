import { errorResponse, successResponse } from "@/lib/api/apiResponse";
import { getErrorDetails } from "@/lib/api/errorHandler";
import { getAuthenticatedUser } from "@/lib/api/getAuthenticatedUser";
import { connectToMongoDB } from "@/lib/database/mongodb.database";
import Message from "@/lib/models/message.model";

export const DELETE = async () => {
  try {
    const auth = await getAuthenticatedUser();
    if ("error" in auth) {
      return auth.error;
    }

    const userId = auth.userId;

    await connectToMongoDB();

    const result = await Message.deleteMany({
      userId,
    });

    return successResponse("All messages deleted successfully", 200, {
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    const { name, message, cause } = getErrorDetails(error);

    console.error("DELETE /messages error:", {
      name,
      message,
      cause,
    });

    return errorResponse("Failed to delete all messages", 500, {
      name,
      message,
      cause,
    });
  }
};
