<?php
require('./original.php');
$userId = $_POST['userId'];
$interlocatorId = $_POST['interlocutorId'];
$number = $_POST['number'];
$query = "select message, fromUser, toUser from messages where (`fromUser` = '$userId' and `toUser` = '$interlocatorId') or (`fromUser` = '$interlocatorId' and `toUser` = '$userId') order by id desc limit $number";
$queryResult = query($connection, $query);
$result = [];
while($rows = mysqli_fetch_assoc($queryResult)) {
    $result[] = $rows;
}
$result = json_encode($result);
echo $result;