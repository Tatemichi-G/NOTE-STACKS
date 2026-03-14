<?php

header("Content-Type: application/json; charset:UTF-8");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

session_start();

require_once __DIR__ . "/../config/db.php";

function getJsonInput()
{
    $raw = file_get_contents("php://input");
    return json_decode($raw, true) ?? [];
}

function requireLogin() {
    if (!isset($_SESSION["user_id"])) {
        http_response_code(401);
        echo json_encode([
            "ok" => false,
            "message" => "ログインが必要です"
        ],JSON_UNESCAPED_UNICODE);
        exit;
    }
}