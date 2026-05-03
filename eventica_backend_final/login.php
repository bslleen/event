<?php
require_once 'config.php'; session_start(); include "db.php";
$d = json_decode(file_get_contents("php://input"), true);
$username = $d['username'] ?? '';
$password = $d['password'] ?? '';
$stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();
if ($user && password_verify($password, $user['password'])) {
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['role']    = $user['role'];
    echo json_encode(["success"=>true,"user"=>["id"=>$user['id'],"username"=>$user['username'],"email"=>$user['email'],"role"=>$user['role']]]);
} else { http_response_code(401); echo json_encode(["success"=>false,"error"=>"Identifiants incorrects"]); }
