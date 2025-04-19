"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Search, Settings, Github, Code2, Loader2, Mail, Youtube, Calendar, ChevronDown } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Conversation {
  id: string
  title: string
  agentType?: string
  updatedAt: string
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  onSelectConversation: (id: string) => void
  onCreateConversation: (type: string) => void
  agentType: string
}

export function Sidebar({ className, onSelectConversation, onCreateConversation, agentType, ...props }: SidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/history")
      if (!response.ok) {
        throw new Error("Failed to fetch conversations")
      }
      const data = await response.json()
      setConversations(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getAgentIcon = (type = "devgenius") => {
    switch (type) {
      case "emailmaster":
        return <Mail className="h-4 w-4" />
      case "contentgenius":
        return <Youtube className="h-4 w-4" />
      case "schedulemaster":
        return <Calendar className="h-4 w-4" />
      default:
        return <Code2 className="h-4 w-4" />
    }
  }

  const filteredConversations = conversations.filter((conversation) =>
    conversation.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) {
      return "Today"
    } else if (diffInDays === 1) {
      return "Yesterday"
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className={cn("glass-panel flex flex-col h-full", className)} {...props}>
      <div className="p-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <Code2 className="h-5 w-5" />
          <h2 className="text-lg font-semibold">MultiAgent AI</h2>
        </div>
        <ThemeToggle />
      </div>

      <div className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full justify-between" variant="default" disabled={isLoading}>
              <div className="flex items-center gap-2">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : getAgentIcon(agentType)}
                New Conversation
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem onClick={() => onCreateConversation("devgenius")}>
              <Code2 className="h-4 w-4 mr-2" />
              <span>DevGenius</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onCreateConversation("emailmaster")}>
              <Mail className="h-4 w-4 mr-2" />
              <span>EmailMaster</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onCreateConversation("contentgenius")}>
              <Youtube className="h-4 w-4 mr-2" />
              <span>ContentGenius</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onCreateConversation("schedulemaster")}>
              <Calendar className="h-4 w-4 mr-2" />
              <span>ScheduleMaster</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="px-4 pb-2">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-2">
        {isLoading && conversations.length === 0 ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            {searchQuery ? "No conversations found" : "No conversations yet"}
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                className="w-full text-left p-2 rounded-md hover:bg-accent transition-colors flex flex-col gap-1"
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="font-medium truncate">{conversation.title}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  {getAgentIcon(conversation.agentType)}
                  {formatDate(conversation.updatedAt)}
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t flex items-center justify-between">
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <Github className="h-5 w-5" />
          </a>
        </Button>
      </div>
    </div>
  )
}
