// import { NextResponse } from "next/server";
// import clientPromise from "@/lib/mongo";

// export async function POST(request: Request) {
//   // console.log("🔔 [API] Waitlist POST called");

//   try {
//     const body = await request.json();
//     const { email, name, reason } = body;

//     if (!email || typeof email !== "string") {
//       console.warn("⚠️ [API] Invalid or missing email");
//       return NextResponse.json({ message: "Invalid email" }, { status: 400 });
//     }

//     const client = await clientPromise;
//     const db = client.db("users");
//     const collection = db.collection("sign-ups");

//     const existing = await collection.findOne({ email });

//     if (existing) {
//       // console.log("🛑 [API] Email already signed up");
//       return NextResponse.json({ message: "Already signed up" }, { status: 200 });
//     }

//     const newEntry = {
//       email,
//       name: typeof name === "string" ? name : "",
//       reason: typeof reason === "string" ? reason : "",
//       createdAt: new Date(),
//     };

//     await collection.insertOne(newEntry);
//     // console.log("✅ [API] New user added to waitlist");

//     // ✅ Send Resend email
//     const fullName = name || "there";
//     const response = await emails.send({
//       from: 'Formvive <noreply@formvive.com>',
//       to: [email],
//       subject: "You're on the waitlist! 🎉",
//       html: `
//         <div style="font-family: sans-serif; padding: 1.5rem;">
//           <h2 style="color: #000;">Hey ${fullName},</h2>
//           <p>Thanks for joining the waitlist for <strong>Formvive</strong>.</p>
//           <p>We’ll keep you in the loop with updates and early access info.</p>
//           <p style="margin-top: 2rem;">🚀 Cheers,<br/>The Formvive Team</p>
//         </div>
//       `,
//     });

//     console.log("📤 [Resend] Email sent:", response);

//     return NextResponse.json({ message: "Success" }, { status: 201 });

//   } catch (error: unknown) {
//     const errMsg = error instanceof Error ? error.message : "Unknown error";
//     console.error("❌ [API] Error:", errMsg);
//     return NextResponse.json({ message: "Internal server error" }, { status: 500 });
//   }
// }
