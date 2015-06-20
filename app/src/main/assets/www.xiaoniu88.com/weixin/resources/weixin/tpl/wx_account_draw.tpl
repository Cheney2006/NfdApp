<% var data = it; %>
 <%
var type=it.count;
var withdraw = data.withdraw;
/*
    三种场景
    小于1.没有卡，不充提现；
    等于1. 可提现；
    大于1.多张卡，不充计提现；
*/
/*手续费*/
var fee = $.milliFormat(data.fee);
/*真实姓名*/
var realName = withdraw.realName;
/*可用余额*/
var userBalance = $.milliFormat(withdraw.userBalance);
/*银行名称*/
var bankTypeName = withdraw.bankTypeName;
/*卡号*/
var bankCardNo = withdraw.bankCardNo;
/*银行卡状态（0：已绑定状态 4：已开通快捷支付状态）*/
var dueInterest = withdraw.status;
/*是否需要填写支行信息（true:需要 false:不需要*/
var dueCount = withdraw.needBranch;

/*银行卡类型*/
var banktype= withdraw.bankType;

/*充值按钮控制
1 全部展示
2 只展示充值
3 只展示提现
4 全部不展示
*/

%>


<% if(type<1){%>
<div class="wx_recharge wx_recharge3"  id="recharge">
  <div class="wx_account_table2 ttn-lcr">
    <p class="ttn-po">您还未绑定银行卡！<br>请绑定银行卡后再进行操作！</p>
    <a href="account.html" class="wx_btn_org wx-black-index">返回账户总览（5）</a>
  </div>
</div>
<% }else if(type==1){%>
<div class="wx_draw">
    <div class="wx_account_table2 wx_draw_info">
        <h4>提现银行卡</h4>
        <p><span>开户姓名</span><i><%=realName%></i></p>
        <p><span>开户银行</span><i><%=bankTypeName%></i></p>
        <p><span>卡&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号</span><i><%=bankCardNo%></i></p>
    </div>
    <% if(dueCount){%>
    	<div class="wx-line-tb">
            <dl class="ttn-cl-po">
                <dt>提示</dt>
                <dd>在提现前，您的银行卡还需补充开户行资料，请填写完善。</dd>
            </dl>
        </div>
        <div class="wx_deal_pw_form wx-line">
            <div class="input-box wx_deal_box">
                <label class="label label-fl">开户省份</label>
                <div class="ttn-sel province">
                    <span class="sel sel-cur" data-id="" data-cur="">选择开户省份</span>
                </div>
            </div>
            <div class="input-box wx_deal_box">
                <label class="label label-fl">开户城市</label>
                <div class="ttn-sel city">
                    <span class="sel" data-id="" data-type="<%=banktype%>">选择开户城市</span>
                </div>
            </div>
            <div class="input-box wx_deal_box">
               <label class="label label-fl">开户支行</label>
               <div class="ttn-sel branch">
                    <span class="sel" data-id="">选择开户支行</span>
               </div>
            </div>
        </div>
        <div class="wx_tip" id="drawSub"></div>
        <a href="javascript:;" class="wx_btn_org wx-draw-sub">下一步</a>
    <% }else{%>
        <div class="wx_account_table2 wx_draw_info ttn-draw-monry">
            <div class="wx_account_table2_body">
                <p><span>可用余额</span><i><%=userBalance%>元</i></p>
                
                <p class="wx_account_table2_input"><span>提取现金</span><ins class="wx_account_input_box"><input type="tel" class="wx_account_input" maxlength="15" value="" name="" id="" /><em class="wx_account_input_unit">元</em></ins>
                    <i class="po">提现金额不能大于[可用余额 - 手续费]</i>
                </p>
                <p><span style="letter-spacing:7px;">手续费</span><i><%=fee%>元</i><i class="po pd-l">注：手续费将从您的小牛账户余额中扣除</i></p>
                <p class="wx_account_table2_input"><span>提现密码</span><ins class="wx_account_input_box"><input type="text" class="wx_account_input" maxlength="20" value="" name="" id="" /></ins>
                <i class="po pding-l">温馨提示: 请输入平台提现密码，此密码与登录密码不一致！注意不要输入银行卡密码，以免信息泄露!</i>
                </p>
            </div>
            <br/>
        </div>
        <div class="wx_account_btn_box">
            <a href="#" class="wx_btn_org">确认提现</a>
        </div>
        <div class="wx_draw_tip">
            <div class="wx_tip2">
                <p><strong>到账时间说明</strong></p>
                <p>1. 每日（包括节假日）8:00-17:00提交的提现申请，系统将于1小时后自动审核；当日17:00以后提交的提现申请，系统将于次日9:00自动审核；审核后预计3小时内到账；</p>
                <p>2. 大额提现（当日累计提现金额大于100,000元）以及可能存在风险的账户，需工作日人工审核。</p>
            </div>
        </div>
    <% }%>
</div>
<% }else if(type>1){%>
<div class="ttn-more-blank">
	<div class="pging">
        <h3>尊敬的用户</h3>
        <p>看到此页面说明目前<span>您绑定了多张银行卡</span></p>
        <p>为了更多保障您的账户资金安全，小牛在线平台<span>仅限绑定一张银行卡</span></p>
        <p>请用电脑打开小牛在线官网</p>
        <p><span>www.xiaoniu88.com</span></p>
        <p>保留一张银行卡后再操作提现</p>
    </div>
    <a href="account.html" class="wx_btn_org wx-black-index">返回账户总览（5）</a>
</div>










<% }else if(type==12){%>
<div class="wx_recharge" id="recharge">
	<div class="wx_account_table2 wx_draw_info">
        <h4>提现银行卡</h4>
        <p><span>开户姓名</span><i><%=realName%></i></p>
        <p><span>开户银行</span><i><%=bankTypeName%></i></p>
        <p><span>卡&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号</span><i><%=bankCardNo%></i></p>
        <p><span>状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态</span><i>已绑定</i></p>
    </div>
    <dl class="ttn-cl-po">
    	<dt>提示</dt>
        <dd>在提现前，您的银行卡还需补充开户行资料，请填写完善。</dd>
    </dl>
    <div class="wx_deal_pw_form">
        <div class="input-box wx_deal_box">
            <label class="label label-fl">开户省份</label>
            <div class="ttn-sel province">
                <span class="sel sel-cur" data-id="" data-cur="">选择开户省份</span>
            </div>
        </div>
        <div class="input-box wx_deal_box">
            <label class="label label-fl">开户城市</label>
            <div class="ttn-sel city">
                <span class="sel" data-id="">选择开户城市</span>
            </div>
        </div>
        <div class="input-box wx_deal_box">
           <label class="label label-fl">开户支行</label>
           <div class="ttn-sel branch">
                <span class="sel" data-id="">选择开户支行</span>
           </div>
        </div>
    </div>
    <a href="#" class="wx_btn_org ttn-top">下一步</a>
</div>
<% }else if(type==13){%>
<div class="wx_draw">
    <div class="wx_account_table2 wx_draw_info">
        <h4>提现银行卡</h4>
        <p><span>开户姓名</span><i>杨华华</i></p>
        <p><span>开户银行</span><i>招商银行</i></p>
        <p><span>卡&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号</span><i>3226********4887</i></p>
        <p><span>状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态</span><i>已绑定</i></p>
    </div>
    <div class="wx_account_table2 wx_draw_info ttn-draw-monry">
        <div class="wx_account_table2_body">
            <p><span>可用余额</span><i>115.12元</i></p>
            
            <p class="wx_account_table2_input"><span>提取现金</span><ins class="wx_account_input_box"><input type="tel" class="wx_account_input" maxlength="15" value="" name="" id="" /><em class="wx_account_input_unit">元</em></ins>
                <i class="po">提现金额不能大于[可用余额 - 手续费]</i>
            </p>
            <p><span style="letter-spacing:7px;">手续费</span><i>10元</i><i class="po pd-l">注：手续费将从您的小牛账户余额中扣除</i></p>
            <p class="wx_account_table2_input"><span>提现密码</span><ins class="wx_account_input_box"><input type="text" class="wx_account_input" maxlength="20" value="" name="" id="" /></ins>
            <i class="po pding-l">温馨提示: 请输入平台提现密码，此密码与登录密码不一致！注意不要输入银行卡密码，以免信息泄露!</i>
            </p>
        </div>
        <br/>
    </div>
    <div class="wx_account_btn_box">
        <a href="#" class="wx_btn_org">确认提现</a>
    </div>
    <div class="wx_draw_tip">
        <div class="wx_tip2">
            <p><strong>到账时间说明</strong></p>
            <p>1. 每日（包括节假日）8:00-17:00提交的提现申请，系统将于1小时后自动审核；当日17:00以后提交的提现申请，系统将于次日9:00自动审核；审核后预计3小时内到账；</p>
            <p>2. 大额提现（当日累计提现金额大于100,000元）以及可能存在风险的账户，需工作日人工审核。</p>
        </div>
    </div>
</div>
<% }else if(type==14){
        	document.location.href="account_deal_pw.html";
%>
<% }else if(type==15){%>
<div class="wx_recharge wx_recharge3"  id="recharge">
  <div class="wx_account_table2 ttn-lcr">
    <p class="ttn-po ttn-draw-suc">恭喜您,提现成功！</p>
    <a href="#" class="wx_btn_org">返回账户总览（5）</a>
  </div>
  <div class="wx_draw_tip">
        <div class="wx_tip2">
            <p><strong>到账时间说明</strong></p>
            <p>1. 每日（包括节假日）8:00-17:00提交的提现申请，系统将于1小时后自动审核；当日17:00以后提交的提现申请，系统将于次日9:00自动审核；审核后预计3小时内到账；</p>
            <p>2. 大额提现（当日累计提现金额大于100,000元）以及可能存在风险的账户，需工作日人工审核。</p>
        </div>
    </div>
</div>
<%}%>

