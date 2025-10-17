<?php
// session_handler.php - Session kezelő minden oldalhoz

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function isLoggedIn() {
    return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
}

function getUserData() {
    if (isLoggedIn()) {
        return [
            'id' => $_SESSION['user_id'],
            'fullname' => $_SESSION['fullname'] ?? 'Felhasználó',
            'email' => $_SESSION['email'] ?? '',
            'isAdmin' => $_SESSION['isAdmin'] ?? 0
        ];
    }
    return null;
}

function isAdmin() {
    return isLoggedIn() && isset($_SESSION['isAdmin']) && $_SESSION['isAdmin'] == 1;
}

function requireAdmin() {
    if (!isAdmin()) {
        header('Location: ../html/index.html');
        exit();
    }
}

function logout() {
    session_unset();
    session_destroy();
    header('Location: ../html/index.html');
    exit();
}

function requireLogin() {
    if (!isLoggedIn()) {
        header('Location: ../html/login.html?redirect=' . urlencode($_SERVER['REQUEST_URI']));
        exit();
    }
}

function redirectIfLoggedIn() {
    if (isLoggedIn()) {
        header('Location: ../html/index.html');
        exit();
    }
}
?>