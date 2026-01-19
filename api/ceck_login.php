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

$data = json_decode(file_get_contents("php://input"));

if (!$data) {
    http_response_code(400);
    echo json_encode(["error" => "Errore nel parsing dei dati JSON."]);
    exit();
}

$utente = isset($data->utente) ? $data->utente : null; 
$password = isset($data->password) ? $data->password : null;


if (!$utente || !$password) {
    http_response_code(400); 
    echo json_encode(["error" => "Tutti i campi sono obbligatori."]);
    exit();
}


$query = "SELECT * FROM utenti WHERE utente = :utente LIMIT 1";
$stmt = $db->prepare($query);


$utente = htmlspecialchars(strip_tags($utente));
$stmt->bindParam(":utente", $utente);

try {
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Verifica Password
    if ($user && password_verify($password, $user['password'])) {
        
        unset($user['password']);

        // Risposta SUCCESSO (200 OK)
        http_response_code(200);
        echo json_encode([
            "success" => "Login effettuato con successo",
            "user" => $user,
            "id_utente" => $user['id']
        ]);
        exit();

    } else {
        
        http_response_code(401);
        echo json_encode(["error" => "Nome utente o password errati."]);
        exit();
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Errore del server: " . $e->getMessage()]);
    exit();
}
?>