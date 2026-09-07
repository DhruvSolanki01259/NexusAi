import { tool } from "langchain";
import { evaluate } from "mathjs";
import z from "zod";

export const CalculatorTool = tool(
  async ({ expression }) => {
    try {
      const normalizedExpression = normalizeExpression(expression);

      const result = evaluate(normalizedExpression);
      if (result === undefined || result === null) {
        throw new Error("The expression did not produce a result.");
      }

      const formattedResult = formatResult(result);

      return {
        success: true,
        expression,
        normalizedExpression,
        result: formattedResult,
      };
    } catch (error) {
      console.error("[CALCULATOR TOOL ERROR]:", error);

      return {
        success: false,
        expression,
        message:
          error instanceof Error
            ? error.message
            : "Failed to calculate the expression.",
      };
    }
  },
  {
    name: "calculator",
    description:
      "Evaluate mathematical expressions accurately. Use this tool for arithmetic, algebraic expressions, percentages, powers, roots, logarithms, trigonometry, factorials, combinations, permutations, and other mathematical calculations. Always use this tool instead of calculating complex or precision-sensitive mathematics yourself. The expression should contain only mathematical operations and functions, not programming code. Examples: '25 * 4', '(1500 * 18) / 100', 'sqrt(144)', '2^10', 'sin(pi / 2)', 'log(100)', 'factorial(5)', '10 choose 3'.",
    schema: z.object({
      expression: z
        .string()
        .min(1, "Mathematical expression is required.")
        .max(1000, "Expression is too long.")
        .describe(
          "A mathematical expression to evaluate, such as '25 * 4', '(100 + 50) / 3', 'sqrt(144)', '2^10', or 'sin(pi / 2)'.",
        ),
    }),
  },
);

function normalizeExpression(expression: string): string {
  let normalized = expression.trim();

  normalized = normalized
    .replace(/x/g, "*")
    .replace(/÷/g, "/")
    .replace(/-/g, "-")
    .replace(/π/g, "pi");
  normalized = normalized.replace(/(\d+(?:\.\d+)?)\s*%/g, "($1 / 100)");
  normalized = normalized.replace(/\^/g, "**");
  normalized = normalized.replace(
    /\b(\d+(?:\.\d+)?)\s+choose\s+(\d+(?:\.\d+)?)\b/gi,
    "combinations($1, $2)",
  );
  normalized = normalized.replace(
    /\b(\d+(?:\.\d+)?)\s+permute\s+(\d+(?:\.\d+)?)\b/gi,
    "permutations($1, $2)",
  );

  return normalized;
}

function formatResult(result: unknown): unknown {
  if (typeof result === "number") {
    if (!Number.isFinite(result)) {
      throw new Error("The calculation produced a non-finite result.");
    }

    return Number(result.toPrecision(15));
  }

  if (typeof result === "bigint") {
    return result.toString();
  }

  if (typeof result === "boolean" || typeof result === "string") {
    return result;
  }

  if (Array.isArray(result)) {
    return result;
  }

  if (result && typeof result === "object") {
    return result;
  }

  return String(result);
}
