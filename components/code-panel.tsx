"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Copy, Check, Download, Clipboard, Code2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Editor from "@monaco-editor/react"

interface CodePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  content: {
    language: string
    code: string
    fileName?: string
  } | null
}

export function CodePanel({ className, content, ...props }: CodePanelProps) {
  const [copied, setCopied] = useState(false)
  const [language, setLanguage] = useState("javascript")
  const [code, setCode] = useState("")
  const [theme, setTheme] = useState("vs-dark")
  const { toast } = useToast()

  useEffect(() => {
    if (content) {
      setLanguage(content.language || "javascript")
      setCode(content.code)
    }
  }, [content])

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false)
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [copied])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    toast({
      title: "Copied to clipboard",
      description: "The code has been copied to your clipboard.",
    })
  }

  const downloadCode = () => {
    const fileName = content?.fileName || `code.${language}`
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Downloaded",
      description: `File saved as ${fileName}`,
    })
  }

  return (
    <div className={cn("glass-panel flex flex-col", className)} {...props}>
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Code2 className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Code Editor</h2>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={copyToClipboard} disabled={!code}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={downloadCode} disabled={!code}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="editor" className="flex-1 flex flex-col">
        <div className="border-b px-4">
          <TabsList className="h-10">
            <TabsTrigger value="editor" className="data-[state=active]:bg-muted">
              Editor
            </TabsTrigger>
            <TabsTrigger value="output" className="data-[state=active]:bg-muted">
              Output
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="editor" className="flex-1 p-0 m-0">
          {code ? (
            <Editor
              height="100%"
              language={language}
              value={code}
              theme={theme}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
              }}
              onChange={(value) => setCode(value || "")}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Clipboard className="h-12 w-12 mb-4" />
              <p className="text-lg">No code to display</p>
              <p className="text-sm">Code from the chat will appear here</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="output" className="flex-1 p-0 m-0">
          <div className="h-full bg-black p-4">
            <ScrollArea className="h-full">
              <pre className="text-green-400 font-mono text-sm">
                {code ? "// Output will appear here when you run the code" : "// No code to execute"}
              </pre>
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
