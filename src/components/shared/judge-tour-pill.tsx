"use client";

import { useState, useRef, useEffect } from "react";
import {
  Trophy,
  ChevronDown,
  Building2,
  CloudRain,
  Sliders,
  Bot,
  RotateCcw,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useStationUIStore } from "@/features/stations/store/station-ui-store";
import { useChatStore } from "@/features/chat/store/chat-store";
import { fetchMapidIsochrone } from "@/lib/mapid/mapid-service";
import { toast } from "sonner";

interface ScenarioItem {
  id: string;
  title: string;
  badge: string;
  rubricRef: string;
  description: string;
  icon: typeof Building2;
  iconColor: string;
  action: () => void;
}

export function JudgeTourPill() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    flyToStation,
    setLayers,
    set3DMode,
    resetLayers,
    setMapidBasemap,
    setIsochrone,
  } = useStationUIStore();
  const { setOpen: setChatOpen, sendMessage } = useChatStore();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scenarios: ScenarioItem[] = [
    {
      id: "scenario-1",
      title: "1. Dukuh Atas TOD Peak Surge",
      badge: "MAPID 3D + 10m Isochrone",
      rubricRef: "Rubric 3.1, 3.2 & 3.5",
      description:
        "Inspects Jakarta's primary multimodal hub with official MAPID 3D basemap and 10-minute pedestrian reachability.",
      icon: Building2,
      iconColor: "text-amber-500",
      action: () => {
        setActiveScenario("scenario-1");
        set3DMode(true);
        setMapidBasemap("street-3d");
        setLayers({
          vciHeatmap: true,
          crowdDensity: true,
          exitGates: true,
          rainMode: false,
          temporaryBufferZone: false,
          forecast: false,
        });
        flyToStation({
          lng: 106.8272,
          lat: -6.2088,
          stationId: "ST-DUK",
        });
        toast.success(
          "Loaded Scenario 1: MAPID 3D Basemap & Dukuh Atas Hub active",
          { duration: 4000 },
        );
        // Automatically fetch 10-min MAPID isochrone for Dukuh Atas
        void fetchMapidIsochrone({
          lat: -6.2088,
          lng: 106.8272,
          timeLimitSeconds: 600,
          profile: "foot",
        }).then((geojson) => {
          if (geojson) {
            setIsochrone(10, geojson);
            toast.success("MAPID 10-Minute Walk Catchment rendered", {
              duration: 3000,
            });
          }
        });
        setIsOpen(false);
      },
    },
    {
      id: "scenario-2",
      title: "2. Monsoon Flood Evacuation",
      badge: "Rain Radar + Detour",
      rubricRef: "Rubric 3.1 & 3.4",
      description:
        "Simulates an 85mm/h monsoon event, displaying flood depth sensors and elevated safe-path detours.",
      icon: CloudRain,
      iconColor: "text-cyan-500",
      action: () => {
        setActiveScenario("scenario-2");
        setLayers({
          rainMode: true,
          crowdDensity: true,
          exitGates: true,
          vciHeatmap: false,
          temporaryBufferZone: false,
          forecast: false,
        });
        flyToStation({
          lng: 106.8248,
          lat: -6.2055,
          stationId: "ST-SUD",
        });
        toast.success(
          "Loaded Scenario 2: Monsoon Detour (Live radar & safe path active)",
          { duration: 4000 },
        );
        setIsOpen(false);
      },
    },
    {
      id: "scenario-3",
      title: "3. Vendor Buffer Zone Intervention",
      badge: "Spatial Editor + 3D",
      rubricRef: "Rubric 3.1 & 3.6",
      description:
        "Activates the interactive polygon buffer editor and curbside barrier mitigation tools.",
      icon: Sliders,
      iconColor: "text-emerald-500",
      action: () => {
        setActiveScenario("scenario-3");
        set3DMode(true);
        setLayers({
          temporaryBufferZone: true,
          crowdDensity: true,
          exitGates: true,
          rainMode: false,
          vciHeatmap: false,
          forecast: false,
        });
        flyToStation({
          lng: 106.8272,
          lat: -6.2088,
          stationId: "ST-DUK",
        });
        toast.success(
          "Loaded Scenario 3: Vendor Buffer Allocation (Polygon editor active)",
          { duration: 4000 },
        );
        setIsOpen(false);
      },
    },
    {
      id: "scenario-4",
      title: "4. DeepSeek 4.1 Flash Spatial Audit",
      badge: "AI Copilot (20 pts)",
      rubricRef: "Rubric 3.2",
      description:
        "Opens the maximized AI Spatial Copilot querying real-time pedestrian telemetry and VCI.",
      icon: Bot,
      iconColor: "text-indigo-500",
      action: () => {
        setActiveScenario("scenario-4");
        setChatOpen(true);
        void sendMessage(
          "Where is the highest pedestrian congestion in Dukuh Atas Hub right now and how does VCI quantify it?",
        );
        toast.success(
          "Loaded Scenario 4: DeepSeek 4.1 Flash Copilot synthesizing response",
          { duration: 4000 },
        );
        setIsOpen(false);
      },
    },
  ];

  const handleReset = () => {
    setActiveScenario(null);
    resetLayers();
    flyToStation({
      lng: 106.83,
      lat: -6.21,
      stationId: "",
    });
    toast.info("Reset to default Jakarta TOD overview", { duration: 3000 });
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-medium text-sm transition-all duration-200 shadow-sm active:scale-95 group ${
          isOpen || activeScenario
            ? "bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400 ring-2 ring-amber-500/20"
            : "bg-slate-100 dark:bg-[#141b2b] border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-white/[0.08]"
        }`}
        title="Open MAPID Catalyst Evaluator Tour Presets"
        aria-label="Open MAPID Catalyst Evaluator Tour Presets"
      >
        <div className="flex items-center gap-1.5">
          <Trophy size={14} className="text-amber-500 animate-pulse" />
          <span className="font-semibold tracking-tight">Judge Tour</span>
        </div>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 text-slate-400 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Card */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2.5 w-[380px] max-w-[calc(100vw-2rem)] bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-white/15 rounded-3xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <Trophy size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  Evaluator Scenario Presets
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  MAPID Catalyst 2026 · Top 10 Selection
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-mono">
              1-Click
            </span>
          </div>

          {/* Scenario List */}
          <div className="space-y-2 py-3">
            {scenarios.map((scenario) => {
              const Icon = scenario.icon;
              const isSelected = activeScenario === scenario.id;
              return (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={scenario.action}
                  className={`w-full text-left p-3 rounded-2xl border transition-all duration-150 group flex items-start gap-3 ${
                    isSelected
                      ? "bg-blue-50/80 dark:bg-blue-500/10 border-blue-500/40 shadow-sm"
                      : "bg-slate-50/60 dark:bg-white/[0.03] border-slate-200/60 dark:border-white/[0.06] hover:bg-slate-100 dark:hover:bg-white/[0.07] hover:border-slate-300 dark:hover:border-white/15"
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl bg-white dark:bg-[#141c2e] border border-slate-200/80 dark:border-white/10 shrink-0 shadow-sm group-hover:scale-105 transition-transform ${scenario.iconColor}`}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {scenario.title}
                      </p>
                      {isSelected ? (
                        <CheckCircle2
                          size={15}
                          className="text-emerald-500 shrink-0"
                        />
                      ) : (
                        <span className="text-sm font-mono font-medium text-slate-400 dark:text-slate-500 shrink-0">
                          {scenario.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-snug line-clamp-2">
                      {scenario.description}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Sparkles size={11} className="text-amber-400" />
                      <span className="text-sm font-mono text-emerald-600 dark:text-emerald-400">
                        {scenario.rubricRef}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer Reset & Tip */}
          <div className="pt-3 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-2">
            <span className="text-sm text-slate-400 dark:text-slate-500">
              Auto-configures camera, layers, & AI
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 text-sm font-medium transition-colors"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
