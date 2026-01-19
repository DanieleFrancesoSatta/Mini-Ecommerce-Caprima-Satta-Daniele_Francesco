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

if (!isset($data->id_prodotto)) {
    http_response_code(400);
    echo json_encode(["error" => "Dati mancanti: id_prodotto"]);
    exit();
}
session_save_path('/tmp');
session_start();
$id_utente = $_SESSION['id_utente'];

$prodotto_id = $data->id_prodotto;

$quantita = isset($data->quantita) ? $data->quantita : 1;

try {
    
    $query = "SELECT * FROM carrello WHERE id_prodotto = :pid AND id_utente = :uid";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":pid", $prodotto_id);
    $stmt->bindParam(":uid", $id_utente);
    $stmt->execute();
    $item = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($item) {
        $query = "UPDATE carrello SET quantita = quantita + :qty WHERE id_prodotto = :pid AND id_utente = :uid";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":pid", $prodotto_id);
        $stmt->bindParam(":uid", $id_utente);
        $stmt->bindParam(":qty", $quantita);
        $stmt->execute();
        echo json_encode(["message" => "Quantità aggiornata."]);
    } else {

        $query = "INSERT INTO carrello (id_prodotto, id_utente, quantita) VALUES (:pid, :uid, :qty)";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":pid", $prodotto_id);
        $stmt->bindParam(":uid", $id_utente);
        $stmt->bindParam(":qty", $quantita);
        $stmt->execute();
        echo json_encode(["success" => "Prodotto aggiunto."]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Errore SQL: " . $e->getMessage()]);
}
?>