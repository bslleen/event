<?php
$host = "localhost";
$user = "root";
$pass = "12345@Password";
$db   = "eventica_db";
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) { die(json_encode(["success"=>false,"error"=>$conn->connect_error])); }
