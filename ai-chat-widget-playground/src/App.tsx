import ChatWidget from './components/chat/ChatWidget'

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>AI Chat Widget Playground</h1>
        <p>Interact with the chat widget below. Powered by a mock AI service.</p>
      </header>
      <main className="app-main">
        <ChatWidget />
      </main>
    </div>
  )
}

export default App
