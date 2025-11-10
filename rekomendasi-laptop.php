<?php
// Atur header agar browser tahu bahwa responsnya adalah JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Matikan display error agar error PHP tidak merusak output JSON
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1); // Log error ke file log jika ada

// 1. INCLUDE KONEKSI DATABASE
include 'helper/conn.php';

// Cek apakah data POST diterima
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Pastikan data berhasil di-decode dan tidak kosong
if (json_last_error() !== JSON_ERROR_NONE || empty($data)) {
    http_response_code(400);
    echo json_encode(['error' => 'Data input tidak valid. Server tidak menerima JSON dari kuis.']);
    mysqli_close($conn);
    exit;
}

// Inisialisasi array untuk klausa WHERE (Filter Keras) dan ORDER BY (Bobot Ranking)
$where_clauses = [];
$score_ranking = [];

// Fungsi pembantu untuk mengkonversi string ENUM 'X GB'/'X T' menjadi nilai numerik GB untuk perbandingan
function convert_storage_to_gb($storage_str)
{
    $storage_str = trim(strtoupper($storage_str));
    if (strpos($storage_str, 'GB') !== false) {
        return (int) str_replace(' GB', '', $storage_str);
    }
    if (strpos($storage_str, 'T') !== false) {
        $value = (int) str_replace(' T', '', $storage_str);
        if ($value >= 1)
            return $value * 1024;
    }
    if (strpos($storage_str, '> 1 T') !== false) {
        return 2048; // Nilai besar untuk > 1TB
    }
    return 0;
}


// === MAPPING LOGIC KUIS KE KOLOM DATABASE YANG ADA ===

foreach ($data as $key => $value) {
    if ($value === null || $value === '' || $value === 'null') {
        continue;
    }

    switch ($key) {
        // --- HARD FILTERS (Wajib Dipenuhi) ---

        case 'filter_cpu_brand':
            // Prosessor Brand
            if ($value === 'Intel' || $value === 'AMD') {
                $where_clauses[] = "prosessor LIKE '%" . mysqli_real_escape_string($conn, $value) . "%'";
            } else if ($value === 'Apple (M-Series)') {
                $where_clauses[] = "prosessor LIKE '%Apple%'";
            }
            break;

        case 'ram_gb_min':
            // RAM Minimum. Konversi RAM ENUM ke angka dan filter di PHP
            $ram_min_gb = (int) $value;
            $ram_enum = ['8 GB', '16 GB', '32 GB', '64 GB'];
            $allowed_ram_enums = [];

            foreach ($ram_enum as $option) {
                if (convert_storage_to_gb($option) >= $ram_min_gb) {
                    $allowed_ram_enums[] = "'" . $option . "'";
                }
            }
            if (!empty($allowed_ram_enums)) {
                $where_clauses[] = "ram IN (" . implode(', ', $allowed_ram_enums) . ")";
            }
            break;

        case 'storage_cap_prime':
            // Penyimpanan Minimum. Konversi Penyimpanan ENUM ke angka dan filter di PHP
            $storage_min_val = (int) $value;
            $storage_enum = ['256 GB', '512 GB', '1 T', '> 1 T'];
            $allowed_storage_enums = [];

            if ($storage_min_val <= 256) {
                $allowed_storage_enums = ["'256 GB'", "'512 GB'", "'1 T'", "'> 1 T'"];
            } else if ($storage_min_val <= 512) {
                $allowed_storage_enums = ["'512 GB'", "'1 T'", "'> 1 T'"];
            } else if ($storage_min_val >= 1024) { // 1 T atau lebih
                $allowed_storage_enums = ["'1 T'", "'> 1 T'"];
            }

            if (!empty($allowed_storage_enums)) {
                $where_clauses[] = "penyimpanan IN (" . implode(', ', $allowed_storage_enums) . ")";
            }
            break;

        case 'weight_kg_max':
            // Filter Berat (Kolom FLOAT: aman)
            $where_clauses[] = "berat <= " . (float) $value;
            break;

        // --- SOFT FILTERS (Mengubah filter keras yang tidak selalu ada menjadi ranking) ---

        case 'filter_vga_type':
            // Tipe VGA (Dedicated vs Integrated). Diubah menjadi ranking.
            if ($value === 'Dedicated') {
                $score_ranking[] = "(CASE WHEN prosessor LIKE '%NVIDIA%' OR prosessor LIKE '%AMD%' THEN 2 ELSE 1 END) DESC";
            } else {
                $score_ranking[] = "(CASE WHEN prosessor LIKE '%Intel%' OR prosessor LIKE '%Apple%' THEN 2 ELSE 1 END) DESC";
            }
            break;

        case 'filter_vga_brand':
            // Brand VGA (NVIDIA/AMD)
            if ($value === 'NVIDIA' || $value === 'AMD') {
                $score_ranking[] = "(CASE WHEN vga LIKE '%" . mysqli_real_escape_string($conn, $value) . "%' THEN 1 ELSE 0 END) DESC";
            }
            break;

        // --- SOFT WEIGHTS (Bobot Ranking) ---

        case 'cpu_score':
            // Ranking CPU (i9/R9 > i7/R7 > i5/R5 > lainnya)
            $score_ranking[] = "
                 (CASE 
                    WHEN prosessor LIKE '%i9%' OR prosessor LIKE '%Ryzen 9%' THEN 4 
                    WHEN prosessor LIKE '%i7%' OR prosessor LIKE '%Ryzen 7%' THEN 3 
                    WHEN prosessor LIKE '%i5%' OR prosessor LIKE '%Ryzen 5%' THEN 2 
                    WHEN prosessor LIKE '%Apple%' THEN 3
                    ELSE 1 
                 END) DESC";
            break;

        case 'display_panel_score':
            // Ranking Panel Layar (OLED > IPS > VA/TN)
            $score_ranking[] = "
                (CASE 
                    WHEN panel_layar = 'OLED' THEN 3 
                    WHEN panel_layar = 'IPS' THEN 2 
                    ELSE 1 
                END) DESC";
            break;

        case 'resolution_min':
            // Ranking Resolusi Layar (4k > QHD/WQXD > FHD > HD)
            $score_ranking[] = "
                (CASE 
                    WHEN resolusi_layar LIKE '%4k%' THEN 4
                    WHEN resolusi_layar LIKE '%QHD%' OR resolusi_layar LIKE '%WQXD%' THEN 3
                    WHEN resolusi_layar LIKE '%FHD%' THEN 2
                    ELSE 1 
                END) DESC";
            break;

        case 'price_vs_performance_weight':
            // Jika pilih Performa Mutlak (value=2), ranking berdasarkan harga tertinggi (mahal)
            if ($value == 2) {
                $score_ranking[] = "harga DESC";
            } else {
                // Jika pilih Keseimbangan (value=1), ranking berdasarkan harga terendah (murah)
                $score_ranking[] = "harga ASC";
            }
            break;

        case 'color_accuracy':
            // Jika Akurat (3), prioritaskan laptop dengan kebutuhan desain
            if ($value == 3) {
                $score_ranking[] = "(CASE WHEN kebutuhan_pengguna LIKE '%Desain%' THEN 2 ELSE 1 END) DESC";
            }
            break;
        // KASUS LAINNYA yang tidak memiliki kolom database yang jelas (diabaikan dari query, hanya mengandalkan filter)
        default:
            break;
    }
}


// === BANGUN FINAL QUERY SQL ===

$sql_select = "SELECT id_laptop, nama_produk, gambar, link_resmi, harga, prosessor, ram, penyimpanan, vga";
$sql_from = " FROM laptop";
$sql_where = !empty($where_clauses) ? " WHERE " . implode(' AND ', $where_clauses) : "";

$sql_order_by = "";
if (!empty($score_ranking)) {
    // Gabungkan semua bobot Ranking. Bobot yang lebih penting diletakkan di depan.
    $sql_order_by = " ORDER BY " . implode(', ', $score_ranking) . ", harga ASC";
} else {
    // Jika tidak ada bobot (misal user skip semua), gunakan order acak
    $sql_order_by = " ORDER BY RAND()";
}


$full_query = $sql_select . $sql_from . $sql_where . $sql_order_by . " LIMIT 4";

error_log("Final Query: " . $full_query);

// === EKSEKUSI QUERY ===
$result = mysqli_query($conn, $full_query);

$recommendations = [];
if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $recommendations[] = $row;
    }
} else {
    // Jika ada error SQL, kirim pesan error yang lebih jelas ke frontend
    http_response_code(500);
    echo json_encode(['error' => 'Gagal menjalankan query SQL.', 'sql_error' => mysqli_error($conn), 'query' => $full_query]);
    mysqli_close($conn);
    exit;
}

// Tutup koneksi
mysqli_close($conn);

// 4. KEMBALIKAN HASIL DALAM FORMAT JSON
echo json_encode($recommendations);

?>