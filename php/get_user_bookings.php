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

// Magyar hónapok
function formatHungarianDate($dateString) {
    $months = [
        1 => 'Januar', 2 => 'Februar', 3 => 'Marcius', 4 => 'Aprilis',
        5 => 'Majus', 6 => 'Junius', 7 => 'Julius', 8 => 'Augusztus',
        9 => 'Szeptember', 10 => 'Oktober', 11 => 'November', 12 => 'December'
    ];
    
    $timestamp = strtotime($dateString);
    $year = date('Y', $timestamp);
    $month = $months[(int)date('m', $timestamp)];
    $day = date('j', $timestamp);
    
    return $year . '. ' . $month . ' ' . $day . '.';
}

try {
    $conn = new mysqli($servername, $username, $password, $dbname);
    $conn->set_charset('utf8mb4');
    
    if ($conn->connect_error) {
        throw new Exception('Adatbázis kapcsolódási hiba');
    }
    
    $userId = $_SESSION['user_id'];
    $today = date('Y-m-d');
    
    // Jövőbeli foglalások
    $futureStmt = $conn->prepare("
        SELECT b.*, c.nev as car_name, c.img
        FROM bookings b
        JOIN cars c ON b.car_id = c.id
        WHERE b.user_id = ? AND b.start_date >= ? AND b.status = 'confirmed'
        ORDER BY b.start_date ASC
    ");
    $futureStmt->bind_param("is", $userId, $today);
    $futureStmt->execute();
    $futureResult = $futureStmt->get_result();
    
    $futureBookings = [];
    while ($row = $futureResult->fetch_assoc()) {
        $futureBookings[] = [
            'id' => $row['id'],
            'car_name' => $row['car_name'],
            'start_date' => $row['start_date'],
            'formatted_date' => formatHungarianDate($row['start_date']),
            'total_price' => $row['total_price'],
            'formatted_price' => number_format($row['total_price'], 0, '.', ' ') . ' Ft',
            'created_at' => date('Y.m.d.', strtotime($row['created_at']))
        ];
    }
    $futureStmt->close();
    
    // Múltbeli foglalások
    $pastStmt = $conn->prepare("
        SELECT b.*, c.nev as car_name, c.img
        FROM bookings b
        JOIN cars c ON b.car_id = c.id
        WHERE b.user_id = ? AND b.start_date < ?
        ORDER BY b.start_date DESC
        LIMIT 20
    ");
    $pastStmt->bind_param("is", $userId, $today);
    $pastStmt->execute();
    $pastResult = $pastStmt->get_result();
    
    $pastBookings = [];
    while ($row = $pastResult->fetch_assoc()) {
        $pastBookings[] = [
            'id' => $row['id'],
            'car_name' => $row['car_name'],
            'start_date' => $row['start_date'],
            'formatted_date' => formatHungarianDate($row['start_date']),
            'total_price' => $row['total_price'],
            'formatted_price' => number_format($row['total_price'], 0, '.', ' ') . ' Ft',
            'created_at' => date('Y.m.d.', strtotime($row['created_at']))
        ];
    }
    $pastStmt->close();
    
    echo json_encode([
        'success' => true,
        'future' => $futureBookings,
        'past' => $pastBookings
    ], JSON_UNESCAPED_UNICODE);
    
    $conn->close();
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>