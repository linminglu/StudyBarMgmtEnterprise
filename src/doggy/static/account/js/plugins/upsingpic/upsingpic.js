KindEditor.plugin('upsingpic', function(K) {  
   var editor = this, name = 'upsingpic';  
   // 点击图标时执行  
   editor.clickToolbar(name, function() {  
   		var w=$(document).width();
		var h=$(window).height();
		var xw=$("#fileUpload").width();
		var xh=$("#fileUpload").height();
		$("#div_bg").show();
		$("#fileUpload").css({
			"left":(w-xw)/2,
			"top":(h-xh)/2
			}).show();
		$("#fileUpload").attr('data-index','editor')	;	
		$("#fileUpload").attr('data-upto','saveup')	;	
   });  
}); 