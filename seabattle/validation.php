<?php
require_once('./db.php');


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $login = $_POST["Login"];
    $query = "SELECT is_online FROM Users WHERE LOWER(login) = LOWER(:login)";

    $stmt = $pdo->prepare($query);

    $stmt->bindParam(':login', $login, PDO::PARAM_STR);
    $stmt->execute();

    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        $is_online = $result['is_online'];
        if ($is_online == 0) {
            $newStatus = 1;


            $query = "UPDATE Users SET is_online = :newStatus, last_update = NOW() WHERE LOWER(login) = LOWER(:login)";

            $stmt = $pdo->prepare($query);

            $stmt->bindParam(':newStatus', $newStatus, PDO::PARAM_STR);
            $stmt->bindParam(':login', $login, PDO::PARAM_STR);

            $stmt->execute();

            $rowCount = $stmt->rowCount();

            if ($rowCount > 0) {
                $newContent = 'Успешно';

            } else {
                $newContent = 'Ошибка';
            }
            http_response_code(200);
        }
        else {
            http_response_code(204);
        }
    }
    else {
        $new_status = 1;

        $query = "INSERT INTO Users (login, is_online, last_update) VALUES (:login, :is_online, NOW())";

        $stmt = $pdo->prepare($query);

        $stmt->bindParam(':login', $login, PDO::PARAM_STR);
        $stmt->bindParam(':is_online', $new_status, PDO::PARAM_INT);

        $stmt->execute();

        $newId = $pdo->lastInsertId();
        http_response_code(200);
    }
}



