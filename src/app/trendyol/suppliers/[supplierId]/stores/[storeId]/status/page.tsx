"use client";
import Link from "next/link";
import React, { useState } from "react";

type ApiResponse = {
  message?: string;
  error?: string;
};

const STATUS_OPTIONS = ["OPEN", "CLOSED"];

const Page = () => {
  const [supplierId, setSupplierId] = useState("");
  const [storeId, setStoreId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [status, setStatus] = useState(STATUS_OPTIONS[0]);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setResponse(null);
    try {
      const basicAuth = btoa(`${apiKey}:${apiSecret}`);
      const res = await fetch(`/api/trendyol/suppliers/${supplierId}/stores/${storeId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${basicAuth}`,
          "User-Agent": `${supplierId} - SelfIntegration`,
        },
        body: JSON.stringify({ status }),
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
        aria-label="Trendyol Store Status form"
      >
        <h1 className="text-2xl font-bold text-center mb-4">Trendyol Store Status</h1>
        <label htmlFor="supplierId" className="font-medium">Supplier ID</label>
        <input
          id="supplierId"
          name="supplierId"
          type="text"
          value={supplierId}
          onChange={e => setSupplierId(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Supplier ID"
          tabIndex={0}
          required
        />
        <label htmlFor="storeId" className="font-medium">Store ID</label>
        <input
          id="storeId"
          name="storeId"
          type="text"
          value={storeId}
          onChange={e => setStoreId(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Store ID"
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
        <label htmlFor="status" className="font-medium">Status</label>
        <select
          id="status"
          name="status"
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Status"
          tabIndex={0}
          required
        >
          {STATUS_OPTIONS.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <button
          type="submit"
          className="mt-4 bg-purple-600 text-white font-semibold py-2 rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          aria-label="Submit Trendyol store status form"
          tabIndex={0}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Store Status"}
        </button>
        {response && (
          <div
            className={`mt-4 p-3 rounded text-sm ${response.error ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
            aria-live="polite"
          >
            {response.error ? (
              <span>{response.error}</span>
            ) : (
              <span>{response.message}</span>
            )}
          </div>
        )}
      </form>
    </main>
  );
};

export default Page;
