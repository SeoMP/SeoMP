package com.seoo.service;

import java.util.Map;

import com.seoo.exception.CommonException;

public interface UserDealService {
	public void loginDeal(Map<String,String> loginParam) throws CommonException;
	public void saveOneUser() throws CommonException;
	public void saveLoginOutRecord();
}
