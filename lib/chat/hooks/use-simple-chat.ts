'use client'

import { useChat } from '@ai-sdk/react'
import { useCallback, useState } from 'react'

export function useSimpleChat() {
  const [input, setInput] = useState('')

  const { messages, sendMessage, status } = useChat({
    experimental_throttle: 50,
  })

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }, [])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!input.trim()) return

      sendMessage({
        role: 'user',
        parts: [{ type: 'text', text: input }],
      })

      setInput('')
    },
    [input, sendMessage],
  )

  const isLoading = status === 'streaming' || status === 'submitted'

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  }
}

