"use client";
import { useState } from "react";
import Link from "next/link";

export default function TrendyolDeliveryAreasPage() {
  const [supplierId, setSupplierId] = useState("");
  const [storeId, setStoreId] = useState("");
  const [basicAuth, setBasicAuth] = useState("");
  const [integratorInfo, setIntegratorInfo] = useState("");
  const [areas, setAreas] = useState<any | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAreas = async () => {
    setLoading(true);
    setError("");
    setAreas(null);
    try {
      const res = await fetch(`/api/trendyol/delivery-areas?supplier_id=${encodeURIComponent(supplierId)}&store_id=${encodeURIComponent(storeId)}`, {
        method: "GET",
        headers: {
          "Authorization": `Basic ${basicAuth}`,
          "X-Integrator-Info": integratorInfo,
        },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Failed to fetch delivery areas");
      }
      const data = await res.json();
      setAreas(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="absolute top-4 left-4">
        <Link href="/" aria-label="Go to Home" tabIndex={0} className="inline-block p-2 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-blue-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4.5 10.5V21h15V10.5" />
          </svg>
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-4 text-orange-700">Trendyol Delivery Areas Test</h1>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Supplier ID:</label>
        <input
          type="text"
          className="border rounded px-2 py-1 w-full"
          value={supplierId}
          onChange={e => setSupplierId(e.target.value)}
          placeholder="Enter supplier_id"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Store ID:</label>
        <input
          type="text"
          className="border rounded px-2 py-1 w-full"
          value={storeId}
          onChange={e => setStoreId(e.target.value)}
          placeholder="Enter store_id"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Basic Auth (Base64 apiKey:apiSecret):</label>
        <input
          type="text"
          className="border rounded px-2 py-1 w-full"
          value={basicAuth}
          onChange={e => setBasicAuth(e.target.value)}
          placeholder="Paste base64(apiKey:apiSecret)"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">X-Integrator-Info (e.g. supplierId - integrator):</label>
        <input
          type="text"
          className="border rounded px-2 py-1 w-full"
          value={integratorInfo}
          onChange={e => setIntegratorInfo(e.target.value)}
          placeholder="e.g. 123 - myIntegrator"
        />
      </div>
      <button
        className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        onClick={fetchAreas}
        disabled={loading || !supplierId || !storeId || !basicAuth || !integratorInfo}
      >
        {loading ? "Loading..." : "Fetch Delivery Areas"}
      </button>
      {error && <div className="mt-4 text-red-600">Error: {error}</div>}
      {areas && (
        <div className="mt-6">
          <div className="mb-2 text-sm text-gray-700">Branch ID: {areas.branchId} | Radius: {areas.radius} | Hexagon Based: {areas.isHexagonBased ? "Yes" : "No"}</div>
          <h2 className="text-lg font-semibold mb-2">Areas</h2>
          <ul className="space-y-4">
            {areas.areas?.map((area: any) => (
              <li key={area.id} className="border rounded p-3">
                <div className="font-bold text-orange-800">{area.name}</div>
                <div className="ml-2 mt-1 text-sm">Area ID: {area.areaId}</div>
                <div className="ml-2 mt-1 text-sm">Coordinates: {area.coordinates}</div>
                <div className="ml-2 mt-1 text-sm">Min Basket Price: {area.minBasketPrice}₺</div>
                <div className="ml-2 mt-1 text-sm">Avg Delivery Time: {area.averageDeliveryTime?.min} - {area.averageDeliveryTime?.max} min</div>
                <div className="ml-2 mt-1 text-xs text-gray-500">Status: {area.status}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
