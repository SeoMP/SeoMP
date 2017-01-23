/*当前window生成加载框*/
$mp.loading = function (message,title){
	var imgurl = contextPath+"images/loading.gif";
	var divId = "mask_div_"+new Date().getTime();
	var maskDiv = '<div id=\"'+divId+ '\" class=\"maskDiv\"><div class=\"maskMain\">'+'<div class=\"maskTitle\">'+
	'<font class=\"maskTitleFont\">'+title+'</font></div>'+'<div class=\"maskBody\">'+
	'<img class=\"maskImg\" src=\"'+imgurl+'\"/>'+
	'<font class=\"maskBodyFont\">'+message+'</font></div></div></div>';
	$(document.body).append(maskDiv);
	return divId;
};
/*移除指定加载框*/
$mp.closeMaskBox = function (id){
	if(id){
		$("#"+id).remove();
	}else{
		$(".maskDiv").remove();
	}
};
/*ajax事件打开、移除加载框*/
/*$(documnet).ajaxStart = function(){
	top.maskId = $mp.loading("正在加载,请稍后...........","加载");
};
$(document).ajaxStop = function(){
	$mp.closeMaskBox(top.maskId);
};*/