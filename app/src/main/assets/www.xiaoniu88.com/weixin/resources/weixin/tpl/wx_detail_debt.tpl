<% var data = it.data; %>
<%
    var isWait	= (data.borrowStatus==1)? true : false;		/*倒时计*/
    var isSale 	= (data.borrowStatus==2)? true : false;		/*可以购买*/
    var isFull	= (data.borrowStatus==3)? true : false;		/*满额*/
    var isIncome  = (data.borrowStatus==4)? true : false;	/*收益*/
    var isComplete  = (data.borrowStatus==5)? true : false;	/*已还完*/
    var isFail	=  (data.borrowStatus==6)? true : false;		/*流标*/
    
    /*单位*/
    var unit = (data.isDayThe==1) ? "个月" : "天";
    
    /*倒计时时间*/
    var tenderTimer = [Math.abs(data.tenderTimer),$.formatCountDown(Math.abs(data.tenderTimer))];
    
    /*进度*/
    var dataBorrowAmount = parseFloat((""+data.borrowAmount).replace(/,/g,""));
    var dataHasInvestAmount = parseFloat((""+data.hasInvestAmount).replace(/,/g,""));
    var progress = $.formatProgress(dataBorrowAmount,dataHasInvestAmount);
    progress = progress < 0 ? 0 : (progress >100 ? 100 : progress);
    
    /*是否为新手*/
    var newClass= "";
    if(data.newProduct!="" && data.newProduct!=null && data.newProduct!=0){
    	newClass = "wx_icon_new";
    }
    
    /*vip*/
    var vipClass= "";
    var weixinClass = "";
    if(data.specialArea==3){
   		vipClass = "wx_icon_vip";
    } else if(data.specialArea==4) {
    	weixinClass = "wx_icon_weixin";
    }
    
    /*是否限额*/
    var quota = "";
    var quotaVal = data.quotaAmount;
    if(data.quotaType==1 && quotaVal!="" && quotaVal!=null && parseInt(quotaVal)>0){
    	quota = '<ins class="wx_icon wx_limited">限额</ins>';
    }
    
    /*是否可转让*/
    var assClaim = '<ins class="wx_icon wx_transfer">可转</ins>';
    
    /*是否有奖励*/
    var rebateScale = "";
    if(data.rebateScale != null && data.rebateScale!="" && data.rebateScale>0){
    	rebateScale = '<ins class="wx_icon wx_reward"><ins>+'+data.rebateScale+'%</ins><i>奖</i></ins>';
    }
    
    /*NBA标*/
    var NBA = "";
    if(data.activityType==1){
    	/*是NBA图标时，就一定有奖励，把奖励和NBA图标合并在一起*/
        rebateScale= "";
    	NBA = '<ins class="wx_icon wx_reward_nba2"><ins>+'+data.rebateScale+'%</ins></ins>';
    }
    
    /*还款方式*/
    var paymentMode = "";
    if(data.paymentMode==1){
    	paymentMode = "按月等额本息还款"
    } else if(data.paymentMode==2){
    	paymentMode = "先息后本"
    } else if(data.paymentMode==3){
    	paymentMode = "一次性还款";
    } else if(data.paymentMode==4){
    	paymentMode = "等额本息";
    }
    
    /*发布时间*/
    var publishTime = $.formatTime(data.tenderTime);
    
    /*到期时间*/
    var expireTime = $.formatTime(data.expireDt,"yyyy-MM-dd");
    
    /*起息时间|成立日期*/
    var accrualTime = $.formatTime(data.tenderTime,"yyyy-MM-dd");
    
    /*格式化交易时间*/
    var fullTenderTime = "";
    if(!isWait && !isSale){
    	fullTenderTime = $.formatTime(data.fullTenderTime);
    }
    
    /*计划金额*/
    var borrowAmount = $.milliFormat(dataBorrowAmount);
    
    /*判断是否有登录*/
    var isLogined = true;
    if(data.logined == 0){
    	isLogined = false;
    }
    
    /*readOnly:剩余可投金额小于最小投资额时*/
    var isMinTender = false;
    var leftMoney = parseFloat((""+data.investAmount).replace(/,/g,""));
    if(leftMoney<data.minTenderedSum){
    	isMinTender = true;
    };
    
    /*起投值和最大值*/
    var minTenderedSum = data.minTenderedSum;
    var maxTenderedSum = data.maxTenderedSum;
    var minAndMax = $.milliFormat(minTenderedSum)+"元起投";
    if(maxTenderedSum && maxTenderedSum!="" && maxTenderedSum!=null){
  		minAndMax = $.milliFormat(minTenderedSum)+"-"+$.milliFormat(maxTenderedSum);
    }
%>
<form id="form" action="/weChat/wx_axn_ainvest.do" target="_self" onsubmit="return false;">
  <ul class="wx_detail_info <%=newClass%> <%=vipClass%> <%=weixinClass%>">
    <li class="wx_detail_title"><strong><%=data.borrowTitle%></strong><%=quota%><%=assClaim%><%=NBA%><%=rebateScale%></li>
    <li>
      <p><span><em><%=data.showAnnualRate%></i></em>%</span><span><%=data.showDeadline%><%=unit%></span><span><%=borrowAmount%>元</span><span><%=paymentMode%></span></p>
    </li>
    
    <!--起息日期|发布时间-->
    <%if(isWait || isSale){%>
    <li><span>起息日期：<i><%=accrualTime%></i></span></li>
    <li><span>发布时间：<i><%=publishTime%></i></span></li>
    <%}%>
    <!--end 起息日期|发布时间-->
    
    <!--起息日期|到期时间-->
    <%if(isFull || isIncome){%>
    <li class="wx_half">
    	<span>起息日期：<i><%=accrualTime%></i></span>
    	<span>到期时间：<i><%=expireTime%></i></span>
    </li>
    <%}%>
    <!--end 起息日期|到期时间-->
    
    <!--进度-->
    <%if(isWait || isSale){%>
    <li class="wx_detail_progress" <%if(isWait){%> style="display:none"<%}%>>
      <div class="wx_progress"><span style="width:<%=progress%>%"></span></div>
    </li>
    <li class="wx_flex_btw wx_detail_progress" <%if(isWait){%> style="display:none"<%}%>><span>项目进度<strong><%=progress%><i>%</i></strong></span><span class="wx_detail_account">剩余金额<em><%=data.investAmount%></em>元</span></li>
    <%}%>
    <!--end 进度-->
   
   <%if((isWait || isSale) && quota!="" && quotaVal!="" && parseInt(quotaVal)>0){%>
    <li class="wx_detail_tip">
        <div class="wx_tip2">
            <p><em class="red">注意：</em>本项目每人累计购买的最大金额为<em class="red"><%=quotaVal%>元!</em></p>
        </div>
    </li>
    <%}%>
   
    <%if(isWait){%>
    <!--倒计时-->
    <li class="wx_detail_countdown">
      <span left_time_int="<%=tenderTimer[0]%>"><ins><%=tenderTimer[1]%></ins>后&nbsp;&nbsp;开始购买</span>
    </li>
    <!--end 倒计时-->
    <%}%>
    
    <%if(isWait || isSale){%>
        <%if(isLogined){%>
         	<!--已登录,立即加入-->
            <li class="wx_detail_invest" id="wxInvestBox" <%if(isWait){%> style="display:none"<%}%>>
              <div class="wx_detail_btn">
                 <input type="tel" id="amount" <%if(isMinTender){%> style="color:#999;" readonly="readonly"  value="<%=leftMoney%>" <%}else{%> value="" <%}%> class="input_text" placeholder="<%=minAndMax%>" /><label>元</label>
                 <p><a href="javascript:void(0);" class="wx_btn_org" id="wx_BtnInvest">立即购买</a></p>
              </div>
              <div class="wx_tip" id="wx_tip" style="display:none;"></div>
            </li>
            <!--end 已登录,立即加入-->
        <%} else {%>
            <!--未登录-->
            <li class="wx_detail_invest" id="wxInvestLogin" <%if(isWait){%> style="display:none"<%}%>>
              <div class="wx_detail_btn">
                <div class="wx_detail_nologin">登录后才能进行投资</div>
                <p><a href="login.html?url=<%=encodeURIComponent(location.href)%>" class="wx_btn_org">立即登录</a></p>
              </div>
            </li>
            <!--end 未登录-->
        <%}%>
    <%}%>
    
    <%if(isFull || isIncome){%>
    <!--已售罄-->
    <li class="wx_detail_complete">
        已售罄
        <span><i>成功交易时间：</i><br/><%=fullTenderTime%></span>
    </li>
    <!--end 已售罄-->
    <%}%>
  </ul>
</form>
<div class="wx_list_tab"> <a href="javascript:void(0);" class="select"><span>产品详情</span></a><a href="javascript:void(0);"><span>交易记录</span></a> </div>
<div class="wx_detail_content">
  <ul>
    <li>
      <h4>转让介绍</h4>
      <div class="wx_detail_text">
        <p>债权转让服务是指小牛在线为借款项目的债权出让人和受让人双方提供的居间撮合服务，即已投资小牛在线借款项目的会员，可通过小牛在线网站可将符合条件的借款项目债权转让给小牛在线的其他注册会员，由受让该债权的会员承接该债权在剩余存续期间应享有的收益。“债权转让”服务仅向符合中华人民共和国有关法律法规及小牛在线平台相关规定的合格债权出让人和债权受让人提供。</p>
<p>债权转让服务旨在帮助小牛在线平台的会员提高投资的流动性，会员在需要流动资金时，可以通过转让其名下拥有的符合相应条件的债权给其他会员，从而完成债权转让，获得流动资金。</p>
      </div>
    </li>
  </ul>
    <a href="#" class="wx_detail_link" style="display:none;"><span>查看原始借贷情况</span></a>
</div>
<div class="wx_detail_content wx_trade_record" style="display:none;">
	<ul id="wxDetailRecords"></ul>
    <a href="javascript:void(0);" class="wx_get_more" data-page="2" id="wxGetRecordsMore" style="display:none;">单击加载更多</a>
</div>