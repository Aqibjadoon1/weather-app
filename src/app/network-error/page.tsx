"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function NetworkErrorPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center px-6 sky-gradient" style={{ background: "linear-gradient(180deg, #2B6CB0 0%, #4A90D9 25%, #6DB3F2 50%, #8FC5F7 75%, #B0D9FA 100%)" }}>
      <Card variant="default" padding="lg" className="max-w-md w-full text-center">
        <span className="material-symbols-outlined text-6xl text-aether-text-muted/40">signal_disconnected</span>
        <h1 className="text-2xl font-bold text-aether-text-primary mt-6">Connection Lost</h1>
        <p className="text-base text-aether-text-muted mt-3 leading-relaxed">
          Check your internet connection and try again. Some features may be unavailable until you&apos;re back online.
        </p>
        <div className="mt-8">
          <Button variant="primary" size="lg" fullWidth icon="refresh" onClick={() => router.refresh()}>
            Retry
          </Button>
        </div>
      </Card>
    </div>
  );
}
