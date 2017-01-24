$(function(){
	/* 生成验证码 */
	var createValiCode = function(){
		var url = contextPath+"CreateVerifCode?timestamp="+new Date().getTime();
		$("#valiImage").attr("src",url);
	};
	$("#valiImage").click(createValiCode);
	createValiCode();
	/* 登录处理 */
	$("#loginBtn").bind('click',function(){
		var loginUrl = contextPath+"common/LoginInDeal.action?timestamp="+new Date().getTime();
		if($("#loginForm").form('validate')){//输入信息验证通过
			var data = $("#loginForm").serializeObject();
			$mp.ajax({
				url:loginUrl,
				type:'POST',
				data:data,
				timeout:30000,
				onSuccess:function(){
					//登录成功，全屏设置
					window.open(contextPath+"MPIndex.html",'MPFullIndex',
								'fullscreen=yes,location=no,menubar=no,titlebar=no,toolbar=no,resizable=no,status=no');
					window.opener = null;
					window.open('','_self');
					window.close();
				}
			});
		}
	});
});