<% var data = it.data; %>
<%
var account = data.account;
/*账户总资产*/
var totalAmount = $.milliFormat(account.totalAmount);
/*可用余额*/
var balance = $.milliFormat(account.balance);
/*冻结资金*/
var freeze = $.milliFormat(account.freeze);
/*待收本金*/
var duePrincipal = $.milliFormat(account.duePrincipal);
/*待收收益*/
var dueInterest = $.milliFormat(account.dueInterest);
/*待收本金笔数*/
var dueCount = account.dueCount;
/*下一个收款日*/
var nextData = data.nextTimeYield;
var repayDate = $.formatTime(nextData.repayDate,"yyyy-MM-dd");
var nextNum = nextData.num;
var nextIncome = nextData.income;
/*充值按钮控制
1 全部展示
2 只展示充值
3 只展示提现（这里用来展示我的银行卡）
4 全部不展示
*/
var btnControl = data.weChatIndexControl;
var rechargeControl = (btnControl==1 || btnControl==2) ? true : false;
var bankCardControl = (btnControl==1 || btnControl==3) ? true : false;
%>
<div class="wx_account_capital">
    <span>账户总资产</span>
    <p><%=totalAmount%>元</p>
</div>
<ul class="wx_account_items clearfix">
    <li>
        <p><span>可用余额</span></p>
        <p><i class="wx_account_org"><%=balance%></i>元</p>
    </li>
    <li>
        <p><span>冻结资金</span></p>
        <p><i><%=freeze%></i>元</p>
    </li>
    <li>
    <%if(dueCount>0){%><a href="/weixin/account/send/invest"><%}%>
        <p><span>待收本金<em>（<%=dueCount%>笔）</em></span></p>
        <p><i><%=duePrincipal%></i>元</p>
    <%if(dueCount>0){%></a><%}%>
    </li>
    <li>
        <p><span>待收收益</span></p>
        <p><i><%=dueInterest%></i>元</p>
    </li>
</ul>
<div class="wx_account_btn wx_flex_btw">
	<%if(rechargeControl){%>
    <p><a href="/weixin/account/torecharge" class="wx_btn_org" id="wxRecharge">充值</a></p>
    <%}%>
    <p><a href="#" class="wx_btn_grey" id="wxDraw">提现</a></p>
</div>
<%if(nextNum>0){%>
<div class="wx_account_table">
    <h3 class="wx_account_table_head">下一个收款日<span><%=repayDate%></span></h3>
    <div class="wx_account_table_body clearfix">
        <ul>
            <li>
                <p>收款项目</p>
                <p><i class="wx_account_org"><%=nextNum%></i>笔</p>
            </li>
            <li>
                <p>待收本息</p>
                <p><em><%=nextIncome%></em>元</p>
            </li>
        </ul>
    </div>
</div>
<%}%>
<div class="wx_account_list">
    <ul>
        <li><a href="/weixin/account/send/info">我的资料</a></li>
        <%if(bankCardControl){%>
        <li><a href="account_bank.html">我的银行卡</a></li>
        <%}%>
        <li><a href="/weixin/account/send/planner">理财师</a></li>
        <li><a href="/weixin/account/send/redbag">我的红包</a></li>
    </ul>
</div>