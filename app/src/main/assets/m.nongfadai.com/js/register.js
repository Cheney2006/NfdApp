var checkName = true;
var checkmobile = true;
var checkPhone=true;
var checkPhoneCode=true;
var checkMail=true;
var wait=60;
$(function() {
	
	window.setTimeout(function () {
		$("input[name='accountName']").focus();
	}, 0); 

	showAuto();
	//$("input:checkbox[name='iAgree']").attr("checked", false);
	$("input:checkbox[name='iAgree']").click(function() {
		var iAgree = $(this).attr("checked");
		var register = $("#sub-btn");
		if (iAgree) {
			register.addClass("btn01");
			register.removeClass("btn02");
		} else {
			register.removeClass("btn01");
			register.addClass("btn btn02");
		}
	});
});
var isNull = /^[\s]{0,}$/;
var loginName = /^[a-zA-Z]([\w]{5,17})$/i;
var codeVal=/^[A-Za-z0-9]{0,20}$/;
var phoneCodeVal=/^[0-9]{4,10}$/;

function checkValue(){
	var iAgree = $("input:checkbox[name='iAgree']").attr("checked");
	if (checkName && checkmobile && iAgree == "checked"
		&& nameCheck() && passwordCheck()&& bandPhone()
		&&checkPhone && rePasswordCheck() && checkMail && bandEmail()
		&& pholeCodeCheck() && checkPhoneCode && codeCheck()) {
		$("#passwordFirst").val(hex_md5($("#passwordFirst").val()));
		$("#passwordSecond").val(hex_md5($("#passwordSecond").val()));
		return true;
	}
	return false;
}

function checkoxBtn()
{
	var iAgree = $("input:checkbox[name='iAgree']").attr("checked");
	if (iAgree != "checked"){
		$("#sub-btn").attr('disabled',true);
	}else{
		$("#sub-btn").attr('disabled',false);
	}
		
}

function nameCheck() {
	var ipt = $("input[name='accountName']");
	var val = ipt.val();
	var p = ipt.parent().find("p");
	var loginSuccess = $("#loginSuccess");
	loginSuccess.removeClass("success_tip");
	p.removeClass();
	p.addClass("gray9");
	p.text("6-18个字符，可使用字母、数字、下划线，需以字母开头");
	if (isNull.test(val)) {
		p.addClass("red");
		p.removeClass("gray9");
		p.text("用户名不能为空");
		return false;
	} else if (!loginName.test(val)) {
		p.addClass("red");
		p.removeClass("gray9");
		window.setTimeout(function () {
			ipt.select();
			ipt.focus();
		}, 0); 
		return false;
	}
	$.ajaxSetup({async : false});
	$.post(_nURL, {
		accountName : val
	}, function(data) {
		if ($.trim(data) == 'true') {
			loginSuccess.removeClass("success_tip");
			p.addClass("red");
			p.removeClass("gray9");
			p.text("该用户名已存在，请输入其他用户名");
			window.setTimeout(function () {
				ipt.select();
				ipt.focus();
			}, 0); 
			checkName = false;
			return false;
		}
	});
	loginSuccess.addClass("success_tip");
	checkName = true;
	return true;
	
}

function passwordCheck() {
	var ipt = $("input[name='password']");
	var val = ipt.val();
	var p = ipt.parent().find("p");
	var passwordSuccess = $("#passwordSuccess");
	passwordSuccess.removeClass("success_tip");
	p.removeClass();
	p.addClass("gray9");
	$("#password-tip").text("6~20个字符，区分大小写");
	p.find("span span").removeClass("on");
	if (isNull.test(val)) {
		p.addClass("red");
		p.removeClass("gray9");
		$("#password-tip").text("密码不能为空");
		return false;
	} else if (val.length < 6 || val.length > 20) {
		p.addClass("red");
		p.removeClass("gray9");
		window.setTimeout(function () {
			ipt.select();
			ipt.focus();
		}, 0); 
		return false;
	} else if (/\d+/.test(val) && /[A-Za-z]+/.test(val) && /\W+/.test(val)) {
		p.find("span span.strong").addClass("on");
	} else if (/[a-zA-Z]+/.test(val) && /[0-9]+/.test(val)) {
		p.find("span span.medium").addClass("on");
	} else if (/[a-zA-Z]+/.test(val) && /[\W_]/.test(val)) {
		p.find("span span.medium").addClass("on");
	} else if (/[0-9]+/.test(val) && /[\W_]/.test(val)) {
		p.find("span span.medium").addClass("on");
	} else {
		p.find("span span.weak").addClass("on");
	}
	passwordSuccess.addClass("success_tip");
	return true;
}
function rePasswordCheck() {
	var ipt = $("input[name='password']");
	var _ipt = $("input[name='newPassword']");
	var val = _ipt.val();
	var newPasswordSuccess = $("#newPasswordSuccess");
	newPasswordSuccess.removeClass("success_tip");
	var p = _ipt.parent().find("p");
	p.removeClass();
	p.addClass("gray9");
	p.text("请再次输入密码");
	if (isNull.test(ipt.val())) {
		p.addClass("red");
		p.removeClass("gray9");
		p.text("请先输入密码");
		return false;
	} else if (isNull.test(val)) {
		p.addClass("red");
		p.removeClass("gray9");
		p.text("确认密码不能为空");
		return false;
	} else if (val != ipt.val()) {
		p.addClass("red");
		p.removeClass("gray9");
		p.text("您两次输入的密码不一致");
		return false;
	}
	newPasswordSuccess.addClass("success_tip");
	return true;
}

function codeCheck() {
	var ipt = $("input[name='code']");
	var val = ipt.val();
	var codeSuccess = $("#codeSuccess");
	codeSuccess.removeClass("success_tip");
	var p = ipt.parent().find("p");
	p.removeClass();
	if (!codeVal.test(val)) {
		p.addClass("red");
		p.removeClass("gray9");
		window.setTimeout(function () {
			ipt.select();
			ipt.focus();
		}, 0); 
		p.text("您输入的邀请码格式不正确");
		return false;
	}
	if(val!='')
	{
		codeSuccess.addClass("success_tip");
	}
	return true;
}
function pholeCodeCheck() {
	var ipt = $("#otp");
	var phone = $("#phone");
	var val = ipt.val();
	var codeSuccess = $("#otpSuccess");
	codeSuccess.removeClass("success_tip");
	var p = ipt.parent().find("p");
	p.removeClass();
	if (val == '') {
		p.addClass("red");
		p.removeClass("gray9");
		p.text("手机动态码不能为空");
		checkPhoneCode = false;
		return false;
	} else if (!phoneCodeVal.test(val)) {
		p.addClass("red");
		p.removeClass("gray9");		
		p.text("您输入的手机动态码格式不正确");
		checkPhoneCode = false;
		return false;
	}
	var data3={"bphoneCode":val,"binphpne":phone.val()};
	$.ajax({
		type:"post",
		dataType:"html",
		url:basePath+"regist/bindPhone.htm",
		data:data3,
		success:function(data){
			if(data){
				//alert(data);
				var ct = eval('('+data+')');
				if(ct[0].num==1){//成功
					checkPhoneCode= true;
					codeSuccess.addClass("success_tip");
					p.removeClass("red");
					p.addClass("gray9");
					p.text("请输入手机动态码");
					return true;
				}else{//失败
					p.addClass("red");
					p.removeClass("gray9");
					p.text(ct[0].msg);
					checkPhoneCode = false;
					return false;
				}
			}
		}
	});
	return checkPhoneCode;
}
function anotherImg(contextPath) {
	$("#verify-img").attr("src", contextPath);
}

function showAuto() {
	var checked = $("#type2").attr("checked");
	if (checked) {
		$("#autoPayDiv").show();
	} else {
		$("#autoPayDiv").hide();
	}
}

function showPhonenumber(){
	if(!checkValue()){
		return;
	}
	$("#otpSuccess").text(''); 
	$("#div_one").show();
	$("#div_two").show();
	var phone = $("#phone").val();
	$("#phoneNum").text(phone);
	$("#otp").val('');
	$("#obtainBtn").removeAttr("disabled");
}
function hidePhonenumber(){
	$("#div_one").hide();
	$("#div_two").hide();
}





function bandPhone(evn){
	var phone = $("#phone");
	var p = phone.parent().find("p");
	var verifySuccess = $("#phoneSuccess");
	verifySuccess.removeClass("success_tip");
	if(!checkBandPhone(phone)){
		return false;
	}
	
	var data1={"evencheck":"phone","value":phone.val()};
	$.ajaxSetup({async : false});
	$.ajax({
		type:"post",
		dataType:"html",
		//url:"<%//=controller.getURI(request, Check.class)%>",
		url:basePath+"regist/check.htm",
							
		data:data1,
		success:function(data){
			if(data == "04"){
				p.addClass("red");
				p.removeClass("gray9");
				p.text("手机已存在!");
				window.setTimeout(function () {
					phone.select();
					phone.focus();
				}, 0); 
				checkPhone=false;
				return false;
			}else{ 
				p.removeClass("red");
				p.addClass("gray9");
				p.text("请输入手机号码");
				verifySuccess.addClass("success_tip");
				checkPhone=true;
				return true;
			}
		}
	});
	return checkPhone;
}

function getSmsCode(){
	if(!bandPhone(null)){
		return;
	}
	$("#otpSuccess").text("");
	var otp = $("#otp");
	var p = otp.parent().find("p");
	var phone = $("#phone");
	var otpSuccess = $("#otpSuccess");
	otpSuccess.removeClass("success_tip");
//	if(phone.val() == ''){
//		phone.focus();
////		p.addClass("gray9");
//		p.addClass("red");
//		p.text("请输入手机号");
//		return;
//	}
//
//	if(!checkPhone){
//		phone.focus();
////		p.addClass("gray9");
//		p.addClass("red");
//		p.text("请输入正确手机号获取验证码");
//		return;
//	}
	otp.focus();
	
	var data3={"type":"band","emil":"","phone":phone.val()};
	$.ajax({
		type:"post",
		dataType:"html",
		//url:"<%//=controller.getURI(request, Send.class)%>",
		url:basePath+"regist/send.htm",
		data:data3,
		success:function(data){
			var ct = eval('('+data+')');
			if(ct[0].num==1){//成功
				sendclick6();
			}else{//失败
				p.removeClass("gray9");
				p.addClass("red");
				p.text(ct[0].msg);
			}
		}
	});
}
function cleanMessage(){
	$("#otpSuccess").text("");
}
function checkBandPhone(phone){
	var p = phone.parent().find("p");
	if(phone.val().length<=0){
		p.addClass("red");
		p.removeClass("gray9");
		p.text("请输入手机号码！");
		return false;
	}
	var myreg = /^(13|14|15|17|18)[0-9]{9}$/;
	if(!myreg.test(phone.val()))
	{
		//showError(bemil,"手机号码不正确！");
		p.addClass("red");
		p.removeClass("gray9");
		p.text("手机号码格式不正确！");
		window.setTimeout(function () {
			phone.select();
			phone.focus();
		}, 0); 
		return false;
	}
	return true;	
}

function bandEmail(){
	var bemil = $("#email");
	var p = bemil.parent().find("p");
	var verifySuccess = $("#emailSuccess");
	verifySuccess.removeClass("success_tip");
	
	if(bemil.val().length<=0){
		p.addClass("gray9");
		p.removeClass("red");
		p.text("请输入常用邮箱");
		checkMail=true;
		return true;
	}
	if(!checkEmailFormat(bemil)){
		return false;
	}
	var data1={"evencheck":"emil","value":bemil.val()};
	$.ajax({
		type:"post",
		dataType:"html",
		//url:"<%//=controller.getURI(request, Check.class)%>",
		url:basePath+"regist/check.htm",
		data:data1,
		success:function(data){
			if(data == "04"){
				checkMail=false;
				//showError(bemil,"邮箱已存在！");
				p.addClass("red");
				p.removeClass("gray9");
				p.text("邮箱已存在！");
				window.setTimeout(function () {
					bemil.select();
					bemil.focus();
				}, 0); 
				return false;
			}else{
				p.addClass("gray9");
				p.removeClass("red");
				p.text("请输入常用邮箱");
				verifySuccess.addClass("success_tip");
				checkMail=true;
				return true;
			}
		}
	});
	return true;
}

function checkEmailFormat(bemil){
	var p = bemil.parent().find("p");
	if(bemil.val().length<=0){
//		p.addClass("red");
//		p.removeClass("gray9");
//		p.text("请输入邮箱地址");
		return true;
	}
	var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,4}$/;
	if(!myreg.test(bemil.val()))
	{
		checkMail=false;
		p.addClass("red");
		p.removeClass("gray9");
		p.text("邮箱地址格式不正确！");
		window.setTimeout(function () {
			bemil.select();
			bemil.focus();
		}, 0); 
		return false;
	}
	return true;
}

function fouces(){
	hidePhonenumber();
	$("#phone").select();
	$("#phone").focus();
}

function sendclick6(){
		if (wait == 0) {
			$("#obtainBtn").show();
			$("#secMessage").hide();
			wait = 60;
		} else {
			$("#obtainBtn").hide();
			$("#secMessage").show();
			$("#sec").text(wait);
			wait--;
			setTimeout(function() {
				sendclick6();
			},
			1000);
		}
	}
