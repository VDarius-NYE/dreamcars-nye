<?php
require_once 'session_handler.php';

redirectIfLoggedIn();

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
    $fullname = trim($_POST["fullname"]);
    $email = trim($_POST["email"]);
    $password = $_POST["password"];

    if (strlen($fullname) < 3) {
        echo "<script>
            alert('A teljes névnek legalább 3 karakter hosszúnak kell lennie!');
            window.location.href='../html/register.html';
        </script>";
        exit();
    }

    if (strlen($password) < 6) {
        echo "<script>
            alert('A jelszónak legalább 6 karakter hosszúnak kell lennie!');
            window.location.href='../html/register.html';
        </script>";
        exit();
    }

    // Email ellenőrzés
    $checkEmail = $conn->prepare("SELECT id FROM users WHERE email=?");
    $checkEmail->bind_param("s", $email);
    $checkEmail->execute();
    $checkEmail->store_result();

    if ($checkEmail->num_rows > 0) {
        echo "<script>
            alert('Ez az email cím már regisztrálva van!');
            window.location.href='../html/register.html';
        </script>";
        $checkEmail->close();
        exit();
    }
    $checkEmail->close();

    // Jelszó hashelés
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $conn->prepare("INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $fullname, $email, $hashedPassword);

    if ($stmt->execute()) {
        echo "<script>
            alert('Sikeres regisztráció! Most már bejelentkezhetsz.');
            window.location.href='../html/login.html';
        </script>";
    } else {
        echo "<script>
            alert('Hiba történt a regisztráció során: " . $stmt->error . "');
            window.location.href='../html/register.html';
        </script>";
    }

    $stmt->close();
}

$conn->close();
?>