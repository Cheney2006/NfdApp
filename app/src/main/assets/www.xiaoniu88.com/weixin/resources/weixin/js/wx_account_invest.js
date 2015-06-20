$(function(){
	var $container = $("#container");
	var more = $("#wxGetRecordsMore");
	var moreLoading = $("#wxMoreLoading");
	//页码
	var page = 0;
	//每页显示数量
	var pageSize = 5;
	//数据类型"investing"->投标中的项目,"holding"->持有中的项目,"expired"->已还款项目,默认显示"持有中的项目"
	var pageType = "holding";
	var xhr = null;
	//数据路径
	var requestData = {
		"investing":{
			tpl: $("#pageInvestingTmpl").html(),
			data:"/weixin/account/invest/investing/"
		},
		"holding":{
			tpl: $("#pageHoldingTmpl").html(),
			data:"/weixin/account/invest/holding/"
		},
		"expired":{
			tpl: $("#pageExpiredTmpl").html(),
			data:"/weixin/account/invest/expired/"
		}
	};
	//初始化
	init();
	function init(){
		
		//请求第一页数据
		getData(page);
		//绑定获取更多事件
		more.on("click",function(){
			page++;
			getData(page);
		});
		//查看不同数据
		$("#wxAccountInvest").on("click","a",function(){
			pageType = $(this).data("type");
			page=0;
			$(this).addClass("select").siblings().removeClass("select");
			$container.html('<div class="wx_loading"></div>');
			more.hide();
			moreLoading.hide();
			getData(0);
			return false;
		});
	}
	//获取数据
	function getData(page){
		var request = requestData[pageType];
		var pageData = request.data;
		pageData += "" +page+"/"+pageSize;
		if(page>0){
			more.hide();
			moreLoading.show();
		}
		xhr = $.render({type:"POST",tpl:request.tpl,data:pageData},function(data,html){
			var ilen = data.datas.length;
			moreLoading.hide();
			if(page==0){
				$container.html(html);
			} else {
				$container.append(html);
			}
			//判断是否有数据
			if(page==0 && ilen==0){
				$container.html('<div class="wx_account_invest_none"></div>');
			} else {
				//判断是否有更多数据
				if(ilen==0 || $(".wx_account_invest_table").length>=data.totalRow){
					$container.append('<div class="wx_get_nomore">没有更多记录</div>');
				} else {
					more.show();	
				}
			}
		});
	}
});
