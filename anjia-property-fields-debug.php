<?php
/**
 * Plugin Name: An Jia Property Fields Debug
 * Description: Adds a debug endpoint to show all ACF fields for properties
 * Version: 1.0
 * Author: An Jia Development Team
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Register debug endpoint for REST API
add_action('rest_api_init', function() {
    register_rest_route('anjia/v1', '/property-fields-debug', array(
        'methods'             => 'GET',
        'callback'            => 'anjia_debug_property_fields',     
        'permission_callback' => '__return_true',
    ));
});

function anjia_debug_property_fields(WP_REST_Request $request) {
    // Get a single property
    $args = array(
        'post_type'      => 'property',
        'post_status'    => 'publish',
        'posts_per_page' => 1,
    );
    
    $query = new WP_Query($args);
    $debug_info = array();
    
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $post_id = get_the_ID();
            
            // Get all ACF fields for this post
            $fields = get_fields($post_id);
            
            // Basic post info
            $debug_info['post_info'] = array(
                'id' => $post_id,
                'title' => get_the_title(),
                'content' => get_the_content(),
                'excerpt' => get_the_excerpt(),
                'permalink' => get_permalink(),
                'featured_image' => get_the_post_thumbnail_url(null, 'large'),
            );
            
            // All ACF fields
            $debug_info['acf_fields'] = $fields;
            
            // Specific fields we're looking for
            $debug_info['specific_fields'] = array(
                'location' => array(
                    'property_location' => get_field('property_location', $post_id),
                    'location' => get_field('location', $post_id),
                ),
                'bedrooms' => array(
                    'property_bedrooms' => get_field('property_bedrooms', $post_id),
                    'bedrooms' => get_field('bedrooms', $post_id),
                ),
                'bathrooms' => array(
                    'property_bathrooms' => get_field('property_bathrooms', $post_id),
                    'bathrooms' => get_field('bathrooms', $post_id),
                ),
                'price' => array(
                    'property_price' => get_field('property_price', $post_id),
                    'price' => get_field('price', $post_id),
                ),
                'currency' => array(
                    'property_currency' => get_field('property_currency', $post_id),
                    'currency' => get_field('currency', $post_id),
                ),
                'amenities' => array(
                    'property_amenities' => get_field('property_amenities', $post_id),
                    'amenities' => get_field('amenities', $post_id),
                ),
                'property_type' => array(
                    'property_type' => get_field('property_type', $post_id),
                ),
                'images' => array(
                    'property_gallery' => get_field('property_gallery', $post_id),
                    'gallery' => get_field('gallery', $post_id),
                    'images' => get_field('images', $post_id),
                ),
            );
            
            // Meta fields (non-ACF)
            $meta_keys = get_post_custom_keys($post_id);
            $meta_values = array();
            
            if ($meta_keys) {
                foreach ($meta_keys as $key) {
                    // Skip internal WordPress meta
                    if (substr($key, 0, 1) !== '_') {
                        $meta_values[$key] = get_post_meta($post_id, $key, true);
                    }
                }
            }
            
            $debug_info['meta_fields'] = $meta_values;
        }
        wp_reset_postdata();
    } else {
        return new WP_REST_Response(array(
            'error' => 'No properties found',
        ), 404);
    }
    
    return new WP_REST_Response($debug_info, 200);
}
