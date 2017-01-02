package com.seoo.dao;

import com.seoo.pojo.TblCommonUser;

public interface UserDealDao {
	public TblCommonUser queryUser(String userId);
	public void save(TblCommonUser user);
}
