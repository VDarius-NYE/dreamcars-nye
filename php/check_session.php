<?php
require_once 'session_handler.php';

header('Content-Type: application/json; charset=utf-8');

$response = [
    'loggedIn' => isLoggedIn(),
    'user' => getUserData()
];

echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>