<?php
require('./initial.php');
session_start();
if (isset($_SESSION['id'])) {
    $id = $_SESSION['id'];
    $query = "select id, firstName, lastName from users where `id` != '$id'";
    $queryResult = query($connection, $query);
    $result = [];
    while($rows = mysqli_fetch_assoc($queryResult)) {
        $result[] = $rows;
    }
    $result = json_encode($result);
    echo $result;
}
else {
    session_destroy();
    echo false;
}
mysqli_close($connection);