package com.seoo.dao;

import java.util.List;
import java.util.Map;

import com.seoo.pojo.TblCommonUser;

public interface UserDealDao {
	public List<?> queryUsers(Map<String,Object> params);
	public void save(TblCommonUser user);
}
