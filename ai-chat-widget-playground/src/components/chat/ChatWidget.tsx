import {
  ChatContainerContent,
  ChatContainerRoot,
} from "@/components/prompt-kit/chat-container";
import {
  Message,
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
import { Loader } from "@/components/ui/loader";
import { ArrowUp, MessageCircle, X, Bot, ChevronDown, Ellipsis, SquarePen } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "intro-1",
    role: "assistant",
    content: "Hi there. I am Capy! Ask me anything.",
    timestamp: new Date(),
  },
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);

  const handleNewChat = () => {
    setMessages([
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Hi there. I am Capy! Ask me anything.",
        timestamp: new Date(),
      },
    ]);

    setDraft("");
  };

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
          <div className="chat-widget-header-main">
            <div className="chat-widget-header-avatar" aria-hidden="true">
              <Bot size={18} strokeWidth={2.2} />
            </div>
            <div>
              <p className="chat-widget-kicker">Assistant</p>
              <h2>Support Chat</h2>
            </div>
          </div>

          <div className="chat-widget-header-actions">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button type="button" className="chat-menu-trigger" aria-label="Chat menu">
                  <Ellipsis size={18} />
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="chat-menu-content"
                  sideOffset={8}
                  align="end"
                  collisionPadding={12}
                >
                  <DropdownMenu.Item className="chat-menu-item" onSelect={handleNewChat}>
                    <SquarePen size={18} />
                    <span>Start a new chat</span>
                  </DropdownMenu.Item>

                  <DropdownMenu.Item className="chat-menu-item is-disabled" disabled>
                    <X size={18} />
                    <span>End chat</span>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <button
              type="button"
              className="chat-widget-close"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
            >
              <X strokeWidth={1.5} />
            </button>
          </div>
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
                    <div className="max-w-[86%] sm:max-w-[78%]">
                      <MessageContent
                        className={isAssistant ? "chat-bubble chat-bubble-assistant" : "chat-bubble chat-bubble-user"}
                      >
                        {message.content}
                      </MessageContent>
                    </div>
                  </Message>
                );
              })}

              {isSending && (
                <Message className="justify-start">
                  <div className="max-w-[86%] sm:max-w-[78%]">
                    <MessageContent className="bg-secondary text-secondary-foreground">
                      <Loader variant="wave" size="md" />
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
          <div className="flex items-end gap-2">
            <PromptInputTextarea
              placeholder="Message..."
              disabled={isSending}
              onKeyDown={handleComposerKeyDown}
              className="min-h-[36px] text-black placeholder:text-gray-500"
            />
            <Button
              type="submit"
              size="icon"
              className="h-8 w-8 rounded-full mb-1 shrink-0"
              style={{ backgroundColor: "#fcda24" }}
              disabled={!draft.trim() || isSending}
            >
              <ArrowUp className="size-4" color="black"/>
            </Button>
          </div>
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
        {open ? (
        <ChevronDown strokeWidth={2.25} />
      ) : (
        <MessageCircle strokeWidth={2.25} />
      )}
      </button>
    </div>
  );
}
