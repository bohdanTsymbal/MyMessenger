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
    "create table if not exists users (id tinyint not null primary key, firstName tinytext not null, lastName tinytext not null, email tinytext not null, username tinytext not null, password tinytext not null, token tinytext not null) engine=innodb character set utf8",
    "create table if not exists messages (id decimal(65, 0) unsigned not null primary key, message text not null, fromUser tinyint not null, toUser tinyint not null, sendingTime datetime not null, authorId tinyint not null, isDone bool default false, foreign key (fromUser) references users (id) on delete cascade, foreign key (toUser) references users (id) on delete cascade, foreign key (authorId) references users (id) on delete cascade) engine=innodb character set utf8"
);
query($connection, $queries);
mysqli_close($connection);