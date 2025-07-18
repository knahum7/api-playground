"use client";
import Link from "next/link";
import React, { useState } from "react";

const DAY_LABELS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

type WorkingHour = {
  dayOfWeek: string;
  openingTime: string;
  closingTime: string;
};

type ApiResponse = {
  message?: string;
  workingHours?: WorkingHour[];
  error?: string;
};

const Page = () => {
  const [supplierId, setSupplierId] = useState("");
  const [storeId, setStoreId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>(
    DAY_LABELS.map((day) => ({
      dayOfWeek: day,
      openingTime: "09:00",
      closingTime: "21:00",
    }))
  );
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleWorkingHourChange = (index: number, field: keyof WorkingHour, value: string) => {
    setWorkingHours((prev) =>
      prev.map((h, i) => (i === index ? { ...h, [field]: value } : h))
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setResponse(null);
    setError(null);
    try {
      const basicAuth = btoa(`${apiKey}:${apiSecret}`);
      const res = await fetch(`/api/trendyol/suppliers/${supplierId}/stores/${storeId}/working-hours`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${basicAuth}`,
          "User-Agent": `${supplierId} - SelfIntegration`,
        },
        body: JSON.stringify({ workingHours }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResponse(data);
      }
    } catch (e) {
      setError("Network error");
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
        className="w-full max-w-2xl p-8 bg-white rounded shadow-md flex flex-col gap-4"
        onSubmit={handleSubmit}
        aria-label="Trendyol Store Working Hours form"
      >
        <h1 className="text-2xl font-bold text-center mb-4">Trendyol Store Working Hours</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workingHours.map((h, i) => (
            <div key={h.dayOfWeek} className="border rounded p-4 flex flex-col gap-2 bg-gray-50">
              <div className="font-semibold mb-1">{h.dayOfWeek}</div>
              <label className="flex flex-col">
                <span className="text-xs">Opening Time</span>
                <input
                  type="time"
                  value={h.openingTime}
                  onChange={e => handleWorkingHourChange(i, "openingTime", e.target.value)}
                  className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Opening Time"
                />
              </label>
              <label className="flex flex-col">
                <span className="text-xs">Closing Time</span>
                <input
                  type="time"
                  value={h.closingTime}
                  onChange={e => handleWorkingHourChange(i, "closingTime", e.target.value)}
                  className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Closing Time"
                />
              </label>
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="bg-purple-600 text-white font-semibold py-2 rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          aria-label="Submit Trendyol store working hours form"
          tabIndex={0}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Working Hours"}
        </button>
        {(error || response) && (
          <div className={`mt-2 p-3 rounded text-sm ${error ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`} aria-live="polite">
            {error ? <span>{error}</span> : (
              <div>
                <div className="mb-2 font-medium">{response?.message}</div>
                <ul className="list-disc pl-5">
                  {response?.workingHours?.map((h, i) => (
                    <li key={i}>
                      <span className="font-semibold">{h.dayOfWeek}:</span> {h.openingTime} - {h.closingTime}
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
