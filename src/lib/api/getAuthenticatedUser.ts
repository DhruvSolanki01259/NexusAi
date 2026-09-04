import { getSession } from "../authentication/session";
import { errorResponse } from "./apiResponse";

export const getAuthenticatedUser = async () => {
  const session = await getSession();
  if (!session) {
    return {
      error: errorResponse("Authentication Required", 401, {
        name: "UnauthorizedError",
        message: "No active session found.",
        cause: undefined,
      }),
    };
  }

  const userId = session?.user.id;
  if (!userId || typeof userId !== "string") {
    return {
      error: errorResponse("Invalid Session", 401, {
        name: "InvalidSessionError",
        message: "The authenticated session does not contain a valid user ID.",
        cause: undefined,
      }),
    };
  }

  return { userId };
};
