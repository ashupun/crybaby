import Link from "next/link";

const features = [
  {
    icon: "✍️",
    title: "Write It Out",
    desc: "Journal your thoughts with mood tracking. View entries by list or calendar.",
    link: "/app",
  },
  {
    icon: "🎨",
    title: "Draw It Out",
    desc: "Sketch, scribble, release. Pick colors, adjust brush size, save your art.",
    link: "/draw",
  },
  {
    icon: "🎧",
    title: "Feel the Calm",
    desc: "Rain, forest, ocean, wind, fire, water. Ambient sounds to soothe your mind.",
    link: "/feel",
  },
  {
    icon: "🔒",
    title: "Completely Private",
    desc: "Everything stays on your device. No accounts, no tracking, no cloud.",
    link: null,
  },
];

const steps = [
  { num: "01", title: "Pick your vibe", desc: "Write, draw, or listen to calming sounds" },
  { num: "02", title: "Express yourself", desc: "No rules, no judgment, just you" },
  { num: "03", title: "Feel better", desc: "Release what's weighing you down" },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-16 px-6 py-12 md:px-20 lg:px-32">
      <section className="hero-card flex flex-col items-center text-center max-w-2xl mx-auto">
        <span className="hero-subtitle text-base font-sans tracking-widest uppercase opacity-40 dark:text-white mb-6">
          A gentle space for your thoughts
        </span>
        <h1 className="hero-title text-5xl md:text-6xl lg:text-7xl leading-tight dark:text-white">
          Your safe space to{" "}
          <span className="italic opacity-70">let it all out</span>
        </h1>
        <p className="hero-subtitle mt-8 text-xl md:text-2xl opacity-50 dark:text-white leading-relaxed max-w-lg">
          Write, draw, or listen to calming sounds. Everything stays on your device.
          <br />
          No accounts. No judgment.
        </p>
        <Link
          href="/app"
          className="hero-cta mt-10 bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] px-10 py-4 rounded-full font-sans text-base tracking-wide transition-all duration-500"
        >
          Get Started
        </Link>
      </section>

      <section className="flex justify-center">
        <div className="hero-image">
          <img
            src="/cliff.png"
            alt="Cryba.by"
            className="w-64 md:w-80 object-contain opacity-90"
          />
        </div>
      </section>

      <section className="features-section grid md:grid-cols-2 gap-6 max-w-3xl mx-auto w-full">
        {features.map((feature, index) => {
          const Content = (
            <>
              <span className="text-3xl">{feature.icon}</span>
              <div>
                <p className="text-lg font-medium dark:text-white">{feature.title}</p>
                <p className="text-base opacity-50 dark:text-white mt-2 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </>
          );
          return feature.link ? (
            <Link
              key={feature.title}
              href={feature.link}
              className="feature-card group flex items-start gap-5 p-8 rounded-2xl bg-[#faf9f7] dark:bg-[#222] border border-black/5 dark:border-white/5"
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              {Content}
            </Link>
          ) : (
            <div
              key={feature.title}
              className="feature-card group flex items-start gap-5 p-8 rounded-2xl bg-[#faf9f7] dark:bg-[#222] border border-black/5 dark:border-white/5"
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              {Content}
            </div>
          );
        })}
      </section>

      <section className="steps-section max-w-2xl mx-auto w-full">
        <p className="text-center text-base font-sans tracking-widest uppercase opacity-30 dark:text-white mb-10">
          How it works
        </p>
        <div className="flex flex-col gap-4">
          {steps.map((step, index) => (
            <div
              key={step.num}
              className="step-card flex items-center gap-8 p-6 rounded-2xl bg-[#faf9f7] dark:bg-[#222] border border-black/5 dark:border-white/5"
              style={{ animationDelay: `${0.5 + index * 0.1}s` }}
            >
              <span className="text-3xl font-light opacity-15 dark:text-white font-sans">
                {step.num}
              </span>
              <div>
                <p className="text-lg font-medium dark:text-white">{step.title}</p>
                <p className="text-base opacity-50 dark:text-white mt-1">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="quote-section max-w-2xl mx-auto text-center py-12">
        <p className="text-2xl md:text-3xl italic opacity-50 dark:text-white leading-relaxed">
          "Let it out. Feel lighter."
        </p>
      </section>
    </div>
  );
}
