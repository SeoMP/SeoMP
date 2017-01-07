package com.seoo.listener;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import org.apache.log4j.Logger;
import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.seoo.service.UserDealService;
import com.seoo.service.impl.UserDealServiceImpl;

public class SessionManageListener implements HttpSessionListener {
	private static final Logger logger = Logger.getLogger(SessionManageListener.class);
	@Override
	public void sessionCreated(HttpSessionEvent arg0) {
		// TODO Auto-generated method stub
		logger.info("session生成"+arg0.getSession().getId());
	}

	@Override
	public void sessionDestroyed(HttpSessionEvent arg0) {
		// TODO Auto-generated method stub
		logger.error("=============session销毁=============");
		//记录当前操作员登出记录
		ServletContext context = arg0.getSession().getServletContext();
		ApplicationContext spring = WebApplicationContextUtils.getWebApplicationContext(context);
		UserDealService biz = spring.getBean("userDealBiz",UserDealServiceImpl.class);
		biz.saveLoginOutRecord();
	}

}
