$(function(){

	var fgwp = {
		fgwpStyles: '<style class="fgwpStyle">.discountMessaging.floatLeft {max-width: 400px; } #fgwpImg {width: 80px; float:right; } #fgwpContent > * {display: block; } #fgwpRow {text-align: right; clear: both; margin-top: 64px; } #fgwpHd { text-align: right; font-size: 19px; font-weight: 600; color: #2A51AB; } #fgwpSubTxt {font-size: 15px; font-weight: 500; margin-top: -4px; text-align: right; } #fgwpCopy {vertical-align: top; margin: 15px 5px 0 0; width:400px; } #fgwpContent {margin-top: -45px; margin-left:560px; float: right; } #offerLabel {display: inline-block; margin-right: 6px; } #offerAction {display: inline-block; } #fgwpOfferCol {vertical-align: bottom; margin-bottom: 6px; font-size: 16px; background: #f3f3f3; padding: 2px 12px; clear: both; margin-top: 20px; margin-bottom: 16px; } #fgwpSubTxt a {padding: 0 2px; font-size:12px; } #fgwpPopUp {margin: 30px 20px; font-size: 16px; } .addGiftToCart span {font-size: 13px; margin-left: 4px; }</style>',
		fgwpMobileStyles: '<style class="fgwpStyle"> #fgwpRow {text-align: left; } #fgwpContent {margin-top: 16px; } #fgwpContent > * {display: inline-block; text-align: left; } #fgwpImg {width: 60px; } #fgwpCopy {vertical-align: top; margin: 0; } #fgwpHd {font-size: 18px; font-weight: 600; color: #2A51AB; } #fgwpSubTxt {font-size: 12px; font-weight: 500; margin-top: -4px; text-align: center; } #fgwpOfferCol {vertical-align: bottom; margin-bottom: 6px; font-size: 16px; background: #f3f3f3; padding: 2px 12px; width: 100%; text-align: center; }#offerLabel {display: inline-block; margin-right: 16px; } #offerAction {display: inline-block; } #fgwpPopUp {margin: 30px 20px; font-size: 16px; } .addGiftToCart span {font-size: 13px; margin-left: 4px; } </styles>',
		fgwpRow: '<div id="fgwpRow" class="jsHide"> <div id="fgwpContent"> <img id="fgwpImg" src="//img.smartpak.com/images/product/highres/24237_outsmart_128oz.jpg?width=80"> <div id="fgwpCopy"><div id="fgwpHd">Get a Free Gallon of OutSmart</div><div id="fgwpSubTxt"><span id="subTxt">with any new AutoShip supplement purchase (</span><a href="#" data-popup="#fgwpPopUp" data-popup-title="Free Gift " data-popup-width="475px" data-modal="#fgwpPopUp" data-modal-title="Free Gift">Details</a>)</div> </div><div id="fgwpOfferCol"> <div id="offerLabel">Offer:</div><div id="offerAction"><a href="#"  data-popup="#fgwpPopUp" data-popup-title="Free Gift " data-popup-width="475px" data-modal="#fgwpPopUp" data-modal-title="Free Gift">Get a Free Gallon of OutSmart*</a></div></div></div> </div>',
		isMobile: smartPak.core.isMobile(),
		cartItems: {},
		qualified: false,

		giftType: function(){  
			//return 'hat';
			//return 'giftCert';			
			return 'product';
		},

	getCartItems: function(){ 												
			fgwp.cartItems = ko.dataFor(document.getElementById('cartItemsDisplay')).CartItems();
			fgwp.qualified = fgwp.hasATSSupplementInCart();
			fgwp.init();
			
	},

	hasATSSupplementInCart: function(){
		for(var i in fgwp.cartItems){ 	
			var item = fgwp.cartItems[i]; 																				
			if(item.IsAutoShip() === true){
				if(item.ProductType() === 1 || item.UnitName() === 'bag' || item.UnitName() === 'bucket'){
					return true;
				}
			}
		}
		return false;
	},
	
		cartOverThreshold: function(threshold){
			return this.qualified;
		},

		hasFGWPInCart: function(){
			var items = this.cartItems,
				i;

			for(i in items){
				if(items[i].ProductClassId){
					if(items[i].ProductClassId() === 18521) return true;
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
			$('#fgwpPopUp').remove();
			$("<div id='fgwpPopUp' class='jsHide'>*Receive a free gallon of OutSmart, item #24237, with the purchase of a new AutoShip SmartPak or new AutoShip bucket. Limit one gallon of OutSmart per Customer. Offer does not apply to shipping charges. Offer applies to in-stock items only. Offer expires 6/25/18 at 11:59 PM PST. Order must ship by 6/27/18. Additional exclusions may apply. Please call 1-800-461-8898 for complete details.").appendTo('body');
		},


		updateFGWPRow: function(){
			var giftType = this.giftType();
			if(giftType === 'product'){
				this.updateToProduct();
			}
			//over thresh??
			if(this.hasATSSupplementInCart()){ 								
				this.updateToAddToCart(giftType);
			}

		},

		updateToProduct: function(){
			$('#fgwpImg').attr('src', '//img.smartpak.com/images/product/highres/24237_outsmart_128oz.jpg?width=80');
			$('#fgwpHd').text('Get a Free Gallon of OutSmart');
			$('#offerAction a').text("Get a Free Gallon of OutSmart*");

			if(this.isMobile){
				$('#fgwpHd').css({'max-width':'200px', 'line-height':'22px'});
				$('#fgwpSubTxt').css({'margin-top':'0px', 'margin-bottom':'8px'});			
				$('#fgwpOfferCol').css({'margin-bottom':'12px'});
			}

			//update modal content too //
			$('#fgwpPopUp').text(" *Receive a free gallon of OutSmart, item #24237, with the purchase of a new AutoShip SmartPak or new AutoShip bucket. Limit one gallon of OutSmart per Customer. Offer does not apply to shipping charges. Offer applies to in-stock items only. Offer expires 6/25/18 at 11:59 PM PST. Order must ship by 6/27/18. Additional exclusions may apply. Please call 1-800-461-8898 for complete details.");
		},	

		updateToAddToCart: function(giftType){
			var btnData =  {								
							'product':{ 
							'prodID': '2109815530',
							'prodClassID':'18521',
							'addUrl': "/product/18521/AddSupply"
							}
						};			


			$('#fgwpHd').text('Your Order Qualifies!');

			if(giftType === 'product'){ 
				$('#subTxt').text("for a free gallon of OutSmart! (");
				$('#offerAction a').replaceWith('<a href="#" class="addGiftToCart">Free gallon of OutSmart<span>(click to apply)</span></a>');
				$('.addGiftToCart').data(btnData.product);
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
			$(document).off('ajaxComplete.fgwp').on('ajaxComplete.fgwp', function(e){  
				
				if(!smartPak.fgwp.hasATSSupplementInCart() && smartPak.fgwp.hasFGWPInCart()){
					var $costSpan = $('span[data-bind="text: cost"]').filter(function(){return $(this).text() === '0.00';}),
						$removeBtn = $costSpan.parents('td').find('.removeItemBtn');

					if(smartPak.core.isMobile()){
						$costSpan = $('span[data-bind="text: discountedUnitPrice"]').filter(function(){return $(this).text() === '0.00';}),
						$removeBtn = $costSpan.parents('.mediaBody').find('.removeItemBtn');
					}

					if($removeBtn.length < 1) $removeBtn = $costSpan.parents('.mediaBody').find('.removeItemBtn') ;

					$removeBtn.click(); 							
					fgwp.initData();
				}else { 											
					fgwp.initData();
				}
			});
		},

		updateFGWPItem: function(){ 
			var $costSpan = $('span[data-bind="text: cost"]').filter(function(){return $(this).text() === '0.00';}),
				$quantDrop = $costSpan.parents('td').prev().prev().find('select'),
				$giftLinks = $('[href="/pt/outsmart-fly-spray--special-deal-18521"]');

			if(smartPak.core.isMobile()){
				$costSpan = $('span[data-bind="text: discountedUnitPrice"]').filter(function(){return $(this).text() === '0.00';}),
				$quantDrop = $costSpan.parents('.clearfix.mtl').find('.form.mvs select');
				$("<span>1</span>").insertAfter($quantDrop);
				$costSpan.parents('.mediaBody').find('.saveItemForLaterBtn').hide();
			}

			if ($quantDrop.length < 1){
				$quantDrop = $costSpan.parents('.textRight').find('.form');
				$quantDrop.attr('disabled', 'disabled').hide();
				$costSpan.parents('.textRight').next().find('.saveItemForLaterBtn').hide();
			}else{
				$costSpan.parents('td').find('.saveItemForLaterBtn').hide();
				$quantDrop.attr('disabled', 'disabled').hide();
			}

			$giftLinks.find('img').attr('src', '//img.smartpak.com/images/product/highres/24237_outsmart_128oz.jpg?width=52')
			$giftLinks.on('click', function(e){
				e.preventDefault();
				return false;
			});
		},

		initData: function(){
			fgwp.getCartItems();
		},

		init: function(){ 									
			$('#fgwpRow, .fgwpStyle').remove();
			fgwp.bindListenForCartUpdates();

			if(this.hasFGWPInCart()) {
				this.updateFGWPItem();
				return;
			}
			this.addFGWPRow();
			this.updateFGWPRow();
			$('#fgwpRow').removeClass('jsHide');
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
	

	if (testIsPageReady()) { 										
        smartPak.fgwp.initData();
    } else { 														
        waitFor(testIsPageReady).then(smartPak.fgwp.initData);
    }




});


// RESTYLE offer text... add to right column?
// do update cart item on add to cart

// ** FIX PERKS pop ups, 'active' has scroll bar (vert) //
// Fix free ship msg .autoShipSave span -- font-size will fix // 
// MOBILE  //