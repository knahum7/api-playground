import { NextRequest, NextResponse } from "next/server";

// Mock token for authentication
const MOCK_TOKEN = "mock-jwt-token-abc123xyz";

// Mock restaurant data
const MOCK_RESTAURANT = {
  id: "mock-restaurant-123",
  averagePreparationTime: 20,
  status: 1,
  isCourierAvailable: true,
  name: "Mock Burger House",
  isStatusChangedByUser: false,
  closedSource: 0,
};

export async function GET(req: NextRequest) {
  const token = req.headers.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  if (token !== MOCK_TOKEN) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  return NextResponse.json(MOCK_RESTAURANT);
}
