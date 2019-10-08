<?php
if (!empty($_POST)) {
    require('./initial.php');
    $firstName = $_POST['firstName'];
    $lastName = $_POST['lastName'];
    $email = $_POST['email'];
    $username = $_POST['username'];
    $password = $_POST['password'];

    $query = "select email, password from users where `username` = ?";
    $stmt = preparedQuery($connection, $query, [&$username]);
    mysqli_stmt_bind_result($stmt, $emailDB, $passwordDB);
    mysqli_stmt_fetch($stmt);
    mysqli_stmt_close($stmt);
    if ($emailDB != '') {
        if (password_verify($password, $passwordDB) && $email == $emailDB) {
            echo 'You are already registered!';
        }
        else if ($emailDB == $email) {
            echo 'The username and the email are already taken!';
        }
        else {
            echo 'The username is already taken!';
        }
    }
    else {
        $query = "select id from users where `email` = ?";
        $stmt = preparedQuery($connection, $query, [&$email]);
        mysqli_stmt_bind_result($stmt, $id);
        mysqli_stmt_fetch($stmt);
        mysqli_stmt_close($stmt);
        if ($id != '') {
            echo 'The email is already taken!';
        }
        else {
            $verificationCode = rand(10000000, 99999999);
            $subject = 'Verification of registration';
            $message = "Your verification code is $verificationCode.";
            sendLetter($email, $subject, $message);

            session_start();
            $_SESSION['registrationFirstName'] = $firstName;
            $_SESSION['registrationLastName'] = $lastName;
            $_SESSION['registrationEmail'] = $email;
            $_SESSION['registrationUsername'] = $username;
            $_SESSION['registrationPassword'] = password_hash($password, PASSWORD_DEFAULT);
            $_SESSION['registrationVerificationCode'] = $verificationCode;

            echo true;
        }
    }
    mysqli_close($connection);
}
else {
    echo 'POST is empty!';
}