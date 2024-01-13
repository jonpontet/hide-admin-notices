/* global jQuery, hideAdminNoticesVars */
// Support for jQuery v3.6.0 for WordPress v5.9.8+.
(function ($) {
  var $body = $('body'),
    $hanPanel = $(hideAdminNoticesVars.panelSelector),
    $hanToggleButton = $(hideAdminNoticesVars.linkSelector),
    $hanToggleButtonWrap = $(hideAdminNoticesVars.linkWrapSelector),
    $screenMetaLinks = $(hideAdminNoticesVars.screenMetaLinksSelector),
    $wpHeaderEnd = $(hideAdminNoticesVars.wpHeaderEndSelector),
    $wpUpdateNag = $(hideAdminNoticesVars.updateNagSelector);


  // Capture all notices because WP moves notices to after '.wp-header-end'.
  // See /wp-admin/js/common.js line #1083.
  $wpHeaderEnd.wrap('<div id="' + hideAdminNoticesVars.captureId + '">');

  // Include the update nag.
  $wpUpdateNag.detach().prependTo('#' + hideAdminNoticesVars.captureId);

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
})(jQuery);
