import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/client";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/x-www-form-urlencoded")) {
      return NextResponse.json(
        { error: "Unsupported content type. Expected application/x-www-form-urlencoded" },
        { status: 415 }
      );
    }

    const bodyText = await req.text();
    const params = new URLSearchParams(bodyText);
    const username = params.get("username");
    const password = params.get("password");
    const grantType = params.get("grant_type");

    if (!username || !password || grantType !== "client_credentials") {
      return NextResponse.json(
        { error: "Invalid request. Make sure username, password and grant_type are provided." },
        { status: 400 }
      );
    }

    // Check if environment variables are configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: "Server configuration error. Please check environment variables." },
        { status: 500 }
      );
    }

    const supabase = createClient();
    
    const { data, error } = await supabase
      .from("deliveryhero_restaurants")
      .select("username, password, access_token")
      .eq("username", username)
      .limit(1);

    if (error) {
      return NextResponse.json(
        { error: "Database connection error. Please check your configuration." },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    const userData = data[0];
    const storedPassword = userData.password?.trim();
    const providedPassword = password.trim();

    if (storedPassword !== providedPassword) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    return NextResponse.json({
      access_token: userData.access_token,
      expires_in: 1800,
      token_type: "bearer",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
} 