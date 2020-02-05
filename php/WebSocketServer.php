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
    if ($data->type == "changeIsDoneStatus") {
        $messageId = $data->messageId;

        $query = "select isDone from tasks where taskId = ?";
        $isDone = preparedQuery($mconnection, $query, [&$messageId], true);
        $isDone = $isDone ? false : true;

        $query = "update tasks set isDone = ? where taskId = ?";
        $stmt = preparedQuery($mconnection, $query, [&$isDone, &$messageId], false);
        mysqli_stmt_close($stmt);
    }
    else if ($data->type == "message") {
        $userId = $data->fromUser;

        $sendingTime = date('c');
        $sendingTime = substr($sendingTime, 0, 10)." ".substr($sendingTime, 11, 8);

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
        $query = "insert into messages (`id`, `fromUser`, `toUser`, `message`, `sendingTime`) values (?, ?, ?, ?, ?)";
        $stmt = preparedQuery($mconnection, $query, [&$id, &$userId, &$interlocutorId, &$message, &$sendingTime], false);
        mysqli_stmt_close($stmt);

        if ($userId == $interlocutorId) {
            $taskId;
            $query = 'select taskId from tasks order by taskId desc limit 1';
            $rows = mysqli_fetch_row(query($mconnection, $query));
            if ($rows[0] == "") {
                $taskId = 1;
            }
            else {
                $taskId = ++$rows[0];
            }

            $query = "insert into tasks (`taskId`, `messageId`, `userId`) values (?, ?, ?)";
            $stmt = preparedQuery($mconnection, $query, [&$taskId, &$id, &$userId], false);
            mysqli_stmt_close($stmt);
        }
        else if (isset($users[$interlocutorId])) {
            $webconnection = $users[$interlocutorId];
    
            $initialData = [
                'type' => 'message',
                'fromUser' => $userId,
                'message' => $message,
                'sendingTime' => $sendingTime,
                'messageId' => $id
            ];
            $initialData = json_encode($initialData);
    
            $webconnection->send($initialData);
        }
        
        $messageId = $userId == $interlocutorId ? $taskId : $id;
        if (isset($users[$userId])) {
            $webconnection = $users[$userId];
    
            $initialData = [
                'type' => 'sendingTime',
                'toUser' => $interlocutorId,
                'message' => $message,
                'sendingTime' => $sendingTime,
                'messageId' => $messageId
            ];
            $initialData = json_encode($initialData);
    
            $webconnection->send($initialData);
        }
    }
    else if ($data->type == "task") {
        $userId = $data->fromUser;

        $taskId;
        $query = 'select taskId from tasks order by taskId desc limit 1';
        $rows = mysqli_fetch_row(query($mconnection, $query));
        if ($rows[0] == "") {
            $taskId = 1;
        }
        else {
            $taskId = ++$rows[0];
        }
        $messageId = $data->messageId;

        $query = "insert into tasks (`taskId`, `messageId`, `userId`) values (?, ?, ?)";
        $stmt = preparedQuery($mconnection, $query, [&$taskId, &$messageId, &$userId], false);
        mysqli_stmt_close($stmt);

        if (isset($users[$userId])) {
            $query = "select messages.message, users.firstName, users.lastName, messages.sendingTime from tasks inner join messages on tasks.messageId = messages.id and tasks.taskId = ? inner join users on messages.fromUser = users.id";
            $stmt = preparedQuery($mconnection, $query, [&$taskId], false);
            mysqli_stmt_bind_result($stmt, $message, $firstName, $lastName, $sendingTime);
            mysqli_stmt_fetch($stmt);
            mysqli_stmt_close($stmt);

            $webconnection = $users[$userId];
    
            $messageAuthor = "$firstName $lastName";
            $initialData = [
                'type' => 'messageId',
                'messageId' => $taskId,
                'messageDate' => $sendingTime,
                'messageText' => $message,
                'messageAuthor' => $messageAuthor
            ];
            $initialData = json_encode($initialData);
    
            $webconnection->send($initialData);
        }
    }

    mysqli_close($mconnection);
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
    // echo mysqli_error($сmconnection);

    if ($return) {
        mysqli_stmt_bind_result($stmt, $rows);
        mysqli_stmt_fetch($stmt);
        mysqli_stmt_close($stmt);
        return $rows;
    }
    else {
        return $stmt;
    }
}