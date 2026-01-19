<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once __DIR__ . '/../config/connect_database.php';

//Connettiamo al Database
try {
    $database = new Database();
    $db = $database->connect();
    
    if (!$db) {
        http_response_code(500);
        echo json_encode(["error" => "Connessione al database non riuscita: " . $database->getLastError()]);
        exit();
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Errore di connessione: " . $e->getMessage()]);
    exit();
}
//Prelevo l'id del prodotto dall'URL
$id_prodotto = isset($_GET['id']) ? $_GET['id'] : null;
if (!$id_prodotto) {
    http_response_code(400);
    echo json_encode(["error" => "ID prodotto mancante."]);
    exit();
}

$query = "SELECT * FROM prodotti WHERE id = :id_prodotto LIMIT 1";
$stmt = $db->prepare($query);
$id_prodotto = htmlspecialchars(strip_tags($id_prodotto));
$stmt->bindParam(":id_prodotto", $id_prodotto);
try {
    $stmt->execute();
    $product = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($product) {
        http_response_code(200);
        echo json_encode($product);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Prodotto non trovato."]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Errore durante il recupero del prodotto: " . $e->getMessage()]);
    exit();
}


?>