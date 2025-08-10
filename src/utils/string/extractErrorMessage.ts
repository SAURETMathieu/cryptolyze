/**
 * Interface defining the return structure of the extractErrorMessage function
 */
export interface ErrorMessageResult {
  /** Main error message, cleaned from JSON objects */
  errorMessage: string;
  /** Error details extracted from the JSON object (optional) */
  errorDetails?: string;
}

/**
 * Extracts and formats error messages containing JSON objects
 *
 * This function analyzes an error message and attempts to extract JSON objects
 * it contains. It returns the cleaned main message and error details
 * extracted from the JSON object.
 *
 * @param message - The error message to analyze (string or object)
 * @returns An object containing the main message and error details
 *
 * @example
 * ```typescript
 * // Message with JSON object
 * const result = extractErrorMessage(
 *   "Error: {\"error\":{\"code\":400,\"message\":\"Service point no longer operational\"}}"
 * );
 * // Returns: { errorMessage: "Error:", errorDetails: { code: 400, message: "..." } }
 *
 * // Simple message
 * const result = extractErrorMessage("Connection error");
 * // Returns: { errorMessage: "Connection error" }
 *
 * // Error object
 * const result = extractErrorMessage({ code: 500, message: "Internal error" });
 * // Returns: { errorMessage: "Internal error", errorDetails: { code: 500, message: "..." } }
 * ```
 */
export function extractErrorMessage(message: any): ErrorMessageResult {
  if (typeof message === "string") {
    // Regex to capture JSON objects in the message
    // This regex finds patterns like { "key": "value" } or {key: "value"}
    const jsonPattern = /\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g;
    const jsonMatches = message.match(jsonPattern);

    if (jsonMatches && jsonMatches.length > 0) {
      let errorMessage = message;
      let errorDetails: string | undefined;

      jsonMatches.forEach((match) => {
        try {
          let jsonString = match;

          if (!jsonString.endsWith("}")) {
            // Look for the closing brace in the rest of the message
            const afterMatch = message.substring(
              message.indexOf(match) + match.length
            );
            const closingBraceIndex = afterMatch.indexOf("}");
            if (closingBraceIndex !== -1) {
              // Complete the JSON object with the closing brace
              jsonString =
                match + afterMatch.substring(0, closingBraceIndex + 1);
            }
          }

          const parsed = JSON.parse(jsonString);

          if (parsed.error) {
            // Structure: {"error": {...}}
            errorDetails = parsed.error;
          }

          // Clean the main message by removing the JSON object
          errorMessage = errorMessage.replace(match, "").trim();
        } catch {}
      });

      return { errorMessage, errorDetails };
    }

    // If no JSON object is found, return the original message
    return { errorMessage: message };
  }

  if (message && typeof message === "object") {
    return {
      // Try to extract the main message from the object
      errorMessage: message.message || message.error || String(message),
      // Try to extract details from the object
      errorDetails: message.details || message.description,
    };
  }

  // Fallback: convert message to string
  return { errorMessage: String(message) };
}
