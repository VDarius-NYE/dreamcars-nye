<?php
require_once 'session_handler.php';

// Kijelentkezés
session_unset();
session_destroy();

echo "<script>
    alert('Sikeres kijelentkezés!');
    window.location.href='../html/index.html';
</script>";
?>