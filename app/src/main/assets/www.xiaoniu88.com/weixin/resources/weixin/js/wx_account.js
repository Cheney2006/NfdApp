$(function(){
	//模板及数据路径
	var requestData = {
		tpl:"tpl/wx_account.tpl",
		data:"/weixin/account/index"
	};
	
	init();
	//初始化
	function init(){
		var $container = $("#container");
		//请求模板和数据，并调用回调
		$.render({type:"POST",tpl:[requestData.tpl],data:requestData.data},function(data,html){
			$container.html(html);
			bindEvents();
		});
	}
	
	//绑定事件
	function bindEvents(){
		//充值
		var recharge = $("#wxRecharge");
		recharge.on("click",function(){
			var href= $.trim($(this).attr("href"));
			if(href=="#"){
				$.dialog("手机端不支持充值，请用电脑打开小牛在线官网 <span class='yellow'>www.xiaoniu88.com</span>操作充值。",{type:"error",width:"80%"});
				return false;
			}
		});
		//提现
		var draw = $("#wxDraw");
		draw.on("click",function(){
			var href= $.trim($(this).attr("href"));
			if(href=="#"){
				$.dialog("为了更好保障您的账户资金安全，现在小牛在线手机端暂停提现功能，请前往小牛在线官网 <span class='yellow'>www.xiaoniu88.com</span>操作提现。",{type:"error",width:"80%"});
				return false;
			}
		});
	}
});