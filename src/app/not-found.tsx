import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#141313] text-[#e5e2e1] font-['Hanken_Grotesk',sans-serif] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#141313]/80 via-[#141313]/60 to-[#141313]" />
      <div className="relative z-10 text-center max-w-md">
        <p className="font-['Libre_Caslon_Text',serif] text-[200px] leading-none font-bold text-white/5 select-none">404</p>
        <div className="relative -mt-16">
          <span className="material-symbols-outlined text-6xl text-white/30 mb-4">cloud_off</span>
          <h1 className="font-['Libre_Caslon_Text',serif] text-4xl md:text-5xl font-bold text-white mb-4">Page Not Found</h1>
          <p className="text-lg text-white/60 mb-8">The page you are looking for has drifted away like a cloud.</p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white hover:bg-white/20 transition-all">
            <span className="material-symbols-outlined fill">arrow_back</span>
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
