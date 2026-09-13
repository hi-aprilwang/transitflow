export type Locale = "en" | "id";

export type FeatureId =
  | "dashboard"
  | "commandCenter"
  | "cctv"
  | "kiosks"
  | "survey"
  | "aiIngestion"
  | "portal"
  | "national"
  | "developers";

export type ToolId = "basemaps" | "catchments" | "routing" | "search" | "tour";

export interface StepCopy {
  title: string;
  body: string;
}

export interface FeatureCopy {
  id: FeatureId;
  name: string;
  benefit: string;
  how: string;
}

export interface GroupCopy {
  role: string;
  blurb: string;
  features: FeatureCopy[];
}

export interface ToolCopy {
  id: ToolId;
  name: string;
  benefit: string;
  how: string;
}

export interface HowToUseCopy {
  title: string;
  subtitle: string;
  cta: string;
  intro: string;
  steps: StepCopy[];
  groups: GroupCopy[];
  toolsHeading: string;
  toolsBlurb: string;
  tools: ToolCopy[];
}

export const COPY: Record<Locale, HowToUseCopy> = {
  en: {
    title: "How to use TransitFlow AI",
    subtitle: "What you get, and where to find it",
    cta: "Open dashboard",
    intro:
      "TransitFlow AI keeps a city's transit hubs moving. Every screen pairs the map with the numbers behind it, so what you see can turn into a decision the same shift.",
    steps: [
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
    ],
    groups: [
      {
        role: "Station operators",
        blurb: "Keep people moving through busy hubs.",
        features: [
          {
            id: "dashboard",
            name: "Dashboard",
            benefit:
              "See every hub's live condition on one map and know which one needs you first.",
            how: "Click a station, then enable layers",
          },
          {
            id: "commandCenter",
            name: "Command Center",
            benefit:
              "Turn an incident into an assigned action, with the map and the numbers side by side.",
            how: "Select an incident to open dispatch",
          },
          {
            id: "cctv",
            name: "CCTV & IoT",
            benefit:
              "Check what is happening on the platform before you send anyone out.",
            how: "Focus a camera, keep feeds anonymized",
          },
          {
            id: "kiosks",
            name: "Kiosk Studio",
            benefit:
              "Place vendor kiosks without blocking walkways, and see what each pitch can earn.",
            how: "Shift+click to place, drag to move",
          },
        ],
      },
      {
        role: "Field teams",
        blurb: "Turn what you see on the ground into evidence.",
        features: [
          {
            id: "survey",
            name: "Field Survey",
            benefit:
              "Report an observation in about a minute, with photo and voice evidence attached.",
            how: "Add location, details, and evidence",
          },
          {
            id: "aiIngestion",
            name: "AI Ingestion",
            benefit:
              "Review machine-read reports in one queue and approve only what checks out.",
            how: "Filter the queue, approve or reject",
          },
        ],
      },
      {
        role: "Commuters",
        blurb: "Give riders a reason to open it on the way.",
        features: [
          {
            id: "portal",
            name: "Commuter Portal",
            benefit:
              "Walk the safer route, report a problem, and keep going when the signal drops.",
            how: "Try the mobile tabs and offline floorplan",
          },
        ],
      },
      {
        role: "National planners",
        blurb: "See the network, not one station.",
        features: [
          {
            id: "national",
            name: "National",
            benefit:
              "Rank hubs by chokepoint across cities and export a briefing leadership can read.",
            how: "Switch city, then export CSV",
          },
        ],
      },
      {
        role: "Partners and developers",
        blurb: "Build on the same live data.",
        features: [
          {
            id: "developers",
            name: "Developers",
            benefit:
              "Pull live hub data into your own tools, with a key and quota you can watch.",
            how: "Browse the catalog and run a request",
          },
        ],
      },
    ],
    toolsHeading: "New map tools",
    toolsBlurb: "Reachability and street detail from the MAPID platform.",
    tools: [
      {
        id: "basemaps",
        name: "3D city basemaps",
        benefit:
          "Show a briefing screen in 2D, 3D, dark, or satellite so the room reads the city the way they think.",
        how: "Basemap button, bottom right of the map",
      },
      {
        id: "catchments",
        name: "Walk catchments",
        benefit:
          "See how far people can reach on foot in 5, 10, or 15 minutes from any hub.",
        how: "Layers, then MAPID Walk Catchment",
      },
      {
        id: "routing",
        name: "Storm-safe routing",
        benefit:
          "Find a route that avoids flooded streets when heavy rain closes the usual one.",
        how: "Turn on Rain Mode",
      },
      {
        id: "search",
        name: "Address search",
        benefit:
          "Jump to a station, street, or landmark by name instead of hunting on the map.",
        how: "Search box in the top bar",
      },
      {
        id: "tour",
        name: "Guided tour",
        benefit:
          "Four ready-made scenarios set the camera, layers, and AI for you in one click.",
        how: "Judge Tour button, top bar",
      },
    ],
  },
  id: {
    title: "Cara menggunakan TransitFlow AI",
    subtitle: "Apa yang Anda dapat, dan di mana menemukannya",
    cta: "Buka dashboard",
    intro:
      "TransitFlow AI menjaga kelancaran pergerakan di simpul transit kota. Setiap layar menggabungkan peta dengan angka di baliknya, sehingga apa yang Anda lihat bisa langsung menjadi keputusan pada shift yang sama.",
    steps: [
      {
        title: "Pilih simpul",
        body: "Buka dashboard dan klik stasiun mana pun di peta. Kondisi terkini stasiun muncul di panel sebelah peta.",
      },
      {
        title: "Aktifkan layer yang dibutuhkan",
        body: "Nyalakan layer yang menjawab pertanyaan Anda: kepadatan penumpang, gerbang keluar, jangkauan jalan kaki, risiko hujan, atau proyeksi 48 jam ke depan.",
      },
      {
        title: "Tindak lanjuti",
        body: "Setiap layar menyatukan peta dan angka, sehingga temuan bisa langsung menjadi keputusan atau tugas yang diberikan.",
      },
    ],
    groups: [
      {
        role: "Operator stasiun",
        blurb: "Menjaga penumpang tetap bergerak di simpul yang sibuk.",
        features: [
          {
            id: "dashboard",
            name: "Dashboard",
            benefit:
              "Lihat kondisi terkini semua simpul dalam satu peta dan tahu mana yang perlu ditangani lebih dulu.",
            how: "Klik stasiun, lalu aktifkan layer",
          },
          {
            id: "commandCenter",
            name: "Command Center",
            benefit:
              "Ubah insiden menjadi tugas yang jelas, dengan peta dan angka berdampingan.",
            how: "Pilih insiden untuk membuka dispatch",
          },
          {
            id: "cctv",
            name: "CCTV & IoT",
            benefit:
              "Periksa apa yang sedang terjadi di peron sebelum mengirim petugas.",
            how: "Fokuskan kamera, biarkan tampilan tetap anonim",
          },
          {
            id: "kiosks",
            name: "Kiosk Studio",
            benefit:
              "Tempatkan kios pedagang tanpa menghalangi jalur pejalan kaki, dan lihat potensi pendapatan tiap titik.",
            how: "Shift+klik untuk menempatkan, geser untuk memindahkan",
          },
        ],
      },
      {
        role: "Tim lapangan",
        blurb: "Mengubah apa yang Anda lihat di lapangan menjadi bukti.",
        features: [
          {
            id: "survey",
            name: "Field Survey",
            benefit:
              "Laporkan pengamatan dalam sekitar satu menit, lengkap dengan foto dan rekaman suara.",
            how: "Isi lokasi, detail, dan bukti",
          },
          {
            id: "aiIngestion",
            name: "AI Ingestion",
            benefit:
              "Tinjau laporan hasil pembacaan mesin dalam satu antrean dan setujui hanya yang valid.",
            how: "Saring antrean, setujui atau tolak",
          },
        ],
      },
      {
        role: "Pengguna angkutan umum",
        blurb: "Memberi alasan bagi penumpang untuk membukanya di perjalanan.",
        features: [
          {
            id: "portal",
            name: "Commuter Portal",
            benefit:
              "Telusuri rute yang lebih aman, laporkan masalah, dan tetap terpandu saat sinyal hilang.",
            how: "Coba tab mobile dan denah offline",
          },
        ],
      },
      {
        role: "Perencana nasional",
        blurb: "Melihat jaringan secara keseluruhan, bukan satu stasiun.",
        features: [
          {
            id: "national",
            name: "National",
            benefit:
              "Peringkatkan simpul berdasarkan titik macet di berbagai kota dan ekspor laporan yang mudah dibaca pimpinan.",
            how: "Ganti kota, lalu ekspor CSV",
          },
        ],
      },
      {
        role: "Mitra dan developer",
        blurb: "Membangun di atas data langsung yang sama.",
        features: [
          {
            id: "developers",
            name: "Developers",
            benefit:
              "Tarik data simpul secara langsung ke aplikasi Anda, dengan kunci dan kuota yang dapat dipantau.",
            how: "Telusuri katalog dan jalankan permintaan",
          },
        ],
      },
    ],
    toolsHeading: "Alat peta terbaru",
    toolsBlurb: "Jangkauan dan detail jalan dari platform MAPID.",
    tools: [
      {
        id: "basemaps",
        name: "Basemap kota 3D",
        benefit:
          "Tampilkan layar briefing dalam mode 2D, 3D, gelap, atau satelit agar audiens membaca kota sesuai cara berpikir mereka.",
        how: "Tombol basemap di kanan bawah peta",
      },
      {
        id: "catchments",
        name: "Jangkauan jalan kaki",
        benefit:
          "Lihat sejauh mana orang dapat berjalan dalam 5, 10, atau 15 menit dari setiap simpul.",
        how: "Layers, lalu MAPID Walk Catchment",
      },
      {
        id: "routing",
        name: "Rute aman saat hujan",
        benefit:
          "Temukan rute yang menghindari jalan tergenang saat hujan lebat menutup jalur biasa.",
        how: "Nyalakan Rain Mode",
      },
      {
        id: "search",
        name: "Pencarian alamat",
        benefit:
          "Langsung menuju stasiun, jalan, atau tempat penting berdasarkan nama tanpa mencari manual di peta.",
        how: "Kotak pencarian di bilah atas",
      },
      {
        id: "tour",
        name: "Tur berpemandu",
        benefit:
          "Empat skenario siap pakai yang mengatur kamera, layer, dan AI dalam satu klik.",
        how: "Tombol Judge Tour di bilah atas",
      },
    ],
  },
};
