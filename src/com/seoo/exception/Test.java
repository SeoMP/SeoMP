package com.seoo.exception;
import java.lang.reflect.Method;
import java.util.Properties;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.BasicConfigurator;
import org.apache.log4j.Logger;
import org.apache.log4j.PropertyConfigurator;
import org.springframework.transaction.interceptor.TransactionAttribute;
import org.springframework.transaction.interceptor.TransactionInterceptor;

import com.seoo.service.impl.UserDealServiceImpl;

public class Test {
	static{
		BasicConfigurator.configure();
		PropertyConfigurator.configure("src/config/log4j.properties");
	}
	private static final Logger log = Logger.getLogger(Test.class);
	public static void main(String[] args) throws Exception{
		// TODO Auto-generated method stub
		try {
			te("");
		} catch (WebException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		/*String c = "d*";
		System.out.println(c.codePointAt(c.length()-1));*/
		//Constants constants = new Constants(Serializable.class);
		//System.out.println(JSONObject.toJSONString(constants.getFieldCache()));
		Throwable ex = new NumberFormatException();
		log.info("针对异常"+ex.getClass().getName()+"，是否需要回滚："+isRollBackOn(ex));
		/*System.out.println(ex.getClass().getName());*/
	}

	private static void te(String str) throws CommonException{
		if(StringUtils.isBlank(str))
			throw new CommonException("登录模块","LG001","登录失败！");
	}
	
	public static boolean isRollBackOn(Throwable ex) throws Exception{
		Method method = UserDealServiceImpl.class.getMethod("saveOneUser");
		Class<?> targetClass = UserDealServiceImpl.class;
		Properties pro = new Properties();
		pro.setProperty("save*","PROPAGATION_REQUIRED,ISOLATION_READ_COMMITTED,timeout_10,+java.lang.NumberFormatException");
		pro.setProperty("delete*","PROPAGATION_REQUIRED,ISOLATION_DEFAULT,timeout_10,-java.lang.Exception");
		TransactionInterceptor interceptor = new TransactionInterceptor();
		interceptor.setTransactionAttributes(pro);
		/*Method specificMethod = ClassUtils.getMostSpecificMethod(method, targetClass);
		String joinpointIdentification = ClassUtils.getQualifiedMethodName(specificMethod);
		System.out.println(joinpointIdentification);*/
		TransactionAttribute txAttr = interceptor.getTransactionAttributeSource().getTransactionAttribute(method,targetClass);
		if(txAttr == null){
			log.info("txAttr is null");
			return false;
		}
		return txAttr.rollbackOn(ex);
	}
	
}
