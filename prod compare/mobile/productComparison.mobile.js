(function($, smartPak){
	"use strict";
	var selectLimit = 4,
		modalCloseBarHeight = 53,
		currentCategory = $('#hf_categoryID').val() || '',
		screenHeight = window.innerHeight,
		screenWidth  = screen.width,
		chartOpen = false,
		compareQueue = [],
		modalOptions = { removeContents: true };

		smartPak.mobileCompare = {

//  Compare chart
			 _calcSwipeWrapWidth: function(){
				var swipeColumnWidth = this._calcColumnWidths(),
					totalColumns = $('.colStrip').length,
					fullWidth = totalColumns * (swipeColumnWidth);

				return fullWidth;
			},

			 _calcColumnWidths: function(){
				var winWidth = this._getWindowOuterWidth(),
					staticWidth = $('#staticLeftColumn').outerWidth();
				return winWidth - staticWidth;
			},

			_calcTableHeight: function (){
				return screenHeight - modalCloseBarHeight;
			},

			_getStyleValue: function($element, style){
            return Number($element.css(style).replace('px', ''));
	        },

	        _calcStyleOffset: function(){
	            var $vertCell = $('.vertCell'),
	                padTop = this._getStyleValue($vertCell, 'padding-top'),
	                padBot = this._getStyleValue($vertCell, 'padding-bottom'),
	                border = this._getStyleValue($vertCell, 'border-bottom-width');
	            return padTop + padBot + border;
	        },

			_calcRowHeights: function (){
				var headHeight = $('.columnHeadCell').outerHeight(),
					chartHeight = this._calcTableHeight(),
					totalProducts = $('#staticLeftColumn .vertCell').length,
					styleOffset = this._calcStyleOffset(),
					rowHeight = ((chartHeight - headHeight)/totalProducts) - styleOffset;

				return rowHeight;
			},

			_centerProductNames: function(){
				var paddingOffset = 31,
					updatedPadding = $('.vertCellInner').position().top - paddingOffset;
				$('#staticLeftColumn .vertCell a').css('padding-top', updatedPadding);
			},

			_snipHeaderText: function(){
				var $this = $(this),
					thisText = $this.text(),
					textLength = thisText.length,
					fontSize = $this.css('font-size').replace('px', ''),
					maxTextLength = 21;

				if(textLength > maxTextLength){					
					$this.css('font-size', fontSize - 1);
				}				
			},

			_adjustTextSize: function(){
				var minDisplayWidth = 321;
				if(screenWidth < minDisplayWidth){
					$('#tableWrapper').css('font-size', '15px');
				}
			},

			_adjustForiPhone4: function(){
				if(selectLimit != 4) return;

				$('.vertCell a').css({'line-height': '16px','font-size':'14px', 'max-height':'29px'});
				$('.cellStars').css('margin', '0px auto');
			},

			initChart: function (){
				var cellHeight = this._calcRowHeights();
				$('#tableWrapper').height(this._calcTableHeight());
				$('.swipe-wrap').width(this._calcSwipeWrapWidth());
				$('.vertCell').css({'max-height': cellHeight+'px', 'min-height': cellHeight+'px'});
				$('.colStrip').width(this._calcColumnWidths());
				if ($('#staticLeftColumn .vertCell').length < selectLimit) { 
					this._centerProductNames(); 
				}
				this._adjustTextSize();
				this._adjustForiPhone4();
				$('.columnHeadCell').each(this._snipHeaderText);
				this.mySwipe = new Swipe(document.getElementById('slider'), { continuous:false});
			},

// JUMP LIST:
			
			_buildJumpList: function(){
				$("<div id='jumpContainer'><ul id='jumpList'></ul></div>").insertAfter('#sliderWrap');
				var $jumpList = $('#jumpList');
				$('.colStrip').each(function(index){
					var $this = $(this),
						ingredientName = $this.find('.columnHeadCell').text(),
						$jumpItem = $("<li data-index='"+index+"'>"+ingredientName+"</li>");
					$jumpItem.appendTo($jumpList);
				});
				this._calcJumpListSize();
				this._calcJumpListPosition();
				this._bindJumpListEvents();
			},

			_calcJumpListSize: function(){
				var $jumpContainer = $('#jumpContainer');
				$jumpContainer.width($('.colStrip').width());
				$jumpContainer.height($('.colStrip').height() - $('.columnHeadCell').outerHeight() - 2);
			},

			_calcJumpListPosition: function(){  
				$('#jumpContainer').offset({'left': $('#staticLeftColumn').width() + 1,
											'top': $('.columnHeadCell').outerHeight() + 1
											});
			},
			
			_bindJumpListEvents: function(){
				$('#jumpList').on('click', 'li', this._doIngredientJump);
				$('#staticLeftColumn, .closeBar').on('click', this._hideJumpList);
				$('.colStrip').on('click', '.columnHeadCell', this._toggleJumpList);
			},

			_toggleJumpList: function(){
				if($('#jumpContainer').css('display') === 'none'){
					smartPak.mobileCompare._showJumpList();
				}else{
					smartPak.mobileCompare._hideJumpList();
				}
			},

			_showJumpList: function(){
				$('.colStrip .columnHeadCell').css('background-image', 'url(/images/productClass/mobile/menuArrow_open.png)');
				$('#jumpContainer').slideDown(400, 'easeOutQuad', function(){ $(this).css({ 'overflow-y': 'scroll', 'overflow-x': 'hidden'}).scrollTop(0); });
			},

			_hideJumpList: function(){
				$('#jumpContainer').slideUp(400, 'easeInQuad');
				$('.colStrip .columnHeadCell').css('background-image', 'url(/images/productClass/mobile/menuArrow_closed.png)');
			},

			_doIngredientJump: function(event){ 
				var targetColumn = $(event.currentTarget).data('index');
				smartPak.mobileCompare.mySwipe.slide(targetColumn, 500);
				smartPak.mobileCompare._hideJumpList(); 
			},

// ORIENTATION:
			
			_initHandleOrientation: function(){
				setTimeout(smartPak.mobileCompare._handleOrientationChange, 200);
			},

			_handleOrientationChange: function(){ 
				var oriented = window.matchMedia("(orientation: portrait)"),
					$launchBar = $('#compareLaunchBar'),
					isChartModal = ($('.mmContent').find('.rowStrip').length > 0) ? true : false;

				if(!isChartModal) return;

				function hider(){ 
					$launchBar.show();
					if(chartOpen){											
						smartPak.mobileCompare._hideOrientationWarning();
					}
				}

				function shower(){
					$launchBar.hide();
					if(chartOpen){											
						smartPak.mobileCompare._showOrientationWarning();
					}
				}

				if(!oriented.matches){							  
					shower();
				}else{
					hider();
				}
			},

			_showOrientationWarning: function(){
				if($('#landscapeWarning').length) return;
				$('<div id="landscapeWarning">This feature is only available in portrait view.<br>Please rotate your device<img id="rotateIcon" src="/images/mobile/rotate.png" /></div>').insertBefore('.closeBar');
			},

			_hideOrientationWarning: function(){
				$('#landscapeWarning').remove();
			},


//  PRODUCT SELECTION:

			_calcSelectLimit: function (){
				var winHeight = $(window).innerHeight(),
					minDisplayHeight = 481;

				selectLimit = 5;

				if(winHeight < minDisplayHeight) {
					selectLimit = 4;
				}
				
			},

			_disableCheckboxes: function (){
				var $unchecked = $('input[type=checkbox]').not(':checked');
				$unchecked.css('display', 'none').attr('disabled', 'disabled');
				$unchecked.siblings('label').text('compare limit reached').addClass('off');
			},

			_enableCheckboxes: function (){
				var $unchecked = $('input[type=checkbox]').not(':checked');
				$unchecked.css('display', '').removeAttr('disabled');
				$unchecked.siblings('label').text('compare').removeClass('off');
			},

			_compareCheckHandler: function (event){
				var $clicked = $(event.currentTarget),
					isChecked = $clicked.is(':checked');					

					if(isChecked){
						smartPak.mobileCompare._addToCompareQueue($clicked.val());			
						smartPak.mobileCompare._updateCheckboxes();		
					}else{
						smartPak.mobileCompare._removeFromCompareQueue($clicked.val());
						smartPak.mobileCompare._updateCheckboxes();
					}

					smartPak.mobileCompare._updateLaunchBar(compareQueue.length);
					smartPak.mobileCompare._updateCookie();
			},

			_bindCompareSelect: function(){
				$('.compareCheck').on('click', 'input', this._compareCheckHandler)
								  .on('touchstart', '.off', function(e){ e.preventDefault(); return false; });
			},


// COMPARE BAR

			_addCompareBar: function (){
				var $bar = $("<div id='compareLaunchBar' style='height:0px;'><button class='btn btnPrimary' id='doCompare' disabled='disabled'>Compare Selected Products</button></div>");
				if (!$('#compareLaunchBar').length) {
					$bar.prependTo('.productCompare');
					this._handleScroll();
					$bar.animate({'height': '50px'}, 150, 'easeOutQuad');
					this._addCompareBarBindings();
				}
			},

			_hideCompareBar: function (){
				$('#compareLaunchBar').animate({'height': '0px'}, 100, 'easeInQuad', this._removeCompareBar);
			},

			_removeCompareBar: function (){
				$('#compareLaunchBar').remove();
				$(window).off('scroll.mobileCompare');
			},

			_addCompareBarBindings: function (){
				$('#compareLaunchBar').on('click', '#doCompare', this._getCompareChart);
				this._bindScroll();    				
			},


// QUEUE MANAGEMENT
			
			_addToCompareQueue: function (prodID){
				if (compareQueue.length < selectLimit){
					compareQueue.push(prodID);
					$.each(compareQueue, function(val, index){ 
						if(val === '' || isNaN(Number(val))){
							compareQueue.splice(index, 1);
						}
					});
				}
			},

			_removeFromCompareQueue: function (prodID){
				var index = compareQueue.indexOf(prodID);
				if(index > -1){
					compareQueue.splice(index, 1);
				}
			},

			_updateCheckboxes: function(){
				var qLength = compareQueue.length;
				if (qLength < selectLimit){
					this._enableCheckboxes();
				}
				if (qLength === selectLimit){
					this._disableCheckboxes();
				}
			},

			_updateLaunchBar: function (numChecked){
					switch(true){
						case (numChecked === 1): 
							this._addCompareBar();
							$('#doCompare').attr('disabled', 'disabled');
							break;
						case (numChecked < 1): 
							this._hideCompareBar();
							break;
						case (numChecked > 1): 
							this._addCompareBar();
							$('#doCompare').removeAttr('disabled', 'disabled');
							break;
					}
			},


// Sticky launch bar

			_getWidgetHomePosition: function(){	
				return $('.productCompare').offset().top;
			},

			_stickWidget: function(){
				var $bar = $('#compareLaunchBar');
				$bar.prependTo('body').addClass('fixed').css({'margin-left':'0', 'width':'100.5%'});
				$('.productCompare').css('margin-top', $bar.height());
			},

			_unstickWidget: function(){
				var $bar = $('#compareLaunchBar'),
					$pc = $('.productCompare');
				$bar.prependTo($pc).removeClass('fixed').css({'margin-left':'', 'width':''});
				$pc.css('margin-top', 0);
			},		

			_bindScroll: function(){
				$(window).on("scroll.mobileCompare", this._handleScroll);
			},

			_handleScroll: function(){
					var $pc = $('.productCompare'),
						bottomLimit = ($pc.offset().top + $pc.height())-$('#compareLaunchBar').height(),
						scrollTop = $(window).scrollTop();

					if (scrollTop >= smartPak.mobileCompare._getWidgetHomePosition()) {
	                    smartPak.mobileCompare._stickWidget();
	                } else {
	                    smartPak.mobileCompare._unstickWidget();
	                }

	                if(scrollTop > bottomLimit){
	                	 smartPak.mobileCompare._unstickWidget();
	                }
			},

//  COOKIE MANAGEMENT
			
			_updateCookie: function (){
				var qString = compareQueue.join(),
					cookieVal = JSON.stringify({ 'category':currentCategory, 'selected': qString });

				smartPak.core.writeCookie('mobileCompareQueue', cookieVal, 1);
			},

			_clearCookie: function (){
				smartPak.core.writeCookie('mobileCompareQueue', '');
			},

			_checkCookie: function (){
				var cookieObj = smartPak.core.readCookie('mobileCompareQueue');

				if(!cookieObj) return;
				cookieObj = JSON.parse(cookieObj);
				if(cookieObj.category !== currentCategory){
					this._clearCookie();
				}else{
					this._populateSelectionsFromCookie(cookieObj);
				}
			},

			_populateSelectionsFromCookie: function (cookieObj){
				var selected = cookieObj.selected.split(','), 
					i=0,
					numChecked;

				compareQueue = (selected.length === 1 && selected[0].length === 0 ) ? [] : selected;
				for(i; i < compareQueue.length; i++){
					$('input[value='+compareQueue[i]+']').attr('checked', 'checked');
				}

				numChecked = compareQueue.length;
				if(numChecked === selectLimit){
					this._disableCheckboxes();
				}
				this._updateLaunchBar(numChecked);
			},

			_getCompareChart: function () {
				$('#doCompare').attr('disabled', 'disabled');
			    var url = $("#productComparisonUrl").val();

			    $.ajax({
			        url: url,
			        type: "POST",
			        dataType: "html",
			        data: JSON.stringify(compareQueue),
			        contentType: "application/json; charset=utf-8",
			        success: function (viewModel) {
			            smartPak.ui.modal($(viewModel), modalOptions);
			            smartPak.mobileCompare.initChart();
			        }
			    });
			},

// INSTRUCTIONAL TOOLTIP

			_showInstructionsToolTip: function(){
				var isChartModal = ($('.mmContent').find('.rowStrip').length > 0) ? true : false;
				if(sessionStorage.chartTipDisplayed || !isChartModal) return;

				$('.mobileModal').prepend('<div id="overlay"><div id="jumpNote"></div><div id="swipeNote"></div><div id="startNote"></div></div>'); 
				$('#overlay').on('click', function(){ 
												$(this).fadeOut(250, function(){
													$(this).remove();
												});
										  });
				sessionStorage.chartTipDisplayed = true;
			},

			_bindModalEvents: function(){
				$(document).on('modalAfterOpen', smartPak.mobileCompare._doAfterOpen)
						   .on('modalClose', function(){ chartOpen = false; $('#doCompare').removeAttr('disabled', 'disabled'); });
			},

			_doAfterOpen: function(){
				smartPak.mobileCompare._buildJumpList();
				smartPak.mobileCompare._showInstructionsToolTip();
				chartOpen = true;
			},

// FOR TESTING:

			_getQueue: function(){
				return compareQueue;
			},

			_getCurrentCategory: function(){
				return currentCategory;
			},

			_getWindowOuterWidth: function(){
				return window.outerWidth;
			},

// initialize:

			init: function (){
				$(window).on('orientationchange', smartPak.mobileCompare._initHandleOrientation);  // add 'resize' event to test in emulator //
				this._bindCompareSelect();
				this._calcSelectLimit();
				this._checkCookie();
				this._bindModalEvents();
				$(window).trigger('orientationchange');
			}

		};

})($, smartPak);
