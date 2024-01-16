/* global jQuery, hideAdminNoticesVars */
// Support for jQuery v3.6.0 for WordPress v5.9.8+.
(function ($) {
  let $wpHeaderEnd = $(hideAdminNoticesVars.wpHeaderEndSelector),
    $wpUpdateNag = $(hideAdminNoticesVars.updateNagSelector);

  // Capture all notices because WP moves notices to after '.wp-header-end'.
  // See /wp-admin/js/common.js line #1083.
  $wpHeaderEnd.wrap('<div id="' + hideAdminNoticesVars.captureId + '">');

  // Include the update nag.
  $wpUpdateNag.detach().prependTo('#' + hideAdminNoticesVars.captureId);
})(jQuery);
