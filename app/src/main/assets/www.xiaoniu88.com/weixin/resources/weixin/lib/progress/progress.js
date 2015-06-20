(function(){
	var progress=function(opt){
		if(!opt||!opt.target){
			alert("缺少目标ID");
			return;
		}
		if(!opt.progress_val&&opt.progress_val!=0){
			alert("项目进度为0-100");
			return;
		}
		this.target=opt.target;
		this.radius=opt.radius||80;
		this.circle_x=opt.circle_x||150;
		this.circle_y=opt.circle_y||150;
		this.circle_inner_width=opt.circle_inner_width||20;
		this.circle_inner_color=opt.circle_inner_color||"#ccc";
		this.circle_center_width=opt.circle_center_width||20;
		this.circle_center_color=opt.circle_center_color||"#ccc";
		this.circle_outer_width=opt.circle_outer_width||20;
		this.circle_outer_color=opt.circle_outer_color||"red";
		this.progress_val=opt.progress_val;
		
		var canvas=document.getElementById(opt.target);
		this.can=canvas.getContext("2d");
		
		this.drawInnerCircle();
		this.drawCenterCircle();
		this.drawOuterCircle();
	}
	progress.prototype={
		drawInnerCircle:function(){
			var t=this;
			t.can.beginPath();
			t.can.lineWidth=t.circle_inner_width;
			t.can.strokeStyle=t.circle_inner_color;
			t.can.arc(t.circle_x,t.circle_y,t.radius+t.circle_inner_width/2,0,Math.PI*2,false);
			t.can.stroke();
			t.can.closePath();
		},
		drawCenterCircle:function(){
			var t=this;
			t.can.beginPath();
			t.can.lineWidth=t.circle_center_width;
			t.can.strokeStyle=t.circle_center_color;
			var r=t.radius+t.circle_inner_width+t.circle_center_width/2;
			t.can.arc(t.circle_x,t.circle_y,r,0,Math.PI*2,false);
			t.can.stroke();
			t.can.closePath();
		},
		drawOuterCircle:function(){
			var t=this;
			t.can.beginPath();
			t.can.strokeStyle=t.circle_outer_color;
			t.can.lineWidth=t.circle_outer_width;
			var r=t.radius+t.circle_inner_width+t.circle_outer_width/2;
			t.can.arc(t.circle_x,t.circle_y,r,-Math.PI/2,-Math.PI/2+Math.PI*2*t.progress_val/100,false);
			t.can.stroke();
			t.can.closePath();
		}
	}
	$.progressCircle = function(opt){
		return new progress(opt);
	}
})();