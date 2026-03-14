<?php

require_once __DIR__ . "/bootstrap.php";

if (!isset($_SESSION["user_id"])) {
    echo json_encode([
        "ok" => true,
        "user" => null
    ],JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode([
    "ok" => true,
    "user" => [
        "id" => $_SESSION["user_id"],
        "email" => $_SESSION["email"]
    ]
], JSON_UNESCAPED_UNICODE);