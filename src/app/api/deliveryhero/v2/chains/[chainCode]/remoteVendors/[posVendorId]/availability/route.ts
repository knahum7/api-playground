import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/client";

const VALID_AVAILABILITY_STATES = [
  "CLOSED_UNTIL",
  "CLOSED",
  "INACTIVE",
  "UNKNOWN",
  "OPEN",
  "CLOSED_TODAY",
];

// Authorization helper - validates JWT token from database
async function isValidAuth(req: NextRequest): Promise<boolean> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return false;
  const token = authHeader.split(" ")[1];
  
  const supabase = createClient();
  const { data, error } = await supabase
    .from("deliveryhero_restaurants")
    .select("access_token")
    .eq("access_token", token)
    .limit(1);
  
  return !error && !!data && data.length > 0;
}

// Safe JSON parsing helper for double-encoded JSON strings
function safeJsonParse(jsonString: string | null | any, defaultValue: any = []): any {
  if (!jsonString) return defaultValue;
  
  // If it's already an array (Supabase auto-parsed it), return it directly
  if (Array.isArray(jsonString)) {
    return jsonString;
  }
  
  // If it's a string, try to parse it
  if (typeof jsonString === 'string') {
    try {
      // First, try to parse as regular JSON
      return JSON.parse(jsonString);
    } catch (error) {
      try {
        // If that fails, it might be a double-encoded JSON string
        // Remove outer quotes if present
        const cleaned = jsonString.replace(/^"|"$/g, '');
        return JSON.parse(cleaned);
      } catch (secondError) {
        console.warn("Failed to parse JSON:", jsonString, "Error:", secondError);
        return defaultValue;
      }
    }
  }
  
  return defaultValue;
}

// GET: Return current availability state for all matching restaurants
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ chainCode: string; posVendorId: string }> }
) {
  if (!(await isValidAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { chainCode, posVendorId } = await params;
  
  const supabase = createClient();
  const { data, error } = await supabase
    .from("deliveryhero_restaurants")
    .select("*")
    .eq("chainCode", chainCode)
    .eq("posVendorId", posVendorId);

  if (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // 20% chance to return 204 (acknowledged but not yet available)
  if (Math.random() < 0.2) {
    return new Response(null, { status: 204 });
  }

  // Return all matching restaurants
  const restaurants = data.map(restaurant => {
    const availabilityStates = safeJsonParse(restaurant.availabilityStates, []);
    const closingReasons = safeJsonParse(restaurant.closingReasons, []);
    
    // More robust boolean conversion
    const isChangeable = restaurant.changeable === "true" || restaurant.changeable === true;

    return {
      availabilityState: restaurant.availabilityState,
      changeable: isChangeable,
      closedReason: restaurant.closingReason,
      platformRestaurantId: restaurant.platformRestaurantId,
      platformId: restaurant.platformId,
      platformType: restaurant.platformType,
      platformKey: restaurant.platformKey,
      availabilityStates,
      closingReasons,
      closingMinutes: [parseInt(restaurant.closingMinutes) || 30],
    };
  });

  return NextResponse.json(restaurants);
}

// PUT: Update availability state for specific restaurant
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ chainCode: string; posVendorId: string }> }
) {
  if (!(await isValidAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { chainCode, posVendorId } = await params;
  
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    availabilityState,
    platformKey,
    platformRestaurantId,
    closedReason,
    closingMinutes,
  }: {
    availabilityState: string;
    platformKey: string;
    platformRestaurantId: string;
    closedReason?: string;
    closingMinutes?: number;
  } = body;

  if (!VALID_AVAILABILITY_STATES.includes(availabilityState)) {
    return NextResponse.json(
      { error: "Invalid availabilityState" },
      { status: 400 }
    );
  }

  const supabase = createClient();
  
  // Get the specific restaurant by platformRestaurantId
  const { data, error: fetchError } = await supabase
    .from("deliveryhero_restaurants")
    .select("*")
    .eq("chainCode", chainCode)
    .eq("posVendorId", posVendorId)
    .eq("platformRestaurantId", platformRestaurantId)
    .single();

  if (fetchError || !data) {
    return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
  }

  // Validate platformKey
  if (platformKey !== data.platformKey) {
    return NextResponse.json(
      { error: "Invalid platformKey" },
      { status: 400 }
    );
  }

  // Check if restaurant is changeable
  const isChangeable = data.changeable === "true" || data.changeable === true;
  if (!isChangeable) {
    return NextResponse.json(
      { error: "Availability change not allowed" },
      { status: 400 }
    );
  }

  // Validate closedReason if provided
  if (closedReason) {
    const closingReasons = safeJsonParse(data.closingReasons, []);
    if (!closingReasons.includes(closedReason)) {
      return NextResponse.json(
        { error: "Invalid closedReason" },
        { status: 400 }
      );
    }
  }

  // Update the specific restaurant
  const updateData: any = {
    availabilityState,
  };

  if (closedReason) {
    updateData.closingReason = closedReason;
  }

  if (closingMinutes) {
    updateData.closingMinutes = closingMinutes.toString();
  }

  const { error: updateError } = await supabase
    .from("deliveryhero_restaurants")
    .update(updateData)
    .eq("chainCode", chainCode)
    .eq("posVendorId", posVendorId)
    .eq("platformRestaurantId", platformRestaurantId);

  if (updateError) {
    return NextResponse.json(
      { error: "Failed to update availability status" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: `Availability status updated to '${availabilityState}'`,
  });
} 