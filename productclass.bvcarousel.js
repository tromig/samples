 

(function (productClass, $) {
    'use strict';

    var $bvCarousel,
    	configs;

	productClass.bvCarousel = {

		slideCarousel: function(event){ 
			var $clicked = $(event.currentTarget),
				direction = ($clicked.hasClass('viwc-next')) ? 1 : -1,
				newPos = $bvCarousel.position().left + (configs.viewable * configs.increment * direction);			

			if(newPos < configs.leftLimit){
				newPos = configs.leftLimit;
			}

			if(newPos > 0 ){
				newPos = 0;
			}

			$bvCarousel.animate({left:newPos+'px'}, 250, 'easeInOutSine', productClass.bvCarousel._checkLimits);

		},

		_checkLimits: function(){
			if(!$bvCarousel.length) return;
			var carouselLeft = $bvCarousel.position().left;
			if(carouselLeft >-1){  
				configs.$next.addClass('arrowOff');
			}
			
			if(carouselLeft <= configs.leftLimit){  
				configs.$prev.addClass('arrowOff');
			}

			if(carouselLeft < 0 && configs.totalItems > configs.viewable){
				configs.$next.removeClass('arrowOff');
			}

			if(carouselLeft > configs.leftLimit  && configs.totalItems > configs.viewable){ 
				configs.$prev.removeClass('arrowOff');
			}

			if(configs.totalItems <= configs.viewable){  
				configs.$ctrls.addClass('arrowHidden');
			}
		},

		_setItems: function(){
			var bvData = configs.bvData, 
				$newItem;				

			$bvCarousel = $('#bvCarousel');
			for (var i=0; i<bvData.length; i++){ 
				$newItem = $('<li></li>').css('background-image', 'url('+bvData[i].Photos[0].Sizes.thumbnail.Url+')')
								.data({'bvID': bvData[i].Id, 'pcID': i });
				$newItem.appendTo($bvCarousel);			
			}			
			$('#dummyLI').remove();
		},

		updateControls: function(){
			$(window).off('resize');
			configs.$ctrls.off('click');
			configs.$ctrls.on('click', productClass.bvCarousel.slideCarousel);
			productClass.bvCarousel._checkLimits();
		},

		setConfigs: function(){
			configs.$next = $('.bvCarouselWrapper .viwc-next');
			configs.$prev = $('.bvCarouselWrapper .viwc-prev');
			configs.$ctrls = $('.bvCarouselWrapper .viwc-prev, .bvCarouselWrapper .viwc-next');
			configs.$items = $bvCarousel.children('li');
			configs.increment = configs.$items.outerWidth(true);
			configs.totalItems = configs.$items.length;
			configs.leftLimit = (configs.totalItems - configs.viewable) * (configs.increment * -1);
		},

		initBVCarousel: function(){
			if(configs.bvData.length < 1) return;
			productClass.bvCarousel._setItems();
			$bvCarousel = $('#bvCarousel').variableItemWidthCarousel();
			$bvCarousel.children('.viwc-spacer').remove();
			productClass.bvCarousel.setConfigs();
			configs.$ctrls.add('.bvCarouselWrapper .viwc-wrapper').removeAttr('style');
			$bvCarousel.width(configs.totalItems * configs.increment);
			productClass.bvCarousel.updateControls();
			productClass.bvCarousel._bindBvCarouselItemClick();
			productClass.bvCarousel._bindModalArrowClick();
		},

		_bindBvCarouselItemClick: function(){
			$bvCarousel.on('click', 'li', productClass.bvCarousel.prepReviewPopUp);
		},

		buildBVUrls: function(){
			var startURL = smartPak.pageData.conversationsApiUrl,
				urlElements = startURL.split('?'),
				baseReviewsURL = urlElements[0].replace('statistics', 'reviews'),
				baseAuthorsURL = urlElements[0].replace('statistics', 'authors'),
				baseFeedbackURL= urlElements[0].replace('statistics', 'submitfeedback'),
				productID = smartPak.pageData.productId,
				reviewsArgs = urlElements[1] + productID + '&filter=HasPhotos:true&limit=100&include=reviews',
				authorsArgs = urlElements[1] +  '&include=reviews&filter=id:',
				feedbackArgs= urlElements[1] + '&ContentType=review&vote=VOTE&feedbackType=TYPE&userId=USERID&contentId=CONTENTID',
				reviewsURL = baseReviewsURL + '?' + reviewsArgs,
				authorsURL = baseAuthorsURL + '?' + authorsArgs,
				feedbackURL = baseFeedbackURL + '?' + feedbackArgs;

			authorsURL = authorsURL.replace('&amp;filter=productid:', '');
			feedbackURL = feedbackURL.replace('&amp;filter=productid:', '');
			configs.bvReviewsURL = reviewsURL.replace(/&amp;/gi, '&');
			configs.bvAuthorsURL = authorsURL.replace(/&amp;/gi, '&');
			configs.bvFeedbackURL = feedbackURL.replace(/&amp;/gi, '&');
		},

////// MODAL  /////

		_bindModalArrowClick: function(){
			$('#bvPopUp').on('click', '.modalArrows', productClass.bvCarousel.swapModalReview);
		},

		computeDate: function(pastDate){
			pastDate = pastDate.replace(/-/g,'/');
			pastDate = pastDate.substr(0, pastDate.indexOf('T'));
			var now = new Date(),
				then = new Date(pastDate),
				past, seconds;

				past = then.valueOf(then);
				now = now.valueOf(now);
				seconds = Math.round((now-past)/1000);

				return productClass.bvCarousel.buildDateText(seconds);
		},

		buildDateText: function(seconds){
			var days, months, years, dateText;

			days = Math.round(seconds/86400);
			dateText = days + " days ago";

			if(days > 179){
				months = Math.round(days/30);
				dateText = months + ' months ago';

				if(months > 13){
					years = Math.round(months/12);
					dateText = (years === 1) ? years + ' year ago' : years + ' years ago';
				}
			}

			return dateText;
		},

		swapModalReview: function(event){
			var $clicked = $(event.target),
				dataID = $clicked.data('pcID');
			if (dataID ===  -1  || dataID >= configs.totalItems) return;
			
			smartPak.productClass.bvCarousel.showLoaderForModal();
			productClass.bvCarousel.fadeContent(event);
		},

		updateModalControls: function(dataID){
			if (dataID <= 0){
				$('#modalPrev').addClass('arrowOff');
			}else if(dataID >= configs.totalItems - 1){
				$('#modalNext').addClass('arrowOff');
			}else{
				$('.modalArrows').removeClass('arrowOff');
			}

			if(configs.totalItems === 1){
				$('.modalArrows').hide();
			}
		},

		fadeContent: function(event){
			configs.$fadableElements.animate({'opacity':'0'}, '300', function(){ productClass.bvCarousel.prepReviewPopUp(event); });
		},

		showContent: function(event){
			smartPak.productClass.bvCarousel.hideLoaderForModal();
			configs.$fadableElements.animate({'opacity':'1'}, '300');
		},

		prepReviewPopUp: function(event){
			var $clicked = $(event.target),
				dataID = $clicked.data('pcID'),
				picData = configs.bvData[dataID],
				rawRating = picData.Rating,
				caption = picData.Photos[0].Caption || '',
				subDate = productClass.bvCarousel.computeDate(picData.SubmissionTime),
				goodFB = picData.TotalPositiveFeedbackCount,
				badFB  = picData.TotalNegativeFeedbackCount,
				nextID = dataID + 1,
				prevID = dataID - 1;

			$('.bv-secondary-ratings').css('visibility', 'visible');
			$('.bvPopRatingsBar').removeClass('jsHide');
			productClass.bvCarousel._getAuthorData(picData.AuthorId);

			$('#modalNext').data('pcID', nextID);
			$('#modalPrev').data('pcID', prevID);

			$('#bvPopImage').attr('src', picData.Photos[0].Sizes.normal.Url);
			$('#bvPopCaption').text(caption || '');
			$('#bvPopUserName').text(picData.UserNickname || '');
				$('#bvPopStars').attr('src', '/images/Menu_Images/reviewstars/'+rawRating+'.gif');
			$('#bvPopDays').text(subDate || '');
			$('#bvPopTitle').text(picData.Title || '');
			$('#bvPopCopy').text(picData.ReviewText || '');
			$('#authorLocation').text(picData.UserLocation || ''); 
			$('#votesCount').text(picData.TotalFeedbackCount || '0');
			$('#positiveFeedback').find('.bv-content-btn-count').text(goodFB);
			$('#negativeFeedback').find('.bv-content-btn-count').text(badFB);

				if(Object.keys(picData.ContextDataValues).length){
					$('#userDiscipline').text ((typeof(picData.ContextDataValues.Discipline) !== 'undefined') ? picData.ContextDataValues.Discipline.ValueLabel : '');
					$('#userExpertise').text  ((typeof(picData.ContextDataValues.Expertise) !== 'undefined') ? picData.ContextDataValues.Expertise.ValueLabel : '');
					$('#userProductExp').text ((typeof(picData.ContextDataValues.Experience_1) !== 'undefined') ? picData.ContextDataValues.Experience_1.ValueLabel : '');
					$('#userCompetitor').text((typeof(picData.ContextDataValues.Competitor) !== 'undefined') ? picData.ContextDataValues.Competitor.ValueLabel : '');
				}

				if(Object.keys(picData.SecondaryRatings).length){
					productClass.bvCarousel.setRatingsBar($('#qualityBar'), productClass.bvCarousel._getRatingValue(picData.SecondaryRatings, 'Quality') );		
					productClass.bvCarousel.setRatingsBar($('#valueBar'), productClass.bvCarousel._getRatingValue(picData.SecondaryRatings, 'Value') );		
					productClass.bvCarousel.setRatingsBar($('#palatabilityBar'), productClass.bvCarousel._getRatingValue(picData.SecondaryRatings, 'Palatability') );
				}else{
					$('.bv-secondary-ratings').css('visibility', 'hidden');
				}

			productClass.bvCarousel._resetHelpfulness();

			configs.currentReview = picData; 
				configs.popUpTitle = picData.Title;
			$('#ui-dialog-title-bvPopUp').text(configs.popUpTitle);
			smartPak.productClass.bvCarousel.showLoaderForModal();
			productClass.bvCarousel.updateModalControls(dataID);

			$('#bvPopImage').load(function(){
			productClass.bvCarousel.showReviewPopUp($clicked);
			});
		},

		_getRatingValue: function(obj, prop){			
			return (prop in obj) ? parseInt(obj[prop].Value) : 0;
		},

		_resetHelpfulness: function(){
			$('#reportFeedback').text('Report');
			$('.reported').removeClass('reported');
			$('#helpfulWrapper').on('click', 'button', productClass.bvCarousel.submitBVFeedback);
		},

		setRatingsBar: function($bar, rating){
			var $segments = $bar.children('li'),
				i;

			$segments.removeClass('barSegmentFilled jsHide');

			if(rating === 0){
				$bar.parents('.bvPopRatingsBar').addClass('jsHide');
				return;
			}

			for(i=0; i<rating; i++){
				$segments.eq(i).addClass('barSegmentFilled');
			}
		},

		showLoaderForModal: function(){
			var $win = $(window),
				msgY = ($win.height()/3) + $win.scrollTop();
			$('#loadingMessage').css('top', msgY+'px').show();
		},

		hideLoaderForModal: function(){
			$('#loadingMessage').fadeOut('200');
		},

		showReviewPopUp: function($clicked){
			if($clicked.hasClass('modalArrows')){
				productClass.bvCarousel.showContent();
			}else{
			var options = { width: 900,
		                    height: 'auto',
		                    title: configs.popUpTitle,
		                    modal: 'true',
		                    resizable: false,
			            draggable: true,
			            position: { my: "center top", at: "center top", of: "body" },
		                    show: { effect: 'fade', duration: 800 },
		                    hide: { effect: 'fade', duration: 500 }
						  };
			smartPak.productClass.bvCarousel.hideLoaderForModal();
			configs.$popup.dialog(options);
				$('.ui-dialog').css('top', $(window).scrollTop()+20);
			}
		},

// NOTE: to debug in test environment, use product #6312
		getBVData: function(){
			var bvurl = configs.bvReviewsURL;

			return $.getJSON(bvurl, function(data){
				configs.bvData = data.Results;
				productClass.bvCarousel.initBVCarousel();
			});
		},

// NOTE: to debug in test environment, use product #6312
		_getAuthorData: function(authorID){
			var bvAuthUrl = configs.bvAuthorsURL+authorID;
			
			$.getJSON(bvAuthUrl, function(data){
				if(data.Results[0].ReviewIds.length){
					$('#reviewsCount').text(data.Results[0].ReviewIds.length);
				}else{
					$('#reviewsCount').text('1');
				}
			});
		},

		submitBVFeedback: function(event){
			var $clicked = $(event.currentTarget),
				clickedID = $clicked.attr('id'),
				$counter = $clicked.find('.bv-content-btn-count'),
				count = parseInt($counter.text()),
				submitURL = productClass.bvCarousel.buildFeedbackURL($clicked);

			$counter.text(count+1);

			$clicked.addClass('reported');
			if(clickedID === 'reportFeedback'){ $('#reportFeedback').text('Reported'); }
			$.getJSON(submitURL);
			$('#helpfulWrapper').off('click');

		},

		buildFeedbackURL: function($clicked){
			var clickedID = $clicked.attr('id'),
				feedbackURL = configs.bvFeedbackURL,
				vote,
				type = 'helpfulness';

			if(clickedID === 'positiveFeedback'){
				vote = 'positive';
			}
			if(clickedID === 'negativeFeedback'){
				vote = 'negative';
			}
			if(clickedID === 'reportFeedback'){
				type = 'inappropriate';
				feedbackURL = feedbackURL.replace('&vote=VOTE', '');

			}

			feedbackURL = feedbackURL.replace('TYPE', type);
			feedbackURL = feedbackURL.replace('VOTE', vote);

			return feedbackURL;
		},

		init: function(){
			configs = { 
				viewable	: 7,
				$popup 		: $('#bvPopUp'),
				$fadableElements: $('#bvPopUp, #ui-dialog-title-bvPopUp'),
				currentAuthorId : undefined,
				currentReview	: undefined
			};

			productClass.bvCarousel.buildBVUrls();
			productClass.bvCarousel.getBVData();
		}

	};

})(smartPak.core.namespace('productClass'), jQuery);