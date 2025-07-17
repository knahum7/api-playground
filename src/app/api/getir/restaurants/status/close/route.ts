import { NextRequest, NextResponse } from "next/server";

// Mock valid token
const MOCK_TOKEN = "mock-jwt-token-abc123xyz";

// Valid enum values
const VALID_TIME_OFF_AMOUNTS = [15, 30, 45];

export async function PUT(req: NextRequest) {
  const token = req.headers.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  if (token !== MOCK_TOKEN) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { timeOffAmount } = body;

  if (!VALID_TIME_OFF_AMOUNTS.includes(timeOffAmount)) {
    return NextResponse.json(
      { error: "Invalid timeOffAmount. Must be one of: 15, 30, 45" },
      { status: 400 }
    );
  }

  // Simulate successful closure
  return NextResponse.json(
    `Restaurant closed for ${timeOffAmount} minutes`
  );
}
