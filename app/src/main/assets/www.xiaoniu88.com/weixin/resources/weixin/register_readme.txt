

1、实现静态页面

2、联调数据

3、修改旧代码关于注册的地址


============================================================================================

注册页面迁移:

------------------------------------------------------------------------------

旧代码地址： 

html页面:

	http://tech.xiaoniu88.net/svn/oldSvn/xnzx/af88/WebRoot/WEB-INF/page/weChat/register.jsp  (注册第一步)

	http://tech.xiaoniu88.net/svn/oldSvn/xnzx/af88/WebRoot/WEB-INF/page/weChat/register_step2.jsp  (注册第二步)

	http://tech.xiaoniu88.net/svn/oldSvn/xnzx/af88/WebRoot/WEB-INF/page/weChat/reg_success.jsp  (注册第三步，完成页面)

CSS文件:

	http://tech.xiaoniu88.net/svn/oldSvn/xnzx/af88/WebRoot/weChat/css/base.css
	
	http://tech.xiaoniu88.net/svn/oldSvn/xnzx/af88/WebRoot/weChat/css/global.css
	
	http://tech.xiaoniu88.net/svn/oldSvn/xnzx/af88/WebRoot/weChat/css/element.css
	
	http://tech.xiaoniu88.net/svn/oldSvn/xnzx/af88/WebRoot/weChat/css/include.css
	
JS文件:

	当前页面

------------------------------------------------------------------------------

逻辑梳理：

第一步：
	

	1、推荐人需要请求后端数据服务,需要字段：  paramMap.refferee
	
		paramMap.refferee != '' and paramMap.refferee != null 表示有推荐人   otherwise   手动输入推荐人
		
	
	2、推荐人ajax验证。  提交URL：　checkreusrexist.do
	
		data.statu == 1 时，验证通过 =>改为:  data.status == 1
	   
	
	3、手机号码ajax验证  提交URL：  ajaxCheckMobilePhoneRegister.do
	
		data == 6 时，验证通过   =>改为 data.status == 6
	
	
	3、注册表单提交。地址URL：  weChat/wx_regtwo.do .  相关字段：
	
		推荐人（隐藏域）：　id="recommend_param" value="${paramMap.refferee}"
		
		手机号码：　name="paramMap.m" id="m"
		
		登录密码：　name="paramMap.p" id="p"
		
		推荐人： name="paramMap.r" id="r"
		
		同意协议： id='agre' name='agre'
		
		
		表单提交后，会发送一个手机验证码到客户手机！
		

第二步： 
	
	1、输入手机验证码，提交表单
	
		提交 URL:  weChat/wx_reglast.do
		
		
	2、语音验证
	
		提交URL：  sendSMS.do
		



====================================================================================


1、打开register注册页面时
请求方式：GET
地址：/register
说明：前端页面需要判断refferee是否存在，存在表示通过链接注册，需要隐藏推荐人填写
   
2、推荐人ajax验证    ：　/register/type/mobile/param/{param} ({param}为用户手机号)
请求方式：GET
返回值：


12：手机号为空
4：手机号重复
1：校验成功
5：手机格式不正确



3、手机号码ajax验证  ：  /register/type/refferee/param/{param}  ({param}为用户名称)
请求方式：GET
返回值：
9：推荐人为空
10：推荐人存在
11：推荐人不存在

4、表单提交：/register/step1
请求方式：POST
参数名称：
mobile 手机号
password 密码（需js加密）
refferee 推荐人
返回值：
7：参数校验失败
12：手机号为空
4：手机号重复
5：手机格式不正确
8：密码为空
6：密码格式错误
3：密码解密失败
16：非正常跳转用户，禁止发送短信
1：发送验证码成功
17：发送验证码失败
12：手机号为空

5、短信验证码接口：/register/sendcode
请求方式：POST
参数名称：
mobile 手机号
codeType wechat_phone(固定值)
返回值：
12：手机号为空
4：手机号重复
5：手机格式不正确
16：非正常跳转用户，禁止发送短信
17：发送验证码失败
1：发送验证码成功

6、语音验证码接口：/register/sendcode
请求方式：POST
参数名称：
mobile 手机号
codeType wechat_pvoice(固定值)
返回值：
12：手机号为空
4：手机号重复
5：手机格式不正确
16：非正常跳转用户，禁止发送短信
17：发送验证码失败
1：发送验证码成功

7、跳转到下一步接口：/register/step2
请求方式：POST
参数名称：
mobile 手机号
password 密码（需js加密）
refferee 推荐人

8、用户注册接口：/register
请求方式：POST
参数名称：
mobile 手机号
password 密码（需js加密）
refferee 推荐人
返回值：
12：手机号为空
13：手机验证码为空
18：session中不存在验证码
14：验证码不匹配
15：手机号不匹配
4：手机号重复
2：注册失败
1：注册成功

9、注册成功跳转：/register/result
说明：前端页面需要判断reg_tag的值,如果reg_tag=0表示有送红包，reg_tag=1则表示不送红包

		






