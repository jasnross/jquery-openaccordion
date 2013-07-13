/**
 * OpenAccordion is a jQuery plugin for accordion-style drop-downs which can use arbitrary tags or selectors as
 * section delimiters. Especially useful in CMS and WYSIWYG environments where it is difficult to be sure of the
 * exact HTML structure to be used.
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
    /**
     * jQuery OpenAccordion plugin
     * @param [optionalParam] options
     */
    $.fn.openAccordion = function (options) {
        var defaults = {
            sectionSeparator: 'h3',
            openedIndicator: "&#9660;",
            closedIndicator: "&#x25b6;",
            displayOpenIndicator: true,
            activeClasses: ['active'],
            breakOn: ['h1', 'h2'],
            hideInactive: true,
            contentWrapper: $('<div></div>'),
            contentWrapperClass: 'jquery-openaccordion-content'
        };

        options = $.extend(true, defaults, options);

        $(this).each(function () {
            var container = $(this),
                downTriangle = options.openedIndicator,
                rightTriangle = options.closedIndicator,
                sectionSeparator = options.sectionSeparator,
                headings = container.find(sectionSeparator),
                visibleElements = $([]),
                contentWrapper = options.contentWrapper.clone(true);

            headings.css({
                cursor: 'pointer'
            });

            headings.each(function () {
                var heading = $(this),
                    textElements = $(this).nextUntil(sectionSeparator, "*:not(" + options.breakOn.join(', ') + ")"),
                    dropArrowContainer = $("<span class='jquery-openaccordion-drop-arrow'></span>").html(rightTriangle).css({
                        "margin-right": "5px",
                        "float": "left",
                        "display": "block",
                        "font-size": parseInt(heading.css('font-size')) / 2 + 'px'
                    });

                if (contentWrapper) {
                    contentWrapper.addClass(options.contentWrapperClass);
                    textElements.wrapAll(contentWrapper);
                }

                textElements.hide();

                if (options.displayOpenIndicator) {
                    $(this).prepend(dropArrowContainer);
                    dropArrowContainer.css({
                        "margin-top": (heading.height() - dropArrowContainer.height()) / 2
                    });
                }

                heading.on('click', function () {

                    if (options.hideInactive && visibleElements.length) {
                        headings.removeClass(options.activeClasses.join(' '));
                        headings.find('.drop-arrow').html(rightTriangle);
                        visibleElements.slideUp();
                        visibleElements = $([]);
                    }

                    if (textElements.is(':visible')) {
                        dropArrowContainer.html(rightTriangle);
                        textElements.slideUp();
                        visibleElements = visibleElements.not(textElements);
                        heading.removeClass(options.activeClasses.join(' '));
                    } else {
                        dropArrowContainer.html(downTriangle);
                        heading.addClass(options.activeClasses.join(' '));
                        visibleElements = visibleElements.add(textElements.slideDown());
                    }

                });
            });
        });
    };
})(jQuery);