import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-7xl items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <img
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
            />
          </a>
        </div>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:translate-y-1/4 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <img
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
        />
      </div>

      <div className="mb-32 grid text-center lg:max-w-7xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left gap-8">
        {/* Getir API Column */}
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className={`mb-3 text-2xl font-semibold text-purple-600`}>
            Getir API{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50 mb-4`}>
            Turkish food delivery platform integration
          </p>
          <div className="space-y-2">
            <Link
              href="/getir/login"
              className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              • Login Authentication
            </Link>
            <Link
              href="/getir/restaurant"
              className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              • Restaurant Information
            </Link>
            <Link
              href="/getir/restaurant/status/open"
              className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              • Open Restaurant Status
            </Link>
            <Link
              href="/getir/restaurant/status/close"
              className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              • Close Restaurant Status
            </Link>
            <Link
              href="/getir/restaurant/working-hours"
              className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              • Working Hours Management
            </Link>
          </div>
        </div>

        {/* Trendyol API Column */}
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className={`mb-3 text-2xl font-semibold text-orange-600`}>
            Trendyol API{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50 mb-4`}>
            Turkish e-commerce platform integration
          </p>
          <div className="space-y-2">
            <Link
              href="/trendyol/suppliers/123/stores"
              className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              • Supplier Stores List
            </Link>
            <Link
              href="/trendyol/suppliers/123/stores/456/status"
              className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              • Store Status Management
            </Link>
            <Link
              href="/trendyol/suppliers/123/stores/456/working-hours"
              className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              • Store Working Hours
            </Link>
          </div>
        </div>

        {/* DeliveryHero API Column */}
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className={`mb-3 text-2xl font-semibold text-red-600`}>
            DeliveryHero API{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50 mb-4`}>
            Global food delivery platform integration
          </p>
          <div className="space-y-2">
            <Link
              href="/deliveryhero/v2/login"
              className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              • Login Authentication
            </Link>
            <Link
              href="/deliveryhero/v2/chains/chain123/remoteVendors/vendor456/availability"
              className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              • Availability Status Management
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
