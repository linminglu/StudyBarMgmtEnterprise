
// GUID.PNG
accessid = ''
accesskey = ''
host = ''
policyBase64 = ''
signature = ''
filename = ''
key = ''
expire = 0
cloudname=''
upflag = false
duration = 0//视频时长

now = timestamp = Date.parse(new Date()) / 1000; 

$(function(){

    $('#fillBtn_set').off('click').on('click',function(){
        if(upflag){
            var obj = {
                "url":host+'/'+key+cloudname,//视频url
                "duration":0
            }
            NoticeFather(1,obj);
        }else{
            NoticeFather(0);
        }
    })
    $('#cancelBtn_set').off('click').on('click',function(){
        NoticeFather(0);
    })
    
    uploader.init();
})

// function send_request()
// {

// // var nam=document.getElementById('video_name').innerHTML;
// // obj={'filename':nam};
// // $.post('/butler/collage/ossparam',obj,function(data){
// //   _list=data.list;
// //   flag=true;
// //   get_signature()
// //       })

//   var xmlhttp = null;
//   if (window.XMLHttpRequest)
//   {
//       xmlhttp=new XMLHttpRequest();
//   }
//   else if (window.ActiveXObject)
//   {
//       xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
//   }

//   if (xmlhttp!=null)
//   {
//     var nam=document.getElementById('video_name').innerHTML;
//     //var obj='filename:'+'C:/Users/Administrator/Desktop/lev1.png';
//       //phpUrl = 'http://10.101.166.2/php/get.php'
//       phpUrl = '/butler/collage/ossparam'
//       xmlhttp.open( "post", phpUrl, false );
//       xmlhttp.send(null);
//       console.log(xmlhttp.responseText)
//       return xmlhttp.responseText
//   }
//   else
//   {
//       alert("Your browser does not support XMLHTTP.");
//   }
// };

function get_signature(obj)
{
  //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
  
  now = timestamp = Date.parse(new Date()) / 1000; 
  console.log('get_signature ...');
  console.log('expire:' + expire.toString());
  console.log('now:', + now.toString())
  if (expire < now + 3)
  {
      console.log(obj)
      host = obj['host']
      policyBase64 = obj['policy']
      accessid = obj['accessid']
      signature = obj['signature']
      expire = parseInt(obj['expire'])
      key = obj['dir']
      cloudname=obj['cloudname']
    //   document.getElementById('video_name').innerHTML=cloudname
      return true;
  }
  return false;
};



//上传OSS需要设置的参数
function set_upload_param(up,obj)
{
  
  var ret = get_signature(obj)
  if (ret == true)
  {
      new_multipart_params = {
          'key' : key + cloudname,
          'policy': policyBase64,
          'OSSAccessKeyId': accessid, 
          'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
          'signature': signature,
      };
      up.setOption({
          'url': host,
          'multipart_params': new_multipart_params
      });

      console.log('reset uploader')
      //uploader.start();
  }
}


function uploadFile(){
    var _obj={'filename':'test.mp4'};
    $.post('/butler/collage/ossparam',_obj,function(data){
        //debugger;
        if(data.code == 1){
            set_upload_param(uploader,data.list);
            uploader.start(data.list);
        }else{
            console.log(data.info);
        }
    })
    return false;
}

var uploader = new plupload.Uploader({
        runtimes : 'html5,flash,silverlight,html4',
        browse_button : 'selectfiles', 
        multi_selection:false,
        container: document.getElementById('container'),
        flash_swf_url : 'lib/plupload-2.1.2/js/Moxie.swf',
        silverlight_xap_url : 'lib/plupload-2.1.2/js/Moxie.xap',
        max_file_count:1,
        url : 'http://oss.aliyuncs.com',
        filters: {
            mime_types : [ //只允许mp4视频文件
            { title : "Video files", extensions : "mp4" }
            ],
            max_file_size : '3gb', //最大只能上传3GB的文件
            max_file_count:1
        },
        init: {
        PostInit: function() {
            document.getElementById('ossfile').innerHTML = '';
            // document.getElementById('postfiles').onclick = function() {
            //     var _obj={'filename':'test.mp4'};
            //     $.post('/butler/collage/ossparam',_obj,function(data){
            //         //debugger;
            //         if(data.code == 1){
            //             set_upload_param(uploader,data.list);
            //             uploader.start(data.list);
            //         }else{
            //             console.log(data.info);
            //         }
            //     })
            //     return false;
            // };
        },
        BeforeUpload: function(up, file) {
            //每次上传前设置一下 存储路径--这样文件就可以放到不同的路径下，而不是覆盖  
            //现在的存储路径是点击 上传的时候获取的 一次路径 ，所有的文件都是基于这个公共的路径存储，就会导致文件覆盖

            //加一个接口每次 同步获取存储路径
            //set_upload_param(up, file.name, true);
        },
        //清空队列
        Browse:function(up){
        },
        QueueChanged: function(up) {
        },
        FilesAdded: function(up, file) {
            //debugger;
            duration = 0;
            upflag = false;
            document.getElementById("videofile").src = "";
            document.getElementById("fillBtn_set").setAttribute("disabled","true");

            var filesNum = up.files.length;
            if (filesNum > 1){
                up.removeFile(up.files[0].id);
            }

            plupload.each(file, function(file) {
            document.getElementById('ossfile').innerHTML = '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>'
            +'<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>'
            +'</div>';
            });

            setTimeout("uploadFile()",500);
        },

        UploadProgress: function(up, file) {
            var d = document.getElementById(file.id);
            d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
            var prog = d.getElementsByTagName('div')[0];
            var progBar = prog.getElementsByTagName('div')[0]
            progBar.style.width= 2*file.percent+'px';
            progBar.setAttribute('aria-valuenow', file.percent);
        },

        FileUploaded: function(up, file, info) {
                //debugger;
                console.log('uploaded')
                console.log(info.status)
                if (info.status >= 200 || info.status < 200)
                {
                    document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '上传成功';
                    console.log(host+'/'+key+cloudname)
                    upflag = true;
                    document.getElementById("videofile").src = host+'/'+key+cloudname;
                    document.getElementById("fillBtn_set").removeAttribute("disabled");
                }
                else
                {
                    document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
                } 
        },

        Error: function(up, err) {
            //debugger;
            document.getElementById('console').appendChild(document.createTextNode("\nError xml:" + err.response));
        }
        }
});

function NoticeFather(para,pobj){
  if(para==0){
      parent.upvideopop.close_pop_wnd({"code":para,"info":pobj});
  }else{
      parent.upvideopop.close_pop_wnd({"code":para,"info":pobj});
  }
}
// function getUrlParam(name) {
//     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
//     var r = window.location.search.substr(1).match(reg);  //匹配目标参数
//     if (r==null){
//       return "";
//     }
//     return unescape(r[2]); //返回参数值
// } 