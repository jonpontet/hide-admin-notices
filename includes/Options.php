<?php
declare(strict_types=1);

namespace Pontet_Labs\Hide_Admin_Notices;

use Twig\Environment;
use Twig\Loader\FilesystemLoader;

class Options
{
    private const COMPATIBILITY_REQUEST_EMAIL_RECIPIENT = 'jira@pontetlabs.atlassian.net';

    private const COMPATIBILITY_REQUEST_EMAIL_SUBJECT = 'Plugin Compatibility Request';

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
        add_action('admin_menu', array($this, 'add_options_page'));
        add_action('plugins_loaded', array($this, 'form_handler'));
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
        /**
         * [
         *  'id' => 'version'
         * ]
         */
        $compatibility_requests = $this->context->get('compatibility_requests');
        $options = sprintf("<option value='' disabled selected>%s</option>", esc_html__('Choose a plugin...', 'hide-admin-notices'));
        $compatibility_requests = array(
            'hide-admin-notices' => '2.0',
        );
        foreach (get_option('active_plugins') as $plugin) {
            $plugin_data = get_plugin_data(WP_PLUGIN_DIR . '/' . $plugin);
            $plugin_id = substr($plugin, 0, strpos($plugin, '/'));
            $plugin_version = $plugin_data['Version'];
            $option = [
                'path' => $plugin,
                'version' => $plugin_version,
            ];
            // Disable the option for this plugin if a request has already been sent for it.
            $disabled_attribute = '';
            $name_suffix = '';
            if (isset($compatibility_requests[$plugin_id])
                && $plugin_version == $compatibility_requests[$plugin_id]) {
                $disabled_attribute = ' disabled';
                $name_suffix = " - already sent for version $plugin_version ✓";
            }
            $options .= sprintf("<option value='%1s'%2s>%3s%4s</option>", json_encode($option), $disabled_attribute, $plugin_data['Name'], $name_suffix);
        }
        ?>
        <div class="privacy-settings-header">
            <div class="privacy-settings-title-section">
                <h1><?php esc_html_e('Hide Admin Notices', 'hide-admin-notices'); ?></h1>
            </div>
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
                            <select name="hide-admin-notices-options[plugin]"
                                    id="hide-admin-notices-options[plugin]"><?php echo $options; ?></select>
                            <p class="description">
                                <?php esc_html_e('These are your installed and active plugins.', 'hide-admin-notices'); ?>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label
                                for="hide-admin-notices-options[comments]"><?php esc_html_e('Can you describe the compatibility problem?', 'hide-admin-notices'); ?></label>
                        </th>
                        <td>
                            <textarea rows="5" cols="50" name="hide-admin-notices-options[comments]"
                                      id="hide-admin-notices-options[comments]"></textarea>
                            <p class="description">
                                <?php esc_html_e('Please describe the problem(s) that occur(s) and when, including any relevant pages.', 'hide-admin-notices'); ?>
                                <br>
                                <?php esc_html_e('The more information you can give, the more it will help us. 👍', 'hide-admin-notices'); ?>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label
                                for="hide-admin-notices-options[notify]"><?php esc_html_e('Would you like to be notified when resolved?', 'hide-admin-notices'); ?></label>
                        </th>
                        <td>
                            <input type="checkbox" name="hide-admin-notices-options[notify]"
                                   id="hide-admin-notices-options[notify]"></input>
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

    public function form_handler()
    {
        $action = isset($_POST['action']) ? $_POST['action'] : '';
        if ($action === 'compatibility-request') {
            $this->send_compatibility_request($_POST['hide-admin-notices-options']);
            $this->update_compatibility_requests();
        }
    }

    private function send_compatibility_request($options): bool
    {
        if (!isset($options['plugin'])) {
            //error
        }
        $plugin = json_decode($options['plugin']);
        $plugin_data = \get_plugin_data(WP_PLUGIN_DIR . '/' . $plugin->path);
        $plugin_name = $plugin_data['Name'];
        $comments = $options['comments'] ?? '';
        $notify = $options['notify'] ?? '';
        $user_name = '';
        $user_email = '';
        if ($notify) {
            $user = wp_get_current_user();
            $user_name = $user->user_nicename;
            $user_email = $user->user_email;
        }
        $loader = new FilesystemLoader(HIDE_ADMIN_NOTICES_DIR . 'templates');
        $twig = new Environment($loader);
        $body = $twig->render('compatibility-request-email.html.twig', array(
            'plugin_name' => $plugin_name,
            'plugin_version' => $plugin->version,
            'comments' => $comments,
            'notify' => $notify,
            'user_name' => $user_name,
            'user_email' => $user_email,
        ));
        $result = wp_mail(self::COMPATIBILITY_REQUEST_EMAIL_RECIPIENT, self::COMPATIBILITY_REQUEST_EMAIL_SUBJECT, $body);
        var_dump($result);
        return $result;
    }

    private function update_compatibility_requests()
    {

//    update_option('compatibility_requests', );
    }
}