  var _type='';
  var data1=null;
  var _data1 = [
            {key:"音频（仅支持MP3.WAV）",val:"0"},
            {key:"视频（仅支持MP4）",val:"1"},
        ];
  
  //var t1 = window.setTimeout(prompt,500);
  var classid = getUrlParam("classid");
  var classtitle = getUrlParam("classtitle");
  var classtype = getUrlParam("classtype");
  var obj=null;
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
now = timestamp = Date.parse(new Date()) / 1000; 
_list=null;
flag=false;
var _file='';

$(function(){
      $('#typeof').yayigj_downlist({
        _data:_data1
      },function(api){
           data1 = api;
      });
      setTimeout(function(){data1.gotoval(1);},510)

      $('#classtitle').val(classtitle);
      $('#typeof').val(classtype);
      $('#fillBtn_set').off('click').on('click',function(){
          
          //console.log(filesize)
          var obj = {
                    "classid":classid,                             //空表示新增 、不为空表示修改
                    "classtype":$('#typeof').val(),               //类型
                    "classtitle":$('#classtitle').val(),          //标题
                    "url":host+'/'+key+cloudname,                                     //视频url
                    "filesize":$('#formatSize').text(),
            }
            //console.log(obj)
          
          $.ajax({
              type:"post",
              url:"/butlerp/college/weclassmod",
              dataType:"json",
              data:obj,
              beforeSend:function(){  
                      jQuery.loading('',-1);
              },
              complete: function(data){jQuery.loading_close(-1);}
              ,
              success: function(json){
                  NoticeFather(1);
              },
              error:function (json) {
                    jQuery.postFail("fadeInUp",json.info);
              }
            })
      })
      $('#cancelBtn_set').off('click').on('click',function(){
          NoticeFather(0);
      })
      uploader.init();
})

/**
 * 生成一个用不重复的ID
 */
function GenNonDuplicateID(randomLength){
  return Number(Math.random().toString().substr(3,randomLength) + Date.now()).toString(36)
}
//GenNonDuplicateID()将生成 rfmipbs8ag0kgkcogc 类似的ID
var _id=GenNonDuplicateID(5);

function send_request()
{

  // var nam=document.getElementById('video_name').innerHTML;
  // obj={'filename':nam};
  // $.post('/butler/collage/ossparam',obj,function(data){
  //   _list=data.list;
  //   flag=true;
  //   get_signature()
  //       })

    var xmlhttp = null;
    if (window.XMLHttpRequest)
    {
        xmlhttp=new XMLHttpRequest();
    }
    else if (window.ActiveXObject)
    {
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
  
    if (xmlhttp!=null)
    {
      var nam=document.getElementById('video_name').innerHTML;
      //var obj='filename:'+'C:/Users/Administrator/Desktop/lev1.png';
        //phpUrl = 'http://10.101.166.2/php/get.php'
        phpUrl = '/butler/collage/ossparam'
        xmlhttp.open( "post", phpUrl, false );
        xmlhttp.send(null);
        console.log(xmlhttp.responseText)
        return xmlhttp.responseText
    }
    else
    {
        alert("Your browser does not support XMLHTTP.");
    }
};

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
        document.getElementById('video_name').innerHTML=cloudname
        return true;
    }
    return false;
};

function set_upload_param(up,obj)
{
    debugger;
    var ret = get_signature(obj)
    if (ret == true)
    {
        new_multipart_params = {
            'key' : key + obj.cloudname,
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

var uploader = new plupload.Uploader({
  runtimes : 'html5,flash,silverlight,html4',
  browse_button : 'selectfiles', 
  container: document.getElementById('container'),
  flash_swf_url : 'lib/plupload-2.1.2/js/Moxie.swf',
  silverlight_xap_url : 'lib/plupload-2.1.2/js/Moxie.xap',

    url : 'http://oss.aliyuncs.com',


  init: {
    PostInit: function() {
      document.getElementById('ossfile').innerHTML = '';
      document.getElementById('postfiles').onclick = function() {
            var nam=document.getElementById('video_name').innerHTML;
            //var man=$('#video_name').attr('name')
            _obj={'filename':nam};
            $.post('/butler/collage/ossparam',_obj,function(data){
                      var file = document.getElementById('container').files; 
                      var aafile = new File([file], data.list.cloudname);
                      _file=aafile
                      // files.name=data.list.cloudname;
                   set_upload_param(uploader,data.list);
                   uploader.start(data.list);
              })
            return false;
      };
    },

    FilesAdded: function(up, file) {
      plupload.each(file, function(file) {
        document.getElementById('video_name').innerHTML=file.name
        document.getElementById('ossfile').innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>'
        +'<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>'
        +'</div>';
        document.getElementById('formatSize').innerHTML=plupload.formatSize(file.size)
      });
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
            console.log('uploaded')
            console.log(info.status)
            set_upload_param(up);
            if (info.status >= 200 || info.status < 200)
            {
                document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '上传成功';
                console.log(host+'/'+key+cloudname)
            }
            else
            {
                document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
            } 
    },

    Error: function(up, err) {
            set_upload_param(up);
      document.getElementById('console').appendChild(document.createTextNode("\nError xml:" + err.response));
    }
  }
});

function NoticeFather(para,pobj){
    if(para==0){
        parent.College_add_micro.close_pop_wnd({"code":para,"info":pobj});
    }else{
        parent.College_add_micro.close_pop_wnd({"code":para,"info":pobj});
    }
}
function getUrlParam(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
      var r = window.location.search.substr(1).match(reg);  //匹配目标参数
      if (r==null){
        return "";
      }
      return unescape(r[2]); //返回参数值
  } 