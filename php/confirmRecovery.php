<?php
if (!empty($_POST)) {
    require('./initial.php');
    session_start();
    $userInput = $_POST['userInput'];
    if ($userInput == $_SESSION['recoveryVerificationCode']) {
        unset($_SESSION['recoveryVerificationCode']);
        $_SESSION['setNewPassword'] = true;
        echo true;
    }
    else {
        echo false;
    }
    mysqli_close($connection);
}
else {
    echo 'POST is empty!';
}