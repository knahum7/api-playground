import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { appSecretKey, restaurantSecretKey } = body;

    if (!appSecretKey || !restaurantSecretKey) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Query for the row with the given restaurantSecretKey
    const { data, error } = await supabase
      .from("getir_restaurants")
      .select("token, restaurant_id, app_secret_key")
      .eq("restaurant_secret_key", restaurantSecretKey)
      .single();

    if (error) {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    if (data && data.app_secret_key === appSecretKey) {
      return NextResponse.json({
        restaurantId: data.restaurant_id,
        token: data.token,
      });
    } else {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}
