<% var data = it; %>
<%
	var errorCode = data.errorCode;
    if(errorCode=="user_not_login"){
    	return "";
    }
	/*银行卡张数*/
	var count = data.count;
    var banks,isSupport=false;
    if(count==1){
        /*银行卡信息*/
        var card = data.card;
        /*状态*/
        var status = card.status;
        var statusText = ["未绑定","未开通"];
        if(status==0){
            statusText = ["已绑定","未开通"];
        } else if(status==4){
            statusText = ["已绑定","已开通"];
        }
        /*支付认证支付银行*/
        banks = {
            "ICBC":	"工商银行",
            "ABC": "农业银行",
            "BOC": "中国银行",
            "CCB": "建设银行",
            "CMB": "招商银行",
            "SPDB": "浦发银行",
            "CIB": "兴业银行",
            "CEB": "光大银行",
            "CGB": "广发银行",
            "GDB": "广发银行",
            "PAB": "平安银行",
            "PINGAN": "平安银行",
            "HXB": "华夏银行",
            "CMBC": "民生银行",
            "BOS": "上海银行"
        };
        isSupport = card.bankType in banks ? true : false;
        
        /*如果用户已绑定的银行卡不支持认证支付，支付状态为-未开通*/
        if(!isSupport){
        	statusText[1] = "未开通";
        }
    }
    /*充值按钮控制
    1 全部展示
    2 只展示充值
    3 只展示提现（这里用来展示开通认证支付）
    4 全部不展示
    */
    var btnControl = data.weChatIndexControl;
    var rechargeControl = (btnControl==1 || btnControl==2) ? true : false;
    var drawControl = (btnControl==1 || btnControl==3) ? true : false;
%>
<%if(count==0){%>
	<!--还未绑卡-->
    <div class="wx_bank_tip wx_bank_tip2">
    	<p class="wx_bank_tip_title">您还未绑定银行卡！</p>
        <p>请使用电脑登陆小牛在线官网<span class="yellow">www.xiaoniu88.com</span>进行绑卡</p>
    </div>
<%} else if(count==1){%>
	<div class="wx_account_table2 wx_bank_info">
        <p><span>开户姓名</span><i><%=data.realName%></i></p>
        <p><span>开户银行</span><i><%=card.bankTypeName%></i></p>
        <p><span>卡&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号</span><i><%=card.bankCardNo%></i></p>
        <p><span>状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态</span><i><%=statusText[0]%></i></p>
        <p><span>认证支付</span><i><%=statusText[1]%></i></p>
    </div>
    <%if(status==4){%>
        <!--立即充值-->
        <div class="wx_bank_recharge">
        	<%if(rechargeControl){%>
            <a href="/weixin/account/torecharge" class="wx_btn_org">立即充值</a>
            <%}%>
        </div>
    <%} else if(status==0 && isSupport){%>
    	 <!--认证支付-->
        <div class="wx_bank_quick">
        	<%if(drawControl){%>
            <a href="/weixin/resources/weixin/account_bank_auth.html" class="wx_btn_org">开通认证支付</a>
            <dl class="wx_bank_faq">
                <dt>Q：为什么要开通认证支付？</dt>
                <dd>开通认证支付后就可以使用小牛在线微信版进行充值，无需登录网银操作，方便快捷。</dd>
                <dt>Q：开通认证支付是否安全？</dt>
                <dd>通过认证支付充值的资金，只能提现到原充值银行卡，即同卡进出，以保障资金安全。</dd>
                <dt>Q：哪些银行支持认证支付？</dt>
                <dd>工商银行、农业银行、中国银行、建设银行、招商银行、浦发银行、兴业银行、光大银行、广发银行、平安银行、华夏银行、民生银行、上海银行。</dd>
            </dl>
            <%}%>
        </div>
    <%}%>
<%} else {%>
	<!--绑定多张卡-->
    <div class="wx_bank_tip wx_bank_tip2">
    	<p class="wx_bank_tip_title">您绑定了多张银行卡！</p>
        <p>请使用电脑登陆小牛在线官网<span class="yellow">www.xiaoniu88.com</span>选定一张银行卡</p>
    </div>
<%}%>
