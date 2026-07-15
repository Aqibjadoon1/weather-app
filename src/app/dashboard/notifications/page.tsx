"use client";

import Link from "next/link";
import { useState } from "react";

interface NotificationItem {
  id: string;
  icon: string;
  title: string;
  message: string;
  time: string;
  type: "alert" | "forecast" | "tip" | "system";
  read: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: "1", icon: "thunderstorm", title: "Severe Storm Warning", message: "Thunderstorms expected in Stockholm from 3 PM. Gusts up to 70 km/h.", time: "2 hours ago", type: "alert", read: false },
  { id: "2", icon: "rainy", title: "Rain Expected Tomorrow", message: "70% chance of rain in the afternoon. Don't forget your umbrella.", time: "5 hours ago", type: "forecast", read: false },
  { id: "3", icon: "ac_unit", title: "Temperature Drop Alert", message: "Temperature dropping to 8°C tonight — 5°C below average.", time: "1 day ago", type: "alert", read: true },
  { id: "4", icon: "checklist", title: "Weekly Forecast Ready", message: "Your weekly forecast is ready. Check out the full 7-day outlook.", time: "1 day ago", type: "forecast", read: true },
  { id: "5", icon: "light_mode", title: "Packing Tip: Layer Up", message: "Temperatures vary widely this week. Pack layers for comfort.", time: "2 days ago", type: "tip", read: true },
  { id: "6", icon: "travel_explore", title: "New Feature: Saved Cities", message: "You can now save up to 10 cities for quick weather checks.", time: "3 days ago", type: "system", read: true },
  { id: "7", icon: "wb_sunny", title: "UV Index Alert", message: "High UV index (6) expected tomorrow. Consider sun protection.", time: "3 days ago", type: "alert", read: true },
];

const TYPE_CONFIG = {
  alert: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20", dot: "bg-red-400" },
  forecast: { bg: "bg-sky-500/10", text: "text-sky-400", border: "border-sky-500/20", dot: "bg-sky-400" },
  tip: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", dot: "bg-amber-400" },
  system: { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/20", dot: "bg-violet-400" },
} as const;

const FILTERS = [
  { key: "all", label: "All", icon: "notifications" },
  { key: "unread", label: "Unread", icon: "mark_email_unread" },
  { key: "alert", label: "Alerts", icon: "warning" },
  { key: "forecast", label: "Forecasts", icon: "calendar_month" },
  { key: "tip", label: "Tips", icon: "lightbulb" },
  { key: "system", label: "System", icon: "settings" },
] as const;

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<string>("all");

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markAsRead = (id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  const clearAll = () => setNotifications([]);

  const filtered =
    filter === "all" ? notifications
    : filter === "unread" ? notifications.filter((n) => !n.read)
    : notifications.filter((n) => n.type === filter);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen text-aether-text-primary -mx-container-padding px-container-padding pb-28 md:pb-12">

      {/* ── Header ───────────────────────────────────── */}
      <header className="py-6 sm:py-8 flex items-start justify-between gap-4">
        <div>
          <p className="font-label-bold text-[10px] uppercase tracking-widest text-aether-text-muted mb-1">
            Stay informed
          </p>
          <div className="flex items-center gap-3">
            <h1 className="font-headline-md text-headline-md text-aether-text-primary leading-tight">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-aether-gold text-aether-bg font-label-bold text-[11px] tabular-nums">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="font-label-bold text-[11px] uppercase tracking-wider text-aether-gold hover:text-aether-gold-soft transition-colors px-3 py-2 rounded-xl hover:bg-aether-gold/8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold"
            >
              Mark all read
            </button>
          )}
        </div>
      </header>

      {/* ── Filter chips ──────────────────────────────── */}
      <div
        role="tablist"
        aria-label="Filter notifications"
        className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-1 -mx-1 px-1"
      >
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(f.key)}
              className={[
                "flex items-center gap-2 px-4 py-2.5 rounded-xl font-label-bold text-[11px] uppercase tracking-wider",
                "whitespace-nowrap transition-all duration-200 flex-shrink-0",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold",
                active
                  ? "bg-aether-gold text-aether-bg shadow-sm shadow-aether-gold/20"
                  : "glass-card-elevated text-aether-text-muted hover:text-aether-text-primary hover:border-aether-gold/25",
              ].join(" ")}
            >
              <span className={`material-symbols-outlined text-[16px] ${active ? "" : "fill"}`}>{f.icon}</span>
              {f.label}
            </button>
          );
        })}
      </div>

      {/* ── Notification list ─────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="glass-card-elevated rounded-3xl p-16 text-center">
          <span className="material-symbols-outlined text-5xl text-aether-text-muted fill block mb-4">notifications_off</span>
          <p className="font-headline-md text-xl text-aether-text-primary">All clear</p>
          <p className="font-body-md text-sm text-aether-text-muted mt-1">No notifications here</p>
        </div>
      ) : (
        <div className="space-y-2" role="list" aria-label="Notifications">
          {filtered.map((n) => {
            const cfg = TYPE_CONFIG[n.type];
            return (
              <div
                key={n.id}
                role="listitem"
                onClick={() => markAsRead(n.id)}
                className={[
                  "flex items-start gap-4 p-4 sm:p-5 rounded-2xl cursor-pointer",
                  "transition-all duration-200 group",
                  n.read
                    ? "glass-card hover:border-white/15"
                    : "glass-card-elevated border-l-2 border-l-aether-gold",
                ].join(" ")}
              >
                {/* Icon badge */}
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border flex-shrink-0 ${cfg.bg} ${cfg.border}`}>
                  <span className={`material-symbols-outlined text-[18px] fill ${cfg.text}`}>{n.icon}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className={`font-body-md text-sm leading-tight ${n.read ? "text-aether-text-primary" : "text-aether-text-primary font-semibold"}`}>
                      {n.title}
                    </p>
                    {!n.read && (
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} aria-label="Unread" />
                    )}
                  </div>
                  <p className="font-body-md text-[13px] text-aether-text-muted leading-relaxed line-clamp-2">
                    {n.message}
                  </p>
                  <p className="font-caption text-[10px] text-aether-text-muted mt-1.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">schedule</span>
                    {n.time}
                  </p>
                </div>

                {/* Type chip */}
                <span className={`badge-chip border flex-shrink-0 hidden sm:inline-flex ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                  {n.type}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Clear all */}
      {notifications.length > 0 && (
        <div className="text-center mt-8 pb-4">
          <button
            onClick={clearAll}
            className="font-label-bold text-[11px] uppercase tracking-wider text-aether-text-muted hover:text-aether-text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold focus-visible:rounded-sm"
          >
            Clear all notifications
          </button>
        </div>
      )}
    </div>
  );
}
