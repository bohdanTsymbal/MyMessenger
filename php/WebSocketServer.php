<?php
// ini_set('session.save_path', '../session');
// ini_set('session.gc_probability', '0');
// ini_set('session.gc_maxlifetime', '86400');
// session_start();

require_once __DIR__.'/vendor/autoload.php';
use Workerman\Worker;

$users = [];

$ws_worker = new Worker("websocket://0.0.0.0:8000");

$ws_worker->onConnect = function($connection) use (&$users)
{
    $connection->onWebSocketConnect = function($connection) use (&$users)
    {
        $location = 'localhost';
        $user = 'root';
        $password = '';
        $database = 'mymessengerdatabase';
        $mconnection = mysqli_connect($location, $user, $password);
        $databaseSelection = mysqli_select_db($mconnection, $database);

        $userId = $_GET['userId'];
        $token = $_GET['userToken'];

        $query = "select token from users where `id` = '$userId'";
        $rows = mysqli_fetch_row(query($mconnection, $query));

        if ($rows[0] == $token) {
            $users[$_GET['userId']] = $connection;
        }
        else {
            $connection->close();
        }
    };
};

$ws_worker->onMessage = function($connection, $data) use (&$users)
{
    $data = json_decode($data);
    $userId = $data->fromUser;

    if (isset($users[$data->toUser])) {
        $webconnection = $users[$data->toUser];

        $initialData = [
            'fromUser' => $userId,
            'message' => $data->message
        ];
        $initialData = json_encode($initialData);

        $webconnection->send($initialData);
    }

    $id;
    $interlocutorId = $data->toUser;
    $message = $data->message;

    $location = 'localhost';
    $user = 'root';
    $password = '';
    $database = 'mymessengerdatabase';
    $mconnection = mysqli_connect($location, $user, $password);
    $databaseSelection = mysqli_select_db($mconnection, $database);

    $query = 'select id from messages order by id desc limit 1';
    $rows = mysqli_fetch_row(query($mconnection, $query));
    if ($rows[0] == "") {
        $id = 1;
    }
    else {
        $id = ++$rows[0];
    }
    $query = "insert into messages (`id`, `fromUser`, `toUser`, `message`) values ('$id', '$userId', '$interlocutorId', '$message')";
    query($mconnection, $query);
    
    mysqli_close($mconnection);
};

$ws_worker->onClose = function($connection) use(&$users)
{
    $user = array_search($connection, $users);
    unset($users[$user]);
};

Worker::runAll();

function query($mconnection, $query) {
    $result = mysqli_query($mconnection, $query);
    if (!$result) {
        die(mysqli_error($mconnection));
    }
    return $result;
}