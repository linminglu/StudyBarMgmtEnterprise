/**
 * @author jinlong.yuan
 */
UE.registerUI('snapimg',function(editor,uiName){
    editor.registerCommand(uiName,{
        execCommand:function(){
            this.execCommand('snapimg',{
                "style":"border-left: 3px solid #E5E6E1; margin-left: 0px; padding-left: 5px; line-height:36px;"
            });
        }
    });
 
    var btn = new UE.ui.Button({
        name:uiName,
        title:'上传图片',
        cssRules :"background-position: -380px 0;",
        onclick:function (e) {
            $(".jqteAddImg").click();
            //console.log(e)
	 		 //selectImage(2);
			 //callUploadFile();
            //  $.post("/market/uploadImg",obj,function(data){
            //     var objData = JSON.stringify(data);
            //     if(data.code=="1"){
            //         $('.upimgMo').addClass('no');
            //         getImgList(mtype,0);
            //         jQuery.loading_close();
            //     }else{
            //         jQuery.loading_close();
            //         jQuery.showError(data.info);
            //     }
            // })
        }
    });
 
    editor.addListener('selectionchange', function () {
        var state = editor.queryCommandState('snapimg');
        if (state == -1) {
            btn.setDisabled(true);
            btn.setChecked(false);
        } else {
            btn.setDisabled(false);
            btn.setChecked(state);
        }
    }); 
    return btn;
});