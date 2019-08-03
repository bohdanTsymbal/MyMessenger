<?php
if (!empty($_POST)) {
    require('./original.php');
    $firstName = $_POST['firstName'];
    $lastName = $_POST['lastName'];
    $email = $_POST['email'];
    $username = $_POST['username'];
    $password = $_POST['password'];
    $query = "select id from users order by id desc";
    $rows = mysqli_fetch_row(query($connection, $query));
    if ($rows[0] == "") {
        $id = 1;
    }
    else {
        $id = ++$rows[0];
    }
    $password = password_hash($password, PASSWORD_DEFAULT);
    $query = "insert into `users` (`id`, `firstName`, `lastName`, `email`, `username`, `password`) values ('$id', '$firstName', '$lastName', '$email', '$username', '$password')";
    query($connection, $query);
    echo 1;
    mysqli_close($connection);
}