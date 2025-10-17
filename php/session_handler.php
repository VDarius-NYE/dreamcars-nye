<?php
// session_handler.php - Session kezelő minden oldalhoz

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Bejelentkezett felhasználó ellenőrzése
function isLoggedIn() {
    return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
}

// Felhasználó adatainak lekérése
function getUserData() {
    if (isLoggedIn()) {
        return [
            'id' => $_SESSION['user_id'],
            'fullname' => $_SESSION['fullname'] ?? 'Felhasználó',
            'email' => $_SESSION['email'] ?? ''
        ];
    }
    return null;
}

// Kijelentkezés
function logout() {
    session_unset();
    session_destroy();
    header('Location: ../html/index.html');
    exit();
}

// Védett oldal - átirányítás ha nincs bejelentkezve
function requireLogin() {
    if (!isLoggedIn()) {
        header('Location: ../html/login.html?redirect=' . urlencode($_SERVER['REQUEST_URI']));
        exit();
    }
}

// Már bejelentkezett felhasználó átirányítása
function redirectIfLoggedIn() {
    if (isLoggedIn()) {
        header('Location: ../html/index.html');
        exit();
    }
}
?>