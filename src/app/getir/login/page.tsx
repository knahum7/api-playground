"use client";
import React, { useState } from "react";
import Link from "next/link";

type LoginResponse = {
  restaurantId?: string;
  token?: string;
  error?: string;
};

const Page = () => {
  const [appSecretKey, setAppSecretKey] = useState("");
  const [restaurantSecretKey, setRestaurantSecretKey] = useState("");
  const [response, setResponse] = useState<LoginResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setter(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setLoading(true);
    setResponse(null);
    try {
      const res = await fetch("http://localhost:8000/api/getir/auth/login", {
        method: "POST",
        headers: {
          "Authorization":
            "Basic " + btoa(`${appSecretKey}:${restaurantSecretKey}`),
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
        aria-label="Login form"
      >
        <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
        <label htmlFor="appSecretKey" className="font-medium">
          App Secret Key
        </label>
        <input
          id="appSecretKey"
          name="appSecretKey"
          type="text"
          value={appSecretKey}
          onChange={handleInputChange(setAppSecretKey)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="App Secret Key"
          tabIndex={0}
          required
        />
        <label htmlFor="restaurantSecretKey" className="font-medium">
          Restaurant Secret Key
        </label>
        <input
          id="restaurantSecretKey"
          name="restaurantSecretKey"
          type="text"
          value={restaurantSecretKey}
          onChange={handleInputChange(setRestaurantSecretKey)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Restaurant Secret Key"
          tabIndex={0}
          required
        />
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Submit login form"
          tabIndex={0}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
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
                <div className="flex items-center gap-2">
                  <span className="font-medium">Token:</span> {response.token}
                  <button
                    type="button"
                    onClick={() => {
                      if (response.token) {
                        navigator.clipboard.writeText(response.token);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1500);
                      }
                    }}
                    className="ml-2 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Copy token to clipboard"
                    tabIndex={0}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div><span className="font-medium">Restaurant ID:</span> {response.restaurantId}</div>
              </div>
            )}
          </div>
        )}
      </form>
    </main>
  );
};

export default Page;
