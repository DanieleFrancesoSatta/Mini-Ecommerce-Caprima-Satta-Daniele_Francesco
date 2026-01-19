<?php
session_save_path('/tmp');
session_start();

header("Content-Type: application/json; charset=UTF-8");

if (isset($_SESSION['id_utente'])) {
    http_response_code(200);
    echo json_encode([
        "logged_in" => true,
        "id" => $_SESSION['id_utente'],
        "utente" => $_SESSION['nome_utente']
    ]);
} else {
    http_response_code(400);
    echo json_encode([
        "logged_in" => false,
        "error" => "Nessuna sessione attiva."
    ]);
}
?>