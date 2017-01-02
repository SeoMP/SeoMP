package com.seoo.listener;

import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import org.apache.log4j.Logger;

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
		logger.info("=============session销毁=============");
	}

}
