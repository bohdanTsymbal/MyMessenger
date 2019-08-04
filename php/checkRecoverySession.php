<?php
require('./original.php');
session_start();
if (isset($_SESSION['recoveryVerificationCode'])) {
    echo true;
}
else {
    session_destroy();
    echo false;
}
