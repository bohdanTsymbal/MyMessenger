<?php
if (!empty($_POST)) {
    require('./initial.php');
    session_start();
    $userId = $_SESSION['id'];
    $interlocatorId = $_POST['interlocutorId'];
    $number = $_POST['number'];
    $number = explode('_', $number);
    
    $query = "select id, message, fromUser, toUser, sendingTime from messages where (`fromUser` = ? and `toUser` = ?) or (`fromUser` = ? and `toUser` = ?) order by id desc limit ?, ?";
    $stmt = preparedQuery($connection, $query, [&$userId, &$interlocatorId, &$interlocatorId, &$userId, &$number[0], &$number[1]]);
    mysqli_stmt_bind_result($stmt, $messageId, $message, $fromUser, $toUser, $sendingTime);    

    $result = [];
    $i = 0;
    while(mysqli_stmt_fetch($stmt)) {
        $result[$i]['message'] = $message;
        $result[$i]['fromUser'] = $fromUser;
        $result[$i]['toUser'] = $toUser;
        $result[$i]['sendingTime'] = $sendingTime;
        $result[$i]['messageId'] = $messageId;
        $i++;
    }
    mysqli_stmt_close($stmt);

    $result = json_encode($result);
    echo $result;

    mysqli_close($connection);
}
else {
    echo 'POST is empty!';
}