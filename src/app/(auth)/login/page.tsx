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
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Invalid email address";
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

  const handleGoogle = async () => {
    await signInWithGoogle();
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Left Side */}
      <section className="relative w-full md:w-1/2 h-[40vh] md:min-h-screen overflow-hidden bg-aether-bg">
        <WeatherShader className="absolute inset-0 w-full h-full" skyTop={[0.04, 0.05, 0.08]} skyBottom={[0.07, 0.09, 0.12]} />
        <ThreeScene className="absolute inset-0 w-full h-full opacity-80 mix-blend-screen pointer-events-none" variant="sun" sunPosition={[3, 3, -5]} />
        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-10 z-10">
          <div className="max-w-xl">
            <h1 className="font-headline-lg text-headline-lg md:text-[64px] text-aether-gold leading-tight tracking-tight mb-4">
              Accurate<br /><span className="italic">Weather</span>
            </h1>
            <p className="font-body-lg text-body-lg text-aether-text-muted max-w-sm">
              Precision in every breeze. Experience the next generation of atmospheric intelligence.
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
      <section className="w-full md:w-1/2 flex items-center justify-center px-4 sm:px-6 py-16 md:py-20 bg-aether-bg overflow-y-auto">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
          <header className="mb-8">
            <h2 className="font-headline-md text-headline-md text-aether-text-primary mb-2">Welcome Back</h2>
            <p className="text-aether-text-muted font-body-md">Enter your credentials to access your dashboard.</p>
          </header>

          <div className="bg-aether-bg-soft border border-aether-gold/10 rounded-2xl p-6 sm:p-8 md:p-10 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-aether-gold/20" />
            <div className="grain-texture absolute inset-0" />
            <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
              {error && (
                <div className="p-4 bg-error/10 border border-error/20 rounded-xl">
                  <p className="text-sm font-label-bold text-error">{error}</p>
                </div>
              )}

                <div className="relative floating-label-input">
                <input
                  id="email"
                  type="email"
                  placeholder=" "
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-0 py-3 bg-transparent border-0 border-b border-aether-gold/20 text-aether-text-primary focus:ring-0 focus:border-aether-gold peer transition-all"
                />
                <label htmlFor="email" className="absolute left-0 top-3 text-aether-text-muted font-body-md transition-all pointer-events-none origin-left">
                  Email Address
                </label>
                <div className="input-underline" />
                {formErrors.email && (
                  <span className="text-error font-label-bold text-[11px] mt-2 block animate-pulse">{formErrors.email}</span>
                )}
              </div>

              <div className="relative floating-label-input mt-8">
                <input
                  id="password"
                  type="password"
                  placeholder=" "
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-0 py-3 bg-transparent border-0 border-b border-aether-gold/20 text-aether-text-primary focus:ring-0 focus:border-aether-gold peer transition-all"
                />
                <label htmlFor="password" className="absolute left-0 top-3 text-aether-text-muted font-body-md transition-all pointer-events-none origin-left">
                  Password
                </label>
                <div className="input-underline" />
                {formErrors.password && (
                  <span className="text-error font-label-bold text-[11px] mt-2 block animate-pulse">{formErrors.password}</span>
                )}
              </div>

                <div className="flex items-center justify-between flex-wrap gap-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative w-5 h-5 flex items-center justify-center">
                    <input type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-aether-gold/30 rounded-sm checked:bg-aether-gold checked:border-aether-gold transition-all" />
                    <span className="material-symbols-outlined text-aether-bg text-[16px] absolute opacity-0 peer-checked:opacity-100 pointer-events-none">check</span>
                  </div>
                  <span className="text-aether-text-muted font-label-bold text-label-bold group-hover:text-aether-text-primary transition-colors">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-aether-gold font-label-bold text-label-bold hover:text-aether-gold-soft transition-colors">
                  Forgot Password?
                </Link>
              </div>

              <div className="space-y-4 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="spring-button w-full h-12 md:h-14 bg-aether-gold text-aether-bg rounded-full font-label-bold text-[14px] uppercase tracking-widest shadow-lg shadow-aether-gold/20 hover:shadow-xl hover:shadow-aether-gold/30 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleGoogle}
                  disabled={isLoading}
                  className="spring-button w-full h-12 md:h-14 bg-transparent border border-aether-gold text-aether-gold rounded-full font-label-bold text-[14px] uppercase tracking-widest hover:bg-aether-gold hover:text-aether-bg transition-all flex items-center justify-center gap-3 disabled:opacity-50"
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
          </div>

          <footer className="mt-8 text-center">
            <p className="font-body-md text-aether-text-muted">
              New to Accurate Weather?
              <Link href="/register" className="text-aether-gold font-bold hover:underline decoration-2 underline-offset-4 ml-1">
                Create Account
              </Link>
            </p>
            <div className="mt-6 pt-6 border-t border-aether-gold/10">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="spring-button w-full h-12 md:h-14 bg-transparent border border-aether-gold/40 text-aether-text-muted rounded-full font-label-bold text-[13px] uppercase tracking-widest hover:border-aether-gold hover:text-aether-gold transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">visibility</span>
                Continue as Guest
              </button>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}
