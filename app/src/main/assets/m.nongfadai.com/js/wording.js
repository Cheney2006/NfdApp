// JavaScript Document
getWording = (function() {
    var wording = {};
    var w = wording;
    w.account_01 = "";
    w.account_02 = "";
    w.account_03 = "";

    w.bind_card_01 = "&nbsp;&nbsp;单笔限额{1}{2},当日限额{3}万元，<br>&nbsp;&nbsp;通过电脑或线下充值方式无上限";
    w.bind_card_02 = "银行卡号长度必须在16到19之间";
    w.bind_card_03 = "银行卡号必须全为数字";
    w.bind_card_04 = "充值金额不能低于{1}元";;
    w.bind_card_05 = "充值金额不能高于{1}万元";
    w.bind_card_06 = "输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X";
	w.bind_card_07 = "输入的身份证号里出生日期不对";
	w.bind_card_08 = "18位身份证的校验码不正确";


	
	w.bonus_01="";
	
	w.register_01="如果您未收到短信，请<span id=\"get_voice_code\" class=\"get_voice_code\">点此获取语音验证码</span>";
	w.register_02="请注意接听 <i class='voice_code_phone'>0755-21671435</i> 的来电，我们将在电话中告知动态验证码";
	w.register_03="服务器错误，请稍后重试";
	w.register_04="发送验证码失败，请稍后再试";
	w.register_05="请等待{1}秒...";
	w.register_06="获取验证码";
	w.register_07="请输入用户名";
	w.register_08="6-18个字符，可使用字母、数字、下划线，需以字母开头";
	w.register_09="用户名已存在，请输入其他用户名";
	w.register_10="服务器异常，检查用户名出错";
	w.register_11="请输入11位手机号码";
	w.register_12="请输入有效的11位手机号码";
	w.register_13="手机号码已经存在";
	w.register_14="服务器异常，检查手机号出错";
	w.register_15="请输入密码";
	w.register_16="6~20个字符，区分大小写";
	w.register_17="请输入验证码";
	w.register_18="请同意用户协议";
	w.register_19="注册";
	w.register_20="注册信息填写有误";
	w.register_21="注册中...";
	
	
	
	
	w.index_01="";
	
	w.login_01="";
	
	w.recharge_01="单笔充值金额不能低于{1}";
	w.recharge_02="单笔充值金额不能高于{1}";
	w.recharge_03="您今天已充值{1}，剩余可充金额{2}";
	w.recharge_04= "您本月已充值{1}，剩余可充金额{2}";
	w.recharge_05="&nbsp;&nbsp;单笔限额{1}{2},当日限额{3}万元，<br>&nbsp;&nbsp;通过电脑或线下充值方式无上限"
	
	
	
	
	w.invest_01="预期收益:<i>{1}</i>元";
	w.invest_02="投资返现:<i>{1}元</i>";
	w.invest_03="投资金额不能小于{1}元";
	w.invest_04="您的余额不足,请充值后再投资";
	w.invest_05="投资金额不能大于{1}元";
	w.invest_06="服务器错误，请稍后重试";

	
	
	w.list_01="加载项目列表异常，请重试";
	
	w.recharge_11="验证码为空";
	w.recharge_12="服务器错误，请稍后重试";
	w.recharge_13="请注意接听 <i class='voice_code_phone'>400 888 1234</i> 的来电，我们将在电话中告知动态验证码";
	w.recharge_14="服务器错误，请稍后重试";
	w.recharge_15="服务器错误，请稍后重试";
	w.recharge_16="发送验证码失败，请稍后再试";
	w.recharge_17="请等待{1}秒...";
	w.recharge_18="获取验证码";
	
	w.withdraw_01="<p class=\"auth-msg auth-error\">提现金额不能为空</p>";
	w.withdraw_02="获取验证码";
	w.withdraw_03="已发送({1})";
	w.withdraw_04="提现金额不能低于{1}元，且不能高于{2}万元";
	w.withdraw_05="验证码长度有误";
	w.withdraw_06="请注意接听 <i class='voice_code_phone'>400 888 1234</i> 的来电，我们将在电话中告知动态验证码";
	w.withdraw_07="<p class=\"auth-msg auth-error\">提现金额不能为空</p>";
	

    function getWording() {
        var args = arguments;
        var tpl = w[args[0]];
        var wording = tpl;
        if (wording) {
            for (var i = 1; i < args.length; i++) {
                var reg = new RegExp("\\{" + i + "\\}", "ig");
                wording = wording.replace(reg, args[i]);
            }
        }
        return wording;
    }

    function test() {
		var fn=getWording;
        console.log(fn("bind_card_01", "1", "2", "3"));
        console.log(fn("bind_card_02", "1", "2"));
        console.log(fn("bind_card_07", "1", "2"));

    }
    //test();
    //window.getWording=getWording;
    //window.word=getWording;
    return getWording;
})();