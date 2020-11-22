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

            // Then monitor notices which get moved to .wrap
            var startTime = new Date().getTime(),
              interval = setInterval(function () {
                // Stop monitoring after 5 seconds
                if(new Date().getTime() - startTime > 5000){
                    clearInterval(interval);
                    return;
                }
                $('#wpbody-content>.wrap>div.updated').detach().appendTo($hanPanel).show();
                $('#wpbody-content>.wrap>div.notice').detach().appendTo($hanPanel).show();
                $('#wpbody-content>.wrap>#message').detach().appendTo($hanPanel).show();
            }, 250);
        }
    }).init();
})(jQuery);
