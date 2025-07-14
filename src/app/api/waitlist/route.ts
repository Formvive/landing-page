import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";

export async function POST(request: Request) {
  // console.log("🔔 [API] Waitlist POST called");

  try {
    const body = await request.json();
    // console.log("📩 [API] Request Body:", body);

    const { email } = body;

    if (!email || typeof email !== "string") {
      console.warn("⚠️ [API] Invalid or missing email");
      return NextResponse.json({ message: "Invalid email" }, { status: 400 });
    }

    const client = await clientPromise;
    // console.log("✅ [API] Connected to MongoDB");

    const db = client.db("users");
    const collection = db.collection("sign-ups");

    const existing = await collection.findOne({ email });
    // console.log("🔍 [API] Existing entry:", existing);

    if (existing) {
      // console.log("🛑 [API] Email already signed up");
      return NextResponse.json({ message: "Already signed up" }, { status: 200 });
    }

    await collection.insertOne({ email, createdAt: new Date() });
    // console.log("✅ [API] Inserted result:", result);

    return NextResponse.json({ message: "Success" }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ [API] Error:", error.message);
    } else {
      console.error("❌ [API] Unknown error", error);
    }
  }
}
