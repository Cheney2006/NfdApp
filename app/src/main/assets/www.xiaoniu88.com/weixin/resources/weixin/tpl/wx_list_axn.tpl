<% var data = it.relievedList; %>
<ul class="wx_list_tabContent" id="wx_axn_list">
<%for(var i=0,ilen=data.length; i<ilen; i++){ %>
    <%
    
    var isWait	= (data[i].borrowStatus==1)? true : false;		/*倒时计*/
    var isSale 	= (data[i].borrowStatus==2)? true : false;		/*可以购买*/
    var isFull	= false;		/*满额*/
    var isIncome  = false;	/*收益*/
    var isComplete  = (data[i].borrowStatus==5)? true : false;	/*已还完*/
    var isFail	=  (data[i].borrowStatus==6)? true : false;		/*流标*/
    
    
    /*安心牛满额和收益中的状态*/
    if(data[i].borrowStatus==4){
        if(data[i].nowTime>=data[i].accrualTime){
     		/*收益中*/
            isIncome = true;
        } else {
        	/*满额*/
            isFull = true;
        }
    }
    
    /*不调用已还完和流标的产品*/
    if(isComplete || isFail){ 
    	continue;
    }
    
    /*总的状态样式*/
    var stateClass="";
    if(!isWait && !isSale){
    	stateClass = " wx_axn_end";
    };
    
    /*期限状态样式*/
    var dateClass="";
    if(isWait || isSale){
    	dateClass = "wx_list_"+ data[i].deadline;	
    }
    /*期限大于10时，改变字体大小为28px*/
    var dateClassEx = "";
    if(data[i].deadline >= 10){
    	dateClassEx = "wx_list_fs28";
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
    if(data[i].quotaType==1){
    	quota = '<ins class="wx_icon wx_limited">限额</ins>';
    }
    
    /*vip*/
    var vipClass= "";
    var weixinClass = "";
    if(data[i].specialArea==3){
   		vipClass = " wx_icon_vip";
    } else if(data[i].specialArea==4) {
    	weixinClass = " wx_icon_weixin";
    }
    
    /*计划金额*/
    var borrowAmount = $.milliFormat(data[i].borrowAmount);
    
    /*详情页URL*/
    var url = "detail_axn.html?id="+data[i].productId;
 
    %>
    <li class="wx_list_box wx_list_axn<%=stateClass%><%=newClass%><%=vipClass%><%=weixinClass%>">
        <a href="<%=url%>">
            <div class="wx_list_m <%=dateClass%> <%=dateClassEx%>">
            	<span class="wx_list_date"><%=data[i].deadline%></span> <span class="wx_list_text"><em><%=data[i].deadline%><%=unit%></em>安心牛</span>
            </div>
            <div class="wx_list_info">
            	<p><strong><%=data[i].productName%></strong><em class="wx_icon_box"><%=quota%></em></p>
            	<p class="wx_flex">
                	<span><i><%=data[i].minAnnualRate%>-<%=data[i].maxAnnualRate%></i>%</span>
                    <span>计划金额 <%=borrowAmount%>元</span>
                </p>
                <%
                /*倒计时*/
                if(isWait){ %>
                <p><span class="wx_list_countdown" left_time_int="<%=tenderTimer[0]%>"><ins><%=tenderTimer[1]%></ins>后&nbsp;&nbsp;开始加入</span></p>
                <%};%>
                
                <%
                /*可以购买*/
                if(isSale || isWait){ %>
                <div class="wx_progress"><span style="width:<%=progress%>%"></span><em>进度<ins><%=progress%>%</ins></em></div>
                <%};%>
                
                <%/*满额*/
                if(isFull){%>
                <p class="wx_flex_btw">
                    <span>您来晚啦，已满额!</span>
                    <span>已有<%=data[i].memberQuantity%>人加入</span></p>
                </p>
                <%}%>
                
                <%/*收益中*/
                if(isIncome){%>
                <p class="wx_flex_btw">
                    <span>收益中</span>
                    <span>已有<%=data[i].memberQuantity%>人加入</span></p>
                </p>
                <%}%>
            </div>
        </a>
   </li>
<%};%>
</ul>