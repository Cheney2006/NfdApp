$(function(){
	var $indexWrap = $("#indexWrap");
	
	//request data;
	var requestData = {
		tpl:"tpl/wx_index.tpl",
		data: "/weixin/index"
	};
	
	//初始化
	function init(){
		bindEvents();
		//请求模板和数据，并调用回调
		$.render({type:"POST",tpl:[requestData.tpl],data:requestData.data},indexCallback);
	}
	init();
	
	function indexCallback(data,html){
		$indexWrap.html(html);
		login(data);
		//banner
		banner();
		//进度条
		process();
		countdown(data);
	}
	
	//判断是否登录
	function login(data){
		var balance = data.balance;
		var $btn = $(".wx_top_btn");
		var $balance = $("#wx_topBalance");
		var $myBalance = $("#myBalance");
		var $loginout = $(".wx_top_loginout");
		if(balance=="-1"){
			//未登录
			$btn.show();
			$loginout.hide();
			$balance.hide();
		} else if(balance=="-2"){
			//异常
			$btn.hide();
			$balance.hide();
			$loginout.show();
		} else if(balance>=0){
			//已登录
			$btn.hide();
			$loginout.hide();
			$balance.show();
			$myBalance.html($.milliFormat(data.balance)+"元");
		}
	}
	
	//绑定事件
	function bindEvents(){
		//切换到电脑版事件
		$indexWrap.on("click","#goPC",function(){
			gotoPC();
			return false;
		});
	}
	
	//banner
	function banner(){
		var bullets,bannerLength;	
		bullets = document.getElementById('banner_btn').getElementsByTagName('li');
		bannerLength=bullets.length>2?true:false;
		window.mySwipe = new Swipe(document.getElementById("banner"),{
			auto:3000,
			continuous:true,
			stopPropagation:false,
			callback:function(pos){
				 var on=document.getElementsByClassName("on");
				 if(on.length){
					 on[0].className="";
				 }
				 pos=bannerLength?pos:pos%2;
				 bullets[pos].className = 'on';
			}
		});
		$("#banner").find("img").show();
	}
	
	//圆形进度条
	function process(){
		var borrowJd = $("#borrowJd").val();
		var opt={
			target:"canvas",			//目标id
			radius:25,					//半径
			circle_x:45,				//圆心X坐标
			circle_y:45,				//圆心Y坐标
			circle_inner_width:5,		//内圆弧宽
			circle_inner_color:"#dddddc",	//内圆弧色值
			circle_center_width:5,		//中间圆弧宽
			circle_center_color:"#dadad9",	//中间圆弧色值
			circle_outer_width:8,		//外圆弧宽
			circle_outer_color:"#cfa74a",	//外圆弧色值
			progress_val:borrowJd 			//进度值，必须为0-100
		};
		$.progressCircle(opt);
	}
	
	//倒计时
	function countdown(data){
		var ctd = $(".index_count_down");
		if(ctd.length>0){
			ctd.countdown("left_time_int",function($this,str){
				$this.find("ins").html(str);
				if(str=="0秒"){
					$this.next().show();
					$this.remove();
				}
			},true);
		}
	}
	
	//打开电脑版
	function gotoPC(){
		window.sessionStorage.setItem("platformType", "pc");
		window.location.href="/portal/index";
	}
});


