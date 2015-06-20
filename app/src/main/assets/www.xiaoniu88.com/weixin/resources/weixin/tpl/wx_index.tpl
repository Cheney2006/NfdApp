<% 
	var data = it.indexPtdDTO; 
	var banner = it.bannerDTO;
%>
<%
	/*倒时计*/
    var isWait	= (data.productStatus==1)? true : false;
    
    /*可以购买*/
    var isSale = (data.isFull=="00") ? true : false;

	/*满额*/
    var isFull = (data.isFull=="01") ? true : false;
    
    /*类型,1-常规产品,2-债权转让,3-安心牛*/
    var pType =  data.pType;
    
    var weixinClass = "";
    var newClass= "";
    var vipClass= "";
    if(data.makeArea){
    	/*微信专享*/
        if(data.makeArea==1) {
            weixinClass = "wx_icon_weixin";
        } 
        /*是否为新手*/
        if(data.makeArea==2){
            newClass = "wx_icon_new";
        }
        /*vip*/
        if(data.makeArea==3){
            vipClass = "wx_icon_vip";
        }
    }
    /*是否限额*/
    var quota = "";
    if(data.makeQuota && data.makeQuota==1){
        quota = '<ins class="wx_icon wx_limited">限额</ins>';
    }
    
    /*倒计时时间*/
    var tenderTimer = [Math.abs(data.tenderTimer),$.formatCountDown(Math.abs(data.tenderTimer))];

    /*计划金额*/
    var borrowAmount = $.milliFormat(data.productAmount);
    
    /*起投金额*/
    var minAmount = $.milliFormat(data.minAmount);
    
    /*年化收益*/
    var annualRate = "";
    /*是否可转让*/
    var assClaim = "";
    /*是否有奖励*/
    var rebateScale = "";
    /*NBA标*/
    var NBA = "";
	/*期限*/
	var deadline = data.line;
    /*散标或债权URL,默认是散标*/
    var url = "/weixin/resources/weixin/detail_sanbiao.html?id="+data.id;
    
    /*单位*/
    var unit = "个月";
    
    if(pType==3){
    	/*安心牛*/
        annualRate = data.minAnnualRate +" - "+data.maxAnnualRate;
    } else {
    	if(data.isDay ==0){
        	unit = "天";	
        }
    	/*散标或债权*/
    	annualRate = data.minAnnualRate;
        if(data.assClaim == 1 && data.pType==6){
            annualRate = data.showAnnualRate;
            deadline = data.showDeadline; 
            unit = "天";
            url = "/weixin/resources/weixin/detail_debt.html?id="+data.id;
        }
        
        if(data.assClaim==1){
            assClaim = '<ins class="wx_icon wx_transfer">可转</ins>';
        }
        
        if(data.rebateScale != null && data.rebateScale!="" && data.rebateScale>0){
            rebateScale = '<ins class="wx_icon wx_reward"><ins>+'+data.rebateScale+'%</ins><i>奖</i></ins>';
        }
        
        if(data.activityType==1){
            /*是NBA图标时，就一定有奖励，把奖励和NBA图标合并在一起*/
            rebateScale= "";
            NBA = '<ins class="wx_icon wx_reward_nba2"><ins>+'+data.rebateScale+'%</ins></ins>';
        }
    }
%>
<div class="banner_box" id="banner">
  <ul class="banner">
  	<%for(var b=0,blen=banner.length; b<blen; b++){%>
     <li>
     <%if(banner[b].url && banner[b].url!=="" && banner[b].url!==null){%>
     	<a href="<%=banner[b].url%>"><img src="<%=banner[b].imgPath%>"></a>
     <%}else {%>
        <img src="<%=banner[b].imgPath%>">
     <%}%>
     </li>
    <%}%>
  </ul>
  <div class="banner_bottom">
    <ul class="banner_btn" id="banner_btn">
      <%for(var b=0,blen=banner.length; b<blen; b++){%>
      <li <%if(b==0){%>class='on' <%}%>></li>
      <%}%>
    </ul>
  </div>
</div>
<div class="index_list">
  <a href="/weixin/resources/weixin/list.html" class="index_more"></a>
  <div class="index_item <%=newClass%> <%=vipClass%> <%=weixinClass%>">
    <div class='index_item_content'>
      <input type="hidden" id="borrowJd" value="<%=data.productSchedule%>" />
      <div class='index_item_title'>
        <h2 class="wx_flex_btw"><span><%=data.productTitle%></span><em class="wx_icon_box"><%=quota%><%=assClaim%><%=NBA%><%=rebateScale%></em></h2>
        <div class='index_progress'>
          <canvas id="canvas" width='90' height='90'></canvas>
          <div class='index_progress_text'><%=data.productSchedule%><span>%</span></div>
        </div>
      </div>
      <div class='index_item_detail'>
        <ul>
            <li class='index_item_text'>年化收益率</li>
            <li class='index_item_num1'><%=annualRate%>%</li>
            <li class='index_item_amount'>计划金额：<%=borrowAmount%> 元 </li>
        </ul>
        <ul>
            <li class='index_item_text'>期限 </span>
            <li class='index_item_time'>
            	<span class='index_item_num2' <%if(deadline >=100){%>style="padding:0 3px;"<%}%>><%=deadline%></span><span class="index_time_unit"><%=unit%></span>
            </li>
            <li class='index_item_amount'>起投金额：<%=minAmount%>元</li>
        </ul>
      </div>
      <!--倒计时-->
      <%if(pType==3){%>
      	  <!--安心牛产品-->
          <%if(isWait){ %>
            <span class='index_item_tip index_count_down' left_time_int="<%=tenderTimer[0]%>"><ins><%=tenderTimer[1]%></ins>后&nbsp;&nbsp;开始加入</span>
            <div style="display:none;">
                <a class='wx_btn_org' href="/weixin/resources/weixin/detail_axn.html?id=<%=data.id%>">马上加入</a>
                <span class='index_item_join'>已有<%=data.count || 0%>人加入</span>
            </div>
          <%} else {%>
              <!--销售中-->
              <%if(isSale){%>
                <a class='wx_btn_org' href="/weixin/resources/weixin/detail_axn.html?id=<%=data.id%>">马上加入</a>
              <%}%>
              <!--已满额-->
              <% if(isFull){ %>
                <span class='index_item_tip'>您来晚啦，已满额！</span>
              <%}%>
              <span class='index_item_join'>已有<%=data.count%>人加入</span>
          <%}%>
      <%} else { %>
      	 <%
         	isWait = (data.productStatus==1) ? true : false;
         	isSale = (data.productStatus==2) ? true : false;
         	var isIncome = (data.productStatus==4) ? true : false;
         %>
      	 <!--散标或债权产品-->
      	  <%if(isWait){ %>
            <span class='index_item_tip index_count_down' left_time_int="<%=tenderTimer[0]%>"><ins><%=tenderTimer[1]%></ins>后&nbsp;&nbsp;开始购买</span>
            <div style="display:none;">
                <a class='wx_btn_org' href="<%=url%>">立即购买</a>
                <span class='index_item_join'>已有<%=data.count || 0%>购买</span>
            </div>
          <%} else {%>
              <!--销售中-->
              <%if(isSale){%>
                <a class='wx_btn_org' href="<%=url%>">立即购买</a>
              <%}%>
              <%/*已售罄*/
           	  if(isIncome){ %>
              	<span class='index_item_tip'>已售罄！</span>
              <%}%>
              <span class='index_item_join'>已有<%=data.count%>购买</span>
          <%}%>
      <%}%>
    </div>
  </div>
</div>
<%/*判断是否由微信浏览器访问,如果是则隐藏 切换到电脑版*/
if(!navigator.appVersion.match(/MicroMessenger/i)){ %>
<div class="PCstyle"><a href="javascript:void(0);" id="goPC"><span>切换到电脑版</span></a></div>
<%};%>
