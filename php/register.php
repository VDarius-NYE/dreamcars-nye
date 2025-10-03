<?php
$servername = "localhost";
$username = "root"; // XAMPP default
$password = "";     // alapból üres
$dbname = "dreamcars";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Adatbazis hiba: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $fullname = $_POST["fullname"];
    $email = $_POST["email"];
    $password = password_hash($_POST["password"], PASSWORD_BCRYPT);

    $stmt = $conn->prepare("INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $fullname, $email, $password);

    if ($stmt->execute()) {
        echo "<script>alert('Sikeres regisztracio!'); window.location.href='login.html';</script>";
    } else {
        echo "<script>alert('Hiba: Email mar letezik vagy adatbazis hiba!'); window.location.href='register.html';</script>";
    }

    $stmt->close();
}

$conn->close();
?>
