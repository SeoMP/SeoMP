/***
 * 胡志满添加日志
 * @param options
 * @returns
 */
function doAjax(options){
  var startTime=new Date().getTime();
  var result=$.ajax(options);
  var endTime=new Date().getTime();
  var cost=endTime-startTime;
  var log=null;
  if(top.$caf)log=top.$caf.newLogger(" "+options.type+":"+options.url+" cost:"+cost+"ms");	
  if(log){
    log.print("location",location.href);
    log.print("request",options.data);
    log.print("readyState","["+result.readyState+"]");
    log.print("status","["+result.status+"]");
    log.print("statusText","["+result.statusText+"]");
    log.print("Cost time:",cost+"ms");
    log.print("response",String(result.responseText));
    log.close();		   
  }
  return result;
}

/****
*@auth xiongsh
*@desc 此框架提供全局数据存取，校验等内容
*/

(function($){
	if(!$){
		return;
	}
	
	var $cf={
		vision:1.0
	};
	
	/****************定义基础方法********************************/
	//store中需要缓存的数据个数，超过的，将按照先进先出的情况被移除，数值小于等于0时，总长度将失效
	var STORE_LENGTH=0;
	//页面的标识，该设置将可用于授权、数据存取
	var PAGE_ID=window['CF_PAGE_ID'];
	var SYS_CACHE_DICT="_btp_sys_cache_dict";
	var SYS_CACHE_DICT_KEY="_dictStore";
	
	/**
	*@description 覆盖多个object的方法,scope将作为保留关键字,用于传递作用域
	*@param o:目标对象
	*@param c:源对象，注意：源对象可以为多个,分多个参数传递
	*/
	$cf.apply=function(o,c){
		if(!o||!c||typeof(c)!='object'){
			return;
		}
		
		for(var p in c){
			o[p]=c[p];
		}
		
		for(var i=2;i<arguments.length;i++){
			arguments.callee(o,arguments[i]);
		}
		return o;
	};
	
	//校验的缓存
	var verifyCache={
		length:0,
		map:{},
		msgMap:window['VTypeErrorMsg']||{},//此处从资源文件中获取
		setMsgMap:function(list){
			var map={};
			for(var i=0,len=list.length;i<len;i++){
				var item=list[i];
				map[item.vtype]=item;
			}
			verifyCache.msgMap=map;
		},
		getMsg:function(vtype,name){
			var text=verifyCache.msgMap[vtype];
			if(text){
				return text.replace('%s',name);
			}
			return '';
			// return verifyCache.msgMap[vtype];
		},
		addVType:function(list){
			var map=verifyCache.map;
			for(var i=0,len=list.length;i<len;i++){
				var item=list[i];
				//By YuanWei
				//var fieldName = item.D_fieldname;
				var fieldName = item.D_fname;
				
				//fieldName = fieldName.substr(2);
				map[fieldName]={
					//fieldname:fieldName,
					//vtype:item.D_vtype,
					//name:item.D_name
					
					//By YuanWei
					fieldname:fieldName,
					vtype:item.D_validtype,
					name:item.D_cname					
					
				};
				// map[item.fieldname]=item;
			}
			
		},
		getVType:function(fieldName){
			return verifyCache.map[fieldName];
		},
		getVTypes:function(fieldNames,map){
			var list=[];
			map=map||{};
			var noList=[];
			fieldNames=fieldNames.split(',');
			for(var i=0,len=fieldNames.length;i<len;i++){
				var field=fieldNames[i];
				var vtype=verifyCache.getVType(field);
				if(vtype){
					list.push(vtype);
					map[field]=vtype;
				}else{
					noList.push(field);
				}
			}
			return {
				map:map,
				list:list,
				noList:noList
			};
		},
		get:function(key){
			return verifyCache.map[key];
		},
		add:function(key,data,msg){
			verifyCache.length++;
			verifyCache.map[key]={
				data:data,
				msg:msg,
				date:new Date(),
				visited:1
			};
		}
	};
	
	
	//数据
	var storeData={
		map:{},
		list:[],
		hasKey:function(key){
			return (','+storeData.list.join(',')+',').indexOf(','+key+',')>0;
		}
	};
	
	//事件、数据缓存
	var events={};
	$.extend($cf,{
		/**@description 合并多个object的方法,本方法只将o中不存在（即值为undefined）的属性,将c中对应的属性进行覆盖
		*@param o: 目标对象
		*@param c:源对象，注意：源对象可以为多个，分多个参数传递
		*@return null
		*/
		applyIf:function(o,c){
			if(!o||!c||typeof(c)!='object'){
				return;
			}	
			for(var p in c){
				if(o[p]==undefined){
					o[p]=c[p];
				}			
			}		
			for(var i=2;i<arguments.length;i++){
				arguments.callee(o,arguments[i]);
			}	
			return o;
		},
		
		/**
		*@desc 获取store中存储的数据
		*@param key 用于存储数据的key值
		*@param winName 页面的名称，用于区分不同的页面
		*/
		getStore:function(key,winName){
			if($cf.isTopWindow()){
				var data=storeData.map;
				winName = winName||PAGE_ID;
				if(winName){
					data=data[winName];
					
					if(!data){
						return null;
					}
				}
				return data[key];
			}else{
				winName=winName||PAGE_ID;
				return $cf.getTopSC().getStore(key,winName);
			}
		},
		/**
		*@desc 设置store中存储的数据
		*@param key 用于存储数据的key值
		*@param value 需要存储的数据，请存储成string，如果是对象，请存储成json字符串
		*@param winName 页面的名称，用于区分不同的页面
		*/
		setStore:function(key,value,winName){
			if($cf.isTopWindow()){
				var data=storeData.map;
				var list=storeData.list;
				winName = winName||PAGE_ID;
				var _key=[];
				if(winName){
					data[winName]=data[winName]||{};
					data=data[winName];
					_key.push(winName);
				}
				data[key]=value;
				_key.push(key);
				_key=_key.join('.');
				
				if(!storeData.hasKey(_key)){
					list.push(_key);
					if(STORE_LENGTH>0&&list.length>STORE_LENGTH){//此处控制总个数，超过的，第一个将被移除，如果总长度控制为小于等于0，则长度控制失效
						$cf.delStoreByIndex(0);
					}
				}
				
				// console.log(storeData.list.join(','));
			}else{
				winName=winName||PAGE_ID;//设置数据时，默认添加PAGE_ID
				$cf.getTopSC().setStore(key,value,winName);
			}
		},
		clearPageStore:function(){
			// console.log(storeData.list.join(','));
			if($cf.isTopWindow()){
				$cf.delStoreByWinName(PAGE_ID);
			}else{
				$cf.getTopSC().delStoreByWinName(PAGE_ID);
			}
			// console.log(storeData.list.join(','));
		},
		/**
		*@desc 删除当前页面的缓存数据
		*/
		delStoreByWinName:function(winName){
			if($cf.isTopWindow()){
				var data=storeData.map;
				
				if(winName){
					var winData=data[winName];
					if(winData){
						for(var key in winData){
							$cf.delStore(key,winName);
						}
					}
				}
				// console.log(storeData.list.join(','));
			}else{
				winName=winName||PAGE_ID;//设置数据时，默认添加PAGE_ID
				$cf.getTopSC().delStoreByWinName(winName);
			}
		},
		/**
		*@desc 删除数据
		*@param key key
		*@param winName 页面名称
		*/
		delStore:function(key,winName){
			if($cf.isTopWindow()){
				var map=storeData.map;
				var list=storeData.list;
				var len=list.length;
				
				//map数据移除
				var _key=[];
				if(winName){
					if(map[winName]){
						delete map[winName][key];
					}
					_key.push(winName);
				}else{
					delete map[key];
				}
				_key.push(key);
				_key=_key.join('.');
				//list数据移除
				for(var i=0;i<len;i++){
					if(list[i]==_key){
						list.splice(i,1);
						break;
					}
				}
			}else{
				$cf.getTopSC().delStore(key,winName);
			}
		},
		/**
		*@desc 根据序号删除
		*@param index 需要删除的序号
		*/
		delStoreByIndex:function(index){
			if($cf.isTopWindow()){
				var key=storeData.list[index];
				var list=storeData.list;
				var map=storeData.map;
				
				if(index<0||index>=list.length){
					return;
				}
				
				key=key.split('.');
				if(key.length==2){
					var _winName=key[0];
					var _key=key[1];
					
					if(map[_winName]){
						delete map[_winName][_key];
					}
				}else{
					delete map[key[0]];
				}
				
				list.splice(index,1);
			}else{
				$cf.getTopSC().delStore(index);
			}
		},
		/**
		*@desc 触发事件
		*/
		fire:function(eventName,eventData){
			if($cf.isTopWindow()){
				var event=events[eventName];
				
				//克隆引用
				// eventData=nui.clone(eventData);
				if(event){
					for(var i=0,len=event.length;i<len;i++){
						var item=event[i];
						var _handler = item.handler;
						//20141120
						try{
							_handler({
								e:eventName,
								data:eventData
							});
						}catch(e){}
						/*
						try{
							if(item.scope){
								item.handler.call(handler.scope,{
									e:eventName,
									data:eventData
								});
							}else{		
								_handler({
									e:eventName,
									data:eventData
								});
							}
						}catch(e){
							//alert("in...error");
						}*/
					}
				}
			}else{
				$cf.getTopSC().fire(eventName,eventData);
			}
		},
		/**
		*@desc 添加事件监听
		*/
		on:function(eventName,handler,scope){
			if($cf.isTopWindow()){
				events[eventName]=events[eventName]||[];
				var event=events[eventName];
				event.push({
					eventName:eventName,
					handler:handler,
					scpe:scope
				});
			}else{
				$cf.getTopSC().on(eventName,handler,scope);
			}
		},
		/**
		*@desc 判断,分割的字符串里面，是否包括指定的字符串
		*/
		contains:function(str,c){
			return (','+str+',').indexOf(','+c+',')!=-1;
		},
		/**
		*@desc 获取顶层框架
		*/
		getTopSC:function(){
			var topWin=$cf.getTopWindow();
			return topWin[globalName];
		},
		showErrorMsg:function(e){
			var errorMsgStr = "";
			//非btp平台报错,无Head,Body
			if(e.errorType == 2){
				var _url = e.url || "";
				errorMsgStr = '请求执行失败，请联系管理员！'+_url+'执行错误'
			}else{
				var message = e.text.Head.ErrorMsg.split('@');
				var errMsg = message[0];
				var firstMsg = message[1] || "";
				var detail = ",全局流水号："+e.text.Head.D_globalSerNo;
				var content_ =  new String(firstMsg+" "+errMsg);
				errorMsgStr = content_+detail;
			}
			var appendStr = '<div  class="error-col">'
				  	+'<div class="error-text">'
				    + errorMsgStr                      
				  	+'</div>'
				  	+'<div class="error-btn"></div>' 
				+'</div>';
			if(top.window["msgBox_"]["htmlObj"] && top.window["msgBox_"]["nuiObj"]){
				top.window["msgBox_"]["htmlObj"].append(appendStr);
				top.window["msgBox_"]["nuiObj"].show();
			}
		},
		/**
		*@desc js继承
		*/
		extendObject:function(e){
			if(!e)return TypeError();
			if(Object.create)
				return Object.create(e);
			function f(){}
			f.prototype = e;
			return new f();
		}
	});
	$cf.getBussSerialCode=function(){
		return UUID();
	};
	
	//2015-01-15 by huzm 可扩展控制的BT请求报文头生成逻辑
	$cf.packCSR=function(card){
	  if(!card)return;
	  if(typeof(card)=="object")return card;
	  var h_csr=$cf.getStore("H_CSR","index");
	  if(h_csr&&h_csr.D_cardNo==card)return;
	  var cardInfoList=$cf.getStore("cardInfoList","csr");
	  if(!cardInfoList)return;
	  var Body=cardInfoList.Body;
	  if(!Body)return;
	  var data=Body.data;
	  if(!data)return;
	  for(var index in data){
	    var cardInfo=data[index];
	    var D_cardNo=cardInfo.D_cardNo;
	    if(card==D_cardNo){
	      var messageHead={};
	      var workSumInfo = $cf.getStore("workSumInfo","csr");//获取工作总结编号
        if(workSumInfo) {
          messageHead.D_bsKey = workSumInfo.telSumNo;
          messageHead.D_callType = workSumInfo.callType;
          messageHead.D_callId = workSumInfo.callId;
        }else return;
	      messageHead.D_custNo = cardInfo.D_custId;//客户号
	      messageHead.D_custName = cardInfo.D_custName;//客户姓名
	      messageHead.D_certType = cardInfo.D_certType;//证件类型
	      messageHead.D_certNo = cardInfo.D_certNo;//证件号
	      messageHead.D_bsType = "WORKSUM";
	      messageHead.D_bsNo = "";
	      messageHead.D_wtType = "";
	      messageHead.D_cardProdType = cardInfo.D_prodType;
	      messageHead.D_cardNo = cardInfo.D_cardNo;
	      messageHead.D_isCardCustCallDate = "";//cardInfo.D_isCardCustCallDate;
	      if(h_csr&&h_csr.D_isCardCustCallDate)messageHead.D_isCardCustCallDate = h_csr.D_isCardCustCallDate;
	      return messageHead;
	    }
	  }
	}
	
	/**@desc 重新封装的ajax*/
	$cf.ajax=function(config,transType){
		var code;
		if(!config.url){
			return;
		}
		var mask=nui.loading("正在加载,请稍后....", "加载");
	    try{
		    config.complete=function(e){
		    	var dpsysteminfo = e.getResponseHeader('dpsysteminfo');
		    	if(dpsysteminfo==null||dpsysteminfo==""){
		    	}else{
		    	  if(dpsysteminfo!="haveNoDpTokenCheck"&&($cf.getStore('dpsysteminfo','index')=="haveNoDpTokenCheck")){
		    	  	$cf.setStore('dpsysteminfo',dpsysteminfo,'index');
		    	  }
		    	}
		      nui.hideMessageBox(mask);
		    }
			//获取token
			var token = ($cf.getStore('menuData','index')).Body.sysPara.token;
			var dpsysteminfo = ($cf.getStore('menuData','index')).Body.sysPara.dpsysteminfo;
			//获取userId
			var userId =($cf.getStore('menuData','index')).Body.user.D_userId;
			//获取角色
			var roleId = ($cf.getStore('menuData','index')).Body.roleInfo.D_roleId;
			//获取需要传入后端的报文
			var messageHead = $cf.getMessageHead();
			//2015-01-15 by huzm 可扩展控制的BT请求报文头植入
			if(config.card){
			  var csr=$cf.packCSR(config.card);
			  if(csr)nui.copyTo(messageHead,csr);
			}
			//获取url
			if (config.url.lastIndexOf("?") > 0) {
				code = config.url.substring(config.url.lastIndexOf("/")+1,config.url.lastIndexOf("?"));
			} else {
				code = config.url.substring(config.url.lastIndexOf("/")+1);
			}
			$cf.applyIf(config,{
				contentType:'text/json',
				type:'POST',
				dataType:'json',
				//公共参数放入到httpHeader中
				beforeSend:function(request)
	    		{
	    			 request.setRequestHeader("_TokenStr",token); //token
	    			 request.setRequestHeader("_User",userId);  //用户id
	    			 request.setRequestHeader("D_userId",userId); //用户Id
	    			 request.setRequestHeader("D_transCode",code); // token
	    			 request.setRequestHeader("D_roleId",roleId); // 角色Id
	    			 request.setRequestHeader("D_channel","NUI"); // 渠道
	    			 request.setRequestHeader("D_globalSerNo",messageHead.D_globalSerNo); // 流水号
	    			 request.setRequestHeader("dpsysteminfo",$cf.getStore('dpsysteminfo','index')); // 
	    		},		
				onSuccess:function(){},
				onFail:function(text, textStatus, xhr){
					try{
						if(text.Head.ResultCode==-1){
							$cf.showErrorMsg({text:text});
						}
					}catch(e){
						alert(this.url+",ajax onFail,"+nui.encode(text));
					}
				},
				onError:function(){
					
					},
				beforeDo:function(){/*
					alert("超时请重新进入大平台！");
					var index ;
					var windows;
					index = window.window.document.documentElement.innerHTML.indexOf("window['CF_PAGE_ID']='index'");
					if(index > -1) {
						window.close();
					} else{
						windows = window.parent;
						while(true){
							index = windows.window.document.documentElement.innerHTML.indexOf("window['CF_PAGE_ID']='index'");
							if(index > -1){
								windows.close("ok");
								break;
							} else {
								windows = windows.parent;
							}
						}
					}
					
					*/
				}
			});
	
		messageHead.D_transCode = code;
		if(transType != null){
			messageHead.D_transType = transType; 
		}
		var data={Head:messageHead,
				  Body:config.data
			};
			config.data=nui.encode(data);
			
			config.success=function(ret){
				try{
					
					
					
					
					if(ret == null){
						this.onSuccess(ret);
					} else{
						if(ret.Head.D_flag == "0"){
							this.beforeDo();
						}
						
						if(ret.Head.ResultCode=='-1'||ret.Body.Errors){
							this.onFail(ret);
						}else{
							this.onSuccess(ret);
						}
					}
				} catch(e){
					alert(this.url+",ajax请求返回数据格式有误,"+nui.encode(ret));
				}
			};
			config.error=function(e){
				var url = this.url;
				var _this=this;
				if(this.dataType=='json'){
					try{
						var ret=eval('('+e.responseText+')');
						
						if(ret.Head.ResultCode=='-1'||ret.Body.Errors){
							this.onFail(ret);
						}else{
							this.onSuccess(ret);
						}
					}catch(error){
						$cf.showErrorMsg({errorType:2,url:url});
						_this.onError();
					}
				}else{
					$cf.showErrorMsg({errorType:2,url:url});
					_this.onError();
				}
			};
			//日志开关打开 则调用记录日志的方法
			if(top.$caf&&top.$caf.ajaxLog)return doAjax(config);
			else return $.ajax(config);
		}catch(e){
		  nui.hideMessageBox(mask);
		  throw e;
		}
	};
	
	
	$cf.getUserId=function(){
		return $cf.getStore('USER_ID','index');
	};
	$cf.getOrgCodeByType = function(orgCode){
		if(orgCode == "" || orgCode == null) return "";
		if($cf.getStore('menuData','index') == null || $cf.getStore('menuData','index').Body == null || ($cf.getStore('menuData','index')).Body.org == null) return "";
		var orgArray = ($cf.getStore('menuData','index')).Body.org;
		for(var i = 0 ; i < orgArray.length ; i++) {
			if(orgCode == orgArray[i].D_orgId) return orgArray[i].D_parentOrgId;
		}
		return "";
	};

	$cf.getMessageHead = function(){
		var bussSerialCode = $cf.getBussSerialCode();
		var messageHead = {D_transId:"",D_globalSerNo:"",D_channel:"",D_sourceSys:"",D_bsCode:"",D_transCode:"",D_userId:"",D_roleId:"",D_transTime:"",D_resultCode:"",D_transDate:"",D_center:"",D_department:"",D_group:"",D_team:"",D_custNo:"",D_custName:"",D_certType:"",D_certNo:"",D_cardNo:"",D_bsType:"",D_bsNo:"",D_bsKey:"",D_wtType:"",D_callId:"",D_callType:"",D_queryFlag:"",D_busiType:"",D_busiTransCode:"",D_cardProdType:"",D_transType:"",D_isCardCustCallDate:""};
		var comHead = $cf.getStore('H_COM','index');
		var pubHead = $cf.getStore('H_PUB','index');
		var csrHead = $cf.getStore('H_CSR','index');
		var tsrHead = $cf.getStore('H_TSR','index');
		var tskHead = $cf.getStore('H_TSK','index');
		var casHead = $cf.getStore('H_CAS','index');
		var dspHead = $cf.getStore('H_DSP','index');
		messageHead.D_globalSerNo = bussSerialCode;
		messageHead.D_channel = comHead.D_channel;
		messageHead.D_sourceSys = comHead.D_sourceSys;
		messageHead.D_bsCode = $cf.getStore("zeroLevelMenuId","index");
		messageHead.D_userId = comHead.D_userId;
		messageHead.D_roleId = comHead.D_roleId;
		messageHead.D_center = comHead.D_center;
		messageHead.D_department = comHead.D_department;
		messageHead.D_group = comHead.D_group;
		messageHead.D_team = comHead.D_team;
		messageHead.D_transType = comHead.D_transType;
		if("OB00000000" == messageHead.D_bsCode){
			messageHead.D_custNo = csrHead.D_custNo;
			messageHead.D_custName = csrHead.D_custName;
			messageHead.D_certType = csrHead.D_certType;
			messageHead.D_certNo = csrHead.D_certNo;
			messageHead.D_bsType = csrHead.D_bsType;
			messageHead.D_bsNo = csrHead.D_bsNo;
			messageHead.D_bsKey = csrHead.D_bsKey;
			messageHead.D_wtType = csrHead.D_wtType;
			messageHead.D_callId = csrHead.D_callId;
			messageHead.D_callType = csrHead.D_callType;
			messageHead.D_cardProdType = csrHead.D_cardProdType;
			messageHead.D_cardNo = csrHead.D_cardNo;
			messageHead.D_isCardCustCallDate = csrHead.D_isCardCustCallDate;
		} else if("OP00000000" == messageHead.D_bsCode){
			messageHead.D_custNo = tskHead.D_custNo;
			messageHead.D_custName = tskHead.D_custName;
			messageHead.D_certType = tskHead.D_certType;
			messageHead.D_certNo = tskHead.D_certNo;
			messageHead.D_bsType = tskHead.D_bsType;
			messageHead.D_bsNo = tskHead.D_bsNo;
			messageHead.D_bsKey = tskHead.D_bsKey;
			messageHead.D_wtType = tskHead.D_wtType;
			messageHead.D_cardNo = tskHead.D_cardNo;
		} else if("OT00000000" == messageHead.D_bsCode){
			messageHead.D_custNo = tsrHead.D_custNo;
			messageHead.D_custName = tsrHead.D_custName;
			messageHead.D_certType = tsrHead.D_certType;
			messageHead.D_certNo = tsrHead.D_certNo;
			messageHead.D_cardNo = tsrHead.D_cardNo;
			messageHead.D_cardProdType = tsrHead.D_cardProdType;
			messageHead.D_bsType = tsrHead.D_bsType;
			messageHead.D_bsNo = tsrHead.D_bsNo;
			messageHead.D_bsKey = tsrHead.D_bsKey;
			messageHead.D_wtType = tsrHead.D_wtType;
			messageHead.D_callId = tsrHead.D_callId;
			messageHead.D_callType = tsrHead.D_callType;
		}
		return messageHead;
	};
	
	//add date function
	$cf.getBtpDate=function(){
		var loginTime=$cf.getStore('menuData','index').Body.sysPara.login_time;
		var date;
		if(loginTime!=null){
			 date=loginTime.substring(0,10);
		}else{
			date=new Date();
		}
		return date;
	}
	
	$cf.getComHead = function(){
		var comHead = {D_globalSerNo:"",D_channel:"NUI",D_sourceSys:"OPM",D_bsCode:"",D_transCode:"",D_userId:"",D_roleId:"",D_center:"",D_department:"",D_group:"",D_team:"",D_transType:"10"};
		return comHead;
	};
	$cf.getPubHead = function(){
		var pubHead = {};
		return pubHead;
	};
	$cf.getCsrHead = function(){
		var csrHead = {D_custNo:"",D_custName:"",D_certType:"",D_certNo:"",D_cardNo:"",D_bsType:"",D_bsNo:"",D_bsKey:"",D_wtType:"",D_callId:"",D_callType:"",D_cardProdType:"",D_isCardCustCallDate:""};
		return csrHead;
	};
	$cf.getTsrHead = function(){
		var tsrHead = {D_custNo:"",D_custName:"",D_certType:"",D_certNo:"",D_cardNo:"",D_cardProdType:"",D_bsType:"",D_bsNo:"",D_bsKey:"",D_wtType:"",D_callId:"",D_callType:""};
		return tsrHead;
	};
	$cf.getTskHead = function(){
		var tskHead = {D_custNo:"",D_custName:"",D_certType:"",D_certNo:"",D_cardNo:"",D_bsType:"",D_bsNo:"",D_bsKey:"",D_wtType:""};
		return tskHead;
	};
	$cf.getCasHead = function(){
		var casHead = {};
		return casHead;
	};
	$cf.getDspHead = function(){
		var dspHead = {};
		return dspHead;
	};
	$cf.getToken=function(){
		return $cf.getStore('TOKEN');
	};
	$.extend($cf,{
	  //By YuanWei
		__authsLoadUrl:'/TSK/J_PUB_002_0004',
	//	__authsLoadUrl:'/service/auth.txt',
		__authData:undefined,
		__authMap:{},
		__loadAuths:function(){
			var authData=null;
			var data={
				D_pageId:window['CF_PAGE_ID']||'',
				D_userId:$cf.getUserId()
			};
			
			$cf.ajax({
				url:$cf.__authsLoadUrl,
				data:data,
				async:false,
				onSuccess:function(ret){
					authData=ret.Body.authData;
				}
			},"20");
			
			return authData;
		},
		getAuthData:function(){
			if($cf.__authData===undefined){//
				$cf.__authData=$cf.__loadAuths();
			}
			
			return $cf.__authData;
		},
		/**
		*@desc 通用的页面渲染，用于控制权限等相关信息
		*@authData {
			hidden:'',
			readOnly:'',
			editAble:''
		}
		*/
		doRender:function(){
			var authData=$cf.getAuthData();
			authData=authData||{};
			var hiddens=authData.hidden||'';
			var readOnly=authData.readonly||'';
			var authMap={};
			//hidden
			$('.nui-auth').each(function(){
				var el=$(this);
				var name=el.attr('name');
				var authName=el.attr('authName');
				var authDisplayName=el.attr('authDisplayName');
				
				//此处修改，优先考虑有authName配置的
				name=authName||name;
				authMap[name]={
					auth:'',
					authName:authDisplayName||name
				};
				if(name){
					if($cf.contains(hiddens,name)){
						//el.remove();
						el.css("display","none"); 
						authMap[name].auth='hidden';
					}else if($cf.contains(readOnly,name)){//readonly 
						el.attr('enabled','false');
						authMap[name].auth='readonly';
					}else{
						el.attr('enabled','true');
						authMap[name].auth='editable';
					}
				}
			});
			$cf.__authMap=authMap;
			//20141216 注释权限控制中parse
			//nui.parse();
		},
		
		/**
		* 获取资源授权信息
		*/
		getComponentGrant:function(componentId){
			var componentAuthData=$cf.getAuthData();
			componentAuthData=componentAuthData||{};
			var hiddens=componentAuthData.hidden||'';
			var readOnly=componentAuthData.readonly||'';
			if(componentId){
				if($cf.contains(hiddens,componentId)){	// 屏蔽
					return 'style="display:none;"'; 
				}else if($cf.contains(readOnly,componentId)){// 只读 
					return 'onclick="return false"';
				}else{
					return 'enabled="true"';	// 可读写
				}
			}
		}
	});
	
	var initVerifyMap={};
	/***@desc 表单校验相关***/
	$.extend($cf,{
		//此处需要配置
		//By YuanWei
		__verifyLoadUrl:'/TSK/HTTP_PUB_VALIDATE',
		//__verifyLoadUrl:'/poc/TestValidator',
		
		/**
		*@desc 从后端加载校验规则
		*@param entityNames，使用,分割的，实体的名称，例如：emp,user，根据参数，分别查出emp.开头和user开头的校验规则
		*@return 返回的值为
		{
			emp:{
				userId:'required',
				phone:'phone',
				...
			},
			user:{
				userId:'required
			}
		}
		*/
		__loadVerify:function(fieldNames){
			$cf.ajax({
				url:$cf.__verifyLoadUrl,
				//By YuanWei
				//data:{D_fieldNames:fieldNames},
				data:{D_allNames:fieldNames},
				async:false,
				onSuccess:function(ret){
					try{
						//确定后端返回值
						verifyCache.addVType(ret.Body.list);
					}catch(e){
						alert(this.url+",__loadVerify请求返回数据格式有误,"+nui.encode(ret));
					}
				}
			});
		},
		
		__getCacheMap:function(list,map){
			var noList=[];
			for(var i=0,len=list.length;i<len;i++){
				var en=list[i];
				var vd=verifyCache.get(en);
				if(vd){
					map[en]=vd;
					vd.visited++;
				}else{
					noList.push(en);
				}
			}
			return noList;
		},
		/**
		*@desc 获取指定实体的校验信息
		*@param entityNames 实体名称，例如：emp,user
		*@return 对应实体的校验信息
		{
			emp:{
				userId:'required',
				phone:'phone',
				...
			},
			user:{
				userId:'required
			}
		}
		*/
		__getVerifyCache:function(fieldNames){
			if($cf.isTopWindow()){
				var map={};
				var vtypes=verifyCache.getVTypes(fieldNames,map);
				
				var noListFields=vtypes.noList.join(',');
				if(noListFields){
					$cf.__loadVerify(noListFields);
					var vtypes=verifyCache.getVTypes(noListFields);
					$cf.apply(map,vtypes.map);
				}
				return map;
			}else{
				var data=$cf.getTopSC().__getVerifyCache(fieldNames);
				data=nui.clone(data);
				return data;
			}
		},
		
		__getEntityNames:function(form){
			var fieldMap=form.getFieldsMap();
			var entityList=[];
			var entityMap={};
			for(var f in fieldMap){
				f=f.split('.')[0];
				if(!entityMap[f]){
					entityList.push(f);
					entityMap[f]=true;
				}
			}
			return entityList.join(',');
		},
		getFieldNames:function(form,each){
			var fieldMap=form.getFieldsMap();
			var list=[];
			var map={};
			for(var field in fieldMap){
				field=field.split('.');
				if(field.length>1){
					if(each){
						each(field,field[0],field[1]);
					}
					
					field=field[1];
					list.push(field);
					map[field]=true;
				}
			}
			return list.join(',');
		},
		
		initVerify:function(formId){
			if(!formId){
				return;
			}
			setTimeout(function(){
				$cf.doInitVerify(new nui.Form(formId));
			},500);
		},
		/**
		*@desc 通用的表单校验
		*/
		doInitVerify:function(form){
			if(form.el&&form.el.id){
				var formId=form.el.id;
				if(initVerifyMap[formId]){//判断是否初始化过
					return;
				}
				initVerifyMap[formId]=true;
			}
			
			var fieldNames=$cf.getFieldNames(form);
			var verifyData=$cf.__getVerifyCache(fieldNames);
			
			$cf.getFieldNames(form,function(fieldName,entityName,propertyName){
				var control=nui.getbyName(fieldName.join('.'));
				var verifyInfo=verifyData[propertyName];
				
				if(control&&verifyInfo&&control.setVtype){
					control.setVtype(verifyInfo.vtype);
					var vtype=verifyInfo.vtype;
					vtype=vtype.split(';');
					
					for(var i=0,len=vtype.length;i<len;i++){
						var vtypeName=vtype[i];
						vtypeName=vtypeName.split(':')[0];
						var setter='set'+vtypeName.replace(vtypeName,vtypeName.toUpperCase())+'ErrorText';
						if(control[setter]){
							control[setter](verifyCache.getMsg(vtypeName,verifyInfo.name));
						}
					}
				}
			});
			
			/*
			var entityNames=$cf.__getEntityNames(form);
			var verifyData=$cf.__getVerifyCache(entityNames);
			
			for(var entityName in verifyData){
				var enVD=verifyData[entityName];
				var rules=enVD.data;
				var msg=enVD.msg;
				
				for(var fieldName in rules){
					var fieldC=nui.getbyName(entityName+'.'+fieldName);
					if(fieldC){
						var ruleList=rules[fieldName];
						
						fieldC.setVtype(ruleList);
						
						if(msg){
							var msgList=msg[fieldName];
							if(msgList){
								for(var ml in msgList){//璁剧疆閿欒鎻愮ず
									var setter='set'+ml.replace(ml[0],ml[0].toUpperCase())+'ErrorText';
									if(fieldC[setter]){
										fieldC[setter](msgList[ml]);
									}
								}
							}
						}
						// ruleList=ruleList.split(',');
						
						// fieldC.setVtype();
						
					}
				}
			}
			*/
			return form;
		},
		/**
		*@desc 校验表单
		*/
		doVerify:function(form){
			if(typeof(form)=='string'){
				form=new nui.Form(form);
			}
			$cf.doInitVerify(form);
			form.validate();
			return form.isValid();
		},
		
		__getColumnByName:function(name,grid){
			var columns=grid.getColumns();
			for(var i=0,len=columns.length;i<len;i++){
				var column=columns[i];
				
				if(column.field==name){
					return column;
				}
			}
			return null;
		},
		/**
		*@desc 校验grid的单元格
		*@param gridId 控件的ID
		*@param rowIndex 行号
		*@param fieldName 字段名称
		*@param errorMsg 错误信息
		*@param valid 是否校验通过，默认为不通过
		*/
		doGridCellVerify:function(gridId,rowIndex,fieldName,errorMsg,valid){
			var grid=nui.get(gridId);
			
			if(grid){
				var row=grid.getRow(rowIndex);
				var column=$cf.__getColumnByName(fieldName,grid);
				valid=valid===true?true:false;
				errorMsg=valid===true?'':errorMsg;
				
				grid.setCellIsValid(row,column,valid,errorMsg);
			}
		},
		/**
		*@desc 清除grid的校验信息
		*@param gridId 需要清楚的Grid的ID
		*/
		clearGridCellVerify:function(gridId){
			var grid=nui.get(gridId);
			if(!grid){
				return;
			}
			
			var lenRow=grid.getData().length;
			var columns=grid.getColumns();
			var lenCol=columns.length;
			for(var rowIndex=0;rowIndex<lenRow;rowIndex++){
				var row=grid.getRow(rowIndex);
				for(var columnIndex=0;columnIndex<lenCol;columnIndex++){
					var col=columns[columnIndex];
					
					grid.setCellIsValid(row,col,true);
				}
			}
		},
		/**
		*@desc 根据表单ID，清除表单的校验信息
		*/
		clearFormVerify:function(formId){
			var form=new nui.Form(formId);
			form.setIsValid(true);
		},
		/**
		*@desc 根据控件字段名称，设置校验错误提示
		*@param info
		{
			'emp.username':'名称重复',
			'emp.email':'该邮箱已经被注册'
		}
		*/
		setFormFieldVerifyFail:function(info){
			for(var fieldName in info){
				var errorMsg=info[fieldName];
				var control=nui.getbyName(fieldName);
				if(control){
					control.setIsValid(false);
					control.setErrorText(errorMsg);
				}
			}
		},
		setFormErrors:function(errors,gridNameMap){
			for(var i=0,len=errors.length;i<len;i++){
				var error=errors[i];
				
				for(var fieldName in error){
					var errorData=error[fieldName];
					
					fieldName=fieldName.substr(1);
					fieldName=fieldName.replace(/\//g,'.');
					if(fieldName.indexOf('[')!=-1){//grid
						var fnList=fieldName.split('.');
						var gridName=fnList[0];
						var columnName=fnList[1];
						var index=gridName.substr(gridName.indexOf('[')).replace('[','').replace(']','')-0;
						gridName=gridName.split('[')[0];
						var gridId=gridNameMap[gridName];
						$cf.doGridCellVerify(gridId,index,columnName,errorData.errorMessage,false);
					}else{
						var control=nui.getbyName(fieldName);
						if(control){
							control.setIsValid(false);
							control.setErrorText(errorData.errorMessage);
						}
					}
				}
			}
		},
		/**
		*@desc 提交表单
		*@param formId 需要提交的表单的id
		*@param config ajax请求的相关参数
				如果需要对form.getData的数据进行改造的话，请配置
				{
					...
					getAjaxData:function(data){
						data.a=1;
						data.b=2;
						return data;
					},
					gridConfig:{
						empgrid:'emps',
						usersgrid:'users'
					}
				}
		*/
						submitForm : function(formId, config){
			var form=new nui.Form(formId);
			
			//清除表单现有的校验提示
			$cf.clearFormVerify(formId);
			
			//执行前端校验
			//var validate=$cf.doVerify(form);
			//if(!validate){
			//	return;
			//}
			
			//获取表单当前的数据
			var data=form.getData();
			
			var gridNameMap={};
			//根据配置的grid的信息，获取grid的数据并装配
			if(config.gridConfig){
				var gridConfig=config.gridConfig;
				for(var gridId in gridConfig){
					var grid=nui.get(gridId);
					
					if(grid){
						//清除grid的校验
						$cf.clearGridCellVerify(gridId);
						
						data[gridConfig[gridId]]=grid.getData();
						
						///反向的map
						gridNameMap[gridConfig[gridId]]=gridId;
					}
				}
			}
			config.gridNameMap=gridNameMap;
			
			
			//如果用户配置了getAjaxData方法，则调用该方法
			if(config.getAjaxData){
				data=config.getAjaxData(data)||data;
				
				if(!data){
					return;
				}
			}
			// data=nui.encode(data);
			
			
			var ajaxConfig={
				data:data,
				onSuccess:function(data){
					if(data.error){//后端校验失败
					
					}
				
					nui.alert('保存成功');
				},
				onFail:function(ret){
					//ret.Body.Errors
					//做后端校验失败提示
					ret.Body.Errors&&$cf.setFormErrors(ret.Body.Errors,this.gridNameMap);
					nui.alert('保存失败');
				}
			};
			config=config||{};
			$.extend(ajaxConfig,config);
			
			$cf.ajax(ajaxConfig);
		}
	});
	
	/**@desc 获取最顶层的非跨域的top
	*
	*/
	$cf.getTopWindow=function(check){
		var win=window;
		while(true){
			if(win.parent!=win){
				try{
					var alert=win.parent.alert;
					if(!win.parent[globalName]){
						break;
					}
				}catch(e){
					break;
				}
			}else{
				break;
			}
			win=win.parent;
		}
		return win;
	};
	
	/**
	*@desc 判断当前窗体是否是topWindow
	*/
	$cf.isTopWindow=function(win){
		var topWin=$cf.getTopWindow();
		win=win||window;
		return win==topWin;
	};
	
	
	$cf.getAuthElements=function(){
		var datas=[];
		var maps={};
		$('.nui-auth').each(function(){
			var name=$(this).attr('name');
			
			if(name&&!map[name]){
				datas.push(name);
				maps[name]=true;
			}
		});
		
		return datas;
	};
	
	//次方法用于根据当前页面中需要渲染的元素，渲染一个列表
	$cf.showAuthForm=function(){
		var authMap=$cf.__authMap;
		var htmls=['<table class="nui-authtablelist formtable" id="nui_auth_form">'];
		var index=0;
		for(var name in authMap){
			var authInfo=authMap[name];
			auth=authInfo.auth;
			
			htmls=htmls.concat([
				'<tr class="',(index%2?'':'odds'),'">',
					'<td>',authInfo.authName,'</td>',
					'<td><label for="nui_auth_',name,'_editable"><input type="radio" name="',name,'" value="editable" id="nui_auth_',name,'_editable" ',(auth=='editable'?'checked="checked"':''),'/>可编辑/td>',
					'<td><label for="nui_auth_',name,'_readonly"><input type="radio" name="',name,'" value="readonly" id="nui_auth_',name,'_readonly" ',(auth=='readonly'?'checked="checked"':''),'/>不可编辑</td>',
					'<td><label for="nui_auth_',name,'_hidden"><input type="radio" name="',name,'" value="hidden" id="nui_auth_',name,'_hidden" ',(auth=='hidden'?'checked="checked"':''),'/>隐藏</td>',
				'</tr>'
			]);
			index++;
		}
		htmls.push('</table>');
		htmls=htmls.concat(['<input type="button" onclick="alert(nui.encode($cf.getAuthFormData()))" value="getData()"/>']);
		
		$(document.body).html(htmls.join(''));
	};
	
	//此方法用于
	$cf.getAuthFormData=function(){
		var data={
			hidden:[],
			readonly:[],
			editable:[]
		};
		$('#nui_auth_form :checked').each(function(){
			var name=this.name;
			var value=this.value;
			
			data[value].push(name);
		});
		
		for(var d in data){
			data[d]=data[d].join(',');
		}
		data={
			authData:data,
			pageId:window['CF_PAGE_ID']
		};
		
		return data;
	};
	
	
	//此处清理
	$(window).unload(function(){
		$cf.clearPageStore();
	});
	
	
	//by xubo 2014-3-3  业务字典缓存js对象 原来放在nui-dict.js中
	var dictStore={
		map:{},
		loadingMap:{},
		removeEmpty:function(data){
			if(!data)return;
			for(var i=0,len=data.length;i<len;i++){
				if(data[i]&&data[i].__NullItem){
					data.splice(i,1);
				}
			}
		},
		getDictName:function(dictData,dictID){
			var name=[];
			for(var i=0,len=dictData.length;i<len;i++){
				var dict=dictData[i];
				if(nui.fn.contains(dictID,dict.D_dictId)){
					name.push(dict.D_dictName);
				}
			}
			return name.join(',');
		},


		getDictText:function(dictTypeId,dictKey){
			var data=dictStore.map[dictTypeId];
			if(data){//no map
				return dictStore.getDictName(data,dictKey);
			}
			var dictName='';
			
			var data={"D_dictTypeId":dictTypeId};
			$cf.getTopSC().ajax({
				//url:'/poc/H_DictTypeGet',
				url:'/TSK/HTTP_PUB_DICT',
				data:data,
				type:'POST',
				async:false,
				onSuccess:function(ret){
					var dictList=ret.Body.dicts;
					//此处请将后台加在回来的数据，在前端缓存
					$.extend(dictStore.map,dictList);
					dictName=dictStore.getDictName(dictList&&dictList[dictTypeId]||{},dictKey);
				}
			},"10");
			
			return dictName;
		},
		loadData:function(){
			var dictTypeId=this.dictTypeId;
			var parentId = this.parentId;
			if(!dictTypeId){
				return;
			}

			var data=dictStore.map[dictTypeId];
			if(!data && !parentId){
				$cf.getTopSC().ajax({
					//url:'/poc/H_DictTypeGet',
					url:'/TSK/HTTP_PUB_DICT',
					data:{"D_dictTypeId":dictTypeId},
					async:false,
					onSuccess:function(ret){
						var dictList=ret.Body.dicts;
						//此处请将后台加在回来的数据，在前端缓存
						$.extend(dictStore.map,dictList);
					}
				},"10");
				data=dictStore.map[dictTypeId];
			}
			//20141217 增加
			var extendData = $cf.extendObject(data);
			dictStore.removeEmpty(extendData);
			this._setDictData(extendData);
			
			//20141217 注释
			//dictStore.removeEmpty(data);
			//this._setDictData(data);
		}
	};
	
	
	$.extend($cf,{
		removeDictCacheByType:function(dictTypeId){
			if($cf.isTopWindow()){
				if(dictStore.map[dictTypeId]){
					delete dictStore.map[dictTypeId];
				}
			}else{
				$cf.getTopSC().removeDictCacheByType(dictTypeId);
			}
			
		},
		removeAllDictCache:function(){
			if($cf.isTopWindow()){
				delete dictStore.map;
				dictStore.map={};
			}else{
				$cf.getTopSC().removeAllDictCache();
			}
		},
		getDictText:function(dictTypeId, dictKey){
			if($cf.isTopWindow()){
				return dictStore.getDictText(dictTypeId, dictKey);
			}else{
				return $cf.getTopSC().getDictText(dictTypeId, dictKey);
			}
		}
		
	});
	//在top页中缓存业务字典
	if($cf.isTopWindow()){
		$cf.setStore(SYS_CACHE_DICT_KEY,dictStore,SYS_CACHE_DICT);
	}
	mini.getDictText=$cf.getDictText;
	
	$(function(){
		$('.mini-tabs').each(function(){
			var id=this.id||this.uid;
			var tab=nui.get(id);
			if(tab){
				tab.on('beforecloseclick',function(e){
					var ifr=e.tab._iframeEl;
					if(ifr&&ifr.contentWindow){
						var winName=ifr.contentWindow['CF_PAGE_ID'];
						if(winName){
							$cf.delStoreByWinName(winName);
						}
					}
				});
			}
		});
	});
	
	
	

	
	nui.ajax = function (options) {
		var url = options.url;
		   var theRequest = new Object();
		   if (url.indexOf("?") != -1) {
		       var str = url.substr(url.indexOf("?")+1);
		       if (str.indexOf("&") != -1) {
		           strs = str.split("&");
		           for (var i = 0; i < strs.length; i++) {
		               theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
		           }
		       } else {
		           theRequest[str.split("=")[0]] = unescape(str.split("=")[1]);
		       }
		   }
		  
		   	var http = url.split("?")[0];
		   	var code = http.substr(url.lastIndexOf("/")+1);
		
		   var token = ($cf.getStore('menuData','index')).Body.sysPara.token;
		   var userId =($cf.getStore('menuData','index')).Body.user.D_userId;
		   var roleId = ($cf.getStore('menuData','index')).Body.roleInfo.D_roleId;
		   var messageHead = $cf.getMessageHead();
		   //2015-01-15 by huzm 可扩展控制的BT请求报文头植入
		   if(options.card){
	       var csr=$cf.packCSR(options.card);
	       if(csr)nui.copyTo(messageHead,csr);
	     }
		   for(var req in theRequest){
			   options.data[req] = theRequest[req];
		   }
		   messageHead.D_transCode = code;
			var data={
						Head:messageHead,
				Body:options.data
			};
			
			
		   if (!options.dataType) {
		       options.dataType = "json";
		   }
		   if (!options.contentType) {
		       options.contentType = "application/json; charset=UTF-8";
		   }


		   if (options.data && mini.isNull(options.data.pageIndex) == false) {
		       var page = options.data.page = {};
		       page.begin = options.data.pageIndex*options.data.pageSize;
		       page.length = options.data.pageSize;
		       page.isCount = true;
		   }

		   if (options.data && typeof(options.data)=='object' ) {
				options.data=nui.encode(data);
		   }
		
	  		if (options.dataType == "json" ) {
			       if(options.data=='{}'){
			        delete options.data;
			       }
			    
				options.type='POST';
			}	
				
			
			options.test_ = options.error;
			options.test = options.success;
			options.beforeSend=function(request){
	    			 request.setRequestHeader("_TokenStr",token);
	    			 request.setRequestHeader("_User",userId);
	    			 request.setRequestHeader("D_userId",userId);
	    			 request.setRequestHeader("D_transCode",code);
	    			 request.setRequestHeader("D_roleId",roleId);
	    			 request.setRequestHeader("D_channel","NUI");
	    			 request.setRequestHeader("D_globalSerNo",messageHead.D_globalSerNo);
	    			 request.setRequestHeader("dpsysteminfo",$cf.getStore('dpsysteminfo','index'));
			}

			options.success=function(text, textStatus, xhr){
				try{
					if(text != null) {
						if(text.Head.ResultCode==-1){
							$cf.showErrorMsg({text:text});
						}/*
			        	if(text.Head.D_flag == "0"){
			        		alert("超时请重新进入大平台！");
							var index ;
							var windows;
							index = window.window.document.documentElement.innerHTML.indexOf("window['CF_PAGE_ID']='index'");
							if(index > -1) {
								window.close();
							} else{
								windows = window.parent;
								while(true){
									index = windows.window.document.documentElement.innerHTML.indexOf("window['CF_PAGE_ID']='index'");
									if(index > -1){
										windows.close("ok");
										break;
									} else {
										windows = windows.parent;
									}
								}
							}
						}*/
					}
			        //20141114
			        var _data = text?(text.Body || {}):{};
			        this.test(_data,textStatus,xhr);
				}catch(e){
					//alert(this.url+",ajax请求返回数据格式有误,"+nui.encode(text));
				}
			}		
			
			options.error = function(text, textStatus, xhr){
			}
				
			if(top.$caf&&top.$caf.ajaxLog)return doAjax(options);
			else return window.jQuery.ajax(options);	
		  // return window.jQuery.ajax(options);
		}	
		//禁止鼠标右键功能
		function Click(){
			window.event.returnValue=false;
		}
		//document.oncontextmenu=Click;
			
		$.fn.wordLimit = function (num) {
			this.each(function () {
				var title = $(this).html();
				if (!num) {
					var copyThis = $(this.cloneNode(true)).hide().css({
							'position' : 'absolute',
							'width' : 'auto',
							'overflow' : 'visible'
						});
					$(this).after(copyThis);
					if (copyThis.width() > $(this).width()) {
						$(this).text($(this).text().substring(0, $(this).text().length - 4));
						$(this).html($(this).html() + '...');
						copyThis.remove();
						$(this).wordLimit();
					} else {
						copyThis.remove(); //娓呴櫎澶嶅埗
						return;
					}
				} else {
					var maxwidth = num;
					if ($(this).text().length > maxwidth) {
						$(this).text($(this).text().substring(0, maxwidth));
						$(this).html($(this).html() + '...');
					}
				}
				$(this).attr("title", title);
			});
		}	

	var globalName='ContextFramework';
	window['$cf']=window[globalName]=$cf;
})(jQuery);