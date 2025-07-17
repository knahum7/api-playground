import { NextRequest, NextResponse } from "next/server";

// Mock credentials (for testing)
const MOCK_APP_SECRET = "yourAppSecretKey";
const MOCK_RESTAURANT_SECRET = "yourRestaurantSecretKey";

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

    // Simulate basic credential check
    if (
      appSecretKey === MOCK_APP_SECRET &&
      restaurantSecretKey === MOCK_RESTAURANT_SECRET
    ) {
      return NextResponse.json({
        restaurantId: "mock-restaurant-123",
        token: "mock-jwt-token-abc123xyz",
      });
    } else {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}
