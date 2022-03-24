<?php

include "template.php";

if (get_magic_quotes_gpc()) {
    $array = stripslashes($_POST['data']);
} else {
    $array = $_POST['data'];
}
$array = json_decode($array);

for ($i = 0, $l = sizeof($array); $i < $l; $i++) {
    $obj = $array[$i];

    $q = 'delete from assignments where Id = '.$obj->Id;

    $r = mysql_query($q);
    if (!$r) die('{"success": false, "error": "'.db_error($q).'"}');
}

echo json_encode($array);
