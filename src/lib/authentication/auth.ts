import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { loadEnv } from "@/utils/loadEnv";
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";

const {
  MongoUrl,
  BetterAuthSecret,
  BetterAuthUrl,
  GoogleClientId,
  GoogleClientSecret,
} = loadEnv;

if (!MongoUrl) {
  throw new Error("[BETTER AUTH CONFIGURATION ERROR]: MONGODB_URI is missing.");
}
if (!BetterAuthSecret) {
  throw new Error(
    "[BETTER AUTH CONFIGURATION ERROR]: BETTER_AUTH_SECRET is missing.",
  );
}
if (BetterAuthSecret.length < 32) {
  throw new Error(
    "[BETTER AUTH CONFIGURATION ERROR]: BETTER_AUTH_SECRET must be at least 32 characters long.",
  );
}
if (!BetterAuthUrl) {
  throw new Error(
    "[BETTER AUTH CONFIGURATION ERROR]: BETTER_AUTH_URL is missing.",
  );
}
if (!GoogleClientId) {
  throw new Error(
    "[BETTER AUTH CONFIGURATION ERROR]: GOOGLE_CLIENT_ID is missing.",
  );
}
if (!GoogleClientSecret) {
  throw new Error(
    "[BETTER AUTH CONFIGURATION ERROR]: GOOGLE_CLIENT_SECRET is missing.",
  );
}

const client = new MongoClient(MongoUrl);
const db = client.db("NexusAI-Users");

export const auth = betterAuth({
  secret: BetterAuthSecret,
  baseURL: BetterAuthUrl,

  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: GoogleClientId,
      clientSecret: GoogleClientSecret,
    },
  },
});
