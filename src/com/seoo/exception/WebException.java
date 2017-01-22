package com.seoo.exception;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

public class WebException extends Exception {
	private static final long serialVersionUID = 1L;
	protected String moduleName;
	protected String key;
	protected String errorMsg;
	
	public WebException(){}
	
	public WebException(String key,String errorMsg){
		super(errorMsg);
		this.key = key;
		this.errorMsg = errorMsg;
	}
	
	public WebException(String moduleCode,String key,String errorMsg){
		super(errorMsg);
		this.key = key;
		this.errorMsg = errorMsg;
		this.moduleName = moduleCode;
	}
	
	public WebException(String errorMsg){
		super(errorMsg);
		this.errorMsg = errorMsg;
	}
	
	public WebException(String arg0, Throwable arg1) {
		super(arg0, arg1);
		this.errorMsg = arg0;
	}
	
	public WebException(Throwable arg0) {
		super(arg0);
	}
	
	protected void defaultDeal(){
		if(StringUtils.isBlank(this.moduleName)) this.moduleName = "公共模块";
		if(StringUtils.isBlank(this.key)) this.key = "9999";
		if(StringUtils.isBlank(super.getMessage())) this.errorMsg = "平台异常！";
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

	public String getErrorMsg() {
		return errorMsg;
	}

	public void setErrorMsg(String errorMsg) {
		this.errorMsg = errorMsg;
	}
	
	public String toString(){
		defaultDeal();
		return 	new
				ToStringBuilder(this,
				ToStringStyle.SHORT_PREFIX_STYLE,
				new StringBuffer(16))
				.append("moduleName",this.moduleName)
				.append("key",this.key)
				.append("errorMsg",this.errorMsg)
				.toString();
	}
}
