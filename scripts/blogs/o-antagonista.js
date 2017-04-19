// ==UserScript==
// @name         O Antagonista - Speed Reading
// @namespace    http://oantagonista.com/speedread
// @version      0.7.0
// @description  Fast reading of the micro blog!
// @author       ViZeke
// @match        http://www.oantagonista.com/
// @match        http://www.oantagonista.com/pagina/*
// @grant        none
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// ==/UserScript==

(function($) {
    'use strict';

    let tvAntagonista = false;

    let addGlobalStyle = (css) => {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    };

    function procArticles($articles){
        const baseUrlPosts = 'http://www.oantagonista.com';

        $articles.each( (i, itemPost) => {
            const url = baseUrlPosts + $(itemPost).first().find('a').first().attr('href');

            $.get(url)
                .success( response => {

                let $allContent = $(response).find('div.l-main-right:first');
                let $content = $allContent.find('div.the-content-text');
                if (!tvAntagonista){
                    $content.append($allContent.find('#dm_jukebox_iframe'));
                    tvAntagonista = true;
                }

                $(itemPost).attr('processed', 1);
                $(itemPost).find('p').remove();
                $(itemPost).find('.post-more').remove();
                $(itemPost).find('.post-summary').append($content);
            });
        });
    }

    let cleanAds = () => {
        $('div.banner').remove();
        $('aside').remove();
        $('ins').remove();
        $('div.ob-widget').remove();
    };

    let procArticle = true;
    let procClean = true;

    $(document).scroll( () => {
        if ( procArticle ){
            setTimeout( () => {
                procArticles($('article.post[processed!=1]'));
                procArticle = true;
            }, 1000);
        }
        if ( procClean ){
            setTimeout( () => {
                cleanAds();
                procClean = true;
            }, 2000);
        }
        procArticle = false;
        procClean = false;
    });

    //Init
    addGlobalStyle('div.post-summary { width: auto; }');
    addGlobalStyle('article.post.first-post { margin-top: 25px; }');

    cleanAds();
    procArticles($('article.post[processed!=1]'));
})(jQuery);

//Init on global context
$(document).ready( () => {
    //specific site function in case of overlay adds
    if (dclk_hide_overlay) {
        dclk_hide_overlay();
    }
});