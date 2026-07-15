"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/redux/reducers/rootReducer";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthentication } from "@/hooks/useAuthentication";

const TABS = ["overview", "stats", "badges"] as const;
type Tab = typeof TABS[number];

const RECENT_ACTIVITIES = [
  { icon: "location_on", text: "Checked weather in Stockholm", time: "2 hours ago", color: "text-sky-400" },
  { icon: "notification_add", text: "Rain alert for tomorrow", time: "5 hours ago", color: "text-amber-400" },
  { icon: "checklist", text: "Packing list updated", time: "1 day ago", color: "text-aether-gold" },
  { icon: "travel_explore", text: "New city saved: Copenhagen", time: "2 days ago", color: "text-violet-400" },
];

const STATS = [
  { label: "Days Tracked", value: "142", icon: "calendar_month", color: "text-sky-400" },
  { label: "Cities Saved", value: "8", icon: "map", color: "text-aether-gold" },
  { label: "Alerts Received", value: "27", icon: "notifications", color: "text-amber-400" },
  { label: "Packing Lists", value: "12", icon: "luggage", color: "text-violet-400" },
];

const BADGES = [
  { name: "Early Adopter", icon: "stadia_controller", description: "Joined in the first month", earned: true },
  { name: "Weather Watcher", icon: "visibility", description: "Checked weather 100+ days", earned: true },
  { name: "Globetrotter", icon: "public", description: "Saved 5+ cities", earned: true },
  { name: "Packing Pro", icon: "work", description: "Created 10+ packing lists", earned: false },
];

export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const { logout } = useAuthentication();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const handleLogout = async () => {
    await logout();
    router.push("/dashboard");
  };

  const initials = user?.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() || "JD";

  const displayName = user?.displayName || "User";
  const email = user?.email || "user@example.com";

  return (
    <div className="min-h-screen text-aether-text-primary -mx-container-padding px-container-padding pb-28 md:pb-12">
      <div className="max-w-3xl mx-auto">

      {/* ── Page header ──────────────────────────────── */}
      <header className="py-6 sm:py-8">
        <p className="font-label-bold text-[10px] uppercase tracking-widest text-aether-text-muted mb-1">
          Your account
        </p>
        <h1 className="font-headline-md text-headline-md text-aether-text-primary leading-tight">
          Profile
        </h1>
      </header>

      {/* ── Profile hero card ─────────────────────────── */}
      <div className="glass-card-elevated rounded-3xl p-6 md:p-8 mb-5 relative overflow-hidden">
        {/* Ambient glow */}
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 80% 20%, rgba(184,137,46,0.10) 0%, transparent 65%)",
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Avatar */}
          <div className="flex-shrink-0 flex flex-col items-center md:items-start gap-3">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={displayName}
                className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover ring-2 ring-aether-gold/30"
              />
            ) : (
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-aether-gold to-aether-slate flex items-center justify-center text-aether-bg font-headline-md text-3xl font-bold select-none">
                {initials}
              </div>
            )}
            {/* Status pill */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="font-label-bold text-[10px] uppercase tracking-wider text-green-400">Active</span>
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h2 className="font-headline-md text-2xl text-aether-text-primary leading-tight">{displayName}</h2>
            <p className="font-body-md text-sm text-aether-text-muted mt-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-aether-text-muted fill">mail</span>
              {email}
            </p>

            <div className="flex flex-wrap gap-2 mt-3">
              <span className="badge-chip bg-aether-gold/10 text-aether-gold border border-aether-gold/20">
                Weather Enthusiast
              </span>
              <span className="badge-chip bg-aether-slate/10 text-aether-slate-soft border border-aether-slate/20">
                Premium Member
              </span>
            </div>

            <p className="font-body-md text-sm text-aether-text-muted mt-3 max-w-md leading-relaxed">
              Exploring the world through weather. Tracking conditions across cities with personalised alerts and AI-powered packing lists.
            </p>
          </div>

          {/* Actions */}
          <div className="flex md:flex-col gap-2 flex-shrink-0">
            <button
              onClick={() => router.push("/dashboard/settings")}
              className="spring-button flex items-center gap-2 px-4 py-2.5 glass-inset rounded-xl text-sm text-aether-text-primary font-label-bold hover:border-aether-gold/30 hover:text-aether-gold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold"
            >
              <span className="material-symbols-outlined text-[16px]">settings</span>
              <span className="hidden sm:inline">Edit Profile</span>
            </button>
            <button
              onClick={handleLogout}
              className="spring-button flex items-center gap-2 px-4 py-2.5 glass-inset rounded-xl text-sm text-red-400 font-label-bold hover:border-red-400/30 hover:bg-red-500/5 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Tabs ──────────────────────────────────────── */}
      <div
        role="tablist"
        aria-label="Profile sections"
        className="glass-inset rounded-2xl p-1 mb-5 flex gap-1"
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={[
              "flex-1 py-2.5 px-4 rounded-xl font-label-bold text-[11px] uppercase tracking-wider capitalize",
              "transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold",
              activeTab === tab
                ? "bg-aether-gold text-aether-bg shadow-sm shadow-aether-gold/25"
                : "text-aether-text-muted hover:text-aether-text-primary",
            ].join(" ")}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Overview tab ──────────────────────────────── */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          {/* Recent activity */}
          <div className="glass-card-elevated rounded-3xl p-6">
            <div className="section-header mb-4">
              <span className="section-title">Recent Activity</span>
            </div>
            <div className="space-y-1">
              {RECENT_ACTIVITIES.map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 px-3 py-3 rounded-xl list-row"
                >
                  <div className="w-9 h-9 glass-inset rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className={`material-symbols-outlined fill text-[16px] ${activity.color}`}>
                      {activity.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body-md text-sm text-aether-text-primary leading-tight truncate">
                      {activity.text}
                    </p>
                    <p className="font-caption text-[10px] text-aether-text-muted mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Connected cities */}
          <div className="glass-card-elevated rounded-3xl p-6">
            <div className="section-header mb-4">
              <span className="section-title">Connected Cities</span>
              <span className="font-label-bold text-[10px] text-aether-text-muted">8 cities</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {["Stockholm", "Copenhagen", "Oslo", "Helsinki", "Reykjavik", "Tallinn", "Riga", "Vilnius"].map((city) => (
                <div
                  key={city}
                  className="glass-inset rounded-xl p-3 hover:border-aether-gold/25 transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-aether-gold fill text-[15px]">location_on</span>
                  <div className="min-w-0">
                    <p className="font-label-bold text-[12px] text-aether-text-primary truncate">{city}</p>
                    <p className="font-caption text-[9px] text-aether-text-muted tabular-nums">18° / 12°</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Stats tab ─────────────────────────────────── */}
      {activeTab === "stats" && (
        <div className="grid grid-cols-2 gap-3">
          {STATS.map((stat) => (
            <div key={stat.label} className="glass-card-elevated rounded-3xl p-6 relative overflow-hidden">
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none opacity-30"
                style={{
                  background: `radial-gradient(circle at 80% 80%, rgba(184,137,46,0.12) 0%, transparent 65%)`,
                }}
              />
              <div className="relative z-10">
                <div className="w-10 h-10 glass-inset rounded-xl flex items-center justify-center mb-4">
                  <span className={`material-symbols-outlined fill text-[20px] ${stat.color}`}>{stat.icon}</span>
                </div>
                <p className="font-headline-md text-4xl text-aether-text-primary tabular-nums leading-none">{stat.value}</p>
                <p className="font-label-bold text-[10px] uppercase tracking-widest text-aether-text-muted mt-2">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Badges tab ────────────────────────────────── */}
      {activeTab === "badges" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {BADGES.map((badge) => (
            <div
              key={badge.name}
              className={[
                "glass-card-elevated rounded-2xl p-5 flex items-center gap-4",
                "transition-all duration-200",
                badge.earned ? "hover:border-aether-gold/30" : "opacity-50",
              ].join(" ")}
            >
              <div className={[
                "w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0",
                badge.earned ? "bg-aether-gold/10" : "glass-inset",
              ].join(" ")}>
                <span className={`material-symbols-outlined fill text-3xl ${badge.earned ? "text-aether-gold" : "text-aether-text-muted"}`}>
                  {badge.icon}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-headline-md text-base text-aether-text-primary leading-tight">{badge.name}</h3>
                  {badge.earned && (
                    <span className="w-4 h-4 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-green-400 fill text-[11px]">check</span>
                    </span>
                  )}
                </div>
                <p className="font-body-md text-[13px] text-aether-text-muted mt-0.5 leading-tight">
                  {badge.description}
                </p>
                {!badge.earned && (
                  <span className="font-label-bold text-[9px] uppercase tracking-wider text-aether-text-muted mt-1 block">
                    Not yet earned
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
