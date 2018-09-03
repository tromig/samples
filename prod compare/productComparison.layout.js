(function($, productComparison){
	'use strict';
	
	productComparison.layout = {

		_renderDefaultView: function(){
			var lastView = smartPak.core.readCookie('spLayout'),
				layout = productComparison.layout._findForcedLayout();

			$('.listToggle').fadeTo(1, 0.75);

			if (layout === 'grid') {
				productComparison.layout._convertToGridView();
			} else if (layout === 'list') {
				productComparison.layout._convertToListView();
			} else if(lastView === 'list'){
				productComparison.layout._convertToListView();
			}
		},

		_findForcedLayout: function(){
			var queryString = window.location.search,
				isGrid = queryString.search('view=grid'),
				isList = queryString.search('view=list'),
				layout = false;

			if(isList > -1) {
				layout = 'list';
			}

			if(isGrid > -1) { 
				layout = 'grid';
			}
			
			return layout;
		}, 

		_convertToListView: function(){
			if(!$('.product-grid').length) return;

			$('#product-grid').removeClass('product-grid').addClass('listview');
			$('.ctaColumn, .productCopy').removeClass('jsHide');

			$('.product').each(function(){
				var $this = $(this),
					$productCopy = $this.find('.productCopy');
				$this.find('.product-image, .product-price, .category-review').wrapAll('<div class="productInfoLeft" />');
				$this.find('.product-name').prependTo($productCopy);
			});

			$('.gridToggle').fadeTo(1, 0.75);
			$('.listToggle').fadeTo(1, 1);
			$('#product-grid').trigger({ type:'layoutSwap', layout: 'list' });
			$(window).trigger('scroll');
		},

		_convertToGridView: function(){
			if(!$('.listview').length) return;

			$('li.product .product-image, .product-price, .category-review').unwrap();
			$('.ctaColumn, .productCopy').addClass('jsHide');
			$('#product-grid').removeClass('listview').addClass('product-grid');

			$('li.product').each(function(){
				var $productImageElement = $(this).children('.product-image');
				$(this).find('.productCopy .product-name').insertAfter($productImageElement);
			});

			$('.listToggle').fadeTo(1, 0.75);
			$('.gridToggle').fadeTo(1, 1);
			$('#product-grid').trigger({ type:'layoutSwap', layout: 'grid' });
			$(window).trigger('scroll');
		},

		_saveLayout: function(event){
			smartPak.core.writeCookie('spLayout', event.layout, 365);
		},

		_bindShowAll: function(){
			$('.pageListShowAll').on('click', productComparison.layout._saveScrollPosition);
		},

		_saveScrollPosition: function(){
			sessionStorage.scrollPos = $(document).scrollTop();
		},

		_getScrollPosition: function(){
			var pos = sessionStorage.scrollPos;
			sessionStorage.removeItem('scrollPos');
			return pos; 
		},

		_bindPaginationLoad: function(){
			$(document).on('dataSwap', productComparison.layout._handlePaginationLoad );
		},

		_handlePaginationLoad: function(){
			if($('.pagelist').length < 1){
				var pos = productComparison.layout._getScrollPosition()
				if(pos) $(document).scrollTop(Number(pos));
				return;
			} 
			productComparison.layout.init();
			productComparison.layout._scrollToGridTop();
		},


		_bindLayoutSwapButtons: function(){
			$('#shopByCategory').on('click', '.gridToggle', productComparison.layout._convertToGridView);
			$('#shopByCategory').on('click', '.listToggle', productComparison.layout._convertToListView);
			$('#product-grid').on('layoutSwap', productComparison.layout._saveLayout );
		},

		_gridCanToggle: function(){
			var canToggle = false;

			if($('#hfUsesListView').val() === 'True'){
				canToggle = true;
				$('.layoutToggle').show();
			}

			return canToggle;
		},

		_scrollToGridTop: function(){
			var scrollPosition = $(document).scrollTop(),
				gridTop = $('#pcGridTopBar').offset().top;

			if(scrollPosition > 800) {
				$('html, body').animate({scrollTop: gridTop}, 875, 'easeOutQuad', function(){ $('html, body').stop(true, true); }); 
			}
		},

		 init: function(){
		 	if(!productComparison.layout._gridCanToggle()){
		 		productComparison.layout._bindPaginationLoad();
		 		return;
		 	} 

			productComparison.layout._bindLayoutSwapButtons();
			productComparison.layout._bindPaginationLoad();
			productComparison.layout._renderDefaultView();
			productComparison.layout._bindShowAll();
		}

	};

})(jQuery, smartPak.core.namespace('productComparison'));