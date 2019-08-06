<?php
if (!empty($_POST)) {
    require("./initial.php");
    session_start();
    $id = $_SESSION['recoveryUserId'];
    $newPassword = $_POST['newPassword'];
    $newPassword = password_hash($newPassword, PASSWORD_DEFAULT);
    $query = "update users set `password` = '$newPassword' where `id` = '$id'";
    query($connection, $query);
    session_destroy();
    mysqli_close($connection);
    echo true;
}
else {
    echo 'POST is empty!';
}