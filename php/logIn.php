<?php
if (!empty($_POST)) {
    require('./initial.php');
    $username = $_POST['username'];
    $password = $_POST['password'];
    
    $query = "select password, id, firstName, lastName, email, token from users where `username` = ?";
    $stmt = preparedQuery($connection, $query, [&$username]);
    mysqli_stmt_bind_result($stmt, $passwordDB, $id, $firstName, $lastName, $email, $token);
    mysqli_stmt_fetch($stmt);
    mysqli_stmt_close($stmt);

    if ($passwordDB == '') {
        echo "The user is not registered!";
    }
    else {
        if (password_verify($password, $passwordDB)) {
            session_start();
            $_SESSION['id'] = $id;
            $_SESSION['firstName'] = $firstName;
            $_SESSION['lastName'] = $lastName;
            $_SESSION['email'] = $email;
            $_SESSION['token'] = $token;
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