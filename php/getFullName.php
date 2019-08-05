<?php
require('./original.php');
$id = $_POST['id'];
$query = "select firstName, lastName from users where `id` = '$id'";
$result = mysqli_fetch_assoc(query($connection, $query));
$result = json_encode($result);
mysqli_close($connection);
echo $result;