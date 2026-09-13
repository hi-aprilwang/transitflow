import { describe, it, expect, beforeEach } from "vitest";
import { useChatStore } from "./chat-store";

describe("useChatStore", () => {
  beforeEach(() => {
    useChatStore.getState().clearMessages();
    useChatStore.setState({ isOpen: false, isLoading: false, error: null });
  });

  it("initializes with default welcome message and closed state", () => {
    const state = useChatStore.getState();
    expect(state.isOpen).toBe(false);
    expect(state.messages.length).toBeGreaterThan(0);
    expect(state.messages[0].id).toBe("init-welcome");
    expect(state.activeModel).toBe("deepseek/deepseek-v4.1-flash");
  });

  it("toggles and sets open state correctly", () => {
    useChatStore.getState().toggleOpen();
    expect(useChatStore.getState().isOpen).toBe(true);

    useChatStore.getState().setOpen(false);
    expect(useChatStore.getState().isOpen).toBe(false);
  });

  it("clears messages back to initial welcome", () => {
    useChatStore.setState({
      messages: [
        {
          id: "m-1",
          role: "user",
          content: "Hello",
          timestamp: Date.now(),
        },
      ],
    });

    expect(useChatStore.getState().messages.length).toBe(1);
    useChatStore.getState().clearMessages();
    expect(useChatStore.getState().messages.length).toBe(1);
    expect(useChatStore.getState().messages[0].id).toBe("init-welcome");
  });
});
