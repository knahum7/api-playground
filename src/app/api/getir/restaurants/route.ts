import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/client";

export async function GET(req: NextRequest) {
  const token = req.headers.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("getir_restaurants")
    .select("restaurant_id, averagePreparationTime, status, isCourierAvailable, restaurant_name, isStatusChangedByUser, closedSource")
    .eq("token", token)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  return NextResponse.json({
    id: data.restaurant_id,
    averagePreparationTime: data.averagePreparationTime,
    status: data.status,
    isCourierAvailable: data.isCourierAvailable,
    name: data.restaurant_name,
    isStatusChangedByUser: data.isStatusChangedByUser,
    closedSource: data.closedSource,
  });
}
