/* global jQuery, hide_admin_notices_l10n */
(function ($) {
    "use strict";
    ({
        init: function () {
            this.$allAdminNotices = $('#wpbody-content>div.updated:visible,#wpbody-content>div.notice:visible,' +
                '#wpbody-content>div.update-nag:visible,#wpbody-content>#message:visible');

            // Do not run on WooCommerce pages
            // Or no visible admin notices
            if ($('body').hasClass('woocommerce-page') ||
              !this.$allAdminNotices.length) {
                return;
            }

            this.run();
        },
        run: function () {
            // Immediately add active mode class
            $('body').addClass('hidden-admin-notices-active');


            var $hanPanel = $('<div id="hidden-admin-notices-panel" class="hidden" tabindex="-1" ' +
              'aria-label="' + hide_admin_notices_l10n.screenMetaAriaLabel + '">')
              .insertAfter('#screen-meta');

            // Start by moving standard notices
            this.$allAdminNotices.detach().appendTo($hanPanel).show();

            var $hanToggle = $('<div id="hidden-admin-notices-link-wrap" class="hide-if-no-js">')
                .insertAfter('#screen-meta-links'),
                $hanToggleButton = $('<button type="button" id="hidden-admin-notices-link" class="button" ' +
                'aria-controls="hidden-admin-notices-panel" aria-expanded="false"><span>' +
                hide_admin_notices_l10n.toggleShowText + '</span><span>' + hide_admin_notices_l10n.toggleHideText +
                '</span></button><');

            $hanToggleButton.appendTo($hanToggle).click(function () {
                if ($hanPanel.is(':visible')) {
                    $hanPanel.slideUp('fast', function () {
                        $hanToggleButton.removeClass('hidden-admin-notices-panel-active')
                            .attr('aria-expanded', false);
                    });
                } else {
                    $hanPanel.slideDown('fast', function () {
                        this.focus();
                        $hanToggleButton.addClass('hidden-admin-notices-panel-active')
                            .attr('aria-expanded', true);
                    });
                }
            });
            var interval = setInterval(function () {
                // Wait for relocated notices (div.updated, #message) to be moved underneath H1 before moving all
                // notices to panel
                if ($('#wpbody-content>.wrap>div.updated,#wpbody-content>.wrap>div.notice,' +
                    '#wpbody-content>.wrap>#message').length ===
                    $relocatedAdminNotices.length) {
                    clearInterval(interval);
                    self.$allAdminNotices.detach().appendTo($hanPanel).show();
                }
            }, 500);
        }
    }).init();
})(jQuery);
