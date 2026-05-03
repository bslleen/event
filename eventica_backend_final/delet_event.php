<?php
require_once 'config.php'; session_start(); include "db.php";
if (!isset($_SESSION['user_id'])) { http_response_code(401); echo json_encode(["success"=>false,"error"=>"Non authentifié"]); exit; }
$d=json_decode(file_get_contents("php://input"),true); $id=intval($d['id']??0);
$stmt=$conn->prepare("SELECT user_id FROM events WHERE id=?"); $stmt->bind_param("i",$id); $stmt->execute();
$ev=$stmt->get_result()->fetch_assoc();
if (!$ev) { http_response_code(404); echo json_encode(["success"=>false,"error"=>"Introuvable"]); exit; }
if ($_SESSION['role']==='admin'||$_SESSION['user_id']==$ev['user_id']) {
    $stmt=$conn->prepare("DELETE FROM events WHERE id=?"); $stmt->bind_param("i",$id); $stmt->execute();
    echo json_encode(["success"=>true]);
} else { http_response_code(403); echo json_encode(["success"=>false,"error"=>"Accès refusé"]); }
