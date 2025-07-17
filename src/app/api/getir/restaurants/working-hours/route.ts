import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase/client';

// GET: Return DB data
export async function GET(req: NextRequest) {
  const token = req.headers.get('Authorization');
  console.log("GET - Received token:", token);
  console.log("GET - All headers:", Object.fromEntries(req.headers.entries()));

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('getir_restaurants')
    .select('restaurantWorkingHours, courierWorkingHours')
    .eq('token', token)
    .single();

  console.log("GET - Database query result:", { data, error });

  if (error || !data) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    restaurantWorkingHours: Array.isArray(data.restaurantWorkingHours?.restaurantWorkingHours)
      ? data.restaurantWorkingHours.restaurantWorkingHours
      : data.restaurantWorkingHours,
    courierWorkingHours: Array.isArray(data.courierWorkingHours?.courierWorkingHours)
      ? data.courierWorkingHours.courierWorkingHours
      : data.courierWorkingHours,
  });
}

// PUT: Update restaurant working hours
export async function PUT(req: NextRequest) {
  const token = req.headers.get('Authorization');
  console.log("PUT - Received token:", token);

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('getir_restaurants')
    .select('restaurant_id')
    .eq('token', token)
    .single();

  console.log("PUT - Database query result:", { data, error });

  if (error || !data) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!Array.isArray(body.restaurantWorkingHours) || !Array.isArray(body.courierWorkingHours)) {
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
    }

    const { error: updateError } = await supabase
      .from('getir_restaurants')
      .update({
        restaurantWorkingHours: body.restaurantWorkingHours,
        courierWorkingHours: body.courierWorkingHours,
      })
      .eq('token', token);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update working hours' }, { status: 500 });
    }

    return NextResponse.json('Working hours updated successfully');
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
}
