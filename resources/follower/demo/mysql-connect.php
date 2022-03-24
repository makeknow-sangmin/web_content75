<?php

$link_id = db_connect(DEFAULT_DBNAME);
if (!$link_id) die('{ success: false, error : "Database connecting error" }');

function db_connect($dbname=''){
   global $MYSQL_ERRNO, $MYSQL_ERROR;

   $link_id = mysql_connect(DBHOST, DBUSERNAME, DBUSERPASSWORD);
   if(!$link_id){
      $MYSQL_ERRNO = 0;
      $MYSQL_ERROR = "Connection failed to the host $dbhost.";
      return 0;
   } else if(empty($dbname) && !mysql_select_db(DEFAULT_DBNAME)){
      $MYSQL_ERRNO = mysql_errno();
      $MYSQL_ERROR = mysql_error();
      return 0;
   } else if(!empty($dbname) && !mysql_select_db($dbname)){
      $MYSQL_ERRNO = mysql_errno();
      $MYSQL_ERROR = mysql_error();
      return 0;
   } else
      return $link_id;
}
