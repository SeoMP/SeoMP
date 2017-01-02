package com.seoo.service.impl;

import java.util.Map;

import org.apache.log4j.Logger;

import com.seoo.action.LoginDealAction;
import com.seoo.dao.UserDealDao;
import com.seoo.exception.CommonException;
import com.seoo.pojo.TblCommonUser;
import com.seoo.service.UserDealService;

public class UserDealServiceImpl implements UserDealService {
	private static final Logger log = Logger.getLogger(LoginDealAction.class);
	private UserDealDao dao;
	@Override
	public String loginDeal(Map<String, Object> params) {
		// TODO Auto-generated method stub
		
		return null;
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
