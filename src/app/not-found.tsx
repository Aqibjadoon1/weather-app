import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-aether-bg text-aether-text-primary flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-aether-bg/80 via-aether-bg/60 to-aether-bg" />
      <div className="relative z-10 text-center max-w-md">
        <p className="font-headline-lg text-[200px] leading-none font-bold text-aether-gold/10 select-none">404</p>
        <div className="relative -mt-16">
          <span className="material-symbols-outlined text-6xl text-aether-gold/30 mb-4">cloud_off</span>
          <h1 className="font-headline-md text-4xl md:text-5xl text-aether-text-primary mb-4">Page Not Found</h1>
          <p className="text-lg text-aether-text-muted mb-8">The page you are looking for has drifted away like a cloud.</p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 px-8 py-4 bg-aether-gold/10 backdrop-blur-xl border border-aether-gold/20 rounded-full text-aether-gold hover:bg-aether-gold/20 transition-all">
            <span className="material-symbols-outlined fill">arrow_back</span>
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
