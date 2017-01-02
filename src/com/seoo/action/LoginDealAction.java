package com.seoo.action;
import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;

import com.alibaba.fastjson.JSONObject;
import com.seoo.baseAction.BaseAction;
import com.seoo.exception.CommonException;
import com.seoo.service.UserDealService;

public class LoginDealAction extends BaseAction{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private static final Logger log = Logger.getLogger(LoginDealAction.class);
	private UserDealService userBiz;

	public void login(){
		super.init();
		Map<String,String>  param = new HashMap<String,String>();
		param.put("account",request.getParameter("userId"));
		param.put("password",request.getParameter("password"));
		param.put("validCode",request.getParameter("validCode"));
		param.put("correctCode", (String)httpSession.getAttribute("verifiCode"));
		if(log.isInfoEnabled())log.info("参数："+JSONObject.toJSONString(param));
		try {
			userBiz.loginDeal(param);
		} catch (CommonException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public UserDealService getUserBiz() {
		return userBiz;
	}

	public void setUserBiz(UserDealService userBiz) {
		this.userBiz = userBiz;
	}
}
