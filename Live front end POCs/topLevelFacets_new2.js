//  https://marketer.monetate.net/control/preview/216/YY8AZ9O8O76E3EPA7FLBYEQFW3XFTXLK/breeches-visual-facets //

// CUT (if 'breeches-848pc') - for Breeches page
$(function(){ 
	
	var topFilter = {

		reorgPage: function(){
			$('#tabStrip').remove();
			$('#facetRefine-Category').hide();
			$('head').append('<style> ul.tlFilter.nav { margin: 0; } a.visualFacet {display: block!important; width: 134px; height: 220px; margin-right: 9px; } .tlItem:last-of-type .visualFacet {margin-right: 0; } .visualFacet img {filter: grayscale(60%); -webkit-filter: grayscale(60%); } .visualFacet:hover img {filter: none; -webkit-filter: none; border: 2px solid #00569f; border-left: none; border-right: none; } </style>');
			$('.category_tabs').addClass('tlFilterRow').removeClass('category_tabs').prepend("<ul class='tlFilter nav' />");
			$('.tlFilter').append("<li class='tlItem' id='full'  ><a href='/full-seat-breeches-748pc?frm=tlf&intcamp=breechfilters&from=breechfilters'  data-categoryid='748'  rel='nofollow' class='visualFacet'><img src='/images/demoimages/fullSeat.jpg'  /></a></li>");
			$('.tlFilter').append("<li class='tlItem' id='knee'  ><a href='/knee-patch-breeches-749pc?frm=tlf&intcamp=breechfilters&from=breechfilters' data-categoryid='749'  rel='nofollow' class='visualFacet'><img src='/images/demoimages/kneePatch.jpg' /></a></li>");
			$('.tlFilter').append("<li class='tlItem' id='tights'><a href='/riding-tights-319pc?frm=tlf&intcamp=breechfilters&from=breechfilters' 	   data-categoryid='319'  rel='nofollow' class='visualFacet'><img src='/images/demoimages/tights.jpg'    /></a></li>");
/*			$('.tlFilter').append("<li class='tlItem' id='winter'><a href='/winter-breeches-820pc?frm=tlf&intcamp=breechfilters&from=breechfilters'     data-categoryid='820'  rel='nofollow' class='visualFacet'><img src='/images/demoimages/winter.jpg'    /></a></li>");
*/			$('.tlFilter').append("<li class='tlItem' id='boot'  ><a href='/bootcut-breeches-1713pc?frm=tlf&intcamp=breechfilters&from=breechfilters'   data-categoryid='1713' rel='nofollow' class='visualFacet'><img src='/images/demoimages/bootCut.jpg'   /></a></li>");
		
			$('#h1Title').insertBefore('#categoryTitle');
			$('#categoryTitle').remove();
		}
	};

	topFilter.reorgPage();

});

// RISE (if ?frm=tlf) - for Breech Categories page

$(function(){ 
	
	var topFilter = {

			lo: ["22589", "17258", "16228", "20837", "19297", "19431", "23524", "22934", "22750", "22634", "16839", "16227", "12555", "16914", "23870", "25216", "23989", "23990", "26056", "23988", "26051", "27281", "26002", "22486", "22487", "23897", "22548", "23894", "22039", "25633", "22934", "15804", "17932", "26021", "23088", "22487", "23897", "20945", "22470", "23813", "23755", "23089", "22486", "22548", "20947", "22473", "22039", "24015", "24672", "23860", "27653", "26071", "24841", "20945", "20947", "22473", "23813", "23088", "23089", "22470", "23755", "16942", "16943", "18015", "23176", "24515"],
			hi: ["23869", "24080", "24081", "24179", "24216", "24248", "26074", "26073", "21306", "20801", "23409", "19788", "18633", "18519", "23450", "23759", "20734", "20834", "17732", "22274", "21552", "22275", "16696", "22897", "20247", "21310", "21571", "12537", "22318", "22912", "23449", "22316", "17557", "21034", "23087", "23073", "22747", "20271", "20270", "22921", "22399", "22397", "23227", "21118", "23355", "23015", "22276", "15458", "22899", "20246", "13544", "22306", "13796", "12538", "22160", "21956", "17635", "22900", "23090", "23866", "23894", "23076", "23074", "22748", "18604", "18605", "22390", "23226", "22353", "21116", "21117", "21649", "23766", "25218", "26050", "25217", "24108", "24017", "22225", "24082", "24691", "24690", "24771", "24847", "24848", "24849", "24846", "23814", "24655", "24657", "24658", "24893", "24894", "24668", "25794", "22734", "25707", "25187", "25188", "26113", "26114", "26275", "26270", "25968", "26401", "25967", "26199", "26200", "26201", "26194", "26195", "26196", "26197", "26198", "26193", "25644", "23809", "27334", "23874", "23865", "22091", "25725", "25707", "23861", "21029", "20847", "18460", "26032", "21272", "26499", "17203", "25168", "25970", "22275", "28089", "26034", "26035", "26045", "26046", "24005", "25815", "26184", "24106", "26183", "26182", "24107", "22898", "24664", "23409", "21310", "26724", "26276", "21573", "22808", "20276", "22306", "21314", "20526", "27333", "24092", "12542", "22609", "12538", "25751", "25752", "19788", "18633", "25754", "25753", "26751", "25755", "26271", "26269", "26268", "26069", "26070", "23450", "21782", "23087", "23090", "23866", "23759", "23076", "23073", "23074", "26498", "26497", "26007", "25770", "25931", "26267", "24519", "26211", "18017", "26023", "26022", "22397", "26017", "26014", "26020", "26018", "26019", "22571", "16906", "20520", "22291", "18461", "21776", "23029"],

			reorgPage: function(){
				$('#tabStrip').remove();
				$('#facetRefine-Category').hide();
				$('.pageListShowAll').data('action', $('.pageListShowAll').data('action') + '&frm=tlf').click();
				$('head').append('<style> #prods-all li.product:first-child { padding-left: 20px; } .visualFacet.live img {filter: none; border: 1px solid; box-sizing: border-box; } a.visualFacet {display: block!important; width: 125px; margin-right: 20px; } .tlItem:last-of-type .visualFacet { margin-right: 0; } .visualFacet img {filter: grayscale(60%); -webkit-filter: grayscale(60%); } .live, .visualFacet:hover img {filter: none; -webkit-filter: none; } .live img {border: 2px solid #00569f; -webkit-filter: none; filter: none; }</style>');
				$('.category_tabs').addClass('tlFilterRow').removeClass('category_tabs').prepend("<ul class='tlFilter nav' />"); 
				$('#h1Title').insertBefore('#categoryTitle');
				$('#categoryTitle').remove();

				if($('#allBreech').length < 1) $('.tlFilter').append("<li 	class='tlItem' id='allBreech'><a href='/breeches-848pc'   	 rel='nofollow' class='visualFacet'><img src='/images/demoimages/allBreeches.jpg?new' /></a></li>");
				if($('#hiRise').length < 1) $('.tlFilter').append("<li 		class='tlItem' id='hiRise'><a 	 href='#'  data-rise='hi'    rel='nofollow' class='visualFacet'><img src='/images/demoimages/midRise.jpg?new' /></a></li>");
				if($('#loRise').length < 1) $('.tlFilter').append("<li 		class='tlItem' id='loRise'><a 	 href='#'  data-rise='lo'    rel='nofollow' class='visualFacet'><img src='/images/demoimages/loRise.jpg?new' /></a></li>");
				if($('#allRise').length < 1) $('.tlFilter').append("<li 	class='tlItem' id='allRise'><a	 href='#'  data-rise='clear' rel='nofollow' class='visualFacet'><img src='/images/demoimages/allRise.jpg?new=18' /></a></li>");
				
				$('<div id="filteredCount" class="jsHide" style="float: right;">showing <span id="filteredItemCount" style="font-weight: bold; font-size: 14px;"></span> items</div>').prependTo('.pagerWrapper');

				this.bindClear();
			},

			bindButtons: function(){
				$('#hiRise, #loRise').on('click', function(e){		
					e.preventDefault();			
					$('.tlItem a').removeClass('live');
					$('a', this).addClass('live');
					topFilter.filterGrid(topFilter[$('a', this).data('rise')]);
				});
			},

			bindClear: function(){
				$('#allRise').on('click', function(e){
					e.preventDefault();
					$('.tlItem a').removeClass('live');
					$('li.product').show();
					topFilter.updateFilterCount();
				});
			},

			filterGrid: function(keepSet){ 
				if($('#prods-all').length < 1){
					$("<ul class='product-row' id='prods-all' />").prependTo("#product-grid");
					$('li.product').appendTo('#prods-all').width('30.5%');
				}

				$('li.product').each(function(){
					var prodId = $(this).find('.product-image').data('productid');
					

					if($.inArray(String(prodId), keepSet) > -1 || $.inArray(String(prodId + 10000), keepSet) > -1){
						$(this).show();
					}else{
						$(this).hide();
					}
				});

				this.updateFilterCount();

				$('body').scroll();
			},

			updateFilterCount: function() {
				$('#filteredCount').removeClass('jsHide');
				$('#filteredItemCount').text($('li.product:visible').length);
			},

			getPageIds: function(){
				var ids = [];
				$('li.product .product-image').each(function(){
					ids.push($(this).data('productid'));
				});

				return ids;
			},

			hasLoRise: function(){
				var pgIds = this.getPageIds();
				for(i=0; i<pgIds.length; i++){
					if(($.inArray(String(pgIds[i]), this.lo) > -1) || ($.inArray(String(pgIds[i] + 10000), this.lo) > -1)) return true;
				}
				return false;
			},

			hasHiRise: function(){
				var pgIds = this.getPageIds();
				for(i=0; i<pgIds.length; i++){
					if(($.inArray(String(pgIds[i]), this.hi) > -1) || ($.inArray(String(pgIds[i] + 10000), this.hi) > -1)) return true;
				}
				return false;
			},

			init: function(){
				if(this.hasHiRise() && this.hasLoRise()){
					this.reorgPage();
					this.bindButtons();
				}
			}
		};

		topFilter.init();

});