import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/client";

export async function PUT(req: NextRequest) {
  const token = req.headers.get("Authorization");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const supabase = createClient();
  // Check if the restaurant with the given token exists
  const { data, error } = await supabase
    .from("getir_restaurants")
    .select("restaurant_id")
    .eq("token", token)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  // Update the status to 1
  const { error: updateError } = await supabase
    .from("getir_restaurants")
    .update({ status: 1 })
    .eq("token", token);

  if (updateError) {
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }

  return NextResponse.json({ message: "Restaurant is now open" }, { status: 200 });
}
