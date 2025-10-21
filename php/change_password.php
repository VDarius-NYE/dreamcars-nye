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

$currentPassword = isset($_POST['current_password']) ? $_POST['current_password'] : '';
$newPassword = isset($_POST['new_password']) ? $_POST['new_password'] : '';

if (empty($currentPassword) || empty($newPassword)) {
    echo json_encode(['success' => false, 'message' => 'Minden mező kitöltése kötelező']);
    exit();
}

if (strlen($newPassword) < 6) {
    echo json_encode(['success' => false, 'message' => 'Az új jelszó legalább 6 karakter hosszú kell legyen']);
    exit();
}

try {
    $conn = new mysqli($servername, $username, $password, $dbname);
    $conn->set_charset('utf8mb4');
    
    if ($conn->connect_error) {
        throw new Exception('Adatbázis kapcsolódási hiba');
    }
    
    $userId = $_SESSION['user_id'];
    
    // Jelenlegi jelszó ellenőrzése
    $stmt = $conn->prepare("SELECT password FROM users WHERE id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();
    
    if (!password_verify($currentPassword, $user['password'])) {
        echo json_encode(['success' => false, 'message' => 'Hibás jelenlegi jelszó']);
        exit();
    }
    
    // Új jelszó hash-elése és mentése
    $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);
    
    $updateStmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
    $updateStmt->bind_param("si", $hashedPassword, $userId);
    
    if ($updateStmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Jelszó sikeresen módosítva']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Hiba történt a módosítás során']);
    }
    
    $updateStmt->close();
    $conn->close();
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>