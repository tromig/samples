(function(){
	$("<style id='pcrefresh'> .layoutToggle {float: right; display: none!important; height: 0; overflow: hidden; visibility: hidden; } select.sortFilter {padding: 4px; border-radius: 4px; margin-left: 4px; } div#pcGridTopBar {padding-top: 2px; } .pagerWrapper {margin-top: 5px;} .pagelist a.PageNumbers, .pagelist .CurrentPage {font-size: 15px; } a.pageListShowAll.pagination {margin-top: 4px; } /**/ .product-grid li.product:first-child {margin-left: 0; } .product-grid li.product {border: 1px solid #eaeaea; border-radius: 8px; margin-left: 4px; margin-top: 4px; transition: all .4s; } li.product:hover {border-color: #cad8e4; box-shadow: 0px 0px 4px 0px #00000036; } div#compareBody {margin-top: 30px; } div#search-display {margin-top: -27px; } div#pcGridTopBar {margin-top: 0; } .category_tabs ul li {height: 33px; } .product-grid li.product {text-align: left; padding-left: 12px!important; width: 233px; box-sizing: border-box; } .product-grid li.product div.product-name a{font-size: 1.1rem; font-weight:600; line-height: 1.1; text-align:left; } .product-grid li.product div.product-image{margin-left: -12px; } div.product-grid div.product-price {font-size: 13px; font-weight: 500; } .category-review img {width: 85px; } .product-grid div.category-review span {display: inline-block; font-size: 12px; vertical-align: middle; } .chkCompare input {width: 16px; height: 16px; } .chkCompare label {font-size: 12px; }</style>").appendTo('body');
	$('#categoryTitle').insertBefore('.sidebar');
	$('.sidebar, .mainContent').wrapAll("<div id='comapreBody' />");
	$('.layoutToggle').hide()





	$('.category-review br').remove();
	$('.category-review span').each(function(){
		var txt = $(this).text();
		txt = txt.replace(/ reviews| review/gi, '');
		$(this).text(txt);
	});


})()
			


