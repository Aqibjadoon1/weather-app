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

const initialNotifications: NotificationItem[] = [
  { id: "1", icon: "thunderstorm", title: "Severe Storm Warning", message: "Thunderstorms expected in Stockholm from 3 PM. Gusts up to 70 km/h.", time: "2 hours ago", type: "alert", read: false },
  { id: "2", icon: "rainy", title: "Rain Expected Tomorrow", message: "70% chance of rain in the afternoon. Don't forget your umbrella.", time: "5 hours ago", type: "forecast", read: false },
  { id: "3", icon: "ac_unit", title: "Temperature Drop Alert", message: "Temperature dropping to 8°C tonight — 5°C below average.", time: "1 day ago", type: "alert", read: true },
  { id: "4", icon: "checklist", title: "Weekly Forecast Ready", message: "Your weekly forecast is ready. Check out the full 7-day outlook.", time: "1 day ago", type: "forecast", read: true },
  { id: "5", icon: "light_mode", title: "Packing Tip: Layer Up", message: "Temperatures vary widely this week. Pack layers for comfort.", time: "2 days ago", type: "tip", read: true },
  { id: "6", icon: "travel_explore", title: "New Feature: Saved Cities", message: "You can now save up to 10 cities for quick weather checks.", time: "3 days ago", type: "system", read: true },
  { id: "7", icon: "wb_sunny", title: "UV Index Alert", message: "High UV index (6) expected tomorrow. Consider sun protection.", time: "3 days ago", type: "alert", read: true },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<"all" | "unread" | string>("all");

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const markAsRead = (id: string) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const clearAll = () => setNotifications([]);

  const filtered = filter === "all" ? notifications : filter === "unread" ? notifications.filter((n) => !n.read) : notifications.filter((n) => n.type === filter);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const typeColors: Record<string, string> = {
    alert: "bg-red-500/20 text-red-400 border-red-500/30",
    forecast: "bg-aether-slate/20 text-aether-slate border-aether-slate/30",
    tip: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    system: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  };

  return (
    <div className="min-h-screen bg-aether-bg text-aether-text-primary -mx-container-padding px-container-padding">
        {/* Header */}
        <header className="py-8 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-headline-md text-headline-md text-aether-text-primary">Notifications</h1>
              {unreadCount > 0 && (
                <span className="px-2.5 py-1 bg-aether-gold text-aether-bg rounded-full font-label-bold text-label-bold text-xs">{unreadCount}</span>
              )}
            </div>
            <p className="font-body-md text-aether-text-muted mt-1">Stay informed about weather changes</p>
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="px-4 py-2 text-aether-gold font-label-bold text-label-bold hover:bg-aether-gold/10 rounded-xl transition-colors">
                Mark all read
              </button>
            )}
          </div>
        </header>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6">
          {[
            { key: "all", label: "All", icon: "notifications" },
            { key: "unread", label: "Unread", icon: "mark_email_unread" },
            { key: "alert", label: "Alerts", icon: "warning" },
            { key: "forecast", label: "Forecasts", icon: "calendar_month" },
            { key: "tip", label: "Tips", icon: "lightbulb" },
            { key: "system", label: "System", icon: "settings" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-label-bold text-label-bold whitespace-nowrap transition-all ${filter === f.key ? "bg-aether-gold text-aether-bg" : "bg-aether-bg-soft text-aether-text-muted hover:bg-aether-gold/5"}`}
            >
              <span className="material-symbols-outlined text-lg fill">{f.icon}</span>
              {f.label}
            </button>
          ))}
        </div>

        {/* Notification List */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-5xl text-aether-text-muted fill">notifications_off</span>
            <p className="font-headline-sm text-headline-sm text-aether-text-primary mt-4">No notifications</p>
            <p className="font-body-md text-aether-text-muted mt-2">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((notification) => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`flex items-start gap-5 p-5 rounded-3xl cursor-pointer transition-all duration-200 ${notification.read ? "bg-aether-bg-soft border border-aether-gold/10" : "bg-aether-bg-soft border-l-4 border-l-aether-gold editorial-shadow"}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${typeColors[notification.type]}`}>
                  <span className="material-symbols-outlined text-xl fill">{notification.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`font-body-md ${!notification.read ? "text-aether-text-primary font-bold" : "text-aether-text-primary"}`}>{notification.title}</p>
                    {!notification.read && <span className="w-2 h-2 bg-aether-gold rounded-full" />}
                  </div>
                  <p className="font-body-sm text-aether-text-muted mt-1 line-clamp-2">{notification.message}</p>
                  <p className="font-caption text-caption text-aether-text-muted mt-2">{notification.time}</p>
                </div>
                <button className="p-1 opacity-0 group-hover:opacity-100 hover:bg-aether-gold/5 rounded-lg transition-all">
                  <span className="material-symbols-outlined text-aether-text-muted text-lg fill">more_vert</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Clear All */}
        {notifications.length > 0 && (
          <div className="text-center mt-8">
            <button onClick={clearAll} className="font-body-md text-aether-text-muted hover:text-aether-text-primary transition-colors underline underline-offset-2">
              Clear all notifications
            </button>
          </div>
        )}
    </div>
  );
}
