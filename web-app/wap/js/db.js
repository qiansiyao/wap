
//公用方法,相当于模板
(function() {

	//自适应页面高度
	var fixedHeight = 0;
//	var headerHeight = $('header').height() || 0;
	var headerHeight = 0;
	var footerHeight = 0;
	
	//document.title = document.documentElement.clientHeight;
	setTimeout(function(){
		//延迟以便获取准确的高度，微信中默认打开webview获取的页面高度很高
		var mHeight = document.documentElement.clientHeight - headerHeight;
		$('.container').css('min-height',mHeight);
	}, 100);
	
	//定位底部按钮
	var fixedContainer = $('.fixed_wrapper');
	var fixedHeight = fixedContainer.outerHeight();
	var windowHeight = $(window).height();
	var isEditing = false;
	document.addEventListener('touchstart',function(e){
		startY = e.touches[0].pageY;		
	});
	document.addEventListener('touchmove',function(e){
		var scrollTop = $(window).scrollTop();
		//document.title = 'pageY:'+e.touches[0].pageY + ' clientY:'+e.touches[0].clientY;
		scrollTop = e.touches[0].pageY - e.touches[0].clientY;
		//fixedContainer.css({'top': scrollTop + windowHeight - fixedHeight});
	});
	document.addEventListener('touchend',function(e){
		fixedContainer.show();
	});
	document.addEventListener('touchcancel',function(e){
		fixedContainer.show();
	});
	$(window).scroll(function() {
		var scrollTop = $(window).scrollTop();
		fixedContainer.css({'top': scrollTop + windowHeight - fixedHeight});
	});
	fixedContainer.css({'top':$(window).scrollTop() + windowHeight - fixedHeight,'bottom':'auto'}).show();


	template.openTag = "<!--[";
	template.closeTag = "]-->";

	// 模板帮助方法，绝对化图片地址
	template.helper('$absImg', function(content) {
		if(!content){
			return config.localimage + '/wap/images/icon_job_head_default.png';
		}
		if(content && content.indexOf('http://') == 0){
			return content;
		}
		//return config.aliyunHost + content;
		return config.image + content;
	});
	
	// 模板帮助方法，转换时间戳成字符串
	template.helper('$formatDate', function(content, type, defaultValue) {
		if(content){
			return Tools.formatDate(content, type);
		}else{
			return defaultValue || '--';
		}
	});

	//模板帮助方法，编码url参数
	template.helper('$encodeUrl', function(content) {
		return encodeURIComponent(content);
	});
	
	//模板帮助方法，\r\n替换换行
	template.helper('$convertRN', function(content) {
		if(!content){
			return '--';
		}
		return content.replace(/\r\n/gi,'<br/>');
	});
	
	//模板帮助方法，截取时间
	template.helper('$subMinute', function(content) {
		if (!content || content.length < 10) {
			return '';
		}
		return content.substr(5,11);
	});
	
	//模板帮助方法，截取时间
	template.helper('$subMinute2', function(content) {
		if (!content || content.length < 10) {
			return '';
		}
		return content.substr(10,6);
	});
	
	//模板帮助方法，根据序列值添加样式名
	template.helper('$addClassByIdx', function(i, v, className) {
		if(i == v){
			return className || '';
		}
	});
	
	//模板帮助方法，传入2015-04-02 10:50:00.0，返回2015-04-02
	template.helper('$getDateFromTime', function(content) {
		if (!content || content.length < 10) {
			return '';
		}
		return content.substr(0, 10);
	});
	
	//模板帮助方法，传入distance(单位米)，返回distance(单位km)
	template.helper('$getDistanceKM', function(content) {
		var distance;
		try {
			distance = parseFloat(content);
		} catch (e) {
			return '0';
		}
		if (distance >= 1000) {
			return ((distance / 1000).toFixed(0) + 'km');
		}
		return (content + 'm');
	});
	
	template.helper('$returnPeople', function(content) {
		if (!content || content.length == 0) {
			return '若干';
		}
		return content;
	});
	
	template.helper('$getCountK', function(content) {
		var distance;
		try {
			distance = parseFloat(content);
		} catch (e) {
			return '0';
		}
		if (distance >= 1000) {
			return ((distance / 1000).toFixed(1) + 'k');
		}
		return (content);
	});
	
	template.helper('$parseInt', function(content) {
		return parseInt(content) + '元';
	});
	
	// 下一页按钮
	$('body').on('click', '.zlist_next', function(e) {
		e.preventDefault();
		if ($(this).hasClass('loading')) {
			// 正在加载，不可点击
			return;
		}
		if (typeof config.getList == 'function') {
			config.getList();
		}
	});

	//初始化滚动
	config.initScroll = function(opt,mode) {
		var nav = $('.subscript');
		var len = $('.scroller').children().length;
		if (len == 0) {
			return;
		}
		// 有两种导航模式
		if (opt && opt.mode == 'mode2') {
			nav.html('<span>1</span>/' + len);
		} else {
			var res = '';
			for(var i=0;i<len;i++){
				if(i==0){
					res += '<span class="active"></span>';
				}else{
					res += '<span></span>';
				}
			}
			nav.html(res);
		}
		config.previewScroll = new jScroll($('.slider')[0], {
			onBeforeScrollStart : function(){
				if(config.scrollInte){
					clearInterval(config.scrollInte);
					config.scrollInte = undefined;
				}
			},
			onScrollEnd : function() {
				var cur = $('#img-'+this.currPageX);
				cur.attr('src',cur.attr('data-src'));
				if (mode && mode == 'mode2') {
					nav.find('span').text(this.currPageX + 1);
				} else {
					nav.find('span').removeClass('active');
					nav.find('span').eq(this.currPageX).addClass('active');
					$(nav.find('span')[this.currPageX]).addClass('active');
				}

				if(opt && opt.auto && !config.scrollInte){
					config.scrollInte = setInterval(function(){
						config.previewScroll.currPageX++;
						if(config.previewScroll.currPageX >= config.previewScroll.pagesX){
							config.previewScroll.currPageX = 0;
						}
						var w = config.previewScroll.warpperW;
						var i = config.previewScroll.currPageX;
						config.previewScroll.scrollTo(-w*i,0,200);
					},3000);
				}
			}
		});
		
		if(opt && opt.auto){
			config.scrollInte = setInterval(function(){
				config.previewScroll.currPageX++;
				if(config.previewScroll.currPageX >= config.previewScroll.pagesX){
					config.previewScroll.currPageX = 0;
				}
				var w = config.previewScroll.warpperW;
				var i = config.previewScroll.currPageX;
				config.previewScroll.scrollTo(-w*i,0,200);
			},8000);
		}
		
		$('#img-0').attr('src',$('#img-0').attr('data-src'));

	};
})();

// 返回按钮
$('.icon_return').click(function(e) {
	e.preventDefault();
	//特殊跳转
	var prefix = $(this).attr('href');
	if(prefix != '#'){
		location.href = prefix;
	}else{
		history.go(-1);
	}
});

// 清空登录用户信息 测试专用
function clearUserData() {
	Storage.set(Storage.USER_DATA, null);
}
// 获取当前省份
function getCurProvice() {
	if(Storage.get(Storage.USER_PROVICE)){
		return Storage.get(Storage.USER_PROVICE);
	}else{
		return '浙江省';
	}
}
// 获取当前地理位置
function getCurLocation() {
	if(Storage.get(Storage.USER_LOCATION)){
		return Storage.get(Storage.USER_LOCATION);
	}else{
		var obj = {
			lat : config.lat,
			lng : config.lng
		}
		return obj;
	}
}

$(document).ready(function(){
	$('#panelBg').click(function(){
		Tools.hidePanel();
		Tools.hideSelect();
	});

	$('.btn_yes').click(function(){
		Tools.hidePanel(true);
	});
	$('.btn_no').click(function(){
		Tools.hidePanel(false);
	});
	$('.btn_ok').click(function(){
		Tools.hidePanel(true);
	});
});

//获取验证码 reqeusttype:1用户注册，2密码找回
function getVericode(mobile, requesttype, succ_fun,fail_fun) {
	Ajax.submitPost({
		url : config.api_url,
		data : {
			imei : '0000000',
			appcode : 'DINGBO',
			devicetype : 'wap',
			version : config.version,
			request_code : '1',
			beanName : 'appuserinfohttpservice',
			methodName : 'sendMobileVerificationCode',
			gid :config.gid,
			token :config.token,
			mobile : mobile,
			requesttype : requesttype
		},
	}, function(data) {
		Tools.showTip('发送成功', 5000);
	}, succ_fun,fail_fun);
}

function getDateTime() {
	var now = new Date();
	var year = now.getFullYear();
	var month = now.getMonth() + 1;
	var day = now.getDate();
	var hour = now.getHours();
	var minute = now.getMinutes();
	var second = now.getSeconds();
	if (month.toString().length == 1) {
		var month = '0' + month;
	}
	if (day.toString().length == 1) {
		var day = '0' + day;
	}
	if (hour.toString().length == 1) {
		var hour = '0' + hour;
	}
	if (minute.toString().length == 1) {
		var minute = '0' + minute;
	}
	if (second.toString().length == 1) {
		var second = '0' + second;
	}
	var dateTime = year + month + day + hour + minute + second;
	return dateTime;
}



















