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

export async function PUT(
  req: NextRequest,
  { params }: { params: { supplierId: string; storeId: string } }
) {
  const { supplierId, storeId } = params;
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

  const supabase = createClient();
  // Find the restaurant
  const { data, error } = await supabase
    .from("trendyol_restaurants")
    .select("id")
    .eq("supplier_id", uaSupplierId)
    .eq("integrator", uaIntegrator)
    .eq("id", storeId)
    .eq("apikey", auth.apiKey)
    .eq("apisecret", auth.apiSecret)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Store not found or unauthorized" }, { status: 404 });
  }

  // Update working_status
  const { error: updateError } = await supabase
    .from("trendyol_restaurants")
    .update({ working_status: status })
    .eq("id", storeId)
    .eq("supplier_id", uaSupplierId)
    .eq("integrator", uaIntegrator)
    .eq("apikey", auth.apiKey)
    .eq("apisecret", auth.apiSecret);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({
    message: `Store ${storeId} of supplier ${supplierId} is now marked as '${status}'`,
  });
}
