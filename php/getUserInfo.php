<?php
if (!empty($_POST)) {
    require('./initial.php');
    $requestedInfo = json_decode($_POST['requestedInfo']);
    $result = [];
    session_start();
    for ($i = 0; $i < count($requestedInfo); $i++) {
        $result[$requestedInfo[$i]] = $_SESSION[$requestedInfo[$i]];
    }
    $result = json_encode($result);
    echo $result;
    mysqli_close($connection);
}
else {
    echo 'POST is empty!';
}