import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(req: Request) {
  try {
    const { messages, conversationId, agentType = "devgenius" } = await req.json()

    // Extract the last user message
    const lastMessage = messages[messages.length - 1]

    // Create a system prompt based on agent type
    let systemPrompt = ""

    switch (agentType) {
      case "emailmaster":
        systemPrompt = `You are EmailMaster AI, an expert email assistant. 
        You provide helpful summaries of emails, draft responses, and help manage inboxes.
        Be concise, professional, and helpful.`
        break
      case "contentgenius":
        systemPrompt = `You are ContentGenius AI, an expert content creation assistant. 
        You provide insights on social media trends, content ideas, and help with content creation.
        Be creative, engaging, and helpful.`
        break
      case "schedulemaster":
        systemPrompt = `You are ScheduleMaster AI, an expert calendar and planning assistant. 
        You help manage schedules, plan events, and optimize time management.
        Be organized, efficient, and helpful.`
        break
      default:
        systemPrompt = `You are DevGenius AI, an expert coding assistant. 
        You provide helpful, accurate, and concise responses to coding questions.
        When sharing code examples, use markdown code blocks with the appropriate language syntax.
        For example: \`\`\`javascript\ncode here\n\`\`\`
        Always explain your code examples.`
    }

    // Generate response using OpenAI
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: lastMessage.content,
      system: systemPrompt,
      temperature: 0.7,
      maxTokens: 1000,
    })

    // Create a new message object
    const newMessage = {
      id: new ObjectId().toString(),
      role: "assistant",
      content: text,
      timestamp: new Date().toISOString(),
    }

    // If we have a conversationId, update the conversation in MongoDB
    if (conversationId) {
      const client = await clientPromise
      const db = client.db("multiagent-ai")

      await db.collection("conversations").updateOne(
        { _id: new ObjectId(conversationId) },
        {
          $push: { messages: newMessage },
          $set: { updatedAt: new Date().toISOString() },
        },
      )
    }

    return NextResponse.json({
      content: text,
      role: "assistant",
      id: newMessage.id,
      timestamp: newMessage.timestamp,
    })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to process your request" }, { status: 500 })
  }
}
