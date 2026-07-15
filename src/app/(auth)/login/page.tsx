"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthentication } from "@/hooks/useAuthentication";
import WeatherShader from "@/components/animations/WeatherShader";
import ThreeScene from "@/components/animations/ThreeScene";

export default function LoginPage() {
  const router = useRouter();
  const { login, signInWithGoogle, isLoading, error, user } = useAuthentication();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (user) {
      const params = new URLSearchParams(window.location.search);
      router.push(params.get("redirect") || "/dashboard");
    } else {
      setChecking(false);
    }
  }, [user, router]);

  if (checking) return null;

  const validate = () => {
    const errors: { email?: string; password?: string } = {};
    if (!email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Enter a valid email address";
    if (!password) errors.password = "Password is required";
    else if (password.length < 6) errors.password = "Password must be at least 6 characters";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await login(email, password);
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row">

      {/* ── Left panel — editorial visual ────────────── */}
      <section
        className="relative w-full md:w-1/2 h-[45vh] md:min-h-screen overflow-hidden"
        aria-hidden="true"
      >
        <WeatherShader
          className="absolute inset-0 w-full h-full"
          skyTop={[0.04, 0.05, 0.08]}
          skyBottom={[0.07, 0.09, 0.12]}
        />
        <ThreeScene
          className="absolute inset-0 w-full h-full opacity-80 mix-blend-screen pointer-events-none"
          variant="sun"
          sunPosition={[3, 3, -5]}
        />

        {/* Gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/20" />

        {/* Copy */}
        <div className="absolute inset-0 flex flex-col justify-end md:justify-center px-8 md:px-12 pb-10 md:pb-0 z-10">
          <div className="max-w-sm">
            <div className="flex items-center gap-3 mb-6 hidden md:flex">
              <div className="w-9 h-9 rounded-xl bg-aether-gold/20 backdrop-blur-sm border border-aether-gold/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-aether-gold text-[18px] fill">wb_sunny</span>
              </div>
              <span className="font-headline-md text-sm text-aether-text-primary tracking-tight">Accurate Weather</span>
            </div>
            <h1 className="font-headline-lg text-[40px] md:text-[56px] text-aether-gold leading-[1.05] tracking-tight mb-4">
              Accurate<br />
              <em>Weather</em>
            </h1>
            <p className="font-body-lg text-sm text-aether-text-muted leading-relaxed max-w-xs">
              Precision in every breeze. Experience the next generation of atmospheric intelligence.
            </p>
          </div>
        </div>

        {/* Editorial footnote */}
        <div className="absolute bottom-8 left-8 hidden md:flex items-center gap-3">
          <span className="w-8 h-px bg-aether-gold/30" />
          <span className="font-label-bold text-[9px] uppercase tracking-widest text-aether-gold/40">
            Editorial Series Vol. 04
          </span>
        </div>
      </section>

      {/* ── Right panel — sign-in form ────────────────── */}
      <section className="w-full md:w-1/2 flex items-center justify-center px-5 sm:px-8 py-12 md:py-16 overflow-y-auto bg-aether-bg">
        <div className="w-full max-w-sm">

          {/* Header */}
          <div className="mb-8">
            <h2 className="font-headline-md text-2xl text-aether-text-primary leading-tight">
              Welcome back
            </h2>
            <p className="font-body-md text-sm text-aether-text-muted mt-1.5">
              Sign in to your account to continue
            </p>
          </div>

          {/* Global error */}
          {error && (
            <div className="mb-5 p-4 bg-red-500/8 border border-red-500/20 rounded-xl flex items-start gap-3">
              <span className="material-symbols-outlined text-red-400 fill text-[18px] mt-0.5 flex-shrink-0">error</span>
              <p className="font-body-md text-sm text-red-400 leading-relaxed">{error}</p>
            </div>
          )}

          {/* Form card */}
          <div className="glass-card-elevated rounded-3xl p-6 sm:p-8 card-accent-border">
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>

              {/* Email */}
              <div>
                <label htmlFor="email" className="font-label-bold text-[10px] uppercase tracking-widest text-aether-text-muted mb-2 block">
                  Email Address
                </label>
                <div className={[
                  "flex items-center glass-inset rounded-xl px-4 transition-all duration-200",
                  "focus-within:ring-2 focus-within:ring-aether-gold/40",
                  formErrors.email ? "ring-2 ring-red-500/40" : "",
                ].join(" ")}>
                  <span className="material-symbols-outlined text-aether-text-muted text-[16px] fill mr-3 flex-shrink-0">mail</span>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 py-3 bg-transparent border-none outline-none font-body-md text-sm text-aether-text-primary placeholder-aether-text-muted/50"
                  />
                </div>
                {formErrors.email && (
                  <p className="font-label-bold text-[11px] text-red-400 mt-1.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] fill">error</span>
                    {formErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="font-label-bold text-[10px] uppercase tracking-widest text-aether-text-muted">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="font-label-bold text-[11px] text-aether-gold hover:text-aether-gold-soft transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold focus-visible:rounded-sm"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className={[
                  "flex items-center glass-inset rounded-xl px-4 transition-all duration-200",
                  "focus-within:ring-2 focus-within:ring-aether-gold/40",
                  formErrors.password ? "ring-2 ring-red-500/40" : "",
                ].join(" ")}>
                  <span className="material-symbols-outlined text-aether-text-muted text-[16px] fill mr-3 flex-shrink-0">lock</span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex-1 py-3 bg-transparent border-none outline-none font-body-md text-sm text-aether-text-primary placeholder-aether-text-muted/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="ml-2 text-aether-text-muted hover:text-aether-text-primary transition-colors focus-visible:outline-none"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
                {formErrors.password && (
                  <p className="font-label-bold text-[11px] text-red-400 mt-1.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] fill">error</span>
                    {formErrors.password}
                  </p>
                )}
              </div>

              {/* Remember me */}
              <label className="flex items-center gap-3 cursor-pointer group w-fit">
                <div className="relative w-5 h-5 flex-shrink-0">
                  <input
                    type="checkbox"
                    className="peer appearance-none w-5 h-5 glass-inset rounded-md border-2 border-aether-gold/30 checked:bg-aether-gold checked:border-aether-gold transition-all cursor-pointer"
                  />
                  <span className="material-symbols-outlined text-aether-bg text-[13px] absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 pointer-events-none fill">
                    check
                  </span>
                </div>
                <span className="font-label-bold text-[12px] text-aether-text-muted group-hover:text-aether-text-primary transition-colors">
                  Remember me
                </span>
              </label>

              {/* Primary CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="spring-button w-full h-12 bg-aether-gold text-aether-bg rounded-xl font-label-bold text-[13px] uppercase tracking-widest shadow-lg shadow-aether-gold/20 hover:shadow-xl hover:shadow-aether-gold/30 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-aether-bg/30 border-t-aether-bg rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <span className="flex-1 h-px bg-white/8" />
                <span className="font-label-bold text-[10px] uppercase tracking-widest text-aether-text-muted">or</span>
                <span className="flex-1 h-px bg-white/8" />
              </div>

              {/* Google */}
              <button
                type="button"
                onClick={async () => { await signInWithGoogle(); }}
                disabled={isLoading}
                className="spring-button w-full h-12 glass-inset rounded-xl font-label-bold text-[13px] text-aether-text-primary hover:border-aether-gold/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>
            </form>
          </div>

          {/* Footer links */}
          <div className="mt-6 space-y-4">
            <p className="text-center font-body-md text-sm text-aether-text-muted">
              New here?{" "}
              <Link
                href="/register"
                className="text-aether-gold font-semibold hover:underline underline-offset-4 decoration-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold focus-visible:rounded-sm"
              >
                Create an account
              </Link>
            </p>

            <div className="pt-4 border-t border-white/6">
              <button
                type="button"
                onClick={() => router.push("/dashboard?guest=true")}
                className="spring-button w-full h-12 glass-card-elevated rounded-xl font-label-bold text-[12px] uppercase tracking-widest text-aether-text-muted hover:text-aether-gold hover:border-aether-gold/30 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
