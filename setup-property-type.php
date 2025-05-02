<?php
/**
 * An Jia Property Post Type Setup
 * 
 * This script ensures the Property custom post type is properly registered with REST API support.
 * Place this file in your WordPress plugins directory and activate it as a plugin.
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    die('Direct access not allowed');
}

// Register the Property post type
function anjia_register_property_post_type() {
    $labels = array(
        'name'                  => _x('Properties', 'Post type general name', 'anjia'),
        'singular_name'         => _x('Property', 'Post type singular name', 'anjia'),
        'menu_name'            => _x('Properties', 'Admin Menu text', 'anjia'),
        'add_new'              => _x('Add New', 'property', 'anjia'),
        'add_new_item'         => __('Add New Property', 'anjia'),
        'edit_item'            => __('Edit Property', 'anjia'),
        'new_item'             => __('New Property', 'anjia'),
        'view_item'            => __('View Property', 'anjia'),
        'search_items'         => __('Search Properties', 'anjia'),
        'not_found'            => __('No properties found', 'anjia'),
        'not_found_in_trash'   => __('No properties found in Trash', 'anjia'),
    );

    $args = array(
        'labels'             => $labels,
        'public'             => true,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'query_var'          => true,
        'rewrite'            => array('slug' => 'property'),
        'capability_type'    => 'post',
        'has_archive'        => true,
        'hierarchical'       => false,
        'menu_position'      => 5,
        'menu_icon'          => 'dashicons-building',
        'supports'           => array('title', 'editor', 'thumbnail', 'custom-fields'),
        // These are critical for REST API support
        'show_in_rest'       => true,
        'rest_base'          => 'property',
        'rest_controller_class' => 'WP_REST_Posts_Controller',
    );

    register_post_type('property', $args);
}
add_action('init', 'anjia_register_property_post_type');

// Register custom REST field for property meta
function anjia_register_property_meta() {
    register_rest_field('property', 'property_meta', array(
        'get_callback' => 'anjia_get_property_meta',
        'schema' => array(
            'description' => 'Property metadata',
            'type'        => 'object',
            'context'     => array('view', 'edit'),
        ),
    ));
}
add_action('rest_api_init', 'anjia_register_property_meta');

// Callback to get property meta
function anjia_get_property_meta($object) {
    $post_id = $object['id'];
    return array(
        'location'       => get_field('location', $post_id),
        'floor'         => get_field('floor', $post_id),
        'bedrooms'      => get_field('bedrooms', $post_id),
        'units'         => get_field('units', $post_id),
        'price'         => get_field('price', $post_id),
        'currency'      => get_field('currency', $post_id),
        'payment_terms' => get_field('payment_terms', $post_id),
        'amenities'     => get_field('property_amenities', $post_id),
        'owner_name'    => get_field('owner_name', $post_id),
        'owner_contact' => get_field('owner_contact', $post_id),
        'google_pin'    => get_field('google_pin', $post_id),
        'is_premium'    => get_field('is_premium', $post_id),
        'property_type' => get_field('property_type', $post_id),
        'square_meters' => get_field('square_meters', $post_id),
    );
}

// Add test endpoint to verify setup
add_action('rest_api_init', function () {
    register_rest_route('anjia/v1', '/test', array(
        'methods' => 'GET',
        'callback' => function () {
            return array(
                'status' => 'ok',
                'message' => 'An Jia property post type is properly configured',
                'post_type_exists' => post_type_exists('property'),
                'rest_enabled' => true,
                'acf_enabled' => function_exists('get_field'),
                'property_count' => wp_count_posts('property')->publish,
            );
        },
        'permission_callback' => '__return_true'
    ));
});
