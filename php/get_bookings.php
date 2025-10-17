<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "dreamcars";

$carId = isset($_GET['carId']) ? (int)$_GET['carId'] : 0;

if ($carId <= 0) {
    echo json_encode([]);
    exit();
}

try {
    $conn = new mysqli($servername, $username, $password, $dbname);
    $conn->set_charset('utf8mb4');
    
    if ($conn->connect_error) {
        throw new Exception('Adatbázis kapcsolódási hiba');
    }
    
    // Lekérjük az összes foglalt dátumot erre az autóra
    $stmt = $conn->prepare("SELECT start_date FROM bookings WHERE car_id = ? AND status != 'cancelled'");
    $stmt->bind_param("i", $carId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $bookedDates = [];
    while ($row = $result->fetch_assoc()) {
        $bookedDates[] = $row['start_date'];
    }
    
    echo json_encode($bookedDates, JSON_UNESCAPED_UNICODE);
    
    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    echo json_encode([]);
}
?>