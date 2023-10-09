<?php

require_once('../db.php');

$player_id = false;
$game_id = false;
$createGame = false;


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $jsonData = file_get_contents('php://input');
    $data = json_decode($jsonData, true);
    $login = $data['login'];
    $coordinates = $data['coordinates'];
    $wait = $data['wait_game'];

    if (!$player_id) {
        $start_query = 'SELECT id FROM Users WHERE LOWER(login) = LOWER(:login)';
        $stmt1 = $pdo->prepare($start_query);
        $stmt1->bindParam(':login', $login);
        $stmt1->execute();
        $result1 = $stmt1->fetch(PDO::FETCH_ASSOC);
        $player_id = $result1['id'];
    }

    if ($wait == 'yes') {
        $status = 1;
        $query2 = 'INSERT INTO Queues (user_id, status) VALUES (:player_id, :status)';
        $stmt2 = $pdo->prepare($query2);
        $stmt2->bindParam(':player_id', $player_id, PDO::PARAM_INT);
        $stmt2->bindParam(':status', $status , PDO::PARAM_INT);
        $stmt2->execute();

        $query3 = 'SELECT id, first_player, first_player_roll FROM Games WHERE second_player IS NULL AND first_player != :player_id';
        $stmt3 = $pdo->prepare($query3);
        $stmt3->bindParam(':player_id', $player_id);
        $stmt3->execute();

        $result3 = $stmt3->fetch(PDO::FETCH_ASSOC);
        if ($result3) {
            $game_id = $result3['id'];
            $first_player = $result3['first_player'];
            $first_player_roll = $result3['first_player_roll'];
            $min = 1;
            $max = 1000;
            try {
                $random_roll = random_int($min, $max);
            } catch (Exception $e) {

            }
            $query4 = 'UPDATE Games SET second_player = :player_id, second_player_roll = :player_random WHERE id = :game_id';
            $stmt4 = $pdo->prepare($query4);
            $stmt4->bindParam(':player_id', $player_id);
            $stmt4->bindParam(':player_random', $random_roll, PDO::PARAM_INT);
            $stmt4->bindParam(':game_id', $game_id, PDO::PARAM_INT);
            $stmt4->execute();
            foreach ($coordinates as $ship) {
                $ship_type = $ship['ship_type'];
                $start_coordinate = $ship['start_coordinate'];
                $direction = $ship['position'];
                $is_destroyed = 0;
                $query5 = 'INSERT INTO ShipsBegeza (game_id, ship_type, direction, is_destroyed, start_coordinate, user_id) VALUES (:game_id, :ship_type, :direction, :is_destroyed, :start_coordinate, :player_id)';
                $stmt5 = $pdo->prepare($query5);
                $stmt5->bindParam(':game_id', $game_id, PDO::PARAM_INT);
                $stmt5->bindParam(':ship_type', $ship_type,  PDO::PARAM_INT);
                $stmt5->bindParam(':direction', $direction);
                $stmt5->bindParam(':start_coordinate', $start_coordinate);
                $stmt5->bindParam(':is_destroyed', $is_destroyed, PDO::PARAM_INT);
                $stmt5->bindParam(':player_id', $player_id, PDO::PARAM_INT);
                $stmt5->execute();
                $ship_id = $pdo->lastInsertId();
                foreach ($ship['coordinates'] as $coordinate) {
                    $query6 = 'INSERT INTO CoordinatesBegeza (ship_id, target, is_hit) VALUES (:ship_id, :coordinate, 0)';
                    $stmt6 = $pdo->prepare($query6);
                    $stmt6->bindParam(':ship_id', $ship_id, PDO::PARAM_INT);
                    $stmt6->bindParam(':coordinate', $coordinate);
                    $stmt6->execute();
                }
            }
            $query7 = 'SELECT login FROM Users WHERE id = :opponent_id';
            $stmt7 = $pdo->prepare($query7);
            $stmt7->bindParam(':opponent_id',$result3['second_player'], PDO::PARAM_INT);
            $stmt7->execute();
            $result7 = $stmt7->fetch(PDO::FETCH_ASSOC);

            $status = 2;
            $query8 = 'UPDATE Queues SET status = :status WHERE user_id = :player_id';
            $stmt8 = $pdo->prepare($query8);
            $stmt8->bindParam(':status', $status, PDO::PARAM_INT);
            $stmt8->bindParam(':player_id', $player_id, PDO::PARAM_INT);
            $stmt8->execute();

            if ($random_roll > $first_player_roll) {
                $turn = 'user';
            }
            else {
                $turn = 'opponent';
            }
            $json_data = [
                'game_id' => $game_id,
                'opponent_id' => $first_player,
                'opponent' => $result7['login'],
                'first_turn' => $turn,
                'in_game' => 'yes',
            ];
            $createGame = false;
        }
        else {
            $min = 1;
            $max = 1000;
            try {
                $random_roll = random_int($min, $max);
            } catch (Exception $e) {
            }
            $query5 = 'INSERT INTO Games (first_player, first_player_roll) VALUES (:player, :random_roll)';
            $stmt5 = $pdo->prepare($query5);
            $stmt5->bindParam(':player',$player_id, PDO::PARAM_INT);
            $stmt5->bindParam(':random_roll', $random_roll, PDO::PARAM_INT);
            $stmt5->execute();


            $query6 = 'SELECT id, second_player, second_player_roll FROM Games WHERE first_player = :player AND winner IS NULL';
            $stmt6 = $pdo->prepare($query6);
            $stmt6->bindParam(':player',$player_id, PDO::PARAM_INT);
            $stmt6->execute();
            $result4 = $stmt6->fetch(PDO::FETCH_ASSOC);

            if ($result4['second_player']) {
                foreach ($coordinates as $ship) {
                    $ship_type = $ship['ship_type'];
                    $start_coordinate = $ship['start_coordinate'];
                    $direction = $ship['position'];
                    $is_destroyed = 0;
                    $query5 = 'INSERT INTO ShipsBegeza (game_id, ship_type, direction, is_destroyed, start_coordinate, user_id) VALUES (:game_id, :ship_type, :direction, :is_destroyed, :start_coordinate, :player_id)';
                    $stmt5 = $pdo->prepare($query5);
                    $stmt5->bindParam(':game_id', $game_id, PDO::PARAM_INT);
                    $stmt5->bindParam(':ship_type', $ship_type,  PDO::PARAM_INT);
                    $stmt5->bindParam(':direction', $direction);
                    $stmt5->bindParam(':start_coordinate', $start_coordinate);
                    $stmt5->bindParam(':is_destroyed', $is_destroyed, PDO::PARAM_INT);
                    $stmt5->bindParam(':player_id', $player_id, PDO::PARAM_INT);
                    $stmt5->execute();
                    $ship_id = $pdo->lastInsertId();
                    foreach ($ship['coordinates'] as $coordinate) {
                        $query6 = 'INSERT INTO CoordinatesBegeza (ship_id, target, is_hit) VALUES (:ship_id, :coordinate, 0)';
                        $stmt6 = $pdo->prepare($query6);
                        $stmt6->bindParam(':ship_id', $ship_id, PDO::PARAM_INT);
                        $stmt6->bindParam(':coordinate', $coordinate);
                        $stmt6->execute();
                    }
                }
                $query7 = 'SELECT login FROM Users WHERE id = :opponent_id';
                $stmt7 = $pdo->prepare($query7);
                $stmt7->bindParam(':opponent_id',$result4['second_player'], PDO::PARAM_INT);
                $stmt7->execute();
                $result7 = $stmt7->fetch(PDO::FETCH_ASSOC);

                $status = 2;
                $query8 = 'UPDATE Queues SET status = :status WHERE user_id = :player_id';
                $stmt8 = $pdo->prepare($query8);
                $stmt8->bindParam(':status', $status, PDO::PARAM_INT);
                $stmt8->bindParam(':player_id', $player_id, PDO::PARAM_INT);
                $stmt8->execute();

                $createGame = true;
                if ($random_roll > $result4['second_player_roll']) {
                    $turn = 'user';
                }
                else {
                    $turn = 'opponent';
                }
                $json_data = [
                    'game_id' => $result4['id'],
                    'opponent_id' => $result4['second_player'],
                    'opponent' => $result7['login'],
                    'first_turn' => $turn,
                    'in_game' => 'yes',
                ];
            }
            else {
                $json_data = [
                    'in_game' => 'no',
                ];
            }
            $createGame = true;
        }
        echo json_encode($json_data);
    }
    elseif ($wait == 'wait') {
        if ($createGame) {
            $query6 = 'SELECT id, second_player, second_player_roll, first_player_roll FROM Games WHERE first_player = :player AND winner IS NULL';
            $stmt6 = $pdo->prepare($query6);
            $stmt6->bindParam(':player',$player_id, PDO::PARAM_INT);
            $stmt6->execute();
            $result4 = $stmt6->fetch(PDO::FETCH_ASSOC);
            if ($result4['second_player'] != null) {
                foreach ($coordinates as $ship) {
                    $ship_type = $ship['ship_type'];
                    $start_coordinate = $ship['start_coordinate'];
                    $direction = $ship['position'];
                    $is_destroyed = 0;
                    $query5 = 'INSERT INTO ShipsBegeza (game_id, ship_type, direction, is_destroyed, start_coordinate, user_id) VALUES (:game_id, :ship_type, :direction, :is_destroyed, :start_coordinate, :player_id)';
                    $stmt5 = $pdo->prepare($query5);
                    $stmt5->bindParam(':game_id', $game_id, PDO::PARAM_INT);
                    $stmt5->bindParam(':ship_type', $ship_type,  PDO::PARAM_INT);
                    $stmt5->bindParam(':direction', $direction);
                    $stmt5->bindParam(':start_coordinate', $start_coordinate);
                    $stmt5->bindParam(':is_destroyed', $is_destroyed, PDO::PARAM_INT);
                    $stmt5->bindParam(':player_id', $player_id, PDO::PARAM_INT);
                    $stmt5->execute();
                    $ship_id = $pdo->lastInsertId();
                    foreach ($ship['coordinates'] as $coordinate) {
                        $query6 = 'INSERT INTO CoordinatesBegeza (ship_id, target, is_hit) VALUES (:ship_id, :coordinate, 0)';
                        $stmt6 = $pdo->prepare($query6);
                        $stmt6->bindParam(':ship_id', $ship_id, PDO::PARAM_INT);
                        $stmt6->bindParam(':coordinate', $coordinate);
                        $stmt6->execute();
                    }
                }
                $query7 = 'SELECT login FROM Users WHERE id = :opponent_id';
                $stmt7 = $pdo->prepare($query7);
                $stmt7->bindParam(':opponent_id',$result4['second_player'], PDO::PARAM_INT);
                $stmt7->execute();
                $result7 = $stmt7->fetch(PDO::FETCH_ASSOC);

                $status = 2;
                $query8 = 'UPDATE Queues SET status = :status WHERE user_id = :player_id';
                $stmt8 = $pdo->prepare($query8);
                $stmt8->bindParam(':status', $status, PDO::PARAM_INT);
                $stmt8->bindParam(':player_id', $player_id, PDO::PARAM_INT);
                $stmt8->execute();

                $random_roll = $result4['first_player_roll'];
                if ($random_roll > $result4['second_player_roll']) {
                    $turn = 'user';
                }
                else {
                    $turn = 'opponent';
                }
                $json_data = [
                    'game_id' => $result4['id'],
                    'opponent_id' => $result4['second_player'],
                    'opponent' => $result7['login'],
                    'first_turn' => $turn,
                    'in_game' => 'yes',
                ];
            }
            else {
                $json_data = [
                    'in_game' => 'no',
                ];
            }
        }
        else {
            $query3 = 'SELECT id, first_player, first_player_roll FROM Games WHERE second_player IS NULL AND first_player != :player_id';
            $stmt3 = $pdo->prepare($query3);
            $stmt3->bindParam(':player_id', $player_id);
            $stmt3->execute();

            $result3 = $stmt3->fetch(PDO::FETCH_ASSOC);
            if ($result3) {
                $game_id = $result3['id'];
                $first_player = $result3['first_player'];
                $first_player_roll = $result3['first_player_roll'];
                $min = 1;
                $max = 1000;
                try {
                    $random_roll = random_int($min, $max);
                } catch (Exception $e) {

                }
                $query4 = 'UPDATE Games SET second_player = :player_id, second_player_roll = :player_random WHERE id = :game_id';
                $stmt4 = $pdo->prepare($query4);
                $stmt4->bindParam(':player_id', $player_id);
                $stmt4->bindParam(':player_random', $random_roll, PDO::PARAM_INT);
                $stmt4->bindParam(':game_id', $game_id, PDO::PARAM_INT);
                $stmt4->execute();
                foreach ($coordinates as $ship) {
                    $ship_type = $ship['ship_type'];
                    $start_coordinate = $ship['start_coordinate'];
                    $direction = $ship['position'];
                    $is_destroyed = 0;
                    $query5 = 'INSERT INTO ShipsBegeza (game_id, ship_type, direction, is_destroyed, start_coordinate, user_id) VALUES (:game_id, :ship_type, :direction, :is_destroyed, :start_coordinate, :player_id)';
                    $stmt5 = $pdo->prepare($query5);
                    $stmt5->bindParam(':game_id', $game_id, PDO::PARAM_INT);
                    $stmt5->bindParam(':ship_type', $ship_type,  PDO::PARAM_INT);
                    $stmt5->bindParam(':direction', $direction);
                    $stmt5->bindParam(':start_coordinate', $start_coordinate);
                    $stmt5->bindParam(':is_destroyed', $is_destroyed, PDO::PARAM_INT);
                    $stmt5->bindParam(':player_id', $player_id, PDO::PARAM_INT);
                    $stmt5->execute();
                    $ship_id = $pdo->lastInsertId();
                    foreach ($ship['coordinates'] as $coordinate) {
                        $query6 = 'INSERT INTO CoordinatesBegeza (ship_id, target, is_hit) VALUES (:ship_id, :coordinate, 0)';
                        $stmt6 = $pdo->prepare($query6);
                        $stmt6->bindParam(':ship_id', $ship_id, PDO::PARAM_INT);
                        $stmt6->bindParam(':coordinate', $coordinate);
                        $stmt6->execute();
                    }
                }
                $query7 = 'SELECT login FROM Users WHERE id = :opponent_id';
                $stmt7 = $pdo->prepare($query7);
                $stmt7->bindParam(':opponent_id', $first_player, PDO::PARAM_INT);
                $stmt7->execute();
                $result7 = $stmt7->fetch(PDO::FETCH_ASSOC);

                $status = 2;
                $query8 = 'UPDATE Queues SET status = :status WHERE user_id = :player_id';
                $stmt8 = $pdo->prepare($query8);
                $stmt8->bindParam(':status', $status, PDO::PARAM_INT);
                $stmt8->bindParam(':player_id', $player_id, PDO::PARAM_INT);
                $stmt8->execute();

                if ($random_roll > $first_player_roll) {
                    $turn = 'user';
                }
                else {
                    $turn = 'opponent';
                }
                $json_data = [
                    'game_id' => $game_id,
                    'opponent_id' => $first_player,
                    'opponent' => $result7['login'],
                    'first_turn' => $turn,
                    'in_game' => 'yes',
                ];
            }
            else {
                $json_data = [
                    'in_game' => 'no'
                ];
            }
        }
        echo json_encode($json_data);
    }
    else {
        $createGame = false;
        $query3 = 'SELECT id FROM Users WHERE LOWER(login) = LOWER(:login)';

        $stmt3 = $pdo->prepare($query3);
        $stmt3->bindParam(':login', $login);
        $stmt3->execute();
        $result3 = $stmt3->fetch(PDO::FETCH_ASSOC);
        $player_id = $result3['id'];
        $status = 1;

        $query4 = 'DELETE FROM Queues WHERE user_id = :player_id';

        $stmt4 = $pdo->prepare($query4);
        $stmt4->bindParam(':player_id', $player_id, PDO::PARAM_INT);
        $stmt4->execute();

        $query5 = 'DELETE FROM Games WHERE first_player = :player_id';
        $stmt5 = $pdo->prepare($query5);
        $stmt5->bindParam(':player_id', $player_id, PDO::PARAM_INT);
        $stmt5->execute();

    }
}

























