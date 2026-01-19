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

if (!isset($data->id)) {
    http_response_code(400);
    echo json_encode(["error" => "Dato mancante:id_utente."]);
    exit();
}

$id_utente = $data->id;
try{
    //Effettuo un JOIN per trovare tutti i prodotti del carrello dell'utente
    $query="SELECT c.id_prodotto, p.nome, p.prezzo, c.quantita, (p.prezzo * c.quantita) AS totale_prodotto 
            FROM carrello c 
            JOIN prodotti p ON c.id_prodotto = p.id 
            WHERE c.id_utente = :uid";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":uid", $id_utente);
    $stmt->execute();
    $cart_items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $cart_total = array_sum(array_column($cart_items, 'totale_prodotto'));//Calcolo il totale del carrello
    
    $cart = [
        "items" => $cart_items,
        "total" => $cart_total
    ];

    http_response_code(200);
    echo json_encode($cart);
}catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Errore durante l'aggiunta al carrello: " . $e->getMessage()]);
    exit();
}


?>