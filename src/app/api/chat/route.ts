import { errorResponse, successResponse } from "@/lib/api/apiResponse";
import { getErrorDetails } from "@/lib/api/errorHandler";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const data = await request.json();

    return successResponse("Workflow invoked successfully", 201, data);
  } catch (error) {
    const { name, message, cause } = getErrorDetails(error);

    console.error("Chat /POST Error: ", {
      name,
      message,
      cause,
    });

    return errorResponse("Failed to invoke workflow", 500, {
      name,
      message,
      cause,
    });
  }
};
