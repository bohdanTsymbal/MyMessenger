<?php
require('./initial.php');
session_start();
$id = $_SESSION['id'];
$query = "select message, fromUser, toUser from messages where `fromUser` = '$id' or `toUser` = '$id'";
$queryResult = query($connection, $query);
$result = [];
while($rows = mysqli_fetch_assoc($queryResult)) {
    $interlocatorId = $rows['fromUser'] == $id ? $rows['toUser'] : $rows['fromUser'];
    $query = "select firstName, lastName from users where `id` = '$interlocatorId'";
    $fullName = mysqli_fetch_assoc(query($connection, $query));
    $rows['firstName'] = $fullName['firstName'];
    $rows['lastName'] = $fullName['lastName'];
    $result[] = $rows;
}
$result = json_encode($result);
echo $result;
mysqli_close($connection);