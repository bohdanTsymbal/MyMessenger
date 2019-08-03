<?php
require('./original.php');
$username = $_POST['username'];
$password = $_POST['password'];
$query = "select password, id from users where `username` = '$username'";
$rows = mysqli_fetch_row(query($connection, $query));
if ($rows[0] == "") {
    echo "The user is not registered!";
}
else {
    if (password_verify($password, $rows[0])) {
        echo $rows[1];
    }
    else {
        echo "Password is wrong!";
    }
}
mysqli_close($connection);