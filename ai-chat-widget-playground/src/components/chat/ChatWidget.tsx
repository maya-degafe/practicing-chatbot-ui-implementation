import {
  ChatContainerContent,
  ChatContainerRoot,
} from "@/components/prompt-kit/chat-container";
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/prompt-kit/message";
import { useState } from "react";
import { PromptInput, PromptInputTextarea } from "@/components/ui/prompt-input";
import { Button } from "@/components/ui/button";
import {
  createUserMessage,
  sendMessage,
  type Message as ChatMessage,
} from "./mockChatService";
import "./chatWidget.css";

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "intro-1",
    role: "assistant",
    content: "Hi there. I am your popup assistant. Ask me anything.",
    timestamp: new Date(),
  },
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);

  async function handleSend() {
    const content = draft.trim();

    if (!content || isSending) {
      return;
    }

    const userMessage = createUserMessage(content);
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setDraft("");
    setIsSending(true);

    try {
      const assistantMessage = await sendMessage(content, nextMessages);
      setMessages((currentMessages) => [...currentMessages, assistantMessage]);
    } finally {
      setIsSending(false);
    }
  }

  function handleComposerKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  }

  return (
    <div className="chat-widget-root">
      {open && (
        <section className="chat-widget-panel" aria-label="AI assistant chat">
          <header className="chat-widget-header">
            <div>
              <p className="chat-widget-kicker">Assistant</p>
              <h2>Support Chat</h2>
            </div>
            <button
              type="button"
              className="chat-widget-close"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </header>

          <ChatContainerRoot className="chat-widget-messages">
            <ChatContainerContent className="space-y-4 p-4">
              {messages.map((message) => {
                const isAssistant = message.role === "assistant";

                return (
                  <Message
                    key={message.id}
                    className={
                      isAssistant ? "justify-start" : "justify-end"
                    }
                  >
                    {isAssistant && (
                      <MessageAvatar
                        src="/avatars/ai.png"
                        alt="AI Assistant"
                        fallback="AI"
                      />
                    )}
                    <div className="max-w-[86%] sm:max-w-[78%]">
                      <MessageContent
                        className={
                          isAssistant
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-primary text-primary-foreground"
                        }
                      >
                        {message.content}
                      </MessageContent>
                    </div>
                  </Message>
                );
              })}

              {isSending && (
                <Message className="justify-start">
                  <MessageAvatar
                    src="/avatars/ai.png"
                    alt="AI Assistant"
                    fallback="AI"
                  />
                  <div className="max-w-[86%] sm:max-w-[78%]">
                    <MessageContent className="bg-secondary text-secondary-foreground">
                      ...
                    </MessageContent>
                  </div>
                </Message>
              )}
            </ChatContainerContent>
          </ChatContainerRoot>

        <form
          className="chat-widget-composer"
          onSubmit={(event) => {
            event.preventDefault();
            void handleSend();
          }}
        >
          <PromptInput value={draft} onValueChange={setDraft} className="w-full">
            <PromptInputTextarea
              placeholder="Type your message..."
              disabled={isSending}
              onKeyDown={handleComposerKeyDown}
            />
            <Button type="submit" size="sm" disabled={!draft.trim() || isSending}>
              Send
            </Button>
          </PromptInput>
        </form>
        </section>
      )}

      <button
        type="button"
        className="chat-widget-toggle"
        onClick={() => setOpen((isOpen) => !isOpen)}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? "×" : "Chat"}
      </button>
    </div>
  );
}
