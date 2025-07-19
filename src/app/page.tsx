import Link from "next/link";

// Add header for API Playground
export default function Home() {
  return (
    <>
      <header className="w-full bg-gradient-to-r from-blue-500 to-purple-600 py-6 shadow-md">
        <h1 className="text-4xl font-extrabold text-white text-center tracking-tight" tabIndex={0} aria-label="API Playground">
          API Playground
        </h1>
      </header>
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="flex flex-col md:flex-row gap-8 p-8 bg-white rounded shadow-md">
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-3xl font-bold mb-4">Getir API</h1>
            <Link
              href="/getir/login"
              className="w-full text-center bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Go to Login page"
              tabIndex={0}
            >
              Get Login Token
            </Link>
            <Link
              href="/getir/restaurant"
              className="w-full text-center bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="Go to Restaurant page"
              tabIndex={0}
            >
              Get Restaurant Status
            </Link>
            <Link
              href="/getir/restaurant/status/close"
              className="w-full text-center bg-red-600 text-white font-semibold py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Go to Close Restaurant page"
              tabIndex={0}
            >
              Close Restaurant
            </Link>
            <Link
              href="/getir/restaurant/status/open"
              className="w-full text-center bg-yellow-600 text-white font-semibold py-2 rounded hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              aria-label="Go to Open Restaurant page"
              tabIndex={0}
            >
              Open Restaurant
            </Link>
            <Link
              href="/getir/restaurant/working-hours"
              className="w-full text-center bg-indigo-600 text-white font-semibold py-2 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Go to Getir Working Hours page"
              tabIndex={0}
            >
              Get/Modify Working Hours
            </Link>
          </div>
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-3xl font-bold mb-4">Trendyol API</h1>
            <Link
              href="/trendyol/suppliers/10/stores"
              className="w-full text-center bg-purple-600 text-white font-semibold py-2 rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Go to Trendyol Supplier Stores page"
              tabIndex={0}
            >
              Get Supplier Stores
            </Link>
            <Link
              href="/trendyol/suppliers/10/stores/1/status"
              className="w-full text-center bg-pink-600 text-white font-semibold py-2 rounded hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
              aria-label="Go to Trendyol Store Status page"
              tabIndex={0}
            >
              Modify Store Status
            </Link>
            <Link
              href="/trendyol/suppliers/mock-supplier/stores/mock-store/working-hours"
              className="w-full text-center bg-purple-800 text-white font-semibold py-2 rounded hover:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-800"
              aria-label="Go to Trendyol Store Working Hours page"
              tabIndex={0}
            >
              Modify Working Hours
            </Link>
          </div>
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-3xl font-bold mb-4">Delivery Hero API</h1>
            <Link
              href="/deliveryhero/login"
              className="w-full text-center bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Go to DeliveryHero Login page"
              tabIndex={0}
            >
              Get Access Token
            </Link>
            <Link
              href="/deliveryhero/availability-status/chain-1/pos-1"
              className="w-full text-center bg-blue-800 text-white font-semibold py-2 rounded hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-800"
              aria-label="Go to DeliveryHero Availability Status page"
              tabIndex={0}
            >
              Get Availability Status
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
