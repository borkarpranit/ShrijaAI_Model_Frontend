import React, { useState, useRef } from "react";
import { Sparkles, Cpu, Copy, ThumbsUp, ThumbsDown, RefreshCw, Paperclip, Mic, Code, Send } from "lucide-react";
import { Message } from "../../types";
import { ThinkingDots, CodeBlock } from "../shared";

export const MessageCard = ({ msg }: { msg: Message }) => {
  const isAI = msg.role === "assistant";

  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith("```")) {
        const lines = part.slice(3, -3).split("\n");
        const lang = lines[0].trim() || "code";
        const code = lines.slice(1).join("\n");
        return <CodeBlock key={i} code={code} lang={lang} />;
      }
      const formatted = part
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-secondary text-foreground text-sm font-mono">$1</code>');
      return <p key={i} className="leading-relaxed text-sm" dangerouslySetInnerHTML={{ __html: formatted }} />;
    });
  };

  if (msg.thinking) {
    return (
      <div className="flex gap-3 px-4 py-3">
        <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center bg-foreground text-background">
          <Sparkles size={14} />
        </div>
        <div className="rounded-2xl px-4 py-3 max-w-md border border-border bg-card">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Cpu size={10} />
            <span>Thinking...</span>
          </div>
          <ThinkingDots />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-3 px-4 py-3 group ${isAI ? "" : "justify-end flex-row-reverse"}`}>
      <div
        className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold ${isAI ? "bg-foreground text-background" : "bg-secondary text-foreground"}`}
      >
        {isAI ? <Sparkles size={14} /> : "Y"}
      </div>

      <div className={`max-w-2xl ${isAI ? "" : "items-end"}`}>
        {isAI && (
          <div className="text-xs text-muted-foreground mb-1 ml-1 font-medium">Shrija AI</div>
        )}
        <div
          className={`rounded-2xl px-4 py-3 text-sm border ${isAI
            ? "border-border bg-card text-foreground"
            : "border-foreground bg-foreground text-background"
            }`}
        >
          <div className="space-y-2">{renderContent(msg.content)}</div>
        </div>

        {isAI && (
          <div className="flex items-center gap-1 mt-2 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {[
              { icon: <Copy size={11} />, label: "Copy" },
              { icon: <ThumbsUp size={11} />, label: "Good" },
              { icon: <ThumbsDown size={11} />, label: "Bad" },
              { icon: <RefreshCw size={11} />, label: "Retry" },
            ].map(({ icon, label }) => (
              <button
                key={label}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                title={label}
              >
                {icon}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const ChatInput = ({ onSend, disabled }: { onSend: (msg: string) => void; disabled: boolean }) => {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const submit = () => {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  };

  return (
    <div className="px-4 pb-4 pt-2 bg-background">
      <div
        className={`rounded-2xl border transition-all duration-200 ${focused ? "border-foreground/50" : "border-border"}`}
        style={{
          background: "var(--card)",
        }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => { setValue(e.target.value); handleInput(); }}
          onKeyDown={handleKey}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Message Shrija AI..."
          rows={1}
          className="w-full bg-transparent px-4 pt-3.5 pb-1 text-sm text-foreground placeholder-muted-foreground resize-none outline-none"
          style={{ minHeight: 44, maxHeight: 160 }}
        />
        <div className="flex items-center justify-between px-3 pb-2.5">
          <div className="flex items-center gap-1">
            {[
              { icon: <Paperclip size={14} />, title: "Attach file" },
              { icon: <Mic size={14} />, title: "Voice input" },
              { icon: <Code size={14} />, title: "Code mode" },
            ].map(({ icon, title }) => (
              <button key={title} title={title} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
                {icon}
              </button>
            ))}
          </div>
          <button
            onClick={submit}
            disabled={!value.trim() || disabled}
            className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${value.trim() && !disabled ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"}`}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
      <p className="text-center text-[10px] text-muted-foreground mt-2">Shrija AI can make mistakes. Review important information.</p>
    </div>
  );
};
