<?php
require_once 'session_handler.php';

header('Content-Type: application/json; charset=utf-8');

// Bejelentkezés ellenőrzése
if (!isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'Bejelentkezés szükséges']);
    exit();
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "dreamcars";

$carId = isset($_POST['carId']) ? (int)$_POST['carId'] : 0;
$date = isset($_POST['date']) ? trim($_POST['date']) : '';
$price = isset($_POST['price']) ? (int)$_POST['price'] : 0;

if ($carId <= 0 || empty($date) || $price <= 0) {
    echo json_encode(['success' => false, 'message' => 'Hiányzó vagy érvénytelen adatok']);
    exit();
}

try {
    $conn = new mysqli($servername, $username, $password, $dbname);
    $conn->set_charset('utf8mb4');
    
    if ($conn->connect_error) {
        throw new Exception('Adatbázis kapcsolódási hiba');
    }
    
    $userId = $_SESSION['user_id'];
    
    // Ellenőrizzük, hogy a dátum még elérhető-e
    $checkStmt = $conn->prepare("SELECT id FROM bookings WHERE car_id = ? AND start_date = ? AND status != 'cancelled'");
    $checkStmt->bind_param("is", $carId, $date);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();
    
    if ($checkResult->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Ez a dátum már foglalt']);
        exit();
    }
    $checkStmt->close();
    
    // Foglalás mentése
    $stmt = $conn->prepare("INSERT INTO bookings (user_id, car_id, start_date, end_date, total_price, status) VALUES (?, ?, ?, ?, ?, 'confirmed')");
    $stmt->bind_param("iissi", $userId, $carId, $date, $date, $price);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Sikeres foglalás']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Hiba a foglalás során: ' . $stmt->error]);
    }
    
    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>