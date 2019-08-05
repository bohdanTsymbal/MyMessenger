<?php
require('./original.php');
session_start();
if (isset($_SESSION['registrationVerificationCode'])) {
    echo true;
}
else {
    session_destroy();
    echo false;
}
mysqli_close($connection);