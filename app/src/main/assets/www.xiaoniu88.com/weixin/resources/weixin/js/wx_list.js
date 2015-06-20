$(function () {
	//flag->单击两个tab("安心牛列表","散标列表")时，不触发hashchange事件
	var flag = true;
	function init() {
		//bind tab click
		tabClick();
		
		//data
		var url = {
			tpl_axn:"tpl/wx_list_axn.tpl",
			tpl_sanbiao: "tpl/wx_list_sanbiao.tpl",
			data:"/weixin/productlist"
			
			//data: "data/list.txt"
		};
		locateTab($.getHash() || "axn");
		$.render({tpl:[url.tpl_axn,url.tpl_sanbiao],data:url.data},listCallback);
		
		//hashchange
		$(window).on("hashchange",function(){
			if(flag){
				$.render({tpl:[url.tpl_axn,url.tpl_sanbiao],data:url.data},listCallback);	
			}
			flag = true;
		});
		//当前页面单击底部"我要投资"时，刷新页面
		$(".nav_invest_cur").on('click',function(){
			if(location.hash=="#axn"){
				location.reload();	
			}
		});
	}
	init();

	//列表回调
	function listCallback(data,html){
		var hash = $.getHash() || "axn";
		var axn = {
			length:0,
			data: {}
		}; 
		var sanbiao = {
			length:0,
			data:{}
		};
		axn.data = data.relievedList;
		sanbiao.data = data.productList;
		for(var a=0,alen=axn.data.length; a<alen; a++){
			//统计倒计时状态和在售状态的产品数据，下同;
			if(axn.data[a].borrowStatus ==1 || axn.data[a].borrowStatus==2){
				axn.length++;
			}
		}
		for(var b=0,blen=sanbiao.data.length; b<blen; b++){
			if(sanbiao.data[b].borrowStatus ==1 || sanbiao.data[b].borrowStatus==2){
				sanbiao.length++;
			}
		}
		var wxList = $("#wx_list"),axnTab = $("#wx_tab_axn"),sanbiaoTab= $("#wx_tab_sanbiao");
		wxList.html(html);
		var axnList = $("#wx_axn_list"),sanbiaoList = $("#wx_sanbiao_list");
		
		//循环倒计时
		$(".wx_list_countdown").each(function(index, element) {
		   $(this).countdown("left_time_int",function($this,str){
				$this.find("ins").html(str);
				if(str=="0秒"){
					$this.parents(".wx_list_info").find(".wx_progress").show();
					$this.parent().remove();
				}
			},true);
		});
		
		//设置数量
		axnTab.find("i").html(axn.length).css({"visibility":"visible"});
		sanbiaoTab.find("i").html(sanbiao.length).css({"visibility":"visible"});

		//默认时显示安心牛
		//如果安心牛在售的为0，且散标有在售的时候，显示散标
		//如果安心牛和散标都没有在售的，默认显示安心牛
		if(hash=="axn"){
			if(axn.length>0){
				axnList.show();
				locateTab(hash);
			} else if(sanbiao.length>0) {
				sanbiaoList.show();
				location.href= "#sanbiao";
				locateTab("sanbiao");
			}
		} else if(hash=="sanbiao"){
			 if(sanbiao.length>0) {
				sanbiaoList.show();
				locateTab(hash);
			 } else if(axn.length>0){
				axnList.show();
				location.href= "#axn";
				locateTab("axn");
			 }
		} else {
			axnList.show();
			location.href= "#axn";
			locateTab("axn");
		}
		if(sanbiao.length===0 && axn.length===0){
			axnList.show();
			location.href= "#axn";
			locateTab("axn");
		}
	}

	//tab
	function tabClick(){
		var wx_tabs = $("#wx_listTab");
		var wxList = $("#wx_list");
		wx_tabs.on('click',"a",function(){
			flag = false;
			var hash = $(this).attr("href").replace("#","");
			locateTab(hash);
			wxList.find("ul").hide();
			$("#wx_"+hash+"_list").show();
		});
	}
	//tab current 
	function locateTab(hash){
		var wx_tabs = $("#wx_listTab");
		wx_tabs.find("a").removeClass("select");
		$("#wx_tab_"+hash).addClass("select");
	}
});