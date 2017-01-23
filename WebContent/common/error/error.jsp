<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@page import="java.lang.Throwable,java.lang.String,com.seoo.exception.*,com.seoo.util.ComUtil,com.alibaba.fastjson.JSONObject" %>
<% Throwable throwable = (Throwable)request.getAttribute("javax.servlet.error.exception"); 
	String errorMsg = "";
	if(throwable instanceof WebException){
		errorMsg = ComUtil.exMsgConvert(throwable.toString());
	}else if(throwable.getCause() instanceof WebException){
		errorMsg = ComUtil.exMsgConvert(throwable.getCause().toString());
	}else{
		errorMsg = "平台异常：<br/>"+throwable.toString();
	}
	//封装异常响应
	JSONObject error = new JSONObject();
	error.put("ECODE","BUSI_ERROR");
	error.put("GLOBALSERNO",request.getHeader("globalSerNo"));//全局流水号
	error.put("EMSG",errorMsg);
	out.print(error.toJSONString());
%>
