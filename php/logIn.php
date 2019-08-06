<?php
if (!empty($_POST)) {
    require('./initial.php');
    $username = $_POST['username'];
    $password = $_POST['password'];
    $query = "select password, id, firstName, lastName, email, token from users where `username` = '$username'";
    $rows = mysqli_fetch_row(query($connection, $query));
    if ($rows[0] == '') {
        echo "The user is not registered!";
    }
    else {
        if (password_verify($password, $rows[0])) {
            session_start();
            $_SESSION['id'] = $rows[1];
            $_SESSION['firstName'] = $rows[2];
            $_SESSION['lastName'] = $rows[3];
            $_SESSION['email'] = $rows[4];
            $_SESSION['token'] = $rows[5];
            $_SESSION['username'] = $username;
            echo true;
        }
        else {
            echo "Username or password is incorrect!";
        }
    }
    mysqli_close($connection);
}
else {
    echo 'POST is empty!';
}