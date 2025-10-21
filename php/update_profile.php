<?php
require_once 'session_handler.php';

header('Content-Type: application/json; charset=utf-8');

if (!isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'Bejelentkezés szükséges']);
    exit();
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "dreamcars";

$fullname = isset($_POST['fullname']) ? trim($_POST['fullname']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';

if (empty($fullname) || empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Név és email kötelező']);
    exit();
}

try {
    $conn = new mysqli($servername, $username, $password, $dbname);
    $conn->set_charset('utf8mb4');
    
    if ($conn->connect_error) {
        throw new Exception('Adatbázis kapcsolódási hiba');
    }
    
    $userId = $_SESSION['user_id'];
    
    // Email ellenőrzés (más felhasználónál ne legyen használva)
    $checkStmt = $conn->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
    $checkStmt->bind_param("si", $email, $userId);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();
    
    if ($checkResult->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Ez az email már használatban van']);
        exit();
    }
    $checkStmt->close();
    
    // Profil frissítése
    $stmt = $conn->prepare("UPDATE users SET fullname = ?, email = ?, phone = ? WHERE id = ?");
    $stmt->bind_param("sssi", $fullname, $email, $phone, $userId);
    
    if ($stmt->execute()) {
        // Session frissítése
        $_SESSION['fullname'] = $fullname;
        $_SESSION['email'] = $email;
        
        echo json_encode(['success' => true, 'message' => 'Profil sikeresen frissítve']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Hiba történt a frissítés során']);
    }
    
    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>