/* global jQuery, hideAdminNoticesVars */
// Support for jQuery v3.6.0 for WordPress v5.9.8+.
(function ($) {
  var $hanPanel = $(hideAdminNoticesVars.panelSelector);

  // Move notices to han panel.
  $('#' + hideAdminNoticesVars.captureId + ' > *').each(function () {
      $(this)
        .detach()
        .appendTo($hanPanel);
    }
  );

  // Activate HAN if notices have been captured.
  if ($hanPanel.find('> *').length) {
    $('body').addClass(hideAdminNoticesVars.activeBodyClass);
  }
})(jQuery);
