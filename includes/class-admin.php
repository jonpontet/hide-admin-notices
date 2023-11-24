<?php

declare( strict_types=1 );

namespace Hide_Admin_Notices;

use Hide_Admin_Notices;

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://pontetlabs.com
 * @since      1.0.0
 *
 * @package    Hide_Admin_Notices
 * @subpackage Hide_Admin_Notices/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * @package    Hide_Admin_Notices
 * @subpackage Hide_Admin_Notices/admin
 * @author     PontetLabs <hi@pontetlabs.com>
 */
class Admin {

  private const DONATE_LINK = 'https://www.buymeacoffee.com/pontetlabs';

  private const RATE_LINK = 'https://wordpress.org/support/plugin/hide-admin-notices/reviews/#new-post';

  /**
   * Register the CSS and JavaScript for the admin area.
   *
   * @since    1.0.0
   */
  public function enqueue_scripts() {
    $minified = '.min';
    if ( defined( 'WP_DEBUG' ) && WP_DEBUG === true ) {
      $minified = '';
    }
    wp_enqueue_style( Hide_Admin_Notices::PLUGIN_NAME,
      HIDE_ADMIN_NOTICES_BASEURL . 'assets/css/hide-admin-notices' . $minified . '.css',
      [], Hide_Admin_Notices::VERSION );
    wp_register_script( Hide_Admin_Notices::PLUGIN_NAME,
      HIDE_ADMIN_NOTICES_BASEURL . 'assets/js/hide-admin-notices' . $minified . '.js',
      array( 'jquery' ),
        Hide_Admin_Notices::VERSION, true );
    wp_enqueue_script( Hide_Admin_Notices::PLUGIN_NAME );
  }

  /**
   * Modify plugin row meta.
   *
   * @since    1.0.0
   */
  public function plugin_row_meta( $links, $file ) {
    if ( HIDE_ADMIN_NOTICES_BASENAME === $file ) {
      $row_meta = array(
        'donate' => '<a target="_blank" href="' . esc_url( self::DONATE_LINK ) .
                    '" aria-label="' . esc_attr__( 'Donate a $1', 'hide-admin-notices' ) .
                    '">' . esc_html__( 'Donate a $1', 'hide-admin-notices' ) . '</a>',
      );

      return array_merge( $links, $row_meta );
    }

    return (array) $links;
  }

  /**
   * Modify plugin actions.
   *
   * @param $links
   *
   * @return array
   * @since    1.2.0
   *
   */
  public function plugin_action_links( $links ) {
    $rate_link = array(
      'rate' => '<a target="_blank" href="' . esc_url( self::RATE_LINK ) .
                '" aria-label="' . esc_attr__( 'Like it?', 'hide-admin-notices' ) .
                '">' . esc_html__( 'Like it?', 'hide-admin-notices' ) . '</a>',
    );

    return array_merge( $links, $rate_link );
  }

  /**
   * Attach the active class to the page body.
   *
   * @return string
   */
  public function admin_body_class($admin_body_class) {
    $classes   = explode( ' ', trim( $admin_body_class ) );
    $classes[] = 'hidden-admin-notices-active';
    $admin_body_class = implode( ' ', array_unique( $classes ) );
    return " $admin_body_class ";
  }

  /**
   * Plugin placeholder elements.
   *
   * @return string
   */
  public function admin_notices() {
    ?>
    <div id="hidden-admin-notices-panel" class="hidden" tabindex="-1"
         aria-label="<?php echo esc_attr__( 'Notifications Tab', 'hide-admin-notices' ); ?> "></div>
    <div id="hidden-admin-notices-link-wrap" class="hide-if-no-js">
      <button type="button" id="hidden-admin-notices-link"
              class="button" aria-controls="hidden-admin-notices-panel" aria-expanded="false">
        <span class="hidden-admin-notices-link-icon" aria-hidden="true"></span>
        <span class="hidden-admin-notices-link-text-show"
          aria-label="<?php echo esc_html__( 'Show Notices', 'hide-admin-notices' ); ?>"><?php echo esc_html__( 'Show Notices', 'hide-admin-notices' ); ?></span>
        <span class="hidden-admin-notices-link-text-hide"
          aria-label="<?php echo esc_html__( 'Hide Notices', 'hide-admin-notices' ); ?>"><?php echo esc_html__( 'Hide Notices', 'hide-admin-notices' ); ?></span>
      </button>
    </div>
    <?php
  }
}