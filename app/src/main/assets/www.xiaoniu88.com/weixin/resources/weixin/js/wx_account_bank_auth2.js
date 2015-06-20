$(function(){
	var $container = $("#container");
	var blurTimer = null;	//输入框blur时，延时200ms，以避免与按钮的click事件冲突
	var mobile="#mobile",
		mobileTip,
		code = "#code",
		codeTip,
		codeBtn = "#codeBtn",
		submitTip;
	//是否提交开通
	var isSubmit = false;
	//是否发送验证码
	var isSendCode = false;
	//获取验证倒计时timer
	var codeTimer;
	//立即开通按钮倒计timer
	var btnTimer;
	
	//数据路径
	var request = {
		tpl:"tpl/wx_account_bank_auth2.tpl",
		data: "/weixin/account/applyquickpay",
		send: "/weixin/account/applyquickpay",
		sendBankCode:"/weixin/account/sendapplycode",
		success: "/weixin/account/applyquickpay/success"
	};
	init();
	//初始化
	function init(){
		bindEvents();
		//请求模板和数据，并调用回调
		$.render({tpl:[request.tpl],data:request.data},function(data,html){
			if(html===""){
				checkLogin(html);
				return;	
			}
			$container.html(html);
			mobileTip = $("#mobileTip");
			codeTip = $("#codeTip");
			submitTip = $("#submitTip");
		});
	}
	//绑定事件
	function bindEvents(){
		//input  focus时，隐藏提交返回的错误信息
		$container.on("click","input",function(){
			if($(this).hasClass("input-readonly")){
				return;
			}
			submitTip.hide();
		});
		//验证手机号码
		$container.on("blur",mobile,function(){
			checkMobile($(this));
		}).on("focus",mobile,function(){
			mobileTip.hide();
		});
		//验证短信验证码
		$container.on("blur",code,function(){
			if($(this).hasClass("input-readonly")){
				return;	
			}
			var $this = $(this);
			blurTimer = setTimeout(function(){
				checkCode($this);
			},200);
		}).on("focus",code,function(){
			if($(this).hasClass("input-readonly")){
				return;	
			}
			codeTip.hide();
		});
		//获取短信验证码
		$container.on("click",codeBtn,function(){
			console.log("click",$(this));
			if($(this).hasClass("input-disabled")){ return false; }
			$(code).removeClass("input-readonly").removeAttr("readonly");
			//ajax
			var param = {}
			//如果要修改手机号,进行验证
			if(!checkMobile($(mobile))){
				return false;
			}
			param["phone"] = $.trim($(mobile).val());
			$.ajax({
				type:"POST",
				url:request.sendBankCode+"?"+new Date().getTime(),
				data:param,
				dataType: "json",
				beforeSend:function(){
					isSendCode = true;
					console.log("before send",$(codeBtn));
					codeTip.hide();
					$(codeBtn).addClass("input-disabled");
					codeTimer = countdown('获取验证码(<ins left_time_int="120">120</ins>)');
				},
				success:function(data){
					checkLogin(data);
					if(data.status==1){
						//成功
					} else if(data.status==0){
						//获取验证
						clearCodeTimer();
						tip(codeTip,data.errorDetails);
					}
				},
				error:function(){
					clearCodeTimer();
					tip(codeTip,"网络异常，请稍候再试!");	
				}
			});
			
			return false;
		});
		
		//立即开通
		$container.on("click","#wxBankAuthSubmit",function(){
			var $this = $(this);
			if($this.hasClass("wx_btn_disabled")){
				return false;
			}
			if(blurTimer){ 
				clearTimeout(blurTimer); 
			}
			
			submitTip.hide();
			//检测手机号码
			if(!checkMobile($(mobile))){
				return false;
			}
		
			//验证手机短信验证码
			if(!checkCode($(code))){
				return false;
			}
			//是否同意协议
			if(!$("#agree").prop("checked")){
				$.dialog("请勾选我已阅读并同意《快钱支付服务协议》");
				return false;
			}
			var confirmTip = $this.data("confirm");
			$.dialog(confirmTip,{
				type:"confirm",
				width:"80%",
				btn:{
					cancel:"取消",
					ok:"确定",
					okCall:function(mask,dialog){
						send($this);
					}
				}
			});
			return false;
		});
		//是否同意协议绑定单击事件
		$container.on("click",".input-check-img",function(){
			var $agree = $("#agree");
			var isAgree = $agree.prop("checked");
			var checkedClass = "input-checked-img";
			if(isAgree){
				$(this).removeClass(checkedClass);
				$agree.prop("checked",false);
			} else {
				$(this).addClass(checkedClass);	
				$agree.prop("checked",true);
			}
		});
	}
	//确认提交
	function send($this){
			//验证中(10)
			$this.html('正在验证(<ins left_time_int="10">10</ins>)').addClass("wx_btn_disabled");
			btnTimer = $this.find("ins").countdown("left_time_int",function(timer){
				$this.removeClass("wx_btn_disabled").html("立即开通");
				btnTimer = null;

				$(code).val("").removeAttr("readonly");
				tip(submitTip,"网络或系统繁忙，请稍后再试！");
			});
			//立即开通提交
			var param = {}
			param["code"] = $(code).val();
			$.ajax({
				type:"POST",
				url:request.send+"?"+new Date().getTime(),
				data:param,
				dataType: "json",
				beforeSend: function(){
					$(code).addClass("input-readonly").attr("readonly","readonly");
				},
				success:function(data){
					checkLogin(data);
					//停止按钮倒计时，恢复状态
					if(btnTimer){
						clearInterval(btnTimer);
						$this.removeClass("wx_btn_disabled").html("立即开通");
					}
					if(data.status==1){
						//成功
						success();
						return;
					}
					//开通失败，清空验证码输入框
					//$(code).val("").removeAttr("readonly").removeClass("input-readonly");
					//清除难证码倒计时
					clearCodeTimer();
					if(data.status==0){
						tip(submitTip,data.errorDetails);
					} else if(data.status==-1){
						tip(submitTip,"开通失败！绑卡校验中"); //-1
					}
				},
				error:function(jqXHR,textStatus,errorThrown){
					clearCodeTimer();
					tip(submitTip,"网络或系统繁忙，请稍后再试！");
				}
			});
			
	}
	
	//成功开通
	function success(){
		$.dialog("恭喜你成功开通认证支付！",{
			type:"success",
			width:200,
			title:{
				name:false
			},
			btn:{
				ok:"确定",
				okCall:function(){
					location.href = request.success+"?"+new Date().getTime();
					return false;	
				}
			}
		});
	}
	//验证手机号码
	function checkMobile($this){
		if(blurTimer){
			clearTimeout(blurTimer);
		}
		var phone = $.trim($this.val());
		var phoneReg = /(^[1][3][0-9]{9}$)|(^[1][4][0-9]{9}$)|(^[1][5][0-9]{9}$)|(^[1][8][0-9]{9}|17[0-9]{9}$)/;
		if(phone===""){
			tip(mobileTip,"请输入您的银行预留手机号码");
			return false;
		} else if(!phoneReg.test(phone)){
			tip(mobileTip,"请输入13、14、15、18或17开头的11位手机号码");
			return false;	
		}
		return true;
	}
	//检测短信验证码
	function checkCode($this,s){
		var captcha = $.trim($this.val());
		if(!isSendCode){
			tip(codeTip,"请先获取短信验证码");
			return false;	
		} 
		if(captcha===""){
			tip(codeTip,"请输入短信验证码");
			return false;
		}
		return true;
	}
	//倒计时
	function countdown(text){
		//按钮倒计时
		
		$(codeBtn).html(text);
		var btn = $(codeBtn).find("ins");
		var timer = btn.countdown("left_time_int",function(timer){
			resetCodeBtn();
		});
		return timer;
	}
	//恢复发送短信按钮
	function resetCodeBtn(){
		$(codeBtn).removeClass("input-disabled").html("获取验证码");
	}
	//提示信息
	function tip(obj,text,cla){
		if($.type(obj)==="undefined"){ return; }
		if(text){
			obj.html(text).show();
			if(cla){
				obj.addClass(cla);
			}
		}
		return obj;
	}
	//清除验证码获取框倒计时
	function clearCodeTimer(){
		//倒计时清除时，需要重新发送验证码
		isSendCode = false;
		if(codeTimer){
			clearInterval(codeTimer);
			$(codeBtn).html("获取验证码").removeClass("input-disabled");
			$(code).val("").addClass("input-readonly").attr("readonly","readonly");
		}
	}
	//未登录
	function checkLogin(data){
		var errorCode;
		if($.type(data)=="object" && data.errorCode){
			errorCode = data.errorCode;
		} else {
			errorCode = data;	
		}
		if(errorCode=="user_not_login" || errorCode=="" || /user_not_login/g.test(errorCode)){
			location.href = "/weixin/login?"+new Date().getTime();
			return false;
		}
		return true;
	}
});