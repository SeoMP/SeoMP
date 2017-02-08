package com.seoo.exception;
import java.lang.reflect.Method;
import java.security.SecureRandom;
import java.util.Calendar;
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
		/*try {
			te("");
		} catch (WebException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		String c = "d*";
		System.out.println(c.codePointAt(c.length()-1));
		//Constants constants = new Constants(Serializable.class);
		//System.out.println(JSONObject.toJSONString(constants.getFieldCache()));
		Throwable ex = new NumberFormatException();
		log.info("针对异常"+ex.getClass().getName()+"，是否需要回滚："+isRollBackOn(ex));*/
		/*System.out.println(ex.getClass().getName());*/
		SecureRandom numberGenerator=new SecureRandom();
		byte[] random = new byte[7];
		numberGenerator.nextBytes(random);
		for(byte b:random){
			System.out.println(b);
		}
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
	
	public static String newGuid20() {  
        String str1 = "";  
        String[] strArr36 = { "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",  
                "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l",  
                "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x",  
                "y", "z" };  
        Calendar cal = Calendar.getInstance();  
        int yy = cal.get(Calendar.YEAR);  
        int mm = cal.get(Calendar.MONTH) + 1;  
        int dd = cal.get(Calendar.DAY_OF_MONTH);  
        yy = (yy % 100) % 36;  
        int hh = 100 + cal.get(Calendar.HOUR);  
        ;  
        int mins = 100 + cal.get(Calendar.MINUTE);  
        int sec = 100 + cal.get(Calendar.SECOND);  
        String hhstr = ("" + hh).substring(1);  
        String minsStr = ("" + mins).substring(1);  
        String secStr = ("" + sec).substring(1);  
  
        str1 = strArr36[yy] + strArr36[mm] + strArr36[dd] + hhstr + minsStr  
                + secStr;  
        StringBuilder sb = new StringBuilder("");  
        for (int i = 0; i < 11; i++) {  
            int k = (int) (Math.random() * 35);  
            sb.append(strArr36[k]);  
        }  
        str1 = str1 + sb.toString();  
        return str1;  
    }  
	
	
}
