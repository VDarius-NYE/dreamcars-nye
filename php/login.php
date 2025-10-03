<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "dreamcars";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Adatbazis hiba: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST["email"];
    $password = $_POST["password"];

    $stmt = $conn->prepare("SELECT id, fullname, password FROM users WHERE email=?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($id, $fullname, $hashedPassword);
        $stmt->fetch();

        if (password_verify($password, $hashedPassword)) {
            session_start();
            $_SESSION["user_id"] = $id;
            $_SESSION["fullname"] = $fullname;
            echo "<script>alert('Sikeres bejelentkezes! Udv, $fullname'); window.location.href='../html/index.html';</script>";
        } else {
            echo "<script>alert('Hibas jelszo!'); window.location.href='login.html';</script>";
        }
    } else {
        echo "<script>alert('Nincs ilyen felhasznalo!'); window.location.href='login.html';</script>";
    }

    $stmt->close();
}

$conn->close();
?>
