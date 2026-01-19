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
$utente = htmlspecialchars(strip_tags($utente));

if (!$utente || !$password) {
    http_response_code(400); 
    echo json_encode(["error" => "Tutti i campi sono obbligatori."]);
    exit();
}

$query = "INSERT INTO utenti (utente, password) VALUES (:utente, :password)";
$stmt = $db->prepare($query);



$password = password_hash($password, PASSWORD_DEFAULT);
$stmt->bindParam(":utente", $utente);
$stmt->bindParam(":password", $password);

try {

    if($stmt->execute()) {
        $user = [
            "utente" => $utente,
            "id" => $db->lastInsertId()
        ];
        http_response_code(200);
        session_save_path('/tmp');
        session_start();
        $_SESSION['id_utente'] = $user['id'];
        $_SESSION['nome_utente'] = $user['utente'];
        echo json_encode(["message" => "Registrazione avvenuta con successo.", "user" => $user
    ]);
    exit();
    }
    else {
        http_response_code(500);
        echo json_encode(["error" => "Errore durante la registrazione. Riprova più tardi."]);
        exit();
    }

} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(["error" => "Utente già esistente. Scegli un altro nome utente."]);
    exit();
}
?>