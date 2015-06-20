<% var data = it; %>
<%
	var errorCode = data.errorCode;
    if(errorCode=="user_not_login"){
    	return "";
    }
	/*银行卡信息*/
    var card = data.card;
    var bankType = card.bankType;
%>
<ul class="wx_bank_list">
    <li><span>开户姓名</span><i><%=data.realName%></i></li>
    <li><span>身份证号码</span><i><%=data.idNO%></i></li>
    <li class="wx_bank_auth_tip"><span>开户银行</span><i><%=card.bankTypeName%></i></li>
    <li><span>银行卡号</span><i><%=card.bankCardNo%></i></li>
    <li class="wx_bank_list_input">
        <span>银行预留手机号码</span>
        <div class="wx_bank_auth_box" id="mobileInput"><input class="input-text-2 input-no-icon" type="tel" value="" maxlength="11" id="mobile" name="mobile" /></div>
        <div class="wx_tip" id="mobileTip" style="display:none"></div>
    </li>
    <li class="wx_bank_list_input">
        <span>验&nbsp;&nbsp;证&nbsp;&nbsp;码</span>
        <div class="input-code-box">
            <input class="input-text-2 input-no-icon input-readonly" type="tel" value="" maxlength="6" id="code" name="code" readonly="readonly" placeholder="请获取验证码" style="padding-left:8px;" />
            <a href="javascript:void(0);" class="input-code-btn" id="codeBtn">获取验证码</a>
        </div>
        <div class="wx_tip" id="codeTip" style="display:none"></div>
    </li>
</ul>
<div class="wx_bank_auth_agree">
    <input type="checkbox" id="agree" name="agree" checked="" style="display:none;">
    <span class="input-check-img input-checked-img"></span>我已阅读并同意<a href="/weixin/resources/weixin/account_bank_auth_terms.html">《快钱支付服务协议》</a>
   
</div>
<div class="wx_bank_auth_submit">
	<div class="wx_tip" id="submitTip" style="display:none"></div>
    <%
        var confirmTip = "为了验证银行卡，将从您的银行卡转出 <strong style='color:#ff864a;'>1 </strong>元并充值到您的投资账户中。";
    %>
    <a href="javascript:void(0);" class="wx_btn_org wx_bank_auth_btn2" id="wxBankAuthSubmit" data-confirm="<%=confirmTip%>">立即开通</a>
</div>