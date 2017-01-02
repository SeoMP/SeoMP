		var Form = function (id) {
			this.childFormEls = getChildForm(id);
		}		
		Form.prototype.setData = function (data,flag){
			if(!data){return;}
			if(typeof(data) != "object" || (data instanceof Array)){return;}
			var elements = this.childFormEls;
			for(var i=0;i<elements.length;i++){
				var ele = elements[i];
				if(ele.type == "text" || ele.type == "textarea" || ele.type == "hidden"){
					if(data[ele.name]){
						ele.value = data[ele.name];
					}else{
						if(flag){
							ele.value = "";
						}
					}
				}else if(ele.type == "checkbox"){
					if(data[ele.name]){
						if(data[ele.name] == "1"){
							ele.checked = true;
						}else{
							ele.checked = false;
						}
					}else{
						if(flag){
							ele.checked = false;
						}
					}
				}
			}
		}
		
		Form.prototype.getData = function (){
			var data = {};
			var elements = this.childFormEls;
			for(var i=0;i<elements.length;i++){
				var ele = elements[i];
				if(ele.type == "text" || ele.type == "textarea" || ele.type == "hidden"){
					data[ele.name] = ele.value || "";
				}else if(ele.type == "checkbox"){
					if(ele.checked){
						data[ele.name] = "1";
					}else{
						data[ele.name] = "0";
					}
				}
			}
			return data;
		}
		
		function getChildForm(id){
			var els = document.getElementsByTagName("input");
			var elements = [];
			for(var i=0;i<els.length;i++){
				var isOfTheDiv = isChild(els[i],id);
				if(isOfTheDiv && els[i].name){
					elements.push(els[i]);
				}
			}
			return elements;
		}

		function isChild(childEl,divId){
			if(!childEl){return false;}
			var parent = childEl;
			while(parent){
				if((parent.tagName == "DIV" || parent.tagName == "FORM") && parent.id == divId){	
					return true;
				}
				try{
					parent = parent.parentElement;
				}catch(e){
					break;
				}
				
			}
			return false;
		}