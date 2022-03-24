<?php

include "template.php";

//first get the parents
$q = 'select * from dependencies';
$r = mysql_query($q);
if (!$r) die('{"success": false, "error": "'.db_error($q).'"}');

$rows = array();
while($e = mysql_fetch_assoc($r)) {
    $e['Id'] = intval($e['Id']);
    $e['From'] = intval($e['From']);
    $e['To'] = intval($e['To']);
    $e['Type'] = intval($e['Type']);
    $e['Lag'] = intval($e['Lag']);
    $rows[] = $e;
}

echo json_encode($rows);
