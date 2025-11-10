const quizData = [
  {
    id: "cpu_brand",
    text: "Preferensi Merek Prosessor (CPU)?",
    options: ["Intel", "AMD", "Apple (M-Series)", "Tidak Ada"],
    logic_type: "COMPONENT_FILTER",
    logic_data: { filter_cpu_brand: ["Intel", "AMD", "Apple", null] },
  },
  {
    id: "cpu_level_intel",
    text: "Level Performa CPU Intel yang Diinginkan?",
    options: ["Entry (Celeron/i3)", "Mid (i5)", "High (i7/i9)"],
    logic_type: "SPECS_WEIGHT",
    logic_data: { cpu_score: [1, 2, 3] },
  },
  {
    id: "cpu_level_amd",
    text: "Level Performa CPU AMD yang Diinginkan?",
    options: ["Entry (Athlon/Ryzen 3)", "Mid (Ryzen 5)", "High (Ryzen 7/9)"],
    logic_type: "SPECS_WEIGHT",
    logic_data: { cpu_score: [1, 2, 3] },
  },
  {
    id: "cpu_priority",
    text: "Prioritas Kinerja CPU: Performa Penuh vs. Efisiensi Baterai?",
    options: ["Performa Tinggi (Seri H/HX)", "Efisien Daya (Seri U/P)"],
    logic_type: "SPECS_WEIGHT",
    logic_data: { cpu_performance_weight: [2, 1], battery_life_weight: [0, 1] },
  },
  {
    id: "ram_cap_min",
    text: "Kapasitas RAM Minimum yang Anda Butuhkan?",
    options: ["8 GB", "16 GB", "32 GB atau Lebih"],
    logic_type: "SPECS_MATCH",
    logic_data: { ram_gb_min: [8, 16, 32] },
  },
  {
    id: "ram_type",
    text: "Jenis Teknologi RAM yang Diinginkan?",
    options: ["DDR4", "DDR5"],
    logic_type: "COMPONENT_FILTER",
    logic_data: { filter_ram_type: ["DDR4", "DDR5"] },
  },
  {
    id: "vga_type",
    text: "Preferensi Jenis Grafis (VGA)?",
    options: ["Terintegrasi (iGPU)", "Dedicated (dGPU)"],
    logic_type: "COMPONENT_FILTER",
    logic_data: { filter_vga_type: ["Integrated", "Dedicated"] },
  },
  {
    id: "dgpu_brand",
    text: "Jika Memilih Dedicated GPU, Merek Mana yang Anda Pilih?",
    options: ["NVIDIA GeForce", "AMD Radeon", "Tidak Ada"],
    logic_type: "COMPONENT_FILTER",
    logic_data: { filter_vga_brand: ["NVIDIA", "AMD", null] },
  },
  {
    id: "nvidia_min",
    text: "Minimum Kelas GPU NVIDIA yang Dibutuhkan?",
    options: [
      "Ringan (MX/GTX)",
      "Menengah (RTX 3050/4050)",
      "Tinggi/Maksimal (RTX 4060 ke Atas)",
    ],
    logic_type: "SPECS_WEIGHT",
    logic_data: { gpu_score: [1, 2, 3] },
  },
  {
    id: "vram_min",
    text: "Minimum VRAM (Memori Grafis) yang Anda Butuhkan?",
    options: ["4 GB atau Kurang", "6 - 8 GB", "12 GB ke Atas"],
    logic_type: "SPECS_MATCH",
    logic_data: { vram_gb_min: [4, 6, 12] },
  },
  {
    id: "ram_upgrade",
    text: "Prioritas Upgradeability RAM?",
    options: [
      "Wajib Bisa di-Upgrade (Slot SO-DIMM)",
      "Tidak Masalah (RAM Soldered)",
    ],
    logic_type: "SPECS_WEIGHT",
    logic_data: { upgradeability_score: [1, 0] },
  },
  {
    id: "storage_cap_prime",
    text: "Kapasitas Penyimpanan Primer Minimal?",
    options: ["256 GB", "512 GB", "1 TB atau Lebih"],
    logic_type: "SPECS_MATCH",
    logic_data: { storage_gb_min: [256, 512, 1024] },
  },
  {
    id: "storage_type_prime",
    text: "Preferensi Tipe Penyimpanan Primer (SSD)?",
    options: ["SSD NVMe (M.2)", 'SSD SATA (2.5")'],
    logic_type: "COMPONENT_FILTER",
    logic_data: { filter_storage_type: ["NVMe", "SATA"] },
  },
  {
    id: "ssd_speed",
    text: "Seberapa Penting Kecepatan Baca/Tulis SSD bagi Anda?",
    options: ["Standar (Gen3)", "Tinggi (Gen4 ke Atas)"],
    logic_type: "SPECS_WEIGHT",
    logic_data: { storage_speed_score: [1, 2] },
  },
  {
    id: "storage_slot_add",
    text: "Kebutuhan Slot Tambahan untuk Penyimpanan (HDD/SSD Sekunder)?",
    options: ["Wajib Ada Slot Tambahan", "Tidak Perlu"],
    logic_type: "SPECS_WEIGHT",
    logic_data: { storage_slot_score: [1, 0] },
  },
  {
    id: "thermal_tol",
    text: "Toleransi Laptop Terhadap Panas (Saat Beban Penuh)?",
    options: [
      "Harus Sangat Dingin (Cooling Prioritas)",
      "Cukup Dingin, Ada Kipas Standar",
    ],
    logic_type: "SPECS_WEIGHT",
    logic_data: { thermal_score: [2, 1] },
  },
  {
    id: "cooling_type",
    text: "Preferensi Jenis Pendingin?",
    options: [
      "Pasif (Tanpa Kipas/Fanless)",
      "Aktif (Kipas Standar)",
      "Premium (Vapor Chamber/Kipas Ganda)",
    ],
    logic_type: "SPECS_WEIGHT",
    logic_data: { cooling_type_score: [0, 1, 2] },
  },
  {
    id: "cpu_core_clock",
    text: "Prioritas Jumlah Core CPU atau Kecepatan Clock?",
    options: [
      "Jumlah Core Banyak (Multitasking/Rendering)",
      "Kecepatan Clock Tinggi (Gaming/Aplikasi Ringan)",
    ],
    logic_type: "SPECS_WEIGHT",
    logic_data: { cpu_core_vs_clock: [2, 1] },
  },
  {
    id: "color_accuracy",
    text: "Kebutuhan Akurasi Warna (Color Grading/Desain)?",
    options: [
      "Standar (Tidak begitu penting)",
      "Akurat (Warna Wajib mendekati 100% sRGB/DCI-P3)",
    ],
    logic_type: "SPECS_WEIGHT",
    logic_data: { display_color_score: [1, 3] },
  },
  {
    id: "mux_switch",
    text: "Laptop Anda Wajib Memiliki Fitur MUX Switch (khusus gaming)?",
    options: ["Ya", "Tidak"],
    logic_type: "COMPONENT_FILTER",
    logic_data: { filter_features: ["MUX Switch"] },
  },
  {
    id: "panel_type",
    text: "Tipe Panel Layar Mana yang Anda Prioritaskan?",
    options: ["IPS", "OLED", "TN/VA"],
    logic_type: "SPECS_WEIGHT",
    logic_data: { display_panel_score: [2, 3, 1] },
  },
  {
    id: "resolution_min",
    text: "Target Resolusi Layar Minimum?",
    options: [
      "FHD (1080p) - Standar",
      "QHD (2K)/WQXGA (2.5K)",
      "UHD (4K) - Maksimal",
    ],
    logic_type: "SPECS_WEIGHT",
    logic_data: { display_res_score: [1, 2, 3] },
  },
  {
    id: "refresh_rate_min",
    text: "Minimum Refresh Rate Layar yang Diinginkan?",
    options: ["60Hz (Standar)", "120Hz - 144Hz", "240Hz ke Atas"],
    logic_type: "SPECS_MATCH",
    logic_data: { display_hz_min: [60, 120, 240] },
  },
  {
    id: "brightness_min",
    text: "Kecerahan Layar (Brightness) Minimum yang Anda Butuhkan?",
    options: [
      "250 - 300 nits (Cukup untuk indoor)",
      "400 - 500 nits (Untuk penggunaan outdoor)",
    ],
    logic_type: "SPECS_MATCH",
    logic_data: { display_nits_min: [300, 400] },
  },
  {
    id: "display_surface",
    text: "Jenis Lapisan Layar yang Anda Inginkan?",
    options: [
      "Matte (Doff / Anti-silau)",
      "Glossy (Berkilau / Warna lebih pekat)",
    ],
    logic_type: "COMPONENT_FILTER",
    logic_data: { filter_display_surface: ["Matte", "Glossy"] },
  },
  {
    id: "touchscreen_req",
    text: "Kebutuhan Touchscreen (Layar Sentuh)?",
    options: ["Wajib Ada", "Tidak Perlu"],
    logic_type: "COMPONENT_FILTER",
    logic_data: { filter_features: ["Touchscreen"] },
  },
  {
    id: "bezel_priority",
    text: "Prioritas Bezel (Bingkai) Layar?",
    options: ["Sangat Tipis (Slim Bezel)", "Standar"],
    logic_type: "SPECS_WEIGHT",
    logic_data: { display_bezel_score: [1, 0] },
  },
  {
    id: "webcam_quality",
    text: "Kebutuhan Kamera Depan (Webcam) Kualitas?",
    options: ["HD (720p) Standar", "FHD (1080p) Jelas"],
    logic_type: "SPECS_WEIGHT",
    logic_data: { webcam_res_score: [1, 2] },
  },
  {
    id: "privacy_shutter",
    text: "Kebutuhan Fitur Privacy Shutter pada Webcam?",
    options: ["Wajib", "Tidak Perlu"],
    logic_type: "COMPONENT_FILTER",
    logic_data: { filter_features: ["Privacy Shutter"] },
  },
  {
    id: "audio_quality",
    text: "Kebutuhan Audio Speaker Berkualitas (Premium)?",
    options: [
      "Speaker Standar Cukup",
      "Wajib Speaker Premium (Harman Kardon/Dolby Atmos, dll)",
    ],
    logic_type: "SPECS_WEIGHT",
    logic_data: { audio_score: [1, 2] },
  },
  {
    id: "aspect_ratio",
    text: "Rasio Aspek Layar yang Anda Inginkan?",
    options: ["16:9 (Klasik)", "16:10 atau 3:2 (Produktivitas)"],
    logic_type: "COMPONENT_FILTER",
    logic_data: { filter_display_aspect: ["16:9", "16:10"] },
  },
  {
    id: "color_preference",
    text: "Warna Laptop yang Anda Prioritaskan?",
    options: ["Hitam / Abu-abu (Stealth)", "Putih / Silver / Warna Cerah"],
    logic_type: "COMPONENT_FILTER",
    logic_data: { filter_color: ["Dark", "Light"] },
  },
  {
    id: "body_material",
    text: "Jenis Material Body yang Dikehendaki?",
    options: [
      "Plastik / Polikarbonat (Lebih Ringan)",
      "Aluminium / Magnesium Alloy (Lebih Kokoh/Premium)",
    ],
    logic_type: "SPECS_WEIGHT",
    logic_data: { build_material_score: [1, 2] },
  },
  {
    id: "convertible_req",
    text: "Kebutuhan Laptop Konvertibel (2-in-1, bisa jadi tablet)?",
    options: ["Wajib", "Tidak Perlu"],
    logic_type: "COMPONENT_FILTER",
    logic_data: { filter_form_factor: ["Convertible"] },
  },
  {
    id: "stylus_support",
    text: "Kebutuhan Stylus / Pen Support?",
    options: ["Wajib (Untuk menggambar/mencatat)", "Tidak Perlu"],
    logic_type: "COMPONENT_FILTER",
    logic_data: { filter_features: ["Stylus Support"] },
  },
  {
    id: "weight_max",
    text: "Berat Laptop Maksimal yang Anda Toleransi?",
    options: ["< 1.3 kg", "1.3 - 1.8 kg", "> 1.8 kg"],
    logic_type: "SPECS_MATCH",
    logic_data: { weight_kg_max: [1.3, 1.8, 3.0] },
  },
  {
    id: "battery_life_min",
    text: "Daya Tahan Baterai Minimum (Saat Browsing Ringan)?",
    options: ["4 Jam atau Kurang", "6 - 8 Jam", "10 Jam atau Lebih"],
    logic_type: "SPECS_MATCH",
    logic_data: { battery_hours_min: [4, 6, 10] },
  },
  {
    id: "fast_charging",
    text: "Kebutuhan Fitur Pengisian Daya Cepat (Fast Charging)?",
    options: ["Sangat Penting", "Tidak Terlalu Penting"],
    logic_type: "SPECS_WEIGHT",
    logic_data: { battery_fast_charge_score: [1, 0] },
  },
  {
    id: "wifi_type",
    text: "Jenis Koneksi Nirkabel Utama yang Wajib Tersedia?",
    options: ["WiFi 5 (802.11ac)", "WiFi 6 atau Lebih Tinggi"],
    logic_type: "SPECS_WEIGHT",
    logic_data: { wifi_version_score: [1, 2] },
  },
  {
    id: "numpad_req",
    text: "Kebutuhan Keyboard dengan Numpad (Keypad Angka)?",
    options: ["Wajib Ada", "Tidak Perlu"],
    logic_type: "COMPONENT_FILTER",
    logic_data: { filter_keyboard_layout: ["Numpad"] },
  },
  {
    id: "keyboard_backlight",
    text: "Preferensi Tipe Backlight Keyboard?",
    options: ["Tidak Ada Backlight / Putih Saja", "RGB (Gaming/Estetika)"],
    logic_type: "COMPONENT_FILTER",
    logic_data: { filter_keyboard_backlight: ["White", "RGB"] },
  },
  {
    id: "thunderbolt_req",
    text: "Kebutuhan Port USB-C dengan Dukungan Thunderbolt?",
    options: ["Wajib Ada", "Tidak Perlu"],
    logic_type: "COMPONENT_FILTER",
    logic_data: { filter_ports: ["Thunderbolt"] },
  },
  {
    id: "hdmi_full_req",
    text: "Kebutuhan Port HDMI Ukuran Penuh (Full-size)?",
    options: ["Wajib Ada", "Mini HDMI/Adapter Cukup"],
    logic_type: "COMPONENT_FILTER",
    logic_data: { filter_ports: ["Full HDMI"] },
  },
  {
    id: "sdcard_req",
    text: "Kebutuhan SD Card Reader (Slot Kartu Memori)?",
    options: ["Wajib Ada", "Tidak Perlu"],
    logic_type: "COMPONENT_FILTER",
    logic_data: { filter_ports: ["SD Card Reader"] },
  },
  {
    id: "biometrics_req",
    text: "Kebutuhan Fitur Keamanan Biometrik?",
    options: ["Wajib (Fingerprint Reader / Face Recognition)", "Tidak Perlu"],
    logic_type: "COMPONENT_FILTER",
    logic_data: { filter_features: ["Biometrics"] },
  },
  {
    id: "mil_spec_req",
    text: "Prioritas Kualitas dan Ketahanan Bodi Laptop?",
    options: [
      "Harus Memenuhi Standar Ketahanan (Military Grade)",
      "Standar Cukup",
    ],
    logic_type: "SPECS_WEIGHT",
    logic_data: { durability_score: [2, 1] },
  },
  {
    id: "privacy_filter_req",
    text: "Kebutuhan Privacy Filter (Anti-Spy Screen)?",
    options: ["Wajib", "Tidak Perlu"],
    logic_type: "COMPONENT_FILTER",
    logic_data: { filter_features: ["Privacy Filter"] },
  },
  {
    id: "key_travel",
    text: "Kebutuhan Keyboard Travel Distance (Jarak Tekan Tombol)?",
    options: [
      "Jarak Jauh/Dalam (Nyaman untuk mengetik lama)",
      "Jarak Pendek/Tipis (Sesuai laptop tipis)",
    ],
    logic_type: "SPECS_WEIGHT",
    logic_data: { keyboard_comfort_score: [2, 1] },
  },
  {
    id: "purchase_priority",
    text: "Pertimbangan Utama Saat Membeli Laptop?",
    options: [
      "Performa Mutlak (Tanpa Kompromi Harga)",
      "Keseimbangan Performa dan Harga",
    ],
    logic_type: "SPECS_WEIGHT",
    logic_data: { price_vs_performance_weight: [2, 1] },
  },
  {
    id: "build_quality_prio",
    text: "Bagaimana Prioritas Kualitas Pembuatan (Build Quality) Anda?",
    options: ["Sangat Penting (Harus Premium)", "Cukup Asal Awet"],
    logic_type: "SPECS_WEIGHT",
    logic_data: { build_quality_score: [2, 1] },
  },
];

let currentQuestionIndex = 0;
const userAnswers = {};

let quizContainer;
let progressBarContainer;
let navButtonsPlaceholder;
const totalQuestions = quizData.length;

// Fungsi untuk membuat dan menampilkan pertanyaan saat ini
function renderQuestion() {
  if (currentQuestionIndex >= totalQuestions) {
    displayResults();
    return;
  }

  const question = quizData[currentQuestionIndex];
  const isAnswered =
    userAnswers[question.id] && !userAnswers[question.id].skipped;

  // --- RENDER PROGRESS BAR ---
  const answeredCount = Object.values(userAnswers).filter(
    (a) => !a.skipped
  ).length;
  const progressPercentage = Math.round((answeredCount / totalQuestions) * 100);
  const progressHTML = `
        <div class="progress-text">
            <span>Progress</span>
            <span>Pertanyaan ${
              currentQuestionIndex + 1
            } dari ${totalQuestions} — ${progressPercentage}%</span>
        </div>
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${progressPercentage}%;"></div>
        </div>
    `;
  progressBarContainer.innerHTML = progressHTML;

  // --- RENDER QUESTION CARD (HANYA PERTANYAAN & OPSI) ---
  let cardHTML = `
        <h2 class="question-text">${question.text}</h2>
        <div class="options-container">
    `;

  question.options.forEach((option, index) => {
    const isSelected =
      isAnswered && userAnswers[question.id].selectedIndex === index
        ? "selected"
        : "";

    cardHTML += `
            <button class="option-button ${isSelected}" data-index="${index}" data-id="${question.id}">
                ${option}
            </button>
        `;
  });

  cardHTML += `</div>`;
  quizContainer.innerHTML = cardHTML;

  // --- RENDER NAVIGATION BUTTONS (DI TEMPAT TERPISAH) ---
  renderButtons(isAnswered);

  // --- TAMBAHKAN EVENT LISTENERS ---

  // 1. Tombol Opsi
  document.querySelectorAll(".option-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      // Hapus kelas 'selected' dari semua tombol, lalu tambahkan ke tombol yang diklik
      document
        .querySelectorAll(".option-button")
        .forEach((btn) => btn.classList.remove("selected"));
      e.target.classList.add("selected");

      // Aktifkan tombol Lanjut setelah memilih
      document.getElementById("next-btn").disabled = false;
    });
  });
}

// FUNGSI untuk merender tombol navigasi
function renderButtons(isAnswered) {
  const nextButtonDisabled = isAnswered ? "" : "disabled";
  const nextButtonText =
    currentQuestionIndex === totalQuestions - 1 ? "Selesai" : "Lanjut";

  let buttonsHTML = ``;
  if (currentQuestionIndex > 0) {
    buttonsHTML += `<button id="prev-btn" class="nav-button prev-button">Kembali</button>`;
  } else {
    // Placeholder untuk menjaga layout
    buttonsHTML += `<span></span>`;
  }

  buttonsHTML += `<button id="next-btn" class="nav-button next-button" ${nextButtonDisabled}>${nextButtonText}</button>`;

  navButtonsPlaceholder.innerHTML = buttonsHTML;

  // Tambahkan Event Listeners untuk Tombol Navigasi
  document.getElementById("next-btn")?.addEventListener("click", handleNext);
  document.getElementById("prev-btn")?.addEventListener("click", () => {
    currentQuestionIndex--;
    renderQuestion();
  });
}

// Fungsi baru untuk menangani Tombol Lanjut/Selesai
function handleNext() {
  const selectedButton = document.querySelector(".option-button.selected");

  if (!selectedButton) {
    console.warn("Anda harus memilih jawaban sebelum melanjutkan!");
    return;
  }

  const questionId = selectedButton.dataset.id;
  const selectedIndex = parseInt(selectedButton.dataset.index);
  const question = quizData.find((q) => q.id === questionId);

  // 1. Simpan Jawaban
  userAnswers[questionId] = {
    selectedIndex: selectedIndex,
    selectedOption: question.options[selectedIndex],
    logicData: {},
  };

  // 2. Terapkan Data Logika
  const logicDataKeys = Object.keys(question.logic_data);
  logicDataKeys.forEach((key) => {
    const valueArray = question.logic_data[key];
    userAnswers[questionId].logicData[key] = valueArray[selectedIndex];
  });

  // 3. Logic Cabang (Skipping Pertanyaan)

  let nextIndex = currentQuestionIndex + 1;

  // A. Logic Cabang CPU
  if (questionId === "cpu_brand") {
    const selectedBrand = userAnswers[questionId].selectedOption;

    const intelIndex = quizData.findIndex((q) => q.id === "cpu_level_intel");
    const amdIndex = quizData.findIndex((q) => q.id === "cpu_level_amd");

    // Reset status skipped untuk kedua pertanyaan
    delete userAnswers["cpu_level_intel"];
    delete userAnswers["cpu_level_amd"];

    if (selectedBrand.includes("Intel")) {
      userAnswers["cpu_level_amd"] = { skipped: true };
      nextIndex = intelIndex;
    } else if (selectedBrand.includes("AMD")) {
      userAnswers["cpu_level_intel"] = { skipped: true };
      nextIndex = amdIndex;
    } else {
      // Apple/Tidak Ada, skip keduanya dan lanjut setelah 'cpu_level_amd'
      userAnswers["cpu_level_intel"] = { skipped: true };
      userAnswers["cpu_level_amd"] = { skipped: true };
      nextIndex = amdIndex + 1;
    }
  }

  // B. Logic Cabang VGA Type
  else if (questionId === "vga_type") {
    const selectedVGA = userAnswers[questionId].selectedOption;

    const dgpuBrandIndex = quizData.findIndex((q) => q.id === "dgpu_brand");
    const nvidiaMinIndex = quizData.findIndex((q) => q.id === "nvidia_min");
    const vramMinIndex = quizData.findIndex((q) => q.id === "vram_min");

    // Reset status skipped untuk pertanyaan VGA
    delete userAnswers["dgpu_brand"];
    delete userAnswers["nvidia_min"];
    delete userAnswers["vram_min"];

    if (selectedVGA.includes("Terintegrasi")) {
      // Skip 3 pertanyaan (dgpu_brand, nvidia_min, vram_min)
      userAnswers["dgpu_brand"] = { skipped: true };
      userAnswers["nvidia_min"] = { skipped: true };
      userAnswers["vram_min"] = { skipped: true };

      // Lanjut setelah VRAM Min
      nextIndex = vramMinIndex + 1;
    } else {
      // Lanjut normal ke 'dgpu_brand'
      nextIndex = dgpuBrandIndex;
    }
  }

  // C. Logic Cabang dGPU Brand
  else if (questionId === "dgpu_brand") {
    const selectedBrand = userAnswers[questionId].selectedOption;
    const nvidiaMinIndex = quizData.findIndex((q) => q.id === "nvidia_min");
    const vramMinIndex = quizData.findIndex((q) => q.id === "vram_min");

    // Reset status skipped untuk pertanyaan NVIDIA Min
    delete userAnswers["nvidia_min"];

    if (selectedBrand.includes("NVIDIA")) {
      // Lanjut ke pertanyaan NVIDIA Min
      nextIndex = nvidiaMinIndex;
    } else {
      // Jika pilih AMD/Tidak Ada, skip NVIDIA Min dan lanjut ke VRAM Min
      userAnswers["nvidia_min"] = { skipped: true };
      nextIndex = vramMinIndex;
    }
  }

  // Atur index pertanyaan selanjutnya
  currentQuestionIndex = nextIndex;

  // Render pertanyaan selanjutnya
  renderQuestion();
}

// Fungsi yang dipanggil ketika kuis selesai
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

  console.log("Data Logika Final yang Akan Dikirim ke Server:", finalLogic);

  // Kirim data logika ke script PHP ('rekomendasi-laptop.php')
  sendDataToServer(finalLogic);
}

// Fungsi untuk mengirim data ke server PHP menggunakan AJAX (Fetch API)
function sendDataToServer(data) {
  const recommendationURL = "rekomendasi-laptop.php";

  fetch(recommendationURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
    .then((recommendations) => {
      console.log("Rekomendasi diterima:", recommendations);
      displayRecommendationCards(recommendations);
    })
    .catch((error) => {
      console.error(
        "Error saat mengirim data atau memproses rekomendasi:",
        error
      );
      quizContainer.innerHTML = `<h2 class="question-text">Terjadi Kesalahan!</h2><p class="loading-text">Tidak dapat memproses rekomendasi. (${error.message})</p>`;

      // Pastikan no-scroll dihapus jika ada error
      document.body.classList.remove("no-scroll");
    });
}

// FUNGSI UNTUK MENAMPILKAN HASIL AKHIR 4 CARD
function displayRecommendationCards(recommendations) {
  if (recommendations.length === 0) {
    document.querySelector(".quiz-area").innerHTML =
      '<section class="section-flex" style="margin-top: 15vh;"><div class="quiz-main-card"><h2 class="question-text" style="text-align: center;">Tidak Ada Rekomendasi</h2><p class="loading-text" style="text-align: center;">Maaf, tidak ada laptop yang sesuai dengan semua kriteria ketat Anda. Coba kembali dengan kriteria yang lebih fleksibel.</p></div></section>';

    // Pastikan no-scroll dihapus jika tidak ada hasil
    document.body.classList.remove("no-scroll");

    return;
  }

  // Hapus style quiz-card dan progress bar dari parent
  document.getElementById("quiz-progress-bar").innerHTML = "";

  // MENGGANTI KONTEN DI .quiz-area (Parent Utama)
  let html = `
        <section class="section-flex" style="margin-top: 5vh;">
            <h1 style="font-size: 200%; display: flex; align-items: center; color: white; justify-content: center;">Rekomendasi Laptop Untuk Anda</h1>
        </section>
        
        <section class="section-flex" style="gap: 5vh;">
    `;

  recommendations.forEach((laptop) => {
    // Menggunakan struktur card yang sama dengan produk.php
    html += `
            <div style="background-image: url('img/laptop/${laptop.gambar}'); background-size: cover; flex-shrink: 0;" class="card">
                <div class="card-details">
                    <p class="text-title">${laptop.nama_produk}</p>
                </div>
                <a href="${laptop.link_resmi}" class="card-button">More info</a>
            </div>
        `;
  });

  // Tambahkan placeholder jika hasil kurang dari 4
  const cardsDisplayed = recommendations.length;
  for (let i = cardsDisplayed; i < 4; i++) {
    html += `
            <div style="background-color: #333; border: 1px dashed #555; height: 254px; width: 190px; border-radius: 20px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; color: #888;" class="card">
                <p>Slot Kosong</p>
            </div>
        `;
  }

  html += "</section>";

  // Ganti seluruh konten di <section class="quiz-area">
  document.querySelector(".quiz-area").innerHTML = html;

  // KOREKSI: Hanya hapus class no-scroll yang dipasang saat kuis
  document.body.classList.remove("no-scroll");
}

// Panggil fungsi inisialisasi kuis saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  // INISIALISASI VARIABEL HARUS DI SINI
  quizContainer = document.getElementById("quiz-container");
  progressBarContainer = document.getElementById("quiz-progress-bar");
  navButtonsPlaceholder = document.getElementById("nav-buttons-placeholder");

  if (quizContainer && progressBarContainer && navButtonsPlaceholder) {
    // KOREKSI: Tambahkan no-scroll saat kuis dimulai untuk mencegah double scroll
    document.body.classList.add("no-scroll");
    renderQuestion();
  } else {
    // Abaikan eksekusi script ini jika elemen kuis tidak ada (misal di index.html)
  }
});
