<%@ page language="java" pageEncoding="UTF-8"%>
<!doctype html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" href="<%=request.getContextPath()%>/wap/css/buy_equipment.css" />
<link rel="stylesheet" href="<%=request.getContextPath()%>/wap/css/selectcity.css" />
<jsp:include page="../com/meta.jsp"></jsp:include>
<title>购买设备</title>
<!-- 登录页面，如果需要登录完成后页面返回，而非跳转首页。请加参数'?param=back' -->
</head>
<body>
  <noscript>
		<div id="noscript">您当前的浏览器不支持JavaScript脚本</div>
  </noscript>
	<section class="container">	          
      <div class="msg">
         <div class="equ_msg">设备信息</div>
      </div>
	   	
	   	<div class="order_detail">
         <div class="details">
             <div class="name">名称</div>
             <div class="data"><span>心理治疗仪</span></div>               
         </div>
         
         <div class="details">
             <div class="name">型号</div>
             <div class="data"><span>20-54-321</span></div>               
         </div>
         
         <div class="details">
             <div class="name">单价</div>
             <div class="data txt"><span>98</span>&nbsp;元</div>               
         </div>
         
         <div class="details">
             <div class="name">数量</div>
             <div class="data math">
                  <span class="noadd">-</span>
                  <span class="size">3</span>
                  <span class="add">+</span>
             </div>               
         </div>
         
         <div class="details">
             <div class="name">运费</div>
             <div class="data txt"><span>8</span>&nbsp;元</div>               
         </div>        
      </div>
        
      <div class="msg">
         <div class="equ_msg">收件人信息</div>
      </div>
        
      <div class="order_detail">
         <div class="details">
             <div class="name">姓名</div>
             <div class="data"><span>小布丁</span></div>               
         </div>
         
         <div class="details">
             <div class="name">省市</div>
             <span class="all">
                <div class="data ell"><li>浙江省杭州市</li></div> 
                <div class="rig"></div>
             </span>         
         </div>
         
         <div class="details">
             <div class="name">地址</div>
             <div class="data"><span>西湖区古墩路飞天路101号</span></div>             
         </div>
         
         <div class="details">
             <div class="name">邮编</div>
             <div class="data"><span>312000</span></div>               
         </div>
         
         <div class="details">
             <div class="name">联系电话</div>
             <div class="data"><span>13758888888</span></div>               
         </div>        
      </div>
        
      <div style="height:1.16rem;background-color: #fafafa;"></div>
      
      <div class="detail">
         <div class="extre">
             <div class="cost">总费用</div>
             <div class="money"><span>302</span>&nbsp;元</div>
         </div>
      </div>
        
      <div class="last">
         <div class="bottom">立即支付</div>
      </div>
	     
	     <div class="popup cityview" style="display: none">
	          <div class="level1 city" id="db-prov-list">
	            <li class="l-line" val="0">北京省<em></em></li>
				      <li class="l-line" val="1">浙江省<em></em></li>
				      <li class="l-line" val="2">江苏省<em></em></li>
				      <li class="l-line" val="3">河南省<em></em></li>
				      <li class="l-line" val="4">澳门<em></em></li>
				      <li class="l-line" val="5">澳门<em></em></li>
				      <li class="l-line" val="6">澳门<em></em></li>
				      <li class="l-line" val="7">澳门<em></em></li>
				      <li class="l-line" val="8">澳门<em></em></li>
				      <li class="l-line" val="9">澳门<em></em></li>
				      <li class="l-line" val="10">澳门<em></em></li>
	          </div>
	     </div>
      
	     <div class="popup areaview" style="display: none">
	          <div class="level2 country v0" style="display: none">
	  　　　　　　<li class="l-line" val="1">宝山</li>
				      <li class="l-line" val="2">崇明</li>			      
	          </div>
	          <div class="level2 country v1" style="display: none">
	  　　　　　　<li class="l-line" val="1">杭州</li>
	            <li class="l-line" val="2">绍兴绍hhhhhhh</li>           
	          </div>
	          <div class="level2 country v2" style="display: none">
	  　　　　　　<li class="l-line" val="1">嵊州</li>
	            <li class="l-line" val="2">南京</li>           
	          </div>	
	          <div class="level2 country v3" style="display: none">
    　　　　　　   <li class="l-line" val="1">开封</li>
              <li class="l-line" val="2">郑州</li>           
            </div>         
	     </div>
	     	     
	</section>
	
	<jsp:include page="../com/footer-js.jsp"></jsp:include>					
	<script type="text/javascript">	
	var cityname,ele_show;
	$('.all').on('click', function(e) { // 居住地
		    e.preventDefault();
		    $(".popup.cityview").show();	    
	});
	$('.city .l-line').on('click',function(e){  //点击省
        e.preventDefault();
        var index = $('.city .l-line').index(this);
        var ele_show = $('.level2.country.v' + index);
        cityname = $(this).text();
       
        if($(this).hasClass('active')) { 
        	  ele_show.hide();
            $(this).removeClass('active');           
         }else{           
            $('.city .l-line').removeClass('active');
            $(this).addClass('active');
            $('.popup.cityview').hide();
            $('.popup.areaview').show();
            ele_show.show();            
            $('.level2.country .l-line').on('click',function(e){      //点击市
                e.preventDefault();
                var index1 = $('.country .l-line').index(this);
                if (!$(this).hasClass('active')) { // 本来就是选中的了 那没有必要改变
                    $('.level2.country .l-line').removeClass('active');
                    $(this).addClass('active');
                    $('.all .data li')[0].innerHTML = cityname + $(this).text();                      
                    ele_show.hide();
                    $('.popup.areaview').hide();
                  } else {
                	  $(this).removeClass('active'); // 取消选中
                	  ele_show.hide();                   
                  }              
            });
         }          
       
  });
	</script>	
</body>
</html>