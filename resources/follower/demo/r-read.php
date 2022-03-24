<?php

include "template.php";

//first get the parents
$q = 'SELECT * FROM resources';
$r = mysql_query($q);
$rows = array();
while($e = mysql_fetch_assoc($r)) {
    $rows[] = $e;
}
echo json_encode($rows);