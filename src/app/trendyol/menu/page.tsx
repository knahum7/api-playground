"use client";
import { useState } from "react";
import Link from "next/link";

export default function TrendyolMenuPage() {
  const [supplierId, setSupplierId] = useState("");
  const [storeId, setStoreId] = useState("");
  const [basicAuth, setBasicAuth] = useState("");
  const [integratorInfo, setIntegratorInfo] = useState("");
  const [menu, setMenu] = useState<any | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMenu = async () => {
    setLoading(true);
    setError("");
    setMenu(null);
    try {
      const res = await fetch(`/api/trendyol/menu?supplier_id=${encodeURIComponent(supplierId)}&store_id=${encodeURIComponent(storeId)}`, {
        method: "GET",
        headers: {
          "Authorization": `Basic ${basicAuth}`,
          "X-Integrator-Info": integratorInfo,
        },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Failed to fetch menu");
      }
      const data = await res.json();
      setMenu(data);
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
      <h1 className="text-2xl font-bold mb-4 text-orange-700">Trendyol Menu Test</h1>
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
        onClick={fetchMenu}
        disabled={loading || !supplierId || !storeId || !basicAuth || !integratorInfo}
      >
        {loading ? "Loading..." : "Fetch Menu"}
      </button>
      {error && <div className="mt-4 text-red-600">Error: {error}</div>}
      {menu && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Menu Sections</h2>
          <ul className="space-y-4">
            {menu.sections?.map((section: any) => (
              <li key={section.id} className="border rounded p-3">
                <div className="font-bold text-orange-800">{section.name}</div>
                <div className="ml-2 mt-1">
                  <span className="font-semibold">Products:</span>
                  <ul className="list-disc ml-6">
                    {section.products?.map((prod: any) => (
                      <li key={prod.id}>
                        <span className="font-medium">Product ID: {prod.id}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
          <h2 className="text-lg font-semibold mt-8 mb-2">Products</h2>
          <ul className="space-y-2">
            {menu.products?.map((prod: any) => (
              <li key={prod.id} className="border rounded p-2">
                <div className="font-bold">{prod.name}</div>
                <div className="text-sm text-gray-700">{prod.description}</div>
                <div className="text-sm">Original Price: {prod.originalPrice}₺, Selling Price: {prod.sellingPrice}₺</div>
                <div className="text-xs text-gray-500">Status: {prod.status}</div>
              </li>
            ))}
          </ul>
          <h2 className="text-lg font-semibold mt-8 mb-2">Ingredients</h2>
          <ul className="space-y-2">
            {menu.ingredients?.map((ing: any) => (
              <li key={ing.id} className="border rounded p-2">
                <div className="font-bold">{ing.name}</div>
                <div className="text-sm">Price: {ing.price}₺, Status: {ing.status}</div>
              </li>
            ))}
          </ul>
          <h2 className="text-lg font-semibold mt-8 mb-2">Modifier Groups</h2>
          <ul className="space-y-2">
            {menu.modifierGroups?.map((mg: any) => (
              <li key={mg.id} className="border rounded p-2">
                <div className="font-bold">{mg.name}</div>
                <div className="text-sm">Min: {mg.min}, Max: {mg.max}</div>
                <div className="text-xs text-gray-500">Modifiers: {mg.modifierProducts?.map((mp: any) => mp.id).join(", ")}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
