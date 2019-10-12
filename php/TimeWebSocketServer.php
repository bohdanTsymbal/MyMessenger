<?php

require_once __DIR__.'/vendor/autoload.php';
use Workerman\Worker;

$users = [];

$ws_worker_sending_time = new Worker("websocket://0.0.0.0:4000");

$ws_worker_sending_time->onConnect = function($connection) use (&$users)
{
    $connection->onWebSocketConnect = function($connection) use (&$users)
    {
        databaseConnection($mconnection);

        $userId = (int) $_GET['userId'];
        $token = $_GET['userToken'];

        $query = "select token from users where `id` = ?";
        $rows = preparedQuery($mconnection, $query, [&$userId], true);

        if ($rows == $token) {
            $users[$_GET['userId']] = $connection;
        }
        else {
            $connection->close();
        }

        mysqli_close($mconnection);
    };
};

$ws_worker_sending_time->onMessage = function($connection, $data) use (&$users)
{
    $sendingTime = date('c');
    $sendingTime = substr($sendingTime, 0, 10)." ".substr($sendingTime, 11, 8);

    $data = json_decode($data);

    if (isset($users[$data->fromUser])) {
        $webconnection = $users[$data->fromUser];

        $initialData = [
            'toUser' => $data->toUser,
            'message' => $data->message,
            'sendingTime' => $sendingTime
        ];
        $initialData = json_encode($initialData);

        $webconnection->send($initialData);
    } 
};

$ws_worker_sending_time->onClose = function($connection) use(&$users)
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
    $databaseSelection = mysqli_select_db($mconnection, $database);
}

function preparedQuery($mconnection, $query, $params, $return) {
    $stmt = mysqli_prepare($mconnection, $query);
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

    if ($return) {
        mysqli_stmt_bind_result($stmt, $rows);
        mysqli_stmt_fetch($stmt);
        mysqli_stmt_close($stmt);
        return $rows;
    }

    mysqli_stmt_close($stmt);
}