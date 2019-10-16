/**
 *带图片的确认框  已经在mui.js 中集成了,但是线上的版本没有引用mui.js 所以不能使用  
 * 只能写在这里使用  下个版本记得改为引用mui.js 和 mui.css
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
	    popupElement.addEventListener($.EVENT_MOVE, $.preventDefault);
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
		//设置条目的点击事件
		$(popupElement).on('tap','.' + CLASS_POPUP_SELECT_ITEM,itemClickEvent)
	    $(popupElement).on('tap', '.' + CLASS_POPUP_BUTTON, handleEvent);
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
	$.imageConfirm = createImageConfirm; //新加带图片的确认框
})(mui, window,document);


/**
 * 新的弹框,弹框中有两张图片,可以选择
 */
;(function($, window, document){
	
	
	
	
})(mui, window,document);