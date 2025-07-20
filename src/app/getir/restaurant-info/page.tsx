"use client";
import React, { useState } from "react";
import Link from "next/link";

type RestaurantResponse = {
  id?: string;
  averagePreparationTime?: number;
  status?: number;
  isCourierAvailable?: boolean;
  name?: string;
  isStatusChangedByUser?: boolean;
  closedSource?: number;
  error?: string;
};

const Page = () => {
  const [token, setToken] = useState("");
  const [response, setResponse] = useState<RestaurantResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToken(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setLoading(true);
    setResponse(null);
    try {
      const res = await fetch("http://localhost:8000/api/getir/restaurants", {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          "token": token
        },
      });
      const data = await res.json();
      
      if (!res.ok) {
        setResponse({ error: data.detail || `HTTP ${res.status}: ${res.statusText}` });
        return;
      }
      
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
        className="w-full max-w-sm p-8 bg-white rounded shadow-md flex flex-col gap-4"
        onSubmit={handleSubmit}
        aria-label="Restaurant fetch form"
      >
        <h1 className="text-2xl font-bold text-center mb-4">Fetch Restaurant</h1>
        <label htmlFor="token" className="font-medium">
          Token
        </label>
        <input
          id="token"
          name="token"
          type="text"
          value={token}
          onChange={handleInputChange}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Token"
          tabIndex={0}
          required
        />
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Submit token form"
          tabIndex={0}
          disabled={loading}
        >
          {loading ? "Fetching..." : "Fetch Restaurant"}
        </button>
        {response && (
          <div
            className={`mt-4 p-3 rounded text-sm ${response.error ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
            aria-live="polite"
          >
            {response.error ? (
              <span>{response.error}</span>
            ) : (
              <div className="space-y-1">
                <div><span className="font-medium">ID:</span> {response.id}</div>
                <div><span className="font-medium">Name:</span> {response.name}</div>
                <div><span className="font-medium">Average Preparation Time:</span> {response.averagePreparationTime} min</div>
                <div><span className="font-medium">Status:</span> {response.status}</div>
                <div><span className="font-medium">Courier Available:</span> {response.isCourierAvailable ? "Yes" : "No"}</div>
                <div><span className="font-medium">Status Changed By User:</span> {response.isStatusChangedByUser ? "Yes" : "No"}</div>
                <div><span className="font-medium">Closed Source:</span> {response.closedSource}</div>
              </div>
            )}
          </div>
        )}
      </form>
    </main>
  );
};

export default Page;
