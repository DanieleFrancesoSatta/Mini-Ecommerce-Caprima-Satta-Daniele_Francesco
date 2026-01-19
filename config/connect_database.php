<?php

class Database {
    private $conn;

    public function connect() {
        $this->conn = null;


        $host = getenv('DB_HOST');
        $port = getenv('DB_PORT');
        $db   = getenv('DB_NAME');
        $user = getenv('DB_USER');
        $pass = getenv('DB_PASS');
    

        $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4";
        
        
        
        $ssl_ca = __DIR__ . '/../ca.pem';

        try {
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::MYSQL_ATTR_SSL_CA       => $ssl_ca,
                PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => true 
            ];

            
            $this->conn = new PDO($dsn, $user, $pass, $options);
            
        } catch(PDOException $e) {
            error_log("Errore: " . $e->getMessage());
            throw new Exception("Connessione fallita. Verifica le credenziali e il certificato SSL.");
        }

        return $this->conn;
    }
}