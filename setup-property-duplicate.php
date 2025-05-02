<?php
if (!defined('ABSPATH')) {
    exit;
}

// Add duplicate link to property actions
function add_duplicate_property_link($actions, $post) {
    if ($post->post_type === 'property') {
        $duplicate_url = wp_nonce_url(
            add_query_arg(
                array(
                    'action' => 'duplicate_property',
                    'post' => $post->ID,
                ),
                'admin-post.php'
            ),
            'duplicate_property_' . $post->ID
        );
        $actions['duplicate'] = sprintf(
            '<a href="%s">%s</a>',
            esc_url($duplicate_url),
            __('Duplicate Property')
        );
    }
    return $actions;
}
add_filter('post_row_actions', 'add_duplicate_property_link', 10, 2);

// Handle the duplication action
function handle_duplicate_property() {
    // Check if user has permissions
    if (!current_user_can('edit_posts')) {
        wp_die(__('You do not have permission to duplicate properties.'));
    }

    // Verify nonce
    if (!isset($_GET['post']) || !wp_verify_nonce($_REQUEST['_wpnonce'], 'duplicate_property_' . $_GET['post'])) {
        wp_die(__('Invalid request.'));
    }

    $post_id = absint($_GET['post']);
    $post = get_post($post_id);

    if (!$post) {
        wp_die(__('Property not found.'));
    }

    // Create duplicate post
    $new_post_args = array(
        'post_type' => $post->post_type,
        'post_title' => $post->post_title . ' (Copy)',
        'post_content' => $post->post_content,
        'post_excerpt' => $post->post_excerpt,
        'post_status' => 'draft',
        'post_author' => get_current_user_id(),
        'comment_status' => $post->comment_status,
        'ping_status' => $post->ping_status,
        'post_password' => $post->post_password,
        'menu_order' => $post->menu_order,
    );

    // Insert the new post
    $new_post_id = wp_insert_post($new_post_args);

    if ($new_post_id) {
        // Copy featured image
        $thumbnail_id = get_post_thumbnail_id($post_id);
        if ($thumbnail_id) {
            set_post_thumbnail($new_post_id, $thumbnail_id);
        }

        // Copy all meta fields
        $meta_keys = array(
            '_property_price',
            '_property_bedrooms',
            '_property_bathrooms',
            '_property_square_footage',
            '_is_featured',
            '_is_premium',
            '_property_location',
            '_payment_terms',
            '_property_gallery'
        );

        foreach ($meta_keys as $key) {
            $value = get_post_meta($post_id, $key, true);
            if ($value) {
                update_post_meta($new_post_id, $key, $value);
            }
        }

        // Copy taxonomies
        $taxonomies = array('neighborhood', 'property_type', 'price_range');
        foreach ($taxonomies as $taxonomy) {
            $terms = wp_get_object_terms($post_id, $taxonomy, array('fields' => 'ids'));
            if (!is_wp_error($terms)) {
                wp_set_object_terms($new_post_id, $terms, $taxonomy);
            }
        }

        // Copy gallery images
        $gallery = get_post_meta($post_id, '_property_gallery', true);
        if ($gallery) {
            update_post_meta($new_post_id, '_property_gallery', $gallery);
        }

        // Redirect to the edit page of the new property
        wp_redirect(admin_url('post.php?action=edit&post=' . $new_post_id));
        exit;
    } else {
        wp_die(__('Error creating duplicate property.'));
    }
}
add_action('admin_post_duplicate_property', 'handle_duplicate_property');

// Add bulk action option
function add_duplicate_bulk_action($bulk_actions) {
    $bulk_actions['duplicate'] = __('Duplicate');
    return $bulk_actions;
}
add_filter('bulk_actions-edit-property', 'add_duplicate_bulk_action');

// Handle bulk duplication
function handle_duplicate_bulk_action($redirect_to, $action, $post_ids) {
    if ($action !== 'duplicate') {
        return $redirect_to;
    }

    $duplicated = 0;
    foreach ($post_ids as $post_id) {
        $post = get_post($post_id);
        if (!$post || $post->post_type !== 'property') {
            continue;
        }

        // Create duplicate post
        $new_post_args = array(
            'post_type' => $post->post_type,
            'post_title' => $post->post_title . ' (Copy)',
            'post_content' => $post->post_content,
            'post_excerpt' => $post->post_excerpt,
            'post_status' => 'draft',
            'post_author' => get_current_user_id(),
            'comment_status' => $post->comment_status,
            'ping_status' => $post->ping_status,
            'post_password' => $post->post_password,
            'menu_order' => $post->menu_order,
        );

        $new_post_id = wp_insert_post($new_post_args);

        if ($new_post_id) {
            // Copy featured image
            $thumbnail_id = get_post_thumbnail_id($post_id);
            if ($thumbnail_id) {
                set_post_thumbnail($new_post_id, $thumbnail_id);
            }

            // Copy all meta fields
            $meta_keys = array(
                '_property_price',
                '_property_bedrooms',
                '_property_bathrooms',
                '_property_square_footage',
                '_is_featured',
                '_is_premium',
                '_property_location',
                '_payment_terms',
                '_property_gallery'
            );

            foreach ($meta_keys as $key) {
                $value = get_post_meta($post_id, $key, true);
                if ($value) {
                    update_post_meta($new_post_id, $key, $value);
                }
            }

            // Copy taxonomies
            $taxonomies = array('neighborhood', 'property_type', 'price_range');
            foreach ($taxonomies as $taxonomy) {
                $terms = wp_get_object_terms($post_id, $taxonomy, array('fields' => 'ids'));
                if (!is_wp_error($terms)) {
                    wp_set_object_terms($new_post_id, $terms, $taxonomy);
                }
            }

            // Copy gallery images
            $gallery = get_post_meta($post_id, '_property_gallery', true);
            if ($gallery) {
                update_post_meta($new_post_id, '_property_gallery', $gallery);
            }

            $duplicated++;
        }
    }

    $redirect_to = add_query_arg('duplicated', $duplicated, $redirect_to);
    return $redirect_to;
}
add_filter('handle_bulk_actions-edit-property', 'handle_duplicate_bulk_action', 10, 3);

// Show notice after bulk duplication
function duplicate_admin_notice() {
    if (!empty($_REQUEST['duplicated'])) {
        $duplicated = intval($_REQUEST['duplicated']);
        printf(
            '<div class="updated notice is-dismissible"><p>' .
            _n(
                '%s property duplicated successfully.',
                '%s properties duplicated successfully.',
                $duplicated
            ) . '</p></div>',
            $duplicated
        );
    }
}
add_action('admin_notices', 'duplicate_admin_notice');
