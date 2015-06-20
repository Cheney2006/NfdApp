<% var data = it || {}; %>
<% 
    /*
    -2	未登录
	-1	获取信息错误
	1	交易密码为空
	2	银行卡未鉴权
	3	用户存在多张卡
    0	绑卡成功，且已鉴权
    */
	var type = data.responseType;
    /*未登录,回调里进行跳转*/
	if(type=="-2"){
    	return "";
    }
    /*未设置交易密码,回调跳转到交易密码页面*/
    if(type==1){
    	return "1";
    }
    /*银行提示信息,[0]-单笔限额数,空为不限额,[1]-提示信息*/
    var tips = {
        "ICBC":	["5000","单笔5000，单日5000，单月5万"], 				/*工商银行*/
        "ABC":  ["","无限额，交易金额大于1万暂不支持退货，撤销"],	/*农业银行*/
        "BOC":  ["50000","单笔限额5万，单日限额20万"],					/*中国银行*/
        "CCB":  ["10000","单笔限额1万，单日限额1万，单月限额5万"],		/*建设银行*/
        "CMB":  ["","无限额"],									/*招商银行*/
        "SPDB": ["","无限额，交易金额大于2万暂不支持退货，撤销"],	/*浦发银行*/
        "CIB":  ["","无限额"],									/*兴业银行*/
        "CEB":  ["5000","单笔限额5000，单日限额5000"],				/*光大银行*/
        "CGB":  ["","无限额"],									/*广发银行*/
        "GDB":  ["","无限额"],									/*广发银行*/
        "PAB":  ["","无限额，交易金额大于5000不支持退货"],			/*平安银行*/
        "PINGAN":  ["","无限额，交易金额大于5000不支持退货"],			/*平安银行*/
        "HXB":  ["","无限额"],									/*华夏银行*/
        "CMBC": ["5000","单笔限额5000，单日限额5000"],				/*民生银行*/
        "BOS":  ["5000","单笔5000，单日10000，单月20000"]			/*上海银行*/
    };
    var tip=tips[it.bankType];
    if(!tip){
    	type=5;
    }
%>
<div class="wx_recharge_content" id="rechargeContent">
    <%if(type=="4"){%>
        <!--还未绑卡-->
        <div class="wx_bank_tip wx_bank_tip2">
            <p class="wx_bank_tip_title">您还未绑定银行卡！</p>
            <p>请使用电脑登陆小牛在线官网 <span class="yellow">www.xiaoniu88.com</span>进行绑卡</p>
        </div>
    <%} else if(type=="5"){%>
        <!--绑卡不支持认证支付-->
        <div class="wx_bank_tip wx_bank_tip2 wx_bank_tip3">
            <p>请使用电脑登陆小牛在线官网 <span class="yellow">www.xiaoniu88.com</span>进行操作</p>
        </div>
    <%} else if(type=="3"){%>
        <!--绑定多张卡-->
        <div class="wx_bank_tip wx_bank_tip2">
            <p class="wx_bank_tip_title">您绑定了多张银行卡！</p>
            <p>请使用电脑登陆小牛在线官网 <span class="yellow">www.xiaoniu88.com</span>选定一张银行卡</p>
        </div>
    <% } else if(type=="2"){%>
        <!--已经绑卡，但未鉴权-->
        <div class="wx_account_wrap wx_recharge_b1">
            <h4>充值方式一 : 认证支付</h4>
            <div class="wx_recharge_tip">
                <p>您还未开通认证支付，开通后即可使用微信版充值。</p>
            </div>
            <div class="wx_recharge_btn">
                <a href="/weixin/resources/weixin/account_bank_auth.html" class="wx_btn_org">开通认证支付</a>
            </div>
        </div>
        <div class="wx_account_wrap">
            <h4>充值方式二 : 网银充值</h4>
             <div class="wx_recharge_tip">
                <p>请使用电脑登录小牛在线官网 <span class="yellow">www.xiaoniu88.com</span>操作</p>
            </div>
        </div>
    <%} else if(type==0) {%>
        <!--可以正常充值-->
        <div class="wx_account_table2 wx_recharge_b1">
          <h4>充值方式一 : 认证支付</h4>
          <p><span>银&nbsp;&nbsp;行&nbsp;&nbsp;卡</span><i><%=data.bankTypeName%> <%=data.bankCardNo%></i></p>
          <%if(tips[data.bankType] && tips[data.bankType][0]!==""){%>
            <p class="wx_accoutn_table2_tip wx_recharge_bank_tip"><%=tips[data.bankType][1]%></p>
          <%}%>
        </div>
        <div class="wx_account_table2 wx_draw_info wx_recharge">
          <p class="wx_account_table2_input"><span>充值金额</span><ins class="wx_account_input_box">
            <input type="tel" class="wx_account_input" maxlength="15" value="" name="money" id="money" data-quota="<%=tips[data.bankType][0]%>" data-bank="<%=data.bankTypeName%>" />
            <em class="wx_account_input_unit">元</em></ins></p>
          <div class="wx_tip" id="moneyTip" style="display:none;"></div>
        </div>
        <div class="wx_account_table2 wx_draw_info wx_recharge">
          <p class="wx_account_table2_input"><span>交易密码</span><ins class="wx_account_input_box">
            <input type="password" class="wx_account_input" maxlength="20" value="" name="tradePass" id="tradePass" placeholder="请输入交易密码(非银行密码)" />
            </ins></p>
          <div class="wx_tip" id="passTip" style="display:none;"></div>
        </div>
        <div class="wx_account_table2 wx_draw_info wx_recharge_fix3">
          <p><span style="letter-spacing:7px;">手续费</span><i>0元</i></p>
          <p class="wx_accoutn_table2_tip">(2015.6.30日前充值免手续费)</p>
        </div>
        <div  class="wx_account_wrap wx_recharge_b1">
          <div id="error-box" class="wx_tip" style="display:none;"></div>
          <div class="wx_recharge_btn2">
            <a href="#" class="wx_btn_org" id="wxRechargeSubmit">确认充值</a>
          </div>
        </div>
        <div class="wx_account_wrap wx_recharge_info">
          <h4  class="wx_title_v2">充值方式二 : 网银充值</h4>
          <p class="wx_recharge_fix2">请使用电脑登录小牛在线官网 <span class="yellow">www.xiaoniu88.com</span>操作</p>
        </div>
      </div>
    <%} else {%>
        <!--系统异常，暂时显示为空白-->
    <%} %>
</div>
<!--提交充值，后台超时:1.请求后台网络超时（10秒）2.后台返回超时错误码-->
<div  class="wx_recharge_tip wx_recharge" id="rechargeError" style="display:none;padding-top:20px;">
<p>由于网络延时，您的充值结果尚未确认，请稍后进入"我的账户"查询到账情况，如果有疑问请拨打客服热线400 777 1268。</p>
</p>
<div class="wx_account_btn_box"> <a href="account.html" class="wx_btn_org">我的账户</a> </div>
</div>