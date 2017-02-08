
package com.seoo.util;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateUtil {
	//一天的毫秒值
	public static final long DAYOFMILLIS = 24*60*60*1000;
	//日期常用格式枚举
	private static final String[] DATE_PATTERN = {
		"yyyy-MM-dd","yyyyMMdd","yyyy/MM/dd",
		"dd/MM/yyyy","yyyy-MM-dd HH:mm:ss",
		"yyyyMMddHHmmss","yyyy-MM-dd HH:mm:ss.SSS"
	};
	//日期正则表达式（仅为格式校验，对值的有效性未校验）枚举
	private static final String[] DATE_REGEX = {
		"\\d{4}\\-\\d{2}\\-\\d{2}","\\d{8}",
		"\\d{4}\\/\\d{2}\\/\\d{2}",	"\\d{2}\\/\\d{2}\\/\\d{4}",
		"\\d{4}\\-\\d{2}\\-\\d{2} \\d{2}\\:\\d{2}\\:\\d{2}","\\d{14}",
		"\\d{4}\\-\\d{2}\\-\\d{2} \\d{2}\\:\\d{2}\\:\\d{2}\\.\\d{3}"
	};
	
	/**
	 * 解析日期字符串
	 * @param dateStr 日期字符串
	 * @return Date
	 */
	public static Date dateParse(String dateStr){
		  Date date = null;
		  if(dateStr == null)return date;
		  int index = getMatchIndex(dateStr);
		  if(index == -1)return date;
		  DateFormat df = new SimpleDateFormat(DATE_PATTERN[index]);
		  try {
			  date = df.parse(dateStr);
		  } catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		  }
		  return date;
	}
	
	  /**
	   * 计算两个日期的天数跨度，包含2边界
	   * @param d1
	   * @param d2
	   * @return -99 则表示异常
	   */
	  public static int getDiffOfDates(String ds1,String ds2){
		    int diffDay = -99;
			Date d1 = dateParse(ds1);
			Date d2 = dateParse(ds2);
			if(d1 != null && d2 != null){
				long Millis1 = d1.getTime();
				long Millis2 = d2.getTime();
				long diffMillis = Math.abs(Millis1-Millis2);
				diffDay = (int)(diffMillis/DAYOFMILLIS)+1;
			}
		  return diffDay;
	  }
	
	/**
	 * 格式匹配判断方法
	 * @param str 日期字符串
	 * @return 标识
	 */
	private static int getMatchIndex(String str){
		int index = -1;
		for(int i=0;i<DATE_REGEX.length;i++){
			if(str.matches(DATE_REGEX[i])){
				index = i;
				break;
			}
		}
		return index;
	}
	
	/**
	 * 格式化日期
	 * @param date 日期对象
	 * @param format 常用的日期格式
	 * @return 格式化后的日期字符串
	 */
	public static String dateFormat(Date date,String format){
		if(date == null)return "";
		String patterns = "#"+String.join("#",DATE_PATTERN)+"#";
		if(patterns.indexOf("#"+format+"#") == -1)return "";
		DateFormat df = new SimpleDateFormat(format);
		return df.format(date);
	}
	
	/**
	 * 获取指定格式的当前日期
	 * @param format 格式
	 * @return 当前日期
	 */
	public static String getCurrentDateStr(String format){
		return dateFormat(new Date(),format);
	}
	
	/**
	 * 将日期字符串转换为指定格式的字符串
	 * @param dateStr 源字符串
	 * @param format 指定格式
	 * @return 转换后日期字符串
	 */
	public static String formatTransfer(String dateStr,String format){
		Date date = dateParse(dateStr);
		String target = dateFormat(date,format);
		return target;
	}
	
	public static void main(String[] args){
		System.out.println(getCurrentDateStr("yyyy-MM-dd HH:mm:ss"));
	}
}
