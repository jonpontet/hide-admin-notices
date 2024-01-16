/* global jQuery, hideAdminNoticesVars */
// Support for jQuery v3.6.0 for WordPress v5.9.8+.
(function ($) {
  let $body = $('body'),
    $hanPanel = $(hideAdminNoticesVars.panelSelector),
    $hanToggleButton = $(hideAdminNoticesVars.linkSelector),
    $hanToggleButtonWrap = $(hideAdminNoticesVars.linkWrapSelector),
    $screenMetaLinks = $(hideAdminNoticesVars.screenMetaLinksSelector);

  // Run after common.js.
  $(function () {
    let notices = $('#' + hideAdminNoticesVars.captureId + ' > *').not('.wp-header-end').not('#message');

    if (!notices.length) {
      return;
    }

    // Activate HAN.
    $body.addClass(hideAdminNoticesVars.activeBodyClass);

    // Move notices to han panel.
    notices.each(function () {
        $(this)
          .detach()
          .appendTo($hanPanel);
      }
    );

    // Copy WP default screen meta links to conserve toggle button placement when expanded.
    $screenMetaLinks.clone().appendTo($hanToggleButtonWrap);

    // Add panel toggle event.
    $hanToggleButton.on('click', function () {
      if ($hanPanel.is(':visible')) {
        $hanPanel.slideUp('fast', function () {
          $body.removeClass(hideAdminNoticesVars.panelActiveClass);
          $hanToggleButton.removeClass(hideAdminNoticesVars.panelActiveClass)
            .attr('aria-expanded', false);
        });
      } else {
        $body.addClass(hideAdminNoticesVars.panelActiveClass);
        $hanPanel.slideDown('fast', function () {
          this.focus();
          $hanToggleButton.addClass(hideAdminNoticesVars.panelActiveClass)
            .attr('aria-expanded', true);
        });
      }
    });
  });
})(jQuery);
