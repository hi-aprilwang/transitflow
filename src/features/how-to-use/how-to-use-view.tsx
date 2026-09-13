"use client";

import Link from "next/link";
import { AppShell } from "@/components/shared/app-shell";
import {
  ArrowRight,
  Box,
  ClipboardList,
  CloudRain,
  Code2,
  Footprints,
  Globe2,
  LayoutDashboard,
  MonitorPlay,
  Search,
  Smartphone,
  Sparkles,
  Store,
  Trophy,
  Video,
} from "lucide-react";

interface Feature {
  icon: typeof LayoutDashboard;
  name: string;
  benefit: string;
  how: string;
  href: string;
}

interface RoleGroup {
  role: string;
  blurb: string;
  features: Feature[];
}

interface ToolHighlight {
  icon: typeof LayoutDashboard;
  name: string;
  benefit: string;
  how: string;
}

const STEPS = [
  {
    title: "Pick a hub",
    body: "Open the dashboard and click any station on the map. Its live condition opens in a panel beside the map.",
  },
  {
    title: "Switch on what you need",
    body: "Turn on the layers that answer your question: crowd density, exit gates, walk catchments, rain risk, or the next 48 hours.",
  },
  {
    title: "Act on it",
    body: "Every screen keeps the map and the numbers together, so a finding can move straight to a decision or an assigned action.",
  },
];

const ROLE_GROUPS: RoleGroup[] = [
  {
    role: "Station operators",
    blurb: "Keep people moving through busy hubs.",
    features: [
      {
        icon: LayoutDashboard,
        name: "Dashboard",
        benefit:
          "See every hub's live condition on one map and know which one needs you first.",
        how: "Click a station, then enable layers",
        href: "/dashboard",
      },
      {
        icon: MonitorPlay,
        name: "Command Center",
        benefit:
          "Turn an incident into an assigned action, with the map and the numbers side by side.",
        how: "Select an incident to open dispatch",
        href: "/command-center",
      },
      {
        icon: Video,
        name: "CCTV & IoT",
        benefit:
          "Check what is happening on the platform before you send anyone out.",
        how: "Focus a camera, keep feeds anonymized",
        href: "/cctv",
      },
      {
        icon: Store,
        name: "Kiosk Studio",
        benefit:
          "Place vendor kiosks without blocking walkways, and see what each pitch can earn.",
        how: "Shift+click to place, drag to move",
        href: "/kiosks",
      },
    ],
  },
  {
    role: "Field teams",
    blurb: "Turn what you see on the ground into evidence.",
    features: [
      {
        icon: ClipboardList,
        name: "Field Survey",
        benefit:
          "Report an observation in about a minute, with photo and voice evidence attached.",
        how: "Add location, details, and evidence",
        href: "/survey",
      },
      {
        icon: Sparkles,
        name: "AI Ingestion",
        benefit:
          "Review machine-read reports in one queue and approve only what checks out.",
        how: "Filter the queue, approve or reject",
        href: "/ai-ingestion",
      },
    ],
  },
  {
    role: "Commuters",
    blurb: "Give riders a reason to open it on the way.",
    features: [
      {
        icon: Smartphone,
        name: "Commuter Portal",
        benefit:
          "Walk the safer route, report a problem, and keep going when the signal drops.",
        how: "Try the mobile tabs and offline floorplan",
        href: "/portal",
      },
    ],
  },
  {
    role: "National planners",
    blurb: "See the network, not one station.",
    features: [
      {
        icon: Globe2,
        name: "National",
        benefit:
          "Rank hubs by chokepoint across cities and export a briefing leadership can read.",
        how: "Switch city, then export CSV",
        href: "/national",
      },
    ],
  },
  {
    role: "Partners and developers",
    blurb: "Build on the same live data.",
    features: [
      {
        icon: Code2,
        name: "Developers",
        benefit:
          "Pull live hub data into your own tools, with a key and quota you can watch.",
        how: "Browse the catalog and run a request",
        href: "/developers",
      },
    ],
  },
];

const TOOL_HIGHLIGHTS: ToolHighlight[] = [
  {
    icon: Box,
    name: "3D city basemaps",
    benefit:
      "Show a briefing screen in 2D, 3D, dark, or satellite so the room reads the city the way they think.",
    how: "Basemap button, bottom right of the map",
  },
  {
    icon: Footprints,
    name: "Walk catchments",
    benefit:
      "See how far people can reach on foot in 5, 10, or 15 minutes from any hub.",
    how: "Layers, then MAPID Walk Catchment",
  },
  {
    icon: CloudRain,
    name: "Storm-safe routing",
    benefit:
      "Find a route that avoids flooded streets when heavy rain closes the usual one.",
    how: "Turn on Rain Mode",
  },
  {
    icon: Search,
    name: "Address search",
    benefit:
      "Jump to a station, street, or landmark by name instead of hunting on the map.",
    how: "Search box in the top bar",
  },
  {
    icon: Trophy,
    name: "Guided tour",
    benefit:
      "Four ready-made scenarios set the camera, layers, and AI for you in one click.",
    how: "Judge Tour button, top bar",
  },
];

export function HowToUseView() {
  return (
    <AppShell showSearch={false}>
      <div className="absolute inset-0 flex flex-col">
        <header className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-200/80 dark:border-white/[0.08] bg-white/90 dark:bg-[#0c1019]/90 backdrop-blur-md shrink-0">
          <div>
            <h1 className="font-bold text-base text-slate-900 dark:text-white tracking-tight">
              How to use TransitFlow AI
            </h1>
            <p className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">
              What you get, and where to find it
            </p>
          </div>
          <div className="flex-1" />
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 border border-blue-400/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0c1019]"
          >
            Open dashboard
            <ArrowRight size={13} />
          </Link>
        </header>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="mx-auto w-full max-w-5xl px-5 py-6 space-y-8">
            <p className="max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              TransitFlow AI keeps a city&apos;s transit hubs moving. Every screen
              pairs the map with the numbers behind it, so what you see can turn
              into a decision the same shift.
            </p>

            <ol className="grid gap-px overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-200/70 dark:border-white/[0.08] dark:bg-white/[0.08] sm:grid-cols-3">
              {STEPS.map((step, index) => (
                <li
                  key={step.title}
                  className="bg-white dark:bg-[#0c1019] px-4 py-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500/10 font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400">
                      {index + 1}
                    </span>
                    <h2 className="text-[13px] font-bold text-slate-900 dark:text-white">
                      {step.title}
                    </h2>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>

            {ROLE_GROUPS.map((group) => (
              <section key={group.role} className="space-y-3">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    {group.role}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-500">
                    {group.blurb}
                  </p>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white divide-y divide-slate-100 dark:border-white/[0.08] dark:bg-[#0c1019] dark:divide-white/[0.06]">
                  {group.features.map((feature) => {
                    const Icon = feature.icon;
                    return (
                      <Link
                        key={feature.name}
                        href={feature.href}
                        className="group flex items-start gap-3.5 px-4 py-3.5 transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500/60"
                      >
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                          <Icon size={16} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-900 dark:text-white">
                              {feature.name}
                            </span>
                            <ArrowRight
                              size={13}
                              className="text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-500 dark:text-slate-600"
                            />
                          </span>
                          <span className="mt-1 block text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                            {feature.benefit}
                          </span>
                          <span className="mt-1.5 block font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            {feature.how}
                          </span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}

            <section className="space-y-3">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
                  New map tools
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  Reachability and street detail from the MAPID platform.
                </p>
              </div>

              <div className="grid gap-px overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-200/70 dark:border-white/[0.08] dark:bg-white/[0.08] md:grid-cols-2">
                {TOOL_HIGHLIGHTS.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <div
                      key={tool.name}
                      className="bg-white dark:bg-[#0c1019] px-4 py-4"
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                          <Icon size={14} />
                        </span>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                          {tool.name}
                        </h3>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        {tool.benefit}
                      </p>
                      <p className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        {tool.how}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
