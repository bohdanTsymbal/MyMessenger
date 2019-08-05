<?php
require('./original.php');
session_start();
if (isset($_SESSION['id'])) {
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
    
    echo true;
}
else {
    session_destroy();
    echo false;
}
mysqli_close($connection);