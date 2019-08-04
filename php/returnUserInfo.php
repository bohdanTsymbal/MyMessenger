<?php
if (!empty($_POST)) {
    require('./original.php');
    $requestedInfo = $_POST['requestedInfo'];
    session_start();
    echo $_SESSION[$requestedInfo];
}