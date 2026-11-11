function getQueryParam(name) {
     var reg = new RegExp('[?&]' + name + '=([^&]*)', 'i');
     var result = window.location.search.match(reg);
     return result ? decodeURIComponent(result[1]) : null;
}

function sendPixel(url, clickid, val) {
    var fullUrl = url 
        + '?upd_clickid=' + encodeURIComponent(clickid)
        + '&upd_key='
        + '&event1=' + val;
        
    var img = new Image();
    img.referrerPolicy = 'no-referrer-when-downgrade';
    img.src = fullUrl;

}

//追踪系统域名
var url = 'https://v2.allfreetrial.com/click';

// 读取 clickid 参数
var clickid = getQueryParam('cid'); // 获取 clickid 参数

(function(){
     
    if (clickid !== 'd4lumi7vrq8c73b7rc3g') {
        
        var anura = document.createElement('script');
            if ('object' === typeof anura) {
                var request = {
                 instance: '2922163488',
                 callback: 'anuraResponseCallback'
            };
            var params = [Math.floor(1E12*Math.random()+1)];
            for (var x in request) params.push(x+'='+encodeURIComponent(request[x]));
            anura.type = 'text/javascript';
            anura.async = true
            anura.src = 'https://script.anura.io/request.js?' + params.join('&');
            var script = document.getElementsByTagName('script')[0];
            
            script.parentNode.insertBefore(anura, script);
       }
    }
})();
function anuraResponseCallback() {
   if (!!Anura) {
      var anuraResultCallback = function() 
      {
        var result = '-1';
        
         if (Anura.getAnura().isGood()) 
         {
             result = '1';
 		    //BPixelJS.update({ url: 'https://v2.allfreetrial.com/click',updateKey: '',tokens: {add_event1: '1'}});
         }
         else if(Anura.getAnura().isWarning())
		 {
 			//BPixelJS.update({ url: 'https://v2.allfreetrial.com/click',updateKey: '',tokens: {add_event1: '2'}});
 			result = '2';
		 }
		 else if(Anura.getAnura().isBad())
		 {
 		    //BPixelJS.update({ url: 'https://v2.allfreetrial.com/click',updateKey: '',tokens: {add_event1: '3'}});
 		    result = '3';
		 }
		 else
		 {
 		    //BPixelJS.update({ url: 'https://v2.allfreetrial.com/click',updateKey: '',tokens: {add_event1: '-1'}});
		 }
		 
		 sendPixel(url, clickid, result);


      }
      Anura.getAnura().hasResult() ? anuraResultCallback() : Anura.getAnura().queryResult(anuraResultCallback);
   }
}
