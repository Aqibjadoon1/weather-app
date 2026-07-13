"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/redux/reducers/rootReducer";
import Link from "next/link";
import { useState } from "react";

export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [activeTab, setActiveTab] = useState<"overview" | "stats" | "badges">("overview");

  const initials = user?.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() || "JD";

  const displayName = user?.displayName || "User";
  const email = user?.email || "user@example.com";

  const recentActivities = [
    { icon: "location_on", text: "Checked weather in Stockholm", time: "2 hours ago" },
    { icon: "notification_add", text: "Rain alert for tomorrow", time: "5 hours ago" },
    { icon: "checklist", text: "Packing list updated", time: "1 day ago" },
    { icon: "travel_explore", text: "New city saved: Copenhagen", time: "2 days ago" },
  ];

  const statsCards = [
    { label: "Days Tracked", value: "142", icon: "calendar_month" },
    { label: "Cities Saved", value: "8", icon: "map" },
    { label: "Alerts Received", value: "27", icon: "notifications" },
    { label: "Packing Lists", value: "12", icon: "checklist" },
  ];

  const badges = [
    { name: "Early Adopter", icon: "stadia_controller", description: "Joined in the first month" },
    { name: "Weather Watcher", icon: "visibility", description: "Checked weather 100+ days" },
    { name: "Globetrotter", icon: "public", description: "Saved 5+ cities" },
    { name: "Packing Pro", icon: "work", description: "Created 10+ packing lists" },
  ];

  return (
    <div className="min-h-screen bg-aether-bg text-aether-text-primary -mx-container-padding px-container-padding">
      <div className="py-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-aether-text-muted hover:text-aether-gold transition-colors">
          <span className="material-symbols-outlined fill text-lg">arrow_back</span>
          <span className="font-label-bold text-label-bold">Back</span>
        </Link>
      </div>

      <div className="bg-aether-bg-soft rounded-2xl p-8 md:p-12 border border-aether-gold/10 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {user?.photoURL ? (
            <img src={user.photoURL} alt={displayName} className="w-24 h-24 rounded-full object-cover ring-2 ring-aether-gold/30" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-aether-gold to-aether-slate flex items-center justify-center text-aether-bg font-data text-3xl font-bold">
              {initials}
            </div>
          )}
          <div className="flex-1 text-center md:text-left">
            <h1 className="font-headline-md text-headline-md text-aether-text-primary">{displayName}</h1>
            <p className="text-aether-text-muted mt-2">{email}</p>
            <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
              <span className="px-4 py-2 bg-aether-gold/10 text-aether-gold rounded-full text-sm font-label-bold">Weather Enthusiast</span>
              <span className="px-4 py-2 bg-aether-slate/10 text-aether-slate rounded-full text-sm font-label-bold">Premium Member</span>
            </div>
            <p className="text-sm text-aether-text-muted mt-4 max-w-md">
              Exploring the world through weather. Tracking conditions across cities with personalized alerts and AI-powered packing lists.
            </p>
          </div>
          <Link href="/dashboard/settings" className="px-6 py-3 border border-aether-gold/30 rounded-full text-sm text-aether-gold hover:bg-aether-gold/10 transition-colors whitespace-nowrap font-label-bold">
            Edit Profile
          </Link>
        </div>
      </div>

      <div className="flex gap-1 bg-aether-bg-soft rounded-2xl p-1 mb-8">
        {(["overview", "stats", "badges"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 px-4 rounded-xl font-label-bold text-label-bold capitalize transition-all duration-200 ${activeTab === tab ? "bg-aether-gold text-aether-bg shadow-sm" : "text-aether-text-muted hover:text-aether-text-primary"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <>
          <div className="bg-aether-bg-soft rounded-2xl p-8 border border-aether-gold/10 mb-8">
            <h2 className="font-body text-xs tracking-wide text-aether-text-muted uppercase mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivities.map((activity, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-aether-gold/5 transition-colors">
                  <div className="w-10 h-10 bg-aether-gold/10 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-aether-gold fill">{activity.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-aether-text-primary">{activity.text}</p>
                    <p className="text-xs text-aether-text-muted mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-aether-bg-soft rounded-2xl p-8 border border-aether-gold/10">
            <h2 className="font-body text-xs tracking-wide text-aether-text-muted uppercase mb-6">Connected Cities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["Stockholm", "Copenhagen", "Oslo", "Helsinki", "Reykjavik", "Tallinn", "Riga", "Vilnius"].map((city) => (
                <div key={city} className="bg-aether-bg rounded-xl p-4 border border-aether-gold/10 hover:border-aether-gold/30 transition-colors">
                  <span className="material-symbols-outlined text-aether-slate fill">location_on</span>
                  <p className="font-label-bold text-label-bold text-aether-text-primary mt-2">{city}</p>
                  <p className="text-xs text-aether-text-muted mt-1">18° / 12°</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === "stats" && (
        <div className="grid grid-cols-2 gap-4">
          {statsCards.map((stat) => (
            <div key={stat.label} className="bg-aether-bg-soft rounded-2xl p-6 border border-aether-gold/10">
              <span className="material-symbols-outlined text-aether-gold fill text-2xl">{stat.icon}</span>
              <p className="font-data text-3xl text-aether-text-primary tabular-nums mt-3">{stat.value}</p>
              <p className="text-xs text-aether-text-muted mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "badges" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {badges.map((badge) => (
            <div key={badge.name} className="bg-aether-bg-soft rounded-2xl p-6 border border-aether-gold/10 flex items-center gap-5">
              <div className="w-14 h-14 bg-aether-gold/10 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-aether-gold fill text-3xl">{badge.icon}</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-aether-text-primary">{badge.name}</h3>
                <p className="text-sm text-aether-text-muted mt-1">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
