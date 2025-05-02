<?php
// ** Database settings ** //
define('DB_NAME', 'anjia_db');
define('DB_USER', 'anjia_user');
define('DB_PASSWORD', 'your_password_here');
define('DB_HOST', 'localhost');
define('DB_CHARSET', 'utf8mb4');
define('DB_COLLATE', '');

// ** Authentication Unique Keys and Salts ** //
define('AUTH_KEY',         'put your unique phrase here');
define('SECURE_AUTH_KEY',  'put your unique phrase here');
define('LOGGED_IN_KEY',    'put your unique phrase here');
define('NONCE_KEY',        'put your unique phrase here');
define('AUTH_SALT',        'put your unique phrase here');
define('SECURE_AUTH_SALT', 'put your unique phrase here');
define('LOGGED_IN_SALT',   'put your unique phrase here');
define('NONCE_SALT',       'put your unique phrase here');

// ** DeepSeek API Configuration ** //
define('DEEPSEEK_API_KEY', 'sk-de1e05e92ed048d597ae24e64deb34c6');

// ** WordPress Database Table prefix ** //
$table_prefix = 'wp_';

// ** WordPress debugging mode ** //
define('WP_DEBUG', false);

// ** Absolute path to the WordPress directory ** //
if (!defined('ABSPATH')) {
    define('ABSPATH', dirname(__FILE__) . '/');
}

// ** Sets up WordPress vars and included files ** //
require_once(ABSPATH . 'wp-settings.php');
