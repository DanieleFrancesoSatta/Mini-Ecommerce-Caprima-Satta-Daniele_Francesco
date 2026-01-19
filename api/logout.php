<?php
    // Disabilita la cache per evitare che l'utente torni indietro alle pagine protette
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Pragma: no-cache");

    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    session_unset();
    session_destroy();

    header('Location: /Login/login.html?success=' . urlencode('Logout effettuato con successo'));
    exit();
?>