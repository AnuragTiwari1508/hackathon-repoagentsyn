"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "./sidebar"
import { ChatPanel } from "./chat-panel"
import { CodePanel } from "./code-panel"
import { MobileNav } from "./mobile-nav"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useToast } from "@/hooks/use-toast"

type MessageType = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

type Conversation = {
  id: string
  title: string
  agentType?: string
  messages: MessageType[]
}

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [codeContent, setCodeContent] = useState<{
    language: string
    code: string
    fileName?: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [agentType, setAgentType] = useState<string>("devgenius")

  const isMobile = useMediaQuery("(max-width: 768px)")
  const { toast } = useToast()

  useEffect(() => {
    if (selectedConversationId) {
      fetchConversation(selectedConversationId)
    }
  }, [selectedConversationId])

  const fetchConversation = async (id: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/history?id=${id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch conversation")
      }
      const data = await response.json()

      // Convert string timestamps to Date objects
      const formattedMessages = data.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }))

      setCurrentConversation({
        ...data,
        messages: formattedMessages,
      })

      // Set the agent type based on the conversation
      if (data.agentType) {
        setAgentType(data.agentType)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load conversation",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id)
    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  const handleCreateConversation = async (type: string) => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Conversation`,
          agentType: type,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create conversation")
      }

      const data = await response.json()
      setSelectedConversationId(data.id)
      setAgentType(type)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create conversation",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-background to-background/90">
      {/* Background gradient elements */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent"></div>
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>

      {/* Mobile navigation */}
      {isMobile && (
        <MobileNav
          open={sidebarOpen}
          onOpenChange={setSidebarOpen}
          onSelectConversation={handleSelectConversation}
          onCreateConversation={handleCreateConversation}
          agentType={agentType}
        />
      )}

      {/* Desktop sidebar */}
      {!isMobile && (
        <Sidebar
          className="w-64 hidden md:block"
          onSelectConversation={handleSelectConversation}
          onCreateConversation={handleCreateConversation}
          agentType={agentType}
        />
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        <ChatPanel
          className="flex-1 h-1/2 md:h-auto"
          onCodeChange={setCodeContent}
          onOpenSidebar={() => setSidebarOpen(true)}
          conversation={currentConversation}
          isLoading={isLoading}
          agentType={agentType}
        />
        {agentType === "devgenius" && <CodePanel className="flex-1 h-1/2 md:h-auto" content={codeContent} />}
      </div>
    </div>
  )
}
