//debug
var log = function(m) {
	if (typeof console != 'undefined') {  //要是控制台结果显示不为未定义，就返回控制台的纬度
		console.log(m);
	}
};

/**
 * 将form中的值转换为键值对
 * 
 * @param form
 *            表单对象
 */
var formJson = function(form) {
	var o = {};
	var a = $(form).serializeArray();
	$.each(a, function() {
		if (o[this.name] !== undefined) {
			if (!o[this.name].push) {
				o[this.name] = [ o[this.name] ];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
};

var Ajax = {
	/**
	 * 基于ajax的查询
	 * 
	 * @param data
	 *            封装请求url，请求数据，请求类型
	 * @param callback
	 *            ajax请求成功后执行的回调方法
	 * @param callbackDone
	 *            ajax请求成功后最后执行的方法
	 */
	pageRequest : function(data, callback, callbackDone) {
		var renderFor = data.renderFor || 'xx-list-tmpl', renderEle = data.renderEle
				|| '#xx-list';

		var next = $('.zlist_next'), nextStr = '<a class="zlist_next" href="#">下一页</a>';
		if (next.length == 0) {    //要是下一页的数据为空，就把“下一页”放在div块后面
			$(renderEle).after(nextStr);
			next = $('.zlist_next');
		}
		if(config.cpage == 1){
			//查第一页数据一定清空当前容器
			$(renderEle).html('');
		}
		next.show().addClass('loading').text(config.tips.loading);

		$.ajax({
			url : data.url,
			data : data.data,
			type : data.type || 'GET',
			timeout : 7000,
			cache: false
		}).then(function(response,textStatus,jqXHR) {
			next.removeClass('loading');
			if(typeof response == 'string'){
				response = eval('(' + response + ')');  //返回对象,将字符串解析成obj；
			}
			
			if(response.success != 't'){
				next.text(config.tips.server);
				return;
			}

			if ($('#' + renderFor).length && !data.custom) {
				var result;
				result = template.render(renderFor, {
					'list' : response.result
				});
				$(renderEle).append(result);
			}
			
			if(response.result.length == 0){
				//数据没有结果显示无数据提示
				if(config.cpage == 1){
					next.html(config.tips.nodata);
				}else{
					next.text(config.tips.nomoredata);
				}
			}else{
				config.cpage += 1;
				next.text('更多');
			}
			
			if(response.info && (response.info.page.countNum > 0 && !response.info.page.hasNextPage)) {
				next.hide();
			}

			if ($.isFunction(callback)) {
				callback(response);
			}
		}).done(function(xhr,b) {
			if ($.isFunction(callbackDone)) {
				callbackDone();
			}
		}).fail(function( jqXHR, textStatus, errorThrown ) {
			if(textStatus == 'timeout'){
				next.removeClass('loading').addClass('error').text(config.tips.timeout);
			}else{
				next.removeClass('loading').addClass('error').text(config.tips.server);
			}
		});
		
	},
	
	/**
	 * 基于ajax的查询(列表不分页)
	 * 
	 * @param data
	 *            封装请求url，请求数据，请求类型
	 * @param callback
	 *            ajax请求成功后执行的回调方法
	 * @param callbackDone
	 *            ajax请求成功后最后执行的方法
	 */
	queryListRecord : function(data, callback, callbackDone, callbackError) {
		var renderFor = data.renderFor || 'xx-list-tmpl', renderEle = data.renderEle
				|| '#xx-list';

		$.ajax({
			url : data.url,
			data : data.data,
			type : data.type || 'GET',
			timeout : 7000,
			cache: false
		}).then(function(response) {
			if(typeof response == 'string'){
				response = eval('(' + response + ')');
			}
			
			if(response.success != 't'){
				$('#xx-empty').show();
				return;
			}
			
			if ($('#' + renderFor).length && response.result && !data.custom) {
				var result = template.render(renderFor, {
					'list' : response.result
				});
				$(renderEle).html(result);
			}
			if ($.isFunction(callback)) {
				callback(response);
			}
		}).done(function() {
			if ($.isFunction(callbackDone)) {
				callbackDone();
			}
		}).fail(function( jqXHR, textStatus, errorThrown ) {
			if(textStatus == 'timeout'){
				$(renderEle).addClass('error').text(config.tips.timeout);
			}else{
				$(renderEle).addClass('error').text(config.tips.server);
			}
			if($.isFunction(callbackError)){
				callbackError();
			}
		});
	},
	
	/**
	 * 基于ajax的查询
	 * 
	 * @param data
	 *            封装请求url，请求数据，请求类型
	 * @param callback
	 *            ajax请求成功后执行的回调方法
	 * @param callbackDone
	 *            ajax请求成功后最后执行的方法
	 */
	queryRecord : function(data, callback, callbackDone, callbackError) {
		var renderFor = data.renderFor || 'xx-detail-tmpl', renderEle = data.renderEle
				|| '#xx-detail';

		$.ajax({
			url : data.url,
			data : data.data,
			type : data.type || 'GET',
			timeout : 7000,
			cache: false
		}).then(function(response) {
			if(typeof response == 'string'){
				response = eval('(' + response + ')');
			}
			
			if(response.success != 't'){
				Tools.showTip(response.error,5000);
				return;
			}
			
			if ($('#' + renderFor).length && response.result) {
				var result = template.render(renderFor, response.result);
				$(renderEle).html(result);
			}
			if ($.isFunction(callback)) {
				callback(response);
			}
		}).done(function() {
			if ($.isFunction(callbackDone)) {
				callbackDone();
			}
		}).fail(function( jqXHR, textStatus, errorThrown ) {
			if(textStatus == 'timeout'){
				$(renderEle).addClass('error').text(config.tips.timeout);
			}else{
				$(renderEle).addClass('error').text(config.tips.server);
			}
			if($.isFunction(callbackError)){
				callbackError();
			}
		});
	},
	/**
	 * 基于ajax的表单提交
	 * 
	 * @param data
	 *            传入的参数
	 * @param callback
	 *            ajax请求成功后执行的回调方法
	 * @param callbackDone
	 *            ajax请求成功后最后执行的方法
	 */
	submitForm : function(data, callback, callbackDone) {
		var formData;

		var isForm = !!data.data.length;
		if (isForm) {
			formData = data.data.serializeArray();
			data.data.find('input[type="submit"]').attr('disabled',true);
		} else {
			formData = data.data;
		}
		
		$.ajax({
			url : data.url,
			data : formData,
			type : data.type || 'POST',
			timeout : 7000
		}).then(function(response) {
			if ($.isFunction(callback)) {
				callback(response);
			}
		}).done(function() {
			if(isForm){
				data.data.find('input[type="submit"]').removeAttr('disabled');
			}
			if ($.isFunction(callbackDone)) {
				callbackDone();
			}
		}).fail(function( jqXHR, textStatus, errorThrown ) {
			if(isForm){
				data.data.find('input[type="submit"]').removeAttr('disabled');
				Tools.showTip(config.tips.server,5000);
			}
		});
	},
	/**
	 * 基于ajax的POST请求
	 * 
	 * @param data
	 *            传入的参数
	 * @param callback
	 *            ajax请求成功后执行的回调方法
	 * @param callbackDone
	 *            ajax请求成功后最后执行的方法
	 */
	submitPost : function(data, callback, callbackDone,callbackFail) {
		var formData;

		formData = data.data;
		
		$.ajax({
			url : data.url,
			data : formData,
			dataType : "json",
			type : data.type || 'POST',
			timeout : 7000
		}).then(function(response) {
			if(typeof response == 'string'){
				response = eval('(' + response + ')');
			}
			if(response.success != 't'){
				Tools.showTip(response.error_msg,5000);
				if ($.isFunction(callbackFail)) {
					callbackFail();
				}
				return;
			}
			if ($.isFunction(callback)) {
				callback(response);
			}
		}).done(function() {
			if ($.isFunction(callbackDone)) {
				callbackDone();
			}
		}).fail(function( jqXHR, textStatus, errorThrown ) {
			Tools.showTip(config.tips.server,5000);
			if ($.isFunction(callbackFail)) {
				callbackFail();
			}
		});
	}
};

// 本地存储
var Storage = (function() {
	return {
		USER_DATA : 'xx_USERDATA',
		USER_ORDER : 'xx_ORDER',
		USER_OPENID : 'USER_OPENID',
		USER_PROVICE : 'xx_USER_PROVICE',
		USER_LOCATION : 'xx_USER_LOCATION',
		LOGIN_REDIRTURL : 'xx_REDIRTURL',
		SEARCH_HISTORY : 'xx_SEARCH_HISTORY',
		JOB_DETAIL_PARAM : 'xx_JOB_DETAIL_PARAM',
		CREATE_RESUME_PARAM : 'xx_CREATE_RESUME_PARAM',
		LAST_TIMESTAMP : 'xx_LAST_TIMESTAMP',
		get : function(key, isSession) {
			if (!Storage.isLocalStorage()) {
				return;
			}
			var value = Storage.getStorage(isSession).getItem(key);
			if(value){
				return JSON.parse(value);
			}else{
				return undefined;
			}
		},
		set : function(key, value, isSession) {
			if (!Storage.isLocalStorage()) {
				return;
			}
			value = JSON.stringify(value);
			Storage.getStorage(isSession).setItem(key, value);
		},
		remove : function(key, isSession) {
			if (!Storage.isLocalStorage()) {
				return;
			}
			Storage.getStorage(isSession).removeItem(key);
		},
		getStorage: function(isSession){
			return isSession ? sessionStorage : localStorage;
		},
		isLocalStorage : function() {
			try {
				if (!window.localStorage) {
					log('不支持本地存储');
					return false;
				}
				localStorage.setItem('isLocalStorage', 'abc');
				localStorage.removeItem('isLocalStorage');
				return true;
			} catch (e) {
				log('本地存储已关闭');
				return false;
			}
		}
	};
})();

var Tools = (function() {
	var preventDefault, panel, delay, panel0, toastPanel;
	return {
		formatDate : function(content, type) {
			var pattern = "yyyy-MM-dd hh:mm";
			// 2012年1月23日
			// 18:00
			// 2013.1.23
			// 2013/01/23
			switch (type) {
			case 1:
				pattern = "yyyy年M月d日";
				break;
			case 2:
				pattern = "hh:mm";
				break;
			case 3:
				pattern = "yyyy.M.d";
				break;
			case 4:
				pattern = "yyyy-MM-dd hh:mm:ss";
				break;
			case 5:
				pattern = "yyyy年MM月";
				break;
			case 6:
				pattern = "yyyy-MM-dd";
				break;
			default:
				pattern = !!type ? type : pattern;
				break;
			}
			//时间转时间戳
			var newstr = content.replace(/-/g,'/'); 
			var date =  new Date(newstr); 
		    var time = date.getTime();
			
			if (isNaN(time) || time == null) {
				return time;
			} else if (typeof (time) == 'object') {
				var y = dd.getFullYear(), m = dd.getMonth() + 1, d = dd
						.getDate();
				if (m < 10) {
					m = '0' + m;
				}
				var yearMonthDay = y + "-" + m + "-" + d;
				var parts = yearMonthDay.match(/(\d+)/g);
				var date = new Date(parts[0], parts[1] - 1, parts[2]);
				return date.format(pattern);
			} else {
				var date = new Date(parseInt(time));
				return date.format(pattern);
			}
		},
		// 获取窗口尺寸，包括滚动条
		getWindow : function() {
			return {
				width : window.innerWidth,
				height : window.innerHeight
			};
		},
		// 获取文档尺寸，不包括滚动条但是高度是文档的高度
		getDocument : function() {
			var doc = document.documentElement || document.body;
			return {
				width : doc.clientWidth,
				height : doc.clientHeight
			};
		},
		// 获取屏幕尺寸
		getScreen : function() {
			return {
				width : screen.width,
				height : screen.height
			};
		},
		// 显示、禁用滚动条
		showOrHideScrollBar : function(isShow) {
			preventDefault = preventDefault || function(e) {
				e.preventDefault();
			};
			(document.documentElement || document.body).style.overflow = isShow ? 'auto'
					: 'hidden';
			// 手机浏览器中滚动条禁用取消默认touchmove事件
			if (isShow) {
				// 注意这里remove的事件必须和add的是同一个
				document
						.removeEventListener('touchmove', preventDefault, false);
			} else {
				document.addEventListener('touchmove', preventDefault, false);
			}
		},
		// 显示加载框
		showLoading : function() {
			this.showPanel('loading', '数据加载中…');
		},
		// 显示提示
		showTip : function(msg, tick, callback) {
			if (tick == 0) {
				this.showPanel('message', msg, callback);
				return;
			}
			tick = tick || 500;
			this.showPanel('message', msg, tick, callback);
		},
		// 显示确认框
		showConfirm : function(msg, yesCallback, noCallback){
			this.showPanel('confirm', msg, 0, yesCallback, noCallback);
		},
		// 显示正确信息
		showSuccess : function(msg, tick) {
			this.showPanel('success', msg, tick);
		},
		// 显示错误信息
		showError : function(msg, tick) {
			this.showPanel('error', msg, tick);
		},
		showPanel : function(type, message, tick, yesCallback, noCallbck) {
			panel = panel || $('#myPanel');
			type = type || 'error';
			message = message || '提示信息';
			config.onYesClick = yesCallback;
			config.onNoClick = noCallbck;
			
			panel.find('p').html(message);
			panel.show().css('margin-top',-(panel.height() / 2));
			$('#panelBg').show();
			if(type == 'confirm'){
				panel.find('.btn_ok').hide();
				panel.find('.btn_yes').show();
				panel.find('.btn_no').show();
				panel.find('.line_verti').show();
			}else{
				panel.find('.line_verti').hide();
				panel.find('.btn_ok').show();
				panel.find('.btn_yes').hide();
				panel.find('.btn_no').hide();
			}
			
			if (!!tick)
				delay = setTimeout(function() {
					panel.hide();
					$('#panelBg').hide();
					
					if(typeof config.onYesClick == 'function'){
						config.onYesClick();
						config.onYesClick = undefined;
					}
				}, tick);
		},
		showSelect : function(type, message, choices, callback) {
			panel0 = $('#mySelect');
			type = type || 'message';
			message = message || '提示信息';
			panel0.find('').removeClass().addClass(type);
			panel0.show().css('margin-top',-(panel0.height() / 2));
			if (!message || message.length < 1) { // 用户根本没有提供选项
				return;
			}
			var html = '';
			for (var i = 0;i < choices.length;++i) {
				html += ('<div class="item" value="' + choices[i].value + '">' + choices[i].name + '</div>');
			}
			panel0[0].innerHTML = html;
			$(panel0).css('height', (41 * choices.length) + 'px');
			$('#mySelect .item').on('click', function(e) {
				e.preventDefault();
				panel0.hide();
				$('#panelBg').hide();
				if ($.isFunction(callback)) { // 回调
					callback($(this).attr('value'), $(this)[0].innerHTML);
				}
			});
			panel0.show();
			$('#panelBg').show();
		},
		hideSelect : function() {
			if(delay){
				clearTimeout(delay);
			}
			if(!panel0){
				return;
			}
			panel0.hide();
			$('#panelBg').hide();
			
			if(typeof config.onTipClose == 'function'){
				config.onTipClose();
				config.onTipClose = undefined;
			}
		},
		hidePanel : function(yesClick) {
			if(delay){
				clearTimeout(delay);
			}
			if(!panel){
				return;
			}
			panel.hide();
			$('#panelBg').hide();
			
			if(yesClick){
				typeof config.onYesClick == 'function' && config.onYesClick();
			}else{
				typeof config.onNoClick == 'function' && config.onNoClick();
			}
			config.onYesClick = undefined;
			config.onNoClick = undefined;
		},
		toast : function(msg, tick) {
			toastPanel = toastPanel || $('#xx-toast');
			tick = tick || 600;
			
			if(delay){
				clearTimeout(delay);
			}
			
			toastPanel.find('span').text(msg);
			toastPanel.show();
			delay = setTimeout(function(){
				toastPanel.hide();
			},tick);
		}
	};
})();

// cookie
var Cookie = {
	get : function(sname) {  //获取cookie方法
		var sre = "(?:;)?" + sname + "=([^;]*);?";
		var ore = new RegExp(sre);
		if (ore.test(document.cookie)) {
			try {
				return unescape(RegExp["$1"]); // decodeURIComponent(RegExp["$1"]);
			} catch (e) {
				return null;
			}
		} else {
			return null;
		}
	},

	set : function(c_name, value, expires) {  //设置cookie方法
		expires = expires || this.getExpDate(7, 0, 0);
		if (typeof expires == 'number') {
			expires = this.getExpDate(expires, 0, 0);
		}
		document.cookie = c_name + "=" + escape(value)
				+ ((expires == null) ? "" : ";expires=" + expires) + "; path=/";
	},

	remove : function(key) {  //删除cookie方法
		Cookie.set(key, '', -1);
	},

	getExpDate : function(e, t, n) {
		var r = new Date;
		if (typeof e == "number" && typeof t == "number"
				&& typeof t == "number")
			return r.setDate(r.getDate() + parseInt(e)), r.setHours(r
					.getHours()
					+ parseInt(t)), r.setMinutes(r.getMinutes() + parseInt(n)),
					r.toGMTString()
	}
};

// 扩展Date的format方法
Date.prototype.format = function(format) {
	var o = {
		"M+" : this.getMonth() + 1,//月份 
		"d+" : this.getDate(),//日 
		"h+" : this.getHours(),//小时
		"m+" : this.getMinutes(),//分   
		"s+" : this.getSeconds(),//秒 
		"q+" : Math.floor((this.getMonth() + 3) / 3),//季度 
		"S" : this.getMilliseconds()//毫秒   
	};
	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	}
	for ( var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
					: ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
};

// 扩展String的方法
String.prototype.isSpaces = function() {
	for (var i = 0; i < this.length; i += 1) {
		var ch = this.charAt(i);
		if (ch != ' ' && ch != "\n" && ch != "\t" && ch != "\r") {
			return false;
		}
	}
	return true;
};

String.prototype.isValidMail = function() {
	return (new RegExp(
			/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/)
			.test(this));
};

String.prototype.isPhone = function() {
	return (new RegExp(/^1\d{10}?$/).test(this));
};

String.prototype.isEmpty = function() {
	return (/^\s*$/.test(this));
};

String.prototype.isValidPwd = function() {
	return (new RegExp(/^([_]|[a-zA-Z0-9]){8,16}$/).test(this));
};

String.prototype.isPostCode = function() {
	return (new RegExp(/^\d{6}?$/).test(this));
};

String.prototype.getQueryValue = function(key) {
	var q = this, keyValuePairs = new Array();

	if (q.length > 1) {
		var idx = q.indexOf('?');
		q = q.substring(idx + 1, q.length);
	} else {
		q = null;
	}

	if (q) {
		for (var i = 0; i < q.split("&").length; i++) {
			keyValuePairs[i] = q.split("&")[i];
		}
	}

	for (var j = 0; j < keyValuePairs.length; j++) {
		if (keyValuePairs[j].split("=")[0] == key) {
			// 这里需要解码，url传递中文时location.href获取的是编码后的值
			// 但FireFox下的url编码有问题
			return decodeURI(keyValuePairs[j].split("=")[1]);

		}
	}
	return '';
};
