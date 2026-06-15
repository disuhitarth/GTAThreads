/**
 * Error reporting bridge. Sends errors to Sentry when configured,
 * falls back to console in development.
 */

export function reportLovableError(error: Error, context?: Record<string, unknown>) {
  const dsn = typeof process !== "undefined" ? process.env.SENTRY_DSN : undefined;

  if (dsn) {
    try {
      const body = JSON.stringify({
        event: {
          message: error.message,
          stack: error.stack,
          culprit: "react",
          tags: { ...context },
          level: "error",
          platform: "javascript",
          timestamp: new Date().toISOString(),
          exception: {
            values: [
              {
                type: error.name,
                value: error.message,
                stacktrace: error.stack ? { frames: parseStack(error.stack) } : undefined,
              },
            ],
          },
        },
      });

      fetch(dsn, {
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
      }).catch(() => {});
    } catch {
      // silent — don't loop on error reporting errors
    }
  } else {
    console.error("[error-reporting]", error.message, context);
  }
}

function parseStack(stack: string) {
  return stack
    .split("\n")
    .slice(1)
    .map((line) => {
      const match = line.match(/\s+at\s+(?:(.+?)\s+\()?(.+?)(?::(\d+))?(?::(\d+))?\)?$/);
      if (!match) return null;
      return {
        function: match[1] || "?",
        filename: match[2] || "?",
        lineno: match[3] ? parseInt(match[3], 10) : undefined,
        colno: match[4] ? parseInt(match[4], 10) : undefined,
      };
    })
    .filter(Boolean) as Array<{
    function: string;
    filename: string;
    lineno?: number;
    colno?: number;
  }>;
}
