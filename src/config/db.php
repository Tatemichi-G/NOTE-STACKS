<?php

$host = getenv("MARIADB_HOST") ?: "db";
$dbname = getenv("MARIADB_DATABASE") ?: "notes_app";
$user = getenv("MARIADB_USER") ?: "appuser";
$password = getenv("MARIADB_PASSWORD") ?: "apppass";

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $user,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    header("Content-Type: text/plain; charset=UTF-8");
    echo "DB接続失敗: " . $e->getMessage();
    exit;
}