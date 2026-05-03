<?php
require_once 'config.php'; session_start(); include "db.php";
if (!isset($_SESSION['user_id'])) { http_response_code(401); echo json_encode(["success"=>false,"error"=>"Non authentifié"]); exit; }
$d = json_decode(file_get_contents("php://input"), true);
$title=$d['title']??''; $desc=$d['description']??''; $location=$d['location']??'';
$date=$d['event_date']??''; $link=$d['registration_link']??''; $uid=$_SESSION['user_id'];
$stmt=$conn->prepare("INSERT INTO events (title,description,location,event_date,registration_link,user_id) VALUES (?,?,?,?,?,?)");
$stmt->bind_param("sssssi",$title,$desc,$location,$date,$link,$uid);
if (!$stmt->execute()) { http_response_code(500); echo json_encode(["success"=>false,"error"=>"Erreur création"]); exit; }
$event_id = $conn->insert_id;
foreach (($d['photos'] ?? []) as $photo) {
    if (str_starts_with($photo, 'data:image')) {
        $parts = explode(',', $photo, 2);
        $ext = str_contains($parts[0],'png') ? 'png' : (str_contains($parts[0],'gif') ? 'gif' : (str_contains($parts[0],'webp') ? 'webp' : 'jpg'));
        $filename = uniqid('img_', true) . '.' . $ext;
        file_put_contents(__DIR__ . '/uploades/' . $filename, base64_decode($parts[1]));
        $is = $conn->prepare("INSERT INTO event_images (event_id,image) VALUES (?,?)");
        $is->bind_param("is", $event_id, $filename); $is->execute();
    } elseif (str_starts_with($photo, 'http')) {
        $is = $conn->prepare("INSERT INTO event_images (event_id,image) VALUES (?,?)");
        $is->bind_param("is", $event_id, $photo); $is->execute();
    }
}
echo json_encode(["success"=>true,"event_id"=>$event_id]);
