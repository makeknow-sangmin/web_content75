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

    $q = 'insert into assignments set TaskId = '.$obj->TaskId.', ResourceId = '.$obj->ResourceId.', Units = '.$obj->Units;
    $r = mysql_query($q);
    if (!$r) die('{"success": false, "error": "'.db_error($q).'"}');

    $obj->Id = mysql_insert_id();
}

echo json_encode($array);
