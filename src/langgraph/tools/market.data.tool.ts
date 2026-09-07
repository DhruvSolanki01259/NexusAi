import { loadEnv } from "@/ai_components/utils/loadEnv";
import { tool } from "langchain";
import z from "zod";

interface AlphaVantageGlobalQuoteResponse {
  "Global Quote"?: {
    "01. symbol"?: string;
    "02. open"?: string;
    "03. high"?: string;
    "04. low"?: string;
    "05. price"?: string;
    "06. volume"?: string;
    "07. latest trading day"?: string;
    "08. previous close"?: string;
    "09. change"?: string;
    "10. change percent"?: string;
  };
  Information?: string;
  Note?: string;
  "Error Message"?: string;
}

export const MarketDataTool = tool(
  async ({ symbol }) => {
    try {
      const apiKey = loadEnv.AlphaVantageApiKey;
      if (!apiKey) {
        throw new Error("ALPHA_VANTAGE_API_KEY is not configured.");
      }

      const normalizedSymbol = symbol.trim().toUpperCase();

      const url = new URL("https://www.alphavantage.co/query");
      url.searchParams.set("function", "GLOBAL_QUOTE");
      url.searchParams.set("symbol", normalizedSymbol);
      url.searchParams.set("apikey", apiKey);

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      const data: AlphaVantageGlobalQuoteResponse = await response.json();
      if (!response.ok) {
        throw new Error(
          `Alpha Vantage request failed with status ${response.status}.`,
        );
      }

      if (data["Error Message"]) {
        throw new Error(data["Error Message"]);
      }

      if (data.Note) {
        throw new Error(`Alpha Vantage API limit reached: ${data.Note}`);
      }

      if (data.Information) {
        throw new Error(data.Information);
      }

      const quote = data["Global Quote"];
      if (!quote || !quote["05. price"]) {
        throw new Error(
          `No market data was found for symbol "${normalizedSymbol}".`,
        );
      }

      const price = parseNumber(quote["05. price"]);
      const change = parseNumber(quote["09. change"]);
      const changePercent = parsePercent(quote["10. change percent"]);

      return {
        success: true,
        symbol: quote["01. symbol"] ?? normalizedSymbol,
        marketData: {
          price,
          open: parseNumber(quote["02. open"]),
          high: parseNumber(quote["03. high"]),
          low: parseNumber(quote["04. low"]),
          previousClose: parseNumber(quote["08. previous close"]),
          change,
          changePercent,
          volume: parseNumber(quote["06. volume"]),
          latestTradingDay: quote["07. latest trading day"] ?? null,
        },
        dataSource: "Alpha Vantage",
      };
    } catch (error) {
      console.error("[MARKET DATA TOOL ERROR]:", error);

      return {
        success: false,
        symbol,
        message:
          error instanceof Error
            ? error.message
            : "Failed to retrieve market data.",
      };
    }
  },
  {
    name: "get_market_data",
    description:
      "Get market quote data for a publicly traded stock or ETF using its ticker symbol. Use this tool when the user asks about a stock's current/latest price, daily change, percentage change, trading volume, open, high, low, previous close, or latest trading day. Use standard ticker symbols such as AAPL, MSFT, TSLA, AMZN, NVDA, RELIANCE.BSE, or TCS.BSE when supported. The returned quote may be end-of-day or delayed depending on the Alpha Vantage API entitlement; do not describe it as real-time unless the returned data explicitly supports real-time access.",
    schema: z.object({
      symbol: z
        .string()
        .min(1, "Stock or ETF symbol is required.")
        .max(20, "Symbol is too long.")
        .describe(
          "The ticker symbol of the stock or ETF, such as AAPL, MSFT, TSLA, NVDA, or RELIANCE.BSE.",
        ),
    }),
  },
);

function parseNumber(value?: string): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

function parsePercent(value?: string): number | null {
  if (!value) {
    return null;
  }

  const normalized = value.replace("%", "").trim();
  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : null;
}
