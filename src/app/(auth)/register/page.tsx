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
      {/* Left Side: Visual */}
      <section className="relative w-full md:w-1/2 h-[40vh] md:h-screen overflow-hidden bg-primary-fixed">
        <WeatherShader className="absolute inset-0 w-full h-full" skyTop={[0, 0.48, 1]} skyBottom={[0.97, 0.98, 1]} />
        <ThreeScene className="absolute inset-0 w-full h-full opacity-80 mix-blend-screen pointer-events-none" variant="sun" sunPosition={[3, 3, -5]} />
        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-10 z-10">
          <div className="max-w-xl">
            <h1 className="font-headline-lg text-headline-lg md:text-[64px] text-on-primary-fixed leading-tight tracking-tight mb-4">
              Precision meets<br /><span className="italic">Poetry.</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-primary-fixed-variant max-w-sm opacity-80">
              Aether Weather redefines the forecast, turning data into a tactile journey for the modern traveler.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full pb-8 pl-8 hidden md:block">
          <div className="flex items-center gap-4 text-on-primary-fixed-variant/50">
            <span className="w-12 h-px bg-current" />
            <span className="font-label-bold text-label-bold uppercase tracking-widest">Editorial Series Vol. 04</span>
          </div>
        </div>
      </section>

      {/* Right Side: Form */}
      <section className="w-full md:w-1/2 flex items-center justify-center px-6 py-10 md:p-12 lg:p-16 bg-surface">
        <div className="w-full max-w-xl">
          <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden paper-texture">
            <div className="absolute top-0 left-0 w-full h-1 bg-surface-variant overflow-hidden">
              <div className="h-full bg-primary w-1/3 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(0,88,188,0.5)]" id="progress-bar" />
            </div>
            <header className="mb-10 mt-4">
              <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">Join the Atmosphere</h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2">Create your account to start your journey.</p>
            </header>
            {error && (
              <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl">
                <p className="text-sm font-label-bold text-error">{error}</p>
              </div>
            )}

            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="flex items-center gap-6 group cursor-pointer">
                <div className="relative w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center border-2 border-dashed border-outline-variant transition-all group-hover:border-primary group-hover:bg-primary-fixed">
                  <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-3xl">add_a_photo</span>
                  <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full w-7 h-7 flex items-center justify-center border-2 border-surface">
                    <span className="material-symbols-outlined text-sm">add</span>
                  </div>
                </div>
                <div>
                  <span className="font-label-bold text-label-bold block uppercase tracking-widest text-on-surface-variant">Profile Picture</span>
                  <p className="text-sm text-outline">Optional &bull; JPEG or PNG</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                <div className="col-span-2">
                  <label className="font-label-bold text-label-bold text-on-surface-variant mb-2 block">Full Name</label>
                  <div className="border-b border-outline w-full py-2 flex items-center focus-within:border-primary transition-colors">
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Alex Sterling"
                      className="w-full bg-transparent border-none focus:ring-0 font-body-md text-on-surface placeholder:text-outline-variant p-0"
                    />
                  </div>
                  {formErrors.displayName && <p className="text-error font-label-bold text-[11px] mt-1">{formErrors.displayName}</p>}
                </div>
                <div className="md:col-span-1">
                  <label className="font-label-bold text-label-bold text-on-surface-variant mb-2 block">Email Address</label>
                  <div className="border-b border-outline w-full py-2 flex items-center focus-within:border-primary transition-colors">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@aether.com"
                      className="w-full bg-transparent border-none focus:ring-0 font-body-md text-on-surface placeholder:text-outline-variant p-0"
                    />
                  </div>
                  {formErrors.email && <p className="text-error font-label-bold text-[11px] mt-1">{formErrors.email}</p>}
                </div>
                <div className="md:col-span-1">
                  <label className="font-label-bold text-label-bold text-on-surface-variant mb-2 block">Default Location</label>
                  <div className="border-b border-outline w-full py-2 flex items-center focus-within:border-primary transition-colors">
                    <span className="material-symbols-outlined text-outline mr-2 text-xl">location_on</span>
                    <input type="text" placeholder="San Francisco, CA" className="w-full bg-transparent border-none focus:ring-0 font-body-md text-on-surface placeholder:text-outline-variant p-0" />
                  </div>
                </div>
                <div>
                  <label className="font-label-bold text-label-bold text-on-surface-variant mb-2 block">Password</label>
                  <div className="border-b border-outline w-full py-2 flex items-center focus-within:border-primary transition-colors">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                      className="w-full bg-transparent border-none focus:ring-0 font-body-md text-on-surface placeholder:text-outline-variant p-0"
                    />
                  </div>
                  {formErrors.password && <p className="text-error font-label-bold text-[11px] mt-1">{formErrors.password}</p>}
                </div>
                <div>
                  <label className="font-label-bold text-label-bold text-on-surface-variant mb-2 block">Confirm Password</label>
                  <div className="border-b border-outline w-full py-2 flex items-center focus-within:border-primary transition-colors">
                    <input type="password" placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" className="w-full bg-transparent border-none focus:ring-0 font-body-md text-on-surface placeholder:text-outline-variant p-0" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-4 border-y border-outline-variant/30">
                <div className="flex items-center gap-4">
                  <span className="font-label-bold text-label-bold text-on-surface-variant">Units Preference</span>
                  <div className="bg-surface-container rounded-full p-1 flex items-center">
                    <button
                      type="button"
                      onClick={() => setUnit("metric")}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${unit === "metric" ? "bg-primary text-white shadow-sm" : "text-on-surface-variant"}`}
                    >
                      Metric
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnit("imperial")}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${unit === "imperial" ? "bg-primary text-white shadow-sm" : "text-on-surface-variant"}`}
                    >
                      Imperial
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="terms" className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20" />
                  <label htmlFor="terms" className="text-sm text-on-surface-variant">I agree to the <Link href="#" className="text-primary font-bold hover:underline">Terms &amp; Conditions</Link></label>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="spring-button w-full bg-primary text-white py-5 px-8 rounded-full font-label-bold tracking-wide shadow-[0_10px_30px_rgba(0,88,188,0.2)] hover:shadow-[0_15px_40px_rgba(0,88,188,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
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
              </div>
            </form>

            <footer className="mt-8 text-center">
              <p className="text-on-surface-variant font-body-md">
                Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Sign In</Link>
              </p>
            </footer>
          </div>
        </div>
      </section>
    </main>
  );
}
