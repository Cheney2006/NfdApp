/*
 * 对话框插件,基于zepto开发,只应用于移动端
 * tips->提示信息或者URL(type==iframe时)
 * 调用实例:
 * 手动关闭: $.dialogClose();
 * $.dialog("提示信息"); 
 * $.dialog("确认提示,确定后调用confirm回函数",{type:"confirm",confirm:function(){ alert('ok'); }},);
 * $.dialog("带回调",function(){ alert(0); }
 */
(function($){
	$.dialog = function(tips,options,callback){
		//默认配置
		var defaults = {
			id: "dialog",
			width: null, //数字或百度比
			height:null, //数字或百分比
			className: "dialog",
			classNameAdd:"",
			type:"alert", //success,fail,alert,confirm,error,iframe,con
			touchmove: false, //默认会禁用对话框的touchmove事件,即弹出对话框时,不允许滚动屏幕
			mask: {
				id: "dialogMask",
				className: "dialog-mask",
				show:true,	//false时不显示遮罩层
				close: false	//true时单击遮罩层会关闭对话框
			},
			wrap:{
				id: "dialogWrap",
				className: "dialog-wrap"
			},
			title:{
				id: "dialogTitle",
				name: "温馨提示",		//等于false或""空字符时，不显示标题
				className: "dialog-title",
				closeBtn: true,
				closeClass: "dialog-title-close",
				closeText:""
			},
			content:{
				id:"dialogContent",
				className:"dialog-content",
				html:""
			},
			btn:{
				cancel:false,	//设置为false时，按钮不显示
				cancelCall:null,//取消时调用的回调
				ok:false,		//设置为false时，按钮不显示
				okCall:null,	//确定时的调用的回调
				close:true		//针对"取消"和"提交"按钮，默认为true,单击取消或确定时会关闭弹出框 ，否则不关闭
			},
			confirm:null	//按确定按钮时，触发的回调函数
		};
		tips = tips ?  tips : "";
		callback = callback ? callback : (typeof(arguments[1])==="function" ? arguments[1] : null);
		var s =  typeof(arguments[1])==="function" ? defaults : $.extend(true,{},defaults,options);
		var doc = document,
			win = window,
			bd=$("body"),
			winWidth  = $(win).width(),
			winHieght = $(win).height(),
			bodyHeight = bd.height();
		bodyHeight = (bodyHeight > winHieght) ? bodyHeight : winHieght;
		var mask;
		//创建遮罩层;
		if(s.mask.show){
			mask = doc.getElementById(s.mask.id);
			if(mask){ $(mask).remove();}
			mask = doc.createElement("div");
			mask.id = s.mask.id;
			mask.className = s.mask.className;
			$(mask).css({
				width:winWidth,
				height:bodyHeight
			});
			bd.prepend(mask);
			//单击创建遮罩层,关闭对话框
			if(s.mask.close){
				$(mask).on('click',function(){
					$.dialogClose(mask);
					return false;
				});
			}
		}
		//检查是否已有对话框存在,存在则先移除.默认只能允许一个对话框存在;
		var dialog =  doc.getElementById(s.id);
		if(dialog){ $(dialog).remove(); }
		//创建对话框层
		dialog = doc.createElement("div");
		dialog.id= s.id;
		dialog.className= s.className;
		if(s.classNameAdd!==""){
			$(dialog).addClass(s.classNameAdd);
		}
		dialog.style.visibility = "hidden";
		
		if(s.mask.show){
			$(mask).after(dialog);
		} else {
			bd.prepend(dialog);
		}
		//在对话框层内添加wrap层;
		var wrap = doc.createElement("div");
		wrap.id = s.wrap.id;
		wrap.className = s.wrap.className + " "+s.id+"-"+s.type;
		
		$(dialog).html(wrap);
		
		if(!s.touchmove){
			if(mask){
				//禁用遮罩层touchmove事件
				mask.addEventListener('touchmove', function(e) {
					e.stopPropagation();
					e.preventDefault();
				});
			}
			//禁用对话框的touchmove事件
			/*
			dialog.addEventListener('touchmove', function(e) {
				e.stopPropagation();
				e.preventDefault();
			});	
			*/		
		}
		
		//对话框标题
		if(s.title.name!==false && s.title.name!==""){
			var title = doc.createElement("div");
			title.id = s.title.id;
			title.className = s.title.className;
			title.innerHTML = s.title.name;
			//标题内的"关闭"按钮
			if((s.title.closeBtn) || (!s.btn.ok && !s.btn.cancel)){
				if(s.title.closeText!==""){
					$(title).append("<a href='javascript:$.dialogClose();' class='"+s.title.closeClass+"'>"+s.title.closeText+"</a>");
				} else {
					$(title).append("<a href='javascript:$.dialogClose();' class='"+s.title.closeClass+"'><i></i></a>");					
				}
			} else {
				//$(title).css({"text-align":"center","padding-left":0});
			}
			$(wrap).html(title);
		}
		//对话框内容
		var dialogContent = doc.createElement("div");
		dialogContent.id = s.content.id;
		dialogContent.className = s.content.className;
		dialogContent.innerHTML = '<div class="dialog-loading"></div';
		
		//alert,error,success,fail
		if(s.type=="alert" || s.type=="error" || s.type=="success" || s.type=="fail"){
			dialogContent.innerHTML = "<i class='"+s.id+"-"+s.type+"-icon'></i><p>"+tips+"</p>";
			$(wrap).append(dialogContent);
		} else {
			dialogContent.innerHTML = tips;
			$(wrap).append(dialogContent);
		}
		
		//确认类型对话框
		var confirmBtn;
		if(!(!s.btn.ok && !s.btn.cancel)){
			confirmBtn = doc.createElement("div");
			confirmBtn.className = s.id+"-btn";
			$(dialog).append(confirmBtn);
			//取消按钮
			if(s.btn.cancel!==false){
				$(confirmBtn).append("<a href='javascript:$.dialogClose();' class='"+s.id+"-btn-cancel' id='"+s.id+"Cancel'>"+s.btn.cancel+"</a>");
				var dialogCancelBtn = $(doc.getElementById(s.id+"Cancel"));
				if(s.btn.ok===false){
					dialogCancelBtn.addClass("dialog-btn-single")
				}
				dialogCancelBtn.on("click",function(){
					if(s.btn.cancelCall && typeof(s.btn.cancelCall==="function")){
						s.btn.cancelCall(mask,dialog);
					}
					if(s.btn.close===true){
						$.dialogClose(mask,dialog);
					}
					return false;
				});
			}
			//确定按钮
			if(s.btn.ok!==false){
				$(confirmBtn).append("<a href='javscript:$.dialogClose();' class='"+s.id+"-btn-ok' id='"+s.id+"Ok'>"+s.btn.ok+"</a>");
				var dialogOkBtn = $(doc.getElementById(s.id+"Ok"));
				if(s.btn.cancel===false){
					dialogOkBtn.addClass("dialog-btn-single");	
				}
				dialogOkBtn.on("click",function(){
					if(s.btn.okCall && typeof(s.btn.okCall==="function")){
						s.btn.okCall(mask,dialog);
					}
					if(s.btn.close===true){
						$.dialogClose(mask,dialog);
					}
					return false;
				});
			}
		}
		//加载iframe
		if(s.type=="iframe"){
			
			$(dialogContent).append("<iframe src='"+tips+"' style='width:100%; display:none; overflow-x:hidden; margin:0; paddding:0; border:none;' frameborder='0'></iframe>");
			$(wrap).append(dialogContent);
			$(dialogContent).find("iframe").on("load",function(){
				$(dialogContent).find(".dialog-loading").remove();
				$(this).show();
				$(dialogContent).css({"height":"100%","padding":0});
				var dialogContentHeight = $(dialogContent).height();
				$(this).css("height",dialogContentHeight-30-36);
			});
			
		}
		//设置宽度和高度
		if(s.width){
			$(dialog).css({"width":s.width,"margin-left":-s.width/2});
		}
		if(s.height){
			$(dialog).css({"height":s.height});
			$(wrap).css({"height":s.height-(confirmBtn ? $(confirmBtn).height() : 0)});
		}
		//显示及计算对话框位置;
		$(dialog).css({"margin-left":-$(dialog).width()/2,"margin-top":-$(dialog).height()/2,"visibility":"visible"});
		
		//调用回调
		if(callback){
			callback();
		}
	};
	//关闭对话框
	//如果有配置对话框的ID和遮罩层的ID，请传参数，否则关闭函数将失效
	$.dialogClose = function(mask,dialog){
		if(mask){
			$(mask).remove();	
		}
		if(dialog){
			$(dialog).remove();
			return;
		}
		//未传参数时,默认移除dialogMask和dialog;
		$("#dialogMask,#dialog").remove();
	};
})(Zepto);