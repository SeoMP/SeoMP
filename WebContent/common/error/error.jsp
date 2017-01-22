<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@page import="java.lang.Throwable,java.lang.String,com.seoo.exception.*,com.seoo.util.ComUtil" %>
<% Throwable throwable = (Throwable)request.getAttribute("javax.servlet.error.exception"); 
	String errorMsg = "";
	if(throwable instanceof WebException){
		errorMsg = ComUtil.exMsgConvert(throwable.toString());
	}else{
		errorMsg = "平台异常："+throwable.getMessage();
	}
	out.print("<div style='color:red;font-size:15px;'>"+errorMsg+"</div>");
%>
