package com.seoo.dao.impl;

import com.seoo.dao.BaseDaoSupport;
import com.seoo.dao.UserDealDao;
import com.seoo.pojo.TblCommonUser;

public class UserDealDaoImpl extends BaseDaoSupport implements UserDealDao {

	@Override
	public TblCommonUser queryUser(String userId) {
		// TODO Auto-generated method stub
		return this.getHibernateTemplate().get(TblCommonUser.class,userId);
	}

	@Override
	public void save(TblCommonUser user) {
		// TODO Auto-generated method stub
		this.getHibernateTemplate().save(user);
	}
	
}
