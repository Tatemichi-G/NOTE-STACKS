<?php

require_once __DIR__ . "/../bootstrap.php";

requireLogin();

$statement = $pdo->prepare(
    "SELECT id, user_id,title,content,created_at,updated_at
    FROM notes
    WHERE user_id = ?
    ORDER BY updated_at DESC"
);

$statement->execute([$_SESSION["user_id"]]);
$notes = $statement->fetchAll();

echo json_encode([
    "ok" => true,
    "notes" => $notes
], JSON_UNESCAPED_UNICODE);