import { NextRequest, NextResponse } from 'next/server';

// In-memory store to track updates (mocked)
const trendyolWorkingHoursStore: Record<string, any[]> = {};

const VALID_SUPPLIER_ID = 'mock-supplier';
const VALID_STORE_ID = 'mock-store';
const VALID_API_KEY = 'mock_api_key';
const VALID_API_SECRET = 'mock_api_secret';

export async function PUT(
  req: NextRequest,
  { params }: { params: { supplierId: string; storeId: string } }
) {
  const { supplierId, storeId } = params;
  const apiKey = req.headers.get('api-key');
  const apiSecret = req.headers.get('api-secret');

  // Validate credentials
  if (
    !supplierId ||
    !storeId ||
    !apiKey ||
    !apiSecret ||
    apiKey !== VALID_API_KEY ||
    apiSecret !== VALID_API_SECRET
  ) {
    return NextResponse.json(
      {
        error:
          'Unauthorized. Check supplierId, storeId, api-key, or api-secret.',
      },
      { status: 401 }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { workingHours } = body;

  if (!Array.isArray(workingHours)) {
    return NextResponse.json({ error: 'Missing workingHours array' }, { status: 400 });
  }

  // Basic validation of the structure
  for (const entry of workingHours) {
    if (
      !entry.dayOfWeek ||
      !entry.openingTime ||
      !entry.closingTime ||
      typeof entry.dayOfWeek !== 'string' ||
      typeof entry.openingTime !== 'string' ||
      typeof entry.closingTime !== 'string'
    ) {
      return NextResponse.json({ error: 'Invalid workingHours format' }, { status: 400 });
    }
  }

  // Simulate storing the working hours
  const key = `${supplierId}-${storeId}`;
  trendyolWorkingHoursStore[key] = workingHours;

  return NextResponse.json({
    message: 'Working hours updated successfully.',
    workingHours: trendyolWorkingHoursStore[key],
  });
}
