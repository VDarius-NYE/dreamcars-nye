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
    $email = trim($_POST["email"]);
    $password = $_POST["password"];

    $stmt = $conn->prepare("SELECT id, fullname, email, password, isAdmin FROM users WHERE email=?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($id, $fullname, $userEmail, $hashedPassword, $isAdmin);
        $stmt->fetch();

        if (password_verify($password, $hashedPassword)) {
            $_SESSION["user_id"] = $id;
            $_SESSION["fullname"] = $fullname;
            $_SESSION["email"] = $userEmail;
            $_SESSION["isAdmin"] = $isAdmin;
            $_SESSION["login_time"] = time();

            $redirect = isset($_GET['redirect']) ? $_GET['redirect'] : '../html/index.html';
            
            $separator = strpos($redirect, '?') !== false ? '&' : '?';
            $redirectUrl = $redirect . $separator . 'login=success';
            
            echo "<script>
                window.location.href='$redirectUrl';
            </script>";
        } else {
            echo "<script>
                alert('Hibás jelszó!');
                window.location.href='../html/login.html';
            </script>";
        }
    } else {
        echo "<script>
            alert('Nincs ilyen felhasználó!');
            window.location.href='../html/login.html';
        </script>";
    }

    $stmt->close();
}

$conn->close();
?>