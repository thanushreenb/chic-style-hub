import { useState, useRef, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { chatWithAI } from "@/lib/chat.functions";

type Msg = { role: "user" | "assistant"; content: string };

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! 👋 I'm your shopping assistant. Ask me about products, sizes, styles or anything else!" },
  ]);
  const chat = useServerFn(chatWithAI);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await chat({ data: { messages: next } });
      if (res.error) {
        setMessages((m) => [...m, { role: "assistant", content: `⚠️ ${res.error}` }]);
      } else {
        setMessages((m) => [...m, { role: "assistant", content: res.reply || "..." }]);
      }
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "⚠️ Could not reach the assistant." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-50 bg-primary text-primary-foreground rounded-full w-14 h-14 shadow-lg flex items-center justify-center hover:scale-105 transition"
        aria-label="Chat with us"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-[92vw] max-w-sm h-[70vh] max-h-[560px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-pink-500 text-white px-4 py-3">
            <div className="font-bold">Style Assistant</div>
            <div className="text-xs opacity-90">Ask me anything about My Store</div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-background">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted text-foreground rounded-bl-sm"
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-bl-sm px-3 py-2 text-sm flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" /> Thinking...
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="border-t border-border p-2 flex gap-2 bg-card"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 bg-muted/60 rounded-md px-3 py-2 text-sm outline-none focus:bg-card border border-transparent focus:border-primary/40"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-primary text-primary-foreground rounded-md px-3 disabled:opacity-50 hover:opacity-90 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
