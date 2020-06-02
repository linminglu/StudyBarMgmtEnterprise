KindEditor.plugin('upsingpic', function(K) {  
   var editor = this, name = 'upsingpic';  
   // 点击图标时执行  
   editor.clickToolbar(name, function() {  
		editor.insertHtml('[IT学习者官网：<a href="http://www.itxxz.com">http://www.itxxz.com</a>] ');  
   });  
}); 