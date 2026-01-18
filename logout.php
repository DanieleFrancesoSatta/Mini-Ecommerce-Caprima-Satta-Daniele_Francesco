<?php
    // Intestazioni per disabilitare la cache
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0"); // HTTP 1.1
    header("Cache-Control: post-check=0, pre-check=0", false); // Per compatibilità
    header("Pragma: no-cache"); // HTTP 1.0
    header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date in the past

    // Check if the 'utente' and 'role' cookies are set
    if (isset($_COOKIE['utente'])) {

        setcookie('utente', "", time() - 3600, "/");
    }

    // Redirect to the login page with success message
    header('Location: ./Index/index.php?success='. urlencode('Logout effettuato con successo'));
    exit();
?>
