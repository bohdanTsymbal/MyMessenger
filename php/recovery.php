<?php
require("./original.php");
$username = $_POST['username'];
$query = "select email, id from users where `username` = '$username'";
$rows = mysqli_fetch_row(query($connection, $query));
if ($rows[0] != '') {
    $subject = 'Verification of password recovery';
    $verificationCode = rand(10000000, 99999999);
    $message = "Your verification code is $verificationCode.";
    sendLetter($rows[0], $subject, $message);
    $output = array(
        'code' => $verificationCode,
        'id' => $rows[1]
    );
    $output = json_encode($output);
    echo $output;
}
else {
    echo 'The user with this username does not exist!';
}
mysqli_close($connection);