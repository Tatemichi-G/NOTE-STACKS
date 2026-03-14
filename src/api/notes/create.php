<?php

require_once __DIR__ . "/../bootstrap.php";

requireLogin();

$data = getJsonInput();

$title = trim($data["title"] ?? "");
$content = trim($data["content"] ?? "");

if ($title === ""){
    http_response_code(422);
    echo json_encode([
        "ok" => false,
        "message" => "タイトルを入力してください"
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$statement = $pdo->prepare("
    INSERT INTO notes (user_id, title, content)
    VALUES (?, ?, ?)");

$statement->execute([
    $_SESSION["user_id"],
    $title,
    $content
]);

$newNoteId = $pdo->lastInsertId();

$statement = $pdo->prepare("
    SELECT id, user_id, title, content, created_at, updated_at
    FROM notes
    WHERE id = ? AND user_id = ?");

$statement->execute([$newNoteId, $_SESSION["user_id"]]);
$newNote = $statement->fetch();

echo json_encode([
    "ok" => true,
    "message" => "ノートを作成しました",
    "note" => $newNote
], JSON_UNESCAPED_UNICODE);

