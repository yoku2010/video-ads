(function($) {
$(document).ready(function(){

  // putting lines by the pre blocks
  $("pre").each(function(){
    var pre = $(this).text().split("\n");
    var lines = new Array(pre.length+1);
    for(var i = 0; i < pre.length; i++) {
      var wrap = Math.floor(pre[i].split("").length / 70)
      if (pre[i]==""&&i==pre.length-1) {
        lines.splice(i, 1);
      } else {
        lines[i] = i+1;
        for(var j = 0; j < wrap; j++) {
          lines[i] += "\n";
        }
      }
    }
    $(this).before("<pre class='lines'>" + lines.join("\n") + "</pre>");
  });

  var headings = [];

  var collectHeaders = function(){
    headings.push({"top":$(this).offset().top - 15,"text":$(this).text()});
  }

  if($(".markdown-body h1").length > 1) $(".markdown-body h1").each(collectHeaders)
  else if($(".markdown-body h2").length > 1) $(".markdown-body h2").each(collectHeaders)
  else if($(".markdown-body h3").length > 1) $(".markdown-body h3").each(collectHeaders)
  
  var videoPlayer = null, $ad1 = $("#ad1"), $ad2 = $("#ad2"), $ad3 = $("#ad3"), $hour = $("#hour"), $minute = $("#minute"), $msgLabel = $("#msg"), $videoDiv = $("#video_div"), $videoFile = $("#video_file"), $video, videoNode, canPlay, src, file, type, message, isError, URL = window.URL || window.webkitURL, options = {
	    ads: {
	        'skipAd': {
		        'enabled': true,
		        'timeOut': 5
	        },
	        'servers'  : [
		        {
		            'apiAddress' : "ads/vast.xml"
		            //'apiAddress': 'http://pubads.g.doubleclick.net/gampad/ads?sz=400x300&iu=/1458073/dm_preroll_400x300v&ciu_szs&impl=s&gdfp_req=1&env=vp&output=xml_vast2&unviewed_position_start=1&url=http://www.desimartini.com&correlator='+ (new Date()).getTime(),
		            //'apiAddress' : 'http://some.domain/xdr-redirect/?http://some.domain/xml/vast.xml', //for xdr only
		            //'xdrMethod': 'yql' //['yql' | 'xdr']
		        }
		    ],
	        'schedule' : [
	            
	        ]
	    }
    }, date;
  
  function showMsg(msg, type) {
    if (void 0 != type && "error" == type) {
        $msgLabel.addClass("error").removeClass("success").removeClass("info").text(msg).show();
    }
    else if (void 0 != type && "success" == type) {
        $msgLabel.removeClass("error").addClass("success").removeClass("info").text(msg).show();
    }
    else if (void 0 != type && "info" == type){
        $msgLabel.removeClass("error").removeClass("success").addClass("info").text(msg).show();
    }
    else {
        $msgLabel.hide();
    }
  }
  function hideMsg() {
    showMsg();
  }
  $("#scheduled_video").click(function(e){
    e.preventDefault();
    // validation
    if ("" == $videoFile.val()) {
        showMsg("Please Select Video File to play", "error");
        return false;
    }
    else {
        hideMsg();
    }
    
    // manage ads
    options["ads"]["schedule"] = [];
    
    // first ad 
    if ($ad1.prop("checked"))
    {
        options["ads"]["schedule"].push({
            'position' : 'pre-roll'
        });
    }
    
    // second ad 
    if ($ad2.prop("checked")) {
        options["ads"]["schedule"].push({
            'position' : 'mid-roll',
            'startTime': '00:00:20'
        });
    }
    
    // third ad 
    if ($ad3.prop("checked")) {
        options["ads"]["schedule"].push({
            'position' : 'post-roll'
        });
    }
    
    file = $videoFile[0].files[0];

    src = URL.createObjectURL(file);
    type = file.type;
    
    // destroy video player
    if (void 0 != videoPlayer) {
        videoPlayer.destroy();
        videoPlayer = null;
    }
    $videoDiv.css("visibility","hidden");
    
    $video = $("<video/>").attr({id:"video", controls:"", preload:"auto", width:"640", height:"360"}).addClass("video-js vjs-default-skin");
    $("<source/>").attr({type:"video/mp4", src:src}).appendTo($video);
    $videoDiv.empty();
    $video.appendTo($videoDiv);
    
    videoNode = document.querySelector('video');
    canPlay = videoNode.canPlayType(type);
    canPlay = (canPlay === '' ? 'no' : canPlay);
    message = 'Can play type "' + type + '": ' + canPlay;
    isError = canPlay === 'no';
    if (isError) {
        showMsg(message, "error");
        $videoDiv.empty();
        return false;
    }
    else {
        if ("" == $hour.val() || "" == $minute.val()) {
            if (false == $ad1.prop("checked")){
                showMsg("Click on play button to play", "info");
            }
        }
    }
    
    /*
     play video
    */
    if ("" != $hour.val() && "" != $minute.val()) {
        date = new Date();
        var seconds, minute, hour = parseInt($hour.val(),10) - date.getHours();
        if (hour >= 0){
            minute = parseInt($minute.val(),10) - date.getMinutes();
            seconds = date.getSeconds();
            if (minute >= 0) {
                ms = hour * 60 * 60 * 1000 + minute * 60 * 1000 - seconds * 1000;
                showMsg("Video will play at " + $hour.val() + ":" + $minute.val() + "", "info");
                if (false == $ad1.prop("checked")){
                    videoPlayer = _V_("video", options, function(){});
                    videoPlayer.pause();
                }
                setTimeout(function() {
                    $videoDiv.css("visibility","visible");
                    if ($ad1.prop("checked")){
                        src = URL.createObjectURL(file);
                        $video = $("<video/>").attr({id:"video", controls:"", preload:"auto", width:"640", height:"360"}).addClass("video-js vjs-default-skin");
                        $("<source/>").attr({type:"video/mp4", src:src}).appendTo($video);
                        $videoDiv.empty();
                        $video.appendTo($videoDiv);
                        videoPlayer = _V_("video", options, function(){});
                    }
                    else {
                        videoPlayer.play();
                    }
                    hideMsg();
                },ms);
            }
            else {
                showMsg("Invalid scheduling time", "error");
                $videoDiv.empty();
            }
        }
        else {
            showMsg("Invalid scheduling time", "error");
            $videoDiv.empty();
        }
    }
    else {
        $videoDiv.css("visibility","visible");
        videoPlayer = _V_("video", options, function(){});
    }
  });
});
})(jQuery);
