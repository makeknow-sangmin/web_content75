<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<% request.setCharacterEncoding("UTF-8") ; %><% String rfxshare= (String) request.getAttribute("rfxshare"); %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="x" uri="http://java.sun.com/jsp/jstl/xml" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="sql" uri="http://java.sun.com/jsp/jstl/sql" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>



<!DOCTYPE HTML>
<html manifest="">
  <head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
  	<meta http-equiv="content-type" content="text/html; charset=UTF-8">
<link rel="shortcut icon" href="${pageContext.request.contextPath}/icon/magicplm2.ico" />
<script type="text/javascript" src="${pageContext.request.contextPath}/js/util/versionCheck.js" ></script>
<script type="text/javascript">var G_RFXSHARE='<%= rfxshare%>';</script>
<script type="text/javascript">
var CONTEXT_PATH ='${pageContext.request.contextPath}';

	var/*GLOBAL*/vLANG = '${MainVo.selectedLanguage}';
	var/*GLOBAL*/vLEFT_MENU_ITEMS = null;
	var/*GLOBAL*/vSAMPLE_MODE = false;
	var/*GLOBAL*/vCUR_MENU_CODE =  '${MainVo.selectedMenuId}';
	var/*GLOBAL*/vCUR_MENU_NAME = '${MainVo.selectedMenuName}';
	var/*GLOBAL*/vCUR_GROUP_CODE = '${MainVo.selectedGroupId}';
	var/*GLOBAL*/vCUR_GROUP_NAME = '${MainVo.selectedGroupName}';
	var/*GLOBAL*/vCUR_LINK_PATH = '${MainVo.selectedLinkPath}';
	var/*GLOBAL*/vCUR_MENU_PERM = '${MainVo.selectedMenuPerm}';
	var/*GLOBAL*/vCUR_USER_NAME = '${MainVo.this_user_name}';
	var/*GLOBAL*/vCUR_USER_UID =  '${MainVo.this_user_uid}';
	var/*GLOBAL*/vCUR_USER_ID =  '${MainVo.this_user_id}';
	var/*GLOBAL*/vCUR_EMP_NO =  '${MainVo.this_emp_no}';
	var/*GLOBAL*/vCUR_DEPT_CODE =  '${MainVo.this_dept_code}';
	var/*GLOBAL*/vCUR_DEPT_NAME =  '${MainVo.this_dept_name}';
	var/*GLOBAL*/vCUR_DEPT_UID =  '${MainVo.uidComDst}';
	var/*GLOBAL*/vCUR_POSITION =  '${MainVo.this_position}';
	var/*GLOBAL*/vCUR_EMAIL =  '${MainVo.this_email}';
	var/*GLOBAL*/vCUR_USERTYPE =  "${MainVo.this_user_type}";
	var/*GLOBAL*/vSYSTEM_TYPE =  "${MainVo.systemType}";
	var/*GLOBAL*/vSYSTEM_TYPE_SUB =  "${MainVo.systemTypeSub}";
	var/*GLOBAL*/vCOMAST_UID =  '${MainVo.uidComAst}';
	var/*GLOBAL*/vBARCODE_URL =  '${MainVo.barcode_url}';
	var/*GLOBAL*/vREPORT_SERVER =  '${MainVo.report_server}';
	var/*GLOBAL*/vSEL_PJ_UID =  '${MainVo.selected_pj_uid}';
	var/*GLOBAL*/vCompanyLogoBig =  '${MainVo.companyLogoBig}';
	var/*GLOBAL*/vCompanyLogoSmall =  '${MainVo.companyLogoSmall}';
	var/*GLOBAL*/vCompanyBrand =  '${MainVo.companyBrand}';
	var/*GLOBAL*/vCompanySlogan =  '${MainVo.companySlogan}';
	var/*GLOBAL*/vCompanyBackImage =  '${MainVo.companyBackImage}';
	var/*GLOBAL*/vCompanyReserved1 =  'http://hosu.io/rfxshare/';
	var/*GLOBAL*/vCompanyReserved2 =  '${MainVo.companyReserved2}';
	var/*GLOBAL*/vCompanyReserved3 =  '${MainVo.companyReserved3}';
	var/*GLOBAL*/vCompanyReserved4 =  '${MainVo.companyReserved4}';
	var/*GLOBAL*/vCompanyReserved5 =  '${MainVo.companyReserved5}';
	var TODAY_GLOBAL = new Date();
	//서버의 시간 기중으로 작업하기 위해 서비의 시간을 받는다.
	var date_string =  '${MainVo.server_date_full}';
	var date_array  = date_string.split(",");

	if(date_array.length < 7)
	{
		//alert("<spring:message code="MSG_ALERT.33"/>(" + date_array.length + ")");
	}
	else
	{
		TODAY_GLOBAL.setFullYear(		parseInt(date_array[0])	);
		TODAY_GLOBAL.setMonth(			parseInt(date_array[1])-1	);
		TODAY_GLOBAL.setDate(			parseInt(date_array[2])	);
		TODAY_GLOBAL.setHours(			parseInt(date_array[3])	);
		TODAY_GLOBAL.setMinutes(		parseInt(date_array[4])	);
		TODAY_GLOBAL.setSeconds(		parseInt(date_array[5])	);
		TODAY_GLOBAL.setMilliseconds(	parseInt(date_array[6])	);

	}
	function getLAstDayOfMonth(full_year, month){
	    var lastDay = new Date(full_year, month+1, 0);
	    return lastDay.getDate();		
	}

	
if(consoleCheck()==false) {
	console = window.console || {log:function() {}}; // IE8이하일경우
}

function console_log(s) {
	  try { console.log(s); } catch (e) { }
}
function console_menu(s) {
	  try { console.log(vCUR_MENU_CODE); console.log(s); } catch (e) {   }
}
function console_info(s) {
	  try { console.info(s); } catch (e) {   }
}

function lfn_gotoMain() {
	var url = '${pageContext.request.contextPath}/index/main.do';
	this.location.href=url;	
}
</script>
<style type="text/css">
   
        .value {
            background: none repeat scroll 0 0 rgba(0, 0, 0, 0.1);
            border-radius: 0.15em 0 0 0.15em;
            box-shadow: 1px 0 0 rgba(0, 0, 0, 0.5), 2px 0 0 rgba(255, 255, 255, 0.5);
            float: left;
            font: bold 1.4em/27px Tahoma;
            height: inherit;
            padding-left: 4px;
            padding-right: 4px;
            pointer-events: none;
        }

    </style>

	<!--Ext and ux styles -->
    <link rel="stylesheet" type="text/css" href="${rfxshare}/ext-4.2.2.1144/resources/css/ext-all.css">

	<!--Scheduler styles-->
   <link href="${rfxshare}/scheduler-2.2.25/resources/css/sch-all.css" rel="stylesheet" type="text/css" />
    
	<!--Implementation specific styles-->
    <link href="${rfxshare}/scheduler-2.2.25/examples/css/examples.css" rel="stylesheet" type="text/css" />
    <link href="customheader.css" rel="stylesheet" type="text/css" />
      
	<!--Ext lib and UX components-->
	<script type="text/javascript" src="${rfxshare}/ext-4.2.2.1144/ext-all.js"></script>
    <script type="text/javascript" src="${rfxshare}/ext-4.2.2.1144/locale/ext-lang-ko.js"></script>
     
    <!--Scheduler files-->
    <script src="${rfxshare}/scheduler-2.2.25/sch-all.js" type="text/javascript"></script>
    <!-- Locale -->
    <script src="${rfxshare}/scheduler-2.2.25/js/Sch/locale/En.js" type="text/javascript"></script>

    
    <!--Application files-->
    <script src="${rfxshare}/scheduler-2.2.25/examples/examples-shared.js" type="text/javascript"></script>

<!-- 
    <script src="overallprocess.js" type="text/javascript"></script>
-->
	<script type="text/javascript">
	Ext.Loader.setConfig({
	    enabled: true,
	    paths: {
	        'Mplm': CONTEXT_PATH + '/mplm/'
	    }
	});
	</script>
    <script src="myprocess.js" type="text/javascript"></script>

  </head>
  <body>
    <!-- div id="example-container" / -->
  </body>
</html>
