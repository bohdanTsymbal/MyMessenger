<?php
if (!empty($_POST)) {
    require('./original.php');
    $requestedInfo = $_POST['requestedInfo'];
    session_start();
    if (isset($_SESSION['id'])) {
        echo $_SESSION[$requestedInfo];
    }
    else {
        echo false;
    }
    mysqli_close($connection);
}