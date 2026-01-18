<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once __DIR__ . '/../config/connect_database.php';


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

$query = "SELECT DISTINCT categoria FROM prodotti GROUP BY categoria";

$stmt = $db->prepare($query);
$stmt->execute();

$categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($categories);
?>