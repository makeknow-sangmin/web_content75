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

    $leaf = $obj->leaf ? 1 : 0;
    $parentID = $obj->parentId ? $obj->parentId : 'NULL';
    $duration = intval($obj->Duration ? $obj->Duration : 0);

    $q = 'insert into tasks (Name, StartDate, EndDate, leaf, Duration, DurationUnit, PercentDone, Cls, parentId, PhantomId, PhantomParentId)
    values ("'.$obj->Name.'", "'.$obj->StartDate.'", "'.$obj->EndDate.'", '.$leaf.',
        '.$duration.', "'.$obj->DurationUnit.'", "'.$obj->PercentDone.'", "'.$obj->Cls.'",
        '.$parentID.', "'.$obj->PhantomId.'", "'.$obj->PhantomParentId.'")';
    $r = mysql_query($q);
    if (!$r) die('{"success": false, "error": "'.db_error($q).'"}');

	$obj->{'Id'} = mysql_insert_id();
}

echo json_encode($array);
