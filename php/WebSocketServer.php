<?php

require_once __DIR__.'/vendor/autoload.php';
use Workerman\Worker;

$users = [];

$ws_worker_messages = new Worker("websocket://0.0.0.0:0666");

$ws_worker_messages->onConnect = function($connection) use (&$users)
{
    $connection->onWebSocketConnect = function($connection) use (&$users)
    {
        $userId = (int) $_GET['userId'];
        $token = $_GET['userToken'];

        $query = "select token from users where `id` = ?";
        databaseConnection($mconnection);
        $rows = preparedQuery($mconnection, $query, [&$userId], true);
        mysqli_close($mconnection);

        if ($rows == $token) {
            $users[$_GET['userId']] = $connection;
        }
        else {
            $connection->close();
        }
    };
};

$ws_worker_messages->onMessage = function($connection, $data) use (&$users)
{
    $data = json_decode($data);
    databaseConnection($mconnection);
    if (isset($data->type)) {
        $messageId = $data->messageId;

        $query = "select isDone from messages where id = ?";
        $isDone = preparedQuery($mconnection, $query, [&$messageId], true);
        $isDone = $isDone ? false : true;

        $query = "update messages set isDone = ? where id = ?";
        preparedQuery($mconnection, $query, [&$isDone, &$messageId], false);
    }
    else {
        $userId = $data->fromUser;

        $sendingTime = "";
        if ($data->sendingTime != "NONE") {
            $sendingTime = $data->sendingTime;
        }
        else {
            $sendingTime = date('c');
            $sendingTime = substr($sendingTime, 0, 10)." ".substr($sendingTime, 11, 8);
        }
    
        $id;
        $query = 'select id from messages order by id desc limit 1';
        $rows = mysqli_fetch_row(query($mconnection, $query));
        if ($rows[0] == "") {
            $id = 1;
        }
        else {
            $id = ++$rows[0];
        }
        
        $interlocutorId = $data->toUser;
        $message = $data->message;
        $authorId = (int)$data->authorId;
        $query = "insert into messages (`id`, `fromUser`, `toUser`, `message`, `sendingTime`, `authorId`) values (?, ?, ?, ?, ?, ?)";
        preparedQuery($mconnection, $query, [&$id, &$userId, &$interlocutorId, &$message, &$sendingTime, &$authorId], false);
        mysqli_close($mconnection);
    
        if (isset($users[$data->toUser]) && $userId != $data->toUser) {
            $webconnection = $users[$data->toUser];
    
            $initialData = [
                'type' => 'message',
                'fromUser' => $userId,
                'message' => $data->message,
                'sendingTime' => $sendingTime,
                'messageId' => $id
            ];
            $initialData = json_encode($initialData);
    
            $webconnection->send($initialData);
        }
    
        if (isset($users[$userId]) && $data->returnTime && $data->additionalData == false) {
            $webconnection = $users[$userId];
    
            $initialData = [
                'type' => 'sendingTime',
                'toUser' => $data->toUser,
                'message' => $data->message,
                'sendingTime' => $sendingTime,
                'messageId' => $id
            ];
            $initialData = json_encode($initialData);
    
            $webconnection->send($initialData);
        }
    
        if (isset($users[$userId]) && $data->additionalData != false) {
            $webconnection = $users[$userId];
    
            $initialData = [
                'type' => 'messageId',
                'messageId' => $id,
                'messageDate' => $data->sendingTime,
                'messageText' => $data->message,
                'additionalData' => $data->additionalData
            ];
            $initialData = json_encode($initialData);
    
            $webconnection->send($initialData);
        }
    }
};

$ws_worker_messages->onClose = function($connection) use (&$users)
{
    $user = array_search($connection, $users);
    unset($users[$user]);
};

Worker::runAll();

function databaseConnection(&$mconnection) {
    $location = 'localhost';
    $user = 'root';
    $password = '';
    $database = 'mymessengerdatabase';
    $mconnection = mysqli_connect($location, $user, $password);
    mysqli_set_charset($mconnection, "utf8");
    $databaseSelection = mysqli_select_db($mconnection, $database);
}

function query($сmconnection, $query) {
    $result = mysqli_query($сmconnection, $query);
    if (!$result) {
        die(mysqli_error($сmconnection));
    }
    return $result;
}

function preparedQuery($сmconnection, $query, $params, $return) {
    $stmt = mysqli_prepare($сmconnection, $query);
    $markers = "";
    for ($i = 0; $i < count($params); $i++) {
        if (gettype($params[$i]) === "integer") {
            $markers .= "i";
        }
        else if (gettype($params[$i]) === "string") {
            $markers .= "s";
        }
        else $markers .= "d";
    }
    array_unshift($params, $stmt, $markers);
    call_user_func_array("mysqli_stmt_bind_param", $params);
    mysqli_stmt_execute($stmt);
    echo mysqli_error($сmconnection);

    if ($return) {
        mysqli_stmt_bind_result($stmt, $rows);
        mysqli_stmt_fetch($stmt);
        mysqli_stmt_close($stmt);
        return $rows;
    }
    
    mysqli_stmt_close($stmt);
}