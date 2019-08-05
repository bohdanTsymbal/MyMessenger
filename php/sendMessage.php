<?php
if (!empty($_POST)) {
    require('./original.php');
    session_start();
    if (isset($_SESSION['id'])) {
        $localsocket = 'tcp://127.0.0.1:0109';
        $userId = $_SESSION['id'];
        $interlocutorId = $_POST['interlocutorId'];
        $message = $_POST['message'];
        $id;

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
    
        $data = [
            'toUser' => $interlocutorId,
            'fromUser' => $userId,
            'message' => $message
        ];
    
        $instance = stream_socket_client($localsocket);
    
        fwrite($instance, json_encode($data)."\n");

        echo true;
    }
    else {
        session_destroy();
        echo false;
    }
    mysqli_close($connection);
}
