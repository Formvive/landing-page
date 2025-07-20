import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, reason } = body;

    // Basic email presence and type check
    if (!email || typeof email !== "string") {
      return NextResponse.json({ message: "Invalid email" }, { status: 400 });
    }

    // ✅ Validate email format with regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("users");
    const collection = db.collection("sign-ups");

    const existing = await collection.findOne({ email });

    if (existing) {
      return NextResponse.json({ message: "Already signed up" }, { status: 200 });
    }

    const newEntry = {
      email,
      name: typeof name === "string" ? name : "",
      reason: typeof reason === "string" ? reason : "",
      createdAt: new Date(),
    };

    await collection.insertOne(newEntry);

    return NextResponse.json({ message: "Success" }, { status: 201 });

  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ [API] Error:", errMsg);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
