<?php
declare(strict_types=1);

namespace Hide_Admin_Notices;

use Github\Api\Issue;
use Github\Api\User;
use Github\Client;
use Hide_Admin_Notices;

class Options
{
    /**
     * @var Context $options
     */
    protected Context $context;

    public function __construct(Context $context)
    {
        $this->context = $context;
    }

    public function init()
    {
        $this->form_handler();
//        add_action('admin_init', array($this, 'register_settings'));
        add_action('admin_menu', array($this, 'add_options_page'));
    }

    public function add_options_page()
    {
        add_options_page(__('Hide Admin Notices', 'hide-admin-notices'), __('Hide Admin Notices', 'hide-admin-notices'), 'edit_posts', 'hide-admin-notices', array(
            $this,
            'render_settings_page'
        ));
    }

    public function render_settings_page()
    {
        $options = sprintf("<option value='' disabled selected>%s</option>", esc_html('Choose a plugin...', 'hide-admin-notices'));
        foreach (get_option('active_plugins') as $plugin) {
            $plugin_data = get_plugin_data(WP_PLUGIN_DIR . '/' . $plugin);
            $option = [
                'name' => $plugin_data['Name'],
                'version' => $plugin_data['Version'],
            ];
            $options .= sprintf("<option value='%1s'>%2s</option>", json_encode($option), $plugin_data['Name']);
        }
        ?>
        <div class="privacy-settings-header">
            <div class="privacy-settings-title-section">
                <h1><?php esc_html_e('Hide Admin Notices', 'hide-admin-notices'); ?></h1></div>
            <nav class="privacy-settings-tabs-wrapper hide-if-no-js" aria-label="Secondary menu">
                <a href="<?php echo esc_url(admin_url('options-general.php?page=hide-admin-notices')); ?>"
                   class="privacy-settings-tab active"
                   aria-current="true"><?php esc_html_e('Plugin Compatibility Request', 'hide-admin-notices'); ?></a>
                <a href="<?php echo esc_url(admin_url('options-general.php?page=hide-admin-notices&tab=something')); ?>"
                   class="privacy-settings-tab">Something</a>
            </nav>
        </div>
        <hr class="wp-header-end">
        <div class="privacy-settings-body hide-if-no-js">
            <h2><?php esc_html_e('Plugin Compatibility Request', 'hide-admin-notices'); ?></h2>
            <p>
                <strong><?php esc_html_e("Use this form to request compatibility with one of your installed plugins.", 'hide-admin-notices'); ?></strong>
            </p>
            <p><?php esc_html_e("Unfortunately, we have found that there are many plugins that do not adhere to the WordPress standard way to display admin notices, and with so many plugins available, we can't possibly test all plugins.", 'hide-admin-notices'); ?></p>
            <p><?php esc_html_e("So, if you let us know of a compatibility problem with a particular plugin, we will include support for it in the next version of Hide Admin Notices. Simply complete the form below, and we'll even let you know when the updated version is available.", 'hide-admin-notices'); ?></p>
            <hr>
            <form method="post" action="">
                <?php wp_nonce_field('hide-admin-notices-options'); ?>
                <input type="hidden" name="action" value="compatibility-request"/>
                <table class="form-table" role="presentation">
                    <tbody>
                    <tr>
                        <th scope="row"><label
                                for="hide-admin-notices-options[plugin]"><?php esc_html_e('Compatibility request for?', 'hide-admin-notices'); ?></label>
                        </th>
                        <td>
                            <select name="compatibility_request[plugin]"
                                    id="compatibility_request[plugin]"><?php echo $options; ?></select>
                            <p class="description">
                                <?php esc_html_e('These are your installed and active plugins.', 'hide-admin-notices'); ?>
                                <br>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label
                                for="compatibility_request[comments]"><?php esc_html_e('Can you describe the compatibility problem?', 'hide-admin-notices'); ?></label>
                        </th>
                        <td>
                            <textarea rows="5" cols="50" name="compatibility_requests[comments]"
                                      id="compatibility_request[comments]"></textarea>
                            <p class="description">
                                <?php esc_html_e('Please describe the problem(s) that occur(s) and when, including any relevant pages.', 'hide-admin-notices'); ?>
                                <br>
                                <?php esc_html_e('The more information you can give, the more it will help us. 👍', 'hide-admin-notices'); ?>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label
                                for="compatibility_request[notify]"><?php esc_html_e('Would you like to be notified when resolved?', 'hide-admin-notices'); ?></label>
                        </th>
                        <td>
                            <input type="checkbox" name="compatibility_request[notify]"
                                   id="compatibility_request[notify]"></input>
                            <p class="description"><?php esc_html_e('We will drop you an email when the updated version is available.', 'hide-admin-notices'); ?></p>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <?php esc_html_e('The data that you send will be completely anonymous. However, if you check the notification checkbox, you agree to also send the name and email address of the current user account — this data will be used solely for notification purposes.', 'hide-admin-notices'); ?>
                <p class="submit"><?php submit_button(__('Send'), 'primary', 'compatibility_request[send]', false); ?></p>
            </form>
        </div>
        <?php
    }

    public function register_settings()
    {
        $section = 'gist_importer_options_section';
        add_settings_section(
            $section,
            __('Settings', 'hide-admin-notices'),
            '__return_false',
            Hide_Admin_Notices::OPTIONS_NAME,
        );

        register_setting(
            Hide_Admin_Notices::OPTIONS_NAME,
            Hide_Admin_Notices::OPTIONS_NAME,
            array(
                'type' => 'array',
                'sanitize_callback' => array($this, 'validate_options'),
                'default' => Hide_Admin_Notices::OPTIONS_NAME,
            )
        );

        add_settings_field(
            'post_type',
            __('Post type', 'hide-admin-notices'),
            array($this, 'render_post_type_settings_field'),
            Hide_Admin_Notices::OPTIONS_NAME,
            $section,
        );

        add_settings_field(
            'username',
            __('Username', 'hide-admin-notices'),
            array($this, 'render_username_settings_field'),
            Hide_Admin_Notices::OPTIONS_NAME,
            $section,
        );
    }

    public function validate_options($options)
    {
        $result = array_filter($options, function ($value) {
            return !empty($value);
        });

        return $result;
    }

    public function render_post_type_settings_field()
    {
        $this->render_field('sync_post_type', 'The name of the post type to import Gists to.');
    }

    public function render_username_settings_field()
    {
        $this->render_field('sync_username', 'The username of the GitHub user to import Gists from.');
    }

    public function render_field($field, $description)
    {
        $value = $this->context->get($field);
        $field = Hide_Admin_Notices::OPTIONS_NAME . "[$field]";
        ?>
        <label>
        <input type="text" name="<?php echo $field; ?>" value="<?php echo esc_attr($value); ?>">
        <p class="description"><?php esc_html_e($description, 'hide-admin-notices'); ?></p>
        </label><?php
    }

    private function form_handler()
    {
        $action = isset($_POST['action']) ? $_POST['action'] : '';
        if ($action === 'compatibility-request') {
            $this->send_compatibility_request();
        }
    }

    private function send_compatibility_request(): bool
    {
        $to = 'jira@pontetlabs.atlassian.net';
        $subject = 'Plugin Compatibility Request';
        $body = '';
        $result = wp_mail($to, $subject, $body);
    }
}