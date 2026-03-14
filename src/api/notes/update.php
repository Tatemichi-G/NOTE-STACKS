<?php

require_once __DIR__ . "/../bootstrap.php";

requireLogin();

$data = getJsonInput();

$id = $data["id"] ?? null;
$title = trim($data["title"] ?? "");
$content = trim($data["content"] ?? "");

if(!$id) {
    http_response_code(422);
    echo json_encode([
        "ok" => false,
        "message" => "idが必要です"
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($title === "") {
    http_response_code(422);
    echo json_encode([
        "ok" => false,
        "message" => "タイトルを入力してください"
        ], JSON_UNESCAPED_UNICODE);
        exit;
}

$statement = $pdo->prepare("
    UPDATE notes 
    SET title = ?, content = ?
    WHERE id = ?
    AND user_id = ?");

$statement->execute([
    $title,
    $content,
    $id,
    $_SESSION["user_id"]
]);

$statement = $pdo->prepare("
    SELECT id, user_id, title, content, created_at, updated_at
    FROM notes
    WHERE id = ?
    AND user_id = ?");

$statement->execute([
       $id,
       $_SESSION["user_id"]
]);

$updatedNote = $statement->fetch();

echo json_encode([
    "ok" => true,
    "message" => "ノートを更新しました",
    "note" => $updatedNote
], JSON_UNESCAPED_UNICODE);
