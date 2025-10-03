'use client'

import { Send } from 'lucide-react'

interface MessageInputProps {
  input: string
  isLoading: boolean
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export function MessageInput({
  input,
  isLoading,
  handleInputChange,
  handleSubmit,
}: MessageInputProps) {
  return (
    <form onSubmit={handleSubmit} className="border-t border-primary/20 p-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-background border border-primary/30 rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-4 py-2 bg-primary hover:bg-secondary disabled:bg-text-muted disabled:cursor-not-allowed text-background rounded-lg transition-colors flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Send
        </button>
      </div>
    </form>
  )
}

