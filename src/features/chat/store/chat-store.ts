import { create } from "zustand";
import type { ChatMessage, QuickPrompt } from "../types";

export const DEFAULT_QUICK_PROMPTS: QuickPrompt[] = [
  {
    id: "dukuh-atas-status",
    label: "Dukuh Atas Live Flow",
    prompt: "Where is the highest pedestrian congestion in Dukuh Atas Hub right now?",
    category: "congestion",
  },
  {
    id: "monsoon-route",
    label: "Rain Rerouting",
    prompt: "What is the recommended safe exit route during heavy monsoon rain?",
    category: "weather",
  },
  {
    id: "vci-explanation",
    label: "VCI Formula",
    prompt: "Explain how the Vendor Crowding Index (VCI) measures walkway bottlenecks.",
    category: "methodology",
  },
  {
    id: "sini-vision",
    label: "SINI AI Vision",
    prompt: "How does the SINI AI edge vision pipeline detect vendors and crowd density?",
    category: "spatial",
  },
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "init-welcome",
    role: "assistant",
    content: `👋 **Welcome to TransitFlow AI Spatial Copilot!**

I am powered by **DeepSeek 4.1 Flash** via CommandCode to provide spatial crowd analytics, multimodal route recommendations, and weather-resilient transit guidance across Jakarta's TOD hubs.

Select a quick query below or ask any question about **Dukuh Atas, Manggarai, VCI metrics, or real-time spatial bottlenecks**!`,
    timestamp: Date.now(),
  },
];

interface ChatState {
  isOpen: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  activeModel: string;
  quickPrompts: QuickPrompt[];
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  isOpen: false,
  messages: INITIAL_MESSAGES,
  isLoading: false,
  error: null,
  activeModel: "deepseek/deepseek-v4.1-flash",
  quickPrompts: DEFAULT_QUICK_PROMPTS,

  toggleOpen: () => set((s) => ({ isOpen: !s.isOpen })),
  setOpen: (isOpen) => set({ isOpen }),

  clearMessages: () =>
    set({
      messages: INITIAL_MESSAGES,
      error: null,
    }),

  sendMessage: async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || get().isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: Date.now(),
    };

    const currentMessages = [...get().messages, userMessage];

    set({
      messages: currentMessages,
      isLoading: true,
      error: null,
    });

    try {
      // Send conversation history (omitting initial system/welcome message if preferred)
      const outgoingMessages = currentMessages
        .filter((m) => m.id !== "init-welcome")
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: outgoingMessages,
          max_tokens: 3000,
          temperature: 0.7,
        }),
      });

      if (!res.ok) {
        throw new Error(`Chat API error (${res.status})`);
      }

      const data = await res.json();

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.content || "No response received.",
        reasoning: data.reasoning,
        timestamp: Date.now(),
      };

      set((s) => ({
        messages: [...s.messages, assistantMessage],
        activeModel: data.model || s.activeModel,
        isLoading: false,
      }));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate AI response";
      set((s) => ({
        isLoading: false,
        error: errorMessage,
        messages: [
          ...s.messages,
          {
            id: `error-${Date.now()}`,
            role: "assistant",
            content: `⚠️ **Connection Error**: ${errorMessage}. Please verify your network connection or try again.`,
            timestamp: Date.now(),
          },
        ],
      }));
    }
  },
}));
