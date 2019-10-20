<?php
if (!empty($_POST)) {
    require("./initial.php");
    session_start();
    $id = $_SESSION['recoveryUserId'];
    $newPassword = $_POST['password'];
    $newPassword = password_hash($newPassword, PASSWORD_DEFAULT);
    
    $query = "update users set `password` = ? where `id` = ?";
    $stmt = preparedQuery($connection, $query, [&$newPassword, &$id]);

    session_destroy();
    mysqli_close($connection);
    echo true;
}
else {
    echo 'POST is empty!';
}