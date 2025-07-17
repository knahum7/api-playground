import { NextRequest, NextResponse } from "next/server";

// Simulated state storage per restaurant (in-memory)
const AVAILABILITY_STORE: Record<
  string,
  {
    availabilityState: string;
    changeable: boolean;
    checkinAt: string | null;
    closedUntil: string | null;
    closedReason: string;
    nextOpeningAt: string | null;
    platformRestaurantId: string;
    platformId: string;
    platformType: string;
    platformKey: string;
    availabilityStates: string[];
    closingReasons: string[];
    closingMinutes: number[];
  }
> = {
  "foo-chainId_fooPosVendorId123": {
    availabilityState: "CLOSED_UNTIL",
    changeable: true,
    checkinAt: null,
    closedUntil: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    closedReason: "TOO_BUSY_KITCHEN",
    nextOpeningAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    platformRestaurantId: "123456789",
    platformId: "deliveryhero-tr",
    platformType: "delivery",
    platformKey: "dh-platform",
    availabilityStates: ["OPEN", "CLOSED", "CLOSED_UNTIL"],
    closingReasons: [
      "TOO_BUSY_KITCHEN",
      "TECHNICAL_PROBLEM",
      "ORDER_FAILURE",
      "OTHER",
    ],
    closingMinutes: [15, 30, 45, 60],
  },
};

const VALID_AVAILABILITY_STATES = [
  "CLOSED_UNTIL",
  "CLOSED",
  "INACTIVE",
  "UNKNOWN",
  "OPEN",
  "CLOSED_TODAY",
];

// Authorization helper
function isValidAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return false;
  const token = authHeader.split(" ")[1];
  return token === "mock-valid-jwt-token";
}

// GET: Return current availability state
export async function GET(
  req: NextRequest,
  { params }: { params: { chainCode: string; posVendorId: string } }
) {
  if (!isValidAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { chainCode, posVendorId } = params;
  const key = `${chainCode}_${posVendorId}`;
  const store = AVAILABILITY_STORE[key];

  if (!store) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (Math.random() < 0.2) {
    return new Response(null, { status: 204 });
  }

  return NextResponse.json([
    {
      ...store,
    },
  ]);
}

// PUT: Update availability state
export async function PUT(
  req: NextRequest,
  { params }: { params: { chainCode: string; posVendorId: string } }
) {
  if (!isValidAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { chainCode, posVendorId } = params;
  const key = `${chainCode}_${posVendorId}`;
  const store = AVAILABILITY_STORE[key];

  if (!store) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

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
  }: {
    availabilityState: string;
    platformKey: string;
    platformRestaurantId: string;
  } = body;

  if (!VALID_AVAILABILITY_STATES.includes(availabilityState)) {
    return NextResponse.json(
      { error: "Invalid availabilityState" },
      { status: 400 }
    );
  }

  if (
    platformKey !== store.platformKey ||
    platformRestaurantId !== store.platformRestaurantId
  ) {
    return NextResponse.json(
      { error: "Invalid platformKey or platformRestaurantId" },
      { status: 400 }
    );
  }

  if (!store.changeable) {
    return NextResponse.json(
      { error: "Availability change not allowed" },
      { status: 400 }
    );
  }

  store.availabilityState = availabilityState;

  return NextResponse.json({
    message: `Availability status updated to '${availabilityState}'`,
  });
}
