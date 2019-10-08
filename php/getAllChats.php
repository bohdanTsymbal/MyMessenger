<?php
require('./initial.php');

session_start();
$id = (int) $_SESSION['id'];

$query = "select message, fromUser, toUser from messages where `fromUser` = ? or `toUser` = ?";
$stmt = preparedQuery($connection, $query, [&$id, &$id]);
mysqli_stmt_bind_result($stmt, $message, $fromUser, $toUser);

$result = [];
$i = 0;
while (mysqli_stmt_fetch($stmt)) {
    $result[$i]['message'] = $message;
    $result[$i]['fromUser'] = $fromUser;
    $result[$i]['toUser'] = $toUser;
    $i++;
}
mysqli_stmt_close($stmt);

for ($i = 0; $i < count($result); $i++) {
    $interlocatorId = $result[$i]['fromUser'] == $id ? $result[$i]['toUser'] : $result[$i]['fromUser'];
    $query = "select firstName, lastName from users where `id` = ?";
    $stmt = preparedQuery($connection, $query, [&$interlocatorId]);
    mysqli_stmt_bind_result($stmt, $firstName, $lastName);
    mysqli_stmt_fetch($stmt);
    mysqli_stmt_close($stmt);
    $result[$i]['firstName'] = $firstName;
    $result[$i]['lastName'] = $lastName;
}

$result = json_encode($result);
echo $result;

mysqli_close($connection);