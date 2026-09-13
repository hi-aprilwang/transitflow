"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronUp, Map, Globe, Moon, Sun, Box } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MAPID_BASEMAP_OPTIONS,
  type MapidBasemapId,
} from "@/lib/mapid/mapid-service";
import { useStationUIStore } from "@/features/stations/store/station-ui-store";

const BASEMAP_ICONS: Record<MapidBasemapId, typeof Map> = {
  "street-2d": Map,
  "street-3d": Box,
  dark: Moon,
  light: Sun,
  satellite: Globe,
};

export function MapidBasemapSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { mapidBasemap, setMapidBasemap, set3DMode } = useStationUIStore();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeOption =
    MAPID_BASEMAP_OPTIONS.find((b) => b.id === mapidBasemap) ||
    MAPID_BASEMAP_OPTIONS[0];
  const CurrentIcon = BASEMAP_ICONS[mapidBasemap] || Map;

  const handleSelect = (id: MapidBasemapId) => {
    setMapidBasemap(id);
    if (id === "street-3d") {
      set3DMode(true);
    } else if (mapidBasemap === "street-3d") {
      set3DMode(false);
    }
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative z-30 pointer-events-auto">
      {/* Basemap Selection Popover */}
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-72 bg-white/95 dark:bg-[#0c1019]/95 backdrop-blur-xl border border-slate-200/80 dark:border-white/[0.12] rounded-2xl shadow-2xl p-3 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between px-2 py-1.5 mb-2 border-b border-slate-100 dark:border-white/[0.06]">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              MAPID Basemaps
            </span>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium">
              Official Key
            </span>
          </div>

          <div className="space-y-1">
            {MAPID_BASEMAP_OPTIONS.map((opt) => {
              const Icon = BASEMAP_ICONS[opt.id];
              const isSelected = opt.id === mapidBasemap;

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelect(opt.id)}
                  className={cn(
                    "w-full flex items-start gap-3 px-3 py-2 rounded-xl text-left transition-all",
                    isSelected
                      ? "bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "bg-transparent border border-transparent hover:bg-slate-100/80 dark:hover:bg-white/[0.05] text-slate-700 dark:text-slate-300",
                  )}
                >
                  <Icon
                    size={18}
                    className={cn(
                      "shrink-0 mt-0.5",
                      isSelected
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-slate-400 dark:text-slate-500",
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold tracking-tight">
                        {opt.name}
                      </span>
                      {isSelected && (
                        <Check
                          size={14}
                          className="text-blue-600 dark:text-blue-400 shrink-0"
                        />
                      )}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-snug truncate">
                      {opt.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-white/[0.06] px-2 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
            <span>Tile Engine:</span>
            <span className="font-mono text-sm font-semibold text-slate-700 dark:text-slate-300">
              basemap.mapid.io
            </span>
          </div>
        </div>
      )}

      {/* Floating Toggle Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/95 dark:bg-[#0c1019]/95 backdrop-blur-xl border shadow-xl transition-all select-none group",
          isOpen
            ? "border-blue-500/50 ring-2 ring-blue-500/20 text-blue-600 dark:text-blue-400"
            : "border-slate-200/80 dark:border-white/[0.1] hover:border-blue-500/30 text-slate-700 dark:text-slate-200",
        )}
        title="Change MAPID Basemap"
      >
        <div className="w-6 h-6 rounded-lg bg-blue-500/10 dark:bg-blue-400/10 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
          <CurrentIcon size={15} />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-sm font-bold leading-tight">
            {activeOption.name}
          </span>
          <span className="text-sm text-slate-500 dark:text-slate-400 leading-none">
            MAPID Vector
          </span>
        </div>
        <ChevronUp
          size={14}
          className={cn(
            "text-slate-400 dark:text-slate-500 transition-transform ml-0.5",
            isOpen && "rotate-180 text-blue-500",
          )}
        />
      </button>
    </div>
  );
}
