/* global jQuery */
// Support for jQuery v3.6.0 for WordPress v5.9.8+.
(function ($) {
  var $body = $('body'),
    $hanPanel = $('#hidden-admin-notices-panel'),
    $hanToggleButton = $('#hidden-admin-notices-link'),
    $hanToggleButtonWrap = $('#hidden-admin-notices-link-wrap'),
    $screenMetaLinks = $('#screen-meta-links'),
    panelActiveBodyClass = 'hidden-admin-notices-panel-active';

  // Capture all notices because WP moves notices to after '.wp-header-end'.
  // See /wp-admin/js/common.js line #1083.
  $('.wp-header-end').wrap('<div id="hidden-admin-notices-notices-capture">');

  // Copy WP default screen meta links to conserve toggle button placement when expanded.
  $screenMetaLinks.clone().appendTo($hanToggleButtonWrap);

  // Add panel toggle event.
  $hanToggleButton.on('click', function () {
    if ($hanPanel.is(':visible')) {
      $hanPanel.slideUp('fast', function () {
        $body.removeClass(panelActiveBodyClass);
        $hanToggleButton.removeClass(panelActiveBodyClass)
          .attr('aria-expanded', false);
      });
    } else {
      $body.addClass(panelActiveBodyClass);
      $hanPanel.slideDown('fast', function () {
        this.focus();
        $hanToggleButton.addClass(panelActiveBodyClass)
          .attr('aria-expanded', true);
      });
    }
  });
})(jQuery);
