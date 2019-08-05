<?php
require('./original.php');
session_start();
if (isset($_SESSION['setNewPassword'])) {
    unset($_SESSION['setNewPassword']);
    echo true;
}
else {
    session_destroy();
    echo false;
}
mysqli_close($connection);