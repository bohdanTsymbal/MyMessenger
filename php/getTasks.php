<?php
if (!empty($_POST)) {
    require('./initial.php');
    session_start();
    $userId = $_SESSION['id'];
    $number = $_POST['number'];
    $number = explode('_', $number);
    
    $query = "select tasks.taskId, messages.message, messages.fromUser, users.firstName, users.lastName, messages.sendingTime, tasks.isDone from tasks inner join messages on tasks.messageId = messages.id and tasks.userId = ? inner join users on messages.fromUser = users.id order by tasks.taskId desc limit ?, ?";
    $stmt = preparedQuery($connection, $query, [&$userId, &$number[0], &$number[1]]);
    mysqli_stmt_bind_result($stmt, $taskId, $message, $fromUser, $firstName, $lastName, $sendingTime, $isDone);    

    $result = [];
    $i = 0;
    while(mysqli_stmt_fetch($stmt)) {
        $result[$i]['messageId'] = $taskId;
        $result[$i]['message'] = $message;
        $result[$i]['fromUser'] = $fromUser;
        $result[$i]['firstName'] = $firstName;
        $result[$i]['lastName'] = $lastName;
        $result[$i]['sendingTime'] = $sendingTime;
        $result[$i]['isDone'] = $isDone;
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