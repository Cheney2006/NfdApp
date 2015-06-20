$(function(){
	var $wxDetail = $("#wxDetail");
	var recordFlag = false;
	var productId= $.queryString("id");
	//请求数据URL
	var requestData = {
		tpl:"tpl/wx_detail_sanbiao.tpl",
		data: "/weixin/productDetails/"+productId,
		record:"/weixin/invests/"+productId,
		//formSubmit:"/weChat/wx_newainvest.do",//旧购买提交地址
		formSubmit:"/product/trade/WeChat/buy"
		
		//data:"data/detail_sanbiao.txt",
		//record:"data/detail_record.txt",
		//formSubmit:"data/detail_buy.txt"
	};
	function init(){
		//请求模板和数据，并调用回调
		$.render({tpl:[requestData.tpl],data:requestData.data},detailCallback);
	}
	init();
	//列表回调
	function detailCallback(data,html){
		var $topBalance = $("#wx_topBalance"),
			$myBalance = $("#myBalance"),
			$topLogin = $("#wx_topLogin");
		//余额和登录判断
		if(data.data.logined==1){
			$myBalance.html($.milliFormat(data.data.balance)+"元");
			$topBalance.show();
			$topLogin.hide();
		} else {
			$topBalance.hide();
			$topLogin.show();
		}
		$wxDetail.html(html);
		//倒计时
		countdown(data);
		//绑定事件
		bindEvent(data);
	}
	//绑定事件
	function bindEvent(data){
		//顶部登录
		$("#wx_topLogin>a").on("click",function(){
			var url = $(this).attr("href");
			location.href= url+"?url="+encodeURIComponent(location.href);
			return false;
		});
		
		//立即加入按钮
		$wxDetail.on("click","#wx_BtnInvest",function(){
			var isCheck = checkAmount(data);
			if(isCheck){
				if(!$(this).hasClass("wx_btn_disabled")){
					submitAmount(data);
				}
			}
			return false;
		});
		//输入框focus
		$wxDetail.on("focus","#amount",function(){
			if($(this).attr("readonly")){ return false; }
			removeTip();
			$(this).val("");
			$(this).removeClass("error");
		});
		//交易记录
		$wxDetail.on("click",".wx_list_tab a",function(){
			var index = $(this).index();
			$(this).addClass("select").siblings().removeClass("select");
			var wxDetailContent = $(".wx_detail_content");
			var current = wxDetailContent.eq(index);
			wxDetailContent.hide();
			current.show();
			if(index==1 && !recordFlag){
				current.find("ul").loading();
				getRecords(0);
			}
			return false;
		});
		//加载更多交易记录
		$wxDetail.on("click","#wxGetRecordsMore",function(){
			var page = $(this).data("page");
			if(page>0){
				getRecords(page);
			}
			return false;
		});
	}
	//提交
	function submitAmount(pdata){
		var wx_BtnInvest = $("#wx_BtnInvest");
		pdata = pdata.data;
		var param ={};
		var amount = $("#amount").val();
		param["paramMap.borrowTitle"] = pdata.borrowTitle;
		param["paramMap.borrowWay"] = pdata.borrowWay;
		param["paramMap.amount"] = amount;
		param["paramMap.id"] = productId;
		param["ooh.token.name"] = pdata["ooh.token.name"];
		param["ooh.token.value"] = pdata["ooh.token.value"];
		param["paramMap.platform"] = "4";
		
		param["buyAmount"] = amount;
		param["productId"] = productId;
		param["platform"] = "4";
		
		$.ajax({
			url:requestData.formSubmit,
			beforeSend: function(){
				wx_BtnInvest.addClass("wx_btn_disabled").html("购买中...");
			},
			data:param,
			type:"post",
			dataType:"json",
			success: function(data){
				//{"msg":"请先刷新页面后再进行提交","status":-1}
				if(data.status==0){
					//显示成功信息
					$wxDetail.hide();
					$("#investOK").show();
					//更改余额
					$("#myBalance").html($.milliFormat(pdata.balance-amount)+"元");
					//更改投资额
					$("#investAmount").html(amount);
					//倒计时
					$("#investOkCountdown").countdown("left_time_int",function(){
						//跳转到我的投资列表页面
						location.href = "list.html#axn";
					});
				} else {
					tip(data.errorDetails);
					setTimeout(function(){
						location.reload();
					},2000);
				}
			},
			error:function(xhr,err){
				tip("系统繁忙，请稍后再试！");
				wx_BtnInvest.removeClass("wx_btn_disabled").html("立即购买");
			}
		});
	}
	//倒计时
	function countdown(data){
		var ctd = $(".wx_detail_countdown");
		if(ctd.length>0){
			ctd.find("span").countdown("left_time_int",function($this,str){
				$this.find("ins").html(str);
				if(str=="0秒"){
					$this.parent().remove();
					//判断有没有登录
					var isLogined = (data.data.logined==1) ? true : false;
					if(isLogined){
						//有登录则显示立即加入
						$("#wxInvestBox").show();
						$(".wx_detail_progress").show();
					} else {
						$("#wxInvestLogin").show();		
					}
				}
			},true);
		}
	}
	//验证
	function checkAmount(data){
		var amount= $("#amount");
		var val = $.trim(amount.val());
		data = data.data;
		var status = data.status;
		//账户余额
		var myBalance = replaceComma(data.balance);
		//剩途可投金额
		var borrowAmount = replaceComma(data.borrowAmount);
		var hasInvestAmount = replaceComma(data.hasInvestAmount);
		var leftMoney = parseFloat((""+data.investAmount).replace(/,/g,""));
		//最大购买金额
		var maxTenderedSum = data.maxTenderedSum;
		//最小起投金额
		var minTenderedSum = data.minTenderedSum;
		
		//投资金额为空时
		if(val===""){
			tip("请输入购买金额！");
			return false;
		}
		//账户余额不足:购买金额大于账户余额
		if(parseInt(val)>myBalance){
			tip("余额不足，请先充值！");
			return false;
		}
		//单笔最小购买金额.剩余金额大于最小购买金额时才判断
		if(leftMoney>=minTenderedSum){
			if(parseInt(val)<minTenderedSum){
				tip("单笔最小购买金额为"+minTenderedSum+"元");
				return false;
			}
		}
		
		//购买金额必须大于0，且为整数
		if (parseInt(val) != val || parseInt(val) <= 0) {
			tip("购买金额必须为整数，且必须大于0 ！");
			return false;
		}
		if(val.search(/\./g)!=-1){
			tip("购买金额只能输入整数！");
			return false;
		}
		//购买金额不能高于该标的最大购买金额
		if(maxTenderedSum){
			if (maxTenderedSum!="" && maxTenderedSum!=null && parseInt(val) > parseInt(maxTenderedSum)) {
				tip("购买金额不能高于该标的最大购买金额！");
				return false;
			}
		}
		//购买金额不能大于剩余金额
		if(parseInt(val)>leftMoney){
			tip("购买金额不能大于剩余金额！");
			return false;
		}
		return true;
	}
	//提示信息
	function tip(text){
		var amount= $("#amount");
		if(!tip){ return; }
		var wx_tip = $("#wx_tip");
		wx_tip.html(text).show();
		amount.addClass("error");
	}
	//隐藏提示信息
	function removeTip(){
		var wx_tip = $("#wx_tip");
		wx_tip.html("").hide();
	}
	//替换逗号
	function replaceComma(val){
		val = (""+val).replace(/,/g,"");
		return isNaN(parseFloat(val)) ? 0 : parseFloat(val);
	}
	//请求交易记录
	function getRecords(page){
		var pageNum = 10; //默认一次摘取10条
		var dataURL = requestData.record+"/"+page+"/"+pageNum; //url
		//var dataURL = requestData["record"];
		var $wxDetailRecords = $("#wxDetailRecords");
		var $wxGetRecordsMore = $("#wxGetRecordsMore");
		$.ajax({
			url:dataURL+"?"+new Date().getTime(),
			dataType:"json",
			beforeSend: function(){
				if(page>1){
					$wxGetRecordsMore.loading();
				}
			},
			success:function(data){
				var tmp ="";
				if(data.data.length>0){
					$wxGetRecordsMore.data("page",page+1).html("单击加载更多").show();
				}
				//-1,因为共多少笔占了一个<li>
				if(($wxDetailRecords.find("li").length-1)>=data.totalRow){
					$wxGetRecordsMore.hide();
					$wxGetRecordsMore.after('<div class="wx_get_nomore">没有更多记录</div>');
					return;
				}
				if(page==0){
					tmp +="<li><strong>共"+data.totalRow+"笔</strong></li>";
				}
				for(var i=0,ilen=data.data.length; i<ilen; i++){
					tmp +="<li>"+data.data[i].username+"<span><i>"+data.data[i].investTime+"</i><br/>"+$.milliFormat(data.data[i].investAmount)+"元</span></li>";	
				}
				if(page==0){
					recordFlag = true;
					$wxDetailRecords.html(tmp);
				} else {
					$wxDetailRecords.append(tmp);
				}
			},
			error:function(){}
		});
	}
});
