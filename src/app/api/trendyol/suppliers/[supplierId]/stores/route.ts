import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/client";

function parseBasicAuth(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith("Basic ")) return null;
  try {
    const base64 = authHeader.replace("Basic ", "");
    const [apiKey, apiSecret] = atob(base64).split(":");
    return { apiKey, apiSecret };
  } catch {
    return null;
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { supplierId: string } }
) {
  const supplierId = params.supplierId;
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const size = Math.min(parseInt(searchParams.get("size") || "10"), 50);

  // Auth
  const auth = parseBasicAuth(req.headers.get("authorization"));
  const integratorInfo = req.headers.get("x-integrator-info");
  let uaSupplierId = "";
  let uaIntegrator = "";
  if (integratorInfo && integratorInfo.includes(" - ")) {
    [uaSupplierId, uaIntegrator] = integratorInfo.split(" - ");
  }
  if (!uaSupplierId || !uaIntegrator || uaSupplierId !== supplierId) {
    return NextResponse.json({ error: "Forbidden: Invalid or missing Integrator Info" }, { status: 403 });
  }
  if (!auth || !auth.apiKey || !auth.apiSecret) {
    return NextResponse.json({ error: "Unauthorized: Invalid Basic Auth" }, { status: 401 });
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("trendyol_restaurants")
    .select("*")
    .eq("supplier_id", uaSupplierId)
    .eq("integrator", uaIntegrator)
    .eq("apikey", auth.apiKey)
    .eq("apisecret", auth.apiSecret);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ restaurants: [], totalPages: 0, totalElements: 0 });
  }

  // Pagination
  const start = (page - 1) * size;
  const end = start + size;
  const paged = data.slice(start, end);
  const totalPages = Math.ceil(data.length / size);

  // Parse JSON fields
  const restaurants = paged.map((r) => ({
    id: r.id,
    name: r.name,
    supplier_id: r.supplier_id,
    working_status: r.working_status,
    address: r.address,
    location: typeof r.location === "string" ? JSON.parse(r.location) : r.location,
    average_order_preparation_time_in_min: Number(r.average_order_preparation_time_in_min),
    delivery_type: r.delivery_type,
    phone_number: r.phone_number,
    email: r.email,
    creation_date: r.creation_date,
    last_modified_date: r.last_modified_date,
    working_hours: typeof r.working_hours === "string" ? JSON.parse(r.working_hours) : r.working_hours,
    integrator: r.integrator,
  }));

  return NextResponse.json({
    restaurants,
    totalPages,
    totalElements: data.length,
  });
}
