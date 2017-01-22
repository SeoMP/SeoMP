package com.seoo.action;
import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.alibaba.fastjson.JSONObject;
import com.seoo.baseAction.BaseAction;
import com.seoo.exception.WebException;
import com.seoo.service.UserDealService;
import com.seoo.service.impl.UserDealServiceImpl;

public class LoginInDealAction extends BaseAction{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private static final Logger log = Logger.getLogger(LoginInDealAction.class);
	private UserDealService userBiz;

	public void login() throws WebException{
		super.init();
		Map<String,String>  param = new HashMap<String,String>();
		param.put("account",request.getParameter("userId"));
		param.put("password",request.getParameter("password"));
		param.put("validCode",request.getParameter("validCode"));
		param.put("captcha", (String)httpSession.getAttribute("captcha"));
		if(log.isInfoEnabled())log.info("参数："+JSONObject.toJSONString(param));
		try {
			userBiz.loginDeal(param);
		} catch (WebException ex) {
			// TODO Auto-generated catch block
			log.error("登录异常！",ex);
			throw ex;
		}
	}

	public UserDealService getUserBiz() {
		return userBiz;
	}

	public void setUserBiz(UserDealService userBiz) {
		this.userBiz = userBiz;
	}
}
