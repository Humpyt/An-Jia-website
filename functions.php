<?php
if (!defined('ABSPATH')) {
    exit;
}

// Include property post type
require_once get_template_directory() . '/setup-property-post-type.php';

// Include property features and taxonomies
require_once __DIR__ . '/setup-property-features.php';

// Include property duplication functionality
require_once get_template_directory() . '/setup-property-duplicate.php';

// Include custom field setups
require_once get_template_directory() . '/setup-property-fields.php';
require_once get_template_directory() . '/setup-amenities.php';
require_once get_template_directory() . '/setup-ai-description.php';
require_once get_template_directory() . '/setup-property-features.php';

// Include REST API endpoint for properties
require_once get_template_directory() . '/setup-property-api.php';

// Define DeepSeek API key
define('DEEPSEEK_API_KEY', getenv('DEEPSEEK_API_KEY'));

// Other functions can go here
