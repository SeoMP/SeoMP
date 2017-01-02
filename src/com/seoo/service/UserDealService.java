package com.seoo.service;

import java.util.Map;

import com.seoo.exception.CommonException;

public interface UserDealService {
	public String loginDeal(Map<String,Object> params);
	public void saveOneUser() throws CommonException;
}
