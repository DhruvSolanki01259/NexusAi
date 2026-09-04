import { errorResponse, successResponse } from "@/lib/api/apiResponse";
import { getErrorDetails } from "@/lib/api/errorHandler";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const data = await request.json();

    return successResponse("GET /settings success", 200, data);
  } catch (error) {
    const errorDetails = getErrorDetails(error);

    console.error("Settings /GET Error: ", {
      name: errorDetails.name,
      message: errorDetails.message,
      cause: errorDetails.cause,
    });

    return errorResponse("Failed to fetch settings", 500, errorDetails);
  }
};

export const PATCH = async (request: NextRequest) => {
  try {
    const data = await request.json();

    return successResponse("Settings /PATCH successfully", 201, data);
  } catch (error) {
    const errorDetails = getErrorDetails(error);

    console.error("Settings /PACTH Error: ", {
      name: errorDetails.name,
      message: errorDetails.message,
      cause: errorDetails.cause,
    });

    return errorResponse("Failed to update settings", 500, errorDetails);
  }
};

export const DELETE = async (request: NextRequest) => {
  try {
    const data = await request.json();

    return successResponse("Settings /DELETE successfully", 201, data);
  } catch (error) {
    const errorDetails = getErrorDetails(error);

    console.error("Settings /DELETE Error: ", {
      name: errorDetails.name,
      message: errorDetails.message,
      cause: errorDetails.cause,
    });

    return errorResponse("Failed to delete settings", 500, errorDetails);
  }
};
