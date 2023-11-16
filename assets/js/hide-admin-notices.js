/* global jQuery */
// On page load notices exist in #wpbody-content > .notice
// During page load notices move to #wpbody-content > .wrap > .notice
(function ($) {
  var $body = $('body'),
    allAdminNotices = ['> div.error',
      '> div.updated:not(.notice)',
      '> div.notice:not(.updated)',
      '> div.update-nag',
      '> div#message:not(.notice):not(.updated)',
      '> form>div.error,' +
      '> form>div.updated:not(.notice),' +
      '> form>div.notice:not(.updated),' +
      '> form>div#message:not(.notice):not(.updated)',
      '> div#wpse1_2023_complete', // WP Clone
      '> div.ctf_notice', // Custom Twitter Feeds
      '> div.wpstg_fivestar' // WP Stage
    ],
    activeClass = 'hidden-admin-notices-active',
    hanPanelSelector = '#hidden-admin-notices-panel',
    $hanPanel = $(hanPanelSelector),
    $hanToggleButton = $('#hidden-admin-notices-link'),
    $hanToggleButtonWrap = $('#hidden-admin-notices-link-wrap'),
    $screenMetaLinks = $('#screen-meta-links'),
    isWcEmbedPage = $body.hasClass('woocommerce-embed-page');

  // Default to active mode – hide all notices by default.
  // $body.addClass(activeClass);

  // Do not run for WooCommerce admin v4.3+.
  // if (isWcEmbedPage) {
  //   $body.removeClass(activeClass);
  //   return;
  // }

  // Run after WP has moved all notices after .wp-header-end.
  $(function () {
    // Do not run if no notices are found.
    if (!$(allAdminNotices.join(','), '#wpbody-content > .wrap').length) {
      // Deactivate active mode.
      $body.removeClass('hidden-admin-notices-active');
      return;
    }

    // Move notices to han panel.
    $(allAdminNotices.join(','), '#wpbody-content > .wrap').each(function () {
        $(this)
          .detach()
          .appendTo($hanPanel);
      }
    );

    // Copy WP default screen meta links to conserve toggle button placement when expanded
    $screenMetaLinks.clone().appendTo($hanToggleButtonWrap);

    $hanToggleButton.on('click', function () {
      if ($hanPanel.is(':visible')) {
        $hanPanel.slideUp('fast', function () {
          $body.removeClass('hidden-admin-notices-panel-active');
          $hanToggleButton.removeClass('hidden-admin-notices-panel-active')
            .attr('aria-expanded', false);
        });
      } else {
        $body.addClass('hidden-admin-notices-panel-active');
        $hanPanel.slideDown('fast', function () {
          this.focus();
          $hanToggleButton.addClass('hidden-admin-notices-panel-active')
            .attr('aria-expanded', true);
        });
      }
    });
  })
})(jQuery);
