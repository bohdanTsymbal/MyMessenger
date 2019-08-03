<?php
function query($connection, $query) {
    for ($i = 0; $i < count($query); $i++) {
        $result[$i] = mysqli_query($connection, $query[$i]);
	    if(!$result[$i]) {
            die(mysqli_error($connection));
        }
    }
	return $result;
}
// $location = "localhost";
// $user = "id10206965_root";
// $password = "09012004";
// $database = "id10206965_mymessangerdatabase";
$location = "localhost";
$user = "root";
$password = "";
$database = "mymessengerdatabase";
$connection = mysqli_connect($location, $user, $password);
if (!$connection) {
	die("Connection has been completed unsuccefully!");
}
$queries = array(
    "drop database if exists $database",
    "create database if not exists $database"
);
query($connection, $queries);
$databaseSelection = mysqli_select_db($connection, $database);
if (!$databaseSelection) {
	die(mysqli_error($connection));
}
$queries = array(
    "create table if not exists users (id tinyint unsigned not null primary key, firstName tinyblob not null, lastName tinyblob not null, email tinyblob not null, username tinyblob not null, password tinyblob not null) engine=innodb character set utf8",
    "create table if not exists messages (id tinyint unsigned not null primary key, message blob not null, fromUser tinyint unsigned not null, toUser tinyint unsigned not null, foreign key (fromUser) references users (id) on delete cascade, foreign key (toUser) references users (id) on delete cascade) engine=innodb character set utf8"
);
query($connection, $queries);
mysqli_close($connection);