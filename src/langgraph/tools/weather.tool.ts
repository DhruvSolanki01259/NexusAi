import { loadEnv } from "@/ai_components/utils/loadEnv";
import { tool } from "langchain";
import z from "zod";

interface WeatherApiResponse {
  location?: {
    name?: string;
    region?: string;
    country?: string;
    lat?: number;
    lon?: number;
    tz_id?: string;
    localtime?: string;
  };
  current?: {
    last_updated?: string;
    temp_c?: number;
    temp_f?: number;
    is_day?: number;
    condition?: {
      text?: string;
      icon?: string;
      code?: number;
    };
    wind_mph?: number;
    wind_kph?: number;
    wind_degree?: number;
    wind_dir?: string;
    pressure_mb?: number;
    pressure_in?: number;
    precip_mm?: number;
    precip_in?: number;
    humidity?: number;
    cloud?: number;
    feelslike_c?: number;
    feelslike_f?: number;
    vis_km?: number;
    vis_miles?: number;
    uv?: number;
    gust_mph?: number;
    gust_kph?: number;
  };
  error?: {
    code?: number;
    message?: string;
  };
}

export const WeatherTool = tool(
  async ({ location }) => {
    try {
      const apiKey = loadEnv.WeatherApiKey;

      if (!apiKey) {
        throw new Error("WEATHER_API_KEY is not configured.");
      }

      const url = new URL("https://api.weatherapi.com/v1/current.json");

      url.searchParams.set("key", apiKey);
      url.searchParams.set("q", location);

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      const data: WeatherApiResponse = await response.json();
      if (!response.ok) {
        throw new Error(
          data.error?.message ||
            `WeatherAPI request failed with status ${response.status}.`,
        );
      }

      if (!data.location || !data.current) {
        throw new Error("WeatherAPI returned an invalid response.");
      }

      return {
        success: true,
        location: {
          name: data.location.name ?? null,
          region: data.location.region ?? null,
          country: data.location.country ?? null,
          latitude: data.location.lat ?? null,
          longitude: data.location.lon ?? null,
          timezone: data.location.tz_id ?? null,
          localTime: data.location.localtime ?? null,
        },
        weather: {
          lastUpdated: data.current.last_updated ?? null,
          temperature: {
            celsius: data.current.temp_c ?? null,
            fahrenheit: data.current.temp_f ?? null,
          },
          feelsLike: {
            celsius: data.current.feelslike_c ?? null,
            fahrenheit: data.current.feelslike_f ?? null,
          },
          condition: data.current.condition?.text ?? null,
          conditionIcon: data.current.condition?.icon
            ? `https:${data.current.condition.icon}`
            : null,
          isDay: data.current.is_day === 1,
          humidity: data.current.humidity ?? null,
          cloudCover: data.current.cloud ?? null,
          precipitation: {
            millimeters: data.current.precip_mm ?? null,
            inches: data.current.precip_in ?? null,
          },
          wind: {
            kilometersPerHour: data.current.wind_kph ?? null,
            milesPerHour: data.current.wind_mph ?? null,
            direction: data.current.wind_dir ?? null,
            degrees: data.current.wind_degree ?? null,
          },
          pressure: {
            millibars: data.current.pressure_mb ?? null,
            inches: data.current.pressure_in ?? null,
          },
          visibility: {
            kilometers: data.current.vis_km ?? null,
            miles: data.current.vis_miles ?? null,
          },
          uvIndex: data.current.uv ?? null,
          windGust: {
            kilometersPerHour: data.current.gust_kph ?? null,
            milesPerHour: data.current.gust_mph ?? null,
          },
        },
      };
    } catch (error) {
      console.error("[WEATHER TOOL ERROR]:", error);

      return {
        success: false,
        location,
        message:
          error instanceof Error
            ? error.message
            : "Failed to retrieve weather information.",
      };
    }
  },

  {
    name: "get_weather",
    description:
      "Get the current weather conditions for a specific location. Use this tool when the user asks about the current weather, temperature, conditions, humidity, wind, precipitation, UV index, visibility, or how the weather currently feels in a city or location. The location can be a city name, region, country, postal code, or latitude and longitude. Do not use this tool for weather forecasts unless a forecast-specific tool is available.",
    schema: z.object({
      location: z
        .string()
        .min(1, "Location is required.")
        .describe(
          "The location to retrieve current weather for, such as Mumbai, London, Tokyo, New York, or 19.0760,72.8777.",
        ),
    }),
  },
);
