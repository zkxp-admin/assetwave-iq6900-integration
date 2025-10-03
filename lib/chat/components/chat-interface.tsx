'use client'

import { MessageList } from './message-list'
import { MessageInput } from './message-input'
import { useSimpleChat } from '../hooks/use-simple-chat'

export function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useSimpleChat()

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b border-primary/20 p-4 bg-background">
        <h1 className="text-xl font-bold text-text">Chat with AI Tools Demo</h1>
        <p className="text-sm text-text-muted mt-1">
          Ask questions and watch the AI use tools to answer
        </p>
      </div>

      {/* Messages */}
      <MessageList messages={messages} />

      {/* Input */}
      <MessageInput
        input={input}
        isLoading={isLoading}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
    </div>
  )
}

