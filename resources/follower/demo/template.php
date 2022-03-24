<?php
//4hrs
ini_set('session.gc_maxlifetime', 14400);

//define for MYSQL database connection
define ('DBHOST', '');
define ('DBUSERNAME', '');
define ('DBUSERPASSWORD', '');
define ('DEFAULT_DBNAME', '');

//mysql database connection
require 'mysql-connect.php';

if (!session_id()) session_start();

function DB_Error($query = '') {
    return 'MySQL Error #'. mysql_errno() .' - '. mysql_error() .', '. ($query ? 'SQL Query: '.$query : '');
}
