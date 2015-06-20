 $(function(){
	var $fp = $("#forgetpassword");
	//验证码地址
	var codePath = "/weixin/forgetpassword/captcha";
	var request = {
		stepOneCheckPhone: "/weixin/forgetpassword/type/phone/param",	//验证手机号码是否存在
		stepOneVerify: "/weixin/forgetpassword/verifycode",	//第一步验证数据有效性
		stepOneSubmit: "/weixin/forgetpassword/step1",		//第一步跳转第二步form的action
		stepTwoUrl: "/weixin/forgetpassword2",				//第二步地址
		stepTwoVerify: "/weixin/forgetpassword/verifyUserInfo",	//第二步验证数据有效性
		stepTwoCode: "/weixin/forgetpassword/sendcode",	//第二步获取短信验证码
		stepThreeUrl: "/weixin/forgetpassword",		//
		stepThreeTimeout: "/weixin/forgetpassword/retryexceceed",	//设置密码超时跳转地址
		stepFour: "/weixin/forgetpassword/last",
		stepError: "/weixin/forgetpassword/retryexceceed",
		stepOK: "/weixin/forgetpassword/last"
	};
	//验证码是否发送成功
	var isCodeSend = false;
	
	//倒计时timer
	var isCountDown = null;
	
	//语音验证提示
	var fpVoiceTip = $(".wx_fp_voice");
	
	//初始化
	function init(){
		var step = $("#step").val();
		if(step==1){
			stepOne();	
		} else if(step==2){
			stepTwo();	
		} else if(step==3){
			stepThree();	
		}
	}
	init();
	//找回密码第一步
	function stepOne(){
		var $codeImg =$("#captchaImg");
		switchCode($codeImg);
		//tips
		var wxTips = $(".wx_tip");
		var tipMobile  = wxTips.eq(0);
		var tipCode  = wxTips.eq(1);
		
		//手机号码
		var inputMobile = "#mobile";
		$fp.on("blur",inputMobile,function(){
			check("mobile",$(this),tipMobile);
		}).on("focus",inputMobile,function(){
			$(this).removeClass("input-error");
			tipMobile.hide();
		});
		//图形验证码
		var inputCaptcha = "#captcha";
		$fp.on("blur",inputCaptcha,function(){
			check("captcha",$(this),tipCode);
		}).on("focus",inputCaptcha,function(){
			$(this).removeClass("input-error");
			tipCode.hide();
		});
		//单击更换图形验证码
		$codeImg.on("click",function(){
			switchCode($codeImg);
		});
		
		//第一步：下一步
		var fpStepOneNext = "#fpStepOneNext";
		$fp.on("click",fpStepOneNext,function(){
			var $this = $(this);
			var checked = true;
			if($this.hasClass("wx_btn_disabled")){
				return;
			}
			if(!check("mobile",$(inputMobile),tipMobile)){
				checked = false;	
			}
			if(!check("captcha",$(inputCaptcha),tipCode)){
				checked = false;
			}
			if(!checked){
				return false;	
			}
			var formOne = $("#formOne");
			var param = {};
			param["mobile"] = $(inputMobile).val();
			param["randomCode"] = $(inputCaptcha).val();
						
			//先ajax验证手机号码，才提交下一步
			checkPhone(param["mobile"],$(inputMobile),tipMobile,submitStepOne);
			
			//提交第一步
			function submitStepOne(){
				$.ajax({
					type:"POST",
					url:request.stepOneVerify+"?"+new Date().getTime(),
					data:param,
					beforeSend: function(){
						tipCode.hide();
					},
					success: function(data){
						if(data=="0"){
							//成功
							formOne.attr("action",request.stepOneSubmit).submit();
							return;
						}
						
						if(data=="5"){
							tip(tipMobile,"请输入您的手机号码");//手机号为空
						} else if(data=="10"){
							tip(tipCode,"请输入图形验证码");//验证码为空
						} else if(data=="11"){
							tip(tipCode,"请输入正确的图形验证码");
							switchCode($codeImg);
						} else if(data=="12"){
							tip(tipCode,"请输入正确的图形验证码");//session中验证码不存在
							switchCode($codeImg);
						}
						$this.removeClass("wx_btn_disabled");
					},
					error:function(xhr,err){
						tip(tipCode,"网络异常，请重试...");	
						$this.removeClass("wx_btn_disabled");
					}
				});
			}
		});	
	}
	
	//找回密码第二步
	function stepTwo(){
		//用户名
		var username = "#username";
		var tipUsername = $("#tipUsername");
		$fp.on("blur",username,function(){
			check("username",$(this),tipUsername);
		}).on("focus",username,function(){
			$(this).removeClass("input-error");
			tipUsername.hide();
		});
		//身份证号码
		var idcard = "#idcard";
		var tipIDCard = $("#tipIDCard");
		$fp.on("blur",idcard,function(){
			check("idcard",$(this),tipIDCard);
		}).on("focus",idcard,function(){
			$(this).removeClass("input-error");
			tipIDCard.hide();
		});
		//短信验证码
		var tipMobileCode = $("#tipMobileCode");
		var mobileCode = "#mobileCode";
		$fp.on("blur",mobileCode,function(){
			check("mobileCode",$(this),tipMobileCode);
		}).on("focus",mobileCode,function(){
			$(this).removeClass("input-error");
			tipMobileCode.hide();
		});
		//获取短信验证码按钮
		$fp.on("click","#getMobileCode",function(){
			if($(this).hasClass("wx_btn_disabled")){
				return false;	
			}
			$(this).attr("sendCode","true");
			fpVoiceTip.eq(0).show();
			sendCode($(this),tipMobileCode);
		});
		//获取语音验证码
		$fp.on("click","#sendVoice",function(){
			sendCode($("#getMobileCode"),tipMobileCode,true);
		});
		
		//提交二
		var fpStepOneNext = "#fpStepTwoNext";
		$fp.on("click",fpStepOneNext,function(){
			var $this = $(this);
			var checked = true;
			if($this.hasClass("wx_btn_disabled")){
				return false;
			}
			//验证用户名是否为空
			if($(username)[0]){
				if(!check("username",$(username),tipUsername)){
					checked = false;
				}
			}	
			//验证身份证号码是否为空
			if($(idcard)[0]){
				if(!check("idcard",$(idcard),tipIDCard)){
					checked = false;
				}
			}
			//提交时验证短信是否为空
			if(!check("mobileCode",$(mobileCode),tipMobileCode)){
				checked = false;
			}
			if(!checked){
				return false;
			}
			//验证是否有获取短信验证码
			if(!isCodeSend){
				tip(tipMobileCode,"请获取短信验证码");
				return false;
			}
			var param = {};
			param["userName"] = $(username).val();
			param["idNumber"] = $(idcard).val();
			param["randomCode"] = $(mobileCode).val();
			//提交
			$.ajax({
				type:"POST",
				url:request.stepTwoVerify+"?"+new Date().getTime(),
				data:param,
				beforeSend: function(){
					$this.addClass("wx_btn_disabled");
				},
				success: function(data){
					if(data=="0"){
						//tip(tipMobileCode,"用户信息校验成功");
						location.href = request.stepTwoUrl+"?"+new Date().getTime();
						return;
					}
					if(data=="5"){
						tip(tipMobileCode,"请输入您的手机号码");//手机号为空
					} else if(data=="9"){
						tip(tipMobileCode,"请刷新页面后重试");//用户信息为空
					} else if(data=="10"){
						tip(tipMobileCode,"请输入短信验证码");//校验码为空
					} else if(data=="11"){
						tip(tipMobileCode,"请输入正确的短信验证码");//校验码不匹配
					} else if(data=="12"){
						tip(tipMobileCode,"请输入正确的短信验证码");//session中不存在对应的验证码
					} else if(data=="18"){
						tip(tipIDCard,"请输入您的身份证号码");//身份证号为空
					} else if(data=="19"){
						tip(tipIDCard,"您输入的身份证号与账户不对应");//身份证号码不匹配
					} else if(data=="20"){
						location.href = request.stepError;
						//tip(tipMobileCode,"校验次数超过当日最大限制");
					} else if(data=="21"){
						tip(tipUsername,"请输入正确的用户名");//用户名为空
					} else if(data=="22"){
						tip(tipUsername,"请输入正确的用户名");//用户名不匹配
					}
					$this.removeClass("wx_btn_disabled");
				},
				error:function(xhr,err){
					tip(tipMobileCode,"网络异常，请重试...");
					$this.removeClass("wx_btn_disabled");
				}
			});
		});
	}
	//找回密码第三步
	function stepThree(){
		//新密码
		var password = "#password";
		var tipPassword = $("#tipPassword");
		var tipInfo = $(".wx_tip_pass");
		$fp.on("blur",password,function(){
			var checkpass = check("password",$(this),tipPassword);
			if(!checkpass){
				$(this).next().removeClass("input-checking-ok").hide();
				tipInfo.eq(0).hide();
			} else {
				$(this).next().addClass("input-checking-ok").show();
				tipInfo.eq(0).hide();
			}
		}).on("focus",password,function(){
			$(this).next().removeClass("input-checking-ok").hide();
			$(this).removeClass("input-error");
			tipPassword.hide();
			tipInfo.eq(0).show();
		});
		
		//确认新密码
		var password2 = "#password2";
		var tipPassword2 = $("#tipPassword2");
		$fp.on("blur",password2,function(){
			var checkpass = check("password",$(this),tipPassword2);
			if(!checkpass){
				$(this).next().removeClass("input-checking-ok").hide();
			} else if($(password).val()!==$(password2).val()) {
				$(this).next().removeClass("input-checking-ok").hide();
				tip(tipPassword2,"两次密码输入不一致");
			} else {
				$(this).next().addClass("input-checking-ok").show();
			}
			tipInfo.eq(1).hide();
		}).on("focus",password2,function(){
			$(this).next().removeClass("input-checking-ok").hide();
			$(this).removeClass("input-error");
			tipPassword2.hide();
			tipInfo.eq(1).show();
		});
		
		//提交三
		var fpStepOneNext = "#fpStepThreeNext";
		$fp.on("click",fpStepOneNext,function(){
			var $this = $(this);
			if($this.hasClass("wx_btn_disabled")){
				return false;
			}
			//提交时验证密码
			var pass1 = $.trim($(password).val());
			var pass2 = $.trim($(password2).val());
			var checkpass =  check("password",$(password),tipPassword);
			var checkpass2 =  check("password",$(password2),tipPassword2);
			if(!checkpass || !checkpass2){
				return false;
			}
			//判断密码是否一致
			if(pass1!==pass2){
				tip($(tipPassword2),"两次密码输入不一致");
				return false;
			}
			var param = {};
			param["userName"] = $("#userName").val();
			param["password"] = RSAUtils.pwdEncode(pass1);
			param["confirmPassword"] = RSAUtils.pwdEncode(pass2);
			//提交
			$.ajax({
				type:"POST",
				url:request.stepThreeUrl+"?"+new Date().getTime(),
				data:param,
				beforeSend: function(){
					$(".wx_tip").hide();
					$this.addClass("wx_btn_disabled");
				},
				success: function(data){
					if(data=="0"){
						//更新密码成功
						location.href= request.stepOK;
						return;
					}
					if(data=="1"){
						tip(tipPassword2,"更新密码失败");
					} else if(data=="9"){
						tip(tipPassword2,"请刷新页面后重试");//用户信息为空（需要刷新页面）
					} else if(data=="11"){
						tip(tipPassword2,"短信验证码不正确");//校验码不匹配
					} else if(data=="13"){
						tip(tipPassword2,"请输入密码");//用户密码为空
					} else if(data=="14"){
						tip(tipPassword2,"请输入正确的密码格式");//用户密码格式错误
					} else if(data=="15"){
						tip(tipPassword2,"两次密码输入不一致");//用户密码与确认密码不匹配
					} else if(data=="17"){
						tip(tipPassword2,"非法请求，请刷新页面后重试");//非法的更新请求（需要刷新页面）
					}
					$this.removeClass("wx_btn_disabled");
				},
				error:function(xhr,err){
					if(err=="timeout"){
						location.href = request.stepThreeTimeout;	
					} else {
						tip(tipPassword2,"网络异常，请重试...");
						$this.removeClass("wx_btn_disabled");
					}
				}
			});
		});
	}
	//获取短信验证码
	function sendCode($this,$tip,voice){
		var mobile = $("#mobile").val();
		var param = {};
		param["mobile"] = mobile;
		if(voice){
			param["type"] = "wechat_pvoice";
		} else {
			param["type"] = "wechat_phone";
		}
		$.ajax({
			url:request.stepTwoCode+"?"+new Date().getTime(),
			data:param,
			type:"POST",
			beforeSend: function(){
				$tip.hide();
				if(voice){
					fpVoiceTip.eq(0).hide();
					fpVoiceTip.eq(1).show();
				}
				if(!isCountDown){
					$this.html("发送验证码...").addClass("wx_btn_disabled");
				}
			},
			success: function(data){
				if(data=="0"){
					//发送校验码成功
					isCodeSend = true;
					tip($("#tipStepTwo"),"验证码已发送，请查收手机短信","wx_tip2");
					countdown($this,data);
					return;
				}
				if(data=="1"){
					tip($tip,"发送校验码失败");
				} else if(data=="2"){
					tip($tip,"获取短信验证码失败,请刷新页面后重试");/*非正常跳转用户，禁止发送短信*/
				} else if(data=="3"){
					tip($tip,"发送验证码间隔不能小于60s");
				} else if(data=="5"){
					tip($tip,"请输入您的手机号码");//手机号为空
				} else if(data=="8"){	
					tip($tip,"提交参数无效");//提交参数无效（验证类型无法识别）
				} else if(data=="9"){	
					tip($tip,"请刷新页面后重试");//用户信息为空
				} else {
					tip($tip,"发送校验码失败，请重试！");
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
		$this.removeClass("wx_btn_disabled").html("获取验证码");
	}
	//验证码倒计时
	function countdown($this,data){
		if(isCountDown){
			clearInterval(isCountDown);	
		}
		//按钮倒计时
		$this.addClass("wx_btn_disabled").html("获取验证码("+$this.attr("left_time_int")+"秒)");
		$this.countdown("left_time_int",function($this,str,timer){
			if(isCountDown===null){
				isCountDown = timer;
			}
			$this.html("获取验证码("+str+")");
			if(str=="0秒"){
				isCountDown = null;
				resetSendBtn($this);
				fpVoiceTip.hide();
			}
		},true);
	}
	//ajax验证手机号码
	function checkPhone(phone,$this,$tip,callback){
		$tip.hide();
		$this.attr("disabled","disabled");
		var url = request.stepOneCheckPhone+"/"+phone;
		var fpStepOneNext = $("#fpStepOneNext");
		$.ajax({
			type:"GET",
			url : url+"?"+new Date().getTime(),
			beforeSend: function(){
				fpStepOneNext.addClass("wx_btn_disabled");
			},
			success : function(data){
				$this.removeAttr("disabled");
				if(data=="0"){
					if($.type(callback)==="function"){
						callback(data);	
					}
					return;	
				}
				if(data=="5"){
					tip($tip,"请输入您的手机号码");//手机号为空
				} else if(data=="6"){
					tip($tip,"请输入正确的手机号码");//手机格式错误
				} else if(data=="7"){
					tip($tip,"该手机号码没有对应的账户");
				}
				fpStepOneNext.removeClass("wx_btn_disabled");
			},
			error : function(){
				$this.removeAttr("disabled");
				fpStepOneNext.removeClass("wx_btn_disabled");
				tip(tipStepOne,"网络异常，请刷新页面重试...");
			}
		});
	}
	
	//验证表单
	function check(type,$this,$tip){
		var checked = true,error="";
		var fn = {};
		fn["error"] = function(obj,tipObj,error){
			obj.addClass("input-error");
			tip(tipObj,error);
			return false;
		};
		//验证手机
		fn["mobile"] = function(){
			var phone = $this.val();
			var phoneReg = /(^[1][3][0-9]{9}$)|(^[1][4][0-9]{9}$)|(^[1][5][0-9]{9}$)|(^[1][8][0-9]{9}|17[0-9]{9}$)/;
			if(phone === ""){
				checked = false;
				error = "请输入与账户绑定的手机号码";
			} else {
				if(!phoneReg.test(phone)){
					checked = false;
					error = "请输入正确的手机号码";
				}
			}
			if(!checked){
				return fn.error($this,$tip,error);
			}
			return true;
		};
		//验证用户名
		fn["username"] = function(){
			var username = $this.val();
			if(username===""){
				checked = false;
				error = "请输入您的用户名";
			}
			if(!checked){
				return fn.error($this,$tip,error);
			}
			return true;
		};
		//验证身份证号码
		fn["idcard"] = function(){
			var idcard = $.trim($this.val());
			if(idcard===""){
				checked = false;
				error = "请输入实名登录的身份证号码";
			} else {
				if(!$.validate.idCard(idcard)){
					checked = false;
					error = "请输入正确的身份证号码";
				}
			}
			if(!checked){
				return fn.error($this,$tip,error);
			}
			return true;
		};
		//验证短信
		fn["mobileCode"] = function(){
			var code = $this.val();
			if(code===""){
				checked = false;
				error = "请输入短信验证码";
			} else {
				if(code.length<4){
					checked = false;
					error = "请输入正确的短信验证码";
				}
			}
			if(!checked){
				return fn.error($this,$tip,error);
			}
			return true;
		};
		//验证图形验证码
		fn["captcha"] = function(){
			var captcha = $.trim($this.val());
			if(captcha === ""){
				checked = false;
				error = "请输入图形验证码";
			} else {
				if(captcha.length<4){
					checked = false;
					error = "请输入正确的图形验证码";
				}
			}
			if(!checked){
				return fn.error($this,$tip,error);
			}
			return true;
		};
		//检测密码
		fn["password"] = function(){
			var p = $this.val();
			var passWord1=/^\d+$/,
				passWord2=/^[a-z]+$/,
				passWord3=/^[A-Z]+$/,
				passWord4=/^[^0-9a-zA-Z]+$/,
				passWord5=/\s/,
				passWord6=/[\u4e00-\u9fa5]/;
			if(p.length<6||p.length>20){
				checked = false;
				error = "请输入6~20个字符的密码";
			}
			if(passWord1.test(p)){
				checked = false;
				error = "密码不能为纯数字";
			}
			if(passWord2.test(p)){
				checked = false;
				error = "密码不能为纯小写字母";
			}
			if(passWord3.test(p)){
				checked = false;
				error = "密码不能为纯大写字母";
			}
			if(passWord4.test(p)){
				checked = false;
				error = "密码不能为纯符号";
			}
			if(passWord5.test(p)){
				checked = false;
				error = "密码不能包含空格";
			}
			if(passWord6.test(p)){
				checked = false;
				error = "密码不能包含中文";
			}
			if(!checked){
				return fn.error($this,$tip,error);
			}
			return true;
		};
		if(type && $.type(fn[type])=="function"){
			return fn[type]();
		} else {
			return true;	
		}
	}
	//刷新验证码
	function switchCode($codeImg) {
		$codeImg.attr("src", codePath+"?" + new Date().getTime());
	}
	//提示信息
	function tip(obj,text,cla){
		if($.type(obj)==="undefined"){ return; }
		if(text){
			obj.removeClass("wx_tip2").html(text).show();
			if(cla){
				obj.addClass(cla);
			}
		}
		return obj;
	}
});