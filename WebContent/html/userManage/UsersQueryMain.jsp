<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ page import="java.lang.String" %>
<%String path = request.getContextPath(); %>   
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"> 
<title>名单查询</title>
<script type="text/javascript" src="<%=path %>/common/boot.js"></script>
<style type="text/css">
	.mini-panel-header{
		background: url("<%=path %>/images/header1.png") #B1ECFC repeat-x 0px 0px;
		color:#000000;
		font-weight:510;
	}
</style>
</head>
<body style="width:99%;">
	<div class="mini-panel" title="用户列表" style="width:100%;height:auto;">               
		<div id="listInfo" class="mini-datagrid" showReloadButton="false" allowResize="false" 
			sizeList="[10]"	pageSize="10" allowMoveColumn="false" allowSortColumn="false" 
			style="width:100%;height:300px;margin-top:0px;">
			<div property="columns">
				<div field="aloginid" headerAlign="center" align="center">登录工号</div>
				<div field="aname" headerAlign="center" align="center">用户姓名</div>
				<div field="alevel" headerAlign="center" align="center" renderer="getDes">专业等级</div>
				<div field="astate" headerAlign="center" align="center" renderer="getDes">状态</div>
			</div>
		</div>
	</div>
	<script type="text/javascript">
		mini.parse();
		var listgrid = mini.get("listInfo");
		//监听行选择事件
		listgrid.on("select",function(e){
			mini.alert(mini.encode(e.record));
		});
		
		//监听分页事件
		listgrid.on("beforeload",function(e){
			e.cancel = true;
			var pageIndex = e.data.pageIndex;
			queryListInfo(pageIndex);
		});
		queryListInfo(0);
		//名单查询
		function queryListInfo(pageIndex){
			var paramData = {mktActId:"",userId:"徐斌",pageIndex:pageIndex,pageSize:10};
			//var paramData = {listVo:{listId:"123",mktActId:"333",listName:"name",issueExeDate:"2013-04-15"}};
			var reqUrl = "<%=path %>/common/test.action?timestamp="+new Date().getTime();
			$.ajax({
				url:reqUrl,
				data:paramData,
				type:'POST',
				async:true,
				success: function(text){
					var listInfo = mini.decode(text);
					var num = 0;
					if(listInfo){
						var data = listInfo.listInfo || [];
						num = data.length;
						listgrid.setData(data);
						listgrid.setTotalCount(Number(listInfo.totalNum));
					}
					listgrid.setPageIndex(pageIndex);
					setAutoHeight(num,300);
				},
				error:function(msg){
					mini.alert(mini.encode(msg));
				}
			});
		}
		
		function getDes(e){
			var des = e.value == "1" ? "正常" : "终止";
			return des;
		}
		
		function setAutoHeight(num,scrollHeight){
			if(num == 0){//无数据
				listgrid.setHeight(78);
			}else{//有记录
				var height = 24*(Number(num)+1)+30;
				if(height >= Number(scrollHeight)){
					listgrid.setHeight(Number(scrollHeight));
				}else{
					listgrid.setHeight(height);
				}
			}
		}
	</script>
</body>
</html>