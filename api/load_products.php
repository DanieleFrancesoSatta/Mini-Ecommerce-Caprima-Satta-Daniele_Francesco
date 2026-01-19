<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);

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

$filter = isset($_GET['filter']) ? $_GET['filter'] : null;

if ($filter== "reset" || $filter== null) {
    $query = "SELECT * FROM prodotti";
    $stmt = $db->prepare($query);}
elseif( str_starts_with($filter, "alphabetical")) {
    $order = explode("=", $filter)[1];
    $tipo = ($order == "A-Z")? "ASC" : "DESC";
    $query = "SELECT * FROM prodotti ORDER BY nome $tipo";
    $stmt = $db->prepare($query);
}
elseif (str_starts_with($filter, "text")) {
    $filter = explode("=", $filter)[1];
    $query = "SELECT * FROM prodotti WHERE nome LIKE :search";
    $stmt = $db->prepare($query);
    $searchTerm = "%" . htmlspecialchars(strip_tags($filter)) . "%";
    $stmt->bindParam(":search", $searchTerm);
} elseif (str_starts_with($filter, "category")) {
    $filter = explode("=", $filter)[1];
    $query = "SELECT * FROM prodotti WHERE categoria = :category";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":category", $filter);
} elseif (str_starts_with($filter, "prezzo")) {
    $filter = explode("=", $filter)[1];
    $query = "SELECT * FROM prodotti ORDER BY prezzo $filter";
    $stmt = $db->prepare($query);
} else {
    $query = "SELECT * FROM prodotti ORDER BY nome";
    $stmt = $db->prepare($query);
}



try {
    $stmt->execute();
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($products);
    exit();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Errore nell'esecuzione della query: " . $e->getMessage()]);
    exit();
}
exit();

?>

