<?php

require_once __DIR__ . "/../bootstrap.php";

requireLogin();

$data = getJsonInput();

$id = $data["id"] ?? null;

if (!$id) {
    http_response_code(422);
    echo json_encode([
        "ok" => false,
        "message" => "idが必要です"
    ], JSON_UNESCAPED_UNICODE);
    exit;
}


$statement = $pdo->prepare("
    DELETE FROM notes
    WHERE id = ?
    AND user_id = ?");
$statement->execute([
    $id,
    $_SESSION["user_id"],
]);

echo json_encode([
    "ok" => true,
    "message" => "ノートを削除しました"
], JSON_UNESCAPED_UNICODE);