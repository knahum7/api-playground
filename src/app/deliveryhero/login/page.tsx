"use client";
import React, { useState } from "react";
import Link from "next/link";

type LoginResponse = {
  access_token?: string;
  expires_in?: number;
  token_type?: string;
  error?: string;
};

const Page = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);
      formData.append("grant_type", "client_credentials");

      const res = await fetch("/api/deliveryhero/v2/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setResponse({ error: data.error || `HTTP ${res.status}: ${res.statusText}` });
        return;
      }
      
      setResponse(data);
    } catch (error) {
      setResponse({ error: "Network error. Please check your connection and try again." });
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
        aria-label="DeliveryHero login form"
      >
        <h1 className="text-2xl font-bold text-center mb-4">DeliveryHero Login</h1>
        <label htmlFor="username" className="font-medium">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          value={username}
          onChange={handleInputChange(setUsername)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Username"
          tabIndex={0}
          required
        />
        <label htmlFor="password" className="font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={handleInputChange(setPassword)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Password"
          tabIndex={0}
          required
        />
        <button
          type="submit"
          className="mt-4 bg-blue-800 text-white font-semibold py-2 rounded hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-800"
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
                  <span className="font-medium">Access Token:</span> {response.access_token}
                  <button
                    type="button"
                    onClick={() => {
                      if (response.access_token) {
                        navigator.clipboard.writeText(response.access_token);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1500);
                      }
                    }}
                    className="ml-2 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Copy access token to clipboard"
                    tabIndex={0}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div><span className="font-medium">Expires In:</span> {response.expires_in} seconds</div>
                <div><span className="font-medium">Token Type:</span> {response.token_type}</div>
              </div>
            )}
          </div>
        )}
      </form>
    </main>
  );
};

export default Page; 