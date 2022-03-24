<?php

include "template.php";

//first get the parents
$q = 'select * from assignments';
$r = mysql_query($q);
if (!$r) die('{"success": false, "error": "'.db_error($q).'"}');

$rows = array();
while ($e = mysql_fetch_assoc($r)) {
    $e['Id']            = (int)$e['Id'];
    $e['ResourceId']    = (int)$e['ResourceId'];
    $e['TaskId']        = (int)$e['TaskId'];
    $rows[] = $e;
}

echo json_encode($rows);
