'use client'

import type { ChatMessage } from '../types'
import { Bot, User, Wrench, CheckCircle, Clock } from 'lucide-react'

interface MessageListProps {
  messages: ChatMessage[]
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-text-muted">
          <p>Start a conversation to see chat and tool usage in action</p>
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Bot className="w-5 h-5 text-background" />
              </div>
            )}

            <div
              className={`max-w-[70%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-primary text-background'
                  : 'bg-background border border-primary/20 text-white'
              }`}
            >
              {/* Render message parts */}
              {message.parts.map((part: any, index: number) => {
                // Text content
                if (part.type === 'text') {
                  return (
                    <p key={index} className="whitespace-pre-wrap">
                      {part.text}
                    </p>
                  )
                }

                // Tool calls - show what tools are being invoked
                if (part.type?.startsWith('tool-')) {
                  const toolName = part.type.replace('tool-', '')
                  const displayName = toolName
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (str: string) => str.toUpperCase())

                  return (
                    <div
                      key={index}
                      className="mt-2 bg-background border border-primary/30 rounded p-3"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Wrench className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-primary">
                          Tool: {displayName}
                        </span>
                        {part.state === 'output-available' ? (
                          <CheckCircle className="w-4 h-4 text-primary ml-auto" />
                        ) : (
                          <Clock className="w-4 h-4 text-text-muted ml-auto" />
                        )}
                      </div>

                      {/* Show tool input parameters */}
                      {part.input && (
                        <div className="text-xs text-text-muted mb-2">
                          <span className="font-semibold">Parameters:</span>
                          <pre className="mt-1 bg-background border border-primary/20 p-2 rounded overflow-x-auto">
                            {JSON.stringify(part.input, null, 2)}
                          </pre>
                        </div>
                      )}

                      {/* Show tool output if available */}
                      {part.output && (
                        <div className="text-xs text-text-muted">
                          <span className="font-semibold">Result:</span>
                          <pre className="mt-1 bg-background border border-primary/20 p-2 rounded overflow-x-auto">
                            {JSON.stringify(part.output, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )
                }

                return null
              })}
            </div>

            {message.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-text-muted flex items-center justify-center">
                <User className="w-5 h-5 text-background" />
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}

