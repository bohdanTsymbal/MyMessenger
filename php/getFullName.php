<?php
if (!empty($_POST)) {
    require('./initial.php');
    $id = $_POST['id'];
    
    $query = "select firstName, lastName from users where `id` = ?";
    $stmt = preparedQuery($connection, $query, [&$id]);
    mysqli_stmt_bind_result($stmt, $firstName, $lastName);
    mysqli_stmt_fetch($stmt);
    mysqli_stmt_close($stmt);

    $result['firstName'] = $firstName;
    $result['lastName'] = $lastName;
    $result = json_encode($result);
    mysqli_close($connection);
    echo $result;
}
else {
    echo 'POST is empty!';
}