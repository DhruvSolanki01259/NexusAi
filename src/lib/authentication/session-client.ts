"use client";

import { authClient } from "./auth-client";

export const getSessionClient = () => {
  const { data, error } = authClient.useSession();

  if (error || !data?.user) {
    return null;
  }

  return data.user;
};
