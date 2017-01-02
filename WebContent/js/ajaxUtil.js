/**
 * 
 */
function createXMLHttpRequest(){
	var xmlHttpRequest;
	if (window.ActiveXObject){
		xmlHttpRequest = new ActiveXObject("Microsoft.XMLHTTP");
	}else if (window.XMLHttpRequest){
		xmlHttpRequest = new XMLHttpRequest();
	}else{
		alert("浏览器不支持AJAX！");
	}
	return xmlHttpRequest;
}

var myAjax = function (){
	this.xmlHttpRequest = createXMLHttpRequest();
}

myAjax.prototype.post = function(requestParams){
	if(requestParams && typeof requestParams == "object" && !(requestParams instanceof Array)){
		
	}
}