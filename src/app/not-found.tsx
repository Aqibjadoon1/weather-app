import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen text-aether-text-primary flex flex-col items-center justify-center px-6 relative overflow-hidden sky-gradient" style={{ background: "linear-gradient(180deg, #2B6CB0 0%, #4A90D9 25%, #6DB3F2 50%, #8FC5F7 75%, #B0D9FA 100%)" }}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />
      <div className="relative z-10 text-center max-w-md">
        <p className="font-headline-lg text-[200px] leading-none font-bold text-aether-gold/10 select-none">404</p>
        <div className="relative -mt-16">
          <span className="material-symbols-outlined text-6xl text-aether-gold/30 mb-4">cloud_off</span>
          <h1 className="font-headline-md text-4xl md:text-5xl text-aether-text-primary mb-4">Page Not Found</h1>
          <p className="text-lg text-aether-text-muted mb-8">The page you are looking for has drifted away like a cloud.</p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-aether-gold rounded-full text-sm sm:text-base text-aether-bg font-label-bold whitespace-nowrap hover:brightness-110 transition-all">
            <span className="material-symbols-outlined fill text-aether-bg">arrow_back</span>
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
