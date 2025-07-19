import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/client";

export async function POST(req: NextRequest) {
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

  const supabase = createClient();
  
  // Query the deliveryhero_restaurants table for the given username
  const { data, error } = await supabase
    .from("deliveryhero_restaurants")
    .select("username, password, access_token")
    .eq("username", username)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  // Validate password (case-sensitive, strict comparison)
  if (data.password?.trim() !== password) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  // Return the stored access_token
  return NextResponse.json({
    access_token: data.access_token,
    expires_in: 1800,
    token_type: "bearer",
  });
}
