<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page errorPage="/view/jsp/common/error/error.jsp"%>
<%request.setCharacterEncoding("UTF-8"); %>

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
	<title>Gantt MVC Java Demo</title>
	
	<script type="text/javascript">
		var CONTEXT_PATH ='${pageContext.request.contextPath}';
	
	</script>
    <!--Ext and ux styles -->
    <link href="${pageContext.request.contextPath}/ext-4.2.2.1144/resources/css/ext-all.css" rel="stylesheet" type="text/css" />

	<!--Gantt styles-->
    <link href="${pageContext.request.contextPath}/gantt-2.2.25/resources/css/sch-gantt-all.css" rel="stylesheet" type="text/css" />

    <!--Scheduler styles-->
    <link href="${pageContext.request.contextPath}/gantt-2.2.25/resources/css/sch-all.css" rel="stylesheet" type="text/css" />

    <!--Ext lib and UX components-->
    <script src="${pageContext.request.contextPath}/ext-4.2.2.1144/ext-all.js" type="text/javascript"></script>

    <!--Scheduler JS files -->
    <script src="${pageContext.request.contextPath}/scheduler-2.2.25/sch-all-debug.js" type="text/javascript"></script>

    <!--Gantt JS files -->
    <script src="${pageContext.request.contextPath}/gantt-2.2.25/gnt-all-debug.js" type="text/javascript"></script>
    
    <script type="text/javascript" src="app/app.js"></script>
    
</head>
<body>
</body>
</html>