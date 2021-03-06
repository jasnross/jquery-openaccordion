/**
 * OpenAccordion is a jQuery plugin for accordion-style drop-downs which can use
 * arbitrary tags or selectors as section delimiters. Especially useful in CMS
 * and WYSIWYG environments where it is difficult to be sure of the exact HTML
 * structure to be used.
 *
 * @name openaccordion
 * @version 0.0.1
 * @requires jQuery v1.2.3+
 * @author Jason Ross
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright (c) 2013, Jason Ross (jason -[at]- facsimile6 [*dot*] net)
 */
(function ($) {
    var defaults = {
        sectionHeading: 'h3',
        openedIndicator: "&#9660;",
        closedIndicator: "&#x25b6;",
        displayOpenIndicator: true,
        applyDefaultStyles: true,
        activeClasses: ['active'],
        breakOn: ['h1', 'h2'],
        hideInactive: true,
        contentWrapper: $('<div></div>'),
        contentWrapperClass: 'jquery-openaccordion-content',
        containerClass: 'jquery-openaccordion-container',
        animateTime: 200,
        openOn: 'click',
        fixedHeight: false
    };

    $.openAccordion = $.openAccordion || {};
    $.openAccordion.setDefaults = function (options) {
        defaults = $.extend(true, defaults, options);
    };

    /**
     * jQuery OpenAccordion plugin
     * @param options [optionalParam]
     */
    $.fn.openAccordion = function (options) {
        options = $.extend(true, {}, defaults, options);
        var hash = window.location.hash.replace("#", "");

        $(this).each(function () {
            var container = $(this),
                downTriangle = options.openedIndicator,
                rightTriangle = options.closedIndicator,
                sectionHeading = options.sectionHeading,
                headings = container.find(sectionHeading),
                visibleElements = $([]),
                maxContentHeight = 0;

            if (options.containerClass) {
                container.addClass(options.containerClass);
            }

            headings.css({
                cursor: 'pointer'
            });

            var closeAll = function () {
                headings.removeClass(options.activeClasses.join(' '));
                headings.find('.jquery-openaccordion-drop-arrow').html(rightTriangle);
                visibleElements.slideUp(options.animateTime);
                visibleElements = $([]);
            };

            if (options.hideInactive && options.openOn === 'mouseenter') {
                container.on('mouseleave', closeAll);
            }

            headings.each(function () {
                var content = null,
                    heading = $(this),
                    textElements = heading.nextUntil(sectionHeading, "*:not(" + options.breakOn.join(', ') + ")"),
                    contentWrapper = options.contentWrapper.clone(true),
                    dropArrowContainer = $("<span class='jquery-openaccordion-drop-arrow'></span>").html(rightTriangle);

                if (options.applyDefaultStyles) {
                    dropArrowContainer.css({
                        "margin-right": "5px",
                        "float": "left",
                        "display": "block",
                        "font-size": parseInt(heading.css('font-size')) / 2 + 'px'
                    });
                }

                contentWrapper.addClass(options.contentWrapperClass);
                content = textElements.wrapAll(contentWrapper).parent(contentWrapper).first();

                if (options.fixedHeight && content.outerHeight() > maxContentHeight) {
                    maxContentHeight = content.outerHeight();
                }

                content.hide();

                if (options.displayOpenIndicator) {
                    $(this).prepend(dropArrowContainer);
                }

                heading.on(options.openOn, function () {
                    if (content.is(':visible') && options.openOn != 'click') {
                        return;
                    }

                    if (options.fixedHeight) {
                        content.outerHeight(maxContentHeight + 20);
                    }

                    if (options.hideInactive && visibleElements.length) {
                        closeAll();
                    }

                    if (content.is(':visible')) {
                        dropArrowContainer.html(rightTriangle);
                        content.slideUp(options.animateTime);
                        visibleElements = visibleElements.not(content);
                        heading.removeClass(options.activeClasses.join(' '));
                    } else {
                        dropArrowContainer.html(downTriangle);
                        heading.addClass(options.activeClasses.join(' '));
                        visibleElements = visibleElements.add(content.slideDown(options.animateTime));
                    }

                });

                if (hash && (heading.has("[name=" + hash + "]").length || heading.attr('name') == hash)) {
                    heading.click();
                    $("html, body").animate({
                        scrollTop: heading.offset().top
                    }, 500);
                }
            });
        });
    };
})(jQuery);
