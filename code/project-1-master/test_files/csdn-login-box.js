"use strict";!function(){function t(t){window.csdn&&window.csdn.report&&window.csdn.report.reportClick(t)}function i(t){window.csdn&&window.csdn.report&&window.csdn.report.reportView(t)}function o(t){this.inputData=t,this.defaultParams={domain:"csdn.net",isIframe:!0,frameWidth:715,frameHeight:376,append:"#passportbox",iframeName:"passport_iframe",from:encodeURIComponent(window.location.href),pvSource:"",service:"",loginService:"https://passport.csdn.net/account/login"},this.options=Object.assign({},this.defaultParams,this.inputData),this.extend="",this.renderCss(),this.fileExtends(),this.init(this.options)}window.csdn=window.csdn||{};var e=function(t){var i=document.cookie;return i&&function(){var o,e={};i=i.split("; ");for(var n=0,s=i.length;n<s&&(o=i[n].split("="),!(o.length>0&&(o[0]===t&&(e.key=o[0],e.value=o[1],e.status=!0),"key"in e)));n++);return"key"in e&&e}()};o.prototype.init=function(t){this.renderHtml(t)},o.prototype.fileExtends=function(){for(var t in this.inputData)this.defaultParams.hasOwnProperty(t)||(this.extend=this.extend+"&"+t+"="+this.inputData[t])},o.prototype.renderCss=function(){var t=window.document.head,i=t.firstElementChild||t.firstChild,o=document.createElement("style");o.innerText=".passport-login-container{position: fixed;top: 0;left: 0;z-index: 9999;width: 100%;height: 100%;}.passport-login-box{position: absolute;display: block;border-radius: 8px;left: 50%;top: 50%;z-index: 10001;-webkit-transform: translate(-50%, -50%);-ms-transform: translate(-50%, -50%);-o-transform: translate(-50%, -50%);-moz-transform: translate(-50%, -50%);transform: translate(-50%, -50%);background-color: #fff;}.passport-login-mark{position: absolute;top: 0;left: 0;z-index: 9999;background-color: rgba(0, 0, 0, 0.5);width: 100%;height: 100%;}",t.insertBefore(o,i)},o.prototype.renderHtml=function(){var t=this,o=this.options.loginService;return this.$loginDom=$('<div class="passport-login-container"><div id='+this.options.append.replace(/[#\.]/,"")+' class="passport-login-box" style="display: block;'+(this.options.frameHeight?"height:"+this.options.frameHeight+"px":"")+'"></div></div>'),this.$markDom=$('<div class="passport-login-mark"></div>'),window.document.domain=this.options.domain,o=o+(-1===o.indexOf("?")?"?from=":"&from=")+this.options.from,o=this.options.service?o+"&service="+this.options.service:o,o+="&iframe=true",o+="&newframe=true",o=this.options.pvSource?o+"&"+this.options.pvSource:o,o=this.extend?o+this.extend:o,this.$iframeHtml=$('<iframe  width="'+this.options.frameWidth+'" height="'+this.options.frameHeight+'" name="'+this.options.iframeName+'" src="'+o+'" style="border-radius: 8px;" frameborder="0" scrolling="no"></iframe>'),this.$closeBtn=$('<span style="display: inline-block; color: #999; font-size: 22px; cursor: pointer; position:absolute; top:2%; right:3%;-moz-user-select:none; -webkit-user-select:none; user-select:none;">&times</span>'),this.$closeBtn.on("click",function(){t.close()}),this.$markDom.on("click",function(){t.close()}),this.$loginDom.append(this.$markDom),$("body").append(this.$loginDom),$(this.options.append).append(this.$iframeHtml),$(this.options.append).append(this.$closeBtn),i({spm:"3001.6428"}),!0},o.prototype.close=function(){t({spm:"3001.6428"}),this.$loginDom.remove(),window.csdn.loginBox.self=void 0},window.csdn.loginBox={self:void 0,show:function(t){if(e("UserName"))return void void 0;this.self||(this.self=new o(t))},close:function(){return this.self.close()}}}();