$(function(){
	/* 生成验证码 */
	var createValiCode = function(){
		var url = contextPath+"CreateVerifCode?timestamp="+new Date().getTime();
		$("#valiImage").attr("src",url);
	}
	$("#valiImage").click(createValiCode);
	createValiCode();
	/* 登录处理 */
	$("#loginBtn").bind('click',function(){
		var loginUrl = contextPath+"common/LoginInDeal.action?timestamp="+new Date().getTime();
		if($("#loginForm").form('validate')){//输入信息验证通过
			var data = $("#loginForm").serializeObject();
			$.ajax({
				url:loginUrl,
				type:'POST',
				data:data,
				timeout:30000,
				success:function(){
					//登录成功，全屏设置
					if(window.name != 'MPFullIndex'){
						window.open(contextPath+"MPIndex.html",'MPFullIndex',
								'fullscreen=yes,location=no,menubar=no,titlebar=no,toolbar=no,resizable=no,status=no');
						window.close();
					}
				},
				error:function(xhr){	
				  var responseText = xhr.responseText;
				  //$("#errorMsg").html(responseText);
				  top.$.messager.alert('提示',responseText);
				  /* var error = JSON.parse(responseText);
				  if(error.ECODE == "E001"){
					  top.$.messager.alert('提示',error.EMSG);
					  setTimeout(function(){
						  window.location.href = contextPath+"MPLogin.html";
					  },2000);
				  }
				   */
				},
				complete:function(){
					
				}
			});
		}
	});
});