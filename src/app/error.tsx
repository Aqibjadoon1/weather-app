"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen text-aether-text-primary flex flex-col items-center justify-center px-6 relative overflow-hidden sky-gradient" style={{ background: "linear-gradient(180deg, #2B6CB0 0%, #4A90D9 25%, #6DB3F2 50%, #8FC5F7 75%, #B0D9FA 100%)" }}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />
      <div className="relative z-10 text-center max-w-md">
        <p className="font-headline-lg text-[200px] leading-none font-bold text-aether-gold/10 select-none">500</p>
        <div className="relative -mt-16">
          <span className="material-symbols-outlined text-6xl text-aether-gold/30 mb-4">warning</span>
          <h1 className="font-headline-md text-4xl md:text-5xl text-aether-text-primary mb-4">Something Went Wrong</h1>
          <p className="text-lg text-aether-text-muted mb-2">Our weather systems encountered an unexpected disturbance.</p>
          <p className="text-sm text-aether-text-muted/60 mb-8">{error.digest ? `Error ID: ${error.digest}` : ""}</p>
          <button onClick={reset} className="inline-flex items-center gap-2 px-8 py-4 bg-aether-gold/10 backdrop-blur-xl border border-aether-gold/20 rounded-full text-aether-gold hover:bg-aether-gold/20 transition-all">
            <span className="material-symbols-outlined fill">refresh</span>
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
