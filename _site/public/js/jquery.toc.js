/*
 * jQuery Table of Content Generator for Markdown v1.0
 *
 * https://github.com/dafi/tocmd-generator
 * Examples and documentation at: https://github.com/dafi/tocmd-generator
 *
 * Requires: jQuery v1.7+
 *
 * Copyright (c) 2013 Davide Ficano
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
(function($) {

 var tocContainerHTML = '<ul class="nav bs-docs-sidenav">%1</ul>';

    //var tocContainerHTML = '<div id="toc" data-spy="affix">';


    function createLevelHTML(h, tocInner) {
        var link = '<a href="#%1">%2</a>%3'
            .replace('%1',  h.attr('id'))
	    .replace('%2', h.text())
	    .replace('%3', tocInner ? tocInner : '');
        return '<li>%4</li>\n'
            .replace('%4', link);
    }

    $.fn.toc = function(settings) {

        var tocHTML = '';
       
        var tocContainer = $(this);

        tocContainer.find('h1').each(function() {
            var levelHTML = '';
            var innerSection = 0;
            var h1 = $(this);

            h1.nextUntil('h1').filter('h2').each(function() {
                levelHTML += createLevelHTML($(this));
            });
            if (levelHTML) {
                levelHTML = '<ul class="nav">' + levelHTML + '</ul>\n';
            }

            tocHTML += createLevelHTML(h1, levelHTML);

        });


	var sidebar = $("#toc");
	var replacedTocContainer = tocContainerHTML.replace('%1',tocHTML);
	sidebar.prepend(replacedTocContainer);        
        return this;
    }
})(jQuery);
