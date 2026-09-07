import { loadEnv } from "@/ai_components/utils/loadEnv";
import { tool } from "langchain";
import z from "zod";

interface ExchangeRateApiResponse {
  result: "success" | "error";
  base_code?: string;
  target_code?: string;
  conversion_rate?: number;
  conversion_result?: number;
  time_last_update_unix?: number;
  time_last_update_utc?: string;
  time_next_update_unix?: number;
  time_next_update_utc?: string;
  "error-type"?: string;
}

export const CurrencyConverterTool = tool(
  async ({ amount, fromCurrency, toCurrency }) => {
    try {
      const apiKey = loadEnv.ExchangeRateApiKey;
      if (!apiKey) {
        throw new Error("EXCHANGE_RATE_API_KEY is not configured.");
      }

      const from = fromCurrency.toUpperCase();
      const to = toCurrency.toUpperCase();
      if (from === to) {
        return {
          success: true,
          amount,
          fromCurrency: from,
          toCurrency: to,
          exchangeRate: 1,
          convertedAmount: amount,
          lastUpdated: null,
          nextUpdate: null,
        };
      }

      const url = new URL(
        `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}/${amount}`,
      );

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      const data: ExchangeRateApiResponse = await response.json();
      if (!response.ok || data.result !== "success") {
        throw new Error(
          data["error-type"] ||
            `ExchangeRate-API request failed with status ${response.status}.`,
        );
      }

      if (
        data.conversion_rate === undefined ||
        data.conversion_result === undefined
      ) {
        throw new Error(
          "ExchangeRate-API returned an incomplete conversion response.",
        );
      }

      return {
        success: true,
        amount,
        fromCurrency: data.base_code ?? from,
        toCurrency: data.target_code ?? to,
        exchangeRate: data.conversion_rate,
        convertedAmount: data.conversion_result,
        lastUpdated: data.time_last_update_utc ?? null,
        nextUpdate: data.time_next_update_utc ?? null,
      };
    } catch (error) {
      console.error("[CURRENCY CONVERTER TOOL ERROR]:", error);

      return {
        success: false,
        amount,
        fromCurrency,
        toCurrency,
        message:
          error instanceof Error
            ? error.message
            : "Failed to convert currency.",
      };
    }
  },
  {
    name: "convert_currency",
    description:
      "Convert an amount from one currency to another using current exchange rates. Use this tool when the user asks to convert money, compare currency values, or calculate how much an amount in one currency is worth in another currency. Use ISO 4217 three-letter currency codes such as USD, EUR, GBP, INR, JPY, or AUD. The tool returns the exchange rate, converted amount, and rate update information.",
    schema: z.object({
      amount: z
        .number()
        .positive("Amount must be greater than zero.")
        .describe("The amount of money to convert."),
      fromCurrency: z
        .string()
        .length(3, "Currency code must contain exactly 3 characters.")
        .describe(
          "The ISO 4217 three-letter code of the currency being converted from, such as USD, EUR, or INR.",
        ),
      toCurrency: z
        .string()
        .length(3, "Currency code must contain exactly 3 characters.")
        .describe(
          "The ISO 4217 three-letter code of the currency being converted to, such as USD, EUR, or INR.",
        ),
    }),
  },
);
