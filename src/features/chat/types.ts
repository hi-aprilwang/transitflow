export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  reasoning?: string;
  timestamp: number;
}

export interface ChatRequestPayload {
  messages: Array<{
    role: MessageRole;
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
}

export interface ChatResponsePayload {
  role: "assistant";
  content: string;
  reasoning?: string;
  model: string;
  offline?: boolean;
  expired?: boolean;
}

export interface QuickPrompt {
  id: string;
  label: string;
  prompt: string;
  category: "spatial" | "congestion" | "weather" | "methodology";
}
