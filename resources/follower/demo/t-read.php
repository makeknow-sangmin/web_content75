<?php

include 'template.php';

$tasks = array();
$byParent = array();

$r = mysql_query('select * from tasks');

while ($e = mysql_fetch_assoc($r)) {
    $e['Id']            = intval($e['Id']);
    if ($e['parentId']) $e['parentId'] = intval($e['parentId']);
    $e['Duration']      = floatval($e['Duration']);
    $e['PercentDone']   = floatval($e['PercentDone']);

    $tasks[$e['Id']]    = $e;

    $parentId = $e['parentId'] ? $e['parentId'] : 'root';
    if (!isset($byParent[$parentId])) $byParent[$parentId] = array();

    $byParent[$parentId][] = $e;
}

function buildTree($parentId = 'root') {
    global $byParent;

    $result = array();

    // get child tasks of specified parent
    if ($tasks = @$byParent[$parentId]) {
        foreach ($tasks as $v) {
            if ($children = buildTree($v['Id'])) {
                $v['children'] = $children;
                $v['leaf'] = false;
            } else {
                $v['leaf'] = true;
            }
            $result[] = $v;
        }

        return $result;
    }

    return $parentId == 'root' ? $result : false;
}

echo json_encode(buildTree());
