(function($, productComparison){
	'use strict';
	
	function _onDocReady(){
		productComparison.layout.init();

		if($('#product-grid').length){
			productComparison.widget.init();
		}		
	}	

	$.extend(productComparison, {
		_onDocReady: _onDocReady,
		inited: false
	});

    $(document).ready(function() {
        smartPak.productComparison._onDocReady();
    });

})(jQuery, smartPak.core.namespace('productComparison'));