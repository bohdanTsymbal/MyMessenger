<?php
require('./initial.php');
session_start();
if (isset($_SESSION['id'])) {
    $id = $_SESSION['id'];
    $query = "select id, firstName, lastName from users where `id` != ?";
    $stmt = preparedQuery($connection, $query, [&$id]);
    mysqli_stmt_bind_result($stmt, $userId, $firstName, $lastName);

    $result = [];
    $i = 0;
    while (mysqli_stmt_fetch($stmt)) {
        $result[$i]['id'] = $userId;
        $result[$i]['firstName'] = $firstName;
        $result[$i]['lastName'] = $lastName;
        $i++;
    }
    mysqli_stmt_close($stmt);

    $result = json_encode($result);
    echo $result;
}
else {
    session_destroy();
    echo false;
}
mysqli_close($connection);