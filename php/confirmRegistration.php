<?php
if (!empty($_POST)) {
    require('./initial.php');
    session_start();
    $userInput = $_POST['userInput'];
    if ($userInput == $_SESSION['registrationVerificationCode']) {
        $firstName = $_SESSION['registrationFirstName'];
        $lastName = $_SESSION['registrationLastName'];
        $email = $_SESSION['registrationEmail'];
        $username = $_SESSION['registrationUsername'];
        $password = $_SESSION['registrationPassword'];
        $token = bin2hex(random_bytes(64));
        session_destroy();
        $query = "select id from users order by id desc limit 1";
        $rows = mysqli_fetch_row(query($connection, $query));
        if ($rows[0] == "") {
            $id = 1;
        }
        else {
            $id = ++$rows[0];
        }

        $query = "insert into `users` (`id`, `firstName`, `lastName`, `email`, `username`, `password`, `token`) values (?, ?, ?, ?, ?, ?, ?)";
        $stmt = preparedQuery($connection, $query, [&$id, &$firstName, &$lastName, &$email, &$username, &$password, &$token]);
        mysqli_stmt_close($stmt);

        mysqli_close($connection);
        echo true;
    }
    else {
        echo false;
    }
}
else {
    echo 'POST is empty!';
}