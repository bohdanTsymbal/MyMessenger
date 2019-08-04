<?php
if (!empty($_POST)) {
    require('./original.php');
    session_start();
    $userInput = $_POST['userInput'];
    if ($userInput == $_SESSION['registrationVerificationCode']) {
        $firstName = $_SESSION['registrationFirstName'];
        $lastName = $_SESSION['registrationLastName'];
        $email = $_SESSION['registrationEmail'];
        $username = $_SESSION['registrationUsername'];
        $password = $_SESSION['registrationPassword'];
        session_destroy();
        $query = "select id from users order by id desc";
        $rows = mysqli_fetch_row(query($connection, $query));
        if ($rows[0] == "") {
            $id = 1;
        }
        else {
            $id = ++$rows[0];
        }
        $query = "insert into `users` (`id`, `firstName`, `lastName`, `email`, `username`, `password`) values ('$id', '$firstName', '$lastName', '$email', '$username', '$password')";
        query($connection, $query);
        mysqli_close($connection);
        echo true;
    }
    else {
        echo false;
    }
}