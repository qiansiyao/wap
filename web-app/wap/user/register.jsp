<%@ page language="java" pageEncoding="UTF-8"%>
<!doctype html>
<html>
<head>
<title>注册</title>
<jsp:include page="../com/meta.jsp"></jsp:include>
<link rel="stylesheet" href="<%=request.getContextPath()%>/wap/css/register.css" />
</head>
<!-- 登录页面，如果需要登录完成后页面返回，而非跳转首页。请加参数'?param=back' -->
<body>
	<noscript>
		<div id="noscript">您当前的浏览器不支持JavaScript脚本</div>
	</noscript>
	<section class="container">		
		<div class="all">
			<div class="line">
			  <div class="image_mobile"></div>
			  <div class="phone">
			    <input type="text" name="phone" placeholder="请输入手机号">
			  </div>
			</div>
			<div class="half-line clearfix">
				<div class="line">
					<div class="image_define"></div>
					<input type="text" name="vertification" placeholder="请输入验证码">
				</div>
				<div class="btn-vert btn">获取验证码</div>
			</div>			
		</div>
		
		<div class="operate clearfix">
			<div class="image"></div><a class="device" src="#"><span>已阅读患者协议</span></a>
		</div>
		<div class="btn btn-login register"><a class="next" >下一步</a></div>
	</section>

<jsp:include page="../com/footer-js.jsp"></jsp:include>
<script>
$('.image').on('click', function(e) {
	e.preventDefault();
	if ($(this).hasClass('active')) {
		$(this).removeClass('active');
	} else {
		$(this).addClass('active');
	}
});	  
</script>
</body>
</html>
