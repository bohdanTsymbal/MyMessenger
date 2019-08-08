<?php
// $location = "localhost";
// $user = "id10379526_root";
// $password = "09012004";
// $database = "id10379526_mymessengerdatabase";
$location = 'localhost';
$user = 'root';
$password = '';
$database = 'mymessengerdatabase';
$connection = mysqli_connect($location, $user, $password);

if (!$connection) {
    die('Connection has been completed unsuccefully!');
}
$databaseSelection = mysqli_select_db($connection, $database);

if (!$databaseSelection) {
	die(mysqli_error($connection));
}

function query($connection, $query) {
    $result = mysqli_query($connection, $query);
	if (!$result) {
        die(mysqli_error($connection));
    }
	return $result;
}

function sendLetter($to, $subject, $message) {
    $headers = "From: mymessengerinc@gmail.com\r\n";
    $headers .='X-Mailer: PHP/'.phpversion();
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=iso-8859-1\r\n";
	mail($to, $subject, $message, $headers);
}

ini_set('session.save_path', '../session');
ini_set('session.gc_probability', '0');
ini_set('session.gc_maxlifetime', '86400');