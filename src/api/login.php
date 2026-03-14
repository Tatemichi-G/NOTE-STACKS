<?php

require_once __DIR__ . "/bootstrap.php";

$data = getJsonInput();

$email = trim($data["email"] ?? "");
$password = $data["password"] ?? "";

if ($email === "" || $password === "") {
    http_response_code(422);
    echo json_encode([
        "ok" => false,
        "message" => "email　と　password　は必須です"
    ],JSON_UNESCAPED_UNICODE);
    exit;
}

$statement = $pdo->prepare("SELECT id,email,password_hash
        FROM users
        WHERE email = ?
");

$statement->execute([$email]);
$user = $statement->fetch();

if(!$user) {
    http_response_code(401);
    echo json_encode([
        "ok" => false,
        "message" => "email　または　password　が違います"  
    ],JSON_UNESCAPED_UNICODE);
    exit;
}

if (!password_verify($password, $user["password_hash"])) {
    http_response_code(401);
    echo json_encode([
        "ok" => false,
        "message" => "email　または　password　が違います"
    ],JSON_UNESCAPED_UNICODE);
    exit;
} 

$_SESSION["user_id"] = $user["id"];
$_SESSION["email"] = $user["email"];

echo json_encode([
    "ok" => true,
    "message" => "ログイン認証完了",
    "user" => [
        "id" => $user["id"],
        "email" => $user["email"]
    ]
], JSON_UNESCAPED_UNICODE);
