<?php
require('./original.php');
$id = $_POST['id'];
$query = "select id, firstName, lastName from users where `id` != '$id'";
$queryResult = query($connection, $query);
$result = [];
while($rows = mysqli_fetch_assoc($queryResult)) {
    $result[] = $rows;
}
$result = json_encode($result);
echo $result;