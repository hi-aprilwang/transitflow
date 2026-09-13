"use client";

import { useState } from "react";
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
import { COPY, type FeatureId, type Locale, type ToolId } from "./lib/copy";
import { cn } from "@/lib/utils";

const FEATURE_META: Record<
  FeatureId,
  { icon: typeof LayoutDashboard; href: string }
> = {
  dashboard: { icon: LayoutDashboard, href: "/dashboard" },
  commandCenter: { icon: MonitorPlay, href: "/command-center" },
  cctv: { icon: Video, href: "/cctv" },
  kiosks: { icon: Store, href: "/kiosks" },
  survey: { icon: ClipboardList, href: "/survey" },
  aiIngestion: { icon: Sparkles, href: "/ai-ingestion" },
  portal: { icon: Smartphone, href: "/portal" },
  national: { icon: Globe2, href: "/national" },
  developers: { icon: Code2, href: "/developers" },
};

const TOOL_ICONS: Record<ToolId, typeof LayoutDashboard> = {
  basemaps: Box,
  catchments: Footprints,
  routing: CloudRain,
  search: Search,
  tour: Trophy,
};

const LOCALES: Array<{ id: Locale; label: string; name: string }> = [
  { id: "en", label: "EN", name: "English" },
  { id: "id", label: "ID", name: "Bahasa Indonesia" },
];

export function HowToUseView() {
  const [locale, setLocale] = useState<Locale>("en");
  const t = COPY[locale];

  return (
    <AppShell showSearch={false}>
      <div
        lang={locale}
        className="absolute inset-0 flex flex-col"
      >
        <header className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-200/80 dark:border-white/[0.08] bg-white/90 dark:bg-[#0c1019]/90 backdrop-blur-md shrink-0">
          <div>
            <h1 className="font-bold text-base text-slate-900 dark:text-white tracking-tight">
              {t.title}
            </h1>
            <p className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">
              {t.subtitle}
            </p>
          </div>
          <div className="flex-1" />
          <div
            role="group"
            aria-label="Page language"
            className="flex items-center gap-1 rounded-xl border border-slate-200/60 dark:border-white/10 bg-slate-100 dark:bg-[#141b2b] p-0.5"
          >
            {LOCALES.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setLocale(option.id)}
                aria-pressed={locale === option.id}
                title={option.name}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60",
                  locale === option.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-white/10",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 border border-blue-400/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0c1019]"
          >
            {t.cta}
            <ArrowRight size={13} />
          </Link>
        </header>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="mx-auto w-full max-w-5xl px-5 py-6 space-y-8">
            <p className="max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {t.intro}
            </p>

            <ol className="grid gap-px overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-200/70 dark:border-white/[0.08] dark:bg-white/[0.08] sm:grid-cols-3">
              {t.steps.map((step, index) => (
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

            {t.groups.map((group) => (
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
                    const meta = FEATURE_META[feature.id];
                    const Icon = meta.icon;
                    return (
                      <Link
                        key={feature.id}
                        href={meta.href}
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
                  {t.toolsHeading}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  {t.toolsBlurb}
                </p>
              </div>

              <div className="grid gap-px overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-200/70 dark:border-white/[0.08] dark:bg-white/[0.08] md:grid-cols-2">
                {t.tools.map((tool) => {
                  const Icon = TOOL_ICONS[tool.id];
                  return (
                    <div
                      key={tool.id}
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
