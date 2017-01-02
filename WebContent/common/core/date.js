/**
 *格式化日期：目前支持9种格式 
 */
Date.formatDate = function(date,format){
	var dateFormats = [
		"yyyy-MM-dd","yyyyMMdd",
		"dd/MM/yyyy","yyyy/MM/dd",
		"yyyy-MM-dd HH:mm:ss",
		"yyyyMMddHHmmss",
		"HH:mm:ss.SSS","HH:mm:ss",
		"yyyy-MM-dd HH:mm:ss.SSS"
	];
	var isDate = Object.prototype.toString.call(date) == "[object Date]";
	var isString = Object.prototype.toString.call(format) == "[object String]";
	if(isDate && isString){//检查类型是否正确
		//检查目标格式是否支持
		var formats = ","+dateFormats.join(",")+",";
		if(formats.indexOf(","+format+",") > -1){
			var parts = {};
			parts["yyyy"] = date.getFullYear();//年
			var month = date.getMonth()+1;//月
			parts["MM"] = month<10?("0"+month):month;
			var day = date.getDate();//月中的天数
			parts["dd"] = day<10?("0"+day):day;
			var hours = date.getHours();//小时
			parts["HH"] = hours<10?("0"+hours):hours;
			var minutes = date.getMinutes();//分钟
			parts["mm"] = minutes<10?("0"+minutes):minutes;
			var seconds = date.getSeconds();//秒
			parts["ss"] = seconds<10?("0"+seconds):seconds;
			var milliseconds = date.getMilliseconds();//毫秒
			if(milliseconds < 10)milliseconds = "00"+milliseconds;
			else if(milliseconds < 100)milliseconds = "0"+milliseconds;
			parts["SSS"] = milliseconds;
			//按指定格式，格式化日期
			var result = format;
			for(var atr in parts){
				result = result.replace(atr,parts[atr]);
			}
			return result;
		}
	}
	return "";
}; 