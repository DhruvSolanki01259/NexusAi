// import { loadEnv } from "@/ai_components/utils/loadEnv";
// import { tool } from "langchain";
// import z from "zod";

// interface TimeZoneDBResponse {
//   status: "OK" | "FAILED";
//   message: string;
//   countryCode?: string;
//   countryName?: string;
//   zoneName?: string;
//   abbreviation?: string;
//   gmtOffset?: number;
//   dst?: string;
//   timestamp?: number;
//   formatted?: string;
// }

// export const WorldTimeTool = tool(
//   async ({ timezone }) => {
//     try {
//       const apiKey = loadEnv.TimeZoneApiKey;
//       if (!apiKey) {
//         throw new Error("TIMEZONE_DB_API_KEY is not configured.");
//       }

//       const url = new URL("https://api.timezonedb.com/v2.1/get-time-zone");
//       url.searchParams.set("key", apiKey);
//       url.searchParams.set("format", "json");
//       url.searchParams.set("by", "zone");
//       url.searchParams.set("zone", timezone);

//       const response = await fetch(url.toString());
//       if (!response.ok) {
//         throw new Error(
//           `TimeZoneDB request failed with status ${response.status}.`,
//         );
//       }

//       const data: TimeZoneDBResponse = await response.json();
//       if (data.status !== "OK") {
//         return {
//           success: false,
//           timezone,
//           message: data.message || "Unable to retrieve time information.",
//         };
//       }

//       return {
//         success: true,
//         timezone: data.zoneName,
//         countryCode: data.countryCode,
//         countryName: data.countryName,
//         abbreviation: data.abbreviation,
//         utcOffsetSeconds: data.gmtOffset,
//         utcOffset: formatUtcOffset(data.gmtOffset),
//         daylightSavingTime: data.dst === "1",
//         timestamp: data.timestamp,
//         localTime: data.formatted,
//       };
//     } catch (error) {
//       console.error("[WORLD TIME TOOL ERROR]:", error);

//       return {
//         success: false,
//         timezone,
//         message:
//           error instanceof Error
//             ? error.message
//             : "Failed to retrieve world time.",
//       };
//     }
//   },
//   {
//     name: "get_world_time",
//     description:
//       "Get the current local time, date, timezone, UTC offset, and daylight saving time information for a location. Use this tool when the user asks what time it is in another city or country, asks about a timezone, or wants to know the current time in a specific timezone. The timezone must be provided as an IANA timezone name such as Asia/Kolkata, Asia/Tokyo, Europe/London, or America/New_York.",
//     schema: z.object({
//       timezone: z
//         .string()
//         .min(1)
//         .describe(
//           "The IANA timezone name for the requested location, such as Asia/Kolkata for Mumbai, Asia/Tokyo for Tokyo, Europe/London for London, or America/New_York for New York.",
//         ),
//     }),
//   },
// );

// function formatUtcOffset(offsetSeconds?: number): string | null {
//   if (offsetSeconds === undefined) {
//     return null;
//   }

//   const sign = offsetSeconds >= 0 ? "+" : "-";
//   const absoluteSeconds = Math.abs(offsetSeconds);

//   const hours = Math.floor(absoluteSeconds / 3600);
//   const minutes = Math.floor((absoluteSeconds % 3600) / 60);

//   return `UTC${sign}${String(hours).padStart(2, "0")}:${String(
//     minutes,
//   ).padStart(2, "0")}`;
// }

import { tool } from "langchain";
import z from "zod";

interface TimeApiResponse {
  dateTime?: string;
  date?: string;
  time?: string;
  timeZone?: string;
  dayOfWeek?: string;
  dstActive?: boolean;
  dstStart?: string;
  dstEnd?: string;
  week?: number;
  standardUtcOffset?: string;
  dstUtcOffset?: string;
}

export const WorldTimeTool = tool(
  async ({ timezone }) => {
    try {
      const encodedTimezone = encodeURIComponent(timezone);
      const response = await fetch(
        `https://timeapi.io/api/Time/current/zone?timeZone=${encodedTimezone}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        },
      );

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `TimeAPI request failed with status ${response.status}: ${errorBody}`,
        );
      }

      const data: TimeApiResponse = await response.json();
      if (!data.dateTime) {
        throw new Error(
          "TimeAPI returned an invalid response without dateTime.",
        );
      }

      return {
        success: true,
        timezone: data.timeZone ?? timezone,
        dateTime: data.dateTime,
        date: data.date ?? null,
        time: data.time ?? null,
        dayOfWeek: data.dayOfWeek ?? null,
        daylightSavingTime: data.dstActive ?? false,
        standardUtcOffset: data.standardUtcOffset ?? null,
        daylightSavingUtcOffset: data.dstUtcOffset ?? null,
      };
    } catch (error) {
      console.error("[WORLD TIME TOOL ERROR]:", error);

      return {
        success: false,
        timezone,
        message:
          error instanceof Error
            ? error.message
            : "Failed to retrieve world time.",
      };
    }
  },
  {
    name: "get_world_time",
    description:
      "Get the current local date and time for a specific location using its IANA timezone name. Use this tool when the user asks what time it is in another city or country, asks for the current time in a timezone, or asks about daylight saving time. The timezone must be an IANA timezone such as Asia/Kolkata, Asia/Tokyo, Europe/London, or America/New_York. Convert a city or country into its appropriate IANA timezone before calling this tool.",
    schema: z.object({
      timezone: z
        .string()
        .min(1, "Timezone is required.")
        .describe(
          "An IANA timezone identifier such as Asia/Kolkata for Mumbai, Asia/Tokyo for Tokyo, Europe/London for London, or America/New_York for New York.",
        ),
    }),
  },
);
