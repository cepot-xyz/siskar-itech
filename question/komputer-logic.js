// ============================================================================
// File: komputer-logic.js
// Logika Kuis (Frontend) - FINAL & EFEKTIF (50 Pertanyaan)
// Fix: Menampilkan Gambar sebagai Background, Fix ReferenceError, dan Logika Branching
// ============================================================================

// ******************************************************
// DEKLARASI VARIABEL GLOBAL (FIX ReferenceError)
// ******************************************************
let currentQuestionIndex = 0;
const userAnswers = {};
let quizContainer;
let progressBarContainer;
let navButtonsPlaceholder;
const totalQuestions = 50;
// ******************************************************

const quizData = [
  // --------------------------------------------------------------------------
  // BAGIAN A: KEBUTUHAN UMUM & BUDGET (A1 - A5)
  // --------------------------------------------------------------------------
  {
    id: "A1_main_use_case",
    text: "Apa tujuan utama penggunaan PC ini?",
    options: [
      "Kantor, Browsing (Ringan)",
      "Multitasking, Pemrograman",
      "Desain Grafis, Video Editing",
      "Gaming (E-Sport / AAA)",
      "Workstation (Rendering)",
    ],
    logic_type: "SPECS_WEIGHT",
    logic_data: { use_case_prio: [1, 2, 3, 4, 5] },
  },
  {
    id: "A2_max_budget",
    text: "Berapa total anggaran (IDR) untuk 6 komponen utama PC?",
    options: [
      "Rp 5 - 10 Juta",
      "Rp 10 - 15 Juta",
      "Rp 15 - 25 Juta",
      "Rp 25 Juta ke Atas",
    ],
    logic_type: "BUDGET_FILTER",
    logic_data: { max_price: [10000000, 15000000, 25000000, 999999999] },
  },
  {
    id: "A3_priority_weight",
    text: "Prioritas utama Anda?",
    options: [
      "Performa Mutlak (Budget Fleksibel)",
      "Keseimbangan Performa & Harga (Value)",
      "Keandalan Jangka Panjang (Durabilitas)",
      "Upgradeability",
    ],
    logic_type: "SPECS_WEIGHT",
    logic_data: { budget_focus: [4, 2, 3, 3] },
  },
  {
    id: "A4_system_aesthetics",
    text: "Pentingkah estetika (RGB, tampilan) PC bagi Anda?",
    options: [
      "Tidak Penting (Fungsi No.1)",
      "Sedikit Penting (Kabel Rapi Cukup)",
      "Wajib Ada RGB dan Tampilan Menarik",
    ],
    logic_type: "SPECS_WEIGHT",
    logic_data: { rgb_score: [1, 2, 3] },
  },
  {
    id: "A5_noise_tolerance",
    text: "Toleransi Anda terhadap kebisingan kipas?",
    options: [
      "Berisik Tidak Masalah",
      "Toleran (Bunyi Kipas Standar)",
      "Harus Hening (Silent PC)",
    ],
    logic_type: "SPECS_WEIGHT",
    logic_data: { noise_tolerance_score: [1, 2, 3] },
  },

  // --------------------------------------------------------------------------
  // BAGIAN B: PROCESSOR (CPU) & PLATFORM (B6 - B15)
  // --------------------------------------------------------------------------
  {
    id: "B6_cpu_brand",
    text: "Preferensi Merek CPU?",
    options: ["Intel", "AMD", "Tidak Ada Preferensi"],
    logic_type: "COMPONENT_FILTER",
    logic_data: { cpu_brand_filter: ["%Intel%", "%AMD%", null] },
  },
  {
    id: "B7_intel_platform",
    text: "Platform Intel yang Anda inginkan?",
    options: [
      "LGA 1700 (DDR4)",
      "LGA 1700 (DDR5)",
      "LGA 1200 (Gen Lama/Budget)",
    ],
    logic_type: "COMPONENT_FILTER",
    logic_data: {
      socket_filter: ["LGA 1700", "LGA 1700", "LGA 1200"],
      ram_type_filter: ["DDR 4", "DDR 5", "DDR 4"],
    },
  },
  {
    id: "B8_amd_platform",
    text: "Platform AMD yang Anda inginkan?",
    options: ["AM4 (DDR4)", "AM5 (DDR5)"],
    logic_type: "COMPONENT_FILTER",
    logic_data: {
      socket_filter: ["AM4", "AM5"],
      ram_type_filter: ["DDR 4", "DDR 5"],
    },
  },
  {
    id: "B9_cpu_performance_tier",
    text: "Tingkat Kinerja CPU yang Anda targetkan?",
    options: [
      "Entry-Level (i3/R3)",
      "Mid-Range (i5/R5)",
      "High-End (i7/R7)",
      "Extreme (i9/R9)",
    ],
    logic_type: "SPECS_WEIGHT",
    logic_data: { cpu_tier_score: [1, 2, 3, 4] },
  },
  {
    id: "B10_iGPU_required",
    text: "Wajib bisa menyala tanpa VGA terpisah (Wajib iGPU)?",
    options: ["Ya (Untuk backup)", "Tidak (VGA Dedicated pasti ada)"],
    logic_type: "COMPONENT_FILTER",
    logic_data: { require_igpu: [true, false] },
  },
  {
    id: "B11_core_vs_clock",
    text: "Prioritas kinerja CPU?",
    options: [
      "Jumlah Core Banyak (Rendering)",
      "Kecepatan Clock Tinggi (Gaming)",
    ],
    logic_type: "SPECS_WEIGHT",
    logic_data: { cpu_core_vs_clock: [2, 1] },
  },
  {
    id: "B12_overclock_plan",
    text: "Apakah Anda berencana Overclocking CPU?",
    options: ["Ya (Wajib CPU K/X-Series)", "Tidak (Stock Speed Saja)"],
    logic_type: "COMPONENT_FILTER",
    logic_data: { oc_plan: [true, false] },
  },
  {
    id: "B13_cache_priority",
    text: "Pentingkah ukuran L3 Cache (terutama 3D V-Cache AMD)?",
    options: ["Sangat Penting (Gaming Maksimal)", "Cukup Standar"],
    logic_type: "SPECS_WEIGHT",
    logic_data: { cache_priority_score: [3, 2] },
  },
  {
    id: "B14_tdp_concern",
    text: "Toleransi terhadap TDP/Panas CPU?",
    options: [
      "Tidak Khawatir (Pendingin kuat)",
      "Ingin TDP di bawah 150W",
      "Ingin TDP di bawah 100W",
    ],
    logic_type: "SPECS_MATCH",
    logic_data: { max_cpu_tdp: [300, 150, 100] },
  },
  {
    id: "B15_cpu_gen_latest",
    text: "Seberapa penting menggunakan CPU Generasi Terbaru?",
    options: ["Wajib Terbaru", "Satu Generasi di Belakang Cukup (Value)"],
    logic_type: "SPECS_WEIGHT",
    logic_data: { cpu_gen_score: [3, 2] },
  },

  // --------------------------------------------------------------------------
  // BAGIAN C: MOTHERBOARD (C16 - C25)
  // --------------------------------------------------------------------------
  {
    id: "C16_chipset_level",
    text: "Level Chipset Motherboard yang diinginkan?",
    options: [
      "Entry (H/A Series)",
      "Mainstream (B Series)",
      "High-End (Z/X Series)",
    ],
    logic_type: "SPECS_WEIGHT",
    logic_data: { chipset_level_score: [1, 2, 3] },
  },
  {
    id: "C17_form_factor",
    text: "Preferensi Ukuran Motherboard/Casing?",
    options: ["ATX (Ukuran Penuh)", "mATX (Menengah)", "mITX (Kecil)"],
    logic_type: "COMPONENT_FILTER",
    logic_data: { form_factor_filter: ["ATX", "mATX", "mIATX"] },
  },
  {
    id: "C18_ram_slot_count",
    text: "Jumlah Slot RAM (DIMM) yang wajib dimiliki?",
    options: ["2 Slot", "4 Slot"],
    logic_type: "COMPONENT_FILTER",
    logic_data: { min_ram_slots: [2, 4] },
  },
  {
    id: "C19_vrm_quality",
    text: "Prioritas kualitas VRM (untuk stabilitas OC/Heavy Load)?",
    options: [
      "Standar Cukup",
      "Kualitas Baik (VRM Heatsink Wajib)",
      "Extreme (Untuk OC Maksimal)",
    ],
    logic_type: "SPECS_WEIGHT",
    logic_data: { vrm_score: [1, 2, 3] },
  },
  {
    id: "C20_pcie_version",
    text: "Minimum versi PCIe utama yang harus didukung Mobo?",
    options: ["PCIe 4.0", "PCIe 5.0 (Wajib)"],
    logic_type: "COMPONENT_FILTER",
    logic_data: { pcie_version_min: [4, 5] },
  },
  {
    id: "C21_m2_slot_count",
    text: "Minimal jumlah slot M.2 NVMe yang Anda butuhkan?",
    options: ["1 Slot", "2 Slot", "3 Slot atau Lebih"],
    logic_type: "SPECS_MATCH",
    logic_data: { min_m2_slots: [1, 2, 3] },
  },
  {
    id: "C22_onboard_wifi",
    text: "Wajib ada konektivitas WiFi & Bluetooth terintegrasi?",
    options: ["Ya (WiFi Wajib)", "Tidak Perlu"],
    logic_type: "COMPONENT_FILTER",
    logic_data: { require_wifi: [true, false] },
  },
  {
    id: "C23_lan_speed",
    text: "Kecepatan Ethernet LAN yang dibutuhkan?",
    options: ["1 Gbps (Standar)", "2.5 Gbps (Cepat)"],
    logic_type: "SPECS_WEIGHT",
    logic_data: { lan_speed_score: [1, 2] },
  },
  {
    id: "C24_rear_io_ports",
    text: "Minimal jumlah port USB di belakang?",
    options: ["4-6 Port Cukup", "8-10 Port (Banyak Device)"],
    logic_type: "SPECS_MATCH",
    logic_data: { rear_usb_port_min: [6, 8] },
  },
  {
    id: "C25_rear_usbc",
    text: "Wajib ada port USB-C (Thunderbolt atau high speed) di belakang?",
    options: ["Ya", "Tidak Perlu"],
    logic_type: "COMPONENT_FILTER",
    logic_data: { require_rear_usbc: [true, false] },
  },

  // --------------------------------------------------------------------------
  // BAGIAN D: GRAPHICS CARD (VGA) (D26 - D37)
  // --------------------------------------------------------------------------
  {
    id: "D26_vga_required",
    text: "Wajib menggunakan Dedicated VGA?",
    options: ["Ya", "Tidak (Cukup iGPU CPU)"],
    logic_type: "VGA_FILTER",
    logic_data: { vga_required: [true, false] },
  },
  {
    id: "D27_vga_brand",
    text: "Preferensi Merek VGA?",
    options: ["NVIDIA GeForce", "AMD Radeon", "Tidak Ada Preferensi"],
    logic_type: "COMPONENT_FILTER",
    logic_data: { vga_brand_filter: ["%NVIDIA%", "%AMD%", null] },
  },
  {
    id: "D28_gpu_tier",
    text: "Level Performa GPU yang Anda targetkan?",
    options: [
      "Entry-Level (RTX 3050/4060)",
      "Mid-Range (RTX 4070/RX 7700 XT)",
      "High-End (RTX 4080/RX 7900 XT)",
      "Flagship (RTX 4090/RX 7900 XTX)",
    ],
    logic_type: "SPECS_WEIGHT",
    logic_data: { gpu_tier_score: [1, 2, 3, 4] },
  },
  {
    id: "D29_vram_min",
    text: "Minimum kapasitas VRAM (Memori Grafis)?",
    options: ["8 GB", "12 GB", "16 GB atau Lebih"],
    logic_type: "SPECS_MATCH",
    logic_data: { vram_min_gb: [8, 12, 16] },
  },
  {
    id: "D30_target_resolution",
    text: "Target resolusi bermain game/kerja utama?",
    options: ["FHD (1080p)", "QHD (1440p / 2K)", "UHD (4K)"],
    logic_type: "SPECS_WEIGHT",
    logic_data: { target_resolution_score: [1, 2, 3] },
  },
  {
    id: "D31_target_fps",
    text: "Target Frame Rate (FPS) untuk Gaming?",
    options: [
      "60 FPS (Standar)",
      "100 - 144 FPS (Halus)",
      "200 FPS ke Atas (E-Sport)",
    ],
    logic_type: "SPECS_WEIGHT",
    logic_data: { target_fps_score: [1, 2, 3] },
  },
  {
    id: "D32_ray_tracing",
    text: "Pentingkah fitur Ray Tracing & Upscaling (DLSS/FSR)?",
    options: ["Sangat Penting", "Cukup Penting", "Tidak Penting Sama Sekali"],
    logic_type: "SPECS_WEIGHT",
    logic_data: { rt_priority_score: [3, 2, 1] },
  },
  {
    id: "D33_vga_cooling_pref",
    text: "Preferensi ukuran/tipe pendingin VGA?",
    options: ["2 Fan (Compact)", "3 Fan (Best Cooling)"],
    logic_type: "SPECS_WEIGHT",
    logic_data: { vga_cooler_score: [2, 3] },
  },
  {
    id: "D34_vga_length_concern",
    text: "Toleransi panjang VGA (untuk Case)?",
    options: ["Pendek Wajib (Max 280mm)", "Panjang Tidak Masalah (Max 330mm)"],
    logic_type: "SPECS_MATCH",
    logic_data: { max_vga_length_mm: [280, 330] },
  },
  {
    id: "D35_vga_power_connector",
    text: "Wajib konektor 12VHPWR (untuk VGA seri 4000)?",
    options: ["Ya (Wajib PSU ATX 3.0)", "Tidak Perlu"],
    logic_type: "COMPONENT_FILTER",
    logic_data: { require_12vhpwr: [true, false] },
  },
  {
    id: "D36_workstation_gpu",
    text: "Apakah Anda membutuhkan GPU kelas Workstation?",
    options: ["Ya (Fokus Stabilitas Driver)", "Tidak (Gaming GPU Cukup)"],
    logic_type: "COMPONENT_FILTER",
    logic_data: { workstation_gpu_req: [true, false] },
  },
  {
    id: "D37_gpu_aesthetics",
    text: "Pentingkah RGB/Desain fisik pada VGA?",
    options: ["Tidak Penting", "Wajib RGB & Desain Menarik"],
    logic_type: "SPECS_WEIGHT",
    logic_data: { gpu_aesthetic_score: [1, 3] },
  },

  // --------------------------------------------------------------------------
  // BAGIAN E: RAM & STORAGE (E38 - E45)
  // --------------------------------------------------------------------------
  {
    id: "E38_ram_capacity_min",
    text: "Kapasitas RAM total minimum?",
    options: ["16 GB (8x2)", "32 GB (16x2)", "64 GB (32x2) atau Lebih"],
    logic_type: "SPECS_MATCH",
    logic_data: { ram_capacity_min_gb: [16, 32, 64] },
  },
  {
    id: "E39_ram_speed_min",
    text: "Kecepatan/frekuensi RAM minimum (Mhz)?",
    options: ["DDR4: 3200 / DDR5: 4800", "DDR4: 3600 / DDR5: 6000"],
    logic_type: "SPECS_MATCH",
    logic_data: { ram_speed_min_mhz: [3200, 6000] },
  },
  {
    id: "E40_cl_timing_priority",
    text: "Pentingkah rendahnya nilai CL Timing (Latency RAM)?",
    options: ["Tidak Penting", "Sangat Penting (Competitive Gaming)"],
    logic_type: "SPECS_WEIGHT",
    logic_data: { cl_timing_score: [1, 3] },
  },
  {
    id: "E41_ram_rgb_req",
    text: "Wajib memiliki lampu RGB pada RAM?",
    options: ["Ya", "Tidak Perlu"],
    logic_type: "COMPONENT_FILTER",
    logic_data: { ram_rgb_req: [true, false] },
  },
  {
    id: "E42_storage_main_type",
    text: "Tipe penyimpanan utama (OS dan Aplikasi)?",
    options: ["SSD NVMe (M.2)", 'SSD SATA (2.5")'],
    logic_type: "COMPONENT_FILTER",
    logic_data: { storage_main_type_filter: ["%NVMe%", "%SATA%"] },
  },
  {
    id: "E43_ssd_gen_min",
    text: "Prioritas Kecepatan Baca/Tulis SSD Utama?",
    options: [
      "SSD Gen3 (Value/Standard)",
      "SSD Gen4 (Keseimbangan)",
      "SSD Gen5 (Speed Maksimal)",
    ],
    logic_type: "SPECS_WEIGHT",
    logic_data: { ssd_gen_score: [3, 4, 5] },
  },
  {
    id: "E44_ssd_capacity_min",
    text: "Kapasitas SSD utama minimum?",
    options: ["500 GB - 1 TB", "2 TB", "4 TB atau Lebih"],
    logic_type: "SPECS_MATCH",
    logic_data: { ssd_capacity_min_gb: [1024, 2048, 4096] },
  },
  {
    id: "E45_require_hdd_secondary",
    text: "Apakah Anda membutuhkan HDD kapasitas besar tambahan?",
    options: ["Ya (Wajib ada HDD)", "Tidak (SSD Cukup)"],
    logic_type: "COMPONENT_FILTER",
    logic_data: { require_hdd_secondary: [true, false] },
  },

  // --------------------------------------------------------------------------
  // BAGIAN F: PSU, COOLING & CASE (F46 - F50)
  // --------------------------------------------------------------------------
  {
    id: "F46_cooler_type",
    text: "Preferensi Tipe Pendingin CPU?",
    options: [
      "Air Cooler (Standard)",
      "Air Cooler (Dual Tower/High TDP)",
      "Liquid Cooler AIO (Cairan)",
    ],
    logic_type: "COMPONENT_FILTER",
    logic_data: { cooler_type_pref: ["Air", "Air_Dual", "Liquid"] },
  },
  {
    id: "F47_psu_efficiency_min",
    text: "Prioritas Kualitas PSU?",
    options: [
      "Low/Budget (Cukup Daya)",
      "Keseimbangan (Gold/Silver)",
      "Premium (Platinum/Titanium)",
    ],
    logic_type: "COMPONENT_FILTER",
    logic_data: { psu_quality_score: [1, 2, 3] },
  },
  {
    id: "F48_psu_modular_pref",
    text: "Jenis Modularitas PSU?",
    options: [
      "Non-Modular (Paling Murah)",
      "Full-Modular (Cable Management Terbaik)",
    ],
    logic_type: "SPECS_WEIGHT",
    logic_data: { psu_modular_score: [1, 3] },
  },
  {
    id: "F49_case_airflow",
    text: "Prioritas Casing pada Airflow?",
    options: [
      "Maksimal Airflow (Mesh Panel)",
      "Estetika (Glass Panel Depan Wajib)",
    ],
    logic_type: "SPECS_WEIGHT",
    logic_data: { case_airflow_score: [3, 1] },
  },
  {
    id: "F50_case_material",
    text: "Preferensi Material Casing?",
    options: ["Steel/Plastik (Standar)", "Aluminium/Premium"],
    logic_type: "SPECS_WEIGHT",
    logic_data: { case_material_score: [1, 2] },
  },
];

// Helper untuk mendapatkan index pertanyaan
function getIndex(id) {
  return quizData.findIndex((q) => q.id === id);
}
// Helper untuk menandai sekelompok pertanyaan sebagai dilewati (skipped)
const skipQuestions = (startId, endId) => {
  let startIndex = getIndex(startId);
  let endIndex = getIndex(endId);
  for (let i = startIndex; i <= endIndex; i++) {
    userAnswers[quizData[i].id] = { skipped: true };
  }
};

// --- RENDER FUNCTIONS (Sama seperti sebelumnya) ---
function renderQuestion() {
  if (currentQuestionIndex >= totalQuestions) {
    displayResults();
    return;
  }
  const question = quizData[currentQuestionIndex];
  const isSkipped =
    userAnswers[question.id] && userAnswers[question.id].skipped;
  if (isSkipped) {
    currentQuestionIndex++;
    renderQuestion();
    return;
  }
  const isAnswered =
    userAnswers[question.id] && !userAnswers[question.id].skipped;
  const answeredCount = Object.values(userAnswers).filter(
    (a) => !a.skipped && a.selectedIndex !== undefined
  ).length;
  const requiredQuestions =
    quizData.length -
    Object.values(userAnswers).filter((a) => a.skipped).length;
  const progressPercentage = Math.round(
    (answeredCount / requiredQuestions) * 100
  );
  const progressHTML = `<div class="progress-text"><span>Progress</span><span>Pertanyaan ${
    currentQuestionIndex + 1
  } dari ${totalQuestions} — ${progressPercentage}%</span></div><div class="progress-bar"><div class="progress-fill" style="width: ${progressPercentage}%;"></div></div>`;
  progressBarContainer.innerHTML = progressHTML;
  let cardHTML = `<h2 class="question-text">${question.text}</h2><div class="options-container">`;
  question.options.forEach((option, index) => {
    const isSelected =
      isAnswered && userAnswers[question.id].selectedIndex === index
        ? "selected"
        : "";
    cardHTML += `<button class="option-button ${isSelected}" data-index="${index}" data-id="${question.id}">${option}</button>`;
  });
  cardHTML += `</div>`;
  quizContainer.innerHTML = cardHTML;
  renderButtons(isAnswered);
  document.querySelectorAll(".option-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      document
        .querySelectorAll(".option-button")
        .forEach((btn) => btn.classList.remove("selected"));
      e.target.classList.add("selected");
      document.getElementById("next-btn").disabled = false;
    });
  });
}
function renderButtons(isAnswered) {
  const nextButtonDisabled = isAnswered ? "" : "disabled";
  const nextButtonText =
    currentQuestionIndex === totalQuestions - 1 ? "Selesai" : "Lanjut";
  let buttonsHTML = ``;
  if (currentQuestionIndex > 0) {
    buttonsHTML += `<button id="prev-btn" class="nav-button prev-button">Kembali</button>`;
  } else {
    buttonsHTML += `<span></span>`;
  }
  buttonsHTML += `<button id="next-btn" class="nav-button next-button" ${nextButtonDisabled}>${nextButtonText}</button>`;
  navButtonsPlaceholder.innerHTML = buttonsHTML;
  document.getElementById("next-btn")?.addEventListener("click", handleNext);
  document.getElementById("prev-btn")?.addEventListener("click", () => {
    currentQuestionIndex--;
    renderQuestion();
  });
}
function displayResults() {
  quizContainer.innerHTML =
    '<h2 class="question-text">Kuis Selesai!</h2><p class="loading-text">Mempersiapkan rekomendasi terbaik untuk Anda...</p>';
  progressBarContainer.innerHTML = "";
  const finalLogic = {};
  for (const qId in userAnswers) {
    const answer = userAnswers[qId];
    if (!answer.skipped && answer.logicData) {
      Object.assign(finalLogic, answer.logicData);
    }
  }
  sendDataToServer(finalLogic);
}
function sendDataToServer(data) {
  const recommendationURL = "rekomendasi-komputer.php";
  fetch(recommendationURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error(
            "Gagal mengambil rekomendasi. Respon Server: " + text
          );
        });
      }
      return response.json();
    })
    .then((response) => {
      displayRecommendationCards(response);
    })
    .catch((error) => {
      quizContainer.innerHTML = `<h2 class="question-text">Terjadi Kesalahan!</h2><p class="loading-text">Tidak dapat memproses rekomendasi. (${error.message})</p>`;
    });
}

// FUNGSI KRITIS: MENAMPILKAN HASIL DENGAN PATH GAMBAR SEBAGAI BACKGROUND
function displayRecommendationCards(response) {
  if (response.error || Object.keys(response).length === 0) {
    const message =
      response.error ||
      "Maaf, tidak ada komponen yang sesuai dengan kriteria rinci dan alokasi budget Anda. Coba revisi kriteria yang lebih fleksibel.";
    document.querySelector(
      ".quiz-area"
    ).innerHTML = `<section class="section-flex" style="margin-top: 15vh;"><div class="quiz-main-card"><h2 class="question-text" style="text-align: center;">Tidak Ada Rekomendasi</h1><p class="loading-text" style="text-align: center;">${message}</p></div></section>`;
    return;
  }
  document.getElementById("quiz-progress-bar").innerHTML = "";

  let html = `<section class="section-flex" style="margin-top: 5vh; flex-direction: column;"><h1 style="font-size: 200%; color: white; text-align: center;">Rekomendasi Komponen PC Pilihan Terbaik</h1><p style="color: #ccc; text-align: center; margin-bottom: 30px;">4 Pilihan Terbaik untuk Setiap Komponen berdasarkan Kriteria dan Budget Anda.</p></section>`;

  for (const category in response) {
    if (response[category].length > 0) {
      // 🚨 LOGIKA PENENTUAN PATH GAMBAR SPESIFIK BERDASARKAN KATEGORI
      let pathSegment = "";
      const categoryLower = category.toLowerCase();

      if (categoryLower.includes("processor")) {
        pathSegment = "processor";
      } else if (categoryLower.includes("motherboard")) {
        pathSegment = "motherboard";
      } else if (categoryLower.includes("vga")) {
        pathSegment = "vga";
      } else if (categoryLower.includes("ram")) {
        pathSegment = "ram";
      } else if (categoryLower.includes("penyimpanan")) {
        pathSegment = "penyimpanan";
      } else if (categoryLower.includes("psu")) {
        pathSegment = "psu";
      } else {
        pathSegment = "default"; // Fallback path
      }

      // Perbaikan Tampilan Warna Kategori ke Putih
      html += `<section style="padding: 20px 0; width: 100%; max-width: 1200px; margin: 0 auto;"><h2 style="color: white; margin-bottom: 10px;">${category}</h2><div class="card-container-grid">`;

      response[category].forEach((component) => {
        const imageFileName = component.gambar || "placeholder.png"; // Ambil nama file dari kolom 'gambar'
        const imagePath = `img/${pathSegment}/${imageFileName}`; // Gabungkan path spesifik

        html += `<div class="component-card has-button">
                        <div class="card-image-container" style="background-image: url('${imagePath}');">
                             </div>
                        <div class="card-content">
                            <p class="text-title">${component.nama_produk}</p>
                            <p class="component-price">Rp ${new Intl.NumberFormat(
                              "id-ID"
                            ).format(component.harga)}</p>
                        </div>
                        <a href="${
                          component.link_resmi || "#"
                        }" target="_blank" class="component-more-info-button">
                            More info
                        </a>
                    </div>`;
      });
      html += `</div></section>`;
    }
  }
  document.querySelector(".quiz-area").innerHTML = html;
}

// FUNGSI UTAMA UNTUK MENGATUR ALUR KUIS (LOGIKA CABANG)
function handleNext() {
  const selectedButton = document.querySelector(".option-button.selected");
  if (!selectedButton) {
    console.warn("Anda harus memilih jawaban sebelum melanjutkan!");
    return;
  }

  const questionId = selectedButton.dataset.id;
  const selectedIndex = parseInt(selectedButton.dataset.index);
  const question = quizData.find((q) => q.id === questionId);

  // 1. Simpan Jawaban & Data Logika
  userAnswers[questionId] = {
    selectedIndex: selectedIndex,
    selectedOption: question.options[selectedIndex],
    logicData: {},
    skipped: false,
  };
  const logicDataKeys = Object.keys(question.logic_data);
  logicDataKeys.forEach((key) => {
    userAnswers[questionId].logicData[key] =
      question.logic_data[key][selectedIndex];
  });

  // 2. Logic Cabang (Skipping Pertanyaan)
  let nextIndex = currentQuestionIndex + 1;

  switch (questionId) {
    case "B6_cpu_brand":
      if (userAnswers[questionId].selectedOption.includes("Intel")) {
        userAnswers["B8_amd_platform"] = { skipped: true };
        nextIndex = getIndex("B7_intel_platform");
      } else if (userAnswers[questionId].selectedOption.includes("AMD")) {
        userAnswers["B7_intel_platform"] = { skipped: true };
        nextIndex = getIndex("B8_amd_platform");
      } else {
        userAnswers["B7_intel_platform"] = { skipped: true };
        userAnswers["B8_amd_platform"] = { skipped: true };
        nextIndex = getIndex("B8_amd_platform") + 1;
      }
      break;
    case "B7_intel_platform":
    case "B8_amd_platform":
      nextIndex = getIndex("B9_cpu_performance_tier");
      break;
    case "D26_vga_required":
      if (userAnswers[questionId].selectedOption.includes("Tidak")) {
        skipQuestions("D27_vga_brand", "D37_gpu_aesthetics");
        nextIndex = getIndex("E38_ram_capacity_min");
      }
      break;
  }

  // 3. Atur index pertanyaan selanjutnya
  currentQuestionIndex = nextIndex;

  if (currentQuestionIndex >= totalQuestions) {
    displayResults();
    return;
  }
  renderQuestion();
}

// Panggil fungsi inisialisasi kuis saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  quizContainer = document.getElementById("quiz-container");
  progressBarContainer = document.getElementById("quiz-progress-bar");
  navButtonsPlaceholder = document.getElementById("nav-buttons-placeholder");

  if (quizContainer && progressBarContainer && navButtonsPlaceholder) {
    // Inisialisasi: Atur skip logic awal
    Object.keys(userAnswers).forEach((key) => delete userAnswers[key]);
    const initialSkipped = ["B8_amd_platform"];
    initialSkipped.forEach((id) => (userAnswers[id] = { skipped: true }));

    // Tandai semua pertanyaan VGA dilewati secara default (dibuka oleh D26)
    skipQuestions("D27_vga_brand", "D37_gpu_aesthetics");

    renderQuestion();
  }
});