import { NextRequest, NextResponse } from "next/server";

// In-memory mock store status storage
const STORE_STATUSES: Record<string, "OPEN" | "CLOSED"> = {
  "10_1": "OPEN", // key format: `${supplierId}_${storeId}`
};

export async function PUT(
  req: NextRequest,
  { params }: { params: { supplierId: string; storeId: string } }
) {
  const { supplierId, storeId } = params;
  const key = `${supplierId}_${storeId}`;

  // Validate headers
  const apiKey = req.headers.get("api-key");
  const apiSecret = req.headers.get("api-secret");
  if (apiKey !== "mock-api-key" || apiSecret !== "mock-api-secret") {
    return NextResponse.json(
      { error: "Unauthorized: Invalid API credentials" },
      { status: 401 }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { status } = body;

  if (!["OPEN", "CLOSED"].includes(status)) {
    return NextResponse.json(
      { error: "Invalid status. Must be 'OPEN' or 'CLOSED'" },
      { status: 400 }
    );
  }

  // Simulate optimistic concurrency issue for demo
  if (Math.random() < 0.05) {
    return NextResponse.json(
      { error: "Conflict: Working status recently changed. Try again." },
      { status: 400 }
    );
  }

  // Update mock store status
  STORE_STATUSES[key] = status;

  return NextResponse.json({
    message: `Store ${storeId} of supplier ${supplierId} is now marked as '${status}'`,
  });
}
