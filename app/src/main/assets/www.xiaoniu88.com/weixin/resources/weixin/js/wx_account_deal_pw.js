$(function(){
	var $container = $("#container");
	var request = {
		send: "/weixin/account/paycode",
		sendCode: "/weixin/account/paycode/sendcode",
		success: "/weixin/account/success"
	}
	var submitCode = $("#submitCode");
	var password = $("#password");
	var password2 = $("#password2");
	var code = $("#code");
	var codeTip = $("#codeTip");
	var codeVoiceTip = $(".wx_tip_voice");
	var submitTip = $("#submitTip");
	var passwordTip = $("#passwordTip");
	var passwordTip2 = $("#passwordTip2");
	//倒计时timer
	var countdownTimer = null;
	
	init();
	//初始化
	function init(){
		bindEvents();

	}
	//绑定事件
	function bindEvents(){
		//交易密码
		$container.on("focus","#password",function(){
			passwordTip.hide();
		}).on("blur","#password",function(){
			var pass = $(this).val();
			if(pass==""){
				tip(passwordTip,"请输入交易密码");
				return false;
			}
			var checkPass = checkPassword(pass);
			if(checkPass!==true){
				tip(passwordTip,checkPass);
				return false;
			}
		});
		$container.on("focus","#password2",function(){
			passwordTip2.hide();
		}).on("blur","#password2",function(){
			var pass = $(this).val();
			if(pass==""){
				tip(passwordTip2,"请输入确认密码");
				return false;
			}
			var checkPass = checkPassword(pass);
			if(checkPass!==true){
				tip(passwordTip2,checkPass);
				return false;
			}
			if(password.val()!==password2.val()){
				tip(passwordTip2,"两次输入密码不一致");
				return;	
			}
		});
		//获取短信验证码
		$container.on("click","#sendCode",function(){
			if($(this).hasClass("input-disabled")){ return false; }
			codeTip.hide();
			codeVoiceTip.eq(0).show();
			sendCode($(this),codeTip);
			return false;
		});
		//获取语音验证码
		$container.on("click","#sendVoice",function(){
			sendCode($("#sendCode"),codeTip,true);
		});
		
		//提交事件
		$container.on("click","#submitBtn",function(){
			send();
			return false;
		});
	}
	//提交
	function send(){
		//验证密码是否为空
		if(password.val()==""){
			tip(passwordTip,"请输入交易密码");
			return false;
		}
		if(password2.val()==""){
			tip(passwordTip2,"请输入确认密码");
			return false;
		}
		if(password.val()!==password2.val()){
			tip(passwordTip2,"两次输入密码不一致");
			return;
		}
		var param = {};
		param["password"]= RSAUtils.pwdEncode(password.val());
		param["confirmPassword"]= RSAUtils.pwdEncode(password2.val());
		if(code[0]){
			param["randomCode"] = code.val();
		}
		//
		$.ajax({
			type:"POST",
			url:request.send+"?"+new Date().getTime(),
			data:param,
			success:function(data){
				checkLogin(data);
				if(data==0){
					//成功
					success();
					return;
				}
				if(data==1){
					tip(submitTip,"开通失败！");
				} else if(data==4){
					tip(submitTip,"开通失败！验证码为空");
				} else if(data==5){
					tip(submitTip,"开通失败！验证码不为空");
				} else if(data==6){
					tip(submitTip,"开通失败！用户需要先获取验证码");
				} else if(data==8){
					tip(submitTip,"开通失败！密码为空");
				} else if(data==9){
					tip(submitTip,"开通失败！密码不匹配");
				} else if(data==10){
					tip(submitTip,"开通失败！密码解密失败");
				} else if(data==11){
					tip(submitTip,"开通失败！交易密码已经设置");
				}
			},
			error:function(){
				tip(codeTip,"网络异常，请稍候再试!");	
			}
		});
	}
	//设置开通
	function success(){
		$.dialog("设置成功！",{
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
	//检测密码
	function checkPassword(p){
		var passWord1=/^\d+$/,
			passWord2=/^[a-z]+$/,
			passWord3=/^[A-Z]+$/,
			passWord4=/^[^0-9a-zA-Z]+$/,
			passWord5=/\s/,
			passWord6=/[\u4e00-\u9fa5]/;
		if(p.length<6||p.length>20){
			return "请输入6~20个字符的密码";
		}
		if(passWord5.test(p)){
			return "密码不能包含空格";
		}
		if(passWord6.test(p)){
			return "密码不能包含中文";
		}
		return true;
	}
	//获取短信验证码
	function sendCode($this,$tip,voice){
		var param = {};
		if(voice){
			param["type"] = "wechat_pvoice";
		} else {
			param["type"] = "wechat_phone";
		}
		$("#submitTip").hide();/*可能提交出的 错误提示信息已经显示  这里直接关闭掉*/
		$.ajax({
			url:request.sendCode+"?"+new Date().getTime(),
			data:param,
			type:"POST",
			beforeSend: function(){
				$tip.hide();
				if(voice){
					codeVoiceTip.eq(0).hide();
					codeVoiceTip.eq(1).show();
				}
				$this.addClass("input-disabled").html("发送短信...");
			},
			success: function(data){
				checkLogin(data);
				if(data=="0"){
					//发送校验码成功
					isCodeSend = true;
					tip($("#tipStepTwo"),"验证码已发送，请查收手机短信","wx_tip2");
					countdown($this,data);
					return;
				}
				if(data=="1"){
					tip($tip,"执行失败");
				} else if(data=="3"){
					tip($tip,"手机号为空");
				} else if(data=="7"){
					tip($tip,"获取短信验证码失败,请刷新页面后重试");/*非正常跳转用户，禁止发送短信*/
				}
				resetSendBtn($this);
			},
			error:function(xhr,err){
				tip($tip,"发送校验码失败，请重试！");
				resetSendBtn($this);
			}
		});
	}
	//重置发送短信验证码按钮
	function resetSendBtn($this){
		$this.removeClass("input-disabled").html("获取验证码");
	}
	//验证码倒计时
	function countdown($this,data){
		if(countdownTimer){
			clearInterval(countdownTimer);	
		}
		//按钮倒计时
		$this.addClass("input-disabled").html("获取验证码("+$this.attr("left_time_int")+"秒)");
		countdownTimer = $this.countdown("left_time_int",function($this,str,timer){
			$this.html("获取验证码("+str+")");
			if(str=="0秒"){
				resetSendBtn($this);
				codeVoiceTip.hide();
			}
		},true);
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