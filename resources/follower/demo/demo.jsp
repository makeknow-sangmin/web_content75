<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page errorPage="/view/jsp/common/error/error.jsp"%>
<% request.setCharacterEncoding("UTF-8") ; %><% String rfxshare= (String) request.getAttribute("rfxshare"); %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="x" uri="http://java.sun.com/jsp/jstl/xml" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="sql" uri="http://java.sun.com/jsp/jstl/sql" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>



<!DOCTYPE html>
<html>
<head>
   <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=9" >
	<title>Gantt MVC Java Demo</title>
	<script type="text/javascript">var G_RFXSHARE='<%= rfxshare%>';</script>
	<script type="text/javascript">
		var CONTEXT_PATH ='${pageContext.request.contextPath}';
	
	</script>
    <!--Ext and ux styles -->
    <link href="${rfxshare}/ext-4.2.2.1144/resources/css/ext-all.css" rel="stylesheet" type="text/css" />

	<!--Gantt styles-->
    <link href="${rfxshare}/gantt-2.2.25/resources/css/sch-gantt-all.css" rel="stylesheet" type="text/css" />

    <!--Scheduler styles-->
    <link href="${rfxshare}/gantt-2.2.25/resources/css/sch-all.css" rel="stylesheet" type="text/css" />


    <!--[if lte IE 7]><script src="lte-ie7.js"></script><![endif]-->

    <!--Ext lib and UX components-->
    <script src="${rfxshare}/ext-4.2.2.1144/ext-all.js" type="text/javascript"></script>
    <script src="${rfxshare}/ext-4.2.2.1144/locale/ext-lang-ko.js" type="text/javascript"></script>
    <!--Scheduler JS files -->
    <script src="${rfxshare}/scheduler-2.2.25/sch-all-debug.js" type="text/javascript"></script>

    <!--Gantt JS files -->
    <script src="${rfxshare}/gantt-2.2.25/gnt-all-debug.js" type="text/javascript"></script>

    <!--Application files-->
    <script src="${rfxshare}/gantt-2.2.25/examples/examples-shared.js" type="text/javascript"></script>
    <script src="js/App.js" type="text/javascript"></script>

    <title>Gantt PHP Demo</title>
</head>
<body>
</body>
</html>
