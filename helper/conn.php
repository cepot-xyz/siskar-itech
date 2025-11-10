<?php
// === KONFIGURASI DATABASE ===
// Default Laragon:
$db_server = "localhost"; // Atau "127.0.0.1"
$db_user = "root";        // Username default MySQL di Laragon
$db_pass = "";            // Password default MySQL di Laragon (kosong)
$db_name = "itech_db"; // Ganti dengan nama database proyek Anda

// === MEMBUAT KONEKSI ===
$conn = mysqli_connect($db_server, $db_user, $db_pass, $db_name);

// === CEK KONEKSI ===
if (!$conn) {
    die("Koneksi gagal: " . mysqli_connect_error());
}

// Opsional: Atur encoding agar mendukung karakter khusus
mysqli_set_charset($conn, "utf8");

// Catatan: Setelah koneksi berhasil, file ini tidak menampilkan output apa pun.
// $conn akan menjadi variabel yang bisa digunakan di file produk.php.
?>