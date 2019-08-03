<?php
if (!empty($_POST)) {
    require('./original.php');
    $email = $_POST['email'];
    $username = $_POST['username'];
    $password = $_POST['password'];
    $query = "select email, password from users where `username` = '$username'";
    $rows = mysqli_fetch_row(query($connection, $query));
    if ($rows[0] != '') {
        if (password_verify($password, $rows[1]) && $rows[0] == $email) {
            echo 'You have already registered!';
        }
        else if ($rows[0] == $email) {
            echo 'The username and the email are already taken!';
        }
        else {
            echo 'The username is already taken!';
        }
    }
    else {
        $query = "select id from users where `email` = '$email'";
        $rows = mysqli_fetch_row(query($connection, $query));
        if ($rows[0] != '') {
            echo 'The email is already used!';
        }
        else {
            $verificationCode = rand(10000000, 99999999);
            $subject = 'Verification of registration';
            $message = "Your verification code is $verificationCode.";
            sendLetter($email, $subject, $message);
            echo $verificationCode;
        }
    }
    mysqli_close($connection);
}