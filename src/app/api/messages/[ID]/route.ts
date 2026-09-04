import { errorResponse, successResponse } from "@/lib/api/apiResponse";
import { getErrorDetails } from "@/lib/api/errorHandler";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const data = await request.json();

    return successResponse("GET /Messages success", 200, data);
  } catch (error) {
    const { name, message, cause } = getErrorDetails(error);

    console.error("GET /Messages Error:", { name, message, cause });

    return errorResponse("Failed to get messages", 500, {
      name,
      message,
      cause,
    });
  }
};

export const DELETE = async (request: NextRequest) => {
  try {
    const data = await request.json();

    return successResponse("DELETE /Messages success", 200, data);
  } catch (error) {
    const { name, message, cause } = getErrorDetails(error);

    console.error("DELETE /Messages Error:", { name, message, cause });

    return errorResponse("Failed to delete messages", 500, {
      name,
      message,
      cause,
    });
  }
};
