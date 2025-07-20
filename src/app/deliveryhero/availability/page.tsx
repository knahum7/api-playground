"use client";
import Link from "next/link";
import React, { useState } from "react";

const AVAILABILITY_STATES = [
  "CLOSED_UNTIL",
  "CLOSED",
  "INACTIVE",
  "UNKNOWN",
  "OPEN",
  "CLOSED_TODAY",
];

const CLOSING_REASONS = [
  "TOO_BUSY_NO_DRIVERS",
  "TOO_BUSY_KITCHEN",
  "UPDATES_IN_MENU",
  "TECHNICAL_PROBLEM",
  "CLOSED",
  "OTHER",
  "CHECK_IN_REQUIRED",
  "ORDER_FAILURE",
  "TOO_MANY_REJECTED_ORDERS",
  "UNREACHABLE",
  "COURIER_DELAYED_AT_PICKUP",
  "RESTRICTED_VISIBILITY",
  "BAD_WEATHER",
  "HOLIDAY_SPECIAL_DAY",
  "ONBOARDING",
  "OFFBOARDING",
  "RETENTION",
  "COMPLIANCE_ISSUES",
  "OWNERSHIP_CHANGE",
  "REFURBISHMENT",
  "FOOD_HYGIENE",
  "FRAUD",
  "RELIGIOUS_OBSERVANCE",
  "CHECK_IN_FAILED",
  "AREA_DISRUPTION",
];

const CLOSING_MINUTES = [15, 30, 45, 60, 120, 240, 720];

type ApiResponse = any;

const Page = () => {
  // Shared state
  const [chainCode, setChainCode] = useState("");
  const [posVendorId, setPosVendorId] = useState("");
  const [token, setToken] = useState("");

  // GET state
  const [getResponse, setGetResponse] = useState<ApiResponse | null>(null);
  const [getError, setGetError] = useState<string | null>(null);
  const [getLoading, setGetLoading] = useState(false);

  // PUT state
  const [availabilityState, setAvailabilityState] = useState(AVAILABILITY_STATES[0]);
  const [platformKey, setPlatformKey] = useState("");
  const [platformRestaurantId, setPlatformRestaurantId] = useState("");
  const [closedReason, setClosedReason] = useState(CLOSING_REASONS[0]);
  const [closingMinutes, setClosingMinutes] = useState(CLOSING_MINUTES[0]);
  const [putResponse, setPutResponse] = useState<ApiResponse | null>(null);
  const [putError, setPutError] = useState<string | null>(null);
  const [putLoading, setPutLoading] = useState(false);

  // GET handler
  const handleGet = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGetLoading(true);
    setGetResponse(null);
    setGetError(null);
    try {
      const res = await fetch(`http://localhost:8000/api/deliveryhero/v2/chains/${chainCode}/remoteVendors/${posVendorId}/availability`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (res.status === 204) {
        setGetResponse(null);
        setGetError("No data available (204) - Retry in a couple of seconds");
        return;
      }
      
      if (!res.ok) {
        const errorData = await res.json();
        setGetError(errorData.detail || `HTTP ${res.status}: ${res.statusText}`);
        return;
      }
      
      const data = await res.json();
      setGetResponse(data);
      
      // Auto-populate PUT form fields with the first restaurant if available
      if (data && Array.isArray(data) && data.length > 0) {
        const firstRestaurant = data[0];
        setPlatformKey(firstRestaurant.platformKey || "");
        setPlatformRestaurantId(firstRestaurant.platformRestaurantId || "");
        setAvailabilityState(firstRestaurant.availabilityState || AVAILABILITY_STATES[0]);
        if (firstRestaurant.closedReason) {
          setClosedReason(firstRestaurant.closedReason);
        }
      }
    } catch (e) {
      setGetError("Network error");
    } finally {
      setGetLoading(false);
    }
  };

  // PUT handler
  const handlePut = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPutLoading(true);
    setPutResponse(null);
    setPutError(null);
    try {
      const requestBody: any = {
        availabilityState,
        platformKey,
        platformRestaurantId,
      };

      // Add closedReason and closingMinutes for closing operations
      if (availabilityState === "CLOSED_UNTIL" || availabilityState === "CLOSED") {
        requestBody.closedReason = closedReason;
        if (availabilityState === "CLOSED_UNTIL") {
          requestBody.closingMinutes = closingMinutes;
        }
      }

      const res = await fetch(`http://localhost:8000/api/deliveryhero/v2/chains/${chainCode}/remoteVendors/${posVendorId}/availability`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        setPutError(errorData.detail || `HTTP ${res.status}: ${res.statusText}`);
        return;
      }
      
      const data = await res.json();
      setPutResponse(data);
    } catch (e) {
      setPutError("Network error");
    } finally {
      setPutLoading(false);
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
      <div className="w-full max-w-4xl p-8 bg-white rounded shadow-md flex flex-col gap-8">
        {/* GET Form */}
        <form
          className="flex flex-col gap-4"
          onSubmit={handleGet}
          aria-label="DeliveryHero Availability Status GET form"
        >
          <h2 className="text-xl font-bold text-blue-700">Get Availability Status</h2>
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="chainCode-get" className="font-medium">Chain Code</label>
              <input
                id="chainCode-get"
                name="chainCode-get"
                type="text"
                value={chainCode}
                onChange={e => setChainCode(e.target.value)}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                aria-label="Chain Code"
                tabIndex={0}
                required
              />
            </div>
            <div className="flex-1">
              <label htmlFor="posVendorId-get" className="font-medium">POS Vendor ID</label>
              <input
                id="posVendorId-get"
                name="posVendorId-get"
                type="text"
                value={posVendorId}
                onChange={e => setPosVendorId(e.target.value)}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                aria-label="POS Vendor ID"
                tabIndex={0}
                required
              />
            </div>
          </div>
          <label htmlFor="token-get" className="font-medium">Token</label>
          <input
            id="token-get"
            name="token-get"
            type="text"
            value={token}
            onChange={e => setToken(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Token"
            tabIndex={0}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Submit DeliveryHero availability status GET form"
            tabIndex={0}
            disabled={getLoading}
          >
            {getLoading ? "Fetching..." : "Fetch Availability Status"}
          </button>
          {(getError || getResponse) && (
            <div
              className={`mt-2 p-3 rounded text-sm ${getError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
              aria-live="polite"
            >
              {getError ? (
                <span>{getError}</span>
              ) : (
                <div>
                  <div className="mb-2 font-medium">
                    Found {Array.isArray(getResponse) ? getResponse.length : 0} restaurant(s):
                  </div>
                  <pre className="whitespace-pre-wrap break-all text-xs">{JSON.stringify(getResponse, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
        </form>

        {/* PUT Form */}
        <form
          className="flex flex-col gap-4 border-t pt-8"
          onSubmit={handlePut}
          aria-label="DeliveryHero Availability Status PUT form"
        >
          <h2 className="text-xl font-bold text-pink-700">Update Availability Status</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="chainCode-put" className="font-medium">Chain Code</label>
              <input
                id="chainCode-put"
                name="chainCode-put"
                type="text"
                value={chainCode}
                onChange={e => setChainCode(e.target.value)}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 w-full"
                aria-label="Chain Code"
                tabIndex={0}
                required
              />
            </div>
            <div>
              <label htmlFor="posVendorId-put" className="font-medium">POS Vendor ID</label>
              <input
                id="posVendorId-put"
                name="posVendorId-put"
                type="text"
                value={posVendorId}
                onChange={e => setPosVendorId(e.target.value)}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 w-full"
                aria-label="POS Vendor ID"
                tabIndex={0}
                required
              />
            </div>
          </div>
          
          <label htmlFor="token-put" className="font-medium">Token</label>
          <input
            id="token-put"
            name="token-put"
            type="text"
            value={token}
            onChange={e => setToken(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            aria-label="Token"
            tabIndex={0}
            required
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="availabilityState" className="font-medium">Availability State</label>
              <select
                id="availabilityState"
                name="availabilityState"
                value={availabilityState}
                onChange={e => setAvailabilityState(e.target.value)}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 w-full"
                aria-label="Availability State"
                tabIndex={0}
                required
              >
                {AVAILABILITY_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="platformKey" className="font-medium">Platform Key</label>
              <input
                id="platformKey"
                name="platformKey"
                type="text"
                value={platformKey}
                onChange={e => setPlatformKey(e.target.value)}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 w-full"
                aria-label="Platform Key"
                tabIndex={0}
                required
              />
            </div>
          </div>
          
          <label htmlFor="platformRestaurantId" className="font-medium">Platform Restaurant ID</label>
          <input
            id="platformRestaurantId"
            name="platformRestaurantId"
            type="text"
            value={platformRestaurantId}
            onChange={e => setPlatformRestaurantId(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            aria-label="Platform Restaurant ID"
            tabIndex={0}
            required
          />
          
          {/* Conditional fields for closing operations */}
          {(availabilityState === "CLOSED_UNTIL" || availabilityState === "CLOSED") && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="closedReason" className="font-medium">Closed Reason</label>
                <select
                  id="closedReason"
                  name="closedReason"
                  value={closedReason}
                  onChange={e => setClosedReason(e.target.value)}
                  className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 w-full"
                  aria-label="Closed Reason"
                  tabIndex={0}
                  required
                >
                  {CLOSING_REASONS.map(reason => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>
              
              {availabilityState === "CLOSED_UNTIL" && (
                <div>
                  <label htmlFor="closingMinutes" className="font-medium">Closing Minutes</label>
                  <select
                    id="closingMinutes"
                    name="closingMinutes"
                    value={closingMinutes}
                    onChange={e => setClosingMinutes(parseInt(e.target.value))}
                    className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 w-full"
                    aria-label="Closing Minutes"
                    tabIndex={0}
                    required
                  >
                    {CLOSING_MINUTES.map(minutes => (
                      <option key={minutes} value={minutes}>{minutes} minutes</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
          
          <button
            type="submit"
            className="bg-pink-600 text-white font-semibold py-2 rounded hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
            aria-label="Submit DeliveryHero availability status PUT form"
            tabIndex={0}
            disabled={putLoading}
          >
            {putLoading ? "Updating..." : "Update Availability Status"}
          </button>
          {(putError || putResponse) && (
            <div
              className={`mt-2 p-3 rounded text-sm ${putError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
              aria-live="polite"
            >
              {putError ? (
                <span>{putError}</span>
              ) : (
                <pre className="whitespace-pre-wrap break-all text-xs">{JSON.stringify(putResponse, null, 2)}</pre>
              )}
            </div>
          )}
        </form>
      </div>
    </main>
  );
};

export default Page; 