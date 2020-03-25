<?php 
/*
    Plugin Name: Hide Admin Notices
    Description: Plugin to Hide Admin Notices
    Version: 1.0.0
    Author: Hetal
    Text Domain: hide-admin-notices
*/

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/*
   Plugin Version 1.0.0
*/
define( 'Hide_Admin_Notices_VERSION', '1.0.0' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-hide-admin-notices.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_hide_admin_notices () {
	$plugin = new Hide_Admin_Notices();
	$plugin->run();
}
run_hide_admin_notices();
?>