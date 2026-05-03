<?php
require_once 'config.php'; include "db.php";
$d = json_decode(file_get_contents("php://input"), true);
$username = $d['username'] ?? ''; $email = $d['email'] ?? ''; $password = password_hash($d['password'] ?? '', PASSWORD_DEFAULT);
$stmt = $conn->prepare("SELECT id FROM users WHERE email=? OR username=?");
$stmt->bind_param("ss", $email, $username); $stmt->execute();
if ($stmt->get_result()->num_rows > 0) { http_response_code(409); echo json_encode(["success"=>false,"error"=>"Nom d'utilisateur ou email déjà utilisé"]); exit; }
$stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?,?,?)");
$stmt->bind_param("sss", $username, $email, $password);
if ($stmt->execute()) echo json_encode(["success"=>true]);
else { http_response_code(500); echo json_encode(["success"=>false,"error"=>"Erreur lors de l'inscription"]); }
