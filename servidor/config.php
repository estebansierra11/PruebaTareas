<?php
$host = 'localhost';
$db = 'todolist';
$user = 'root';
$pass = '';


$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);

}

function hashPassword($password) {
    return password_hash($password, PASSWORD_BCRYPT);
}

function verifyPassword($password, $hashedPassword) {
    return password_verify($password, $hashedPassword);
}


?>
