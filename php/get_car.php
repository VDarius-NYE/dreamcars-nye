<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "dreamcars";

$carId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($carId <= 0) {
    http_response_code(400);
    echo json_encode([
        'error' => true,
        'message' => 'Hiányzó vagy érvénytelen autó ID.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $conn = new mysqli($servername, $username, $password, $dbname);
    $conn->set_charset('utf8mb4');
    
    if ($conn->connect_error) {
        throw new Exception('Adatbázis kapcsolódási hiba: ' . $conn->connect_error);
    }
    
    $stmt = $conn->prepare("SELECT id, marka, nev, img, `desc`, evjarat, uzemanyag, ar FROM cars WHERE id = ?");
    $stmt->bind_param("i", $carId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode([
            'error' => true,
            'message' => 'Az autó nem található.'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    $row = $result->fetch_assoc();
    
    $fuelText = '';
    switch ((int)$row['uzemanyag']) {
        case 1: $fuelText = 'Benzin'; break;
        case 2: $fuelText = 'Dízel'; break;
        case 3: $fuelText = 'Elektromos'; break;
        default: $fuelText = 'Ismeretlen';
    }
    
    $car = [
        'id' => (int)$row['id'],
        'marka' => $row['marka'],
        'nev' => $row['nev'],
        'img' => "../assets/listImg/" . $row['img'],
        'desc' => $row['desc'],
        'evjarat' => (int)$row['evjarat'],
        'uzemanyag' => $fuelText,
        'uzemanyagKod' => (int)$row['uzemanyag'],
        'ar' => (int)$row['ar'],
        'arFormat' => number_format($row['ar'], 0, '.', ' ') . ' Ft/nap'
    ];
    
    echo json_encode($car, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    
    $stmt->close();
    
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