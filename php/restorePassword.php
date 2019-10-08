<?php
if (!empty($_POST)) {
    require("./initial.php");
    $username = $_POST['username'];
    
    $query = "select email, id from users where `username` = ?";
    $stmt = preparedQuery($connection, $query, [&$username]);
    mysqli_stmt_bind_result($stmt, $email, $id);
    mysqli_stmt_fetch($stmt);
    mysqli_stmt_close($stmt);
    if ($email != '') {
        $subject = 'Verification of password recovery';
        $verificationCode = rand(10000000, 99999999);
        $message = "Your verification code is $verificationCode.";
        sendLetter($email, $subject, $message);

        session_start();
        $_SESSION['recoveryVerificationCode'] = $verificationCode;
        $_SESSION['recoveryUserId'] = $id;

        echo true;
    }
    else {
        echo 'The user with this username does not exist!';
    }
    mysqli_close($connection);
}
else {
    echo 'POST is empty!';
}
