(function($){
	/*
	 * 倒计时插件
	 * left_time->可以是整数值，也可以是某个"属性"
	 * fmt->true时，倒计时时间带有"天-时-分-秒",否则只是纯数字倒计时
	 * callback->回调函数.fmt为true时,回调函数每秒执行一次.fmt非true时，回调函数在时间倒数完时执行一次。
	 */
	$.fn.countdown = function(left_time,callback,fmt){
		var $this = this;
		var time = 0,timer;
		if(typeof left_time=="number"){
			time = parseInt(left_time);
			if(time<=0){ return; }
		} else {
			 if(!$this.attr(left_time)) { return; }
			 time = parseInt($this.attr(left_time));
		}
		if($this.length===0){ return; }
		callback = (typeof callback==="function") ? callback : null;
		if(fmt){
			var days_second = 86400; // 一天的秒数
			var hours_second = days_second / 24;
			var minute_second = hours_second / 60;
			timer = setInterval(function(){
				var str = "";
				time--;
				if (time >= 0) {
					var days = parseInt(time / days_second);
					str += (days > 0) ? days + "天" : "";
					var hours = parseInt((time - days * days_second) / hours_second);
					str += hours > 0 ? hours + "时" : (days>0 ? "0时" : "");
					var minutes = parseInt((time - days * days_second - hours_second * hours) / minute_second);
					str += minutes > 0 ? minutes + "分" : (days>0 || hours>0 ? "0分" : "");
					second = time - days * days_second - hours_second * hours - minutes * minute_second;
					str += second + "秒";					
				}
				if(time===0){
					clearInterval(timer);
				}
				if(callback){
					callback($this,str,timer);
				}
			},1000);
		} else {
			if(time>0){
				timer = setInterval(function(){
					time--;
					if(time>=0){
						$this.html(time);
					}
					if(time===0){
						clearInterval(timer);
						if(callback){
							callback(timer);
						}
					}
				},1000);
			}
		}
		return timer;
	};
})(Zepto);