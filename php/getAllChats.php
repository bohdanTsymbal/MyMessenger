<?php
require('./initial.php');
session_start();
$id = $_SESSION['id'];
$query = "select message, fromUser, toUser from messages where `fromUser` = '$id' or `toUser` = '$id'";
$queryResult = query($connection, $query);
$result = [];
while($rows = mysqli_fetch_assoc($queryResult)) {
    $result[] = $rows;
}
$result = json_encode($result);
echo $result;
mysqli_close($connection);