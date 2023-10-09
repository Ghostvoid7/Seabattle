<?php

require_once('../db.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $jsonData = file_get_contents('php://input');
    $data = json_decode($jsonData, true);
    $login = $data['login'];
    $status_login = $data['yesLogin'];
    $newStatus = 0;
    $query = "UPDATE Users SET is_online = :newStatus, last_update = NOW() WHERE LOWER(login) = LOWER(:login)";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':newStatus', $newStatus, PDO::PARAM_STR);
    $stmt->bindParam(':login', $login, PDO::PARAM_STR);
    $stmt->execute();
    if ($status_login == 'yes') {
        $user_name = 'yes';
    }
    else {
        $user_name = 'no';
    }
    echo json_encode($user_name);

}


































