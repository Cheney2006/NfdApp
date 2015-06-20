<% var data = it.productList; %>
<ul class="wx_list_tabContent" id="wx_sanbiao_list">
<%for(var i=0,ilen=data.length; i<ilen; i++){ %>
    <%
    
    var isWait	= (data[i].borrowStatus==1)? true : false;		/*倒时计*/
    var isSale 	= (data[i].borrowStatus==2)? true : false;		/*可以购买*/
    var isFull	= (data[i].borrowStatus==3)? true : false;		/*满额*/
    var isIncome  = (data[i].borrowStatus==4)? true : false;	/*收益*/
    var isComplete  = (data[i].borrowStatus==5)? true : false;	/*已还完*/
    var isFail	=  (data[i].borrowStatus==6)? true : false;		/*流标*/
    
    /*不调用已还完和流标的产品*/
    if(isComplete || isFail){ 
    	continue;
    }
    
    /*总的状态样式*/
    var stateClass="";
    if(!isWait && !isSale){
    	stateClass = " wx_sanbiao_end";
    };
    
    /*单位*/
    var unit = (data[i].isDayThe==1) ? "个月" : "天";
    
    /*倒计时时间*/
    var tenderTimer = [Math.abs(data[i].tenderTimer),$.formatCountDown(Math.abs(data[i].tenderTimer))];
    
    /*进度*/
    var progress = $.formatProgress(data[i].borrowAmount,data[i].hasInvestAmount);
    progress = progress < 0 ? 0 : (progress >100 ? 100 : progress);
    
    /*是否为新手*/
    var newClass= "";
    if(data[i].isCustom !="" && data[i].isCustom !=null && data[i].isCustom!=0){
    	newClass = " wx_icon_new";
    }
    /*是否限额*/
    var quota = "";
    var quotaVal = "";
    if(data[i].quotaType==1){
    	quota = '<ins class="wx_icon wx_limited">限额</ins>';
    }
    /*是否可转让*/
    var assClaim = "";
    if(data[i].assClaim==1){
    	assClaim = '<ins class="wx_icon wx_transfer">可转</ins>';
    }
    /*是否有奖励*/
    var rebateScale = "";
    if(data[i].rebateScale != null && data[i].rebateScale!="" && data[i].rebateScale>0){
    	rebateScale = '<ins class="wx_icon wx_reward"><ins>+'+data[i].rebateScale+'%</ins><i style="color:#fff;">奖</i></ins>';
    }
    /*NBA标*/
    var NBA = "";
    if(data[i].activityType==1){
    	/*是NBA图标时，就一定有奖励，把奖励和NBA图标合并在一起*/
        rebateScale= "";
    	NBA = '<ins class="wx_icon wx_reward_nba2"><ins>+'+data[i].rebateScale+'%</ins></ins>';
    }
    
   /*vip*/
    var vipClass= "";
    var weixinClass = "";
    if(data[i].specialArea==3){
   		vipClass = " wx_icon_vip";
    } else if(data[i].specialArea==4) {
    	weixinClass = " wx_icon_weixin";
    }
    
     /*还款方式*/
    var paymentMode = "";
    if(data[i].paymentMode==1){
    	paymentMode = "按月等额本息还款"
    } else if(data[i].paymentMode==2){
    	paymentMode = "先息后本"
    } else if(data[i].paymentMode==3){
    	paymentMode = "一次性还款";
    } else if(data[i].paymentMode==4){
    	paymentMode = "等额本息";
    }
    /*格式化交易时间*/
    var fullTenderTime = "";
    if(isIncome){
    	fullTenderTime = $.formatTime(data[i].fullTenderTime);
    }
    
    /*计划金额*/
    var borrowAmount = $.milliFormat(data[i].borrowAmount);
    
    /*详情页URL*/
    var url = "";
    if(data[i].assClaim == 1 && data[i].proType==6){
    	url = "detail_debt.html?id="+data[i].productId;
    } else {
    	url = "detail_sanbiao.html?id="+data[i].productId;
    }
    
    /*债权转让年利率*/
    var annualRate = data[i].annualRate;
    var deadline = data[i].deadline;
    if(data[i].assClaim == 1 && data[i].proType==6){
        annualRate = data[i].showAnnualRate;
        deadline = data[i].showDeadline; 
        unit = "天";
    }
    %>
     <li class="wx_list_box wx_list_sanbiao<%=stateClass%><%=newClass%><%=vipClass%><%=weixinClass%>">
        <a href="<%=url%>">
            <div class="wx_list_info wx_list_info2">
                <p><strong><%=data[i].productName%></strong><em class="wx_icon_box"><%=quota%><%=assClaim%><%=NBA%><%=rebateScale%></em></p>
                <p class="wx_flex_btw">
                	<span> <%=borrowAmount%>元</span>
                    <span><%=deadline%><%=unit%></span>
                    <span><i><%=annualRate%></i>%</span>
                    <%
                    /*在售或倒计时，在一行*/
                    if(isWait || isSale || isIncome){%>
                    	<span><%=paymentMode%></span>    
                    <%}%>
                </p>
                
                <%/*倒计时*/
                if(isWait){ %>
                <p><span class="wx_list_countdown" left_time_int="<%=tenderTimer[0]%>"><ins><%=tenderTimer[1]%></ins>后&nbsp;&nbsp;开始购买</span></p>
                <%};%>
                
                <%
                /*可以购买*/
                if(isSale || isWait){ %>
                <div class="wx_progress"><span style="width:<%=progress%>%"></span><em>进度<ins><%=progress%>%</ins></em></div>
                <%};%>
                
                <%/*已售罄*/
                if(isIncome){ %>
                <p class="wx_flex_btw"><span>已售罄</span><span>成功交易时间：  <%=fullTenderTime%></span></p>
                <%}%>
            </div>
           
        </a>
     </li>
<%};%>
</ul>