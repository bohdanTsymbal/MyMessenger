<?php
if (!empty($_POST)) {
    require("./original.php");
    $username = $_POST['username'];
    $query = "select email, id from users where `username` = '$username'";
    $rows = mysqli_fetch_row(query($connection, $query));
    if ($rows[0] != '') {
        $subject = 'Verification of password recovery';
        $verificationCode = rand(10000000, 99999999);
        $message = "Your verification code is $verificationCode.";
        sendLetter($rows[0], $subject, $message);

        session_start();
        $_SESSION['recoveryVerificationCode'] = $verificationCode;
        $_SESSION['recoveryUserId'] = $rows[1];

        echo true;
    }
    else {
        echo 'The user with this username does not exist!';
    }
    mysqli_close($connection);
}
