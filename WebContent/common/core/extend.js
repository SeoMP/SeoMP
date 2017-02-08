/**
 * 扩展jqery对象方法，添加form表单序列化方法
 */
$.fn.extend({
	serializeObject : function(){
		var data = {};
		$.each($(this).serializeArray(),function(index,json){
			var key = json.name;
			var value = $.trim(json.value) || "";
			if(data[key] === undefined){
				data[key] = value;
			}else{
				if(value){
					data[key] = data[key]+","+value;
				}
			}
		});
		return data;
	}
});
/*字符串对应的数据库长度(varchar/char)*/
String.prototype.dbLen = function(){
	var temp = this.replace(/[^\\x00-\\xff]/g,"&&");
	return temp.length;
}

/**
 *格式化日期：目前支持9种格式 
 */
$mp.dateFormats = [
	"yyyy-MM-dd","yyyyMMdd","dd/MM/yyyy","yyyy/MM/dd","yyyy-MM-dd HH:mm:ss","yyyyMMddHHmmss",
	"HH:mm:ss.SSS","HH:mm:ss","yyyy-MM-dd HH:mm:ss.SSS"
];

/*日期按照指定格式进行格式化*/
$mp.dateFormat = function(date,format){
	//var isDate = Object.prototype.toString.call(date) == "[object Date]";
	//var isString = Object.prototype.toString.call(format) == "[object String]";
	//参数类型检查
	if($.type(date) != "date") throw new TypeError("the parameter date is not a Date");
	if($.type(format) != "string") throw new TypeError("the parameter format is not a String");
	//检查目标日期格式是否被支持
	var supportedDfs = $mp.dateFormats.join(",");
	if((","+supportedDfs+",").indexOf(","+format+",") == -1) 
		throw new TypeError("the date format:"+format+" is not supported");
	//获取指定日期各部分值的集合
	var parts = $mp.getDFParts(date);
	//按指定格式，格式化日期
	var result = format;
	for(var atr in parts){
		result = result.replace(atr,parts[atr]);
	}
	return result;
};