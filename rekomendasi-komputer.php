<?php
// ============================================================================
// File: rekomendasi-komputer.php
// Logika Sistem Pakar (Backend) - FIX: Menjamin 4 Hasil Per Kategori (Fallback Logic)
// ============================================================================

// Header dan Error Handling (Sama seperti sebelumnya)
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// 1. INCLUDE KONEKSI DATABASE
include 'helper/conn.php';

// 2. FUNGSI HELPER SQL KRITIS (Untuk konversi ENUM ke Angka)
function get_numeric_value_sql($column)
{
    return "CAST(SUBSTRING_INDEX({$column}, ' ', 1) AS UNSIGNED)";
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (json_last_error() !== JSON_ERROR_NONE || empty($data)) {
    http_response_code(400);
    echo json_encode(['error' => 'Data input tidak valid. Cek format JSON.']);
    mysqli_close($conn);
    exit;
}

// 3. INISIALISASI KRITERIA DARI KUIS
$total_budget = $data['max_price'] ?? 10000000;
$use_case_prio = $data['use_case_prio'] ?? 1;
$socket_filter = $data['socket_filter'] ?? 'LGA 1700';
$ram_type_filter = $data['ram_type_filter'] ?? 'DDR 4';
$ram_capacity_min = $data['ram_capacity_min_gb'] ?? 16;
$vga_required = $data['vga_required'] ?? true;
$vga_brand_filter = $data['vga_brand_filter'] ?? null;
$form_factor_filter = $data['form_factor_filter'] ?? 'mATX';
$vram_min_gb_int = $data['vram_min_gb'] ?? 8;
$cpu_tier_score = $data['cpu_tier_score'] ?? 1;
$gpu_tier_score = $data['gpu_tier_score'] ?? 1;
$ram_speed_min_mhz = $data['ram_speed_min_mhz'] ?? 3200;
$psu_quality_score = $data['psu_quality_score'] ?? 1;
$hdd_req = $data['require_hdd_secondary'] ?? false;


// LOGIKA ALOKASI BUDGET PROPORSIONAL (Sama seperti sebelumnya)
function get_budget_allocation($prio, $hdd_req)
{
    $allocation = ['VGA' => 0.35, 'CPU' => 0.18, 'Motherboard' => 0.12, 'RAM' => 0.08, 'Penyimpanan (SSD)' => 0.08, 'PSU' => 0.07, 'Penyimpanan (HDD)' => 0, 'Sisa_Misc' => 0.12];
    if ($prio >= 4) {
        $allocation['VGA'] = 0.45;
        $allocation['CPU'] = 0.20;
        $allocation['Motherboard'] = 0.10;
        $allocation['RAM'] = 0.08;
        $allocation['Penyimpanan (SSD)'] = 0.07;
        $allocation['PSU'] = 0.08;
        $allocation['Sisa_Misc'] = 0.02;
    } elseif ($prio == 3) {
        $allocation['VGA'] = 0.30;
        $allocation['CPU'] = 0.25;
        $allocation['Motherboard'] = 0.12;
        $allocation['RAM'] = 0.10;
        $allocation['Penyimpanan (SSD)'] = 0.10;
        $allocation['PSU'] = 0.08;
        $allocation['Sisa_Misc'] = 0.05;
    }
    if ($hdd_req) {
        $hdd_share = 0.05;
        $allocation['Penyimpanan (HDD)'] = $hdd_share;
        $allocation['Sisa_Misc'] -= $hdd_share;
    }
    return $allocation;
}

$allocation = get_budget_allocation($use_case_prio, $hdd_req);
$allocated_budget = [];
foreach ($allocation as $component => $percent) {
    $allocated_budget[$component] = $total_budget * $percent;
}

// 4. FUNGSI PENCARIAN TOP N KOMPONEN DENGAN FALLBACK LOGIC
/**
 * Mencari Top N komponen dengan 3 level Fallback.
 */
function search_top_components($conn, $table, $max_price, $where_clauses_strict, $score_ranking_clause = '', $limit = 4)
{

    // --- LEVEL 1: Filter Ketat (Kompatibilitas + Budget) ---
    $results = [];
    $where_1 = $where_clauses_strict;
    if ($max_price > 0) {
        $where_1[] = "harga <= " . $max_price;
    }

    $sql_1 = "SELECT * FROM {$table}";
    if (!empty($where_1)) {
        $sql_1 .= " WHERE " . implode(' AND ', $where_1);
    }
    $sql_1 .= ($score_ranking_clause ? " ORDER BY {$score_ranking_clause} DESC, harga ASC" : " ORDER BY harga ASC") . " LIMIT {$limit}";

    $result = mysqli_query($conn, $sql_1);
    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {
            $results[] = $row;
        }
    } else {
        error_log("SQL Error (L1) on {$table}: " . mysqli_error($conn));
    }

    if (count($results) == $limit)
        return $results;

    // --- LEVEL 2: Fallback Kompatibilitas Mutlak (Hapus Budget) ---
    if (count($results) < $limit) {
        $where_2 = $where_clauses_strict;

        $sql_2 = "SELECT * FROM {$table}";
        if (!empty($where_2)) {
            $sql_2 .= " WHERE " . implode(' AND ', $where_2);
        }
        $sql_2 .= ($score_ranking_clause ? " ORDER BY {$score_ranking_clause} DESC, harga ASC" : " ORDER BY harga ASC") . " LIMIT {$limit}";

        $result = mysqli_query($conn, $sql_2);
        if ($result) {
            $results = [];
            while ($row = mysqli_fetch_assoc($result)) {
                $results[] = $row;
            }
        } else {
            error_log("SQL Error (L2) on {$table}: " . mysqli_error($conn));
        }

        if (count($results) == $limit)
            return $results;
    }

    // --- LEVEL 3: Fallback Total (Ambil Apapun) ---
    if (count($results) < $limit) {
        $sql_3 = "SELECT * FROM {$table} ORDER BY harga ASC LIMIT {$limit}";
        $result = mysqli_query($conn, $sql_3);
        if ($result) {
            $results = [];
            while ($row = mysqli_fetch_assoc($result)) {
                $results[] = $row;
            }
        } else {
            error_log("SQL Error (L3) on {$table}: " . mysqli_error($conn));
        }
    }

    return $results;
}

// 5. PENCARIAN TOP 4 KOMPONEN PER KATEGORI (FIXED QUERIES)

$final_recommendations = [];

// --- A. PROCESSOR ---
$proc_where = ["socket = '{$socket_filter}'"];
if ($data['cpu_brand_filter'])
    $proc_where[] = "nama_produk LIKE '{$data['cpu_brand_filter']}'";

$numeric_cores_sql = get_numeric_value_sql('jumlah_core');
$proc_score = "{$numeric_cores_sql}"; // Ranking hanya berdasarkan Core Count

$final_recommendations['Processor'] = search_top_components(
    $conn,
    'processor',
    $allocated_budget['CPU'],
    $proc_where,
    $proc_score
);

// --- B. MOTHERBOARD ---
$mobo_where = ["socket = '{$socket_filter}'", "tipe_ram_didukung = '{$ram_type_filter}'", "form_factor = '{$form_factor_filter}'"];
$mobo_score = "FIELD(chipset, 'Z790', 'X670E', 'B650', 'B760', 'H610', 'A620', 'A520')";
$final_recommendations['Motherboard'] = search_top_components(
    $conn,
    'motherboard',
    $allocated_budget['Motherboard'],
    $mobo_where,
    $mobo_score
);

// --- C. RAM ---
$required_stick_capacity = $ram_capacity_min / 2;
$ram_budget_per_stick = $allocated_budget['RAM'] / 2;
$ram_where = ["tipe = '{$ram_type_filter}'", "kapasitas = '" . ($ram_capacity_min / 2) . " GB'", "kecepatan >= {$ram_speed_min_mhz}"];
$ram_score = "kecepatan";
$final_recommendations['RAM (2 Keping)'] = search_top_components(
    $conn,
    'ram',
    $ram_budget_per_stick,
    $ram_where,
    $ram_score
);

// --- D. VGA ---
$vga_where = [];
$numeric_vram_sql = get_numeric_value_sql('vram');
$vga_where[] = "{$numeric_vram_sql} >= {$vram_min_gb_int}";
$vga_budget = $allocated_budget['VGA'];
if ($vga_required) {
    if ($data['vga_brand_filter'])
        $vga_where[] = "nama_produk LIKE '{$data['vga_brand_filter']}'";
} else {
    $vga_budget = $allocated_budget['Sisa_Misc'] / 2;
    $vga_where[] = "kebutuhan_daya <= 30";
}
$vga_score = "{$numeric_vram_sql}";
$final_recommendations['VGA'] = search_top_components(
    $conn,
    'vga',
    $vga_budget,
    $vga_where,
    $vga_score
);

// --- E. PENYIMPANAN (SSD) ---
$storage_where = ["tipe LIKE '{$data['storage_main_type_filter']}'"];
$storage_score = "kecepatan_baca";
$final_recommendations['Penyimpanan (SSD)'] = search_top_components(
    $conn,
    'penyimpanan',
    $allocated_budget['Penyimpanan (SSD)'],
    $storage_where,
    $storage_score
);

// --- F. PENYIMPANAN (HDD) ---
if ($hdd_req) {
    $hdd_where = ["tipe = 'HDD'"];
    $final_recommendations['Penyimpanan (HDD)'] = search_top_components(
        $conn,
        'penyimpanan',
        $allocated_budget['Penyimpanan (HDD)'],
        $hdd_where,
        'kapasitas',
        2
    );
}

// --- G. PSU ---
$psu_where = [];
$psu_score = "daya";
$final_recommendations['PSU'] = search_top_components(
    $conn,
    'psu',
    $allocated_budget['PSU'],
    $psu_where,
    $psu_score
);


// 6. PENGEMBALIAN HASIL
$has_recommendation = false;
foreach ($final_recommendations as $category => $items) {
    if (!empty($items)) {
        $has_recommendation = true;
    }
}

if (!$has_recommendation) {
    http_response_code(200);
    echo json_encode(['recommendations' => [], 'error' => 'Sistem gagal menemukan komponen untuk dialokasikan. Kesalahan serius terjadi di database.']);
} else {
    http_response_code(200);
    echo json_encode($final_recommendations);
}

mysqli_close($conn);