$(function(){
	var $wxRegister = $("#wxRegister");
	var request = {
		tpl: "tpl/wx_register.tpl",
		//验证手机号码
		checkMobile: "/weixin/register/type/mobile/param",
		//验证推荐人
		checkRefferee: "/weixin/register/type/refferee/param",
		//获取短信验证码
		submitOneStep:"/weixin/register/step1",
		sendCode:"/weixin/register/sendcode",
		//注册提交
		submitRegister:"/weixin/register",
		//注册成功页面
		registerSuccess: "/weixin/register/success"
	};
	
	//防重复提交
	isSubmit = false;
	//第二步变量值
	var isStep2 = false;
	
	//验证码是否发送成功
	var isCodeSend = false;
	//确保验证手和验证推荐人已经返回,才可以提交，否则不能提交
	var isCheckedMobile = false;
	var isCheckedRef = true;
	
	//提示
	var tipMobile,tipPass,tipRef,tipCode;
	
	//init
	function init(){
		bindEvents();
		//获取提示div
		var wxTips = $(".wx_tip");
		tipMobile  = wxTips.eq(0);
		tipPass  = wxTips.eq(1);
		tipRef  = wxTips.eq(2);
		tipCode  = wxTips.eq(4);
		tipStepOne = wxTips.eq(3);
		
	}
	init();
	
	//显示第二步
	function goStep(step){
		var step1 = $(".register-form1");
		var step2 = $(".register-form2");
		if(!step){ step = 1; }
		if(step==1){
			step1.show();
			step2.hide();
		} else if(step==2){
			step1.hide();
			step2.show();
			resetRegisterBtn();
			if(isStep2){
				$("#reSend").html("重发短信(60秒)").addClass("wx_btn_disabled");
				countdown();
			} else {
				resetSendBtn();
			}
		}
	}
	
	//绑定事件
	function bindEvents(){
		//验证手机号码blur事件
		$wxRegister.on("blur",".register-mobile",function(){
			var phone = $(this).val();
			if(phone === ""){
				tip(tipMobile,"请输入11位长度的手机号码");
				return false;
			}
			checkPhone(phone,$(this));
		}).on("focus",".register-mobile",function(){
			inputChecking($(this),"remove");
			tipMobile.hide();
			tipStepOne.hide();
		});
		//验证密码blur事件
		$wxRegister.on("blur",".register-password",function(){
			var checkPass = checkPassword($(this).val());
			if(checkPass!==true){
				tip(tipPass,checkPass);
				return;
			}
			inputChecking($(this),"ok",{"right":60});
		}).on("focus",".register-password",function(){
			inputChecking($(this),"remove");
			tipPass.hide();
			tipStepOne.hide();
		});
		//显示隐藏密码
		$wxRegister.on("click",".input-pass-hide",function(){
			var text = $.trim($(this).text());
			var password = $("#password");
			var input = password.clone();
			input.val(password.val());
			if(text=="隐藏"){
				$(this).html('显示');	
				input.attr("type","password");
				password.replaceWith(input);
			} else {
				$(this).html('隐藏');	
				input.attr("type","text");
				password.replaceWith(input);
			}
		});
		//推荐输入框开关
		$wxRegister.on("click","#refCheck",function(){
			var $this = $(this);
			var refferee = $("#refferee");
			var checkedClass = "ref-checked";
			if($this.hasClass(checkedClass)){
				$this.removeClass(checkedClass);
				tipRef.hide();
				inputChecking(refferee,"remove");
				refferee.val("").css({"visibility":"hidden"});
			} else {
				$this.addClass(checkedClass);
				refferee.css({"visibility":"visible"});
			}
		});
		//推荐人输入框
		$wxRegister.on("focus","#refferee",function(){
			tipRef.hide();
			tipStepOne.hide();
			inputChecking($(this),"remove");
		}).on("blur","#refferee",function(){
			var referer = $.trim($(this).val());
			if(referer !== ""){
				//ajax验证推荐人是否存在
				checkRefferee();
			}
		});
		//是否同意协议绑定单击事件
		$wxRegister.on("click",".input-check-img",function(){
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
		//验证码绑定事件
		$wxRegister.on("focus",".input-code",function(){
			tipCode.hide();
		}).on("blur",".input-code",function(){
			var code = $.trim($(this).val());
			if(code === ""){
				tip(tipCode,"请输入验证码");
				return;
			}
			if(code.length<4){
				tip(tipCode,"短信验证码长度不正确");
				return;
			}
			if(!/^[0-9]*$/.test(code)){
				tip(tipCode,"短信验证码格式不正确");
				return;
			}
		});
		//重发短信
		$wxRegister.on("click","#reSend",function(){
			if($(this).hasClass("wx_btn_disabled")){ return false; }
			sendCode();
			tipCode.hide();
			//重新发送短信时，恢复可发送语音短信
			$(".wx_step2_voice").eq(0).show();
			$(".wx_step2_voice").eq(1).hide();
			return false;
		});
		//发送语音验证
		$wxRegister.on("click","#sendVoice",function(){
			sendCode(true);
			return false;
		});
		
		//提交第一步,获取短信验证码
		$wxRegister.on("click","#step_one",function(){
			if($(this).hasClass("wx_btn_disabled")){ return false; }
			var mobile = $("#mobile");
			var password = $("#password");
			var refferee = $("#refferee");
			var agree = $("#agree");
			if(mobile.val()===""){
				tip(tipMobile,"请输入11位长度的手机号码");
				return;	
			}
			if(password.val()===""){
				tip(tipPass,"请输入6~20个字符的密码");
				return;	
			}
			if (!agree.prop("checked")) {
				$.dialog("请勾选我已阅读并同意《使用条款》和《隐私条款》");
				return;
			}
			//判断是不否有错误提示
			if(tipMobile[0].style.display ==="" || tipPass[0].style.display ==="" || tipRef[0].style.display ===""){
				return;
			}
			//检测mobile有没有ajax验证
			//通过返回按键和查看条款中返回注册,可能手机号码不会发ajax验证，这里手动触发一下
			var isMobileNext = mobile.next();
			if(!isMobileNext.hasClass("input-checking-loading") && !isMobileNext.hasClass("input-checking-ok")){
				if(!checkPhone(mobile.val(),mobile)){
					return;	
				}
			}
			//确保已经通过ajax验证手机和推荐人
			if(!isCheckedMobile){
				setTimeout(function(){
					if(!isCheckedMobile){
						tip(tipStepOne,"请等待手机号码验证通过...","wx_tip_mobile");
					}
				},500);
				return;	
			}
			if(!isCheckedRef){
				setTimeout(function(){
					if(!isCheckedRef){
						tip(tipStepOne,"请等待推荐人验证通过...","wx_tip_refferee");
					}
				},500);
				return;
			}
			var $stepOneBtn = $("#step_one");
			$stepOneBtn.html("获取短信验证码...").addClass("wx_btn_disabled");
			if(refferee.val()!==""){
				//提交时，如果推荐人不为空，则重新再验证一次
				checkRefferee(function(){
					sendStep1();	
				});
			} else {
				sendStep1();			
			}
			function sendStep1(){
				var password = $("#password");
				var encryptPassword = $("#encryptPassword");
				var input = password.clone();
				var value = password.val();
				encryptPassword.val(RSAUtils.pwdEncode(password.val()));
				var param = {};
				param["mobile"] = $("#mobile").val();
				param["password"] = encryptPassword.val();
				param["refferee"] = $("#refferee").val();
				//提交
				$.ajax({
					url:request.submitOneStep+"?"+new Date().getTime(),
					data:param,
					type:"POST",
					beforeSend: function(){
						var passBtn = $(".input-pass-hide");
						if(passBtn.text()=="隐藏"){
							passBtn.trigger("click");
						}
						tipStepOne.hide();
					},
					success: function(data){
						if(data==1){
							isStep2 = true;
							isCodeSend = true;
							goStep(2);
							return;
						}
						$stepOneBtn.html("获取短信验证码").removeClass("wx_btn_disabled");
						if(data==3){
							tip(tipStepOne,"密码解密失败");
						} else if(data==4){
							tip(tipStepOne,"手机号重复");
						} else if(data==5){
							tip(tipStepOne,"手机格式不正确");
						} else if(data==6){
							tip(tipStepOne,"密码格式错误");
						} else if(data==7){
							tip(tipStepOne,"参数校验失败");
						} else if(data==8){
							tip(tipStepOne,"密码为空");	
						} else if(data==12){
							tip(tipStepOne,"手机号为空");
						} else if(data==16){
							tip(tipStepOne,"获取短信验证码失败,请刷新页面后重试!");
						} else if(data==17){
							tip(tipStepOne,"发送验证码失败");
						}
					},
					error:function(xhr,err){
						tip(tipStepOne,"网络异常，请请刷新页面重试...");
						$stepOneBtn.html("获取短信验证码").removeClass("wx_btn_disabled");
					}
				});
			}
			return false;
		});
		//提交第二步
		$wxRegister.on("click","#step2Register",function(){
			if($(this).hasClass("wx_btn_disabled")){ return false; }
			var $this = $(this);
			var code = $("#code");
			if($.trim(code.val())===""){
				tip(tipCode,"请输入验证码");
				return;
			}
			if(tipCode[0].style.display===""){
				return;	
			}
			if(isSubmit===true){ return; }
			isSubmit = true;
			var param = {};
			param["mobile"] = $("#mobile").val();
			param["password"] = $("#encryptPassword").val();
			param["refferee"] = $("#refferee").val();
			param["phoneCode"] = $("#code").val();
			param["refferee_source"] = $("#refferee_source").val();
			param["channel"] = $("#channel").val();
			$.ajax({
				url:request.submitRegister+"?"+new Date().getTime(),
				data:param,
				type:"POST",
				beforeSend: function(){
					 $this.html("注册中...").addClass("wx_btn_disabled");
				},
				success: function(data){
					if(data==1){
						//成功
						var successForm = $("#successForm");
						successForm.attr("action",request.registerSuccess);
						successForm.submit();
					}
					if(data==2){
						tip(tipCode,"注册失败");
					} else if(data==4){
						tip(tipCode,"手机号重复");
					} else if(data==12){
						tip(tipCode,"手机号为空");
					} else if(data==13){
						tip(tipCode,"手机验证码为空");
					} else if(data==14){
						tip(tipCode,"验证码不匹配");
					} else if(data==15){
						tip(tipCode,"手机号不匹配");
					} else if(data==18){
						tip(tipCode,"session中不存在验证码");
					}
					isSubmit = false;
					resetRegisterBtn();
				},
				error:function(xhr,err){
					isSubmit = false;
					tip(tipCode,"网络异常，请重试...");
					resetRegisterBtn();
				}
			});	
			return false;
		});
		//单击使用条款时清除密码和推荐人
		$wxRegister.on("click","#wxTerms,#wxTermsPrivacy",function(){
			var refferee = $("#refferee");
			if(refferee[0]){
				var refCheck = $("#refCheck");
				if(refCheck.hasClass("ref-checked")){
					refferee.val("");
				}
			}
			var password = $("#password");
			password.val("");
			password.next().attr("class","input-tip").hide();
		});	
	}
	//发送短信和语音短信
	function sendCode(voice){
		var mobile = $("#mobile").val();
		var param = {};
		param["mobile"] = mobile;
		if(voice){
			param["codeType"] = "wechat_pvoice";
		} else {
			param["codeType"] = "wechat_phone";
		}
		$.ajax({
			url:request.sendCode+"?"+new Date().getTime(),
			data:param,
			type:"POST",
			beforeSend: function(){
				if(voice){
					$(".wx_step2_voice").eq(0).hide();
					$(".wx_step2_voice").eq(1).show();
				} else {
					$("#reSend").html("发送验证码...").addClass("wx_btn_disabled");
				}
			},
			success: function(data){
				if(data==1){
					//发送验证码成功
					isCodeSend = true;
					if(!voice){
						countdown();
					}
					return;
				}
				if(voice){
					resetVoiceBtn();
				}
				if(data==4){
					tip(tipCode,"手机号重复");
				} else if(data==5){
					tip(tipCode,"手机格式不正确");
				} else if(data==12){
					tip(tipCode,"手机号为空");
				} else if(data==16){	
					tip(tipCode,"获取短信验证码失败,请刷新页面后重试!");
				} else if(data==17){	
					tip(tipCode,"发送验证码失败");
				} else {
					tip(tipCode,"手机验证码发送失败");
				}
				resetSendBtn();
			},
			error:function(xhr,err){
				tip(tipCode,"发送验证码失败");
				resetVoiceBtn();
				resetSendBtn();
			}
		});
	}
	//重置发送按钮
	function resetSendBtn(){
		$("#reSend").html("重发短信").removeClass("wx_btn_disabled");
	}
	
	//重置语音按钮
	function resetVoiceBtn(){
		$(".wx_step2_tip").eq(1).html('如果您未收到验证码请<a href="javascript:void(0);" class="wx_blue" id="sendVoice">使用语音验证</a>');
	}
	
	//重置完成注册按钮
	function resetRegisterBtn(){
		$("#step2Register").html("完成注册").removeClass("wx_btn_disabled");
	}
	
	//倒计时
	function countdown(data){
		//按钮倒计时
		var reSend = $("#reSend");
		reSend.countdown("left_time_int",function($this,str,timer){
			if(!isCodeSend){
				clearInterval(timer);
				resetSendBtn();
				return;
			}
			$this.html("重发短信("+str+")").addClass("wx_btn_disabled");
			if(str=="0秒"){
				resetSendBtn();
			}
		},true);
	}
	//验证手机号码
	function checkPhone(phone,$this,callback){
		var phoneReg = /(^[1][3][0-9]{9}$)|(^[1][4][0-9]{9}$)|(^[1][5][0-9]{9}$)|(^[1][8][0-9]{9}|17[0-9]{9}$)/;
		if(!phoneReg.test(phone)){
			tip(tipMobile,"请输入13、14、15、18或17开头的11位手机号码");
			return false;	
		}
		tipMobile.hide();	
		$this.attr("disabled","disabled");
		var url = request.checkMobile+"/"+phone;
		$.ajax({
			url : url+"?"+new Date().getTime(),
			beforeSend: function(){
				isCheckedMobile = false;
				inputChecking($this,"loading");
			},
			success : function(data){
				//验证手机号码的ajax未返回结果时，不允许提交
				$(".wx_tip_mobile").removeClass("wx_tip_mobile").hide();
				isCheckedMobile = true;
				$this.removeAttr("disabled");
				if($.type(callback)==="function"){
					callback(data);	
				} else {	
					if(data==1){
						//成功
						inputChecking($this,"ok");
						return;
					}
					if(data == 4) {
						tip(tipMobile,"手机号重复");
					} else if(data == 5) {
						tip(tipMobile,"手机格式不正确");
					} else if(data == 12) {
						tip(tipMobile,"手机号为空");
					} else {
						tip(tipMobile,"手机号验证失败");
					}
					inputChecking($this,"remove");
				}
			},
			error : function(){
				$this.removeAttr("disabled");
				tip(tipStepOne,"网络异常，请刷新页面重试...");
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
		if(passWord1.test(p)){
			return "密码不能为纯数字";
		}
		if(passWord2.test(p)){
			return "密码不能为纯小写字母";
		}
		if(passWord3.test(p)){
			return "密码不能为纯大写字母";
		}
		if(passWord4.test(p)){
			return "密码不能为纯符号";
		}
		if(passWord5.test(p)){
			return "密码不能包含空格";
		}
		if(passWord6.test(p)){
			return "密码不能包含中文";
		}
		return true;
	}
	//校验推荐人
	function checkRefferee(cb){
		var refferee = $("#refferee");
		var val = refferee.val();
		var url = request.checkRefferee +"/"+val;
		$.ajax({
			url : url+"?"+new Date().getTime(),
			beforeSend: function(){
				isCheckedRef = false;
				inputChecking(refferee,"loading");
			},
			success : function(data){
				//验证推荐人的ajax未返回结果时，不允许提交
				$(".wx_tip_refferee").removeClass("wx_tip_refferee").hide();
				isCheckedRef = true;
				if(data==10){
					//推荐人存在
					inputChecking(refferee,"ok");
					tipRef.hide();
					if($.type(cb)=="function"){
						cb(data);	
					}
					return;
				}
				if(data==9){
					tip(tipRef,"推荐人为空");
				} else {
					//data==11时，推荐人不存在
					tip(tipRef,"推荐人不存在");
				}
				inputChecking(refferee,"remove");
			},
			error : function(){
				tip(tipStepOne,"网络异常，请请刷新页面重试...");
				if($.type(cb)=="function"){
					$("#step_one").html("获取短信验证码").removeClass("wx_btn_disabled");	
				}
			}
		});
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
	//表单input的ajax验证提示
	function inputChecking(input,status,css){
		if(!input || !status){ return; }
		var tip = input.next(".input-tip");
		if(tip.length===0){
			tip = input;
		}
		switch(status){
			//ajax验证loading
			case "loading":
				tip.addClass("input-checking").show();
				break;
			//ajax验证通过
			case "ok":
				tip.attr("class","input-tip input-checking-ok").show();
				break;
			//ajax验证失败
			case "fail":
				tip.attr("class","input-tip input-checking-fail").show();
				break;
			//ajax验证隐藏
			case "remove":
				tip.attr("class","input-tip").hide();
				break;
			default:
		}
		if(css){
			tip.css(css);	
		}
	}
});