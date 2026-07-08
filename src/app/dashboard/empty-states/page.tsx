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
    <div className="min-h-screen bg-[#141313] text-[#e5e2e1] font-['Hanken_Grotesk',sans-serif] relative overflow-hidden -mx-container-padding px-container-padding">
      <div className="absolute inset-0 bg-gradient-to-b from-[#141313]/80 via-[#141313]/60 to-[#141313]" />
      <div className="relative z-10 pb-32">
        <header className="py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-['Libre_Caslon_Text',serif] text-4xl font-bold text-white">Empty States</h1>
              <p className="text-white/60 mt-2">Design examples for empty data scenarios</p>
            </div>
            <Link href="/dashboard" className="text-white/50 hover:text-white transition-colors text-sm">Back</Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {emptyStates.map((state) => (
            <div key={state.title} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 text-center flex flex-col items-center justify-center min-h-[300px]">
              <span className="material-symbols-outlined text-5xl text-white/20 mb-6">{state.icon}</span>
              <h2 className="font-['Libre_Caslon_Text',serif] text-2xl font-bold text-white mb-3">{state.title}</h2>
              <p className="text-sm text-white/50 mb-6 max-w-xs">{state.description}</p>
              {state.action && (
                <Link href={state.action.href} className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 rounded-full text-sm text-white hover:bg-white/20 transition-all">
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
