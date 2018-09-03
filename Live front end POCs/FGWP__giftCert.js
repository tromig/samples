$(function(){

	var fgwp = {
		fgwpStyles: '<style> #fgwpImg {width: 80px; } #fgwpContent > * {display: inline-block; text-align: left; } #fgwpRow {text-align: right; } #fgwpHd {font-size: 24px; font-weight: 600; color: #2A51AB; } #fgwpSubTxt {font-size: 15px; font-weight: 500; margin-top: -4px; text-align: center; } #fgwpCopy {vertical-align: top; margin: 8px 50px 0 20px; } #fgwpContent {margin-top: 16px; } #offerLabel {display: inline-block; margin-right: 16px; } #offerAction {display: inline-block; } #fgwpOfferCol {vertical-align: bottom; margin-bottom: 6px; font-size: 16px; background: #f3f3f3; padding: 2px 12px; } #fgwpSubTxt a {padding: 0 4px; } #fgwpPopUp {margin: 30px 20px; font-size: 16px; } .addGiftToCart span {font-size: 13px; margin-left: 4px; }</style>',
		fgwpMobileStyles: '<style> #fgwpRow {text-align: left; } #fgwpContent {margin-top: 16px; } #fgwpContent > * {display: inline-block; text-align: left; } #fgwpImg {width: 60px; } #fgwpCopy {vertical-align: top; margin: 0; } #fgwpHd {font-size: 18px; font-weight: 600; color: #2A51AB; } #fgwpSubTxt {font-size: 12px; font-weight: 500; margin-top: -4px; text-align: center; } #fgwpOfferCol {vertical-align: bottom; margin-bottom: 6px; font-size: 16px; background: #f3f3f3; padding: 2px 12px; width: 100%; text-align: center; }#offerLabel {display: inline-block; margin-right: 16px; } #offerAction {display: inline-block; } #fgwpPopUp {margin: 30px 20px; font-size: 16px; } .addGiftToCart span {font-size: 13px; margin-left: 4px; } </styles>',
		fgwpRow: '<div id="fgwpRow" class="jsHide"> <div id="fgwpContent"> <img id="fgwpImg" src="/images/_landing/fgwp/hat_thumb.png"> <div id="fgwpCopy"><div id="fgwpHd">Get a Free SmartPak Hat</div><div id="fgwpSubTxt"><span id="subTxt">with your order of $100 or more (</span><a href="#" data-popup="#fgwpPopUp" data-popup-title="Free Gift With $100 Order" data-popup-width="350px" data-modal="#fgwpPopUp" data-modal-title="Free Gift With $100 Order">Details</a>)</div> </div><div id="fgwpOfferCol"> <div id="offerLabel">Offer:</div><div id="offerAction"><a href="#"  data-popup="#fgwpPopUp" data-popup-title="Free Gift With $100 Order" data-popup-width="350px" data-modal="#fgwpPopUp" data-modal-title="Free Gift With $100 Order">Get a Free Gift*</a></div></div></div> </div>',
		isMobile: smartPak.core.isMobile(),

		giftType: function(){  
			//return 'hat';
			return 'giftCert';			
		},

		getCartTotal: function(){
			return Number($('.totalsAmount').text().slice(1));	
			
		},
		
		cartOverThreshold: function(threshold){
			return this.getCartTotal() > threshold;
		},

		hasFGWPInCart: function(){
			var items = ko.dataFor(document.getElementById('cartItemsDisplay')).CartItems(),
				i;

			for(i in items){
				if(items[i].ProductClassId){
					if(items[i].ProductClassId() === 16847 || items[i].ProductClassId() === 16944) return true;
				}
			}
			return false;
		},

		addFGWPRow: function(){
			var styles = (this.isMobile) ? this.fgwpMobileStyles : this.fgwpStyles,
				insertTarget = (this.isMobile) ? '#cartItemsDisplay' : $('#cartSubmitBtn').parent();
			$('#fgwpRow').remove();

			$('head').append($(styles));
			$(this.fgwpRow).insertBefore(insertTarget);
			$("<div id='fgwpPopUp' class='jsHide'>* Free SmartPak hat with purchases over $100. Offer expires 11/24/17 at 11:59 PM PST. Limit one per Customer. While supplies last. Offer applies to in stock items only. Additional exclusions may apply. Cannot be combined with other offers or applied to previous purchases or shipping charges. Please call 1-888-339-9695 for complete details.</div>").appendTo('body');
		},


		updateFGWPRow: function(){
			var giftType = this.giftType();
			if(giftType === 'giftCert'){
				this.updateToGiftCert();
			}
			//over thresh??
			if(this.cartOverThreshold(100)){ console.log('OVER THRESH');
				this.updateToAddToCart(giftType);
			}

		},

		updateToGiftCert: function(){
			$('#fgwpImg').attr('src', '/images/_landing/fgwp/giftCert_thumb.png');
			$('#fgwpHd').text('Get a Free $15 SmartPak Gift Card');
			$('#offerAction a').text("Get a Free Gift Card*");

			if(this.isMobile){
				$('#fgwpHd').css({'max-width':'200px', 'line-height':'22px'});
				$('#fgwpSubTxt').css({'margin-top':'0px', 'margin-bottom':'8px'});			
				$('#fgwpOfferCol').css({'margin-bottom':'12px'});
			}

			//update modal content too //
			$('#fgwpPopUp').text("* Free $15 SmartPak gift certificate with purchases over $100. Offer expires 11/27/17 at 11:59 PM PST. Limit one per Customer. Offer applies to in stock items only. Additional exclusions may apply. Cannot be combined with other offers or applied to previous purchases or shipping charges. Please call 1-888-339-9695 for complete details.");
		},	

		updateToAddToCart: function(giftType){
			var btnData = {
							'hat':{ 'prodID': '2109799874',
									'prodClassID':'16847',
									'addUrl': "/product/16847/AddSupply"
								  },
							'giftCert':{
									'prodID': '2109800580',
									'prodClassID':'16944',
									'addUrl': "/product/16944/AddSupply"
							}
						};			


			$('#fgwpHd').text('Your Order Qualifies!');

			if(giftType === 'hat'){
				$('#subTxt').text("for a free SmartPak Hat! (");
				$('#offerAction a').replaceWith('<a href="#" class="addGiftToCart">Free Hat<span>(click to apply)</span></a>');
				$('.addGiftToCart').data(btnData.hat);
			}

			if(giftType === 'giftCert'){
				$('#subTxt').text("for a free $15 SmartPak Gift Card! (");
				$('#offerAction a').replaceWith('<a href="#" class="addGiftToCart">Free Gift Card<span>(click to apply)</span></a>');
				$('.addGiftToCart').data(btnData.giftCert);
			}

			this.bindAddButton();

		},

		bindAddButton: function(){
			$('#fgwpContent').on('click', '.addGiftToCart', function(e){
				var $clicked = $(e.currentTarget),
					btnData = $clicked.data();

				$('.addGiftToCart').off('click');
				
				if(fgwp.hasFGWPInCart()) {
					$('#fgwpContent').remove();
					return;
				}

				$.post(btnData.addUrl, "CustomizationDataString=&Quantity=1&ProductClassId="+ btnData.prodClassID +"&ProductId="+ btnData.prodID, function(data){ 
					if(data.Status === 'SUCCESS'){
						location.reload();
					}
				});
			});
		},

		bindListenForCartUpdates: function(){
			$(document).off('ajaxComplete').on('ajaxComplete', function(){
				
				if(!smartPak.fgwp.cartOverThreshold(100) && smartPak.fgwp.hasFGWPInCart()){
					var $costSpan = $('span[data-bind="text: cost"]').filter(function(){return $(this).text() === '0.00';}),
						$removeBtn = $costSpan.parents('td').find('.removeItemBtn');

					if($removeBtn.length < 1) $removeBtn = $costSpan.parents('.mediaBody').find('.removeItemBtn');

					$removeBtn.click();
					fgwp.init();
				}else {
					fgwp.init();
				}
			});
		},

		updateFGWPItem: function(){ 
			var $costSpan = $('span[data-bind="text: cost"]').filter(function(){return $(this).text() === '0.00';}),
				$quantDrop = $costSpan.parents('td').prev().find('select');

			if ($quantDrop.length < 1){
				$quantDrop = $costSpan.parents('.textRight').find('.form');
				$quantDrop.attr('disabled', 'disabled').hide();
				$costSpan.parents('.textRight').next().find('.saveItemForLaterBtn').hide();
			}else{
				$costSpan.parents('td').find('.saveItemForLaterBtn').hide();
				$quantDrop.attr('disabled', 'disabled').hide();
			}

			$('.cartItemName a').filter(function(){ return ($(this).attr('href')  === '/pt/black-friday-free-gift-with-100-purchase-16847'); }).attr('href', '#');
			$('.cartItemName a').filter(function(){ return ($(this).attr('href')  === '/pt/cyber-monday-free-gift-with-100-purchase-16944'); }).attr('href', '#');
		},

		init: function(){ 
			$('#fgwpRow').remove();
			fgwp.bindListenForCartUpdates();
			if(this.hasFGWPInCart()) {
				this.updateFGWPItem();
				return;
			}
			this.addFGWPRow();
			this.updateFGWPRow();
			/*if(this.getGiftType() !== '')*/ $('#fgwpRow').removeClass('jsHide');
		}

	};

	smartPak.fgwp = fgwp;


	function testIsPageReady(){
	    return !!ko.dataFor(document.getElementById('cartItemsDisplay'));
	}

	function waitFor(test) {
	    var dfd = new $.Deferred(),
	        interval = window.setInterval(function () {
	            if (test()) {
	                window.clearInterval(interval);
	                interval = null;
	                dfd.resolve();
	            }


	        }, 200);

	    return dfd.promise();
	}
	

	if (testIsPageReady()) { console.log('test page is ready');
        smartPak.fgwp.init();
    } else { console.log('WAITING FOR test page is ready');
        waitFor(testIsPageReady).then(smartPak.fgwp.init);
    }




});