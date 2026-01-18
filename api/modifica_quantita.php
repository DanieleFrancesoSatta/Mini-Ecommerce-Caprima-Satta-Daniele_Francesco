<?php
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

if (!isset($data->id_utente) || !isset($data->id_prodotto) || !isset($data->nuova_quantita)) {
    http_response_code(400);
    echo json_encode(["error" => "Dati incompleti."]);
    exit();
}
$id_utente = $data->id_utente;
$id_prodotto = $data->id_prodotto;
$nuova_quantita = $data->nuova_quantita;

if ($nuova_quantita < 1) {
    $query = "DELETE FROM carrello WHERE id_utente = :id_utente AND id_prodotto = :id_prodotto";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id_utente', $id_utente);
    $stmt->bindParam(':id_prodotto', $id_prodotto);
} else {
    $query = "UPDATE carrello SET quantita = :quantita WHERE id_utente = :id_utente AND id_prodotto = :id_prodotto";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':quantita', $nuova_quantita);
    $stmt->bindParam(':id_utente', $id_utente);
    $stmt->bindParam(':id_prodotto', $id_prodotto);
    }

try {
    
    if ($stmt->execute()) {
        echo json_encode(["success" => "Quantità aggiornata con successo."]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Errore durante l'aggiornamento della quantità."]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Errore: " . $e->getMessage()]);
}
?>