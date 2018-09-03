(function($, smartPak, productComparison){
	'use strict';

	var $widget = $('#compareBar'),
		widgetHidden = true,
		queueFull = false,
		isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0)),
		compareQueue = {},
		displayOrder = [],
		widget = productComparison.widget = {		

// WIDGET CELL MANAGEMENT
		 _getCellByDataValue: function(valToMatch){
		 	var $cellToClear;
		 	$('.cell.lit').each(function(){
		 		var $this = $(this),
		 			thisVal = $this.data('selectedid');
				if(+thisVal === +valToMatch) $cellToClear = $this;
		 	});

		 	return $cellToClear;
		 },

		_checkFalseRoll: function(e){
			return $(e.relatedTarget).is('.closeX, .cellThumb');
		},

		_bindCellRolls: function(){
			$('.cell').each(function(){
				$(this).children().wrapAll('<div class="liWrap" />');
			});

			var $cell = $('.liWrap');
			$cell.off('mouseover');
			$cell.on('mouseover', widget._handleCellRollover);
			$cell.on('mouseout', widget._handleCellRollout);
		},
			
		_handleCellRollover: function(e){
			if(widget._checkFalseRoll(e)){ 
				return false;
			}
			var $this = $(this).parent('li');
			if($this.hasClass('lit')) {
				$this.addClass('live');
				widget._showRolloverText($this);
			}
		},

		_handleCellRollout: function(e){
			if(widget._checkFalseRoll(e)){
				return false;
			}
			$(this).parent().removeClass('live');
			widget._hideRolloverText();
		},

		_showRolloverText: function(rollCell){
			var msgText = rollCell.data('productname'),
				$msgBox = $('#msgBox');
			
			$msgBox.stop(false, true);
			if(msgText.length){				
				$msgBox.text(msgText).fadeTo(1, 0.01);
				if($msgBox.height() < 20){
					$msgBox.css('margin-top', '11px');
				}else{
					$msgBox.css('margin-top', '3px');
				}

				$msgBox.stop().fadeTo(200, 1);
			}
		},

		_hideRolloverText: function(){
			var $msgBox = $('#msgBox');
			$msgBox.stop().fadeOut(200, function(){
				$msgBox.text('');
			});
		},

		_regroupCells: function(){
			var $listParent = $('#thumbList');
			$('.cell').each(function(){
				var $this = $(this);
				if(!$this.hasClass('lit')){
					$this.appendTo($listParent).removeClass('live');
				}
			});
		},

// CHECKBOX MANAGEMENT

		_bindCheckboxes: function(){
			$('.chkCompare ').not('.noClick').on('click', 'input[type=checkbox]', widget._handleCheckboxClick);
		},

		_handleCheckboxClick: function(event){ 
			var $clicked = $(event.currentTarget),
				isSelected = $clicked.is(':checked');

			if(isSelected){
				$clicked.attr('disabled', 'disabled');
				widget._handleCheckboxSelect($clicked);
                } else {
				widget._handleCheckboxDeselect($clicked);
                }
		},

		 _handleCheckboxDeselect: function($clicked){
		 	if($('#hf_isPCFull').length) return;

		 	var $cellToClear = widget._getCellByDataValue($clicked.data('productclassid')),
		 		mockTarget;

		 	if($cellToClear && $cellToClear.length){
		 		mockTarget = $cellToClear.find('.closeX');

			 	$cellToClear.removeClass('lit');
			 	$clicked.attr('disabled', 'disabled');
			 	widget._removeItemFromQueue(mockTarget);
		 	}
		},

		_handleCheckboxSelect: function($clicked){
			var selectedID = $clicked.data('productclassid'),
				$selectedThumb =  $clicked.parents('.product').find('.product-image a img:last'),				
				$nextEmptyCell = $('.cell').not('.lit').first();				
			
			if(widgetHidden){
				widget._showWidget();
			}

			if(!queueFull){
				widget._animateThumbToBar($selectedThumb, $nextEmptyCell, selectedID);					
			}
		},

		_bindDisabledCheckboxClick: function(){
			$('.noClick').on('click', widget._handleDisabledCheckboxClick);		
		},

		_handleDisabledCheckboxClick: function(event){
			if(!queueFull) return;
			widget._flashMessage(event);
		},

		_flashMessage: function(event){
			var $clicked = $(event.currentTarget); 
			$clicked.stop(true, false).animate({opacity:1}, 500, function(){ 
																	setTimeout(function(){ 
																		$clicked.animate({opacity:0}, 1750); 
																	}, 600); 
																});
		},

// QUEUE MANAGEMENT	 

		_disableQueue: function(){
			if($('.fullQueueMsg').length){
				$(".fullQueueMsg").removeClass('jsHide');
			}else{
				$("<div class='product-compare fullQueueMsg'>Your Compare Queue is Full</div>").insertAfter('li.product .chkCompare');
			}

			$('.chkCompare input[type=checkbox]').not(':checked').parent().next().addClass('msgLive noClick');
			$('.fullQueueMsg').not('.msgLive').addClass('jsHide');
			widget._bindDisabledCheckboxClick();
			queueFull = true;
		},

		_enableQueue: function(){
			$(".fullQueueMsg").addClass('jsHide').removeClass('msgLive noClick');
			queueFull = false;
		},		

		_animateThumbToBar: function($selectedThumb, $nextEmptyCell, selectedID){
			var selectedThumbPath = $selectedThumb.attr('src').split('?')[0],
				productName = $selectedThumb.attr('alt'),
				$animThumb = $selectedThumb.clone(),
				animEndPos = $nextEmptyCell.offset(),
				animEndTop = animEndPos.top,
				animEndLeft = animEndPos.left,
				selectedThumbPos = $selectedThumb.offset(),
				isLastCell = ($('.cell').not('.lit').length > 1) ? false : true;


			$animThumb.attr('id', 'animThumb').prependTo('body');
			$animThumb.css({'position':'absolute', 'top': selectedThumbPos.top, 'left': selectedThumbPos.left, 'box-shadow':'1px 0px 3px #666', 'border-radius':'8px', 'z-index':'1000' });

			$animThumb.animate({ top: animEndTop,
								 left: animEndLeft,
								 height: '30px',
								 width: '30px',
								 opacity: 0.5 }, 500, 'easeInQuint', function(){ widget._addSelectedToCompareQueue($nextEmptyCell, selectedThumbPath, selectedID, productName, false); } );
	
			if(isLastCell) {
				widget._disableQueue();
			}
		},

		_bindRemoveItemClick: function(){
			$('.closeX').on('click', function(event){ 
										var $clicked = $(event.currentTarget); 
										widget._removeItemFromQueue($clicked); 
									});
		},

		_removeItemFromQueue: function($clicked){
			var prodID = $clicked.parents('li').data('selectedid');
			$('#cbProductClass_' + prodID).attr('checked', false);

			$clicked.siblings('.cellThumb').animate({'opacity': '0', 
													 'width': '0', 
													 'height': '0'
													}, 500, 'easeInQuad', function(){ 
																				widget._postRemoveProcess($clicked); 
																			});

			if(queueFull){
				widget._enableQueue();
			}

			widget._removeDeselectedProduct(prodID);
			widget._hideRolloverText();
			$('#cbProductClass_' + prodID).removeAttr('disabled');
		},

		_postRemoveProcess: function($clicked){
			$clicked.parents('li').data('selectedid', '').removeClass('lit');
			$clicked.siblings('.cellThumb').attr('src', '');
			widget._canWeCompare(); 
			widget._regroupCells();
			widget._updateDisplayOrder();
		},

		_addSelectedToCompareQueue: function($nextEmptyCell, selectedThumbPath, selectedID, productName, fromCookie){
			$nextEmptyCell.find('.cellThumb').attr('src', selectedThumbPath + '?width=30&quality=100').css({'opacity': 1});
			$nextEmptyCell.addClass('lit');
			$nextEmptyCell.data('selectedid', selectedID).data('productname', widget._removeEntities(productName));

			if(fromCookie){
				$('#cbProductClass_' + selectedID).attr('checked', true);
			}else{
				$('#animThumb').remove();
				widget._saveSelectedProduct(selectedID, selectedThumbPath, productName);
			}

			$('#cbProductClass_' + selectedID).removeAttr('disabled');
		},

		_canWeCompare: function(){
			if ($('.cell.lit').length < 2) {
				widget._disableCompareButton();
			}else{
				widget._enableCompareButton();
			}
		},

		_disableCompareButton: function(){
			$('#compareButton').addClass('disabled');
			$widget.off('click', '#compareButton');
		},

		_enableCompareButton: function(){
			$('#compareButton').removeClass('disabled');
			widget._bindCompareButtonClick();
		},

		_updateDisplayOrder: function(){
			displayOrder = $.map($('.cell.lit'), function(cell, index){ 
					    var id = $(cell).data('selectedid');
					    if(compareQueue[id]){
					        compareQueue[id][2] = index;
			}
			    return id;
			});
		},

		_buildDisplayOrder: function(){
			var displayOrderIndex = 2,
				orderIndex,
				k;
			displayOrder = [];
			for(k in compareQueue){
				orderIndex = compareQueue[k][displayOrderIndex];
				displayOrder[orderIndex] = k;
			}
		},

// COOKIE MANAGEMENT
		_updateCookie: function(){
			var qString = JSON.stringify(compareQueue);
			smartPak.core.writeCookie('compareQueue', qString);
		},
		
		_saveSelectedProduct: function(prodID, prodImg, productName){
			prodImg = prodImg.substr(prodImg.lastIndexOf('/')+1);
			productName = widget._removeEntities(productName);
			compareQueue[prodID] = [ prodImg, productName ];
			widget._updateDisplayOrder();
			widget._updateCookie();
			widget._canWeCompare();
		},

		_removeDeselectedProduct: function(prodID){
			delete compareQueue[prodID];
			if($.isEmptyObject(compareQueue)){
				widget._hideWidget();
			}
			widget._updateCookie();
		},

		_checkWidgetCookie: function(){
			if (!$('#compareBar').length) return;
			var cookieVal = smartPak.core.readCookie('compareQueue'),
				cookieObj;

			if(cookieVal !== ''){
				cookieObj = JSON.parse(cookieVal);
			}

			if($.isEmptyObject(cookieObj)) return;

			compareQueue = cookieObj;
			widget._populateWidget(cookieObj);
		},

		_reorderCells: function(){
			var i = displayOrder.length-1,
				$curCell;

			for(i; i > -1; i--){
				$curCell = widget._getCellByDataValue(displayOrder[i]);

				if ($curCell)
				    $curCell.prependTo('#thumbList');
			}
			widget._updateDisplayOrder();
		},

		_getImgHost: function(){
			var pageHost = location.host,
				imgHost;
			if(pageHost.indexOf('www.') > -1){
				imgHost = '//img.smartpak.com/images';
			}else{
				imgHost = '//qaimg.smartpak.com/images';
			}

			return imgHost;
		},

		_populateWidget: function(cookieObj){ 
			var k, prodId, img, prodName, $nextEmptyCell,
				keyCount = 0, 
				addCell = true, 
				$cells = $('.cell'),
				compareMax = 5,
				imgHost = widget._getImgHost();

			if(!widgetHidden) return;
			widget._showWidget();

			for(k in cookieObj){
				prodId = k;
				keyCount++;
				img = imgHost+'/product/highres/'+cookieObj[k][0];
				prodName = cookieObj[k][1];
				$nextEmptyCell = $cells.not('.lit').first();
				$cells.filter('.lit').each(function(){
					if($(this).data('selectedid') === k) addCell = false;
				});
				if(addCell){
				    widget._addSelectedToCompareQueue($nextEmptyCell, img, prodId, prodName, true);
			    }
			}
			widget._buildDisplayOrder();
			widget._reorderCells();
			if(keyCount === compareMax) widget._disableQueue();
			widget._canWeCompare();
		},

		_removeEntities: function(nameString){
			nameString = nameString.replace(/&reg;|&trade;/gi, '');
			return nameString;
		},


// show / hide
		_showWidget: function(){
			$widget.slideDown(300);
			widgetHidden = false;
			$(window).trigger('scroll');
		},

		_hideWidget: function(){
			$widget.slideUp(400);
			widgetHidden = true;
		},

		_getWidgetHomePosition: function(){
			var $pagerBar = $('.pagerWrapper:first');			

			return $pagerBar.offset().top + $pagerBar.height();
		},

		_stickWidget: function(){
			$widget.addClass('fixed');
			$('#pcGridTopbar').css('margin-bottom', $widget.height());
		},

		_unstickWidget: function(){
			$widget.removeClass('fixed');
			$('#pcGridTopbar').css('margin-bottom', '0');
		},		

		_bindScroll: function(){
			$(window).on("scroll", widget._handleScroll);
		},

		_handleScroll: function(){
				var $sbc = $('#shopByCategory'),
					top = !!$sbc.length && $sbc.offset() ? $sbc.offset().top : 0,
					bottomLimit = (top + $sbc.height())-$widget.height(),
					currentZoom = widget._getZoomScale(),
					zoomed = 1.01;

				if ($(window).scrollTop() >= widget._getWidgetHomePosition()) {
                    widget._stickWidget();
                } else {
                    widget._unstickWidget();
                }

                if($(window).scrollTop() > bottomLimit){
                	 widget._unstickWidget();
                }

                if(isTouch && currentZoom > zoomed ) { 
                	widget._unstickWidget();
                }
		},
		
		_bindClearAndHide: function(){
			$widget.on('click', '#clearClose', widget._clearAndHide );
		},
		
		_clearAndHide: function(){  
			widget._hideWidget();
			$('.cell').removeClass('lit').find('.cellThumb').attr({'src':'', 'style':''});
			
			compareQueue = {};

			widget._updateCookie();
			$('input[type=checkbox]').attr('checked', false);
			widget._enableQueue();
			widget._canWeCompare();
		},

// DO COMPARE
		
		_bindModalCloseCleanup: function(){
			$(document).on('dialogclose', function(){ $('#productCompareModal').empty(); });
		},

		_bindCompareButtonClick: function(){
			$widget.on('click', '#compareButton', widget._prepRequestIds);
		},

		_prepRequestIds: function(){
			widget._getCompareChart(displayOrder);
		},

		_getCompareChart: function(productClassIdsObject){
			$.ajax({
				url: "/productcomparison",
				type: "POST",
				dataType: "html",
				data: JSON.stringify(productClassIdsObject),
				contentType: "application/json; charset=utf-8",
				success: function(viewModel) {
					widget._openModal(viewModel);
				}
			});

			$('#loadingMessage').show();
		},

		_openModal: function(viewModel) {
			var $productCompareModal = $("#productCompareModal"),
				scrollPos = $(window).scrollTop(),
				modalOptions = {
				modal: true,
				resizable: false,
				autoOpen: true,
					width: isTouch ? 940 : 985,
				title: 'Compare Selected Supplements',
				show: { effect: 'fade', duration: 800 },
				hide: { effect: 'fade', duration: 500 }
							   },
				modalHeight,
				heightModifier = 0.485;

				modalHeight = $(window).height() * 0.95;
				modalOptions.height = modalHeight; 

			$('#loadingMessage').hide();
			$productCompareModal.html(viewModel);
			$productCompareModal.dialog(modalOptions);
			$(".ui-widget-overlay").css("height", $(window).height());
			$('.ui-dialog').css({'position':'fixed', 'top':'10px' });
			if($(window).height() < 770) heightModifier = 0.3325; 
			widget._truncateProductNames();
			$('#scrollPane').height(modalHeight * heightModifier); 

			$(window).scrollTop(scrollPos);
		},



// HANDLE AJAX EVENTS

		_bindDataSwap: function(){
			$(document).one('dataSwap pagination',  widget._handleDataSwap);
		},

		_handleDataSwap: function(){
			widget.init();
		},

		_bindTopPicksDisplay: function(){
			$('body').on('topPicksDisplayed', function(){ $('body').trigger('scroll');});
		},


// MODAL CHART:
	_bindModalRemoveColumn: function(){
		$('.stripCell').on('click', '.removeColumn', widget._removeColumn);
	},

	_truncateProductNames: function(){
		$('.blueLinkText').each(function(){
			var $this = $(this),
				prodName = $this.text(),
				strMax = 40;

			prodName = prodName.replace(/\(([^)]+)\)/, '');
			if(prodName.length > strMax){
				prodName= prodName.substr(0, strMax);
				prodName = prodName.substr(0, prodName.lastIndexOf(' '));
			}

			$this.text(prodName.trim());
		});
	},

    _removeColumn: function(event) {
        var $clicked = $(event.currentTarget),
            columnIndex = $clicked.parents('.stripCell').index(),
            prodId = $clicked.data('productclassid'),
            columnCount = $('.headStrip').children().not('.topLeftCell').length,
            $cells = widget._getCellsToRemove(columnIndex),
            isOnlyColumn = (columnCount < 2);
            
        if(isOnlyColumn){
            $('.ui-dialog-titlebar-close .ui-icon.ui-icon-closethick').click();
            smartPak.productComparison.widget._clearAndHide();
        }else{
            widget._removeCells($cells);
            smartPak.productComparison.widget._handleCheckboxDeselect($clicked);
        }
        
	        smartPak.productComparison.widget._updateShareURL(prodId);
        $('#cbProductClass_'+prodId).attr('checked', false);
        smartPak.productComparison.widget._removePrintTableColumn(columnIndex);
    },

	    _updateShareURL: function(prodID){
	    	var shareURL = $('#copyURL').val(),
	    		removeItem = 'i='+prodID;

	    	shareURL = shareURL.replace(removeItem, '');
	    	shareURL = shareURL.replace('&&', '&');
	    	shareURL = shareURL.replace('?&', '?');
	    	$('#copyURL').val(shareURL);
	    },

    _getCellsToRemove: function(columnIndex) {
        return $('.rowStrip').map(function () {
            return $(this).find('.stripCell:eq(' + columnIndex + ')');
        });
    },

    _removeCells: function($cells) {
        $cells.each(function () {
            $('.headStrip').css({ 'min-height': $('.headStrip').height(), 
            					  'max-height': $('.headStrip').height() 
            					});
            $(this).animate({ 'opacity': 0 }, 'fast', function () {
                										$(this).animate({ 'width': 0 }, 'fast', function () { 
                																					$(this).remove(); 
                																				});
            });
        });

    },

    _removePrintTableColumn: function(index){
    	var $rows = $('#printThis tr');
    	$rows.each(function(){
    		$(this).children().eq(index).remove();
    	});
    	smartPak.productComparison.widget._evenProductColumns();
    },

    _evenProductColumns: function(){
    	var $tableWrap = $('#printWrapper'),
    		$sampleRow = $('#printThis tr').eq(0).children().not(':first'),
    		$tds = $('#printThis tr').children().not(':first'),
    		colWidth = 0,
    		newWidth;

    	$tableWrap.css({'display':'block', 'height':'1px'});
    	$sampleRow.each(function(index){
    		colWidth += $sampleRow.eq(index).width();
    	});
    	newWidth = Math.floor(colWidth/$sampleRow.length);
    	$('#printThis table').width('100%');
    	$tds.width(newWidth);
    	$tableWrap.css({'display':'none', 'height':'auto'});
    },

// TOUCH SCREEN/TABLET SPECIFIC:

	_initTouch: function(){
		if(!isTouch) return;

		$('#compareBar, #productCompareModal').addClass('touchy');
		widget._bindTouchCellEvents();

	},

	_bindTouchCellEvents: function(){
		$('.cell').on('click', function(e){ 
									e.preventDefault();
									widget._removeItemFromQueue($(this).children('.closeX')); 
								});
	},

	_getZoomScale: function(){
		return document.documentElement.clientWidth / window.innerWidth;
	},

	getAllProductClassIds: function() {
		var productClassIds = [],
			productClassId;

		$(".product-image").each(function () {
			productClassId = $(this).data("productid");
			if (!isNaN(productClassId)) {
				productClassIds.push(productClassId);
			}
		});

		return productClassIds;
	},

	displayStarRatings: function(data, starRatings, reviewCount) {
		$.each(data, function(i, item) {
			var $reviewContainer = $("#bvReview-" + item),
				reviews, scoreToUse, imgPath, reviewStr;

			if ($reviewContainer.length) {
				reviews = (typeof reviewCount[item] !== 'undefined') ? reviewCount[item] : 0;
				scoreToUse = (typeof starRatings[item] !== 'undefined') ? starRatings[item] : 0;

				if (reviews !== 0 || (scoreToUse !== 0 && scoreToUse !== '0')) {
					imgPath = "/images/Menu_Images/reviewstars/" + scoreToUse + ".gif";
					reviewStr = smartPak.reviewCountDisplay(reviews, false);

					reviews = smartPak.core.formatNumberCommas(reviews);
					$reviewContainer.find("img").attr("src", imgPath);
					$reviewContainer.find("span").html("(" + reviews + reviewStr + ")");
				} else {
					$reviewContainer.empty();
				}
			}
		});
	},

// INIT
		init: function(){
			widgetHidden = true;
			$widget = $('#compareBar');

			var ids = this.getAllProductClassIds();
			smartPak.bv.getStarRatingsFromApi(ids, ids, this.displayStarRatings);

			widget._bindScroll();
			widget._checkWidgetCookie();
			widget._bindCheckboxes();
			widget._bindCellRolls();
			widget._bindRemoveItemClick();
			widget._bindDisabledCheckboxClick();
			widget._bindClearAndHide();
			widget._bindDataSwap();			
			widget._bindTopPicksDisplay();
			widget._bindModalCloseCleanup();
			widget._initTouch();
		}

	};

})(jQuery, smartPak, smartPak.core.namespace('productComparison'));
