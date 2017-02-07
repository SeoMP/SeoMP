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
		},
		/*错误信息展示*/
		showErrorMsg:function(errorMsg){
			top.$.messager.alert('错误提示',errorMsg);
		}
	});
	//基于jquery ajax,自定义ajax
	$mp.ajax = function (config){
		if(!config)return;
		if(!$.isPlainObject(config))return;
		var mask = $mp.loading("正在加载，请稍后...........","加载");//启用ajax加载框
		try{
			//方法重写
			$.extend(config,{
				beforeSend:function(xhr){
					xhr.setRequestHeader("globalSerNo","999");//全局流水号
				},
				complete : function(xhr){
					$mp.closeMaskBox(mask);//关闭ajax加载框
				},
				success:function(data){
					var response = data;
					try{
						response = JSON.parse(data);
					}catch(e){
					}
					if(this.onSuccess){
						this.onSuccess(response);
					}
				},
				error:function(xhr,textStatus){
					var responseText = xhr.responseText;
					if(responseText){
						try{
							responseText = JSON.parse(responseText);
							if(responseText.ECODE == "SESSION_INVALID"){//session失效
								$mp.showErrorMsg(responseText.EMSG);
								window.setTimeout(function(){
									window.location.href = contextPath+"MPLogin.html";
								},2000);
							}
						}catch(e){
						}
						if(this.onError){
							this.onError(responseText);
						}else{
							var msg = "";
							var globalserno = responseText.GLOBALSERNO;//全局流水号
							if(globalserno){
								msg = "全局流水号："+globalserno+"</br>";
							}
							if(responseText.EMSG){
								msg += responseText.EMSG;
							}else{
								msg += "错误详情："+responseText;
							}
							$mp.showErrorMsg(msg);
						}
					}else{
						var statusText = xhr.statusText || "ajax异常";
						$mp.showErrorMsg(statusText);
					}
				}
			});
			//调用jquery ajax
			$.ajax(config);
		}catch(e){
			$mp.closeMaskBox(mask);//关闭ajax加载框
			throw e;
		}
	};
	//给每个window注册框架对象MP
	window[$MP] = window[CONTEXTFRAMEWORK] = $mp; 
})(jQuery);