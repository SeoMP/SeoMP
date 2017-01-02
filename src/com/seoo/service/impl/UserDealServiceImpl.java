package com.seoo.service.impl;

import java.util.Map;

import org.apache.commons.lang.StringUtils;

import com.seoo.dao.UserDealDao;
import com.seoo.exception.CommonException;
import com.seoo.pojo.TblCommonUser;
import com.seoo.service.UserDealService;

public class UserDealServiceImpl implements UserDealService {
	//private static final Logger log = Logger.getLogger(LoginDealAction.class);
	private UserDealDao dao;
	@Override
	public void loginDeal(Map<String,String> loginParam) throws CommonException{
		// TODO Auto-generated method stub
		TblCommonUser user = dao.queryUser(loginParam.get("account"));
		if(user == null)
			throw new CommonException("LOGIN","001","输入的用户名不存在！");
		if(!StringUtils.equals(user.getaPassword(),loginParam.get("password")))
			throw new CommonException("LOGIN","002","输入密码错误！");
		if(!StringUtils.equalsIgnoreCase(loginParam.get("validCode"),loginParam.get("captcha")))
			throw new CommonException("LOGIN","003","验证码输入有误！");
	}
	public UserDealDao getDao() {
		return dao;
	}
	public void setDao(UserDealDao dao) {
		this.dao = dao;
	}
	@Override
	public void saveOneUser() throws CommonException {
		// TODO Auto-generated method stub
		TblCommonUser user = new TblCommonUser();
		user.setaLoginId("test002");
		user.setaName("测试");
		user.setaPassword("111");
		user.setaPosition("01");
		user.setaState("1");
		user.setaLevel("4");
		dao.save(user);
	}
}
