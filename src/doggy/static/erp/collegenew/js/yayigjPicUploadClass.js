 //-----------------------------------
 // 原生h5上传图片本地压缩js类
 // 作者: 曾令兵
 // 时间: 2017/10/11
 //-----------------------------------
 var Picuploadclass = (function() {
     var options = null;

     //  this.name = "test_demo";
     //  this.sayName = function() {
     //      console.log(this.name); 外部无法直接访问
     //  };
     //此处可书写私有成员函数

     /**
      * 图片本地压缩类
      * @param {*} opts  配置参数
      */
     function _picuploadclass(opts) {
         var _this = this;

         if (_this instanceof _picuploadclass) {
             //共有属性和方法区域
             _this.options = opts;
             _this.options.Extname = "";
             //  _this.output = function() {
             //          sayName()  限内部访问
             //      }
             //自动执行处理函数
             //  _this.operat_img(opts.filesobj)
         } else {
             return new _picuploadclass(opts);
         }
     }

     _picuploadclass.prototype = {
         constructor: _picuploadclass,
         /**
          * 得到文件编码数据
          */
         getObjectURL: function(file) {
             if (file) {
                 var URL = window.URL || window.webkitURL;
                 var blob = URL.createObjectURL(file);
                 return blob;
             } else {
                 return false;
             }
         },
         //  verifySize(obj) {

         //  },
         /**
          * 实际处理文件过程
          */
         operat_img: function(obj, otherParam) {
             //  console.log('otherParam=', otherParam)
             var lowW = parseInt(document.getElementById(this.options.setWTagId).value);
             var lowH = parseInt(document.getElementById(this.options.setHTagId).value);
             var msgInfo = document.getElementById(this.options.picUpLoadInfo);
             var privewObj = document.getElementById(this.options.picPrivewId);
             var self = this;
             //  var Extname = "";
             privewObj.setAttribute("src", "");
             if (typeof(obj) == 'undefined') {
                 return;
             }
             this.options.Extname = obj.type;
             //  console.log('obj=', obj);
             var fsize = obj.size / (1024 * 1024);
             if (fsize > 5) {
                 if (this.options.picUpLoadInfo != '') {
                     msgInfo.style.visibility = 'visible'
                     msgInfo.innerHTML = "<span style='color:#f00'><img style='vertical-align: -2px;margin-right: 3px;height:15px' src='/static/hplat/img/waringr.png' height='20'>大小超过5m!</span>"
                 } else {
                     alert('大小超过5m');
                 }
                 return;
             } else {
                 msgInfo.innerHTML = "";
             }
             var reader = new FileReader();
             var readerBase64 = new FileReader();
             reader.readAsArrayBuffer(obj);
             reader.onloadend = function(e) {
                 msgInfo.innerHTML = "图片正在压缩处理中..."
                 var arr = (new Uint8Array(e.target.result)).subarray(0, 4);
                 var header = "";
                 for (var i = 0; i < arr.length; i++) {
                     header += arr[i].toString(16);
                 }
                 switch (header) {
                     case "89504e47":
                         self.options.Extname = "image/png";
                         break;
                     case "47494638":
                         self.options.Extname = "image/gif";
                         break;
                     case "ffd8ffe0":
                     case "ffd8ffe1":
                     case "ffd8ffe2":
                     case "ffd8ffdb":
                         self.options.Extname = "image/jpeg";
                         break;
                     default:
                         self.options.Extname = "unknown";
                         break;
                 }
             }
             var objUrl = this.getObjectURL(obj);
             if (objUrl) {
                 var img = new Image(),
                     canvas, ctx, dataURL = null;
                 img.src = objUrl;
                 img.crossOrigin = "anonymous";
                 var self = this;
                 img.onload = function() {
                     var thatMy = this,
                         w = thatMy.width,
                         h = thatMy.height,
                         scale = w / h;
                     if (otherParam !== undefined) {
                         if (w != otherParam.w || h != otherParam.h) {
                             if (self.options.picUpLoadInfo != '') {
                                 msgInfo.style.visibility = 'visible'
                                 msgInfo.innerHTML = "<span style='color:#f00'><img src='/static/hplat/img/waringr.png' style='vertical-align: -2px;margin-right: 3px;height:15px'>大小不符合规范! 当前图片大小为[ " + w + "x" + h + " ]</span>"
                             } else {
                                 alert('大小不符合规范! 当前图片大小为[ " + w + "x" + h + "]');
                             }
                             return;
                         }
                     }
                     canvas = document.createElement('canvas');
                     ctx = canvas.getContext('2d')
                         //  if (w < lowW || h < lowH) {
                         //     canvas.setAttribute("width", w)
                         //     canvas.setAttribute("height", h)
                         //     ctx.drawImage(thatMy, 0, 0, w, h);
                         // } else {

                     if (w < lowW) {
                         canvas.setAttribute("width", w)
                         canvas.setAttribute("height", h)
                         ctx.drawImage(thatMy, 0, 0, w, h);
                     } else {
                         //   if (lowW < lowH) {
                         //       lowH = lowW * (h / w)
                         //   } else {
                         //       lowW = lowH * (w / h)
                         //   }
                         lowH = lowW * (h / w);
                         canvas.setAttribute("width", lowW)
                         canvas.setAttribute("height", lowH)
                         ctx.drawImage(thatMy, 0, 0, lowW, lowH);
                     }
                     dataURL = canvas.toDataURL(self.options.Extname, 1);
                     //  dataURL = canvas.toDataURL('image/jpeg', 1); //强制转为jpg存储
                     privewObj.setAttribute("src", dataURL)
                     msgInfo.innerHTML = "";
                 }
             }
         },
         /**
          * 生成base64格式数据用于上传
          */
         getCanvasData: function() {
             var base64 = document.getElementById(this.options.picPrivewId).getAttribute("src");
             return base64.substr(base64.indexOf(',') + 1);
         },
         /**
          * 返回文件类型
          */
         getPicType: function() {
             //console.log(this.options.Extname, this.options)
             return this.options.Extname;
         }
     }
     return _picuploadclass;
 })();

 /**
  * 视频上传类库 [zlb 2017/10/11]
  */
 var Videouploadclass = (function() {

     function _videouploadclass(opts) {
         var _this = this;
         if (_this instanceof _videouploadclass) {
             //共有属性和方法区域   
         } else {
             return new _videouploadclass(opts);
         }
     }

     _videouploadclass.prototype = {
         constructor: _videouploadclass,
         //共享方法区域 
     }
     return _videouploadclass;
 })();