<?php
require("./original.php");
$id = $_POST['id'];
$newPassword = $_POST['newPassword'];
$newPassword = password_hash($newPassword, PASSWORD_DEFAULT);
$query = "update users set `password` = '$newPassword' where `id` = '$id'";
query($connection, $query);
echo 1;
mysqli_close($connection);