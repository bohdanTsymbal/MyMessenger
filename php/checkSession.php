<?php
if (!empty($_POST)) {
    require('./initial.php');
    $param = $_POST['param'];
    $unset = $_POST['unset'];
    session_start();
    if (isset($_SESSION[$param])) {
        if ($unset == 1) {
            unset($_SESSION[$param]);
        }
        echo json_encode($_SESSION[$param]);
    }
    else {
        session_destroy();
        echo false;
    }
    mysqli_close($connection);
}
else {
    echo 'POST is empty!';
}