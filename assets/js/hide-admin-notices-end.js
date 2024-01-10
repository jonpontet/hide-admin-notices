/* global jQuery */
// Support for jQuery v3.6.0 for WordPress v5.9.8+.
(function ($) {
  var $body = $('body'),
    $hanPanel = $('#hidden-admin-notices-panel'),
    hanActiveBodyClass = 'hidden-admin-notices-active';

  // Move notices to han panel.
  $('#hidden-admin-notices-notices-capture > *').each(function () {
      $(this)
        .detach()
        .appendTo($hanPanel);
    }
  );

  // Activate HAN if notices have been captured.
  if ($hanPanel.find('> *').length) {
    $body.addClass(hanActiveBodyClass);
  }
})(jQuery);
