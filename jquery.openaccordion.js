/**
 * OpenAccordion is a jQuery plugin for accordion-style drop-downs which can use arbitrary tags or selectors as
 * section delimiters. Especially useful in CMS and WYSIWYG environments where it is difficult to be sure of the
 * exact HTML structure to be used.
 *
 * @name openaccordian
 * @version 1.0.0
 * @requires jQuery v1.2.3+
 * @author Jason Ross
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright (c) 2013, Jason Ross (jason -[at]- facsimile6 [*dot*] net)
 */
(function ($) {
    /**
     * Accordion is a jQuery plugin for accordions which can use headings as section separators. All content
     * between separators becomes the accordion section content.
     *
     * This is especially useful in WYSIWYG CMS systems where the content creators may not have knowledge on how to
     * write a specific HTML layout required for other accordion implementations.
     *
     * The list separator defaults to h3, and h1 or h2 tags can be used to break out of the accordion content, but both
     * can be customized via the listSeparator and breakOn options.
     *
     * No styles are added to the accordion except for an open/closed indicator which defaults to right/down triangle
     * HTML entities, and a cursor: pointer for each of the headings, so it's up to you to style the accordion as
     * necessary
     *
     * @param [optionalParam] options
     */
    $.fn.openAccordion = function (options) {
        var defaults = {
            listSeparator: 'h3',
            openedIndicator: "&#9660;",
            closedIndicator: "&#x25b6;",
            displayOpenIndicator: true,
            activeClasses: ['active'],
            breakOn: ['h1', 'h2'],
            hideInactive: true
        };

        options = $.extend(true, defaults, options);

        $(this).each(function () {
            var container = $(this),
                downTriangle = options.openedIndicator,
                rightTriangle = options.closedIndicator,
                listSeparator = options.listSeparator,
                headings = container.find(listSeparator),
                visibleElements = $([]);

            headings.css({
                cursor: 'pointer'
            });

            headings.each(function () {
                var heading = $(this),
                    textElements = $(this).nextUntil(listSeparator, "*:not(" + options.breakOn.join(', ') + ")"),
                    dropArrowContainer = $("<span class='drop-arrow'></span>").html(rightTriangle).css({
                        "margin-right": "5px",
                        "float": "left",
                        "display": "block",
                        "font-size": parseInt(heading.css('font-size')) / 2 + 'px'
                    });

                textElements.hide();

                if (options.displayOpenIndicator) {
                    $(this).prepend(dropArrowContainer);
                    dropArrowContainer.css({
                        "padding-top": (heading.height() - dropArrowContainer.height()) / 2
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