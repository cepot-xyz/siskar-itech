<?php
// Pastikan file koneksi ke database di-include
include 'helper/conn.php';

// Fetch 12 random laptops from the database
// Mengambil kolom yang relevan: nama_produk, gambar, dan link_resmi
$sql = "SELECT nama_produk, gambar, link_resmi FROM laptop ORDER BY RAND() LIMIT 12";
$result = mysqli_query($conn, $sql);

$laptops = [];
if ($result && mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $laptops[] = $row;
    }
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=TASA+Orbiter:wght@400..800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <link rel="shortcut icon" href="assets desain/Itech pfp.png" type="image/x-icon">
    <title>ITech | Produk Laptop</title>
</head>

<body>

    <nav>
        <a class="nav-logo" href="index.html"><img src="assets desain/Logo ITech Putih.png"
                style="height: 5vh;margin-right:8vh;" alt="Logo ITech"></a>
        <div style="margin-right: 6vh;" class="divider">.</div>
        <div class="nav-item">
            <a class="nav-btn" href="kuis-laptop.html">Kuis Laptop</a>
            <a class="nav-btn" href="kuis-komputer.html">Kuis Komputer</a>
            <a class="nav-btn" href="produk.php">Produk</a>
        </div>
        </div>
    </nav>
    <section class="section-flex">
        <h1 style="font-size: 200%;display: flex;align-items: center;margin-top:10vh;color: white;">Laptop</h1>
    </section>

    <?php
    // Logika untuk menampilkan 4 produk per baris (section-flex)
    $counter = 0;
    // Mulai loop data laptop
    foreach ($laptops as $laptop):
        // Cek apakah counter adalah kelipatan 4, jika ya, mulai section baru (kecuali di awal)
        if ($counter % 4 == 0):
            if ($counter > 0):
                echo '</section>'; // Tutup section sebelumnya
            endif;
            // Buka section baru. Style 'gap: 5vh;' dipertahankan.
            echo '<section class="section-flex" style="gap: 5vh;">';
        endif;
        ?>

        <div style="background-image: url('img/laptop/<?php echo htmlspecialchars($laptop['gambar']); ?>');background-size:cover;"
            class="card">
            <div class="card-details">
                <p class="text-title"><?php echo htmlspecialchars($laptop['nama_produk']); ?></p>
            </div>
            <a href="<?php echo htmlspecialchars($laptop['link_resmi']); ?>" class="card-button">More info</a>
        </div>
        <?php
        $counter++;
    endforeach;

    // Tutup section terakhir
    if ($counter > 0):
        echo '</section>';
    endif;
    ?>

</body>

</html>
<?php
// Tutup koneksi database di akhir
mysqli_close($conn);
?>