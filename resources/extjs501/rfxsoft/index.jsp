<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%request.setCharacterEncoding("UTF-8"); %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="x" uri="http://java.sun.com/jsp/jstl/xml" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="sql" uri="http://java.sun.com/jsp/jstl/sql" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>



<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html manifest="">
  <head>

    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta charset="UTF-8">

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

    <title>Request for Everything(*)</title>
<link rel="shortcut icon" href="${pageContext.request.contextPath}/icon/magicplm2.ico" />
<script type="text/javascript" src="${pageContext.request.contextPath}/js/util/versionCheck.js" ></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/common/commonUtil.js" ></script>
<script type="text/javascript">
var CONTEXT_PATH ='${pageContext.request.contextPath}';

	var G_MODE = '${MainVo.bypass1}';//EDIT:수정모드

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
    var/*GLOBAL*/vCUR_USERTYPE_STR =  '${MainVo.this_user_type_str}';
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
	  try { console.log(s); } catch (e) {  }
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
    <!-- The line below must be kept intact for Sencha Cmd to build your application -->
    <script id="microloader" type="text/javascript" src="bootstrap.js"></script>
</head>
<body></body>
</html>
