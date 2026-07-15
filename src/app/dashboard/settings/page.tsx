"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

interface SettingItem {
  label: string;
  description: string;
  type: "toggle" | "select" | "link";
  value?: string;
  options?: string[];
  danger?: boolean;
}

interface SettingSection {
  title: string;
  icon: string;
  items: SettingItem[];
}

const SECTIONS: SettingSection[] = [
  {
    title: "Units",
    icon: "straighten",
    items: [
      { label: "Temperature", description: "Choose between Celsius and Fahrenheit", type: "select", value: "Celsius", options: ["Celsius", "Fahrenheit"] },
      { label: "Wind Speed", description: "Display wind in km/h, mph, or m/s", type: "select", value: "km/h", options: ["km/h", "mph", "m/s"] },
      { label: "Pressure", description: "Display pressure in hPa or inHg", type: "select", value: "hPa", options: ["hPa", "inHg"] },
    ],
  },
  {
    title: "Notifications",
    icon: "notifications",
    items: [
      { label: "Daily Forecast", description: "Receive a daily weather summary every morning", type: "toggle" },
      { label: "Severe Weather Alerts", description: "Get instant notifications for severe weather", type: "toggle" },
      { label: "Rain Alerts", description: "Get notified when rain is expected", type: "toggle" },
      { label: "Temperature Drops", description: "Alerts for significant temperature changes", type: "toggle" },
    ],
  },
  {
    title: "Display",
    icon: "palette",
    items: [
      { label: "Theme", description: "Choose light or dark mode", type: "select", value: "System", options: ["Light", "Dark", "System"] },
      { label: "Language", description: "Select your preferred language", type: "select", value: "English", options: ["English", "Swedish", "Danish", "Norwegian"] },
    ],
  },
  {
    title: "Location",
    icon: "location_on",
    items: [
      { label: "Default Location", description: "Set your home city for weather data", type: "link", value: "Stockholm, Sweden" },
      { label: "Location Precision", description: "Use precise GPS for better forecast accuracy", type: "toggle" },
    ],
  },
  {
    title: "Data & Privacy",
    icon: "shield",
    items: [
      { label: "Share Usage Data", description: "Help us improve by sharing anonymous usage data", type: "toggle" },
      { label: "Location History", description: "Save location history for better predictions", type: "toggle" },
      { label: "Export My Data", description: "Download all your data as JSON", type: "link" },
      { label: "Delete Account", description: "Permanently delete your account and data", type: "link", danger: true },
    ],
  },
];

const TOGGLE_DEFAULTS: Record<string, boolean> = {
  "Daily Forecast": true,
  "Severe Weather Alerts": true,
  "Rain Alerts": false,
  "Temperature Drops": true,
  "Location Precision": true,
  "Share Usage Data": false,
  "Location History": true,
};

const SELECT_DEFAULTS = Object.fromEntries(
  SECTIONS.flatMap((s) => s.items.filter((i) => i.type === "select").map((i) => [i.label, i.value!]))
);

export default function SettingsPage() {
  const [toggles, setToggles] = useState<Record<string, boolean>>(TOGGLE_DEFAULTS);
  const [selectValues, setSelectValues] = useState<Record<string, string>>(SELECT_DEFAULTS);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggle = (label: string) => setToggles((prev) => ({ ...prev, [label]: !prev[label] }));

  const handleSelect = useCallback((label: string, value: string) => {
    setSelectValues((prev) => ({ ...prev, [label]: value }));
    setOpenDropdown(null);
  }, []);

  useEffect(() => {
    if (!openDropdown) return;
    const handler = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".settings-select-wrapper")) setOpenDropdown(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openDropdown]);

  return (
    <div className="min-h-screen text-aether-text-primary -mx-container-padding px-container-padding pb-28 md:pb-12">
      <div className="max-w-2xl mx-auto">

      {/* ── Header ───────────────────────────────────── */}
      <header className="py-6 sm:py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="font-label-bold text-[10px] uppercase tracking-widest text-aether-text-muted mb-1">
            Preferences
          </p>
          <h1 className="font-headline-md text-headline-md text-aether-text-primary leading-tight">
            Settings
          </h1>
        </div>
        <Link
          href="/dashboard/profile"
          className="self-start sm:self-auto inline-flex items-center gap-2 glass-card-elevated rounded-xl px-4 py-2.5 text-sm text-aether-text-primary font-label-bold hover:border-aether-gold/40 hover:text-aether-gold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold"
        >
          <span className="material-symbols-outlined fill text-[16px]">account_circle</span>
          Profile
        </Link>
      </header>

      {/* ── Sections ─────────────────────────────────── */}
      <div className="space-y-6">
        {SECTIONS.map((section) => (
          <section key={section.title} aria-labelledby={`section-${section.title}`}>
            {/* Section label */}
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-aether-gold fill text-[16px]">{section.icon}</span>
              <h2
                id={`section-${section.title}`}
                className="font-label-bold text-[10px] uppercase tracking-widest text-aether-text-muted"
              >
                {section.title}
              </h2>
            </div>

            <div className="glass-card-elevated rounded-2xl overflow-hidden">
              {section.items.map((item, idx) => {
                const isLast = idx === section.items.length - 1;
                return (
                  <div
                    key={item.label}
                    className={[
                      "flex items-center justify-between gap-4 px-5 py-4",
                      !isLast ? "border-b border-white/5" : "",
                      item.danger ? "hover:bg-red-500/3" : "hover:bg-aether-gold/3",
                      "transition-colors",
                    ].join(" ")}
                  >
                    {/* Label + description */}
                    <div className="flex-1 min-w-0">
                      <p className={[
                        "font-body-md text-sm leading-tight",
                        item.danger ? "text-red-400" : "text-aether-text-primary",
                      ].join(" ")}>
                        {item.label}
                      </p>
                      <p className="font-caption text-[11px] text-aether-text-muted mt-0.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Toggle */}
                    {item.type === "toggle" && (
                      <button
                        role="switch"
                        aria-checked={toggles[item.label]}
                        aria-label={item.label}
                        onClick={() => toggle(item.label)}
                        className={[
                          "relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0",
                          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold",
                          toggles[item.label] ? "bg-aether-gold" : "bg-white/10",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300",
                            toggles[item.label] ? "left-[calc(100%-22px)]" : "left-0.5",
                          ].join(" ")}
                        />
                      </button>
                    )}

                    {/* Select */}
                    {item.type === "select" && (
                      <div className="relative settings-select-wrapper flex-shrink-0">
                        <button
                          onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                          className={[
                            "flex items-center gap-2 glass-inset rounded-xl px-3 py-2 font-body-md text-sm",
                            "text-aether-text-primary hover:border-aether-gold/40 transition-colors",
                            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold",
                            "whitespace-nowrap",
                          ].join(" ")}
                        >
                          <span>{selectValues[item.label]}</span>
                          <span className={[
                            "material-symbols-outlined text-aether-text-muted text-[16px] fill transition-transform duration-200",
                            openDropdown === item.label ? "rotate-180" : "",
                          ].join(" ")}>
                            expand_more
                          </span>
                        </button>

                        {openDropdown === item.label && (
                          <div
                            className="absolute top-full right-0 mt-1.5 min-w-[130px] z-50 rounded-xl overflow-hidden"
                            style={{
                              background: "rgba(20, 22, 35, 0.92)",
                              backdropFilter: "blur(20px) saturate(150%)",
                              WebkitBackdropFilter: "blur(20px) saturate(150%)",
                              border: "1px solid rgba(255,255,255,0.10)",
                              boxShadow: "0 16px 40px rgba(0,0,0,0.32), 0 4px 10px rgba(0,0,0,0.18)",
                            }}
                          >
                            {item.options?.map((opt) => (
                              <button
                                key={opt}
                                onClick={() => handleSelect(item.label, opt)}
                                className={[
                                  "w-full text-left px-4 py-2.5 font-body-md text-sm transition-colors",
                                  selectValues[item.label] === opt
                                    ? "bg-aether-gold/15 text-aether-gold"
                                    : "text-aether-text-primary hover:bg-white/6",
                                ].join(" ")}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Link */}
                    {item.type === "link" && (
                      <button
                        className={[
                          "flex items-center gap-1 font-body-md text-sm flex-shrink-0",
                          item.danger ? "text-red-400" : "text-aether-gold",
                          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold focus-visible:rounded-sm",
                        ].join(" ")}
                      >
                        {item.value && <span>{item.value}</span>}
                        <span className="material-symbols-outlined text-[16px] fill">chevron_right</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* ── Footer ───────────────────────────────────── */}
      <div className="mt-10 pt-8 border-t border-white/6 text-center">
        <p className="font-caption text-[11px] text-aether-text-muted">
          Accurate Weather · Version 1.0.0
        </p>
        <div className="flex justify-center gap-6 mt-4">
          {["Privacy Policy", "Terms of Service", "Licenses"].map((link) => (
            <button
              key={link}
              className="font-label-bold text-[11px] uppercase tracking-wider text-aether-text-muted hover:text-aether-gold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold focus-visible:rounded-sm"
            >
              {link}
            </button>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
