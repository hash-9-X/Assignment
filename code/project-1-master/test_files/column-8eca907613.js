$(function(){function t(){w="https://csdnimg.cn/release/download/images/pay_error.png",x="已扫码<br>请在手机端操作",$("#payCode").html('<div class="renovate"><img src="'+w+'"><span>'+x+"</span></div>"),$("#payCodeImg").html('<img class="repeat-again" src="'+w+'"><span class="text">'+x+"</span>")}function e(e){var s={goods_id:e,flag:17,request_type:4,success_function:a,error_function:n,timeout_function:i,get_pay_success_callback:o,is_use_balance:u,payment_function:t};$("#payCode").html(C),$("#payCodeImg").html(v),cart.qrPay(s)}function a(t,e){f?r("payCode",e.pay_url):r("payCodeImg",e.pay_url),y=e.pay_url}function o(){g.boxshadow.fadeOut(function(){showToast({text:"支付成功",bottom:"10%",zindex:9e3,speed:500,time:1500}),window.location.reload(),g.payCode.fadeOut(function(){window.location.reload()})})}function n(t){showToast({text:t.errorMessage,bottom:"10%",zindex:9e3,speed:500,time:1500})}function i(){f?g.payCode.find("#payCode").html(k):g.getPay.find("#payCodeImg").html(_)}function s(t){switch(t){case"column":u?d(I,b)>0?$(".now-price").text("¥"+d(I,b)):$(".now-price").text("¥0"):$(".now-price").text("¥"+I);break;case"details":var e=$(".pay-money-span").attr("data-nowprice");u?d(e,b)>0?($(".pay-money-span").text(d(e,b)+"元"),c(!1,330)):($(".pay-money-span").text("0元"),c(!0,202)):($(".pay-money-span").text($(".pay-money-span").attr("data-nowprice")+"元"),c(!1,330))}}function c(t,e){g.payCode.css({height:e+"px"}),t?(g.payCode.find(".content-code").hide(),g.payCode.find(".content-blance").show()):(g.payCode.find(".content-blance").hide(),g.payCode.find(".content-code").show())}function d(t,e){var a=Number(t)-Number(e);return a>0?a.toFixed(2):a<0?a.toFixed(2):a}function p(t,a){$.ajax({type:"GET",url:"https://mall.csdn.net/mp/mallorder/api/internal/order/getBalance",xhrFields:{withCredentials:!0},crossDomain:!0,success:function(o){b=o.data.balance,P++,P<=1&&(0==b?(u=0,$(".pay-code-radio").prop("disabled",!0)):(u=1,$(".pay-code-radio").attr("data-flag","true"),$(".pay-code-radio").prop("checked",!0))),$(".pay-balance .balance").text(b),$(".pay-code-balance .balance").text(b),s(a),e(t)}})}function r(t,e){var a=qrcode(6,"M");a.addData(e),a.make(),$("#"+t).html(a.createImgTag(3,3)),$("#"+t).html($("#"+t).html()),f&&g.boxshadow.fadeIn(function(){g.payCode.fadeIn()})}function l(){var t=$(this),e=t.data("id");if(t.data("type"))var a=blogUrl+"phoenix/web/v1/subscribe/un-subscribe-study?columnId="+e;else var a=blogUrl+"phoenix/web/v1/subscribe/subscribe-study?columnId="+e;getCookie("UserName")?$.ajax({url:a,type:"post",dataType:"json",xhrFields:{withCredentials:!0},success:function(e){200==e.code&&e.data.status?t.data("type")?($(".studyvip-unsubscribe").css("display","inline-block"),$(".studyvip-subscribe").css("display","none")):($(".studyvip-subscribe").css("display","inline-block"),$(".studyvip-unsubscribe").css("display","none")):showToast({text:e.data.msg||"操作失败，请重试！",bottom:"10%",zindex:9e3,speed:500,time:1500})},error:function(t){showToast({text:t.data.msg||"操作失败，请重试！",bottom:"10%",zindex:9e3,speed:500,time:1500})}}):window.csdn.loginBox.show()}var u=0,b=0,y="";$(document).on("click",".tip-subscribe-column>span",function(){$(this).parent().find(".tip").fadeIn()}),$(document).on("click",".tip-subscribe-column .bt-close",function(){$(".tip-subscribe-column").find(".tip").fadeOut()});var m="",g={boxshadow:$(".skin-boxshadow"),btClose:$(".bt-close"),payCode:$(".pay-code"),btSubscribe:$(".bt-subscribe-article"),btSubscribeColumn:$(".bt-subscribe-text"),getPay:$(".get-pay")},f=!1,h=window.location.href;h.indexOf("category_")>-1&&!f&&getCookie("UserName")&&g.getPay.length&&(m=g.getPay.data("id"),p(g.getPay.data("id"),"column")),$(document).on("click",".bt-subscribe",function(){getCookie("UserName")||window.csdn.loginBox.show()}),g.getPay.on("click",function(){f=!1,m=$(this).data("id"),e(m)}),$(document).on("click",".articleColumnBt",function(t){f=!0;var e=$(this).data("price"),a=$(this).data("oldprice");m=$(this).data("id"),$("#payCode").attr("data-id",m),$(".pay-money-span").attr("data-nowprice",e).attr("data-oldprice",a),$(".pay-money-span").text(e),getCookie("UserName")?p(m,"details"):window.csdn.loginBox.show();var o=t||window.event;o.stopPropagation?o.stopPropagation():o.cancelBubble=!0}),g.payCode.on("click",".renovate",function(){e(m||$(this).parent().data("id"))}),g.btClose.on("click",function(){g.payCode.fadeOut(function(){g.boxshadow.fadeOut()})});var w=blogStaticHost+"dist/pc/img/pay-time-out.png",x="获取中",v='<img class="repeat-again" src="'+w+'"><span class="text">'+x+"</span>",C='<div class="renov-men"><img src="'+w+'"><span>'+x+"</span></div>",k='<div class="renovate">    <img src="'+blogStaticHost+'dist/pc/img/pay-time-out.png">    <span>点击重新获取</span></div>',_='<img class="repeat-again" src="'+blogStaticHost+'dist/pc/img/pay-time-out.png"><span class="text">点击重新获取</span>';$(".now-price").text();$(".pay-code-radio").click(function(){var t=$(this).attr("data-flag");"true"==t?(u=0,$(this).attr("data-flag","false"),$(this).prop("checked",!1)):(u=1,$(this).attr("data-flag","true"),$(this).prop("checked",!0)),p(m,$(this).attr("data-type"))});var I=$(".subscribe-price .now-price").text().slice(1),P=0;g.payCode.on("click",".blance-bt",function(){window.open(y)}),$(document).on("click",".column-studyvip-pass",function(){getCookie("UserName")?window.csdn&&window.csdn.userOrderTip&&window.csdn.userOrderTip.show({flag:38,tags:["38"]}):window.csdn.loginBox.show()}),$(document).on("click",".column-studyvip-ajax",l)});