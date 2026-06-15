import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { MessageCircle, Send, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "where's my order?",
  "i'd like a custom piece",
  "how do i wash it?",
  "what's your return policy?",
];

const transport = new DefaultChatTransport({ api: "/api/chat" });

export function CareChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport,
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value || isLoading) return;
    sendMessage({ text: value });
    setInput("");
  };

  return (
    <>
      {/* Floating launcher */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat with the studio"}
        className={cn(
          "fixed bottom-5 right-5 z-[70] grid h-14 w-14 place-items-center rounded-full bg-foreground text-background shadow-lg transition-all duration-300 hover:scale-105 hover:bg-bloom sm:bottom-7 sm:right-7",
          open && "rotate-90",
        )}
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" strokeWidth={1.6} />}
      </button>

      {/* Panel */}
      <div
        className={cn(
          "fixed bottom-24 right-3 z-[69] flex w-[min(380px,calc(100vw-1.5rem))] origin-bottom-right flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-2xl transition-all duration-300 sm:bottom-28 sm:right-7",
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0",
        )}
        style={{ height: "min(560px, calc(100vh - 8rem))" }}
        role="dialog"
        aria-label="Studio chat"
        aria-hidden={!open}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border bg-cream/60 px-4 py-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-bloom/15 text-bloom">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-base italic">the studio</p>
            <p className="truncate text-xs text-muted-foreground">
              replies in seconds · custom orders + tracking
            </p>
          </div>
        </div>

        {/* Transcript */}
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.length === 0 && (
            <div className="space-y-3">
              <div className="rounded-2xl bg-secondary/60 px-4 py-3 text-sm leading-relaxed text-foreground">
                hi! i can help with order tracking, custom requests, washing, sizing and returns.
                what's on your mind?
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-foreground/80 transition-colors hover:border-bloom hover:text-bloom"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => {
            const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
            const isUser = m.role === "user";
            return (
              <div key={m.id} className={cn("flex", isUser ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                    isUser ? "bg-foreground text-background" : "bg-secondary/60 text-foreground",
                  )}
                >
                  {text || (
                    <span className="inline-flex gap-1">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current opacity-60" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current opacity-60 [animation-delay:120ms]" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current opacity-60 [animation-delay:240ms]" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {error && (
            <div className="rounded-2xl bg-rose/30 px-4 py-2.5 text-xs text-foreground">
              something snagged: {error.message}. try again in a moment.
            </div>
          )}
        </div>

        {/* Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="border-t border-border bg-background p-3"
        >
          <div className="flex items-end gap-2 rounded-2xl border border-border bg-background px-3 py-2 focus-within:border-bloom">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              placeholder="ask the studio…"
              className="max-h-32 flex-1 resize-none bg-transparent text-sm leading-relaxed outline-none placeholder:text-muted-foreground"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-foreground text-background transition-colors hover:bg-bloom disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="mt-1.5 px-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            powered by lovable AI · tracking API connecting soon
          </p>
        </form>
      </div>
    </>
  );
}
