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
    <div className="min-h-screen bg-aether-bg flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-aether-bg-soft rounded-2xl p-10 border border-aether-gold/10">
          <h1 className="font-headline-md text-headline-md text-aether-text-primary">
            Reset Password
          </h1>
          <p className="font-body-md text-aether-text-muted mt-2">
            We&apos;ll send you a link to reset your password
          </p>

          {sent ? (
            <div className="mt-8 space-y-6">
              <div className="p-4 bg-aether-gold/10 border border-aether-gold/20 rounded-xl">
                <p className="text-sm font-label-bold text-aether-gold">
                  Reset link sent! Check your email inbox.
                </p>
              </div>
              <p className="text-center text-sm text-aether-text-muted">
                <Link href="/login" className="text-aether-gold font-label-bold hover:underline">
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

              <p className="mt-6 text-center text-sm text-aether-text-muted">
                <Link href="/login" className="text-aether-gold font-label-bold hover:underline">
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
