/* common.js
 * Dantyli 2017-11-11
 * 1.flexible.js
 * */
;(function(win, lib) {
    var doc = win.document;
    var docEl = doc.documentElement;
    var metaEl = doc.querySelector('meta[name="viewport"]');
    var flexibleEl = doc.querySelector('meta[name="flexible"]');
    var dpr = 0;
    var scale = 0;
    var tid;
    var flexible = lib.flexible || (lib.flexible = {});
    if (metaEl) {
        var match = metaEl.getAttribute('content').match(/initial\-scale=([\d\.]+)/);
        if (match) {
            scale = parseFloat(match[1]);
            dpr = parseInt(1 / scale);
        }
    } else if (flexibleEl) {
        var content = flexibleEl.getAttribute('content');
        if (content) {
            var initialDpr = content.match(/initial\-dpr=([\d\.]+)/);
            var maximumDpr = content.match(/maximum\-dpr=([\d\.]+)/);
            if (initialDpr) {
                dpr = parseFloat(initialDpr[1]);
                scale = parseFloat((1 / dpr).toFixed(2));    
            }
            if (maximumDpr) {
                dpr = parseFloat(maximumDpr[1]);
                scale = parseFloat((1 / dpr).toFixed(2));    
            }
        }
    }

    if (!dpr && !scale) {
        var isAndroid = win.navigator.appVersion.match(/android/gi);
        var isIPhone = win.navigator.appVersion.match(/iphone/gi);
        var devicePixelRatio = win.devicePixelRatio;
        if (isIPhone) {
            // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
            if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {                
                dpr = 3;
            } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)){
                dpr = 2;
            } else {
                dpr = 1;
            }
        } else {
            // 其他设备下，仍旧使用1倍的方案
            dpr = 1;
        }
        scale = 1 / dpr;
    }

    docEl.setAttribute('data-dpr', dpr);
    if (!metaEl) {
        metaEl = doc.createElement('meta');
        metaEl.setAttribute('name', 'viewport');
        metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
        if (docEl.firstElementChild) {
            docEl.firstElementChild.appendChild(metaEl);
        } else {
            var wrap = doc.createElement('div');
            wrap.appendChild(metaEl);
            doc.write(wrap.innerHTML);
        }
    }
    function refreshRem(){
        var width = docEl.getBoundingClientRect().width;
        if (width / dpr > 640) {
            width = 640 * dpr;
        }
        var rem = width / 10;
        docEl.style.fontSize = rem + 'px';
        flexible.rem = win.rem = rem;
    }
    win.addEventListener('resize', function() {
        clearTimeout(tid);
        tid = setTimeout(refreshRem, 300);
    }, false);
    win.addEventListener('pageshow', function(e) {
        if (e.persisted) {
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);
        }
    }, false);
    if (doc.readyState === 'complete') {
        doc.body.style.fontSize = 12 * dpr + 'px';
    } else {
        doc.addEventListener('DOMContentLoaded', function(e) {
            doc.body.style.fontSize = 12 * dpr + 'px';
        }, false);
    }
    refreshRem();
    flexible.dpr = win.dpr = dpr;
    flexible.refreshRem = refreshRem;
    flexible.rem2px = function(d) {
        var val = parseFloat(d) * this.rem;
        if (typeof d === 'string' && d.match(/rem$/)) {
            val += 'px';
        }
        return val;
    }
    flexible.px2rem = function(d) {
        var val = parseFloat(d) / this.rem;
        if (typeof d === 'string' && d.match(/px$/)) {
            val += 'rem';
        }
        return val;
    }
})(window, window['lib'] || (window['lib'] = {}));
$(function(){
	let b = $;
	//凭证图片
	{
		b('body').on('click','.imgzoom',function(){
			let imgZoom=new Image();
			imgZoom.setAttribute('class','imgZom');
			b('body').append(imgZoom);
			b('body').append('<div class="mask"></div>');
			let zoomSrc=b(this).attr('src');
			b('body .imgZom').attr('src',zoomSrc);
			b('body .imgZom').fadeIn();
			b('body .imgZom').on('click',function(){
				$(this).remove();
				$('body .mask').remove();
			});
		});
		b('body').on('click','.addUp',function(){
			b('.inputUp').trigger('click');
		})
	    let formData = new FormData(),
			imgArr=[];
		b('body').on('change input','.inputUp', function() {
			var me = this;
			if (me.value) {
				let img = new Image();
				let getUrl = function(blob) {
					return window[window.webkitURL ? 'webkitURL' : 'URL']['createObjectURL'](blob);
				}
				img.src = getUrl(this.files[0]);
				img.onload = function() {
					let maxWidth = 1000,
						maxHeight = 1000,
						imgWidth = img.width,
						imgHeight = img.height;
					if (imgHeight > maxHeight || imgWidth > maxWidth) {
						if (imgHeight / maxHeight > imgWidth / maxWidth) {
							imgHeight = maxHeight;
							imgWidth = imgHeight * img.width / img.height;
						} else {
							imgWidth = maxWidth;
							imgHeight = imgWidth * img.height / img.width;
						}
					}
					let canvas = document.createElement("canvas");
					canvas.width = imgWidth * 0.7;
					canvas.height = imgHeight * 0.7;
					let ctx = canvas.getContext("2d");
					ctx.clearRect(0, 0, canvas.width, canvas.height);
					ctx.drawImage(img, 0, 0, canvas.width, canvas.height); //image转换为canvas
					imgs = new Image()
					imgs.src = canvas.toDataURL("image/jpeg", 0.9); //canvas内容提取为图片,jpg格式可设置图片质量
					imgs.setAttribute('class','imgzoom');
					b('body .imgContainer').append(imgs);
				}
			}
		})
	}
	//提示
	{
		jQuery.Alert=function(msg){
				let tips='<div class="normal_tips">'+msg+'</div>';
				b('body').append(tips);
				let timer=setTimeout(function(){
						b('body .normal_tips').remove();
					},1500);	
		};
		jQuery.sureAlert=function(msg){
			let mask='<div class="mask"></div>';
			let sureTips='<ul class="sureTips"><li>'+msg+'</li><li>确定</li></ul>';
			b('body').append(mask);
			b('body').append(sureTips);
			b('body .sureTips li:eq(1)').on('click',function(){
				b('body .mask').remove();
				b('body .sureTips').remove();
				b('body .sureTips li:eq(1)').off('click');
			})
		};
		jQuery.optAlert=function(str,canOpts){
			let mask='<div class="mask"></div>';
			let opts='<ul class="optAlert"><li class="cont">'+str+'</li><li><p class="orders_cancel">取消</p><p class="'+canOpts+'">确定</p></li></ul>';
			b('body').append(mask);
			b('body').append(opts);
			b('body').on('click','.orders_cancel',function(){
				b('body .mask').remove();
				b('body .optAlert').remove();
				b('body').off('click','.orders_cancel');
			});
			b('body').on('click','.'+canOpts,function(){
				setTimeout(function(){
					b('body .mask').remove();
				    b('body .optAlert').remove();
				    b('body').off('tap','.'+canOpts);
				},100)
			})
		}
		jQuery.required=function(){
			let prompt=['用户名不能为空','密码不能为空'];
                    for(var i=0;i<b('.requires').length;i++){
                    	let that=this;
                    	if($.trim(b('.requires').get(i).value).length==0){
                    		b.sureAlert(prompt[i]);
                    		break;
                    	}
                    }
		}
	}
})
		
	
	