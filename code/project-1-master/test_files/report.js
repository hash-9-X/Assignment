!function(e){var t,o,r,n,i,a,c,s,d,f;i=[],t={DELAY:500,API_VERSION:"0.6.0",SERVER_URL:"https://event.csdn.net/"},f=["utm_source"],s={pv:t.SERVER_URL+"logstores/csdn-pc-tracking-pageview/track_ua.gif?APIVersion="+t.API_VERSION,click:t.SERVER_URL+"logstores/csdn-pc-tracking-page-click/track_ua.gif?APIVersion="+t.API_VERSION,view:t.SERVER_URL+"logstores/csdn-pc-tracking-page-exposure/track"},n={PV:"pv",VIEW:"view",DELAY_VIEW:"delay_view",CLICK:"click"},c={SKIPPED_AND_VISIBLE:"0",VISIBLE:"1"};if(r={guid:function(){return+new Date+"-xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){var t=16*Math.random()|0;return("x"==e?t:3&t|8).toString(16)})},setLogIdCookie:function(e){if(-1===["pv","click","view"].indexOf(e))return void void 0;var t="log_Id_"+e,o=r.getCookie(t)||0;try{o=parseInt(o),"number"==typeof o&&isNaN(o)?r.setCookie(t,1,31536e7):r.setCookie(t,++o,31536e7)}catch(e){void 0}},getRequest:function(){for(var e=new Object,t=window.location.href.split("?")[1]||"",o=t.split("&"),r=0;r<o.length;r++){var n=o[r].split("=")[0],i=o[r].split("=")[1];n&&i&&(e[n]=unescape(i))}return e},initUTM:function(){d={};var e=r.getRequest();if("{}"!==JSON.stringify(e)){var t=!1;for(var o in e)if(0==o.indexOf("utm_")&&e.hasOwnProperty(o)){t=!0;break}if(t){var n=r.getFuzzyCookie("c_utm_"),i=n.split(";");for(var o in i)if(i.hasOwnProperty(o)){var a=i[o].split("=")[0];a&&(void 0,r.setCookie(a,"",-1))}void 0,r.setCookie("utm_source","",-1)}for(var o in e)0==o.indexOf("utm_")&&e.hasOwnProperty(o)&&(void 0,r.setCookie("c_"+o,e[o],36e5));for(var o in f)if(f.hasOwnProperty(o)){var c=f[o],s=e[f[o]];s?(r.setCookie(c,s,36e5),d[c]=s):d[c]=""}}else for(var o in f)if(f.hasOwnProperty(o)){var c=f[o],s=r.getCookie(c);d[c]=s}return d},initTraceInfo:function(){for(var e=["blog","bbs","download","ask","edu","biwen"],t=0;t<e.length;t++)window.location.host.indexOf(e[t]+".csdn.net")>-1&&(r.setCookie("c_page_id","",-1),r.setCookie("c_mod","",-1))},preserveTraceInfo:function(e){e.mod&&r.setCookie("c_mod",e.mod,36e5),e.page_id?r.setCookie("c_page_id",e.page_id,36e5):r.setCookie("c_page_id","default",36e5)},getTimestamp:function(){return Math.round(new Date/1e3)},getXPath:function(e){if(""!==e.id)return'//*[@id="'+e.id+'"]';if(e==document.body)return"/html/"+e.tagName.toLowerCase();if(!e.parentNode)return"";for(var t=1,o=e.parentNode.childNodes,r=0,n=o.length;r<n;r++){var i=o[r];if(i==e)return arguments.callee(e.parentNode)+"/"+e.tagName.toLowerCase()+"["+t+"]";1==i.nodeType&&i.tagName==e.tagName&&t++}},getScreen:function(){return window.screen.width+"*"+window.screen.height},getCookie:function(e){var t,o=new RegExp("(^| )"+e+"=([^;]*)(;|$)");return(t=document.cookie.match(o))?unescape(t[2]):""},getFuzzyCookie:function(e){var t,o=new RegExp(e+"[A-Za-z0-9_]+=([^;]*);","ig");return(t=document.cookie.match(o))?t.join(""):""},checkoutUtm:function(){var e=[],t=[],o=window.location.href.split("?")[1]||"";if(o.length){e=o.split("&");for(var r=0;r<e.length;r++)0==e[r].indexOf("utm_")&&t.push(e[r].split("=")[0])}return t},setCookie:function(e,t,o){var r=new Date;r.setTime(r.getTime()+o),document.cookie=e+"="+escape(t)+";expires="+r.toGMTString()+";path=/ ; domain=."+this.topDomain(window.location.host)},setUtmInfo:function(){},setUserSegment:function(){var e=(null!=(_ref1=/(; )?(uuid_tt_dd|_javaeye_cookie_id_)=([^;]+)/.exec(window.document.cookie))?_ref1[3]:void 0)||"",t=e?e.substring(e.length-6)%16:0;r.setCookie("c_segment",t)},setfirstPageInfo:function(){if(r.getCookie("c_first_ref")&&r.getCookie("c_first_ref").indexOf(".csdn.net")>-1)return void r.setCookie("c_first_ref","default");var e=new RegExp(/[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/),t=window.document.referrer?window.document.referrer.match(e)[0]:"default";return(t.indexOf(".csdn.net")>-1||t.indexOf("wx.tenpay.com")>-1)&&(t="default"),"default"!=t?(r.setCookie("c_first_ref",t),void r.setCookie("c_first_page",window.location.href)):r.getCookie("c_first_ref")?void 0:(r.setCookie("c_first_ref","default"),void r.setCookie("c_first_page",window.location.href))},initData:function(){r.setfirstPageInfo(),r.initTraceInfo(),r.setUserSegment();var t,o,n,i=(null!=(t=/(; )?(uuid_tt_dd|_javaeye_cookie_id_)=([^;]+)/.exec(window.document.cookie))?t[3]:void 0)||"",s=r.getCookie("dc_session_id");if(s||(s="10_"+(new Date).getTime()+"."+Math.random().toString().slice(-6)),r.setCookie("dc_session_id",s,18e5),a={cid:i,sid:s||"",pid:window.location.host.split(".csdn.net")[0],uid:r.getCookie("UserName"),did:r.getCookie("X-Device-ID")||i||"",dc_sid:r.getCookie("dc_sid"),ref:window.document.referrer||("(null)"===r.getCookie("refer_app")?"":r.getCookie("refer_app")),curl:window.location.href,dest:"",cfg:{viewStrategy:c.VISIBLE}},n=r.initUTM(),e("meta[name=report]").attr("content"))try{o=JSON.parse(e("meta[name=report]").attr("content"))}catch(e){o={},void 0}else o={};if(o.extra){var d=r.parseExtra(o);d&&(o.extra=d)}return a=e.extend({},a,{utm:n.utm_source},o),r.preserveTraceInfo(a),a},tos:function(){var e,t,o,r;e=+new Date/1e3|0,o=null!=(t=/\bdc_tos=([^;]*)(?:$|;)/.exec(document.cookie))?t[1]:void 0;try{r=e-parseInt(o,36)}catch(e){void 0,r=-1}return document.cookie="dc_tos="+e.toString(36)+" ; expires="+new Date(1e3*(e+14400)).toGMTString()+" ; max-age=14400 ; path=/ ; domain=."+this.topDomain(window.location.host),r},topDomain:function(e){return/\.?([a-z0-9\-]+\.[a-z0-9\-]+)(:\d+)?$/.exec(e)[1]},copyArr:function(e){for(var t=[],o=0;o<e.length;o++)t.push(e[o]);return t},isView:function(e,t){var o=this;if(!e)return!1;var r=this.getElementBottom(e),n=r+e.offsetHeight;return c.VISIBLE==t?o.scrollTop()<r&&r<o.scrollTop()+o.windowHeight()||o.scrollTop()<n&&n<o.scrollTop()+o.windowHeight():c.SKIPPED_AND_VISIBLE==t?r<=o.scrollTop()+o.windowHeight()||(o.scrollTop()<r&&r<o.scrollTop()+o.windowHeight()||o.scrollTop()<n&&n<o.scrollTop()+o.windowHeight()):void 0},scrollTop:function(){return Math.max(document.body.scrollTop,document.documentElement.scrollTop)},windowHeight:function(){return"CSS1Compat"==document.compatMode?document.documentElement.clientHeight:document.body.clientHeight},getElementTop:function(t){if("undefined"!=typeof jQuery)return e(t).offset().top;var o=t.offsetTop;for(t=t.offsetParent;null!=t;)o+=t.offsetTop,t=t.offsetParent;return o},getElementBottom:function(t){if("undefined"!=typeof jQuery)return e(t).offset().top+e(t).height();var o=t.offsetTop;for(t=t.offsetParent;null!=t;)o+=t.offsetTop,t=t.offsetParent;return o},url2Obj:function(e){var t={},o=e.split("&");for(var r in o)t.hasOwnProperty(r)&&(t[o[r].split("=")[0]]=decodeURIComponent(o[r].split("=")[1]));return t},fixParamConTop:function(t,o){return t.con.split(",top_")>-1?t:(t.con=t.con+",top_"+e(o).offset().top,t)},urlParamsToObj:function(e){var t={};return e.replace(/([^=&#]+)=([^&#]*)/g,function(){t[arguments[1]]=arguments[2]}),t},objToUrlParams:function(t){var o="";return e.each(t,function(e){o+="&"+e+"="+t[e]}),o.substr(1)},trackOrderSource:function(){var e=document.referrer;if(e){const t=document.createElement("a");t.href=e;var o=["passport","order.csdn.net","wx.tenpay.com","cart.csdn.net"],n=[/(^https:\/\/mall\.csdn\.net(:[0-9]{1,5})?\/cart$)/],i=!1;try{for(var a=0;a<o.length;a++)t.hostname.indexOf(o[a])>-1&&(i=!0);for(var a=0;a<n.length;a++)n[a].test(e)&&(i=!0)}catch(e){i=!1}if(!i){if(r.getCookie("c_ref")===e)return;t.hostname.indexOf(".csdn.net")>-1?(r.setCookie("c_pref",r.getCookie("c_ref")),r.setCookie("c_ref",e)):(r.setCookie("c_pref",r.getCookie("c_ref")),r.setCookie("c_ref",e.split("?")[0]))}}},parseExtra:function(e){if(!Object.prototype.hasOwnProperty.call(e,"extra"))return"";var t=Object.prototype.toString.call(e.extra).slice(8,-1);if("Object"===t)return e.extra;if("String"!==t||!e.extra)return{};try{return JSON.parse(e.extra)}catch(t){void 0}},assignExtra:function(t){if(t&&(t.extra||a.extra)){var o=r.parseExtra(t);return o=e.extend(!0,{},a.extra||{},o||{}),JSON.stringify(o)}}},o={timer:0,checkTimer:0,getFullSpm:function(e){if(2===e.split(".").length){var t=document.querySelector('meta[name="report"]'),o=t&&t.getAttribute("content")||"{}",r=JSON.parse(o);return r.spm?r.spm+"."+e:e}return e},reportServer:function(o,a){void 0!==o&&void 0!==a&&i.push(a);var c=r.copyArr(i);if(0!=c.length){i=[];var d={__source__:"csdn",__logs__:c};if(r.setLogIdCookie(n.VIEW),o===n.VIEW||o===n.DELAY_VIEW){var f=window.navigator.userAgent,p="PC";f.toLowerCase().indexOf("csdnedu")>-1?p="CSDNEDU":f.toLowerCase().indexOf("csdnapp")>-1?p="CSDNApp":f.toLowerCase().indexOf("mobile")>-1&&(p="mobile"),d.__tags__={useragent:f,platform:p,log_id:r.getCookie("log_Id_"+n.VIEW)}}e.ajax({url:s[n.VIEW],type:"POST",crossDomain:!0,xhrFields:{withCredentials:!1},contentType:"text/plain;charset=UTF-8",headers:{"x-log-apiversion":t.API_VERSION,"x-log-bodyrawsize":"1234"},data:JSON.stringify(d),success:function(){},error:function(){void 0}})}},reportServerDelay:function(e,o){i.push(o);var r=this;r.timer&&clearTimeout(r.timer),r.timer=setTimeout(function(){r.reportServer(n.DELAY_VIEW)},t.DELAY)},reportView:function(t,o,i){if(!t)return void void 0;t.spm&&(t.spm=this.getFullSpm(t.spm));var c=e.extend(!0,{},a,t);try{var s=r.assignExtra(t);s&&(c.extra=s)}catch(e){t&&t.extra&&(c.extra=t.extra),void 0}var d=r.getFuzzyCookie("c_");c.t=r.getTimestamp()+"",c.eleTop=o?o.offset().top+"":"",delete c.cfg,d&&(c.cCookie=d),c.__time__=r.getTimestamp(),c.curl=window.location.href,void 0===i?this.reportServerDelay(n.VIEW,c):this.reportServer(n.VIEW,c),"function"==typeof csdn.afterReportView&&csdn.afterReportView(o,t)},reportClick:function(t,o){var i=e.extend(!0,{},a,t);t.spm||(i.spm="");try{var c=r.assignExtra(t);c&&(i.extra=c)}catch(e){t&&t.extra&&(i.extra=t.extra),void 0}i.spm=this.getFullSpm(i.spm),i.t=r.getTimestamp(),i.elePath=o?r.getXPath(o[0])+"":"",i.eleTop=o?o.offset().top+"":"",i.trace&&r.preserveTraceInfo(i);var d=r.getFuzzyCookie("c_");d&&(i.cCookie=d),i.curl=window.location.href,delete i.cfg,r.setLogIdCookie(n.CLICK),i.log_id=r.getCookie("log_Id_"+n.CLICK),e.ajax({url:s[n.CLICK],type:"get",crossDomain:!0,xhrFields:{withCredentials:!1},contentType:"text/plain;charset=UTF-8",data:i,success:function(){},error:function(){void 0}})},reportPageView:function(t){var o=e.extend(!0,{},a,t);try{var i=r.assignExtra(t||{});i&&(o.extra=i)}catch(e){t&&t.extra&&(o.extra=t.extra),void 0}o.tos=r.tos(),o.adb=r.getCookie("c_adb")||0,o.curl=window.location.href;var c=r.getFuzzyCookie("c_");c&&(o.cCookie=c),o.t=r.getTimestamp(),o.screen=r.getScreen(),o.un=r.getCookie("UN")||r.getCookie("UserName"),o.urn=r.guid(),o.vType=r.getCookie("p_uid")||"",delete o.cfg,delete o.dest,r.setLogIdCookie(n.PV),o.log_id=r.getCookie("log_Id_"+n.PV),e.ajax({url:s[n.PV],type:"get",crossDomain:!0,xhrFields:{withCredentials:!1},contentType:"text/plain;charset=UTF-8",data:o,success:function(){},error:function(){void 0}})},viewCheck:function(){var t=this;clearTimeout(t.checkTimer),t.checkTimer=setTimeout(function(){e("[data-report-view]").each(function(){var o=e(this),n=o.data("reportView"),i=e.extend({},a,n);n.spm||(i.spm=""),i.spm=t.getFullSpm(i.spm),i.curl=window.location.href,r.isView(o.get(0),i.cfg.viewStrategy)&&(csdn.report.reportView(i,o),o.removeData("reportView"),o.removeAttr("data-report-view"))})},200)},isView:function(e){return r.isView(e)},addSpmToHref:function(e){var t=e,o=this,n=t.data("reportQuery")||"",i=t.length&&t[0].hash?t[0].hash.split("#").map(function(e){return e.split("?")[0]}):[],a=i.length&&-1===i[i.length-1].indexOf("/");if(n){var c=t.attr("href"),s=c,d={};-1!==c.indexOf("?")&&(s=c.split("?")[0],d=r.urlParamsToObj(c.split("?")[1])),a&&(s=c.split("#")[0]);var f=r.urlParamsToObj(n);if((n.indexOf("spm")>-1||n.indexOf("SPM")>-1)&&(f.spm=f.spm||f.SPM,f.spm=o.getFullSpm(f.spm)),a){var p=i.pop();s+=i.join("#")+"?"+r.objToUrlParams(Object.assign(d,f))+"#"+p}else s+="?"+r.objToUrlParams(Object.assign(d,f));t.attr("href",s)}}},void 0===window.csdn&&(window.csdn={}),csdn.report)return void void 0;r.trackOrderSource(),window.csdn.report=o,a=r.initData(),a.disabled||csdn.report.reportPageView(),e(function(){var t=csdn.report;e(document).on("click","[data-report-click]",function(){var o=e(this).data("reportClick");t.reportClick(o,e(this))}),t.viewCheck(e("[data-report-view]")),e(window).on("scroll",function(){t.viewCheck(e("[data-report-view]"))}),e(document).on("contextmenu","a[data-report-query]",function(){t.addSpmToHref(e(this))}),e(document).on("click","a[data-report-query]",function(){t.addSpmToHref(e(this))}),e(document).on("click","a[href]",function(){var o=e(this),r=o.attr("href");if(function(e){return!(!/^https:\/\/|^http:\/\//gi.test(e)||"/"===e||e.indexOf(".csdn.net")>-1||e.indexOf(".iteye.com")>-1)}(r)){var n={mod:"1583921753_001",dest:r};t.reportClick(n,o)}})})}(jQuery);