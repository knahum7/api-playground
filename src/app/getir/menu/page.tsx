"use client";
import { useState } from "react";
import Link from "next/link";

export default function GetirMenuPage() {
  const [token, setToken] = useState("");
  const [menu, setMenu] = useState<any[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMenu = async () => {
    setLoading(true);
    setError("");
    setMenu(null);
    try {
      const res = await fetch("/api/getir/menu", {
        method: "GET",
        headers: {
          "token": token,
        },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Failed to fetch menu");
      }
      const data = await res.json();
      setMenu(data.productCategories);
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
      <h1 className="text-2xl font-bold mb-4 text-purple-700">Getir Menu Test</h1>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Token:</label>
        <input
          type="text"
          className="border rounded px-2 py-1 w-full"
          value={token}
          onChange={e => setToken(e.target.value)}
          placeholder="Paste your token here"
        />
      </div>
      <button
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        onClick={fetchMenu}
        disabled={loading || !token}
      >
        {loading ? "Loading..." : "Fetch Menu"}
      </button>
      {error && <div className="mt-4 text-red-600">Error: {error}</div>}
      {menu && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Product Categories</h2>
          <ul className="space-y-4">
            {menu.map((cat: any) => (
              <li key={cat.id} className="border rounded p-3">
                <div className="font-bold text-purple-800">{cat.name?.en || Object.values(cat.name)[0]}</div>
                <div className="ml-2 mt-1">
                  <span className="font-semibold">Products:</span>
                  <ul className="list-disc ml-6">
                    {cat.products.map((prod: any) => (
                      <li key={prod.id}>
                        <span className="font-medium">{prod.name?.en || Object.values(prod.name)[0]}</span>
                        {prod.price && (
                          <span className="ml-2 text-gray-600">- {prod.price}₺</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
