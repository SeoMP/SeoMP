﻿
var __CreateJSPath = function (js) {
    var scripts = document.getElementsByTagName("script");
    var path = "";
    for (var i = 0, l = scripts.length; i < l; i++) {
        var src = scripts[i].src;
        if (src.indexOf(js) != -1) {
            var ss = src.split(js);
            path = ss[0];
            break;
        }
    }
    var href = location.href;
    href = href.split("#")[0];
    href = href.split("?")[0];
    var ss = href.split("/");
    ss.length = ss.length - 1;
    href = ss.join("/");
    if (path.indexOf("https:") == -1 && path.indexOf("http:") == -1 && path.indexOf("file:") == -1 && path.indexOf("\/") != 0) {
        path = href + "/" + path;
    }
    return path;
}

var __CreateRootPath = function(){
	var href = top.location.href;
    href = href.split("#")[0];
    href = href.split("?")[0];
    var ss = href.split("/");
    ss.length = ss.length - 1;
    href = ss.join("/")+"/";
    return href;
}
var basePath = __CreateJSPath("core.js");	
var contextPath = __CreateRootPath();
//引入相关文件
document.write('<script src="' + basePath + 'easyui/jquery.min.js" type="text/javascript"></sc' + 'ript>');
document.write('<script src="' + basePath + 'easyui/jquery.easyui.min.js" type="text/javascript" ></sc' + 'ript>');
document.write('<script src="' + basePath + 'core/date.js" type="text/javascript" ></sc' + 'ript>');
document.write('<script src="' + basePath + 'core/json2.js" type="text/javascript" ></sc' + 'ript>');
document.write('<script src="' + basePath + 'easyui/locale/easyui-lang-zh_CN.js" type="text/javascript" ></sc' + 'ript>');
document.write('<link href="' + basePath + 'easyui/themes/default/easyui.css" rel="stylesheet" type="text/css" />');
document.write('<link href="' + basePath + 'easyui/themes/icon.css" rel="stylesheet" type="text/css" />');
document.write('<link href="'+basePath + 'easyui/themes/common.css" rel="stylesheet" type="text/css"/>');
window.JSON = window.JSON || JSON;