<?php
require_once __DIR__.'/vendor/autoload.php';
use Workerman\Worker;

$users = [];

$ws_worker = new Worker("websocket://0.0.0.0:8000");

$ws_worker->onConnect = function($connection) use (&$users)
{
    $connection->onWebSocketConnect = function($connection) use (&$users)
    {
        $users[$_GET['userId']] = $connection;
    };
};

$ws_worker->onMessage = function($connection, $data) use (&$users)
{
    $data = json_decode($data);

    if (isset($users[$data->toUser])) {
        $webconnection = $users[$data->toUser];

        $initialData = [
            'fromUser' => $data->fromUser,
            'message' => $data->message
        ];
        $initialData = json_encode($initialData);

        $webconnection->send($initialData);
    }
    $location = 'localhost';
    $user = 'root';
    $password = '';
    $database = 'mymessengerdatabase';
    $connection = mysqli_connect($location, $user, $password);
    $databaseSelection = mysqli_select_db($connection, $database);

    $id;
    $userId = $data->fromUser;
    $interlocutorId = $data->toUser;
    $message = $data->message;

    $query = 'select id from messages order by id desc limit 1';
    $rows = mysqli_fetch_row(query($connection, $query));
    if ($rows[0] == "") {
        $id = 1;
    }
    else {
        $id = ++$rows[0];
    }
    $query = "insert into messages (`id`, `fromUser`, `toUser`, `message`) values ('$id', '$userId', '$interlocutorId', '$message')";
    query($connection, $query);
    
    echo true;
    mysqli_close($connection);
};

$ws_worker->onClose = function($connection) use(&$users)
{
    $user = array_search($connection, $users);
    unset($users[$user]);
};

Worker::runAll();

function query($connection, $query) {
    $result = mysqli_query($connection, $query);
    if (!$result) {
        die(mysqli_error($connection));
    }
    return $result;
}