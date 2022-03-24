<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page errorPage="/view/jsp/common/error/error.jsp"%>
<% request.setCharacterEncoding("UTF-8") ; %><% String rfxshare= (String) request.getAttribute("rfxshare"); %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="x" uri="http://java.sun.com/jsp/jstl/xml" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="sql" uri="http://java.sun.com/jsp/jstl/sql" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>



<!DOCTYPE HTML>
<html>
<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=9" >
	<title>Project Gantt View</title>
	<script type="text/javascript" src="${pageContext.request.contextPath}/js/util/versionCheck.js" ></script>
	<script type="text/javascript">var G_RFXSHARE='<%= rfxshare%>';</script>
	<script type="text/javascript">
		var CONTEXT_PATH ='${pageContext.request.contextPath}';
		var PJ_UID = '${ganttRange.pj_uid}';
		var GANTT_START = '${ganttRange.projectStartDate}';
		var GANTT_END = '${ganttRange.projectEndDate}';

		if(consoleCheck()==false) {
			console = window.console || {log:function() {}}; // IE8이하일경우
			//alert('console checked');
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
	</script>
    <!--Ext and ux styles -->
    <link href='${rfxshare}/ext-4.2.2.1144/resources/css/ext-all.css' rel="stylesheet" type="text/css" />

	<!--Gantt styles-->
    <link href="${rfxshare}/gantt-2.2.25/resources/css/sch-gantt-all.css" rel="stylesheet" type="text/css" />

    <!--Scheduler styles-->
    <link href="${rfxshare}/gantt-2.2.25/resources/css/sch-all.css" rel="stylesheet" type="text/css" />

	<!--Implementation specific styles-->
    <link href="${pageContext.request.contextPath}/statistics/gantt/resources/css/gantt-scheduler.css" rel="stylesheet" type="text/css" />
    <link href="${pageContext.request.contextPath}/statistics/gantt/resources/css/style.css" rel="stylesheet" type="text/css" />
    <!--[if lte IE 7]><script src="lte-ie7.js"></script><![endif]-->

    <!--Ext lib and UX components-->
    <script src="${rfxshare}/ext-4.2.2.1144/ext-all.js" type="text/javascript"></script>
    <script src="${rfxshare}/ext-4.2.2.1144/locale/ext-lang-ko.js" type="text/javascript"></script>
    <!--Scheduler JS files -->
    <script src="${rfxshare}/scheduler-2.2.25/sch-all.js" type="text/javascript"></script>

    <!--Gantt JS files -->
    <script src="${rfxshare}/gantt-2.2.25/gnt-all.js" type="text/javascript"></script>

	<!-- Common Files -->
	<script type="text/javascript" src="${pageContext.request.contextPath}/js/common/extjsUtil.js"></script>

    <!--Application files-->
    <script src="${rfxshare}/gantt-2.2.25/examples/examples-shared.js" type="text/javascript"></script>
     <script type="text/javascript">
     	Ext.Loader.setConfig({
     	    enabled: true,
     	    paths: {
     	    	'Ext.app': '${pageContext.request.contextPath}/statistics/gantt',
     	    	'MyApp': CONTEXT_PATH + '/statistics/gantt/app',
     	        'Mplm': CONTEXT_PATH + '/mplm/'
     	    }
     	});
     	
     	Ext.define('ModalWindow', {
     		 extend: 'Ext.window.Window',
     	    layout: {
     	        type: 'border',
     	        padding: 0
     	    },
     	    modal:true,
     	    plain:true
     	});

        //Ext.Loader.setPath('MyApp', '${pageContext.request.contextPath}/statistics/gantt');
    </script>
    
    <script src="${pageContext.request.contextPath}/statistics/gantt/app.js" type="text/javascript"></script>

    <title>Gantt and Scheduler demo</title>
</head>

<body>
</body>
</html>
