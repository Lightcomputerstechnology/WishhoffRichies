// app/api/wishes/create/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ✅ Initialize Supabase client using environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      user_id,
      title,
      description,
      category,
      target_amount,
      image_url,
      payment_method,
    } = body;

    // ✅ Validate required fields
    if (!title || !description || !target_amount) {
      return NextResponse.json(
        { error: "Title, description, and target amount are required." },
        { status: 400 }
      );
    }

    // ✅ Insert into Supabase
    const { data, error } = await supabase
      .from("wishes")
      .insert([
        {
          user_id,
          title,
          description,
          category,
          target_amount,
          image_url,
          payment_method,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to save wish." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "🎉 Wish created successfully!", data },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Error creating wish:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
