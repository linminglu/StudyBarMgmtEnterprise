 $("#file_input").on("change",function(){
            //console.log(1);
            var filePath=$(this).val();
            //console.log(filePath);
            $("#file_path").html(filePath);
 })


$("#up_file").on("click",function(){
	/*console.log(1111111);*/
	$.ajax({
		type:"POST",
		url:"index.php?m=ClinicMember&a=employee_import",
		enctype: 'multipart/form-data',
		data:new FormData($("#excel_post_import")[0]),
		processData: false,
    	contentType: false,
		beforeSend: function(){},
		success: function(json){
			json=eval('('+json+')');
			if(json.code==1){
				$("#info_load").html(json.msg);
				if(chain==null){
						window.location="index.php?m=ChainStrom&a=approval_staff";
					}else{
						window.location="index.php?m=OneStrom&a=approval_staff";
					}
			}else{
				$("#info_load").html(json.msg);
			}
		},
		error: function(json){},
		complete: function(json){console.log(json);}
	})	
})


















