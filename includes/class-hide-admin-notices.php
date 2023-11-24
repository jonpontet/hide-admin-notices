<?php

/**
 * @link       https://pontetlabs.com
 * @since      1.0.0
 *
 * @package    Hide_Admin_Notices
 * @subpackage Hide_Admin_Notices/includes
 */

use Hide_Admin_Notices\Context;
use Hide_Admin_Notices\Admin;
use Hide_Admin_Notices\Loader;
use Hide_Admin_Notices\Options;

/**
 * @since      1.0.0
 * @package    Hide_Admin_Notices
 * @subpackage Hide_Admin_Notices/includes
 * @author     PontetLabs <hi@pontetlabs.com>
 */
class Hide_Admin_Notices {

    /**
     * The unique identifier of this plugin.
     *
     * @since    1.0.0
     * @access   protected
     * @var      string $plugin_name The string used to uniquely identify this plugin.
     */
    const PLUGIN_NAME = 'hide-admin-notices';

    const OPTIONS_NAME = 'hide-admin-notices-options';

    /**
     * The current version of the plugin.
     *
     * @since    1.0.0
     * @access   protected
     * @var      string $version The current version of the plugin.
     */
    const VERSION = '1.2.2';

    /**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      Loader $loader Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

    private $context;

    private $config = array();

	/**
	 * Initialize the class.
	 *
	 * @since    1.0.0
	 */
	public function __construct() {
		$this->define_constants();
		$this->load_dependencies();
		$this->set_locale();
		$this->define_admin_hooks();
	}

	/**
	 * Define plugin constants.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_constants() {
		define( 'HIDE_ADMIN_NOTICES_ABSPATH', dirname( HIDE_ADMIN_NOTICES_PLUGIN_FILE ) . '/' );
		define( 'HIDE_ADMIN_NOTICES_BASENAME', plugin_basename( HIDE_ADMIN_NOTICES_PLUGIN_FILE ) );
		define( 'HIDE_ADMIN_NOTICES_BASEURL', plugin_dir_url( HIDE_ADMIN_NOTICES_PLUGIN_FILE ) );
	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function load_dependencies() {
        require_once HIDE_ADMIN_NOTICES_ABSPATH . 'includes/class-loader.php';
		require_once HIDE_ADMIN_NOTICES_ABSPATH . 'includes/class-context.php';
        require_once HIDE_ADMIN_NOTICES_ABSPATH . 'includes/class-options.php';
		require_once HIDE_ADMIN_NOTICES_ABSPATH . 'includes/class-admin.php';

		$this->loader = new Loader();
		$this->context = new Context( $this->config );
		$options = new Options( $this->context );
        $options->init();
	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function set_locale() {
		$this->loader->add_action( 'plugins_loaded', $this, 'load_plugin_textdomain' );
	}

	/**
	 * Register all of the hooks related to the admin area.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_admin_hooks() {
		$plugin_admin = new Admin();
		$this->loader->add_action( 'plugin_row_meta', $plugin_admin, 'plugin_row_meta', 20, 2 );
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts', 1 );
		$this->loader->add_action( 'admin_notices', $plugin_admin, 'admin_notices', PHP_INT_MIN );
		$this->loader->add_filter( 'plugin_action_links_' . HIDE_ADMIN_NOTICES_BASENAME, $plugin_admin, 'plugin_action_links' );
	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since    1.0.0
	 */
	public function run() {
		$this->loader->run();
	}

    /**
     * Load the plugin text domain for translation.
     *
     * @since    2.0.0
     */
    public function load_plugin_textdomain() {
        load_plugin_textdomain(
            'hide-admin-notices',
            false,
            HIDE_ADMIN_NOTICES_ABSPATH . 'languages/'
        );
    }
}
