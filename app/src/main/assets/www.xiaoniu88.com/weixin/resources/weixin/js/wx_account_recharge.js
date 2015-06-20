var view = (function() {
	//充值失败
	function fail() {
		//失败
		$.dialog("充值失败！您的银行预留手机号已变更，请联系客服重新开通快捷支付！", {
			type: "fail",
			title: {
				name: false
			},
			btn: {
				ok: "确 认",
				okCall: function() {
					//回调
					location.href = "/weixin/account/send/index";
					return false;
				}
			}
		});
	}
	function error() {
		$("#rechargeContent").hide();
		$("#rechargeError").show();
	}
	//充值成功
	function succ() {
		$.dialog("充值成功", {
			type: "success",
			title: {
				name: false
			},
			btn: {
				ok: "确 认",
				okCall: function() {
					//回调
					location.href = "/weixin/account/send/index";
					return false;
				}
			}
		});
	}
	return {
		succ: succ,//成功
		fail: fail,//失败
		error: error,//进我的账户  超时  快钱超时
	}
})();

$(function() {
	var $container = $("#container");
	var money = "#money";
	var moneyTip = "#moneyTip";
	var pass = "#tradePass";
	var passTip = "#passTip";
	
	var requestData = {
		tpl: "tpl/wx_account_recharge.tpl",
		data: "/weixin/account/recharge",
		send: "/weixin/account/rechargepay"
	};
	init();
	//初始化
	function init() {
		//请求模板和数据，并调用回调
		$.render({
			type:"POST",
			tpl: [requestData.tpl],
			data: requestData.data
		}, function(data, html) {
			/*未登录*/
			if(html==""){
				/*如果越到登录态错误,跳转到登录页面*/
				checkLogin(html);
				return;
			} else if(html=="1"){
				/*未设置交易密码，跳转到交易密码设置页面*/
				location.href = "/weixin/account/applyquickpay/success?"+new Date().getTime();
				return;
			}
			//填充数据
			$container.html(html);
			
			bindEvents(data);
			/*余额*/
			$("#balance").html($.milliFormat(data.balance));
		});
	}
	//绑定事件
	function bindEvents(data) {
		//money
		$container.on("focus",money,function(){
			$(moneyTip).hide();
		}).on("blur",money,function(){
			checkMoney($(this));
		});
		$container.on("focus",pass,function(){
			$(passTip).hide();
		}).on("blur",pass,function(){
			checkPass($(this));
		});
		//提交按钮
		$container.on("click","#wxRechargeSubmit",function(){
			if($(this).hasClass("wx_btn_disabled")){
				return false;	
			}
			var checked = true;
			//检测密码
			if(!checkMoney($(money))){
				checked = false;
			}
			if(!checkPass($(pass))){
				checked = false;
			}
			if(!checked){ 
				return false;
			}
			send($(this),data)
			return false;	
		});
		//input focus时，隐藏提交返回的错误提示
		$container.on("focus","input",function(){
			$("#error-box").hide();
		});
	}
	//检测充值金额
	function checkMoney($this){
		var val = $.trim($this.val());
		if(val==""){
			tip($(moneyTip),"请输入充值金额");
			return false;	
		}
		//必须为大于1且小于1000000的小数
		var reg = /^[1-9]\d*$/;
		if(val<1 || val>1000000 || !reg.test(val)){
			tip($(moneyTip),"充值金额必须为1-100万之间的整数");
			return false;
		}
		//单笔限额
		var quota  = $this.data("quota");
		var bankName = $this.data("bank");
		if(quota!==""){
			if(val>	quota){
				tip($(moneyTip),bankName+",单笔限额"+quota+"元");
				return false;
			}
		}
		return true;
	};
	//检测支付密码
	function checkPass($this){
		var val = $.trim($this.val());
		if(val==""){
			tip($(passTip),"请输入交易密码");
			return false;	
		}
		if(val.length<6){
			tip($(passTip),"支付密码至少为6位字符");
			return false;	
		}
		return true;
	}	
	//提交充值
	function send($this,data) {
		$this.html("正在充值(<ins left_time_int='10'>10</ins>)").addClass("wx_btn_disabled");
		var btnTimer = $this.find("ins").countdown("left_time_int",function(timer){
			view.error();
		});
		var param = {};
		param["money"]=$(money).val();
		param["tradePass"]= RSAUtils.pwdEncode($(tradePass).val());
		$.ajax({
			type:"POST",
			url: requestData.send,
			data: param,
			dataType: "json",
			timeout: 10000,
			success: function(data) {
				checkLogin(data);
				//返回结果时，取消倒计时
				if(btnTimer){
					clearInterval(btnTimer);
				}
				/*
				0	充值成功
				1	充值失败
				2	交易密码错误
				3	金额异常
				4	手机号码已变更
				msg
				充值失败时显示信息
				*/
				var errorBox = $("#error-box");
				var code = data.code;
				if(code==0){
					//成功
					view.succ();
					return;
				}
				//恢复按钮
				$this.html("确认充值").removeClass("wx_btn_disabled");
				if(data.msg){
					tip(errorBox,data.msg);
					return;
				}
				if(code==4){
					view.fail();
					return;	
				}
				if(code==1){
					tip(errorBox,"充值失败");
				} else if(code==2){
					tip(errorBox,"充值失败！交易密码错误");
				} else if(code==3){
					tip(errorBox,"充值失败！金额异常");
				}
			},
			error: function(xhr, err) {
				view.error();
			}
		});
		return false;
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