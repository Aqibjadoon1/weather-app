"use client";

import Link from "next/link";

interface EmptyState {
  icon: string;
  title: string;
  description: string;
  action?: { label: string; href: string };
}

const emptyStates: EmptyState[] = [
  {
    icon: "cloud_off",
    title: "No Weather Data Yet",
    description: "Start by adding your first city to get personalized weather forecasts and alerts.",
    action: { label: "Add City", href: "/dashboard/search" },
  },
  {
    icon: "checklist",
    title: "No Packing Lists",
    description: "Create a packing list for your next trip with AI-powered suggestions.",
    action: { label: "Create List", href: "/dashboard/packing" },
  },
  {
    icon: "notifications_off",
    title: "No Notifications",
    description: "You're all caught up! Enable alerts in settings to stay informed about weather changes.",
    action: { label: "Settings", href: "/dashboard/settings" },
  },
  {
    icon: "bookmark_border",
    title: "No Saved Cities",
    description: "Save cities for quick access to their weather forecasts.",
    action: { label: "Search Cities", href: "/dashboard/search" },
  },
  {
    icon: "history",
    title: "No Search History",
    description: "Your recent city searches will appear here for quick access.",
    action: { label: "Search Now", href: "/dashboard/search" },
  },
  {
    icon: "map",
    title: "No Travel Plans",
    description: "Plan your next trip and get weather-aware packing suggestions.",
    action: { label: "Start Planning", href: "/dashboard/packing" },
  },
];

export default function EmptyStatesPage() {
  return (
    <div className="min-h-screen text-aether-text-primary relative overflow-hidden -mx-container-padding px-container-padding">
      <div className="relative z-10 pb-32">
        <header className="py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="font-headline-md text-3xl sm:text-4xl text-aether-text-primary">Empty States</h1>
              <p className="text-aether-text-muted mt-2">Design examples for empty data scenarios</p>
            </div>
            <Link href="/dashboard" className="self-start sm:self-auto inline-flex items-center gap-2 bg-aether-gold rounded-full px-4 sm:px-6 py-2.5 sm:py-3 text-sm text-aether-bg font-label-bold whitespace-nowrap hover:brightness-110 transition-all">
              <span className="material-symbols-outlined fill text-lg">arrow_back</span>
              <span>Back</span>
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {emptyStates.map((state) => (
            <div key={state.title} className="glass-card rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
              <span className="material-symbols-outlined text-5xl text-aether-gold/20 mb-6">{state.icon}</span>
              <h2 className="font-headline-md text-2xl text-aether-text-primary mb-3">{state.title}</h2>
              <p className="text-sm text-aether-text-muted mb-6 max-w-xs">{state.description}</p>
              {state.action && (
                <Link href={state.action.href} className="inline-flex items-center gap-2 px-6 py-3 glass-card rounded-full text-sm text-aether-gold hover:bg-aether-gold/20 transition-all">
                  <span className="material-symbols-outlined text-lg fill">add</span>
                  {state.action.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
