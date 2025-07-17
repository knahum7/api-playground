import { NextRequest, NextResponse } from "next/server";

// Mock valid token
const MOCK_TOKEN = "mock-jwt-token-abc123xyz";

export async function PUT(req: NextRequest) {
  const token = req.headers.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  if (token !== MOCK_TOKEN) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  // Simulate successful restaurant opening
  return NextResponse.json({ message: "Restaurant is now open" }, { status: 200 });
}
