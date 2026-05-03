<?php
require_once 'config.php'; session_start(); include "db.php";
if (!isset($_SESSION['user_id'])) { http_response_code(401); echo json_encode(["success"=>false,"error"=>"Non authentifié"]); exit; }
$d = json_decode(file_get_contents("php://input"), true);
$title=$d['title']??''; $desc=$d['description']??''; $location=$d['location']??'';
$date=$d['event_date']??''; $link=$d['registration_link']??''; $uid=$_SESSION['user_id'];
$stmt=$conn->prepare("INSERT INTO events (title,description,location,event_date,registration_link,user_id) VALUES (?,?,?,?,?,?)");
$stmt->bind_param("sssssi",$title,$desc,$location,$date,$link,$uid);
if ($stmt->execute()) echo json_encode(["success"=>true,"event_id"=>$conn->insert_id]);
else { http_response_code(500); echo json_encode(["success"=>false,"error"=>"Erreur création"]); }
