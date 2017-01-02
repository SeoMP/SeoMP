package com.seoo.action;
import java.io.IOException;
import java.io.PrintWriter;

import org.apache.log4j.Logger;

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
		PrintWriter write = null;
		try {
			/*ApplicationContext springContext = WebApplicationContextUtils.getWebApplicationContext(servletContext);*/
			//System.out.println("系统变量="+System.getProperty("MP.root"));
			userBiz.saveOneUser();
			write = response.getWriter();
			write.write("Add one user success!");
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (CommonException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally{
			if(write != null)write.close();
		}
	}

	public UserDealService getUserBiz() {
		return userBiz;
	}

	public void setUserBiz(UserDealService userBiz) {
		this.userBiz = userBiz;
	}
}
