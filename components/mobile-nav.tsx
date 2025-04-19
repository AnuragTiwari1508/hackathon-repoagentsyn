"use client"

import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Sidebar } from "./sidebar"

interface MobileNavProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectConversation: (id: string) => void
  onCreateConversation: (type: string) => void
  agentType: string
}

export function MobileNav({
  open,
  onOpenChange,
  onSelectConversation,
  onCreateConversation,
  agentType,
}: MobileNavProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0 w-72">
        <Sidebar
          className="border-none shadow-none h-full"
          onSelectConversation={(id) => {
            onSelectConversation(id)
            onOpenChange(false)
          }}
          onCreateConversation={onCreateConversation}
          agentType={agentType}
        />
      </SheetContent>
    </Sheet>
  )
}
