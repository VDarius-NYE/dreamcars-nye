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

try {
    $conn = new mysqli($servername, $username, $password, $dbname);
    $conn->set_charset('utf8mb4');
    
    if ($conn->connect_error) {
        throw new Exception('Adatbázis kapcsolódási hiba');
    }
    
    $userId = $_SESSION['user_id'];
    
    $stmt = $conn->prepare("SELECT fullname, email, phone FROM users WHERE id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    
    echo json_encode([
        'success' => true,
        'user' => $user
    ], JSON_UNESCAPED_UNICODE);
    
    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>