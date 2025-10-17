<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "dreamcars";

$marka = isset($_GET['marka']) ? trim($_GET['marka']) : '';
$fuel = isset($_GET['fuel']) ? (int)$_GET['fuel'] : 0;
$year = isset($_GET['year']) ? (int)$_GET['year'] : 0;
$maxPrice = isset($_GET['maxPrice']) ? (int)$_GET['maxPrice'] : 0;

if (empty($marka)) {
    http_response_code(400);
    echo json_encode([
        'error' => true,
        'message' => 'Hiányzó márka paraméter.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $conn = new mysqli($servername, $username, $password, $dbname);
    $conn->set_charset('utf8mb4');
    
    if ($conn->connect_error) {
        throw new Exception('Adatbázis kapcsolódási hiba: ' . $conn->connect_error);
    }
    
    $sql = "SELECT id, marka, nev, img, `desc`, evjarat, uzemanyag, ar 
            FROM cars 
            WHERE marka = ?";
    
    $params = [$marka];
    $types = "s";
    
    if ($fuel > 0) {
        $sql .= " AND uzemanyag = ?";
        $params[] = $fuel;
        $types .= "i";
    }
    
    if ($year > 0) {
        $sql .= " AND evjarat = ?";
        $params[] = $year;
        $types .= "i";
    }
    
    if ($maxPrice > 0) {
        $sql .= " AND ar <= ?";
        $params[] = $maxPrice;
        $types .= "i";
    }
    
    $sql .= " ORDER BY nev ASC";
    
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        throw new Exception('SQL előkészítési hiba: ' . $conn->error);
    }
    
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $cars = [];
    
    while ($row = $result->fetch_assoc()) {
        $fuelText = '';
        switch ((int)$row['uzemanyag']) {
            case 1: $fuelText = 'Benzin'; break;
            case 2: $fuelText = 'Dízel'; break;
            case 3: $fuelText = 'Elektromos'; break;
            default: $fuelText = 'Ismeretlen';
        }
        
        $cars[] = [
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
    }
    
    echo json_encode($cars, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    
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