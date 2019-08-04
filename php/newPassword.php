<?php
if (!empty($_POST)) {
    require("./original.php");
    session_start();
    $id = $_SESSION['recoveryUserId'];
    $newPassword = $_POST['newPassword'];
    $newPassword = password_hash($newPassword, PASSWORD_DEFAULT);
    $query = "update users set `password` = '$newPassword' where `id` = '$id'";
    query($connection, $query);
    echo true;
    session_destroy();
    mysqli_close($connection);
}