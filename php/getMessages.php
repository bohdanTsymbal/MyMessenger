<?php
if (!empty($_POST)) {
    require('./initial.php');
    session_start();
    $userId = $_SESSION['id'];
    $interlocatorId = $_POST['interlocutorId'];
    $number = $_POST['number'];
    $number = explode('_', $number);
    
    $query = "select message, fromUser, toUser, sendingTime, authorId from messages where (`fromUser` = ? and `toUser` = ?) or (`fromUser` = ? and `toUser` = ?) order by id desc limit ?, ?";
    $stmt = preparedQuery($connection, $query, [&$userId, &$interlocatorId, &$interlocatorId, &$userId, &$number[0], &$number[1]]);
    mysqli_stmt_bind_result($stmt, $message, $fromUser, $toUser, $sendingTime, $authorId);    

    $result = [];
    $authors = [];
    $i = 0;
    while(mysqli_stmt_fetch($stmt)) {
        $result[$i]['message'] = $message;
        $result[$i]['fromUser'] = $fromUser;
        $result[$i]['toUser'] = $toUser;
        $result[$i]['sendingTime'] = $sendingTime;
        $authors[$i] = $authorId;
        $i++;
    }
    mysqli_stmt_close($stmt);

    for ($i = 0; $i < count($authors); $i++) {
        $query2 = "select firstName, lastName from users where `id` = ?";
        $stmt2 = preparedQuery($connection, $query2, [&$authors[$i]]);
        mysqli_stmt_bind_result($stmt2, $firstName, $lastName);
        mysqli_stmt_fetch($stmt2);
        $result[$i]['firstName'] = $firstName;
        $result[$i]['lastName'] = $lastName;
        mysqli_stmt_close($stmt2);
    }

    $result = json_encode($result);
    echo $result;

    mysqli_close($connection);
}
else {
    echo 'POST is empty!';
}