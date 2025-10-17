<?php
require_once 'session_handler.php';

requireAdmin();

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "dreamcars";

$conn = new mysqli($servername, $username, $password, $dbname);
$conn->set_charset('utf8mb4');

if ($conn->connect_error) {
    die("Adatbázis hiba: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $marka = trim($_POST["marka"]);
    $nev = trim($_POST["nev"]);
    $desc = trim($_POST["desc"]);
    $evjarat = (int)$_POST["evjarat"];
    $uzemanyag = (int)$_POST["uzemanyag"];
    $ar = (int)$_POST["ar"];

    if (empty($marka) || empty($nev) || empty($desc)) {
        echo "<script>alert('Minden mező kitöltése kötelező!'); window.history.back();</script>";
        exit();
    }

    if ($evjarat < 1900 || $evjarat > 2030) {
        echo "<script>alert('Érvénytelen évjárat!'); window.history.back();</script>";
        exit();
    }

    if ($ar < 0) {
        echo "<script>alert('Az ár nem lehet negatív!'); window.history.back();</script>";
        exit();
    }

    if (isset($_FILES['img']) && $_FILES['img']['error'] == 0) {
        $allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        $max_size = 5 * 1024 * 1024; // 5MB

        $file_type = $_FILES['img']['type'];
        $file_size = $_FILES['img']['size'];
        $file_tmp = $_FILES['img']['tmp_name'];
        $file_name = $_FILES['img']['name'];

        if (!in_array($file_type, $allowed_types)) {
            echo "<script>alert('Csak JPG, PNG és WEBP képek engedélyezettek!'); window.history.back();</script>";
            exit();
        }

        if ($file_size > $max_size) {
            echo "<script>alert('A kép mérete maximum 5MB lehet!'); window.history.back();</script>";
            exit();
        }

        $file_extension = pathinfo($file_name, PATHINFO_EXTENSION);
        $new_file_name = strtolower($marka) . '_' . strtolower(str_replace(' ', '_', $nev)) . '_' . time() . '.' . $file_extension;
        
        $upload_dir = '../assets/listImg/';
        $upload_path = $upload_dir . $new_file_name;

        if (!file_exists($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }

        if (move_uploaded_file($file_tmp, $upload_path)) {
            $stmt = $conn->prepare("INSERT INTO cars (marka, nev, img, `desc`, evjarat, uzemanyag, ar) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("ssssiis", $marka, $nev, $new_file_name, $desc, $evjarat, $uzemanyag, $ar);

            if ($stmt->execute()) {
                echo "<script>
                    alert('Autó sikeresen hozzáadva!');
                    window.location.href='../html/admin.html';
                </script>";
            } else {
                echo "<script>
                    alert('Hiba történt az adatbázis művelet során: " . $stmt->error . "');
                    window.history.back();
                </script>";
            }

            $stmt->close();
        } else {
            echo "<script>alert('Hiba történt a kép feltöltése során!'); window.history.back();</script>";
        }
    } else {
        echo "<script>alert('Kép feltöltése kötelező!'); window.history.back();</script>";
    }
}

$conn->close();
?>