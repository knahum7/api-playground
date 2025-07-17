import { NextRequest, NextResponse } from 'next/server';

const MOCK_TOKEN = 'mock-jwt-token-abc123xyz';

// In-memory mock data store
let restaurantWorkingHours = Array.from({ length: 7 }, (_, day) => ({
  day,
  workingHours: {
    startTime: '09:00',
    endTime: '21:00',
    closed: false,
  },
}));

let restaurantCourierHours = Array.from({ length: 7 }, (_, day) => ({
  day,
  workingHours: {
    startTime: '09:00',
    endTime: '21:00',
    closed: false,
  },
}));

// GET: Return mock data
export async function GET(req: NextRequest) {
  const token = req.headers.get('token');

  if (token !== MOCK_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    restaurantWorkingHours,
    restaurantCourierHours,
  });
}

// PUT: Update restaurant working hours
export async function PUT(req: NextRequest) {
  const token = req.headers.get('token');

  if (token !== MOCK_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (!Array.isArray(body.restaurantWorkingHours)) {
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
    }

    // Update the in-memory store with new values
    body.restaurantWorkingHours.forEach((item: any) => {
      if (typeof item.day === 'number' && item.day >= 0 && item.day <= 6) {
        const existing = restaurantWorkingHours.find((h) => h.day === item.day);
        if (existing) {
          existing.workingHours = {
            startTime: item.workingHours?.startTime || '',
            endTime: item.workingHours?.endTime || '',
            closed: item.closed ?? item.workingHours?.closed ?? false,
          };
        }
      }
    });

    return NextResponse.json('Working hours updated successfully');
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
}
