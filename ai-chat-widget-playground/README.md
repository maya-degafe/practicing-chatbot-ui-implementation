# AI Chat Widget Playground

A Vite + React + TypeScript playground for exploring and practicing a chat widget UI.

## Features

- 💬 **Chat interface** with user and AI assistant bubbles
- ⌨️ **Typing indicator** with animated dots while awaiting a response
- 📜 **Auto-scrolling** message list
- 🔄 **Auto-resizing** textarea input
- ♿ **Accessible** ARIA roles and labels
- 🎨 **Clean, responsive** design with CSS custom properties
- 🔌 **Mock chat service** — swap in a real API when ready

## Project Structure

```
ai-chat-widget-playground/
├─ package.json
├─ .env.local              # API key placeholder (not committed)
├─ .gitignore
├─ index.html
├─ src/
│  ├─ main.tsx             # App entry point
│  ├─ App.tsx              # Root component
│  ├─ styles.css           # Global styles
│  └─ components/
│     └─ chat/
│        ├─ ChatWidget.tsx      # Chat UI component
│        ├─ chatWidget.css      # Chat component styles
│        └─ mockChatService.ts  # Mock AI response service
└─ README.md
```

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Install & run

```bash
cd ai-chat-widget-playground
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
npm run preview
```

## Connecting a Real AI API

1. Copy `.env.local.example` → `.env.local` (or edit the existing `.env.local`).
2. Set your OpenAI API key:

   ```
   VITE_OPENAI_API_KEY=sk-...
   ```

3. Update `src/components/chat/mockChatService.ts` to call the OpenAI (or any other) API,
   using `import.meta.env.VITE_OPENAI_API_KEY` for the key and passing the `history` array
   as the conversation context.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Enter` | Send message |
| `Shift + Enter` | Insert newline |
