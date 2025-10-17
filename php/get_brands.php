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
    
    $sql = "SELECT DISTINCT marka FROM cars ORDER BY marka ASC";
    $result = $conn->query($sql);
    
    $brands = [];
    
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $brands[] = $row['marka'];
        }
    }
    
    echo json_encode($brands, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    
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