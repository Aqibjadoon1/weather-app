"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email address");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // TODO: integrate with password reset API
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSent(true);
    } catch {
      setError("Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-surface rounded-2xl p-10 editorial-shadow">
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-on-surface">
            Reset Password
          </h1>
          <p className="font-sans text-lg text-on-surface-variant mt-2">
            We&apos;ll send you a link to reset your password
          </p>

          {sent ? (
            <div className="mt-8 space-y-6">
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
                <p className="text-sm font-label-bold text-primary">
                  Reset link sent! Check your email inbox.
                </p>
              </div>
              <p className="text-center text-sm text-on-surface-variant">
                <Link href="/login" className="text-primary font-label-bold hover:underline">
                  Back to Sign In
                </Link>
              </p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mt-6 p-4 bg-error/10 border border-error/20 rounded-xl">
                  <p className="text-sm font-label-bold text-error">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <Input
                  label="Email"
                  type="email"
                  icon="mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={error}
                  required
                />

                <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
                  Send Reset Link
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-on-surface-variant">
                <Link href="/login" className="text-primary font-label-bold hover:underline">
                  Back to Sign In
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
