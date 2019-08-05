<?php
require_once __DIR__.'/vendor/autoload.php';
use Workerman\Worker;

$users = [];

$ws_worker = new Worker("websocket://0.0.0.0:8000");

$ws_worker->onWorkerStart = function() use (&$users)
{
    $inner_tcp_worker = new Worker("tcp://127.0.0.1:0109");

    $inner_tcp_worker->onMessage = function($connection, $data) use (&$users) {
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
    };

    $inner_tcp_worker->listen();
};

$ws_worker->onConnect = function($connection) use (&$users)
{
    $connection->onWebSocketConnect = function($connection) use (&$users)
    {
        $users[$_GET['userId']] = $connection;
    };
};

$ws_worker->onClose = function($connection) use(&$users)
{
    $user = array_search($connection, $users);
    unset($users[$user]);
};

Worker::runAll();