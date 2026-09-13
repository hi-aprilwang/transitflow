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
  | "developers"
  | "basemaps"
  | "catchments"
  | "routing"
  | "search"
  | "tour";

export interface FeatureCopy {
  id: FeatureId;
  name: string;
  summary: string;
  benefits: string[];
  steps: string[];
}

export interface GroupCopy {
  role: string;
  blurb: string;
  features: FeatureCopy[];
}

export interface HowToUseCopy {
  title: string;
  subtitle: string;
  cta: string;
  languageLabel: string;
  listHeading: string;
  benefitsHeading: string;
  stepsHeading: string;
  openLabel: string;
  groups: GroupCopy[];
}

export const COPY: Record<Locale, HowToUseCopy> = {
  en: {
    title: "How to use TransitFlow AI",
    subtitle: "What you get, and where to find it",
    cta: "Open dashboard",
    languageLabel: "Language",
    listHeading: "Features",
    benefitsHeading: "What you get",
    stepsHeading: "How to use it",
    openLabel: "Open",
    groups: [
      {
        role: "Station operators",
        blurb: "Keep people moving through busy hubs.",
        features: [
          {
            id: "dashboard",
            name: "Dashboard",
            summary: "Your live picture of every hub in the city.",
            benefits: [
              "Spot which hub needs attention first, before queues build.",
              "Work from the same numbers your field and control-room teams see.",
            ],
            steps: [
              "Open Dashboard and click a station on the map.",
              "Read its live condition in the panel beside the map.",
              "Switch on the layers you need from the Layers panel.",
            ],
          },
          {
            id: "commandCenter",
            name: "Command Center",
            summary:
              "One screen for incidents, dispatch, and the numbers behind them.",
            benefits: [
              "Turn an incident into an assigned action without radio traffic.",
              "Watch the response progress against live counts.",
            ],
            steps: [
              "Open Command Center.",
              "Select an incident on the map.",
              "Assign the response from the dispatch panel.",
            ],
          },
          {
            id: "cctv",
            name: "CCTV & IoT",
            summary: "Eyes on the platform before you send anyone.",
            benefits: [
              "Confirm what is happening, then decide with confidence.",
              "Keep privacy intact with anonymized feeds.",
            ],
            steps: [
              "Open CCTV & IoT and filter by station.",
              "Focus a camera for a full view.",
              "Keep Anonymized on when the screen is shared.",
            ],
          },
          {
            id: "kiosks",
            name: "Kiosk Studio",
            summary: "Place vendor kiosks without blocking the walkway.",
            benefits: [
              "Test placements with the walkway rule enforced for you.",
              "Get a revenue estimate for every pitch before you approve it.",
            ],
            steps: [
              "Open Kiosk Studio.",
              "Shift+click the map to place a kiosk, then drag to adjust.",
              "Check the estimate and generate a proposal.",
            ],
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
            summary: "Report what you see in about a minute.",
            benefits: [
              "Send photo and voice evidence straight from the platform.",
              "No paperwork and no retyping at the end of the shift.",
            ],
            steps: [
              "Open Field Survey.",
              "Add the location and observation details.",
              "Attach a photo or voice note and submit.",
            ],
          },
          {
            id: "aiIngestion",
            name: "AI Ingestion",
            summary: "Review machine-read reports in one queue.",
            benefits: [
              "Approve only what checks out, reject the rest.",
              "Nothing reaches the map without a human decision.",
            ],
            steps: [
              "Open AI Ingestion.",
              "Filter the queue by status or station.",
              "Open a row and approve or reject it.",
            ],
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
            summary: "The rider's view, ready for the trip home.",
            benefits: [
              "A safer walking route when streets flood.",
              "Guidance that stays available when the signal drops.",
            ],
            steps: [
              "Open Commuter Portal.",
              "Use the tabs to check the route, report a problem, or read alerts.",
              "The station floorplan still opens without signal.",
            ],
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
            summary: "Compare hubs across cities in one view.",
            benefits: [
              "Rank chokepoints nationally and by region.",
              "Export a briefing your leadership can read.",
            ],
            steps: [
              "Open National and pick a city.",
              "Sort the leaderboard to find the worst chokepoints.",
              "Export CSV for the briefing.",
            ],
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
            summary: "Bring live hub data into your own tools.",
            benefits: [
              "One catalog for every endpoint you can call.",
              "A key and quota you can watch as you build.",
            ],
            steps: [
              "Open Developers.",
              "Browse the catalog and run a request.",
              "Copy the key and monitor your quota.",
            ],
          },
        ],
      },
      {
        role: "New map tools",
        blurb: "Reachability and street detail from the MAPID platform.",
        features: [
          {
            id: "basemaps",
            name: "3D city basemaps",
            summary: "Show the city the way your audience reads it.",
            benefits: [
              "2D, 3D, dark, and satellite views of the same city.",
              "3D buildings for briefing screens and walkthroughs.",
            ],
            steps: [
              "Open the Dashboard.",
              "Press the basemap button at the bottom right of the map.",
              "Pick the view you want.",
            ],
          },
          {
            id: "catchments",
            name: "Walk catchments",
            summary: "See how far people can reach on foot.",
            benefits: [
              "5, 10, and 15-minute walk areas around any hub.",
              "Spot which streets feed the station.",
            ],
            steps: [
              "Open the Dashboard.",
              "In Layers, turn on MAPID Walk Catchment.",
              "Pick the walking time to fill in the area.",
            ],
          },
          {
            id: "routing",
            name: "Storm-safe routing",
            summary: "A route around the water, not through it.",
            benefits: [
              "Avoids flooded streets during heavy rain.",
              "Shown next to the usual route so you can compare.",
            ],
            steps: [
              "Open the Dashboard.",
              "Turn on Rain Mode.",
              "Open the safe path to compare routes.",
            ],
          },
          {
            id: "search",
            name: "Address search",
            summary: "Jump anywhere by name.",
            benefits: [
              "Find stations, streets, and landmarks.",
              "No hunting around the map.",
            ],
            steps: [
              "Use the search box in the top bar.",
              "Type a place name.",
              "Pick a result to fly there.",
            ],
          },
          {
            id: "tour",
            name: "Guided tour",
            summary: "Four scenarios that set everything up for you.",
            benefits: [
              "Camera, layers, and AI configured in one click.",
              "Built for walkthroughs and demos.",
            ],
            steps: [
              "Open any map screen.",
              "Press Judge Tour in the top bar.",
              "Pick a scenario.",
            ],
          },
        ],
      },
    ],
  },
  id: {
    title: "Cara menggunakan TransitFlow AI",
    subtitle: "Apa yang Anda dapat, dan di mana menemukannya",
    cta: "Buka dashboard",
    languageLabel: "Bahasa",
    listHeading: "Fitur",
    benefitsHeading: "Yang Anda dapat",
    stepsHeading: "Cara menggunakan",
    openLabel: "Buka",
    groups: [
      {
        role: "Operator stasiun",
        blurb: "Menjaga penumpang tetap bergerak di simpul yang sibuk.",
        features: [
          {
            id: "dashboard",
            name: "Dashboard",
            summary: "Gambaran langsung semua simpul di kota Anda.",
            benefits: [
              "Tahu simpul mana yang perlu ditangani lebih dulu, sebelum antrean menumpuk.",
              "Bekerja dengan angka yang sama seperti tim lapangan dan ruang kendali.",
            ],
            steps: [
              "Buka Dashboard dan klik stasiun di peta.",
              "Baca kondisi terkini di panel sebelah peta.",
              "Nyalakan layer yang Anda butuhkan dari panel Layers.",
            ],
          },
          {
            id: "commandCenter",
            name: "Command Center",
            summary: "Satu layar untuk insiden, dispatch, dan angkanya.",
            benefits: [
              "Ubah insiden menjadi tugas tanpa komunikasi radio yang panjang.",
              "Pantau perkembangan penanganan dengan hitungan langsung.",
            ],
            steps: [
              "Buka Command Center.",
              "Pilih insiden di peta.",
              "Tugaskan penanganan dari panel dispatch.",
            ],
          },
          {
            id: "cctv",
            name: "CCTV & IoT",
            summary: "Melihat peron dulu sebelum mengirim petugas.",
            benefits: [
              "Pastikan apa yang terjadi, lalu putuskan dengan yakin.",
              "Privasi tetap terjaga dengan tampilan anonim.",
            ],
            steps: [
              "Buka CCTV & IoT dan saring berdasarkan stasiun.",
              "Fokuskan kamera untuk tampilan penuh.",
              "Biarkan mode Anonim aktif saat layar ditampilkan ke orang lain.",
            ],
          },
          {
            id: "kiosks",
            name: "Kiosk Studio",
            summary: "Tempatkan kios tanpa menghalangi jalur pejalan kaki.",
            benefits: [
              "Uji penempatan dengan aturan jalur ditegakkan otomatis.",
              "Lihat estimasi pendapatan tiap titik sebelum disetujui.",
            ],
            steps: [
              "Buka Kiosk Studio.",
              "Shift+klik peta untuk menempatkan kios, geser untuk menyesuaikan.",
              "Periksa estimasi lalu buat proposal.",
            ],
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
            summary: "Laporkan pengamatan dalam sekitar satu menit.",
            benefits: [
              "Kirim bukti foto dan suara langsung dari peron.",
              "Tanpa kertas dan tanpa mengetik ulang di akhir shift.",
            ],
            steps: [
              "Buka Field Survey.",
              "Isi lokasi dan detail pengamatan.",
              "Lampirkan foto atau rekaman suara lalu kirim.",
            ],
          },
          {
            id: "aiIngestion",
            name: "AI Ingestion",
            summary: "Tinjau laporan hasil pembacaan mesin dalam satu antrean.",
            benefits: [
              "Setujui yang valid, tolak sisanya.",
              "Tidak ada data masuk peta tanpa keputusan manusia.",
            ],
            steps: [
              "Buka AI Ingestion.",
              "Saring antrean berdasarkan status atau stasiun.",
              "Buka satu baris lalu setujui atau tolak.",
            ],
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
            summary: "Tampilan penumpang, siap untuk perjalanan pulang.",
            benefits: [
              "Rute jalan kaki yang lebih aman saat jalan tergenang.",
              "Panduan tetap tersedia saat sinyal hilang.",
            ],
            steps: [
              "Buka Commuter Portal.",
              "Gunakan tab untuk melihat rute, melapor, atau membaca pemberitahuan.",
              "Denah stasiun tetap bisa dibuka saat sinyal hilang.",
            ],
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
            summary: "Bandingkan simpul antar kota dalam satu tampilan.",
            benefits: [
              "Peringkat titik macet secara nasional dan per wilayah.",
              "Ekspor laporan yang mudah dibaca pimpinan.",
            ],
            steps: [
              "Buka National dan pilih kota.",
              "Urutkan leaderboard untuk menemukan titik macet terburuk.",
              "Ekspor CSV untuk bahan briefing.",
            ],
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
            summary: "Bawa data simpul langsung ke aplikasi Anda.",
            benefits: [
              "Satu katalog untuk semua endpoint yang bisa dipanggil.",
              "Kunci dan kuota yang bisa dipantau saat membangun.",
            ],
            steps: [
              "Buka Developers.",
              "Telusuri katalog dan jalankan permintaan.",
              "Salin kunci dan pantau kuota Anda.",
            ],
          },
        ],
      },
      {
        role: "Alat peta terbaru",
        blurb: "Jangkauan dan detail jalan dari platform MAPID.",
        features: [
          {
            id: "basemaps",
            name: "Basemap kota 3D",
            summary: "Tampilkan kota sesuai cara audiens Anda membacanya.",
            benefits: [
              "Tampilan 2D, 3D, gelap, dan satelit untuk kota yang sama.",
              "Bangunan 3D untuk layar briefing dan walkthrough.",
            ],
            steps: [
              "Buka Dashboard.",
              "Tekan tombol basemap di kanan bawah peta.",
              "Pilih tampilan yang Anda inginkan.",
            ],
          },
          {
            id: "catchments",
            name: "Jangkauan jalan kaki",
            summary: "Lihat sejauh mana orang dapat berjalan kaki.",
            benefits: [
              "Area jalan kaki 5, 10, dan 15 menit dari setiap simpul.",
              "Lihat jalan mana yang mengumpan ke stasiun.",
            ],
            steps: [
              "Buka Dashboard.",
              "Di Layers, nyalakan MAPID Walk Catchment.",
              "Pilih durasi jalan kaki untuk melihat areanya.",
            ],
          },
          {
            id: "routing",
            name: "Rute aman saat hujan",
            summary: "Rute yang memutar dari genangan, bukan melewatinya.",
            benefits: [
              "Menghindari jalan tergenang saat hujan lebat.",
              "Ditampilkan berdampingan dengan rute biasa.",
            ],
            steps: [
              "Buka Dashboard.",
              "Nyalakan Rain Mode.",
              "Buka rute aman untuk membandingkan.",
            ],
          },
          {
            id: "search",
            name: "Pencarian alamat",
            summary: "Langsung menuju lokasi berdasarkan nama.",
            benefits: [
              "Temukan stasiun, jalan, dan tempat penting.",
              "Tanpa mencari manual di peta.",
            ],
            steps: [
              "Gunakan kotak pencarian di bilah atas.",
              "Ketik nama tempat.",
              "Pilih hasil untuk langsung menuju lokasi.",
            ],
          },
          {
            id: "tour",
            name: "Tur berpemandu",
            summary: "Empat skenario yang menyiapkan semuanya untuk Anda.",
            benefits: [
              "Kamera, layer, dan AI diatur dalam satu klik.",
              "Cocok untuk walkthrough dan demo.",
            ],
            steps: [
              "Buka layar peta mana pun.",
              "Tekan Judge Tour di bilah atas.",
              "Pilih skenario.",
            ],
          },
        ],
      },
    ],
  },
};
