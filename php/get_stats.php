<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "dreamcars";

try {
    $conn = new mysqli($servername, $username, $password, $dbname);
    $conn->set_charset('utf8mb4');
    
    if ($conn->connect_error) {
        throw new Exception('Adatbázis kapcsolódási hiba: ' . $conn->connect_error);
    }
    
    $usersQuery = "SELECT COUNT(*) as total FROM users";
    $usersResult = $conn->query($usersQuery);
    $totalUsers = $usersResult->fetch_assoc()['total'];
    
    $bookingsQuery = "SELECT COUNT(*) as total FROM bookings";
    $bookingsResult = $conn->query($bookingsQuery);
    $totalBookings = $bookingsResult->fetch_assoc()['total'];
    
    $carsQuery = "SELECT COUNT(*) as total FROM cars";
    $carsResult = $conn->query($carsQuery);
    $totalCars = $carsResult->fetch_assoc()['total'];
    
    $stats = [
        'users' => (int)$totalUsers,
        'bookings' => (int)$totalBookings,
        'cars' => (int)$totalCars
    ];
    
    echo json_encode($stats, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
} finally {
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
    }
}
?>