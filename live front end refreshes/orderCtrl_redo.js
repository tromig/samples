
(function(){
	"use strict";

	var $oc = $('.orderControls'),
		$spForm = $('#addSmartPakForm label'),
		$bulkForms = $('.addToCartSubmit > label'),
		noBucket = [14675, 14882],
		koData = ko.dataFor(document.querySelector('.orderControls')),
		prodID = koData.id() + 10000,
		hasSPs = koData.hasSmartPak;

//rearrange:
	$oc.addClass('converted');
	$spForm.find('#autoShipBullets').css({ 'display': 'block', 'margin':' 8px auto 4px', 'width': '91%' });
	$spForm.find('.small.muted.italic.floatLeft').addClass('spDaysSupply').parent().appendTo($('.spDaysSupply').parent().prev('.clearfix'));
	$spForm.find('.clearfix.mts').removeClass('mts');
	$bulkForms.add($spForm).find('.mediaObject').hide();
	$("<style>select + .mvm {margin-top: 0!important; text-align: right; } .spSelected{ margin-top:2px; margin-left:12px; } .labelRoll{ background-color: #f7f7f7!important; box-shadow: rgba(0, 0, 0, 0.48) 1px 2px 6px 0px!important; cursor: pointer; } </style>").appendTo('head');

//restyle-existing:
	$('#orderControlHeader')
				.insertBefore($oc)
				.css({'background-color': '#1f4973', 'color': '#fff', 'border-radius': '8px', 'border-bottom-left-radius': 0, 'border-bottom-right-radius': 0, 'padding': '8px', 'font-weight': 500, 'margin-bottom': 0})
				.text("Select a packaging option:");
	$oc.css({ 'padding-top': 0, 'padding': '10px', 'border-top': 0, 'background-color': '#f2f2f2' });
	$('.productUnitTitle').css({ 'background-color': '#0000', 'color': '#333', 'font-weight': 'bold' });
	$('label.media.radio').css({ 'border':' 1px solid #bbb', 'border-radius': '6px', 'padding': '8px', 'background-color': '#fcfcfc', 'margin-bottom': '8px', 'box-shadow': '1px 2px 6px -2px #0000007a', 'transition': 'all .4s' });

//add icons:
	$('<div class="pkgImg floatLeft" id="spwell" style="margin-right: 8px;"> <img src="http://img.smartpak.com/images/icons/well_single.jpg?width=30"> </div>').prependTo($spForm.find('.mediaBody > .clearfix:first'));
	$('<div class="pkgImg floatLeft" id="bulk" style="margin-right: 8px;"> <img src="http://img.smartpak.com/images/icons/well_single.jpg?width=30"> </div>').prependTo($bulkForms.find('.mediaBody > .clearfix'));
	$('.autoShipTitle.yellow').css({ 'background': 'url(//img.smartpak.com/images/icons/top_ribbon.jpg)', 'width': '118px', 'height': '24px', 'margin-top': '-2px', 'line-height': 'inherit', 'padding': 0}).text("");
	$('.autoShipTitle').not('.yellow').eq(0)
					   .css({ 'background': 'url(//img.smartpak.com/images/icons/ats_ribbon.jpg)', 'width': '155px', 'height': '24px', 'margin-top': '-2px', 'line-height': 'inherit', 'padding': 0})
					   .text("")
					   .parent()
					   .css('margin-top', '16px');

//add bag/bucket icons:
	$bulkForms.each(
		function(){
			var pkg = ko.dataFor($(this).get(0)).unit();			
			pkg = pkg.substr(0, pkg.length-1);
			if($.inArray(prodID, noBucket) > -1) pkg = 'bag';
			$(this).find('.pkgImg img').attr('src', "//img.smartpak.com/images/product/highres/" + prodID + "_" + pkg + ".jpg?width=30");
			if(prodID === 14870) $(this).find('.pkgImg img').attr('src', "//img.smartpak.com/images/product/highres/" + prodID + ".jpg?width=30");
			$('.pkgImg img').on('error', function(){ $(this).css('visibility', 'hidden'); });
		}
	);

//update HEADERS:
	$('.productUnitTitle').each(
		function(index, element){
			if(index > 1) $(element).hide();
			if(index === 1) $(element).find('span').first().text("OTHER OPTIONS");
		}
	);

	$oc.find('input[type=radio]').on('change', function(){
		var $spRadio = $spForm.find('input[type=radio]');
		$spRadio.is(':checked') ? $('.spDaysSupply').addClass('spSelected') : $('.spDaysSupply').removeClass('spSelected');
	});
// bind rolls
	$('label.media.radio').on('mouseenter', function(){ $(this).addClass('labelRoll'); });
	$('label.media.radio').on('mouseleave', function(){ $(this).removeClass('labelRoll'); });
/////////////////////////    do not do rolls when open !!!!!     ////////////////////////////////////////////////////


//re-order bulk items by price:	
	var $topUL = $('.productUnitGroups > ul:first');
	$topUL. addClass('bulkItems');
	$('.productUnitGroups > ul').not($topUL).children('li').appendTo($topUL);	
	var priceBlocks = $topUL.children().find('.floatRight.textRight div').not('.small.muted');
	var prices = priceBlocks.text().split('$');
	prices.sort(function(a, b){return a-b});
	for(var i=0; i<prices.length; i++){
		if(prices[i] === '') continue;
		$('.bulkItems').find('li:contains($' + prices[i] + ')').appendTo('.bulkItems');
	}



// edge cases:
	if(!hasSPs){
		$('.productUnitTitle:first span:first').text('OTHER OPTIONS');
		$('.productUnitTitle').not(':first').hide();
	}

})();

  

/*

2285 = bottle no image
11348 - cases noimage

*/