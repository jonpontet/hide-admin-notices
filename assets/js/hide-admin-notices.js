/* global jQuery, hideAdminNoticesVars */
// Support for jQuery v3.6.0 for WordPress v5.9.8+.
(function ($) {
  let $document = $(document),
    $body = $('body'),
    $hanPanel = $('#hidden-admin-notices-panel'),
    $hanPanelWrap = $('#hidden-admin-notices-panel-wrap'),
    $hanToggleButton = $('#hidden-admin-notices-link'),
    $hanToggleButtonWrap = $('#hidden-admin-notices-link-wrap'),
    $screenMetaLinks = $('#screen-meta-links'),
    $wpHeaderEnd = $('.wp-header-end'),
    $wpUpdateNag = $(hideAdminNoticesVars.updateNagSelector),
    captureId = 'hidden-admin-notices-capture',
    activeBodyClass = 'hidden-admin-notices-active',
    panelActiveClass = 'hidden-admin-notices-panel-active';

  // Wrap a capture element around ".wp-header-end" if it exists.
  $wpHeaderEnd.wrap('<div id="' + captureId + '">');

  // Include the update nag.
  $wpUpdateNag.detach().prependTo('#' + captureId);

  // Run after common.js.
  $(function () {
    let $notices;

    // Cater for admin pages:
    // 1) with the ".wp-header-end" element, and messages are moved to after that;
    // 2) without ".wp-header-end", and messages are  moved after the first ".wrap h1" or ".wrap h2".
    if ($wpHeaderEnd.length) {
      // Ignore: the '.wp-header-end' element itself; and '#message' elements (excluding woocommerce specific messages).
      $notices = $('#' + captureId + ' > *')
        .not('.wp-header-end')
        .not('#message:not(.woocommerce-message)');
    } else {
      // This matches /wp-admin/js/common.js line #1083.
      $notices = $('div.updated, div.error, div.notice', '.wrap').not('.inline, .below-h2');
    }

    init($notices);
  });

  function init($notices) {

    if (!$notices.length) {
      return;
    }

    // Activate HAN.
    $body.addClass(activeBodyClass);

    // Move notices to han panel.
    $notices.each(function () {
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
          $body.removeClass(panelActiveClass);
          $hanToggleButton.attr('aria-expanded', false);
          $hanPanelWrap.hide();
          $hanPanel.addClass('hidden');
        });
      } else {
        $body.addClass(panelActiveClass);
        $hanPanelWrap.show();
        $hanPanel.slideDown('fast', function () {
          $hanPanel
            .addClass('hidden')
            .trigger('focus');
          $hanToggleButton.attr('aria-expanded', true);
        });
      }
    });

    // Hide HAN panel when Screen Options or Help tab is open.
    $document.on('screen:options:open', function () {
      $hanToggleButtonWrap.fadeOut('fast', function () {
        $(this).css('visibility', 'hidden');
      });
    }).on('screen:options:close', function () {
      $hanToggleButtonWrap.fadeIn('fast', function () {
        $(this).css('visibility', '');
      });
    });
  }
})(jQuery);
