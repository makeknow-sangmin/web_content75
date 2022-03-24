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
    $duration = $obj->Duration ? intval($obj->Duration) : 0;
    $parentID = $obj->parentId ? $obj->parentId : 'NULL';

    $q = 'update tasks set
        Name = "'.$obj->Name.'",
        StartDate = "'.$obj->StartDate.'",
        EndDate = "'.$obj->EndDate.'",
        Duration = "'.$duration.'",
        DurationUnit = "'.$obj->DurationUnit.'",
        PercentDone = "'.$obj->PercentDone.'",
        Cls = "'.$obj->Cls.'",
        parentId = '.$parentID.',
        PhantomId = "'.$obj->PhantomId.'",
        PhantomParentId = "'.$obj->PhantomParentId.'",
        leaf = '.$leaf.' where Id = '.$obj->Id;

    $r = mysql_query($q);
	if (!$r) die('{"success": false, "error": "'.db_error($q).'"}');
}

echo json_encode($array);
