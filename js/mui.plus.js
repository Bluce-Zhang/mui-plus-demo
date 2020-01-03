/**
 *在mui的基础上新加一些常用的功能
 */
;(function($, window, document) {
	var CLASS_POPUP = 'mui-popup';
	var CLASS_POPUP_BACKDROP = 'mui-popup-backdrop';
	var CLASS_POPUP_IN = 'mui-popup-in';
	var CLASS_POPUP_OUT = 'mui-popup-out';
	var CLASS_POPUP_INNER = 'mui-popup-inner';
	var CLASS_POPUP_TITLE = 'mui-popup-title';
	var CLASS_POPUP_TEXT = 'mui-popup-text';
	var CLASS_POPUP_INPUT = 'mui-popup-input';
	var CLASS_POPUP_BUTTONS = 'mui-popup-buttons';
	var CLASS_POPUP_BUTTON = 'mui-popup-button';
	var CLASS_POPUP_BUTTON_BOLD = 'mui-popup-button-bold';
	var CLASS_POPUP_BACKDROP = 'mui-popup-backdrop';
	var CLASS_ACTIVE = 'mui-active';
	var CLASS_POPUP_SELECT_ITEM = 'mui-popup-select-item';
	var CLASS_POPUP_CONFIRM_IMAGE = 'mui-popup-confirm-image';
	var CLASS_POPUP_CONFIRM_IMAGE_SELECT_TITLE='mui-popup-confirm-image-select-title'
	var CLASS_POPUP_CONFIRM_IMAGE_SELECT_INNER = 'mui-popup-confirm-image-select-inner'
	var CLASS_POPUP_CONFIRM_IMAGE_SELECT = 'mui-popup-confirm-image-select';
	var CLASS_POPUP_IMAGE_SELECT = 'mui-popup-image-select';
	var CLASS_POPUP_ALERT_IMAGE = 'mui-popup-alert-image';
	var CLASS_POPUP_ALERT_IMAGE_BUTTON = 'mui-popup-alert-image-button';
	var CLASS_POPUP_INNER_IMAGE_ALERT ='mui-popup-inner-image-alert';
	var popupStack = [];
	var backdrop = (function() {
	    var element = document.createElement('div');
	    element.classList.add(CLASS_POPUP_BACKDROP);
	    element.addEventListener($.EVENT_MOVE, $.preventDefault);
	    element.addEventListener('webkitTransitionEnd', function() {
	        if (!this.classList.contains(CLASS_ACTIVE)) {
	            element.parentNode && element.parentNode.removeChild(element);
	        }
	    });
	    return element;
	}());
	/**
	 * 创建选择条目
	 */
	var createSlectItem = function(items){
		var html = '<ul class="mui-table-view">';
		for (var i = 0; i < items.length; i++) {
			//items[i].name
			//var str = '<div class="' + CLASS_POPUP_SELECT_ITEM + '">item</div>'
			var str = '<li class="mui-table-view-cell '+CLASS_POPUP_SELECT_ITEM+'">'+items[i]+'</li>'
			html += str;
		}
		html = html + "</ul>"
		return html;
	}
	/**
	 * 创建带图片的确认框的内部
	 */
	var createImageInner = function(src,message, title, extra) {
		if (src) {
			return '<div class="' + CLASS_POPUP_INNER + '"><div class="' + CLASS_POPUP_TITLE + '">' + title + '</div>'
			+'<div class="'+CLASS_POPUP_CONFIRM_IMAGE+'"><img src="'+src+'"></div>'
			+'<div class="' + CLASS_POPUP_TEXT + '">' + message.replace(/\r\n/g, "<br/>").replace(/\n/g, "<br/>") + '</div>' + (extra || '') + '</div>';
		} else{
			return '<div class="' + CLASS_POPUP_INNER + '"><div class="' + CLASS_POPUP_TITLE + '">' + title + '</div>'
			+'<div class="' + CLASS_POPUP_TEXT + '">' + message.replace(/\r\n/g, "<br/>").replace(/\n/g, "<br/>") + '</div>' + (extra || '') + '</div>';
		}
	    
	};
	var createImagesSelectInner = function(srcs,message, title, extra){
		if (srcs) {
			//拼接图片标签字符串  带单选按钮的
			/*
			var imagesSelectHtml = '';
			for (var i = 0; i < srcs.length; i++) {
				imagesSelectHtml += '<div class="'+CLASS_POPUP_IMAGE_SELECT+' mui-input-row mui-radio">'+'<img src="'+srcs[i]+'">'
				+'<input name="radio1" type="radio">'
				+'</div>'
			}
			return '<div class="' + CLASS_POPUP_INNER + '"><div class="' + CLASS_POPUP_TITLE + '">' + title + '</div>'
			+'<div class="'+CLASS_POPUP_CONFIRM_IMAGE_SELECT+'">'+imagesSelectHtml+'</div>'
			+'<div class="' + CLASS_POPUP_TEXT + '">' + message.replace(/\r\n/g, "<br/>").replace(/\n/g, "<br/>") + '</div>' + (extra || '') + '</div>';
			*/
		   var imagesSelectHtml = '';
		   for (var i = 0; i < srcs.length; i++) {
		   	imagesSelectHtml += '<div class="'+CLASS_POPUP_IMAGE_SELECT+'">'+'<img src="'+srcs[i]+'">'
		   	+'</div>'
		   }
		   return '<div class="' + CLASS_POPUP_TITLE + ' '+CLASS_POPUP_CONFIRM_IMAGE_SELECT_TITLE+'">' + title + '</div>'+
		   '<div class="' + CLASS_POPUP_INNER + ' '+ CLASS_POPUP_CONFIRM_IMAGE_SELECT_INNER+'">'
		   +'<div class="'+CLASS_POPUP_CONFIRM_IMAGE_SELECT+'">'+imagesSelectHtml+'</div>'
		   +'<div class="' + CLASS_POPUP_TEXT + '">' + message.replace(/\r\n/g, "<br/>").replace(/\n/g, "<br/>") + '</div>' + (extra || '') + '</div>';
		}else{
			return '<div class="' + CLASS_POPUP_INNER + '"><div class="' + CLASS_POPUP_TITLE + '">' + title + '</div>'
			+'<div class="' + CLASS_POPUP_TEXT + '">' + message.replace(/\r\n/g, "<br/>").replace(/\n/g, "<br/>") + '</div>' + (extra || '') + '</div>';
		}
	}
	/**
	 * 创建带图片的alert框内部
	 */
	var createAlertImageInner = function(src) {
	    return '<div class="' + CLASS_POPUP_INNER + ' '+CLASS_POPUP_INNER_IMAGE_ALERT+'">'+'<div class="'+CLASS_POPUP_ALERT_IMAGE+'"><img src="'+src+'"></div>';
	};
	/**
	 * 创建带图片的alert框内的取消按钮
	 */
	var createAlertImageButton = function(){
		var deleteImgBase64Str = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABPCAYAAAB8kULjAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKTWlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVN3WJP3Fj7f92UPVkLY8LGXbIEAIiOsCMgQWaIQkgBhhBASQMWFiApWFBURnEhVxILVCkidiOKgKLhnQYqIWotVXDjuH9yntX167+3t+9f7vOec5/zOec8PgBESJpHmomoAOVKFPDrYH49PSMTJvYACFUjgBCAQ5svCZwXFAADwA3l4fnSwP/wBr28AAgBw1S4kEsfh/4O6UCZXACCRAOAiEucLAZBSAMguVMgUAMgYALBTs2QKAJQAAGx5fEIiAKoNAOz0ST4FANipk9wXANiiHKkIAI0BAJkoRyQCQLsAYFWBUiwCwMIAoKxAIi4EwK4BgFm2MkcCgL0FAHaOWJAPQGAAgJlCLMwAIDgCAEMeE80DIEwDoDDSv+CpX3CFuEgBAMDLlc2XS9IzFLiV0Bp38vDg4iHiwmyxQmEXKRBmCeQinJebIxNI5wNMzgwAABr50cH+OD+Q5+bk4eZm52zv9MWi/mvwbyI+IfHf/ryMAgQAEE7P79pf5eXWA3DHAbB1v2upWwDaVgBo3/ldM9sJoFoK0Hr5i3k4/EAenqFQyDwdHAoLC+0lYqG9MOOLPv8z4W/gi372/EAe/tt68ABxmkCZrcCjg/1xYW52rlKO58sEQjFu9+cj/seFf/2OKdHiNLFcLBWK8ViJuFAiTcd5uVKRRCHJleIS6X8y8R+W/QmTdw0ArIZPwE62B7XLbMB+7gECiw5Y0nYAQH7zLYwaC5EAEGc0Mnn3AACTv/mPQCsBAM2XpOMAALzoGFyolBdMxggAAESggSqwQQcMwRSswA6cwR28wBcCYQZEQAwkwDwQQgbkgBwKoRiWQRlUwDrYBLWwAxqgEZrhELTBMTgN5+ASXIHrcBcGYBiewhi8hgkEQcgIE2EhOogRYo7YIs4IF5mOBCJhSDSSgKQg6YgUUSLFyHKkAqlCapFdSCPyLXIUOY1cQPqQ28ggMor8irxHMZSBslED1AJ1QLmoHxqKxqBz0XQ0D12AlqJr0Rq0Hj2AtqKn0UvodXQAfYqOY4DRMQ5mjNlhXIyHRWCJWBomxxZj5Vg1Vo81Yx1YN3YVG8CeYe8IJAKLgBPsCF6EEMJsgpCQR1hMWEOoJewjtBK6CFcJg4Qxwicik6hPtCV6EvnEeGI6sZBYRqwm7iEeIZ4lXicOE1+TSCQOyZLkTgohJZAySQtJa0jbSC2kU6Q+0hBpnEwm65Btyd7kCLKArCCXkbeQD5BPkvvJw+S3FDrFiOJMCaIkUqSUEko1ZT/lBKWfMkKZoKpRzame1AiqiDqfWkltoHZQL1OHqRM0dZolzZsWQ8ukLaPV0JppZ2n3aC/pdLoJ3YMeRZfQl9Jr6Afp5+mD9HcMDYYNg8dIYigZaxl7GacYtxkvmUymBdOXmchUMNcyG5lnmA+Yb1VYKvYqfBWRyhKVOpVWlX6V56pUVXNVP9V5qgtUq1UPq15WfaZGVbNQ46kJ1Bar1akdVbupNq7OUndSj1DPUV+jvl/9gvpjDbKGhUaghkijVGO3xhmNIRbGMmXxWELWclYD6yxrmE1iW7L57Ex2Bfsbdi97TFNDc6pmrGaRZp3mcc0BDsax4PA52ZxKziHODc57LQMtPy2x1mqtZq1+rTfaetq+2mLtcu0W7eva73VwnUCdLJ31Om0693UJuja6UbqFutt1z+o+02PreekJ9cr1Dund0Uf1bfSj9Rfq79bv0R83MDQINpAZbDE4Y/DMkGPoa5hpuNHwhOGoEctoupHEaKPRSaMnuCbuh2fjNXgXPmasbxxirDTeZdxrPGFiaTLbpMSkxeS+Kc2Ua5pmutG003TMzMgs3KzYrMnsjjnVnGueYb7ZvNv8jYWlRZzFSos2i8eW2pZ8ywWWTZb3rJhWPlZ5VvVW16xJ1lzrLOtt1ldsUBtXmwybOpvLtqitm63Edptt3xTiFI8p0in1U27aMez87ArsmuwG7Tn2YfYl9m32zx3MHBId1jt0O3xydHXMdmxwvOuk4TTDqcSpw+lXZxtnoXOd8zUXpkuQyxKXdpcXU22niqdun3rLleUa7rrStdP1o5u7m9yt2W3U3cw9xX2r+00umxvJXcM970H08PdY4nHM452nm6fC85DnL152Xlle+70eT7OcJp7WMG3I28Rb4L3Le2A6Pj1l+s7pAz7GPgKfep+Hvqa+It89viN+1n6Zfgf8nvs7+sv9j/i/4XnyFvFOBWABwQHlAb2BGoGzA2sDHwSZBKUHNQWNBbsGLww+FUIMCQ1ZH3KTb8AX8hv5YzPcZyya0RXKCJ0VWhv6MMwmTB7WEY6GzwjfEH5vpvlM6cy2CIjgR2yIuB9pGZkX+X0UKSoyqi7qUbRTdHF09yzWrORZ+2e9jvGPqYy5O9tqtnJ2Z6xqbFJsY+ybuIC4qriBeIf4RfGXEnQTJAntieTE2MQ9ieNzAudsmjOc5JpUlnRjruXcorkX5unOy553PFk1WZB8OIWYEpeyP+WDIEJQLxhP5aduTR0T8oSbhU9FvqKNolGxt7hKPJLmnVaV9jjdO31D+miGT0Z1xjMJT1IreZEZkrkj801WRNberM/ZcdktOZSclJyjUg1plrQr1zC3KLdPZisrkw3keeZtyhuTh8r35CP5c/PbFWyFTNGjtFKuUA4WTC+oK3hbGFt4uEi9SFrUM99m/ur5IwuCFny9kLBQuLCz2Lh4WfHgIr9FuxYji1MXdy4xXVK6ZHhp8NJ9y2jLspb9UOJYUlXyannc8o5Sg9KlpUMrglc0lamUycturvRauWMVYZVkVe9ql9VbVn8qF5VfrHCsqK74sEa45uJXTl/VfPV5bdra3kq3yu3rSOuk626s91m/r0q9akHV0IbwDa0b8Y3lG19tSt50oXpq9Y7NtM3KzQM1YTXtW8y2rNvyoTaj9nqdf13LVv2tq7e+2Sba1r/dd3vzDoMdFTve75TsvLUreFdrvUV99W7S7oLdjxpiG7q/5n7duEd3T8Wej3ulewf2Re/ranRvbNyvv7+yCW1SNo0eSDpw5ZuAb9qb7Zp3tXBaKg7CQeXBJ9+mfHvjUOihzsPcw83fmX+39QjrSHkr0jq/dawto22gPaG97+iMo50dXh1Hvrf/fu8x42N1xzWPV56gnSg98fnkgpPjp2Snnp1OPz3Umdx590z8mWtdUV29Z0PPnj8XdO5Mt1/3yfPe549d8Lxw9CL3Ytslt0utPa49R35w/eFIr1tv62X3y+1XPK509E3rO9Hv03/6asDVc9f41y5dn3m978bsG7duJt0cuCW69fh29u0XdwruTNxdeo94r/y+2v3qB/oP6n+0/rFlwG3g+GDAYM/DWQ/vDgmHnv6U/9OH4dJHzEfVI0YjjY+dHx8bDRq98mTOk+GnsqcTz8p+Vv9563Or59/94vtLz1j82PAL+YvPv655qfNy76uprzrHI8cfvM55PfGm/K3O233vuO+638e9H5ko/ED+UPPR+mPHp9BP9z7nfP78L/eE8/sl0p8zAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAYuSURBVHja7JxpbBVVFMd/uFQUNBoTE6PEPYGoCRKXVnGPmLgCUsXK0sUuItXWpSogcVdUWhRQkKVQwqJoFI2ixqVSCk0lCAGDRgx8QAV3JBDrVj/c85K+l3nvzZxZ3sy8/pP35WXOvTO/nLufc/t0d3fTK7369AL0D+CJwBXAycD3wPvArnxgAowEBgK/Ae3AZqcA+wETgKsF5B5gFdCYBwBvAMqBM4C9wFqgGdhmF+BZwDvieanaAFwL/BhTeK8AlRb/dwMVAjIjwP7ATuDYDJXsBIqA3TGD9xpQnOWZIqAjHcDjgDLgGRuV7QAuAH6KCbwVwC02nmsTyHusAN4G1ABDbVb6LXA+8GuewEs05VKgxQrgFGA8cLqDyrcDhcAvEYW3HBjt0OZR4BErgNXyO8dhgdulb/g5YvCWAiUKu4nAbCuAx0sf+KSi0G/EE6PSnJcAYxR2HdIH7ko3ChfIfOdUReFfy8CyN+TwWoCxStvBqZNqq3ngKcBG4GhFBV9Jc/49hvBKpM+0tRIZCKwDjlF6YpEsg8KkxcA4pW2p2DtaCw+SNn+UosJt0if+ERJ4C6V/16gMWKTdjTlTIPZXVLxVIO7PMbwFsrbVqNxq+eYEYALieuBIJcQLgX0RhFchnotbgG4hfikQg27O8wWCRpVij1cAAc6W5nyE4oW2SHM+EBC8uUCV0rYKmGf3Yac70oNldD5c8WKbZHT+02d4c2RFpVE1ZksLvwAmILYrPfEL2aw4EEJ4NeK5+A3QLcRNAtHr0fllgaDRBLEnKIAAQ2RgKVDYbpTm/JdH8GbKIl+jpM2BIAECnIc5M9BA/By4CPjbJbwXgVqlbS0wy03lXhxrnovZqe2rhHgx0JUDz3MNzyuACYhrgcMUthukT+wK0PPuFnvCAhDMVlY7cLDCtlMm2//afL4RqFe+5z1Ak1cf7XVkQpE0Zw3EddKc/8vy3HSBkHN4fgBEVhxrgEMVtuuBSzMMLE1AnfK96oEZXn+sX7ExhdInajyxQzzxHw897z6xJyoAkYGhTWnbTvLx6jSgQVnWA8Czfn2k39FZlwCtmIAdp2oFrpdpytPK+huA5/z8wCDC24YCnwEHKWy/A04IK7ygACJ92hqC00PYC1GJDECAy4FPAqhnCrqz7dADBBOw+bGP5U8Gngryg3IR4nsZ8Gkc4OUKoB/NeSrweC4+JJdB5sOADzwoJylaKp8AgtnZ7lQu+3yfJEcBYBVmN/gQpf1C9EeXkQf4MPCYB+V8iMkmyCuAkzyeq60GrskXgF7DS+hd4Lq4A5wMPOFj+e9h8lhiCfBB9LsqofXEoADeH/B0423gxrgAdAPvdWmSmlict4ARUQfYgNlN1miaNPsrgY+UZawChkcV4L3A80rbRrFPaDjwprIsXz3RL4B16I8PZ2B95nuTNGmN3gBGRQVgPfq84lTPS9UoYKWL/rQ47ADdwGvC3rGlG0/0HKKXAO8CXlDazhR7uyrG5PdqtBK4OWwA70Qf6TQLXZDQaCwyh2zqVZxnafoGcKJ4UBCe5yXE5eiyNT0F6MbzZqOP7QsNRDcA7wBeUtrOEXuvVILJ/9VoGSZbP1CA1QJBo7nog8EzaQwmD1ijpejyh1UAq1CkA/gML6FxpMmqtKEWzJUHvgKsxGEiSg/NQ589FBTExZjUVl8A3o6DFKgULRD7oFRKlizLDFqEg9RYuwDLBYJGuTo5K8NGtmUaNWMzy9MOQDcvkutjxwpsZl1qW002gIE1hZBCzNpvZwI4ngyp7n6MaD7KTf89H+sLyTICHEuP640cagn6yx38lJvpV1pPtAI4ErMBGSd4CdWgzMokzUZvKsCTMNfbBTqbD1hulqAjMEcElgCHYLaVShUFu1pPRgjiDsxx6RYrgJNk7nOaw0JXALcSPWl3kpKi/3sCnCojp5N7szzbmMyRanGetZkUxN4TYCKpZViewEvIyVHEPsxljautAPaVTnKZjYI8PVeIEMRm6T+7Mk1jWjEZk/kCL6E6Mp9l78fc7rk72zywQCbRVveKTsdkPsZV5dIn9kv5f7NM0bY6WcoVAlcBA4AfMGFjncRfA8R5BmHuhm3D3Kut3o3plYvdmF5l0f8DAP6nJIFW0kbQAAAAAElFTkSuQmCC";
		return '<div class="' + '' + '">' + '<img class="' + CLASS_POPUP_ALERT_IMAGE_BUTTON + '" src="'+deleteImgBase64Str+'">' + '</div>';
	}
	var createButtons = function(btnArray) {
	    var length = btnArray.length;
	    var btns = [];
	    for (var i = 0; i < length; i++) {
	        btns.push('<span class="' + CLASS_POPUP_BUTTON + (i === length - 1 ? (' ' + CLASS_POPUP_BUTTON_BOLD) : '') + '">' + btnArray[i] + '</span>');
	    }
	    return '<div class="' + CLASS_POPUP_BUTTONS + '">' + btns.join('') + '</div>';
	};
	
	var createPopup = function(html, callback) {
        var popupElement = document.createElement('div');
        popupElement.className = CLASS_POPUP;
        popupElement.innerHTML = html;
        var removePopupElement = function() {
            popupElement.parentNode && popupElement.parentNode.removeChild(popupElement);
            popupElement = null;
        };
		//判断显示的弹框是否是图片选择框,如果是,不能禁用滑动事件,因为多个图片的时候需要滑动选择
		var imageSelectElement = popupElement.querySelector('.' + CLASS_POPUP_CONFIRM_IMAGE_SELECT);
		if (imageSelectElement && imageSelectElement.classList.contains(CLASS_POPUP_CONFIRM_IMAGE_SELECT)) {
			
		}else{
			popupElement.addEventListener($.EVENT_MOVE, $.preventDefault);
		}
        popupElement.addEventListener('webkitTransitionEnd', function(e) {
            if (popupElement && e.target === popupElement && popupElement.classList.contains(CLASS_POPUP_OUT)) {
                removePopupElement();
            }
        });
        popupElement.style.display = 'block';
        document.body.appendChild(popupElement);
        popupElement.offsetHeight;
        popupElement.classList.add(CLASS_POPUP_IN);

        if (!backdrop.classList.contains(CLASS_ACTIVE)) {
            backdrop.style.display = 'block';
            document.body.appendChild(backdrop);
            backdrop.offsetHeight;
            backdrop.classList.add(CLASS_ACTIVE);
        }
        var btns = $.qsa('.' + CLASS_POPUP_BUTTON, popupElement);
		var items =  $.qsa('.' + CLASS_POPUP_SELECT_ITEM, popupElement);//选择条目
		var selectImages = $.qsa('.' + CLASS_POPUP_IMAGE_SELECT + ' img', popupElement);//选择图片
        var input = popupElement.querySelector('.' + CLASS_POPUP_INPUT + ' input');
        var popup = {
            element: popupElement,
            close: function(index, animate) {
                if (popupElement) {
                    var result = callback && callback({
                        index: index || 0,
                        value: input && input.value || ''
                    });
                    if (result === false) { //返回false则不关闭当前popup
                        return;
                    }
                    if (animate !== false) {
                        popupElement.classList.remove(CLASS_POPUP_IN);
                        popupElement.classList.add(CLASS_POPUP_OUT);
                    } else {
                        removePopupElement();
                    }
                    popupStack.pop();
                    //如果还有其他popup，则不remove backdrop
                    if (popupStack.length) {
                        popupStack[popupStack.length - 1]['show'](animate);
                    } else {
                        backdrop.classList.remove(CLASS_ACTIVE);
                    }
                }
            }
        };
        var handleEvent = function(e) {
            popup.close(btns.indexOf(e.target));
        };
		//条目点击事件
		var itemClickEvent = function(e){
			//点击条目的时候+1个,因为取消按钮占用了0
			popup.close(items.indexOf(e.target) + 1);
		}
		var imageAlertCLickEvent = function(e){
			if (e.target.classList.contains(CLASS_POPUP_ALERT_IMAGE_BUTTON)) {
				popup.close(0);
			} else{
				popup.close(1);
			}
		}
		var imageSelectCLickEvent = function(e){
			popup.close(selectImages.indexOf(e.target));
		}
		//设置条目的点击事件
		$(popupElement).on('tap','.' + CLASS_POPUP_SELECT_ITEM,itemClickEvent)
        $(popupElement).on('tap', '.' + CLASS_POPUP_BUTTON, handleEvent);
		//imageAlert 弹框点击事件
		$(popupElement).on('tap', '.' + CLASS_POPUP_ALERT_IMAGE, imageAlertCLickEvent);
		$(popupElement).on('tap', '.' + CLASS_POPUP_ALERT_IMAGE_BUTTON, imageAlertCLickEvent);
		//设置弹框选择图片的点击事件
		$(popupElement).on('tap', '.' + CLASS_POPUP_IMAGE_SELECT + ' img', imageSelectCLickEvent);
        if (popupStack.length) {
            popupStack[popupStack.length - 1]['hide']();
        }
        popupStack.push({
            close: popup.close,
            show: function(animate) {
                popupElement.style.display = 'block';
                popupElement.offsetHeight;
                popupElement.classList.add(CLASS_POPUP_IN);
            },
            hide: function() {
                popupElement.style.display = 'none';
                popupElement.classList.remove(CLASS_POPUP_IN);
            }
        });
        return popup;
    };
	/**
	 *新加弹出选择框  支持H5 
	 * 参数 items ["",""],callback
	 */
	var createSelect = function(items,callback){
		return createPopup(createSlectItem(items)+createButtons(['取消']),callback);
	}
	/**
	 * 新加带图片的确认弹框 只支持H5
	 */
	var createImageConfirm = function(imgSrc,message, title, btnArray, callback, type){
		if (typeof message === 'undefined') {
		    return;
		} else {
		    if (typeof title === 'function') {
		        callback = title;
		        type = btnArray;
		        title = null;
		        btnArray = null;
		    } else if (typeof btnArray === 'function') {
		        type = callback;
		        callback = btnArray;
		        btnArray = null;
		    }
		}
		return createPopup(createImageInner(imgSrc,message, title || '提示') + createButtons(btnArray || ['取消', '确认']), callback);
	}
	/**
	 *新加带两个图片的选择确认弹框 只支持H5
	 */
	var createImagesSelectConfirm = function(imgSrcs,message, title, callback, type){
		return createPopup(createImagesSelectInner(imgSrcs,message, title || '提示'), callback);
	}
	/**
	 * 新加只有图片和取消按钮的弹框 只支持H5 参数:图片路径  点击事件回调
	 */
	var createImageAlert = function(imgSrc,callback){
		return createPopup(createAlertImageInner(imgSrc) + createAlertImageButton(), callback);
	}
	var closePopup = function() {
	    if (popupStack.length) {
	        popupStack[popupStack.length - 1]['close']();
	        return true;
	    } else {
	        return false;
	    }
	};
	var closePopups = function() {
	    while (popupStack.length) {
	        popupStack[popupStack.length - 1]['close']();
	    }
	};
	
	/**
	 * 带图片的确认消息框
	 */
	$.closePopup = closePopup; 
	$.select = createSelect;	//新加条目选择弹框
	$.imageConfirm = createImageConfirm; //新加带图片的确认框
	$.imagesSelectConfirm = createImagesSelectConfirm; //新加带图片的确认框
	$.imageAlert = createImageAlert;	//新加图片弹出框
})(mui, window,document);


/**
 * 新加等待框,能在手机和纯前端中使用
 */
(function($,window,document){
	
	$.showLoading = function(message, type) {
		
			var html = '';
			html += '<i class="mui-spinner mui-spinner-white"></i>';
			html += '<p class="text">' + (message || "数据加载中") + '</p>';
			
			//遮罩层
			var mask = document.getElementsByClassName("mui-show-loading-mask");
			if(mask.length == 0) {
				mask = document.createElement('div');
				mask.classList.add("mui-show-loading-mask");
				document.body.appendChild(mask);
				mask.addEventListener("touchmove", function(e) {
					e.stopPropagation();
					e.preventDefault();
				});
			} else {
				mask[0].classList.remove("mui-show-loading-mask-hidden");
			}
			//加载框
			var toast = document.getElementsByClassName("mui-show-loading");
			if(toast.length == 0) {
				toast = document.createElement('div');
				toast.classList.add("mui-show-loading");
				toast.classList.add('loading-visible');
				document.body.appendChild(toast);
				toast.innerHTML = html;
				toast.addEventListener("touchmove", function(e) {
					e.stopPropagation();
					e.preventDefault();
				});
			} else {
				toast[0].innerHTML = html;
				toast[0].classList.add("loading-visible");
			}
		
	};
	
	//隐藏加载框
	$.hideLoading = function(callback) {
		
		var mask = document.getElementsByClassName("mui-show-loading-mask");
		var toast = document.getElementsByClassName("mui-show-loading");
		if(mask.length > 0) {
			mask[0].classList.add("mui-show-loading-mask-hidden");
		}
		if(toast.length > 0) {
			toast[0].classList.remove("loading-visible");
			callback && callback();
		}
	}

})(mui, window, document);

