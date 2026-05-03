<?php
require_once 'config.php'; session_start(); include "db.php";
if (!isset($_SESSION['user_id'])||$_SESSION['role']!=='admin') { http_response_code(403); echo json_encode(["success"=>false,"error"=>"Admin requis"]); exit; }
$result=$conn->query("SELECT id,username,email,role,created_at FROM users ORDER BY created_at DESC");
$users=[];
while($row=$result->fetch_assoc()) $users[]=$row;
echo json_encode(["success"=>true,"users"=>$users]);
