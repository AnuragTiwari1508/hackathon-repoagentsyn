import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    const client = await clientPromise
    const db = client.db("multiagent-ai")

    // If an ID is provided, return that specific conversation
    if (id) {
      const conversation = await db.collection("conversations").findOne({
        _id: new ObjectId(id),
      })

      if (!conversation) {
        return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
      }

      return NextResponse.json({
        ...conversation,
        id: conversation._id.toString(),
      })
    }

    // Otherwise, return all conversations
    const conversations = await db.collection("conversations").find({}).sort({ updatedAt: -1 }).toArray()

    return NextResponse.json(
      conversations.map((conv) => ({
        ...conv,
        id: conv._id.toString(),
      })),
    )
  } catch (error) {
    console.error("Error fetching conversations:", error)
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { title, agentType = "devgenius" } = await req.json()

    const client = await clientPromise
    const db = client.db("multiagent-ai")

    // Create a new conversation
    const newConversation = {
      title,
      agentType,
      messages: [
        {
          id: new ObjectId().toString(),
          role: "assistant",
          content: `Hi! I'm ${agentType === "devgenius" ? "DevGenius" : agentType === "emailmaster" ? "EmailMaster" : agentType === "contentgenius" ? "ContentGenius" : "ScheduleMaster"} AI. How can I help you today?`,
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const result = await db.collection("conversations").insertOne(newConversation)

    return NextResponse.json({
      ...newConversation,
      id: result.insertedId.toString(),
    })
  } catch (error) {
    console.error("Error creating conversation:", error)
    return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const { id, message } = await req.json()

    const client = await clientPromise
    const db = client.db("multiagent-ai")

    // Update the conversation with the new message
    const result = await db.collection("conversations").updateOne(
      { _id: new ObjectId(id) },
      {
        $push: { messages: message },
        $set: { updatedAt: new Date().toISOString() },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    // Get the updated conversation
    const updatedConversation = await db.collection("conversations").findOne({
      _id: new ObjectId(id),
    })

    return NextResponse.json({
      ...updatedConversation,
      id: updatedConversation?._id.toString(),
    })
  } catch (error) {
    console.error("Error updating conversation:", error)
    return NextResponse.json({ error: "Failed to update conversation" }, { status: 500 })
  }
}
