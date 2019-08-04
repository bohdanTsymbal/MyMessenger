<?php
require('./original.php');
session_start();
if (isset($_SESSION['id'])) {
    echo true;
}
else {
    session_destroy();
    echo false;
}