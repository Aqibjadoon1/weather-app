"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthentication } from "@/hooks/useAuthentication";
import WeatherShader from "@/components/animations/WeatherShader";
import ThreeScene from "@/components/animations/ThreeScene";

export default function RegisterPage() {
  const router = useRouter();
  const { register, signInWithGoogle, isLoading, error } = useAuthentication();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState<{ displayName?: string; email?: string; password?: string }>({});

  const validate = () => {
    const errors: { displayName?: string; email?: string; password?: string } = {};
    if (!displayName) errors.displayName = "Name is required";
    if (!email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Invalid email address";
    if (!password) errors.password = "Password is required";
    else if (password.length < 8) errors.password = "Password must be at least 8 characters";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await register(email, password, displayName);
    if (!error) router.push("/dashboard");
  };

  const handleGoogle = async () => {
    await signInWithGoogle();
    if (!error) router.push("/dashboard");
  };

  const [unit, setUnit] = useState<"metric" | "imperial">("metric");

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Left Side */}
      <section className="relative w-full md:w-1/2 h-[40vh] md:min-h-screen overflow-hidden bg-aether-bg">
        <WeatherShader className="absolute inset-0 w-full h-full" skyTop={[0.04, 0.05, 0.08]} skyBottom={[0.07, 0.09, 0.12]} />
        <ThreeScene className="absolute inset-0 w-full h-full opacity-80 mix-blend-screen pointer-events-none" variant="sun" sunPosition={[3, 3, -5]} />
        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-10 z-10">
          <div className="max-w-xl">
            <h1 className="font-headline-lg text-headline-lg md:text-[64px] text-aether-gold leading-tight tracking-tight mb-4">
              Precision meets<br /><span className="italic">Poetry.</span>
            </h1>
            <p className="font-body-lg text-body-lg text-aether-text-muted max-w-sm">
              Aether Weather redefines the forecast, turning data into a tactile journey for the modern traveler.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full pb-8 pl-8 hidden md:block">
          <div className="flex items-center gap-4 text-aether-gold/30">
            <span className="w-12 h-px bg-aether-gold/30" />
            <span className="font-label-bold text-label-bold uppercase tracking-widest">Editorial Series Vol. 04</span>
          </div>
        </div>
      </section>

      {/* Right Side */}
      <section className="w-full md:w-1/2 flex items-start justify-center px-4 sm:px-6 py-8 md:py-10 bg-aether-bg overflow-y-auto">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
          <div className="bg-aether-bg-soft border border-aether-gold/10 rounded-2xl p-6 sm:p-8 md:p-10 relative overflow-hidden">
            <header className="mb-6">
              <h1 className="font-headline-lg text-headline-lg text-aether-gold tracking-tight">Join the Atmosphere</h1>
              <p className="font-body-md text-body-md text-aether-text-muted mt-2">Create your account to start your journey.</p>
            </header>
            {error && (
              <div className="mb-4 p-4 bg-error/10 border border-error/20 rounded-xl">
                <p className="text-sm font-label-bold text-error">{error}</p>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="relative w-16 h-16 rounded-full bg-aether-bg flex items-center justify-center border-2 border-dashed border-aether-gold/30 transition-all group-hover:border-aether-gold group-hover:bg-aether-gold/5 flex-shrink-0">
                  <span className="material-symbols-outlined text-aether-text-muted group-hover:text-aether-gold transition-colors text-2xl">add_a_photo</span>
                  <div className="absolute -bottom-1 -right-1 bg-aether-gold text-aether-bg rounded-full w-6 h-6 flex items-center justify-center border-2 border-aether-bg">
                    <span className="material-symbols-outlined text-xs">add</span>
                  </div>
                </div>
                <div>
                  <span className="font-label-bold text-label-bold block uppercase tracking-widest text-aether-text-muted">Profile Picture</span>
                  <p className="text-xs text-aether-text-muted/60">Optional &bull; JPEG or PNG</p>
                </div>
              </div>

              <div>
                <label className="font-label-bold text-label-bold text-aether-text-muted mb-2 block">Full Name</label>
                <div className="border-b border-aether-gold/20 w-full py-2 flex items-center focus-within:border-aether-gold transition-colors">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Alex Sterling"
                    className="w-full bg-transparent border-none focus:ring-0 font-body-md text-aether-text-primary placeholder:text-aether-text-muted/40 p-0"
                  />
                </div>
                {formErrors.displayName && <p className="text-error font-label-bold text-[11px] mt-1">{formErrors.displayName}</p>}
              </div>

              <div>
                <label className="font-label-bold text-label-bold text-aether-text-muted mb-2 block">Email Address</label>
                <div className="border-b border-aether-gold/20 w-full py-2 flex items-center focus-within:border-aether-gold transition-colors">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@aether.com"
                    className="w-full bg-transparent border-none focus:ring-0 font-body-md text-aether-text-primary placeholder:text-aether-text-muted/40 p-0"
                  />
                </div>
                {formErrors.email && <p className="text-error font-label-bold text-[11px] mt-1">{formErrors.email}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-label-bold text-label-bold text-aether-text-muted mb-2 block">Password</label>
                  <div className="border-b border-aether-gold/20 w-full py-2 flex items-center focus-within:border-aether-gold transition-colors">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                      className="w-full bg-transparent border-none focus:ring-0 font-body-md text-aether-text-primary placeholder:text-aether-text-muted/40 p-0"
                    />
                  </div>
                  {formErrors.password && <p className="text-error font-label-bold text-[11px] mt-1">{formErrors.password}</p>}
                </div>
                <div>
                  <label className="font-label-bold text-label-bold text-aether-text-muted mb-2 block">Confirm Password</label>
                  <div className="border-b border-aether-gold/20 w-full py-2 flex items-center focus-within:border-aether-gold transition-colors">
                    <input type="password" placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" className="w-full bg-transparent border-none focus:ring-0 font-body-md text-aether-text-primary placeholder:text-aether-text-muted/40 p-0" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-y border-aether-gold/10">
                <div className="flex items-center gap-3">
                  <span className="font-label-bold text-label-bold text-aether-text-muted">Units</span>
                  <div className="bg-aether-bg rounded-full p-1 flex items-center border border-aether-gold/10">
                    <button
                      type="button"
                      onClick={() => setUnit("metric")}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${unit === "metric" ? "bg-aether-gold text-aether-bg shadow-sm" : "text-aether-text-muted"}`}
                    >
                      Metric
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnit("imperial")}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${unit === "imperial" ? "bg-aether-gold text-aether-bg shadow-sm" : "text-aether-text-muted"}`}
                    >
                      Imperial
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="terms" className="w-4 h-4 rounded border-aether-gold/30 text-aether-gold focus:ring-aether-gold/20" />
                  <label htmlFor="terms" className="text-xs text-aether-text-muted">I agree to the <Link href="#" className="text-aether-gold font-bold hover:underline">Terms</Link></label>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="spring-button w-full bg-aether-gold text-aether-bg py-4 px-8 rounded-full font-label-bold tracking-wide shadow-[0_10px_30px_rgba(201,154,62,0.2)] hover:shadow-[0_15px_40px_rgba(201,154,62,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleGoogle}
                  disabled={isLoading}
                  className="spring-button mt-3 w-full h-12 bg-transparent border border-aether-gold text-aether-gold rounded-full font-label-bold text-[14px] uppercase tracking-widest hover:bg-aether-gold hover:text-aether-bg transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>
              </div>
            </form>

            <footer className="mt-6 text-center">
              <p className="text-aether-text-muted font-body-md">
                Already have an account? <Link href="/login" className="text-aether-gold font-bold hover:underline">Sign In</Link>
              </p>
            </footer>
          </div>
        </div>
      </section>
    </main>
  );
}
