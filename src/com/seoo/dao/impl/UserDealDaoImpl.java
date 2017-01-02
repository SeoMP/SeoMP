package com.seoo.dao.impl;

import java.util.List;
import java.util.Map;

import com.seoo.dao.BaseDaoSupport;
import com.seoo.dao.UserDealDao;
import com.seoo.pojo.TblCommonUser;

public class UserDealDaoImpl extends BaseDaoSupport implements UserDealDao {

	@Override
	public List<?> queryUsers(Map<String, Object> params) {
		// TODO Auto-generated method stub
		
		return null;
	}

	@Override
	public void save(TblCommonUser user) {
		// TODO Auto-generated method stub
		this.getHibernateTemplate().save(user);
	}
	
}
