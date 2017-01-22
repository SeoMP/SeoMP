package com.seoo.util;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.Properties;

import org.apache.log4j.Logger;

public class ComUtil {
	  private static Logger logger = Logger.getLogger(ComUtil.class);
	  /**
	   * 非空去空格
	   * @param str 源字符串
	   * @return 处理后字符串
	   */
	  public static String noNullAndTrim(String str){
		 return blankDeal(str,false);
	  }
	  /**
	   * 字符串非空及去空格处理
	   * @param source 源字符串
	   * @param swi 开关：是否对特殊字符null、nan进行判断
	   * @return 处理后的字符串
	   */
	  public static String blankDeal(String source,boolean swi){
		  if(source == null)return "";
		  source = source.trim();
		  if(swi){//是否对特殊字符null、nan进行判断
			  if(source.toUpperCase().equals("NULL"))return "";
			  if(source.toUpperCase().equals("NAN"))return "";
		  }
		  return source;
	  }
	  
	  /**
	   * 是否为空字符串
	   * @param source 源字符串
	   * @return 
	   */
	  public static boolean isBlank(String source){
		  if(source == null)return true;
		  String temp = source.trim();
		  if(temp.length() == 0)return true;
		  return false;
	  }
	  
	  /**
	   * 读取common.properties资源文件中的数据
	   * @param key 要读取的数据对应的键
	   * @return value 属性值
	   */
	  public static String getPropetiesValue(String key){
	    String value = "";
	    //String fileSeparator = System.getProperty("file.separator");//当前操作系统文件分隔符
	    //获取资源文件common.properties输入流
	    ClassLoader loader = ComUtil.class.getClassLoader();//获取类加载器对象
	    InputStream inStream = null;
	    if(loader != null){
	    	inStream = loader.getResourceAsStream("config/common.properties");//读取指定资源的输入流
	    }
	    //读取资源文件common.properties
		if(inStream != null){
			Properties properties = new Properties();
  	      	try {
				properties.load(inStream);//加载common.properties资源文件的数据
				value = properties.getProperty(key);//读取key对应的值
			} catch (IOException e) {
				// TODO Auto-generated catch block
				if(logger.isInfoEnabled()){
					logger.info("资源加载失败>>>>>>>>>"+e.getMessage());
				}
			}finally{
				try {
					inStream.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					if(logger.isInfoEnabled()){
						logger.info("输入流关闭失败>>>>>>>>>"+e.getMessage());
					}
				}
			}	
		}else{
			if(logger.isInfoEnabled()){
				logger.info("--------------------->"+"资源读取失败！"+"<-----------------------");
			}
		}
	    return value;
	  }
	  
	  /**
	   * 字符串转换整数
	   * @param str 源字符串
	   * @return 转换后整数
	   */
	  public static int switchToInt(String str){
		  int ret = 0;
		  str = noNullAndTrim(str);
		  if(str.matches("^-?\\d+$")){
			ret = Integer.parseInt(str);  
		  }
		  return ret;
	  }
	  
	  /**
	   * 判断是否为数字
	   * @param str 源字符串
	   * @return 
	   */
	  public static boolean isNumber(String oristr){
		  oristr = noNullAndTrim(oristr);
		  if(oristr.matches("^-?\\d+(?:\\.\\d+)?$"))return true;
		  return false;
	  }
	  
	  /**
	   * 金额计算，将分转换为元，四舍五入，保留指定位小数
	   * @param amt 金额字符串
	   * @param num 小数位数
	   * @return 处理后金额
	   */
	  public static BigDecimal moneyDeal(String amt,int num){
		  if(!isNumber(amt))return null;
		  //分转元，除以100
		  BigDecimal yuan = new BigDecimal(amt).divide(new BigDecimal("100"));
		  //四舍五入，保留n位小数
		  BigDecimal result = yuan.setScale(num,BigDecimal.ROUND_HALF_UP);
		  return result;
	  }
	  /**
	   * 得到log日志输出格式符
	   * @param num格式符数量
	   * @return 类似：--------->>
	   */
	  public static String getLog(int num){
		  StringBuilder sbu = new StringBuilder();
		  for(int i=0;i<num;i++){
			  sbu.append("-");
		  }
		  sbu.append(">>");
		  return sbu.toString();
	  }
	  
	  /**
	   * 针对公共异常信息进行转换
	   * @param exceptionMsg 异常信息：格式CommonException[moduleName=LOGIN,key=003,errorMsg=验证码输入有误！] 
	   * @return
	   */
	  public static String exMsgConvert(String exceptionMsg){
		StringBuffer sbf = new StringBuffer();
		if(exceptionMsg.contains("[") && exceptionMsg.contains("]")){
			exceptionMsg = exceptionMsg.substring(exceptionMsg.indexOf("[")+1,exceptionMsg.indexOf("]"));
			String[] msgs = exceptionMsg.split(",");
			for(String msg : msgs){
				if(msg.contains("key")){
					sbf.append("错误代码：");
				}else if(msg.contains("errorMsg")){
					sbf.append("详细错误信息：");
				}else{
					continue;
				}
				String[] values = msg.split("=");
				if(values.length == 2){
					sbf.append(values[1]);
				}
				sbf.append("</br>");
			}
		}
		if(isBlank(sbf.toString())){
			sbf.append("平台异常！");
		}
		return sbf.toString();  
	  }
	  
	  public static void main(String[] args){
		  BigDecimal yuan = new BigDecimal("-10.1255").divide(new BigDecimal("1"));
		  //四舍五入，保留n位小数
		  BigDecimal dd = yuan.setScale(7,BigDecimal.ROUND_HALF_UP);
		  System.out.println(dd);
	  }
}
