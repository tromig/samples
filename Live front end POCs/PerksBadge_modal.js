(function($, doc) {
	'use strict';

	var msg = '',
		ProductIds = [
			"13985", "15400", "15427", "13057", "14691", "14690", "10947", "10945", "12470", "13073", "14846", "13087", "14847", "12473", "12039", "13812", "14672", "13090", "13076", "13074", "13088", "13176", "14523", "15217", "16050", "13988", "13896", "12487", "15218", "13990", "13989", "13866", "12548", "10949", "15216", "13758", "16056", "12486", "13033", "13089", "14668", "12451", "14515", "13778", "13894", "12671", "16273", "13991", "16051", "13813", "13755", "14237", "3155", "14351", "13939", "11109", "11106", "13701", "11970", "11971", "12615", "13662", "13212", "13241", "14201", "14202", "14208", "14207", "8937", "13242", "13238", "13239", "14197", "14199", "14205", "15490", "13240", "13243", "14203", "14198", "14204", "7734", "14449", "9857", "9856", "14485", "14206", "7211", "14450", "7369", "7210", "14445", "7213", "14489", "14484", "14446", "7209", "9023", "14451", "14488", "7450", "14487", "9054", "14447", "15528", "14448", "14486", "14688", "10621", "13405", "12570", "7376", "16674", "7378", "10846", "1969", "13407", "11871", "11423", "7384", "12569", "16670", "1625", "3879", "11356", "11038", "1624", "16675", "13408", "11211", "16671", "11226", "6297", "16669", "13788", "13462", "13404", "13403", "9496", "2425", "13797", "7451", "11332", "16666", "7512", "7374", "9504", "14038", "11360", "7379", "1601", "9916", "10729", "16672", "14123", "9502", "6117", "14820", "11374", "10838", "16673", "11403", "9497", "13798", "10574", "13077", "7377", "2260", "1600", "12766", "6527", "9889", "2274", "3157", "16668", "13068", "11893", "13789", "13790", "7375", "8308", "7945", "13406", "11359", "13684", "6112", "7956", "14821", "11325", "1603", "11373", "6525", "11362", "14126", "9065", "14437", "13842", "6115", "11535", "10573", "14125", "7381", "8387", "9503", "15166", "9141", "16676", "14124", "13897", "10660", "17107", "9077", "9498", "9066", "14469", "17253", "14137", "14127", "13075", "12713", "10200", "14363", "16175", "7448", "14134", "16436", "10620", "10890", "4627", "13330", "11108", "6118", "3091", "11474", "12731", "14135", "14623", "4111", "9499", "12488", "6248", "10894", "1617", "15534", "15215", "9486", "16457", "13177", "11833", "11110", "14128", "14136", "9067", "9505", "10474", "5916", "9075", "10892", "3094", "10754", "11837", "16172", "16341", "13764", "11729", "17108", "14432", "16176", "6463", "5859", "5129", "10900", "7837", "11471", "13932", "11111", "5253", "3096", "14159", "4143", "9413", "10893", "9398", "9715", "11107", "6434", "9402", "17254", "9396", "10891", "15524", "9568", "10297", "13636", "12560", "5805", "10196", "10477", "10895", "10896", "10898", "10913", "11361", "11836", "11838", "13202", "13811", "14231", "15152", "15475", "15476", "15477", "15478", "15520", "15521", "15522", "15523", "15529", "16419", "16420", "16625", "16626", "3090", "3098", "5135", "6458", "6459", "6992", "7587", "8852", "9397", "9908", "12533", "13191", "13192", "13200", "16421", "16437", "16456", "16627", "16628", "16497", "16007", "16498", "18349","18470","14749","17902","16422","16085","17028","17055","16048","16047","17055","16048","16047","16971","16048","16302","16047","16971","15526","15525","16302","6884","16635","16434","10450","16301","16636","18082","16997","16637","16640","16639","16460","16846","17901","16940","17902","16576","16435","16422","16638","18083","15903","13986","15904","15633","15898","18349","15908","15910","15846","13987","15906","15909","15948","16409","15907","16407","15899","15901","18470","15949","14749","16211","15847","15526","15950","15900","16085","15902",
		];

$('body').append("<style> #ctrBigText {background: url(//img.smartpak.com/images/icons/check_greenDot.png??width=20) no-repeat; background-size: 12%; padding-left: 60px; text-align: center; font-weight: 700; padding-right: 120px; margin-left: 120px; height: 69px; } .numDiv {margin: 8px 0px 8px 80px; } .numDiv:first-of-type {margin-top: 16px; } div#modalBody-inactive {margin: auto 26px 30px; } .smartperksGFK {vertical-align: middle; } #perksModalDisclaimer {margin-bottom: 30px; } #perksPop { font-size: 16px; } .blueTxt{ color: #005687; font-weight: bold; } #modalBullets li{ margin-bottom: 8px; padding-left: 4px; margin-left: 12px; }#modalBullets{ list-style-image: url(//img.smartpak.com/images/icons/smartperks_logo.png?width=30); margin: 20px 4px 30px; }</style>");
	
  function requiresBadging(id){
  	return id && ProductIds.indexOf(id) !== -1; 
  }

	function findEligibleElements(index, element){
		return element && requiresBadging(element.getAttribute('data-productid')); 
	}

	function addBadge(index, element){
		var $element = $(element);

		if($element.length){
			var styles,
				desktopStyle = 'margin-top: 5px;',
				mobileStyle = 'margin: 5px 0 5px 140px; display: flex; color: #000000;', 
				HTML = '<span class="blueTxt">Save 10% with</span><img src="//img.smartpak.com/images/icons/smartperks_text.png?width=100" alt="SmartPerks" style="vertical-align: bottom; margin-left:4px;" />',
				$div;

			if (smartPak.core.isMobile()) {
				styles = mobileStyle;
			} else {
				styles = desktopStyle;
			}

			$div = $('<div id="perksFlag" style="' + styles + '"><a href="#" style="font-weight: 500;text-decoration: none!important" data-popup="#perksPop" data-popup-title="What are SmartPerks?" data-popup-width="630px" data-modal="#perksPop" data-modal-title="What are SmartPerks?">' + HTML + '</a></div>');
			$element.parents('li').append($div);
		}
	}

	function doAddBadge(){
		if (smartPak.core.isMobile()) {
			$('.productCompare').find('li [id^="bvReview"]')
				.filter(findEligibleElements)
				.each(addBadge);
		} else {
			$('#product-grid').find('.product-image')
				.filter(findEligibleElements)
				.each(addBadge);
		}

		addModal(getUserEligibility());
	}

	function getUserEligibility(){
		var hasPromo = 	 smartPak.core.parseQueryString(smartPak.core.readCookie('CDProfile')).hasSmartPerksPromo,
			isEligible = smartPak.core.parseQueryString(smartPak.core.readCookie('SmartPrimeEligible')).PerksEligible;

		if(hasPromo === 'True' && isEligible === 'True') return 'active';
		if(hasPromo !== 'True' && isEligible === 'True') return 'inactive';
		if(isEligible !== 'True') return 'ineligible';
	}

	function addModal(perksStatus){
		var modal = $("<div id='perksPop' class='jsHide' />"),
			modalHead = $("<div id='modalHead'><img src='//img.smartpak.com/images/icons/smartperks_.png' style='width: 300px; display: block; margin: 24px auto 28px;'/></div>"),
			modalBullets = $("<ul id='modalBullets' style='list-style-image: url(//img.smartpak.com/images/icons/smartperks_logo.png?width=30);'> <li><span class='blueTxt'>10% off</span> all Smartpak brand tack, apparel, blankets, and more</li> <li><span class='blueTxt'>Free shipping</span> on any order, anytime</li> <li><span class='blueTxt'>Exclusive sales & discounts</span> delivered straight to your inbox</li> <li><span class='blueTxt'>Annual Team SmartPak calendar</span> (including more exclusive deals!)</li> </ul>"),
			modalDisclaimer = $("<div id='perksModalDisclaimer' class='small'>* To be eligible for SmartPerks benefits, at least one supplement bucket/bag, or one horse's individul SmartPaks must be over $40.  AutoShipping bags/buckets must ship within one multiple of the standard days supply to qualify.  Some exclusions apply. call 1-800-461-8898 for details.</div>");
		

		modal.appendTo('body');
		modalHead.appendTo('#perksPop');
		modalBullets.appendTo('#perksPop');
		modalDisclaimer.appendTo('#perksPop');

		if(perksStatus === 'active'){
			$("<div id='modalBody'>SmartPerks are the awesome collection of <span class='blueTxt'>FREE benefits</span> available when you put your horse's supplements on AutoShip* including:</div>").insertBefore("#modalBullets"); 
			$("<div id='perksActiveNote'> <div id='bigGreenPerksCheck'></div> <div id='ctrBigText'>Congratulations - your SmartPerks have already been activated!</div> </div>").insertBefore('#perksModalDisclaimer');
		}

		if(perksStatus === 'inactive'){
			$("<div id='modalBody-inactive'>Get <img class='smartperksGFK' src='//img.smartpak.com/images/icons/smartperks_text.png?width=95' /> pricing today by activating your FREE <img class='smartperksGFK' src='//img.smartpak.com/images/icons/smartperks_text.png?width=95' /> Benefits!* Here's how: <div class='numDiv'><strong>1) </strong> Enter the promo code <span class='blueTxt'>PERKS</span> during checkout</div><div class='numDiv'><strong>2) </strong> Look for your <strong>FREE benefits</strong>, including:</div></div>    </div>").insertBefore("#modalBullets");
		}

		if(perksStatus === 'ineligible'){
			$("<div id='modalBody'>SmartPerks are the awesome collection of <span class='blueTxt'>FREE benefits</span> available when you put your horse's supplements on AutoShip* including:</div>").insertBefore("#modalBullets");
		}
	}

	$(document).on('dataSwap', doAddBadge);

	doAddBadge();

})(jQuery, document);



