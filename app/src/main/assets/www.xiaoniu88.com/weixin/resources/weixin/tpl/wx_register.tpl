<% var data = it; %>
<%
	var refferee = data.refferee || "";
%>
<div class="register-form1">
<form action='weChat/wx_regtwo.do' method="post" name="pageform" id="pageform">
    <div class="input-box">
      <label class="label label-first">手机号码</label>
      <input class="input-text register-mobile" type='tel' maxlength="11" name="mobile" id="mobile" placeholder="11位长度手机号码" />
      <div class="input-tip"></div>
    </div>
    <div class="wx_tip" style="display:none;"></div>
    <div class="input-box">
      <label class="label">登录密码</label>
      <input type='hidden' id="encryptPassword" value="" />
      <input class='input-text register-password' type='text' maxlength="20" name="password" id="password" onpaste="return false" oncontextmenu="return false" oncopy="return false" oncut="return false" placeholder="输入密码" />
      <div class="input-tip"></div>
      <span class="input-pass-hide">隐藏</span>
    </div>
    <div class="wx_tip" style="display:none;"></div>
    <div class="input-box">
      <%if(refferee!=="" && refferee!==null){%>
      	<input class='input-text' value="<%=refferee%>" type='hidden' maxlength="20" name="refferee" id="refferee"/>
      <%} else {%>
      <label class="label">推荐人</label>
      <div class="ref-box">
        <div class="ref-check" id="refCheck"><i>无</i><i>有</i></div>
        <input class='input-text' type='text' maxlength="20" name="refferee" id="refferee" placeholder="推荐人用户名或手机号" style="visibility:hidden" />
        <div class="input-tip"></div>
      </div>
      <%}%>
    </div>
    <div class="wx_tip" style="display:none;"></div>
    <div class="wx_tip" style="display:none; position:relative; top:10px; "></div>
    <div class="input-btn"> <a href="javascript:void(0);" class='wx_btn_org' id="step_one">获取短信验证码</a> </div>
    <div class="input-check">
      <input type='checkbox' id='agree' name='agree' checked style="display:none;">
      <span class="input-check-img input-checked-img"></span> 我已阅读并同意<a href="terms.html" class="wx_blue" id="wxTerms"> 《使用条款》</a>和<a href="terms_privacy.html" class="wx_blue"  id="wxTermsPrivacy">《隐私条款》</a>
  	</div>
</form>
</div>
<div class="register-form2" style="display:none;">
     <div class='wx_step2_tip'>已向您的手机 <span id='phone'></span> 发送短信，请输入您收到的验证码。</div>
     <form action='weChat/wx_reglast.do' method="post" name="pageform" id="pageform2">
         <div class="input-box code-box">
            <input class='input-text input-code' type='tel' maxlength="4" name="code" id="code" placeholder="输入验证码" />
           	<a href="javascript:void(0);" class="wx_btn_blue code-btn" id="reSend" left_time_int="60">重发短信</a>
        </div>
        <div class='wx_step2_tip wx_step2_voice'>如果您未收到验证码请<a href="javascript:void(0);" class='wx_blue' id="sendVoice">使用语音验证</a></div>
        <div class='wx_step2_tip wx_step2_voice' style="display:none;">请注意接听<span class='wx_phone'> 400 777 1268</span> 的来电</div>
        <div class="wx_tip" style="margin-bottom:10px; margin-top:0; display:none;"></div>
        <a href="javascript:void(0);" class='wx_btn_org' id="step2Register">完成注册</a>
     </form>
</div>

<div class="wx_register-ok" id="registerOK"  style="display:none">
	<div class="wx_invest_center">
	<div class="wx_invest_ok wx_register_tip">
    	<p>恭喜您注册成功！</p>
    </div>
    </div>
	<a href="list.html#axn" class="wx_btn_org">浏览产品列表 (<span id="registerOkCountdown" left_time_int="5">5</span>)</a>
    <div class="wx_tip2 wx_register_tip2">为了保障您的资金安全，请登录小牛在线电脑版网站(<span>www.xiaoniu88.com</span>)进行充值。</div>
</div>