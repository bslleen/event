<?php
require_once 'config.php'; session_start(); include "db.php";
$status  = $_GET['status']  ?? null;
$user_id = $_GET['user_id'] ?? null;
$sql = "SELECT e.*, u.username, GROUP_CONCAT(ei.image) as images
        FROM events e
        LEFT JOIN users u ON e.user_id = u.id
        LEFT JOIN event_images ei ON e.id = ei.event_id";
$conds=[]; $params=[]; $types="";
if ($status)  { $conds[]="e.status=?";  $params[]=$status;       $types.="s"; }
if ($user_id) { $conds[]="e.user_id=?"; $params[]=(int)$user_id; $types.="i"; }
if ($conds) $sql .= " WHERE ".implode(" AND ",$conds);
$sql .= " GROUP BY e.id ORDER BY e.created_at DESC";
$stmt=$conn->prepare($sql);
if ($params) $stmt->bind_param($types,...$params);
$stmt->execute(); $result=$stmt->get_result();
$events=[];
while($row=$result->fetch_assoc()){ $row['images']=$row['images']?explode(',',$row['images']):[]; $events[]=$row; }
echo json_encode(["success"=>true,"events"=>$events]);
