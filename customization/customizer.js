(function($, productClass){
	'use strict';

    var customizationActionTypes = {
        NONE: 0,
        ADDED: 1,
        REMOVED: 2
    };

	productClass.customizer = {        

        hasFlex: false,      

		openModal: function(){
			var modalOptions = {
					modal: true,
					resizable: false,
					autoOpen: true,
					width: 600,
					height: 650,
					title: 'Customization Options',
                    modalClass: 'customizationModal',
					show: { effect: 'fade', duration: 800 },
					hide: { effect: 'fade', duration: 500 }
				};
						
			this.modal = (this.isMobile) ? smartPak.ui.modal($('#divCustomizationModal'), modalOptions) : $('#divCustomizationModal').dialog(modalOptions);			
            this.updateTally();
		},

        closeModal: function(){
            if(this.isMobile){
                this.modal.close();
            }else{
                this.modal.dialog('close');
            }
        },

		prepModalUI: function(){
			var $modal = $('#divCustomizationModal'),
				$container = $("<div id='customDialogContainer' />"),
                $tallyBlock = $("<div id='tally'><div id='tallyBase'><div class='lineItem'>Item Cost: </div><div class='tallyCost'></div></div><div id='tallyCust'><div class='lineItem'>Customizations: </div><div class='tallyCost'></div></div> <div id='tallyTotal'><div class='lineItem'>Total: </div><div class='tallyCost'></div></div> </div>"),
				prodData = this.pcVM.ProductClass,
                priceVal = ($('span.saleprice').length) ? $('span.saleprice').text() : $('span.price').text(),
                webPrice = priceVal.slice(priceVal.lastIndexOf('$'), priceVal.lastIndexOf('.')+3);
							
			if($modal.find('#customDialogContainer').length < 1){
    			$modal.append("<div class='magBarHead'><div class='headItem prodName'>" + prodData.Name + "</div><div class='headItem prodCost'>" + webPrice + "</div></div>");
    			$modal.append($container);
    			$container.append("<div id='custBody'></div>");
                $container.append($tallyBlock);
    			$container.append("<div class='buttonFoot'><div class='RedButton custCancel'>Cancel</div><div class='BlueButton custSave' disabled>Save</div></div>");
    			this.initUI();
            }

            this.openModal();
		},

		initUI: function(){
            this.bindCancel();

            if(!this.hasFlex){
                this.showNoFlexMsg();
                return;
            }

			$.get(this.apiUrl + smartPak.productClassViewModel.ProductClass.Id, $.proxy(function(data){ this.buildPrefs(data); }, this));
            this.showCustLoader();
            this.bindSave();
		},

        showNoFlexMsg: function(){
            var $rootRow = $('.rootOption .customRow'),
                $msg = $("<div id='noFlexMsg'>Looks like the browser or operating system you're using doesn't support our Customization feature.  Updating your browser or operating system to the latest version may resolve the problem – or call our experts 24/7 at <b>800-461-8898</b>.<br>We're always happy to help!</div>");
            $('#custBody').append($msg);

		},

		filterActive: function(data){
			return $.grep(data, function(item){
				return item.DefaultIsActive;
			});
		},

        showCustLoader: function(){
            $('#loadingMessage').clone()
                                .attr({'style': '', 'id': 'custLoader'})                                
                                .removeClass('jsHide')
                                .appendTo('#custBody');
        },

        removeCustLoader: function(){
            $('#custLoader').remove();
        },

		buildPrefs: function(data){
			var choices = this.filterActive(data.Content),
                $items = $(),
				limit = choices.length,
				$block = this.$optionBlock.clone(),
				$choices = $('.customRow', $block),
				i,
				$tempItem;

			for (i=0; i < limit; i++){
				$tempItem = $("<div class='item'></div>");
				$tempItem.text(choices[i].DisplayName).data({ 'PreferenceId': choices[i].PreferenceId, 
                                                              'index': i, 
                                                              'priceDiff': choices[i].BasePrice, 
                                                              'PreferenceName': choices[i].DisplayName, 
                                                              'PreferenceTypeId': choices[i].PreferenceTypeId  
                                                            });				
                $items = $items.add($tempItem);
			} 

            $items.appendTo($choices);
			$('.customHead .rowTitle', $block).text('Customization Style').append(this.$editLink);
			$block.addClass('x1 rootOption').appendTo('#custBody');
			this.bindRootChoiceClick(choices); 
            this.removeCustLoader();
		},

		bindRootChoiceClick: function (choices){
            $('.rootOption').on('click', '.item', $.proxy(function(e){
                var $clicked = $(e.currentTarget),
                    selIndex = $clicked.data('index');

                if($clicked.parents('.customChoice').data().PreferenceId !== $clicked.data('PreferenceId')){
                    this.resetUI();
                }else{
                    return;
                }
                
                this.buildOptions(choices[selIndex].Options);                                
            }, this));
        },  
 
        buildOptions: function(dataSet){
            var limit = dataSet.length,
                $blocks = $(),
                $choices,
                $editBtn,
                $block,
                i;

            // build each block
            for (i = 0; i < limit; i++){
                $block = this.$optionBlock.clone();
                $editBtn = this.$editLink.clone();
                
                $choices = $('.customRow', $block);
                $('.customHead .rowTitle', $block).text(dataSet[i].DisplayName).append($editBtn);
                $('.customRow .rowExplainer', $block).text(dataSet[i].CustomerInstructions || '');

                if(dataSet[i].OptionValues.length === 1 && dataSet[i].OptionValues[0].CharLimit > 0){
                    this.makeTextUI(dataSet[i], $choices, $block);                    
                }else{
                    this.makeChoiceButtons(dataSet[i], $choices, $block);
                }
                
                this.updateOptionOrder($('.customRow .item', $block));
                
                $blocks = $blocks.add($block);
            }  

            $blocks.appendTo('#custBody');   
            this.bindOptionSelectActions();       
            this.handleSingleOption();      
        },

        updateOptionOrder: function($custRow){
            var $noneItem = $(this.findNoneChoice($custRow)[0]) || null;
            $noneItem.insertAfter($custRow.last());
        },

        findNoneChoice: function($items){
            return $.grep($items ,function(val, index){
                return ($(val).data('optionValue') === 'None');       
            });
        },

        handleSingleOption: function(){
            $('.customRow').not('.rootOption .customRow').each(function(){
                var items = $(this).children('.item');
                if(items.length === 1){
                    items.click();
                }
            });
        },

        makeTextUI: function(dataSet, $choices, $block){
            dataSet.OptionValues[0].OptionName = dataSet.DisplayName;
            $choices.append(this.handleTextField(dataSet.OptionValues));     
        },

        makeChoiceButtons: function(dataSet, $choices, $block){
            var $items = $(),
                $tempItem;
            for(var j=0; j < dataSet.OptionValues.length; j++){
                dataSet.OptionValues[j].OptionName = dataSet.DisplayName;
                this.buildChoice($block, dataSet, j);
                $tempItem = this.buildChoice($block, dataSet, j);
                $items = $items.add($tempItem);
            } 
            $items.appendTo($choices);
            if(dataSet.IsGraphicsList) this.getBarnLogos($choices);
            $choices.addClass(this.setOptionSizing(j, $tempItem));
            if(dataSet.OptionValues.length < 1) $choices.parent('.customChoice').addClass('emptyCustomChoice').removeClass('customChoice');

        },

        buildChoice: function($block, dataSet, j){
            var $tempItem = $("<div class='item'></div>"),
                parens = /\(([^\)]+)\)/g;

            if(this.isImageSet(dataSet.OptionValues)){
                this.createImageSet($block, $tempItem, dataSet, j);
            }

            $tempItem.text(dataSet.OptionValues[j].DisplayName.replace(parens, ''));
            this.addItemData($tempItem, dataSet.OptionValues[j]);

            return $tempItem;
        },

        getBarnLogos: function($choices){
            $.get('/api/customization/GetCustomerCustomizationBarnLogo', $.proxy(function(data){ this.addBarnLogos(data.Content, $choices); }, this));
        },

        addBarnLogos: function(dataSet, $choices){
            var $tempDiv = $("<div class='item'></div>"),
                $items = $(),
                imgName,
                htmlTag = /(<(.|\n)*?>)+/,
                $firstItem = $choices.children('.item').first(),
                $firstItemData = $firstItem.data(),
                $tempItem, i;

            if(!dataSet || dataSet.length < 1) return;

            for(i=0; i < dataSet.length; i++){
                $tempItem = $tempDiv.clone();
                imgName = dataSet[i].DisplayName; //.replace(htmlTag, '');
                $tempItem.addClass('graphicItem').css('background-image', 'url(' + dataSet[i].LogoUrl + ')').text(imgName);
                $tempItem.data({ barnLogoId: dataSet[i].Id || null,
                                 optionValueId: dataSet[i].Id,
                                 optionValue: dataSet[i].InternalName,
                                 optionId: $firstItemData.optionID,
                                 optionName: $firstItemData.optionName,
                                 thumb: dataSet[i].LogoUrl
                                }); 
                $tempItem.insertBefore($firstItem);              
            }


        },

        createImageSet: function($block, $tempItem, dataSet, index){
            var imgURL = encodeURI(this.thumbPath + $.trim(dataSet.OptionValues[index].Image));
            $block.addClass('imageSet');
            if(dataSet.OptionValues[index].Image === 'SPthcLetSmartPakChoose.jpg' || dataSet.OptionValues[index].Image === 'noneselected.jpg' || !dataSet.OptionValues[index].Image) imgURL = '';
            if(imgURL){
                $tempItem.css({'background-image': 'url(' + imgURL + ')'});
                this.checkBGImage($tempItem, imgURL);
            }else{
                $tempItem.addClass('noImg');
            }

            this.updateItemClass($tempItem, dataSet.OptionId);
            this.updateItemStyles($tempItem, dataSet.OptionId);            
        },

        checkBGImage: function($tempItem, imgURL){
            var testEl = new Image();
            testEl.onerror = function(){ $tempItem.addClass('noImg'); };
            testEl.src = imgURL;            
        },

        updateItemClass: function($el, optionId){
            if(this.isFontItem(optionId)) $el.addClass('fontItem');
            if(this.isGraphicItem(optionId)) $el.addClass('graphicItem');
            if(this.isMonogramItem(optionId)) $el.addClass('monogramItem');
        },

        updateItemStyles: function($el, optionId){
            var monoItem = this.isMonogramItem(optionId),
                specCss = this.isSpecificStyling(optionId);
            if(monoItem) $el.css(monoItem);
            if(specCss) $el.css(specCss);
        },

        handleTextField: function(dataSet) {  
            var $textDiv = $('<div class="customTextFields" />'),
                rawData = dataSet[0].DisplayName,
                textMax, textLines;

            rawData = rawData.slice(rawData.lastIndexOf('(')+1, rawData.lastIndexOf(')')).split(',');
            textLines = rawData[0];
            textMax = dataSet[0].CharLimit;  
            $textDiv.append(this.buildTextFields(textLines, textMax));
            $textDiv.append("<div class='item textOK'>OK</div><div class='maxChars'>" + this.buildMaxCharsMessage(textLines, textMax) + "</div>");
            this.addItemData($textDiv.find('.textOK'), dataSet[0]);

            return $textDiv;
        },

        addItemData: function($item, dataSet){
            var opVal = $item.is('.textOK') ? [] : dataSet.DisplayName;

            $item.data({ 'optionValueID': dataSet.OptionValueId,
                         'optionValue':  opVal,
                         'optionID': dataSet.OptionId,
                         'optionName': dataSet.OptionName,
                         'barnLogoID': dataSet.BarnLogoId || null,
                         'thumb': dataSet.Image || '',                                                         
                         'priceDiff': dataSet.PriceDiff || 0 });

        },

        buildTextFields: function(lines, max) {
            var fields = "<input type='text' maxlength='"+max+"' class='customTextField' id='customText' />";
            if(lines > 1){
                for (var i=1; i<lines; i++){
                    fields += "<input type='text' maxlength='"+max+"' class='customTextField' id='customText"+i+1+"' />";
                }
            }
            return $(fields);
        },

        buildMaxCharsMessage: function(lines, textMax){
            var msg = textMax + ' characters max';
            if (lines > 1) msg += " / line";

            return msg;
        },

        setOptionSizing: function(optionCount, $item){ 
            var xClass = 'x7',
                options = optionCount + 1;

            if(options < 9) xClass = 'x4';
            if(options < 7) xClass = 'x2';
            if(options === 4) xClass = 'x4'; 
            if($item && $item.is('.fontItem, .monogramItem, .graphicItem')) xClass = 'x4';    

            return xClass;
        },

        customizeNotificationRequired: function() {
            var requiredClassName = 'notificationRequired';
            $(productClass.selectors.divCustomizationMessage).addClass(requiredClassName);
        },

// BUTTON STYLING:

        isImageSet: function(dataSet){
            return $.grep(dataSet, function(op){
                if(op.Image) return true;
                                    }).length > 0;
        },

        isFontItem: function(optionID){
        	var fontItemIDs = [4, 5, 23, 28, 31, 36, 37, 71, 204, 234, 278];
        	return $.inArray(optionID, fontItemIDs) > -1;
        },

        isMonogramItem: function(optionID){
            var itemIDs = { '1':   { 'background-size': '60%', 'background-position-y': '16px' }, 
                            '20':  { 'background-size': '60%', 'background-position-y': '16px' },
                            '231': { 'background-size': '85%', 'background-position-y': '8px' }, 
                            '57':  { 'background-size': '100%', 'background-position-y': '-6px', 'color': '#FFF' }
                          };

            if(itemIDs.hasOwnProperty(optionID)) return itemIDs[optionID];

            return null;
        },

        isGraphicItem: function(optionID){
            var gfkItemIDs = [30, 73, 137, 223 ];
            return $.inArray(optionID, gfkItemIDs) > -1;
        },

        isSpecificStyling: function(optionID){
            var itemIDs = { '4' :  { 'background-position-y': '-4%', 'background-color': '#fff' },
                            '28':  { 'background-color': '#fff' },
                            '6' :  { 'background-position-y': '-3px', 'font-size': '0px' },
                            '23':  { 'background-position-y': '5px', 'background-color': '#fff', 'background-size': '75%' },
                            '57':  { 'color': '#2c2c2c' },
                            '58':  { 'background-image': 'none' },
                            '71':  { 'background-size': 'cover', 'background-position-y': '-5px', 'background-color': '#2c2c2c', 'color': '#fff', 'font-size': '12px' },
                            '223': { 'background-size': 'cover', 'background-position-y': '17px' }
                          };

            if(itemIDs.hasOwnProperty(optionID)) return itemIDs[optionID];

            return null;
        },

//OPTION SELECTION /DESELECTION:

        bindOptionSelect: function(){
            $('#customDialogContainer').off().on('click', '.item', $.proxy(function(e){ 
                var $clicked = $(e.currentTarget),
                    $parent = $clicked.parents('.customChoice'),
                    optionData = $clicked.data();

                if($parent.is('.rootOption')){
                    $clicked.data('selectedLabel', $clicked.text());
                }

                if($clicked.is('.textOK')){
                    this.handleTextOK($clicked);
                    return;
                }

                this.handleOptionSelect(optionData, $parent); 

            }, this)); 
        },

        hasPunctuation: function(text){
            var punc = /[^a-zA-Z\d\s]/g;
            return text.match(punc);
        },

        checkPunctuation: function($fields){
            var allTxt = '';
            $fields.each(function(){
                allTxt += $(this).val();
            });

            if(this.hasPunctuation(allTxt)) this.warnPunctuation($fields);
        },

        warnPunctuation: function($txtFields){
            var $row = $txtFields.parents('.customRow');
            $('<div class="puncWarning" >We see you have punctuation in your text.<br>Be aware your customization will include all characters as submitted.</div>').insertBefore($row);
        },

        handleTextOK: function($clicked){
            var $fields = $clicked.siblings('.customTextField'),
                $parent = $clicked.parents('.customChoice'),
                fieldVals = [],
                displayText = "<div id='displayCustomText'>",
                textLine,
                data = $clicked.data();

            if(this.getTextFieldCharCount($fields) < 1) return;

            this.checkPunctuation($fields);

            $fields.each(function(){
                textLine = $(this).val();
                fieldVals.push(textLine);
                displayText += "<div class='displayTextLine'>"+textLine+"</div>";
            });
            displayText += "</div>";
            $(displayText).appendTo($('.rowSelection', $parent));
            
            data.optionValue = fieldVals;            

            this.handleOptionSelect(data, $parent);
        },

        handleOptionSelect: function(data, $parentBlock){
            var image = data.thumb,
                cost = data.priceDiff,
                $rowTitle, imagePath,
                parens = /\(([^\)]+)\)/g,
                selImg;

            
            $parentBlock.addClass('chosen');
            
            if(data.selectedLabel){
                $('.rowSelection', $parentBlock).text(data.selectedLabel);
            }

            if(image){
                imagePath = (image.indexOf('GetCustomizationBarnLogo') > 0) ? image : this.thumbPath+image;
                selImg = $("<img class='selectedThumb' src='"+imagePath+"' />").on('error', function(e){ $(e.target).hide();});
                $('.rowSelection', $parentBlock).prepend(selImg); 
            }
            if(!$.isArray(data.optionValue) && !$parentBlock.is('.rootOption')){
                $rowTitle = $('.rowTitle', $parentBlock);
                $rowTitle.find('.optionValue').remove();
                $rowTitle.append("<div class='optionValue'>&rsaquo; " + data.optionValue.replace(parens, '') + "</div>"); 
            }              

            $parentBlock.data(data);

            if($parentBlock.data('optionID') === 274 && $parentBlock.data('optionValueID') === 63 ) this.hideDependentOptions($parentBlock.data('optionID'));

            this.updateTally(cost, $parentBlock);
            this.toggleSaveButton();
        },

        hideDependentOptions: function(optionid){
            var optionIdMap = { '274': ['275', '276', '277']},
                choice, 
                $choice,
                i;

            for(i=0; i < optionIdMap[optionid].length; i++){ 
                choice = this.getChoiceById(optionIdMap[optionid][i]);
                $choice = $(choice[0]);
                $choice.find('.customTextField').val('0');
                $choice.find('.textOK').click();
            }
        },

        getChoiceById: function(id){
            return $.grep($('.customChoice') ,function(val, index){
                return $(val).find('.item').data('optionID') == id;           
            });
        },

        getTextFieldCharCount: function($fields){
        	var txtlen = 0;

        	$fields.each(function(){ 
        		txtlen += $(this).val().trim().length;        	
        	});

        	return txtlen;
        },

         handleOptionEdit: function($parentBlock){ 
            $parentBlock.removeClass('chosen');
            $('.rowSelection', $parentBlock).empty();
            $('.puncWarning', $parentBlock).remove();
             this.toggleSaveButton();
        },

        toggleSaveButton: function(){
            var $save = $('.custSave');
            if($('.customChoice').length === $('.chosen').length){
                $save.removeAttr('disabled');
            }else{
                $save.attr('disabled', 'disabled');
            }
        },

        resetUI: function(){
            $('.customChoice').not('.rootOption').remove();
        },

// BINDINGS:
		
		bindOptionSelectActions: function(){
            this.bindOptionSelect();
            this.bindOptionEdit();
        },

        bindOptionEdit: function(){
            $('#customDialogContainer').on('click', '.customChoice.chosen', function(){ 
                productClass.customizer.handleOptionEdit($(this));
            });
        },                        

		rebindCustomizationStart: function(){
			var $link = $(smartPak.productClass.selectors.lnkCustomize);
			if($link){
				$link.off().on('click', $.proxy(this.prepModalUI, this));
			}
		},

        bindCustomReviewLinks: function(){
            $('.deleteCustomization').on('click', $.proxy(this.deleteCustomization, this)); 
            $('.editCustTable').on('click', $.proxy(this.openModal, this));
        },

        bindSave: function(){
            $('.buttonFoot').on('click', '.custSave', $.proxy(this.buildData, this));
        },

        bindCancel: function(){
            $('.custCancel').on('click', $.proxy(this.closeModal, this));
            
        },

        bindAndroidCharLimits: function(){
            $('#divCustomizationModal').on('input', '.customTextField', function(e){ 
                    var $target = $(e.currentTarget),
                        limit = $target.attr('maxlength'),
                        fieldVal = $target.val(),
                        curChars = $target.val().length;

                    if(curChars >= limit){
                        $target.val(fieldVal.slice(0, limit));
                        e.preventDefault();
                        return false;
                    }
            });
        },

// COST TALLY & DISPLAY

    updateTally: function(cost, $targetRow){
        var $rowSelect = $('.rowSelection', $targetRow),
            per = ($('#Quantity').val() > 1) ? '/ea' : '';
        if(cost > 0){
            $rowSelect.find('.addCost').remove();
            $rowSelect.append("<div class='addCost'>+ $" + cost.toFixed(2) + "<span>"+ per +"</span></div>");
            $('#tally').show();
        }

        if(this.pcVM.SelectedProduct()){
            $('#tallyBase .tallyCost').text($('.headItem.prodCost').text());
            $('#tallyBase').show();
        }else{
            $('#tallyBase').hide();
        }

        $('#tallyCust .tallyCost').text("+$"+ this.getTallySum());
        $('#tallyTotal .tallyCost').text("$"+ (this.getTallyTotal().toFixed(2)) + per);
        if(per) $('#tallyBase, #tallyCust').css('padding-right', '23px');
    },

    getTallySum: function(){
        var cost = 0, rawCost;

        $('.addCost').each(function(){
            rawCost = $(this).text();
            rawCost = rawCost.slice(rawCost.lastIndexOf('$')+1, rawCost.lastIndexOf('.')+3);

            cost += Number(rawCost);            
        });

        cost = cost.toFixed(2);
        return cost;
    },

    getTallyTotal: function(){
        var base, cost,
            $tallyEl = $('#tallyBase .tallyCost'),
            $costEl = $('#tallyCust .tallyCost');

        base = Number($tallyEl.text().replace('$', ''))  || 0;
        cost = Number($costEl.text().replace('+$', '')) || 0;

        return base + cost;
    },

// DATA COLLECTION / HANDLING:

    buildData: function(){
        if($('.custSave').attr('disabled')) return;

        var data = $('.rootOption.chosen').data(),
            tempData;

        delete data.index;
        delete data.selectedLabel;

        data.productClassId = smartPak.productClassViewModel.ProductClass.Id;
        data.options = [];

        $('.chosen').not('.rootOption').each(function(index, current){
            tempData = $(current).data();
            tempData.optionName = tempData.optionName.replace(/\(([^\)]+)\)/g, '');
            tempData.optionValue = (Array.isArray(tempData.optionValue)) ? tempData.optionValue : [tempData.optionValue];
            delete tempData.thumb;
            data.options.push(tempData);
        });
        
        this.displayCustomization(data);
        this.saveData(data);

    },

    saveData: function(data){
        $("input#CustomizationData").val(JSON.stringify(data));
        this.pcVM.reload(customizationActionTypes.ADDED);
        this.closeModal();
    },

    displayCustomization: function(data){
        $('#custTable').remove();

        var $custTable = $("<table id='custTable'><tr><td colspan='2' id='prefRow'>Customization Details: " + data.PreferenceName + "</td></tr></table>"),
            $custMsg = $('#divCustomizationMessage'),
            per = ($('#Quantity').val() > 1) ? '/ea' : '',
            ops = data.options,
            limit = ops.length,
            i = 0,
            sum = +this.getTallySum(),
            parens = /\(([^\)]+)\)/g,
            $newRow, opName, cost;

        for(i; i < limit; i++){
            opName = $.trim(ops[i].optionName.replace(parens, '')); 
            $newRow = $('<tr><td class="opName" >'+ opName +':</td><td class="opVal">'+ ops[i].optionValue.join('<br>') +'</td></tr>');
            $newRow.appendTo($custTable);
        }
        
        cost = (sum > 0) ? '+ $'+ sum.toFixed(2) : 'FREE';

        $('<tr><td class="opName" >Cost:</td><td class="opVal">'+ cost + per +'</td></tr>').appendTo($custTable);
        $('<tr id="linkRow"><td class="hideLink"><a href="#" class="editCustTable" href="#">edit</a></td><td class="deleteLink"><a class="deleteCustomization" href="#">remove customization</a></td></tr>').appendTo($custTable);
        $custMsg.find('#custBeginWrap').hide();
        $custTable.appendTo($custMsg);
        $custMsg.removeClass('notificationRequired');
        
        this.bindCustomReviewLinks();
    },

    deleteCustomization: function(){
        $('#CustomizationData').val('');
        $('#divCustomizationModal').empty();
        $('#customDialogContainer #tally').hide();
        $('#custTable').remove();
        $('#divCustomizationMessage #custBeginWrap').show();
        this.rebindCustomizationStart();

        this.pcVM.reload(customizationActionTypes.REMOVED);

    },

    checkForFlex: function(){
        var el = document.getElementsByTagName('body');
        return (el[0].style['flexWrap'] !== undefined || el[0].style['WebkitFlexWrap'] !== undefined || el[0].style['msFlexWrap'] !== undefined )
    },

    initMobile: function(){
        if(this.isMobile) {
            $('body').addClass('isMobile');
            $('#divCustomizationMessage').insertBefore('.mvm.notification:first');
            this.bindAndroidCharLimits();
        }
    },

//initialize:
		init: function(viewModel){
            this.apiUrl = '/api/customization/GetCustomizationPreference/',
            this.$optionBlock = $("<div class='customChoice'><div class='customHead'><div class='rowTitle'></div><div class='rowSelection'><div class='addCost'></div></div></div><div class='customRow'><div class='rowExplainer'></div></div></div>"),
            this.$editLink = $("<a class='editOption'>edit &raquo;</a>"),
            this.thumbPath = '/../../images/custom/',
            this.isMobile = /\/mobile\//gi.test(location.href);  

            this.pcVM = viewModel;
            this.hasFlex = this.checkForFlex();
			this.rebindCustomizationStart();
            this.initMobile();
		}
	};

})(jQuery, smartPak.core.namespace('smartPak.productClass'));
