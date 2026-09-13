"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { marked } from "marked";
import {
  Sparkles,
  X,
  Send,
  RotateCcw,
  Copy,
  Check,
  Bot,
  User,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useChatStore } from "@/features/chat/store/chat-store";
import type { ChatMessage } from "@/features/chat/types";

function MessageBubble({ message }: { message: ChatMessage }) {
  const [copied, setCopied] = useState(false);
  const [showReasoning, setShowReasoning] = useState(false);
  const isUser = message.role === "user";

  const parsedHtml = useMemo(() => {
    if (isUser) return "";
    try {
      return marked.parse(message.content, { gfm: true, breaks: true }) as string;
    } catch {
      return message.content;
    }
  }, [message.content, isUser]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard error
    }
  };

  return (
    <div
      className={`flex gap-3 ${
        isUser ? "flex-row-reverse" : "flex-row"
      } group animate-in fade-in slide-in-from-bottom-2 duration-200`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
          isUser
            ? "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white"
            : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 dark:text-emerald-300"
        }`}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      {/* Message Content Bubble */}
      <div
        className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
          isUser
            ? "bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-500/10"
            : "bg-slate-100 dark:bg-[#141c2e] border border-slate-200/80 dark:border-white/10 text-slate-800 dark:text-slate-100 rounded-tl-none shadow-sm"
        }`}
      >
        {/* Reasoning Dropdown for DeepSeek 4.1 Flash if present */}
        {!isUser && message.reasoning && (
          <div className="mb-3 border-b border-slate-200 dark:border-white/10 pb-2">
            <button
              type="button"
              onClick={() => setShowReasoning(!showReasoning)}
              className="flex items-center gap-1.5 text-sm font-mono text-emerald-600 dark:text-emerald-400 hover:opacity-80 transition-opacity"
            >
              <Sparkles size={13} />
              <span>Spatial Reasoning Trace</span>
              {showReasoning ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
            {showReasoning && (
              <div className="mt-2 p-2.5 bg-slate-200/60 dark:bg-slate-900/60 rounded-lg text-sm font-mono text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                {message.reasoning}
              </div>
            )}
          </div>
        )}

        {/* Message Body with full Markdown Parsing */}
        {isUser ? (
          <div className="whitespace-pre-wrap font-sans">{message.content}</div>
        ) : (
          <div
            className="chat-markdown font-sans text-sm leading-relaxed space-y-2.5 text-slate-800 dark:text-slate-100
              [&_h1]:text-base [&_h1]:font-bold [&_h1]:text-slate-900 dark:[&_h1]:text-white [&_h1]:mt-3 [&_h1]:mb-1.5
              [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-slate-900 dark:[&_h2]:text-white [&_h2]:mt-2.5 [&_h2]:mb-1
              [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-slate-900 dark:[&_h3]:text-white [&_h3]:mt-2 [&_h3]:mb-1
              [&_h4]:text-sm [&_h4]:font-bold [&_h4]:text-slate-900 dark:[&_h4]:text-white
              [&_p]:my-1.5 [&_p]:leading-relaxed
              [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1.5 [&_ul]:space-y-1
              [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1.5 [&_ol]:space-y-1
              [&_li]:my-0.5 [&_li]:leading-relaxed
              [&_strong]:font-semibold [&_strong]:text-slate-900 dark:[&_strong]:text-white
              [&_blockquote]:border-l-2 [&_blockquote]:border-emerald-500 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:my-2 [&_blockquote]:text-slate-600 dark:[&_blockquote]:text-slate-300
              [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:bg-slate-200/70 dark:[&_code]:bg-slate-800 [&_code]:rounded-md [&_code]:font-mono [&_code]:text-sm
              [&_pre]:p-3 [&_pre]:bg-slate-900 [&_pre]:text-slate-100 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:my-2
              [&_table]:w-full [&_table]:my-2 [&_table]:border-collapse [&_th]:border [&_th]:border-slate-300 dark:[&_th]:border-slate-700 [&_th]:p-1.5 [&_th]:text-left [&_th]:font-semibold [&_td]:border [&_td]:border-slate-300 dark:[&_td]:border-slate-700 [&_td]:p-1.5 [&_hr]:my-3 [&_hr]:border-slate-200 dark:[&_hr]:border-white/10"
            dangerouslySetInnerHTML={{ __html: parsedHtml }}
          />
        )}

        {/* Copy button on hover */}
        {!isUser && (
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-white/5 text-slate-400 dark:text-slate-500">
            <span className="text-sm font-mono opacity-70">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 text-sm hover:text-slate-700 dark:hover:text-slate-200 transition-colors p-1 rounded-md"
              title="Copy response"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function AiChatDrawer() {
  const {
    isOpen,
    setOpen,
    toggleOpen,
    messages,
    isLoading,
    quickPrompts,
    sendMessage,
    clearMessages,
  } = useChatStore();

  const [input, setInput] = useState("");
  const [isMaximized, setIsMaximized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom of message list
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const text = input;
    setInput("");
    sendMessage(text);
  };

  const handlePromptClick = (promptText: string) => {
    sendMessage(promptText);
  };

  return (
    <>
      {/* Floating Launcher Pill Button (Visible when closed) */}
      {!isOpen && (
        <button
          type="button"
          onClick={toggleOpen}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 text-white font-medium rounded-full shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border border-white/20 group"
          aria-label="Open TransitFlow AI Spatial Copilot"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400" />
          </span>
          <Sparkles size={18} className="text-amber-300 animate-pulse" />
          <span className="text-sm font-semibold tracking-wide">
            TransitFlow AI
          </span>
        </button>
      )}

      {/* Floating Chat Drawer Window (Visible when open) */}
      {isOpen && (
        <aside
          aria-label="TransitFlow AI Spatial Assistant"
          className={`fixed right-3 sm:right-4 z-50 flex flex-col bg-white/95 dark:bg-[#0c101c]/95 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-2xl overflow-hidden transition-all duration-300 animate-in fade-in zoom-in-95 ${
            isMaximized
              ? "top-2 bottom-2 h-[calc(100vh-1rem)] w-[680px] max-w-[calc(100vw-1.5rem)] sm:max-w-[calc(100vw-2rem)] rounded-2xl md:rounded-3xl"
              : "bottom-4 h-[620px] max-h-[calc(100vh-2rem)] w-[440px] max-w-[calc(100vw-2rem)] rounded-3xl"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/80 dark:border-white/10 bg-slate-50/80 dark:bg-[#101726]/80 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Sparkles size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    TransitFlow AI Copilot
                  </h3>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm font-mono font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Spatial Intelligence · Jakarta TOD Network</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clearMessages}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-white/10 rounded-xl transition-colors"
                title="Reset conversation"
              >
                <RotateCcw size={16} />
              </button>
              <button
                type="button"
                onClick={() => setIsMaximized((prev) => !prev)}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-white/10 rounded-xl transition-colors"
                title={isMaximized ? "Restore default window height" : "Maximize vertical window"}
                aria-label={isMaximized ? "Restore default window height" : "Maximize vertical window"}
              >
                {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-white/10 rounded-xl transition-colors"
                title="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {isLoading && (
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div className="flex items-center gap-1.5 px-4 py-3 bg-slate-100 dark:bg-[#141c2e] border border-slate-200/80 dark:border-white/10 rounded-2xl rounded-tl-none text-slate-500 dark:text-slate-400 text-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                  <span
                    className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                  <span className="ml-2 font-mono text-sm">
                    Synthesizing spatial telemetry...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Templates (No horizontal scroll) */}
          <div className="px-4 py-2.5 bg-slate-50/70 dark:bg-[#101726]/70 border-t border-slate-200/60 dark:border-white/5 flex flex-wrap gap-2 shrink-0">
            {quickPrompts.slice(0, 3).map((qp) => (
              <button
                key={qp.id}
                type="button"
                onClick={() => handlePromptClick(qp.prompt)}
                disabled={isLoading}
                className="flex-1 min-w-[110px] px-3 py-2 rounded-xl bg-white dark:bg-[#182238] border border-slate-200/80 dark:border-white/10 text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-white/10 transition-all text-center shadow-sm disabled:opacity-50 active:scale-95"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={handleSubmit}
            className="p-4 bg-white dark:bg-[#0e1422] border-t border-slate-200/80 dark:border-white/10 shrink-0"
          >
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#161f33] border border-slate-200/80 dark:border-white/10 rounded-2xl px-3.5 py-2 focus-within:border-blue-500/60 focus-within:ring-1 focus-within:ring-blue-500/30 transition-all shadow-inner">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Dukuh Atas flow, VCI, rain routes..."
                disabled={isLoading}
                className="flex-1 bg-transparent border-none outline-none text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 active:scale-95 disabled:opacity-40 disabled:hover:bg-blue-600 transition-all shadow-md shadow-blue-500/20"
                aria-label="Send message"
              >
                <Send size={15} />
              </button>
            </div>
            <div className="flex justify-between items-center mt-2 px-1 text-sm font-mono text-slate-400 dark:text-slate-500">
              <span>Enter to send</span>
              <span>MAPID Catalyst 2026</span>
            </div>
          </form>
        </aside>
      )}
    </>
  );
}
