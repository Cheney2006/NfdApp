$(function() {
	var $container = $("#container");
	//请求数据URL
	var requestData = {
		tpl:"tpl/wx_account_draw.tpl",
		data: "/weixin/account/withdraw",
		provicecode:"/weixin/account/withdraw/provicecode/", //GET省份编码查询城市信息
		citycode:"/weixin/account/withdraw/citycode/",  //GET(citycode传入城市编码,banktype传入银行类型)
		submitEven:"/weixin/account/withdraw/updatebranchinfo"
	};
	function init(){
		//请求模板和数据，并调用回调
		$.render({tpl:[requestData.tpl],data:requestData.data},drawCallback);
	}
	init();
	
	//页面回调
	function drawCallback(data,html){
		$container.html(html);
		bindEvents();
	}
		
	//弹出框操作事件
	var toDog=function(calCent,til){ 
		$.dialog(calCent, {
			type: "bank",
			classNameAdd: "dialog-bank",
			title: {
				name: til,
				closeText:"完成"
			}
		},function(){
			$("ul.lay-sel li").first().addClass("cur");
			$("ul.lay-sel li").on("click",function(){
				var $th=$(this),selLeb=$(".ttn-sel .sel-cur[data-cur='cur']");
				$("ul.lay-sel li").removeClass("cur");
				$th.addClass("cur");
				selLeb.html($th.find(".r").html());
				selLeb.attr("data-id",$th.find(".r").attr("data-id"));
			})
		});
	}
	//获取市和开户行
	var cityBlank=function(url,type,til,star){  
		calCent="<ul class='lay-sel'>";
		$.ajax({
			type:"get",
			url:url,
			success:function(data){
				data=JSON.parse(data);
				for(var i=0;i<data.data.length;i++){
					if(star=="1"){
						calCent+="<li><span class='l'><em></em></span><span class='r' data-id='"+data.data[i].cityCode+"'>"+data.data[i].cityName+"</span></li>";
					}else{
						calCent+="<li><span class='l'><em></em></span><span class='r' data-id='"+data.data[i].branchName+"'>"+data.data[i].branchName+"</span></li>";
					}
				}
				calCent+="</ul>";
				toDog(calCent,til);
				type();
			},
			error:function(jqXHR,textStatus,errorThrown){
				$("#drawSub").css("display","block").html("网络或系统繁忙，请稍后再试！");
			}
		});
	}
	//绑定事件
	function bindEvents(){
		//提现
		$(".ttn-sel").delegate(".sel-cur","click", function() {
			var $th=$(this),sel=$th.closest(".ttn-sel"),idx=$th.index(),til="",calCent="";
			$(".sel-cur").removeAttr("data-cur");
			$th.attr("data-cur","cur");
			if(sel.is(".province")){
				til="选择开户省份";
				calCent="<ul class='lay-sel'>"
				+"<li class='cur'><span class='l'><em></em></span><span class='r' data-id='1'>北京</span></li>"
				+"<li><span class='l'><em></em></span><span class='r' data-id='3'>天津</span></li>"
				+"<li><span class='l'><em></em></span><span class='r' data-id='5'>河北</span></li>"
				+"<li><span class='l'><em></em></span><span class='r' data-id='6'>山西</span></li>"
				+"<li><span class='l'><em></em></span><span class='r' data-id='7'>内蒙古</span></li>"
				+"<li><span class='l'><em></em></span><span class='r' data-id='8'>辽宁</span></li>"
				+"<li><span class='l'><em></em></span><span class='r' data-id='9'>吉林</span></li>"
				+"<li><span class='l'><em></em></span><span class='r' data-id='10'>黑龙江</span></li>"
				+"<li><span class='l'><em></em></span><span class='r' data-id='2'>上海</span></li>"
				+"<li><span class='l'><em></em></span><span class='r' data-id='15'>江西</span></li>"
				+"<li><span class='l'><em></em></span><span class='r' data-id='13'>安徽</span></li>"
				+"<li><span class='l'><em></em></span><span class='r' data-id='16'>山东</span></li>"
				+"<li><span class='l'><em></em></span><span class='r' data-id='12'>浙江</span></li>"
				+"<li><span class='l'><em></em></span><span class='r' data-id='14'>福建</span></li>"
				+"<li><span class='l'><em></em></span><span class='r' data-id='11'>江苏</span></li>"
				+"<li><span class='l'><em></em></span><span class='r' data-id='17'>河南</span></li>"
				+"<li><span class='l'><em></em></span><span class='r' data-id='18'>湖北</span></li>"
				+"<li><span class='l'><em></em></span><span class='r' data-id='19'>湖南</span></li>"
				+"<li><span class='l'><em></em></span><span class='r' data-id='22'>海南</span></li>"
				+"<li><span class='l'><em></em></span><span class='r' data-id='20'>广东</span></li>"
				+"<li><span class='l'><em></em></span><span class='r' data-id='21'>广西</span></li>"
				+"<li><span class='l'><em></em></span><span class='r' data-id='4'>重庆</span></li>"
				+"<li><span class='l'><em></em></span><span class='r' data-id='25'>云南</span></li>"
				+"<li><span class='l'><em></em></span><span class='r' data-id='24'>贵州</span></li>"
				+"<li><span class='l'><em></em></span><span class='r' data-id='23'>四川</span></li>"
				+"<li><span class='l'><em></em></span><span class='r' data-id='26'>西藏</span></li>"
				+"<li><span class='l'><em></em></span><span class='r' data-id='30'>青海</span></li>"
				+"<li><span class='l'><em></em></span><span class='r' data-id='27'>陕西</span></li>"
				+"<li><span class='l'><em></em></span><span class='r' data-id='28'>甘肃</span></li>"
				+"<li><span class='l'><em></em></span><span class='r' data-id='29'>宁夏</span></li>"
				+"<li><span class='l'><em></em></span><span class='r' data-id='31'>新疆区</span></li>"
				+"</ul>";
				toDog(calCent,til);
				$(".city .sel").addClass("sel-cur");
				$(".city .sel").removeAttr("data-cur").html("选择开户支行");
				$(".branch .sel").removeClass("sel-cur").removeAttr("data-cur").html("选择开户支行");
				$(".branch .sel,.city .sel").attr("data-id","");
			}else if(sel.is(".city")){
				var type=function(){$(".branch .sel").addClass("sel-cur");}
				cityBlank(requestData.provicecode+$(".province span.sel").attr("data-id"),type,"选择开户城市","1");
				$(".branch .sel").removeAttr("data-cur").html("选择开户支行");
				$(".branch .sel").attr("data-id","");
			}else{
				var type=function(){};
				var citycode=$(".city span.sel").attr("data-id");
				var banktype=$(".city span.sel").attr("data-type");
				cityBlank(requestData.citycode+citycode+"/banktype/"+banktype,type,"选择开户支行","2");
			}
		});
		$(".wx_draw").delegate(".wx-draw-sub","click", function(event) {
			event.preventDefault();
			var province=$(".province .sel").attr("data-id");
			var cityCode=$(".city .sel").attr("data-id");
			var branchCode=$(".branch .sel").attr("data-id");
			if(province==""||cityCode==""||branchCode==""){
				$("#drawSub").css("display","block").html("请完善开户行资料");
				return false;
			}
			$.ajax({
				type:"post",
				url:requestData.submitEven,
				data:{"provinceCode":province,"provinceName":$(".province .sel").html(),"cityCode":cityCode,"cityName":$(".city .sel").html(),"branchCode":branchCode,"branchName":branchCode},
				success:function(data){
					data=JSON.parse(data);
					if(data.status==1){
						window.location.reload();
					}else{
						$("#drawSub").css("display","block").html(data.errorDetails);
					}
				},
				error:function(jqXHR,textStatus,errorThrown){
					$("#drawSub").css("display","block").html("网络或系统繁忙，请稍后再试！");
				}
			});
			return false;
		});
		
	}
		
		
});