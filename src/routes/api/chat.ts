import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { CARE_SYSTEM_PROMPT } from "@/lib/care-chat-context";

type ChatRequestBody = { messages?: unknown };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env.GROQ_API_KEY;
        if (!key) {
          return new Response("Missing GROQ_API_KEY — get one free at https://console.groq.com", {
            status: 500,
          });
        }

        try {
          const gateway = createLovableAiGatewayProvider(key);
          const model = gateway("llama-3.3-70b-versatile");
          const result = streamText({
            model,
            system: CARE_SYSTEM_PROMPT,
            messages: await convertToModelMessages(messages as UIMessage[]),
          });

          return result.toUIMessageStreamResponse({
            originalMessages: messages as UIMessage[],
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : "Unknown error";
          return new Response(`Chat error: ${message}`, { status: 500 });
        }
      },
    },
  },
});
