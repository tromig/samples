
(function(){
    "use strict";

    var styles = $("<style> a.rfk_open_search_page {border-radius: 4px; } #footSocialIcons { margin-top: 24px; padding-left:10px } li.catHead a:link, li.catHead a:visited {color: #db933d; font-size: 18px!important; font-weight: 600; border-bottom: 1px solid #db933d; line-height: 15px; padding-left: 0; margin-left: 8px; text-shadow: 1px 1px 1px white; } #contentBody{ transition: opacity .2s; } .singleBox a:hover .bannerCopy { top: 56%; } .rfk-sb.rfk_visible {box-shadow: 0px 5px 10px 0px #5c5b5b63; border: none; } #catalogRequest { margin-top: 4px; } #meetUsThumb > a.rfLink, #blogThumb > a.rfLink {background: url(//img.smartpak.com/images/meetTheSmartPakers/karenMacy.jpg?width=205); background-repeat: no-repeat; background-size: cover; background-position-y: -32px; width: 205px; height: 123px; display: block; border: 1px solid #777; } a.rfLink img {display: none; } div#blogThumb {border: none; margin: 0; } .bottomNavGroup li a{text-align:center; } .bottomNavGroup ul {display: flex; flex-direction: row; flex-wrap: nowrap; justify-content: space-between; width: 97.5%; } .singleBox a:hover .bannerCopy {opacity: 1; top: 54%; } .singleBox .bannerCopy{top:58%; } button#adobeSearch {height: 35px; border: none; display: block; width: 44px; cursor:pointer; } button#adobeSearch::after{content: ''; height: 30px; width: 40px; display: block; margin-top: -2px; background: url(//img.smartpak.com/images/icons/search-icon-white.png) 30% no-repeat; background-size: 18px; } #callChatPromo a {color: #999; } #callChatPromo {font-size: inherit; color: #aaa; background-color: #fff; padding-top: 0; padding-bottom: 0; } .searchInput::placeholder {color: #ccc; font-size: 15px; } .rfk-sb.rfk_visible{box-shadow: 0 5px 11px 0px rgba(71,70,71,.2) } .subNavGroup a:link, .subNavGroup a:visited {color: #5a5a5a; } .secondaryNav>li>a:link, .secondaryNav>li>a:visited { padding: 12px 10.7px; font-size: 16px; letter-spacing: -0.6px!important; } div#header.edgeSpace {padding-left: 8px; padding-right: 8px; } #header>.container {height: 86px; } .subNav {border: 1px solid #184973bf; background: #fffffffa; max-width: 798px; box-shadow: 2px 2px 17px -1px #33333382; } div.bannerCopy h2 {line-height: 24px; font-size: 24px; color: #73b74c; margin-bottom:4px; } .bannerCopy span {font-size: 18px; display: block; } .doubleBox div.bannerCopy h2 {font-size: 20px; margin-top: 0; } .doubleBox .bannerCopy span {font-size: 15px; } div.bannerCTA {color: #87cefa; font-size: 16px; margin-top: 4px; float: right;} .bannerCTA .CTAarrow {display: inline-block; vertical-align: top; } div#headerPromo {top: 26px; } #headerPromo .brandFont {font-size: 12px; margin-top: 2px; display: block; } .tagLine {top: 34px!important; left: 68px!important; } div.search {position: absolute; top: 30px; left: 280px; } input#txtSearchTerm {font-size: 18px; min-width: 330px; padding: 8px; top: 0; } .search input[type=submit] {height: 27px; padding-top: 12px; padding-bottom: 25px; } li.infoDrop>a:after {content: ''; display: inline-block; margin-left: .5em; width: 10px; height: 7px; background: url(//img.smartpak.com/images/icons/chevron-dn.png) no-repeat; background-size: 9px; margin-bottom: -1px; opacity: 0.8; } div.searchMain {border: 1px solid #ccc; border-radius: 8px; overflow: hidden; } span.menuBullet {display: none; } div.shopAll a {font-weight: 400!important; letter-spacing: 0px!important; } .subNavInner > ul.size1of2 {padding-right: 20px; } .subNavGroup:not(:last-of-type) {box-sizing: border-box; border-right: 1px solid #1849732b; } .subNavGroup:last-of-type {padding-left: 10px; box-sizing: border-box; } .subNavGroup:not(:first-of-type) {padding-left: 10px; } .footCopyLine {font-size: 13px; margin: 5px 0; } #footerConnect .container .container:nth-child(1) {text-align: center; } #footerConnect .container .container:nth-child(3) .footCopyLine {font-size: 11px; text-align: left; } span.rfExcerpt.footCopyLine {text-align: left!important; } #footerEmailAndCatalog.footer-layer.layer-email {padding: 12px 20px; color: #fff; font-size: 16px; } .lastCol .footBlockOf4 .footCopyLine {text-align: center!important; } div#appIconLink {text-align: center; margin-top: 28px; margin-bottom: 20px; } .footTitle {text-align: center!important; } #blogThumb, #meetUsThumb {margin-bottom: 5px; margin: 0 auto; text-align: center; } </style>");
    styles.appendTo("head");

    document.querySelector('.searchInput').setAttribute('placeholder', "Search, Find & Have A GREAT Ride!"); 
    $('#adobeSearch').replaceWith('<button id="adobeSearch" type="submit" class="searchBlueButton"></button>');

    $('.shopAll > a').wrap("<li class='ptm' >");

    $('.shopAll').not('.bottomNavGroup').addClass('bottomNavGroup').each(function(){
        $(this).children('li').wrapAll("<ul class='nav col'>");
        $(this).css('margin-top', '0').insertAfter($(this).parent('.subNavInner'));
    });

    $('.bottomNavGroup li a').each(function(){
        var txt = $(this).text();
        txt = txt.substring(0, txt.length-2);
        txt = txt.replace(/by|for/gi, '');
        $(this).text(txt);
    });


    $('.secondaryNav > li').on('mouseenter', shadeBody);
    $('.secondaryNav > li').on('mouseleave', unshadeBody);
    $('#txtSearchTerm').on('focus', shadeBody );
    $('#txtSearchTerm').on('blur', unshadeBody);

    function shadeBody(){
        $('#contentBody').css('opacity', '.2');
    }

    function unshadeBody(){
        $('#contentBody').css('opacity', '1');
    }

    $('li span:contains(Cart)').hide();
    $('.cartIcon').css('opacity', .6)
    $('.footer-layer.layer-grey.fluid-row').first()
    $('.footer-layer.layer-grey.fluid-row').first().find('.footCopyLine').css('text-transform', 'capitalize');

    $('<div id="footSocialIcons" />').appendTo($('.icon-fb').parent());
    $('.icon-fb').appendTo('#footSocialIcons');
    $('.icon-twitter').appendTo('#footSocialIcons');
    $('.icon-insta').appendTo('#footSocialIcons');
    $('.icon-youtube').appendTo('#footSocialIcons');

    function updateFootBlogLinks(){
        $('#meetUsThumb, #blogThumb').each(function(){
            var img = $(this).find('.rfLink img').data('src');
            img = img.replace('?width=121', '?width=205');
            $(this).find('.rfLink').css('background-image', 'url('+ img +')');
        });
    }

    function waitForElData(selector, dataName, callback){
        var opts = { attemptLimit: 20, timeout: 200 },
            attempt = 1;

        function checkForAttr(){
            var elAttr = $(selector).data(dataName);

            if(attempt <= opts.attemptLimit){
                if(elAttr){
                    callback();
                }else{
                    attempt++;
                    setTimeout(checkForAttr, opts.timeout);
                }
            }
        }
        checkForAttr();
    }

    waitForElData('#meetUsThumb img', 'src', updateFootBlogLinks);

})();


/*

    X Top utility nav font color - darken /- remove Cart link text / -cart icon same grey as text
    X Drop nav Orange Heads - give more weight (font-weight/underline?)
    - Sale Ribbon <- ?
    x Centered Foot links - Title Case
    x Footer: "Connect W Us" - re-add social icons
    x Search bar -  new ghost text (added)
    x view more button in Search Drop - style (rounded?), aslo: Drop shadow same as



*/

