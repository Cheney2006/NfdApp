$(function(){
	var $container = $("#container");
	//数据路径
	var requestData = {
		tpl:"tpl/wx_account_bank.tpl",
		data:"/weixin/account/mybankcard"
	};
	init();
	//初始化
	function init(){
		//请求模板和数据，并调用回调
		$.render({tpl:[requestData.tpl],data:requestData.data},function(data,html){
			if(html===""){
				location.href = "/weixin/login";
				return;	
			}
			$container.html(html);
		});
	}
});