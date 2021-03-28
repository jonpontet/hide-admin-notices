/* global jQuery */
(function ($) {
  var $body = $('body'),
    $allAdminNotices = $('#wpbody-content>div.error:visible,' +
      '#wpbody-content>div.updated:visible,' +
      '#wpbody-content>div.notice:visible,' +
      '#wpbody-content>div.update-nag:visible,' +
      '#wpbody-content>div#message:visible,' +
      '#wpbody-content>div#wpse1_2023_complete,' + // WP Clone
      '#wpbody-content>div.ctf_notice,' + // Custom Twitter Feeds
      '#wpbody-content>div.wpstg_fivestar' // WP Stage
    ), $hanPanel = $('#hidden-admin-notices-panel'),
    $hanToggleButton = $('#hidden-admin-notices-link');

  // Always run for WooCommerce pages
  // Or do not run if no applicable notices
  if (!$body.hasClass('woocommerce-embed-page') &&
    !$allAdminNotices.length) {
    return;
  }

  // Immediately add active mode class
  $body.addClass('hidden-admin-notices-active');

  // Start by moving standard notices
  $allAdminNotices.detach().appendTo($hanPanel).show();

  $hanToggleButton.on('click', function () {
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

  // On document ready
  $(function () {
    // Monitor notices which get moved to .wrap
    var startTime = new Date().getTime(),
      interval = setInterval(function () {
        // Stop monitoring after 5 seconds
        if (new Date().getTime() - startTime > 5000) {
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
  })
})(jQuery);
