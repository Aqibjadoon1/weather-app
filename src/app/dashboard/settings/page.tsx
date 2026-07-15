"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

interface SettingSection {
  title: string;
  items: { label: string; description: string; type: "toggle" | "select" | "link"; value?: string; options?: string[] }[];
}

const settingsSections: SettingSection[] = [
  {
    title: "Units",
    items: [
      { label: "Temperature", description: "Choose between Celsius and Fahrenheit", type: "select", value: "Celsius", options: ["Celsius", "Fahrenheit"] },
      { label: "Wind Speed", description: "Display wind in km/h, mph, or m/s", type: "select", value: "km/h", options: ["km/h", "mph", "m/s"] },
      { label: "Pressure", description: "Display pressure in hPa or inHg", type: "select", value: "hPa", options: ["hPa", "inHg"] },
    ],
  },
  {
    title: "Notifications",
    items: [
      { label: "Daily Forecast", description: "Receive a daily weather summary every morning", type: "toggle" },
      { label: "Severe Weather Alerts", description: "Get instant notifications for severe weather", type: "toggle" },
      { label: "Rain Alerts", description: "Get notified when rain is expected", type: "toggle" },
      { label: "Temperature Drops", description: "Alerts for significant temperature changes", type: "toggle" },
    ],
  },
  {
    title: "Display",
    items: [
      { label: "Theme", description: "Choose light or dark mode", type: "select", value: "System", options: ["Light", "Dark", "System"] },
      { label: "Language", description: "Select your preferred language", type: "select", value: "English", options: ["English", "Swedish", "Danish", "Norwegian"] },
    ],
  },
  {
    title: "Location",
    items: [
      { label: "Default Location", description: "Set your home city for weather data", type: "link", value: "Stockholm, Sweden" },
      { label: "Location Precision", description: "Use precise GPS for better forecast accuracy", type: "toggle" },
    ],
  },
  {
    title: "Data & Privacy",
    items: [
      { label: "Share Usage Data", description: "Help us improve by sharing anonymous usage data", type: "toggle" },
      { label: "Location History", description: "Save location history for better predictions", type: "toggle" },
      { label: "Export My Data", description: "Download all your data as JSON", type: "link" },
      { label: "Delete Account", description: "Permanently delete your account and data", type: "link" },
    ],
  },
];

const selectDefaults = Object.fromEntries(
  settingsSections.flatMap((s) => s.items.filter((i) => i.type === "select").map((i) => [i.label, i.value!]))
);

export default function SettingsPage() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    "Daily Forecast": true,
    "Severe Weather Alerts": true,
    "Rain Alerts": false,
    "Temperature Drops": true,
    "Location Precision": true,
    "Share Usage Data": false,
    "Location History": true,
  });
  const [selectValues, setSelectValues] = useState<Record<string, string>>(selectDefaults);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggle = (label: string) => setToggles((prev) => ({ ...prev, [label]: !prev[label] }));
  const handleSelect = useCallback((label: string, value: string) => {
    setSelectValues((prev) => ({ ...prev, [label]: value }));
    setOpenDropdown(null);
  }, []);

  useEffect(() => {
    if (!openDropdown) return;
    const handler = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".glass-select-wrapper")) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openDropdown]);

  return (
    <div className="min-h-screen text-aether-text-primary -mx-container-padding px-container-padding">
        <header className="py-6 sm:py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-headline-md text-headline-md text-aether-text-primary">Settings</h1>
            <p className="font-body-md text-aether-text-muted mt-1">Customize your experience</p>
          </div>
          <Link href="/dashboard/profile" className="self-start sm:self-auto inline-flex items-center gap-1.5 bg-aether-gold rounded-full px-4 sm:px-6 py-2.5 sm:py-3 text-sm text-aether-bg font-label-bold whitespace-nowrap hover:brightness-110 transition-all">
            <span className="material-symbols-outlined fill text-lg">account_circle</span>
            Profile
          </Link>
        </header>

        {settingsSections.map((section) => (
          <div key={section.title} className="mb-8 sm:mb-10">
            <h2 className="font-body text-xs tracking-wide text-aether-text-muted uppercase mb-4">{section.title}</h2>
            <div className="glass-card rounded-2xl">
              {section.items.map((item) => (
                <div key={item.label} className="flex items-center justify-between p-4 sm:p-5">
                  <div className="flex-1">
                    <p className="font-body-md text-aether-text-primary">{item.label}</p>
                    <p className="font-body-sm text-aether-text-muted mt-0.5">{item.description}</p>
                  </div>
                  {item.type === "toggle" && (
                    <button
                      onClick={() => toggle(item.label)}
                      className={`w-12 h-7 rounded-full transition-all duration-300 relative ${toggles[item.label] ? "bg-aether-gold" : "bg-aether-gold/20"}`}
                    >
                      <div className={`w-5 h-5 bg-aether-text-primary rounded-full absolute top-1 transition-all duration-300 shadow-sm ${toggles[item.label] ? "left-6" : "left-1"}`} />
                    </button>
                  )}
                  {item.type === "select" && (
                    <div className="relative glass-select-wrapper">
                      <button
                        onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                        className="flex items-center gap-2 glass-card rounded-xl pl-4 pr-3 py-2.5 font-body-md text-aether-text-primary outline-none hover:border-aether-gold/50 focus-visible:border-aether-gold cursor-pointer transition-colors border border-aether-gold/10 whitespace-nowrap"
                      >
                        <span>{selectValues[item.label] || item.value}</span>
                        <span className={`material-symbols-outlined text-aether-text-muted text-lg fill transition-transform duration-200 ${openDropdown === item.label ? "rotate-180" : ""}`}>expand_more</span>
                      </button>
                      {openDropdown === item.label && (
                        <div className="absolute top-full right-0 mt-1.5 min-w-[140px] z-50 rounded-xl p-1 shadow-xl shadow-black/20 border border-aether-gold/10" style={{ background: "rgba(255, 255, 255, 0.08)", backdropFilter: "blur(20px) saturate(150%)", WebkitBackdropFilter: "blur(20px) saturate(150%)" }}>
                          {item.options?.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => handleSelect(item.label, opt)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectValues[item.label] === opt ? "bg-aether-gold/20 text-aether-gold" : "text-aether-text-primary hover:bg-aether-gold/10"}`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {item.type === "link" && (
                    <span className="font-body-md text-aether-gold flex items-center gap-1">
                      {item.value}
                      <span className="material-symbols-outlined text-lg fill">chevron_right</span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center pt-10 sm:pt-12">
          <p className="font-body-sm text-aether-text-muted">Version 1.0.0</p>
          <div className="flex justify-center gap-6 mt-6">
            <button className="font-body-sm text-aether-gold hover:underline">Privacy Policy</button>
            <button className="font-body-sm text-aether-gold hover:underline">Terms of Service</button>
            <button className="font-body-sm text-aether-gold hover:underline">Licenses</button>
          </div>
        </div>
    </div>
  );
}
