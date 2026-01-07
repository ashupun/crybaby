import Link from "next/link";

export default function Home() {
  return (
    <section className="px-6 py-4 md:px-20 lg:px-32 h-full">
      <div className="bg-[#f3f0e9] dark:bg-[#2a2a2a] rounded-3xl p-8 md:p-16 h-full overflow-hidden">
        <div className="grid md:grid-cols-2 md:items-center h-full gap-8">
          <div>
            <h1 className="text-4xl leading-tight md:text-5xl md:leading-tight dark:text-white">
              Your safe space to <span className="font-bold">let it all out</span>
            </h1>
            <p className="mt-4 text-lg opacity-70 dark:text-white">
              Anonymous journaling. No accounts. Everything stays on your device.
            </p>
            <Link
              href="/app"
              className="inline-block mt-8 bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] px-8 py-4 rounded-full hover:opacity-90 font-sans text-sm font-medium"
            >
              Start Writing
            </Link>
            <div className="mt-8 space-y-3 font-sans text-[15px] dark:text-white">
              <div className="flex items-center gap-3"><span>✦</span><span>No sign up required</span></div>
              <div className="flex items-center gap-3"><span>✦</span><span>Your entries never leave your device</span></div>
              <div className="flex items-center gap-3"><span>✦</span><span>Track your mood over time</span></div>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <img src="/cliff.png" alt="Cryba.by" className="w-64 md:w-full max-w-md object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
}
