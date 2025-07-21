"use client";
import React, { useState } from "react";
import Link from "next/link";

type CloseResponse = {
  error?: string;
  message?: string;
};

const Page = () => {
  const [token, setToken] = useState("");
  const [response, setResponse] = useState<CloseResponse | string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToken(event.target.value);
  };


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setLoading(true);
    setResponse(null);
    try {
      const res = await fetch("http://localhost:8000/api/getir/restaurants/status/close", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "token": token
        },
        // Remove body
      });
      const data = await res.json();
      
      if (!res.ok) {
        setResponse({ error: data.detail || `HTTP ${res.status}: ${res.statusText}` });
        return;
      }
      
      // Handle both string and object responses
      if (typeof data === "string") {
        setResponse({ message: data });
      } else {
        setResponse(data);
      }
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
        className="w-full max-w-sm p-8 bg-white rounded shadow-md flex flex-col gap-4"
        onSubmit={handleSubmit}
        aria-label="Close Restaurant form"
      >
        <h1 className="text-2xl font-bold text-center mb-4">Close Restaurant</h1>
        <label htmlFor="token" className="font-medium">Token</label>
        <input
          id="token"
          name="token"
          type="text"
          value={token}
          onChange={handleTokenChange}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Token"
          tabIndex={0}
          required
        />
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Submit close restaurant form"
          tabIndex={0}
          disabled={loading}
        >
          {loading ? "Closing..." : "Close Restaurant"}
        </button>
        {response && (
          <div
            className={`mt-4 p-3 rounded text-sm ${typeof response === "string" || (typeof response === "object" && response.error) ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
            aria-live="polite"
          >
            {typeof response === "string"
              ? response
              : response && typeof response === "object" && response.error
              ? response.error
              : response && typeof response === "object" && response.message
              ? response.message
              : null}
          </div>
        )}
      </form>
    </main>
  );
};

export default Page;
