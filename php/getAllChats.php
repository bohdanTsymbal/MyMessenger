<?php
require('./original.php');
session_start();
if (isset($_SESSION['id'])) {
    $id = $_SESSION['id'];
    $query = "select message, fromUser, toUser from messages where `fromUser` = '$id' or `toUser` = '$id'";
    $queryResult = query($connection, $query);
    $result = [];
    while($rows = mysqli_fetch_assoc($queryResult)) {
        $result[] = $rows;
    }
    $result = json_encode($result);
    echo $result;
}
else {
    session_destroy();
}