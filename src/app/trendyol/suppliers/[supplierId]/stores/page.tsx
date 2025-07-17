"use client";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

type Restaurant = {
  id: number;
  name: string;
  address: string;
  workingStatus: string;
  averageOrderPreparationTimeInMin: number;
};

type ApiResponse = {
  restaurants?: Restaurant[];
  totalPages?: number;
  totalElements?: number;
  error?: string;
};

const Page = () => {
  const pathname = usePathname();
  const initialSupplierId = pathname.split("/")[4] || "";
  const [supplierId, setSupplierId] = useState(initialSupplierId);
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setResponse(null);
    try {
      const res = await fetch(`/api/trendyol/suppliers/${supplierId}/stores?page=${page}&size=${size}`, {
        method: "GET",
        headers: {
          "api-key": apiKey,
          "api-secret": apiSecret,
        },
      });
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({ error: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="absolute top-4 left-4">
        <Link href="/" aria-label="Go to Home" tabIndex={0} className="inline-block p-2 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-blue-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4.5 10.5V21h15V10.5" />
          </svg>
        </Link>
      </div>
      <form
        className="w-full max-w-lg p-8 bg-white rounded shadow-md flex flex-col gap-4"
        onSubmit={handleSubmit}
        aria-label="Trendyol Suppliers Stores form"
      >
        <h1 className="text-2xl font-bold text-center mb-4">Trendyol Supplier Stores</h1>
        <label htmlFor="supplierId" className="font-medium">Supplier ID</label>
        <input
          id="supplierId"
          name="supplierId"
          type="number"
          value={supplierId}
          onChange={e => setSupplierId(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Supplier ID"
          tabIndex={0}
          required
        />
        <label htmlFor="apiKey" className="font-medium">API Key</label>
        <input
          id="apiKey"
          name="apiKey"
          type="text"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="API Key"
          tabIndex={0}
          required
        />
        <label htmlFor="apiSecret" className="font-medium">API Secret</label>
        <input
          id="apiSecret"
          name="apiSecret"
          type="text"
          value={apiSecret}
          onChange={e => setApiSecret(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="API Secret"
          tabIndex={0}
          required
        />
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="page" className="font-medium">Page</label>
            <input
              id="page"
              name="page"
              type="number"
              min={1}
              value={page}
              onChange={e => setPage(Number(e.target.value))}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              aria-label="Page"
              tabIndex={0}
              required
            />
          </div>
          <div className="flex-1">
            <label htmlFor="size" className="font-medium">Size</label>
            <input
              id="size"
              name="size"
              type="number"
              min={1}
              max={50}
              value={size}
              onChange={e => setSize(Number(e.target.value))}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              aria-label="Size"
              tabIndex={0}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-purple-600 text-white font-semibold py-2 rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          aria-label="Submit Trendyol stores form"
          tabIndex={0}
          disabled={loading}
        >
          {loading ? "Fetching..." : "Fetch Stores"}
        </button>
        {response && (
          <div
            className={`mt-4 p-3 rounded text-sm ${response.error ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
            aria-live="polite"
          >
            {response.error ? (
              <span>{response.error}</span>
            ) : (
              <div>
                <div className="mb-2"><span className="font-medium">Total Pages:</span> {response.totalPages}</div>
                <div className="mb-2"><span className="font-medium">Total Elements:</span> {response.totalElements}</div>
                <div className="mb-2 font-medium">Restaurants:</div>
                <ul className="list-disc pl-5">
                  {response.restaurants?.map(r => (
                    <li key={r.id} className="mb-1">
                      <span className="font-semibold">{r.name}</span> (ID: {r.id}) - {r.address} - Status: {r.workingStatus} - Prep Time: {r.averageOrderPreparationTimeInMin} min
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </form>
    </main>
  );
};

export default Page;
