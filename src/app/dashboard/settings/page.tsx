"use client";

import Link from "next/link";
import { useState } from "react";

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

  const toggle = (label: string) => setToggles((prev) => ({ ...prev, [label]: !prev[label] }));

  return (
    <div className="min-h-screen bg-background text-on-surface -mx-container-padding px-container-padding">
        <header className="py-8 flex justify-between items-center">
          <div>
            <h1 className="font-headline-md text-headline-md text-on-surface">Settings</h1>
            <p className="font-body-md text-on-surface-variant mt-1">Customize your experience</p>
          </div>
          <Link href="/dashboard/profile" className="text-primary font-label-bold text-label-bold hover:underline">Profile</Link>
        </header>

        {settingsSections.map((section) => (
          <div key={section.title} className="mb-10">
            <h2 className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider mb-4">{section.title}</h2>
            <div className="bg-surface rounded-3xl overflow-hidden editorial-shadow">
              {section.items.map((item, i) => (
                <div key={item.label} className={`flex items-center justify-between p-5 ${i < section.items.length - 1 ? "border-b border-outline-variant/20" : ""}`}>
                  <div className="flex-1">
                    <p className="font-body-md text-on-surface">{item.label}</p>
                    <p className="font-body-sm text-on-surface-variant mt-0.5">{item.description}</p>
                  </div>
                  {item.type === "toggle" && (
                    <button
                      onClick={() => toggle(item.label)}
                      className={`w-12 h-7 rounded-full transition-all duration-300 relative ${toggles[item.label] ? "bg-primary" : "bg-outline-variant"}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all duration-300 shadow-sm ${toggles[item.label] ? "left-6" : "left-1"}`} />
                    </button>
                  )}
                  {item.type === "select" && (
                    <select
                      value={item.value}
                      onChange={() => {}}
                      className="bg-surface-container-high rounded-xl px-4 py-2 font-body-md text-on-surface outline-none border border-outline-variant/30 focus:border-primary cursor-pointer"
                    >
                      {item.options?.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  )}
                  {item.type === "link" && (
                    <span className="font-body-md text-primary flex items-center gap-1">
                      {item.value}
                      <span className="material-symbols-outlined text-lg fill">chevron_right</span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center pt-6 border-t border-outline-variant/20">
          <p className="font-body-sm text-on-surface-variant">Version 1.0.0</p>
          <div className="flex justify-center gap-6 mt-4">
            <button className="font-body-sm text-primary hover:underline">Privacy Policy</button>
            <button className="font-body-sm text-primary hover:underline">Terms of Service</button>
            <button className="font-body-sm text-primary hover:underline">Licenses</button>
          </div>
        </div>
    </div>
  );
}
