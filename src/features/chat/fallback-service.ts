export function getSimulatedSpatialResponse(userQuery: string): string {
  const query = userQuery.toLowerCase();

  if (query.includes("vci") || query.includes("vendor") || query.includes("pedagang")) {
    return `### 📊 Vendor Crowding Index (VCI) Analysis

**Vendor Crowding Index (VCI)** evaluates pedestrian bottleneck intensity caused by informal street vendors:

- **Formula**: \`VCI = (Σ (Vendor Width × Vendor Length) / (Walkway Width × Corridor Length)) × 100\`
- **Current Status at Dukuh Atas Hub**:
  - **Gate A (MRT Interchange)**: VCI **28%** (LOS B — Free flow)
  - **Terowongan Kendal**: VCI **68%** (LOS D — **WARNING alert raised**)
  - **Gate B (Sudirman KRL Concourse)**: VCI **44%** (LOS C — Moderate flow)

**Actionable Recommendation**:
Dynamic buffer reallocation has queued 3 mobile enforcement units. Commuters are advised to utilize the elevated **Serambi Temu Dukuh Atas** connector to bypass the Kendal underpass corridor during peak rush hours (17:30 - 19:30 WIB).`;
  }

  if (query.includes("rain") || query.includes("hujan") || query.includes("flood") || query.includes("banjir") || query.includes("weather") || query.includes("cuaca")) {
    return `### 🌧️ Weather-Resilient Multimodal Route Advisory

**Current Meteorological Alert**: Monsoon precipitation detected (intensity: **38 mm/hr**).

- **Water Inundation Status**:
  - **Terowongan Kendal Underpass**: Water level at **18 cm** ⚠️ *(Caution: Approaching diversion threshold)*
  - **Blora Underpass**: Water level at **8 cm** (Passable)
  - **Tosari Elevated Concourse**: Dry & sheltered (Clear)

**Recommended Safe Pedestrian Path**:
1. Depart **MRT Dukuh Atas BNI** via **Exit B (Wisma Nusantara)**.
2. Proceed through the covered pedestrian walkway towards **Serambi Temu Dukuh Atas**.
3. Cross towards **LRT Jabodebek / TransJakarta Galunggung** using the **JPO Pinisi** sheltered bridge.
4. *Avoid ground-level Kendal underpass until automated drainage pumps complete cycle.*`;
  }

  if (query.includes("dukuh atas") || query.includes("hub") || query.includes("interchange") || query.includes("transfer")) {
    return `### 🚉 Dukuh Atas Multi-Modal Hub Live Spatial Overview

**Integration Status Across 5 Transit Modes**:
- **MRT Jakarta (Dukuh Atas BNI)**: Operational · 5-minute headway · Platform flow LOS B (38 p/min/m).
- **LRT Jabodebek (Dukuh Atas Station)**: Operational · 8-minute headway · Elevated concourse clear.
- **KRL Commuter Line (Sudirman)**: High density on Platform 1 & 2 · Gate B dwell time ~45s.
- **Airport Rail Link (BNI City)**: Regular schedule · Seamless tunnel transfer open.
- **TransJakarta (Tosari & Galunggung)**: Corridor 1 operational · Dedicated busway lanes normal.

**Spatial Flow Bottleneck**:
Highest pedestrian accumulation is localized at the **MRT-to-KRL connection concourse**. Pedestrian flow rate is currently **64 p/min/m (LOS D)**.`;
  }

  if (query.includes("manggarai") || query.includes("krl") || query.includes("commuter")) {
    return `### 🚆 Manggarai Central Station Spatial Dynamics

**Station Performance Metrics**:
- **Peak Hourly Throughput**: **4,100 commuters/hr**.
- **Active Exit Channels**: 2 out of 3 operational.
- **Platform Utilization**:
  - **Platform 6/7 (Bogor Line)**: Density at **1.8 persons/m²** (LOS D).
  - **Platform 8 (Cikarang/Bekasi Line)**: Density at **1.4 persons/m²** (LOS C).
  - **Underpass Concourse**: Dwell time averaging **1.8 minutes** during cross-platform transfers.

**Operational Recommendation**:
Station management has activated escalators 3 & 4 in upward-priority mode to relieve platform staging areas.`;
  }

  if (query.includes("sini") || query.includes("cctv") || query.includes("ai") || query.includes("vision") || query.includes("kamera")) {
    return `### 👁️ SINI AI Edge Vision Analytics

**Real-Time Computer Vision Pipeline**:
- **Active Camera Streams**: 6 edge inference nodes deployed across Dukuh Atas & Sudirman.
- **Detections in Last 15 Minutes**:
  - Pedestrian Headcount: **1,420 detections**.
  - Informal Vendor Footprints (PKL): **14 active stalls detected**.
  - Micro-mobility Obstructions: **6 e-scooters parked outside designated zones**.
- **Detection Accuracy**: YOLOv11 edge model reporting **94.2% mAP@0.5** with real-time bounding box tracking at 30 FPS.`;
  }

  return `### 🗺️ TransitFlow Spatial Intelligence Copilot

**Active Spatial Context**: Jakarta TOD Network (MAPID WebGIS 2026)

Based on real-time spatial telemetry across Jakarta's primary transit nodes:
- **Dukuh Atas Interchange**: Operational with moderate evening commuter flow (**LOS B/C**).
- **Vendor Density (VCI)**: Monitored in real-time to preserve effective walkway widths.
- **Weather Advisory**: Active Doppler radar monitoring monsoon cloud bands over Menteng and Setiabudi corridors.

Feel free to ask about:
1. *"Where is the highest congestion in Dukuh Atas right now?"*
2. *"Safe exit recommendation during heavy rain?"*
3. *"Explain the VCI formula and obstruction impact"*
4. *"How does SINI AI extract vendor and crowd counts?"*`;
}
