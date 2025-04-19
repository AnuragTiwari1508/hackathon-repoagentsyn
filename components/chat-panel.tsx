"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Send, Menu, User, Bot, Copy, Check, Code, Mail, Youtube, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import ReactMarkdown from "react-markdown"

interface ChatPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  onCodeChange: (content: { language: string; code: string; fileName?: string } | null) => void
  onOpenSidebar: () => void
  conversation: {
    id: string
    title: string
    messages: MessageType[]
  } | null
  isLoading?: boolean
  agentType: string
}

type MessageType = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function ChatPanel({
  className,
  onCodeChange,
  onOpenSidebar,
  conversation,
  isLoading: conversationLoading = false,
  agentType,
  ...props
}: ChatPanelProps) {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm DevGenius AI. How can I help you with your coding today?",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Update messages when conversation changes
  useEffect(() => {
    if (conversation && conversation.messages.length > 0) {
      setMessages(conversation.messages)
    }
  }, [conversation])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(null)
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [copied])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: MessageType = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Focus the textarea after sending
    setTimeout(() => {
      textareaRef.current?.focus()
    }, 0)

    try {
      // Make actual API call to our backend
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          conversationId: conversation?.id,
          agentType,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const assistantMessage: MessageType = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.content,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Extract code blocks and update the code panel if this is DevGenius
      if (agentType === "devgenius") {
        const codeMatch = data.content.match(/```(\w+)\n([\s\S]*?)```/)
        if (codeMatch && codeMatch.length >= 3) {
          const language = codeMatch[1]
          const code = codeMatch[2]
          onCodeChange({ language, code })
        }
      }

      // If we have a conversation, update it in the backend
      if (conversation) {
        await fetch("/api/history", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: conversation.id,
            message: assistantMessage,
          }),
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    toast({
      title: "Copied to clipboard",
      description: "The content has been copied to your clipboard.",
    })
  }

  const getAgentIcon = () => {
    switch (agentType) {
      case "emailmaster":
        return <Mail className="h-5 w-5" />
      case "contentgenius":
        return <Youtube className="h-5 w-5" />
      case "schedulemaster":
        return <Calendar className="h-5 w-5" />
      default:
        return <Bot className="h-5 w-5" />
    }
  }

  const getAgentName = () => {
    switch (agentType) {
      case "emailmaster":
        return "EmailMaster"
      case "contentgenius":
        return "ContentGenius"
      case "schedulemaster":
        return "ScheduleMaster"
      default:
        return "DevGenius"
    }
  }

  return (
    <div className={cn("glass-panel flex flex-col", className)} {...props}>
      <div className="flex items-center justify-between p-4 border-b">
        <Button variant="ghost" size="icon" onClick={onOpenSidebar} className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          {getAgentIcon()}
          <span>{getAgentName()}</span>
        </h2>
        <div className="w-9" /> {/* Spacer for alignment */}
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex gap-3 group", message.role === "user" ? "justify-end" : "justify-start")}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {getAgentIcon()}
                </div>
              )}

              <div
                className={cn(
                  "glass-panel rounded-lg p-3 max-w-[80%] group relative",
                  message.role === "user" ? "bg-primary text-primary-foreground" : "",
                )}
              >
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        if (inline) {
                          return (
                            <code className={cn("bg-muted px-1 py-0.5 rounded text-sm", className)} {...props}>
                              {children}
                            </code>
                          )
                        }

                        const match = /language-(\w+)/.exec(className || "")
                        const language = match ? match[1] : ""
                        const code = String(children).replace(/\n$/, "")

                        return (
                          <div className="relative my-2 rounded-md overflow-hidden">
                            <div className="flex items-center justify-between bg-muted px-4 py-1.5 text-xs">
                              <span>{language || "code"}</span>
                              <div className="flex items-center">
                                {agentType === "devgenius" && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-7 w-7"
                                          onClick={() => onCodeChange({ language, code })}
                                        >
                                          <Code className="h-3.5 w-3.5" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Open in editor</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}

                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() => copyToClipboard(code, `${message.id}-code`)}
                                      >
                                        {copied === `${message.id}-code` ? (
                                          <Check className="h-3.5 w-3.5" />
                                        ) : (
                                          <Copy className="h-3.5 w-3.5" />
                                        )}
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Copy code</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                            <pre className="p-4 overflow-x-auto bg-muted/50 text-sm">
                              <code className={cn("language-" + language)}>{code}</code>
                            </pre>
                          </div>
                        )
                      },
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>

                <div className="text-xs text-muted-foreground mt-2">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>

                {message.role === "assistant" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => copyToClipboard(message.content, message.id)}
                  >
                    {copied === message.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                )}
              </div>

              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-primary-foreground" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                {getAgentIcon()}
              </div>
              <div className="glass-panel rounded-lg p-3">
                <div className="flex space-x-2">
                  <div className="h-3 w-3 bg-muted-foreground/40 rounded-full animate-pulse"></div>
                  <div className="h-3 w-3 bg-muted-foreground/40 rounded-full animate-pulse delay-150"></div>
                  <div className="h-3 w-3 bg-muted-foreground/40 rounded-full animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask ${getAgentName()} something...`}
            className="resize-none pr-12"
            rows={3}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
            disabled={isLoading}
          />
          <Button type="submit" size="icon" className="absolute right-2 bottom-2" disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <div className="h-5 w-5 rounded-full border-2 border-t-transparent border-primary animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          Press <kbd className="px-1 py-0.5 bg-muted rounded">Enter</kbd> to send,{" "}
          <kbd className="px-1 py-0.5 bg-muted rounded">Shift + Enter</kbd> for new line
        </div>
      </form>
    </div>
  )
}
