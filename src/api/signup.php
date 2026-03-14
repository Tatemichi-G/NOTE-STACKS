<?php

require_once __DIR__ . "/bootstrap.php";

$data = getJsonInput();

$email = trim($data["email"] ?? "");
$password = $data["password"] ?? "";

if($email === "" || $password === "") {
    http_response_code(422);
    echo json_encode([
        "ok" => false,
        "message" => "email　と　password　は必須です。"
    ], JSON_UNESCAPED_UNICODE);
    exit;
}


if(!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode([
        "ok" => false,
        "message" => "正しいemail形式で入力してください。"
    ],JSON_UNESCAPED_UNICODE);
    exit;
}

if(strlen($password) < 6) {
    http_response_code(422);
    echo json_encode([
        "ok" => false,
        "message" => "パスワードは6文字以上で設定してください。"
    ],JSON_UNESCAPED_UNICODE);
    exit;
}


$statement = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$statement->execute([$email]);
$exitingUser = $statement->fetch();

if($exitingUser) {
    http_response_code(409);
    echo json_encode([
        "ok" => false,
        "message" => "そのemailは既に登録されています"
    ],JSON_UNESCAPED_UNICODE);
    exit;
}

$passwordHash = password_hash($password, PASSWORD_DEFAULT);

$statement = $pdo->prepare("INSERT INTO users (email,password_hash) VALUES(?,?)");
$statement->execute([$email, $passwordHash]);

echo json_encode([
    "ok" => true,
    "message" => "新規登録が完了しました"
],JSON_UNESCAPED_UNICODE);