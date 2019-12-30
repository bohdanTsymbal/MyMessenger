<?php
$date = date('c');
$date = substr($date, 0, 10)." ".substr($date, 11, 8);
$result = json_encode($date);
echo $result;