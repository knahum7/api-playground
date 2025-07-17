import { NextRequest, NextResponse } from "next/server";

// Mock restaurant list
const MOCK_RESTAURANTS = [
  {
    id: 1,
    name: "Mock Restoran",
    supplierId: 10,
    workingStatus: "OPEN",
    address: "123 Mock Street, Istanbul",
    location: {
      longitude: "29.00",
      latitude: "41.00",
    },
    averageOrderPreparationTimeInMin: 15,
    deliveryType: "GO",
    phoneNumber: "902120000000",
    email: "iletisim@email.com",
    creationDate: 1606397225000,
    lastModifiedDate: 1606397225000,
    workingHours: [
      {
        dayOfWeek: "MONDAY",
        openingTime: "08:00:00",
        closingTime: "12:00:00",
      },
    ],
  },
];

export async function GET(
  req: NextRequest,
  { params }: { params: { supplierId: string } }
) {
  const supplierId = parseInt(params.supplierId);
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const size = Math.min(parseInt(searchParams.get("size") || "10"), 50);

  // Simulate API key auth (optional - hardcoded for mock purposes)
  const apiKey = req.headers.get("api-key");
  const apiSecret = req.headers.get("api-secret");
  if (apiKey !== "mock-api-key" || apiSecret !== "mock-api-secret") {
    return NextResponse.json(
      { error: "Unauthorized: Invalid API credentials" },
      { status: 401 }
    );
  }

  // Filter restaurants by supplierId
  const filtered = MOCK_RESTAURANTS.filter(
    (r) => r.supplierId === supplierId
  );

  const pagedRestaurants = filtered.slice((page - 1) * size, page * size);
  const totalPages = Math.ceil(filtered.length / size);

  return NextResponse.json({
    restaurants: pagedRestaurants,
    totalPages,
    totalElements: filtered.length,
  });
}
