/* global jQuery, hide_admin_notices_l10n */
(function ($) {
    "use strict";
    ({
        init: function () {
            this.$allAdminNotices =
              this.$allAdminNotices = $('#wpbody-content>div.error:visible,' +
                '#wpbody-content>div.updated:visible,' +
                '#wpbody-content>div.notice:visible,' +
                '#wpbody-content>div.update-nag:visible,' +
                '#wpbody-content>div#message:visible,' +
                '#wpbody-content>div#wpse1_2023_complete,' + // WP Clone
                '#wpbody-content>div.ctf_notice' // Custom Twitter Feeds
              );

            // Always run for WooCommerce pages
            // Or do not run if no applicable notices
            if (!$('body').hasClass('woocommerce-embed-page') &&
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
                $('#wpbody-content>.wrap>div.error,' +
                  '#wpbody-content>.wrap>div.updated,' +
                  '#wpbody-content>.wrap>div.notice,' +
                  '#wpbody-content>.wrap>div#message' +
                  '#wpbody-content>.wrap>form>div.error,' +
                  '#wpbody-content>.wrap>form>div.updated,' +
                  '#wpbody-content>.wrap>form>div.notice,' +
                  '#wpbody-content>.wrap>form>div#message')
                  .detach()
                  .appendTo($hanPanel)
                  .show();
            }, 250);
        }
    }).init();
})(jQuery);
