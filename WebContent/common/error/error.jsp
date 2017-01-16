<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@page import="java.lang.Throwable,java.lang.String" %>
<% Throwable throwable = (Throwable)request.getAttribute("javax.servlet.error.exception"); 
	String errorMsg = throwable.getMessage();
%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title></title>
<%-- <script type="text/javascript" src="<%=request.getContextPath() %>/common/core.js"></script> --%>
</head>
<body>
	<div id="error" style="color:red;font-size:20px;text-align:center;">
		<%=throwable.toString() %>
	</div>
	
</body>
</html>