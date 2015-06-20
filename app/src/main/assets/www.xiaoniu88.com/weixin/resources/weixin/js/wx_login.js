$(function(){
	var $username = $("#username");
	var $password = $("#password");
	var $code = $("#code");
	var $codeImg =$("#codeNum");
	var $errorBox = $("#error-box");
	var $loginBtn = $("#wx_loginSubmit");
	var $inputBox = $(".input_box,.wx_login_check_code");
	
	//验证码地址
	var codePath = "/weixin/captcha";
	//登录提交地址
	var formPath = "/weixin/login";
	//默认跳转地址
	var defaultPath = "/weixin/index";
	
	//init
	function init(){
		try{
			var user=window.localStorage.rememberUser;
			if(user&&navigator.appVersion.match(/MicroMessenger/i)){
				$username.val(user);;
			}
		}catch(ex){
			console.log("set remembered username ex!",ex);
		}
		bindEvents();
		//获取验证码
		switchCode();
	}
	init();
	
	//绑定事件
	function bindEvents(){
		//处理键盘的回车键登录
		$(document).keydown(function(event){
			if(event.keyCode==13){
				login();
			}
		});
		//单击登录按钮
		$loginBtn.on("click",function(){
			login();
		});
		//单击更新验证码
		$codeImg.on("click",function(){
			switchCode();
		});
		$code.on("focus",function(){
			$(this).val("");
		});
		//focus input时，隐藏错误提示
		$inputBox.on("focus","input",function(){
			$errorBox.html("").hide();
		});
	}
	
	//显示提示信息
	function showTipMsg(msg){
		if(msg!==""){
			$errorBox.html(msg).show();
			$loginBtn.text('立即登录');
		}
	}
	
	//刷新验证码
	function switchCode() {
		var timenow = new Date();
		$codeImg.attr("src", codePath+"?" + timenow.getTime());
	}
	
	//登录
	function login() {
		var flag = true;
		if (flag) {
			flag = false;
			if ($.trim($username.val()) === "") {
				$username.val("");
				showTipMsg("请输入手机号码、用户名或邮箱地址！");
				return;
			}
			var passwordVal = $.trim($password.val());
			if (passwordVal === "") {
				$password.val("");
				showTipMsg("请输入登录密码！");
				return;
			}
			if(passwordVal.length<6 || passwordVal.length>20){
				showTipMsg("请输入6～20个字符的密码！");
				return;
			}
			
			if($.trim($code.val())===""){
				$code.val("");
				showTipMsg("请输入验证码！");
				return;
			}
			$loginBtn.text('登录中...');
			//post data
			var param = {
				"username":$username.val(),
				"password":RSAUtils.pwdEncode($password.val()),
				"code":$code.val()
			};
			//send
			$.post(formPath, param,function(data) {
				switch(data){
					case "0":
						try{
							window.localStorage.rememberUser=param.username;
						}catch(ex){
							console.log("use localstorage to remmeber user",ex);
						}
						var urlHref=window.location.href;
						if (urlHref.indexOf("?url=")!=-1) {//带参数的URL跳转
							urlHref=urlHref.split("?url=");
							if(urlHref[1]===""){
								window.location.href = defaultPath;
							}else{
								window.location.href =decodeURIComponent(urlHref[1]);
							}
						} else {//默认跳回首页
							window.location.href = defaultPath;
						}
					break;
					case "1":
						showTipMsg("验证码为空！");
					break;
					case "2":
						showTipMsg("验证码错误！");
					break;
					case "3":
						showTipMsg("用户名为空！");
					break;
					case "4":
						showTipMsg("密码为空！");
					break;
					case "5":
						showTipMsg("用户名或密码错误！");
					break;
					case "6":
						showTipMsg("用户名被禁用！");
					break;
					case "-1":
						showTipMsg("系统忙,请稍候再试！");
					break;
				}
				//只要提交的信息出错，就刷新验证码
				switchCode();
			});
		}
	}
});

 
 