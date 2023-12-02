/* global jQuery */
// On page load notices exist in #wpbody-content > .notice
// During page load notices move to #wpbody-content > .wrap > .notice
(function ($) {
  var $body = $('body'),
    allAdminNotices = ['> div.error:not(.notice)',
      '> div.updated:not(.notice)',
      '> div.notice:not(.updated):not(.error)',
      '> div.update-nag',
      '> div#message:not(.notice):not(.updated):not(.error)',
      '> form>div.error,' +
      '> form>div.updated:not(.notice),' +
      '> form>div.notice:not(.updated),' +
      '> form>div#message:not(.notice):not(.updated)',
    ],
    hanPanelSelector = '#hidden-admin-notices-panel',
    $hanPanel = $(hanPanelSelector),
    $hanToggleButton = $('#hidden-admin-notices-link'),
    $hanToggleButtonWrap = $('#hidden-admin-notices-link-wrap'),
    $screenMetaLinks = $('#screen-meta-links');

  // Run after WP has moved all notices after .wp-header-end.
  $(function () {
    // Do not run if no notices are found.
    if (!$(allAdminNotices.join(','), '#wpbody-content .wrap').length) {
      return;
    }

    $body.addClass('hidden-admin-notices-active');

    // Move notices to han panel.
    $(allAdminNotices.join(','), '#wpbody-content .wrap').each(function () {
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
