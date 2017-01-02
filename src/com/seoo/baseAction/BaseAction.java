package com.seoo.baseAction;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.struts2.ServletActionContext;

import com.opensymphony.xwork2.ActionSupport;

public class BaseAction extends ActionSupport {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	protected HttpServletRequest request;
	protected HttpServletResponse response;
	protected HttpSession httpSession;
	protected ServletContext servletContext;
	protected void init(){
		request = ServletActionContext.getRequest();
		response = ServletActionContext.getResponse();
		httpSession = request.getSession();
		servletContext = ServletActionContext.getServletContext();
	}
}

