<?php

include "template.php";

if (get_magic_quotes_gpc()) {
    $array = stripslashes($_POST['data']);
} else {
    $array = $_POST['data'];
}
$array = json_decode($array, true);

for ($i = 0, $l = sizeof($array); $i < $l; $i++) {
    $obj = $array[$i];

    if ($obj['From'] && $obj['To']) {
        $q = 'insert into dependencies set
            `From` = '.$obj['From'].',
            `To` = '.$obj['To'].',
            `Type` = '.$obj['Type'].',
            `Cls` = \''.$obj['Cls'].'\',
            `Lag` = \''.$obj['Lag'].'\'';
        $r = mysql_query($q);
        if (!$r) die('{"success": false, "error": "'.db_error($q).'"}');

        $obj['Id'] = mysql_insert_id();
    }
}

echo json_encode($array);
