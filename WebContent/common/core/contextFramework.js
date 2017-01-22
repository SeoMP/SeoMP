(function($){
	var $mp = {};//框架对象：提供全局工具方法及前端数据存取等机制
	var CONTEXTFRAMEWORK = "ContextFramework";
	var $MP =  "$mp";
	var stores = {};
	//扩展框架对象
	$.extend($mp,{
		/*获取框架非跨域顶层窗口对象*/
		getTopWin : function(){
			var targetWin = window;
			while(true){
				try{
					if(targetWin == targetWin.parent) break;
					//防止窗口未注册框架
					if(!targetWin.parent[CONTEXTFRAMEWORK])break;
				}catch(e){
					break;
				}
				targetWin = targetWin.parent;
			}
			return targetWin;
		},
		/*判断当前窗口是否为非跨域顶层窗口*/
		isTopWin : function(){
			return window == $mp.getTopWin();
		},
		/*返回顶层框架对象*/
		getTopMP : function(){
			var topWin = $mp.getTopWin();
			return topWin[CONTEXTFRAMEWORK];
		}
	});
	//给每个window注册框架对象MP
	window[$MP] = window[CONTEXTFRAMEWORK] = $mp;
})(jQuery);