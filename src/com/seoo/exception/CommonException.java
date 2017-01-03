package com.seoo.exception;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

public class CommonException extends WebException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	public CommonException(){}
	
	public CommonException(String key,String errorMsg){
		super(key,errorMsg);
	}
	
	public CommonException(String moduleCode,String key,String errorMsg){
		super(moduleCode, key, errorMsg);
	}
	
	public CommonException(String errorMsg){
		super(errorMsg);
	}
	
	public CommonException(String arg0, Throwable arg1) {
		super(arg0, arg1);
	}
	
	public CommonException(Throwable arg0) {
		super(arg0);
	}

	public String message(){
		super.defaultDeal();
		return 	new
				ToStringBuilder(this,
				ToStringStyle.SHORT_PREFIX_STYLE,
				new StringBuffer(16))
				.append("moduleName",this.moduleName)
				.append("key",this.key)
				.append("errorMsg",this.errorMsg)
				.toString();
	}
	
	public String toString(){
		return this.message();
	}
}
