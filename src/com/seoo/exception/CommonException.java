package com.seoo.exception;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

public class CommonException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String moduleName = "COMMON";
	private String key;
	private String errorMsg;
	
	public CommonException(){}
	
	public CommonException(String key,String errorMsg){
		super(errorMsg);
		this.key = key;
		this.errorMsg = errorMsg;
	}
	
	public CommonException(String moduleCode,String key,String errorMsg){
		super(errorMsg);
		this.key = key;
		this.errorMsg = errorMsg;
		this.moduleName = moduleCode;
	}
	
	public CommonException(String errorMsg){
		super(errorMsg);
		this.errorMsg = errorMsg;
	}
	
	public CommonException(String arg0, Throwable arg1) {
		super(arg0, arg1);
		this.errorMsg = arg0;
	}
	
	public CommonException(Throwable arg0) {
		super(arg0);
	}

	public String message(){
		return 	new
				ToStringBuilder(this,
				ToStringStyle.SHORT_PREFIX_STYLE,
				new StringBuffer(16))
				.append("moduleName",this.moduleName)
				.append("key",this.key)
				.append("errorMsg",getMessage())
				.toString();
	}
	
	public String toString(){
		return this.message();
	}
	
	public String getModuleName() {
		return moduleName;
	}

	public void setModuleName(String moduleName) {
		this.moduleName = moduleName;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public String geterrorMsg() {
		return errorMsg;
	}

	public void seterrorMsg(String errorMsg) {
		this.errorMsg = errorMsg;
	}
}
