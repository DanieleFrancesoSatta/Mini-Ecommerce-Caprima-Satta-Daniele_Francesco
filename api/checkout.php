<?php
// api/checkout.php

// Silenzia errori HTML per non rompere il JSON
error_reporting(E_ALL);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once __DIR__ . '/../config/connect_database.php';

try {
    $database = new Database();
    $db = $database->connect();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Errore DB: " . $e->getMessage()]);
    exit();
}


$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->id_utente)) {
    http_response_code(400);
    echo json_encode(["error" => "Errore nel parsing dei dati o id_utente mancante."]);
    exit();
}

$id_utente = $data->id_utente;

$query = "DELETE FROM carrello WHERE id_utente = :id_utente";
$stmt = $db->prepare($query);
$stmt->bindParam(':id_utente', $id_utente);

try {
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(["success" => "Ordine Effettuato"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Errore durante l'ordine."]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Errore del server: " . $e->getMessage()]);
}
?>