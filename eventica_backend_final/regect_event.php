<?php
require_once 'config.php'; session_start(); include "db.php";
if (!isset($_SESSION['user_id'])||$_SESSION['role']!=='admin') { http_response_code(403); echo json_encode(["success"=>false,"error"=>"Admin requis"]); exit; }
$d=json_decode(file_get_contents("php://input"),true); $id=intval($d['id']??0);
$stmt=$conn->prepare("UPDATE events SET status='rejected' WHERE id=?"); $stmt->bind_param("i",$id); $stmt->execute();
echo json_encode(["success"=>true]);
