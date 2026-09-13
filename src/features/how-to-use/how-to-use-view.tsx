"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AppShell } from "@/components/shared/app-shell";
import {
  ArrowRight,
  Box,
  Check,
  ChevronRight,
  ClipboardList,
  CloudRain,
  Code2,
  Footprints,
  Globe,
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
import { COPY, type FeatureId, type Locale } from "./lib/copy";
import { cn } from "@/lib/utils";

const FEATURE_META: Record<
  FeatureId,
  { icon: typeof LayoutDashboard; href: string; image: string }
> = {
  dashboard: {
    icon: LayoutDashboard,
    href: "/dashboard",
    image: "/how-to-use/dashboard.png",
  },
  commandCenter: {
    icon: MonitorPlay,
    href: "/command-center",
    image: "/how-to-use/command-center.png",
  },
  cctv: { icon: Video, href: "/cctv", image: "/how-to-use/cctv.png" },
  kiosks: { icon: Store, href: "/kiosks", image: "/how-to-use/kiosks.png" },
  survey: { icon: ClipboardList, href: "/survey", image: "/how-to-use/survey.png" },
  aiIngestion: {
    icon: Sparkles,
    href: "/ai-ingestion",
    image: "/how-to-use/ai-ingestion.png",
  },
  portal: { icon: Smartphone, href: "/portal", image: "/how-to-use/portal.png" },
  national: { icon: Globe2, href: "/national", image: "/how-to-use/national.png" },
  developers: {
    icon: Code2,
    href: "/developers",
    image: "/how-to-use/developers.png",
  },
  basemaps: { icon: Box, href: "/dashboard", image: "/how-to-use/basemaps.png" },
  catchments: {
    icon: Footprints,
    href: "/dashboard",
    image: "/how-to-use/catchments.png",
  },
  routing: { icon: CloudRain, href: "/dashboard", image: "/how-to-use/routing.png" },
  search: { icon: Search, href: "/dashboard", image: "/how-to-use/search.png" },
  tour: { icon: Trophy, href: "/dashboard", image: "/how-to-use/tour.png" },
};

const MAP_TOOL_IDS: FeatureId[] = [
  "basemaps",
  "catchments",
  "routing",
  "search",
  "tour",
];

const LOCALES: Array<{ id: Locale; label: string; name: string }> = [
  { id: "en", label: "EN", name: "English" },
  { id: "id", label: "ID", name: "Bahasa Indonesia" },
];

export function HowToUseView() {
  const [locale, setLocale] = useState<Locale>("en");
  const [selectedId, setSelectedId] = useState<FeatureId>("dashboard");
  const t = COPY[locale];

  const group =
    t.groups.find((g) => g.features.some((f) => f.id === selectedId)) ??
    t.groups[0];
  const feature =
    group.features.find((f) => f.id === selectedId) ?? group.features[0];
  const meta = FEATURE_META[feature.id];
  const Icon = meta.icon;
  const targetName = MAP_TOOL_IDS.includes(feature.id)
    ? "Dashboard"
    : feature.name;

  return (
    <AppShell showSearch={false}>
      <div lang={locale} className="absolute inset-0 flex flex-col">
        <header className="flex items-center gap-3 px-5 py-3 border-b border-slate-200/80 dark:border-white/[0.08] bg-white/90 dark:bg-[#0c1019]/90 backdrop-blur-md shrink-0">
          <div className="min-w-0">
            <h1 className="font-bold text-base text-slate-900 dark:text-white tracking-tight truncate">
              {t.title}
            </h1>
            <p className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5 truncate">
              {t.subtitle}
            </p>
          </div>
          <div className="flex-1" />

          <div className="flex items-center gap-2 rounded-2xl border-2 border-amber-500/50 bg-amber-500/10 px-2 py-1 shadow-lg shadow-amber-500/20">
            <span className="flex items-center gap-1.5 pl-1">
              <Globe
                size={14}
                className="text-amber-600 dark:text-amber-400 animate-pulse"
              />
              <span className="hidden sm:block text-[10px] font-bold uppercase tracking-[0.15em] text-amber-700 dark:text-amber-400">
                {t.languageLabel}
              </span>
            </span>
            <div
              role="group"
              aria-label={t.languageLabel}
              className="flex items-center gap-1"
            >
              {LOCALES.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setLocale(option.id)}
                  aria-pressed={locale === option.id}
                  title={option.name}
                  className={cn(
                    "rounded-xl px-2.5 py-1 text-[11px] font-bold tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/70",
                    locale === option.id
                      ? "bg-amber-500 text-white shadow-md shadow-amber-500/30"
                      : "text-amber-700 dark:text-amber-400 hover:bg-amber-500/20",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 border border-blue-400/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0c1019]"
          >
            {t.cta}
            <ArrowRight size={13} />
          </Link>
        </header>

        <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
          <nav
            aria-label={t.listHeading}
            className="shrink-0 max-h-52 lg:max-h-none lg:w-80 border-b lg:border-b-0 lg:border-r border-slate-200/80 dark:border-white/[0.08] overflow-y-auto scrollbar-thin bg-slate-50/70 dark:bg-[#0c1019]/60"
          >
            <div className="p-3 space-y-4">
              {t.groups.map((navGroup) => (
                <div key={navGroup.role}>
                  <h2 className="px-2.5 pb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                    {navGroup.role}
                  </h2>
                  <ul className="space-y-1">
                    {navGroup.features.map((navFeature) => {
                      const NavIcon = FEATURE_META[navFeature.id].icon;
                      const isSelected = navFeature.id === feature.id;
                      return (
                        <li key={navFeature.id}>
                          <button
                            type="button"
                            onClick={() => setSelectedId(navFeature.id)}
                            aria-current={isSelected ? "true" : undefined}
                            className={cn(
                              "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60",
                              isSelected
                                ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                                : "text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-white/[0.06] hover:text-slate-900 dark:hover:text-white",
                            )}
                          >
                            <NavIcon size={15} className="shrink-0" />
                            <span className="min-w-0 flex-1 truncate">
                              {navFeature.name}
                            </span>
                            <ChevronRight
                              size={13}
                              className={cn(
                                "shrink-0",
                                isSelected
                                  ? "text-white"
                                  : "text-slate-300 dark:text-slate-600",
                              )}
                            />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </nav>

          <section
            aria-labelledby="feature-title"
            className="flex-1 min-w-0 overflow-y-auto scrollbar-thin"
          >
            <div className="px-6 py-6 space-y-6">
              <div className="flex flex-wrap items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Icon size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2
                      id="feature-title"
                      className="text-xl font-bold tracking-tight text-slate-900 dark:text-white"
                    >
                      {feature.name}
                    </h2>
                    <span className="rounded-full border border-slate-200/80 bg-slate-100 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-400">
                      {group.role}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
                    {feature.summary}
                  </p>
                </div>
                <Link
                  href={meta.href}
                  className="flex items-center gap-1.5 rounded-xl border border-blue-400/30 bg-blue-600 px-3 py-1.5 text-sm font-bold text-white transition-colors hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0c1019]"
                >
                  {t.openLabel} {targetName}
                  <ArrowRight size={13} />
                </Link>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50 dark:border-white/[0.08] dark:bg-[#0c1019]">
                <Image
                  src={meta.image}
                  alt={`${feature.name} screenshot`}
                  width={1600}
                  height={900}
                  className="h-auto w-full"
                  priority={feature.id === "dashboard"}
                />
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    {t.benefitsHeading}
                  </h3>
                  <ul className="space-y-2.5">
                    {feature.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2.5">
                        <Check
                          size={15}
                          className="mt-0.5 shrink-0 text-emerald-500"
                        />
                        <span className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    {t.stepsHeading}
                  </h3>
                  <ol className="space-y-2.5">
                    {feature.steps.map((step, index) => (
                      <li key={step} className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 font-mono text-[10px] font-bold text-blue-600 dark:text-blue-400">
                          {index + 1}
                        </span>
                        <span className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
