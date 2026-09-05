export const createUserSettings = async (userId: string): Promise<boolean> => {
  if (!userId) {
    return false;
  }

  try {
    const response = await fetch("/api/settings", {
      method: "POST",
    });

    return response.ok;
  } catch (error) {
    console.error("[CREATE SETTINGS ERROR]:", error);
    return false;
  }
};
