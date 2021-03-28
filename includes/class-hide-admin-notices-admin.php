<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://theeasyweb.co
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
 * @author     The Easy Web Co. <hello@theeasyweb.co>
 */
class Hide_Admin_Notices_Admin {

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
    wp_enqueue_style( HIDE_ADMIN_NOTICES_NAME,
      HIDE_ADMIN_NOTICES_BASEURL . 'assets/css/hide-admin-notices' . $minified . '.css',
      [], HIDE_ADMIN_NOTICES_VERSION );
    wp_register_script( HIDE_ADMIN_NOTICES_NAME,
      HIDE_ADMIN_NOTICES_BASEURL . 'assets/js/hide-admin-notices' . $minified . '.js',
      array( 'jquery' ),
      HIDE_ADMIN_NOTICES_VERSION, true );
    wp_enqueue_script( HIDE_ADMIN_NOTICES_NAME );
  }

  /**
   * Modify plugin row meta.
   *
   * @since    1.0.0
   */
  public function plugin_row_meta( $links, $file ) {
    if ( HIDE_ADMIN_NOTICES_BASENAME === $file ) {
      $row_meta = array(
        'donate' => '<a target="_blank" href="' . esc_url( HIDE_ADMIN_NOTICES_RATE_LINK ) .
                    '" aria-label="' . esc_attr__( 'Leave a rating', 'hide-admin-notices' ) .
                    '">' . esc_html__( 'Leave a rating »', 'hide-admin-notices' ) . '</a>',
      );

      return array_merge( $links, $row_meta );
    }

    return (array) $links;
  }

  /**
   * Plugin placeholder elements.
   *
   * @return string
   */
  public function admin_notices() {
    ?>
    <div id="hidden-admin-notices-panel" class="hidden" tabindex="-1"
         aria-label="<?php echo esc_attr__( 'Leave a rating', 'hide-admin-notices' ); ?> "></div>
    <div id="hidden-admin-notices-link-wrap" class="hide-if-no-js">
      <button type="button" id="hidden-admin-notices-link"
              class="button" aria-controls="hidden-admin-notices-panel" aria-expanded="false">
        <span><?php echo esc_html__( 'Show Notices', 'hide-admin-notices' ); ?></span>
        <span><?php echo esc_html__( 'Hide Notices', 'hide-admin-notices' ); ?></span></button>
    </div>
    <?php
  }
}