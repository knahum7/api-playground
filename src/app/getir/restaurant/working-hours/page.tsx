"use client";
import Link from "next/link";
import React, { useState } from "react";

type WorkingHour = 
  | { day: number; closed: true }
  | { day: number; workingHours: { startTime: string; endTime: string } };

type ApiResponse = {
  restaurantWorkingHours?: WorkingHour[];
  courierWorkingHours?: WorkingHour[];
  error?: string;
};

const DAY_LABELS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const Page = () => {
  // Shared
  const [token, setToken] = useState("");

  // GET
  const [getResponse, setGetResponse] = useState<ApiResponse | null>(null);
  const [getError, setGetError] = useState<string | null>(null);
  const [getLoading, setGetLoading] = useState(false);

  // PUT
  const [putError, setPutError] = useState<string | null>(null);
  const [putLoading, setPutLoading] = useState(false);
  const [putResponse, setPutResponse] = useState<string | null>(null);
  const [editWorkingHours, setEditWorkingHours] = useState<
    WorkingHour[] | null
  >(null);

  // GET handler
  const handleGet = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGetLoading(true);
    setGetResponse(null);
    setGetError(null);
    setEditWorkingHours(null);
    console.log("GET - Sending token:", token);
    try {
      const res = await fetch("/api/getir/restaurants/working-hours", {
        method: "GET",
        headers: { Authorization: token },
      });
      console.log("GET - Response status:", res.status);
      const data = await res.json();
      console.log("GET - Response data:", data);
      if (data.error) {
        setGetError(data.error);
      } else {
        setGetResponse(data);
        setEditWorkingHours(
          data.restaurantWorkingHours?.map((h: WorkingHour) => {
            if ('closed' in h && h.closed) {
              return { day: h.day, closed: true };
                      } else if ('workingHours' in h) {
            return {
              day: h.day,
              workingHours: { ...h.workingHours }
            };
          } else {
            return { day: h.day, closed: true };
          }
          }) || null
        );
      }
    } catch (e) {
      console.log("GET - Network error:", e);
      setGetError("Network error");
    } finally {
      setGetLoading(false);
    }
  };

  // PUT handler
  const handlePut = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPutLoading(true);
    setPutError(null);
    setPutResponse(null);
    try {
      const res = await fetch("/api/getir/restaurants/working-hours", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({
          restaurantWorkingHours: editWorkingHours,
          courierWorkingHours: editWorkingHours,
        }),
      });
      const data = await res.json();
      if (typeof data === "string") {
        setPutResponse(data);
      } else if (data.error) {
        setPutError(data.error);
      } else {
        setPutResponse("Working hours updated successfully");
      }
    } catch (e) {
      setPutError("Network error");
    } finally {
      setPutLoading(false);
    }
  };

  // Edit handler
  const handleEditChange = (
    day: number,
    field: string,
    value: string | boolean
  ) => {
    if (!editWorkingHours) return;
    setEditWorkingHours(
      editWorkingHours.map((h) => {
        if (h.day === day) {
          if (field === 'closed' && value === true) {
            return { day: h.day, closed: true };
          } else if (field === 'closed' && value === false) {
            return {
              day: h.day,
              workingHours: { startTime: '09:00', endTime: '17:00' }
            };
          } else if ('workingHours' in h) {
            return {
              ...h,
              workingHours: {
                ...h.workingHours,
                [field]: value,
              },
            };
          }
        }
        return h;
      })
    );
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="absolute top-4 left-4">
        <Link
          href="/"
          aria-label="Go to Home"
          tabIndex={0}
          className="inline-block p-2 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-7 h-7 text-blue-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 12l9-9 9 9M4.5 10.5V21h15V10.5"
            />
          </svg>
        </Link>
      </div>
      <div className="w-full max-w-3xl p-8 bg-white rounded shadow-md flex flex-col gap-8">
        {/* GET Form */}
        <form
          className="flex flex-col gap-4"
          onSubmit={handleGet}
          aria-label="Getir Working Hours GET form"
        >
          <h2 className="text-xl font-bold text-blue-700">Get Working Hours</h2>
          <label htmlFor="token-get" className="font-medium">
            Token
          </label>
          <input
            id="token-get"
            name="token-get"
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Token"
            tabIndex={0}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Submit Getir working hours GET form"
            tabIndex={0}
            disabled={getLoading}
          >
            {getLoading ? "Fetching..." : "Fetch Working Hours"}
          </button>
          {(getError || getResponse) && (
            <div
              className={`mt-2 p-3 rounded text-sm ${
                getError
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
              aria-live="polite"
            >
              {getError ? (
                <span>{getError}</span>
              ) : (
                <div>
                  <div className="mb-2 font-medium">
                    Restaurant Working Hours:
                  </div>
                  <ul className="list-disc pl-5 mb-2">
                    {getResponse?.restaurantWorkingHours?.map((h: WorkingHour) => (
                      <li key={h.day}>
                        <span className="font-semibold">
                          {DAY_LABELS[h.day]}:
                        </span>{" "}
                        {'closed' in h && h.closed
                          ? "Closed"
                          : 'workingHours' in h ? `${h.workingHours.startTime} - ${h.workingHours.endTime}` : "No hours set"}
                      </li>
                    ))}
                  </ul>
                  <div className="mb-2 font-medium">
                    Restaurant Courier Hours:
                  </div>
                  <ul className="list-disc pl-5">
                    {getResponse?.courierWorkingHours?.map((h: WorkingHour) => (
                      <li key={h.day}>
                        <span className="font-semibold">
                          {DAY_LABELS[h.day]}:
                        </span>{" "}
                        {'closed' in h && h.closed
                          ? "Closed"
                          : 'workingHours' in h ? `${h.workingHours.startTime} - ${h.workingHours.endTime}` : "No hours set"}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </form>
        {/* PUT Form */}
        {editWorkingHours && (
          <form
            className="flex flex-col gap-4 border-t pt-8"
            onSubmit={handlePut}
            aria-label="Getir Working Hours PUT form"
          >
            <h2 className="text-xl font-bold text-pink-700">
              Update Working Hours
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {editWorkingHours.map((h) => (
                <div
                  key={h.day}
                  className="border rounded p-4 flex flex-col gap-2 bg-gray-50"
                >
                  <div className="font-semibold mb-1">{DAY_LABELS[h.day]}</div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={'closed' in h && h.closed}
                      onChange={(e) =>
                        handleEditChange(h.day, "closed", e.target.checked)
                      }
                      className="form-checkbox h-4 w-4 text-pink-600"
                      aria-label="Closed"
                    />
                    <span>Closed</span>
                  </label>
                  {!('closed' in h && h.closed) && 'workingHours' in h && (
                    <>
                      <label className="flex flex-col">
                        <span className="text-xs">Start Time</span>
                        <input
                          type="time"
                          value={h.workingHours.startTime}
                          onChange={(e) =>
                            handleEditChange(h.day, "startTime", e.target.value)
                          }
                          className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
                          aria-label="Start Time"
                        />
                      </label>
                      <label className="flex flex-col">
                        <span className="text-xs">End Time</span>
                        <input
                          type="time"
                          value={h.workingHours.endTime}
                          onChange={(e) =>
                            handleEditChange(h.day, "endTime", e.target.value)
                          }
                          className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
                          aria-label="End Time"
                        />
                      </label>
                    </>
                  )}
                </div>
              ))}
            </div>
            <button
              type="submit"
              className="bg-pink-600 text-white font-semibold py-2 rounded hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
              aria-label="Submit Getir working hours PUT form"
              tabIndex={0}
              disabled={putLoading}
            >
              {putLoading ? "Updating..." : "Update Working Hours"}
            </button>
            {(putError || putResponse) && (
              <div
                className={`mt-2 p-3 rounded text-sm ${
                  putError
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
                aria-live="polite"
              >
                {putError ? (
                  <span>{putError}</span>
                ) : (
                  <span>{putResponse}</span>
                )}
              </div>
            )}
          </form>
        )}
      </div>
    </main>
  );
};

export default Page;
