<?php
/**
 * Plugin Name: An Jia Properties Endpoint
 * Description: Adds a custom REST API endpoint for properties with filtering
 * Version: 1.0
 * Author: An Jia Development Team
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Register properties endpoint for REST API
add_action('rest_api_init', function() {
    register_rest_route('anjia/v1', '/properties', array(
        'methods'             => 'GET',
        'callback'            => 'anjia_get_properties',     
        'permission_callback' => '__return_true',
    ));
});

function anjia_get_properties(WP_REST_Request $request) {    
    // Get query parameters
    $page = isset($request['page']) ? intval($request['page']) : 1;
    $per_page = isset($request['per_page']) ? intval($request['per_page']) : 12;
    $location = isset($request['location']) ? sanitize_text_field($request['location']) : '';
    $min_price = isset($request['min_price']) ? intval($request['min_price']) : 0;
    $max_price = isset($request['max_price']) ? intval($request['max_price']) : 0;
    $bedrooms = isset($request['bedrooms']) ? sanitize_text_field($request['bedrooms']) : '';
    $bathrooms = isset($request['bathrooms']) ? sanitize_text_field($request['bathrooms']) : '';
    $property_type = isset($request['property_type']) ? sanitize_text_field($request['property_type']) : '';
    
    // Build meta query
    $meta_query = array('relation' => 'AND');
    
    // Add location filter
    if (!empty($location)) {
        $meta_query[] = array(
            'key'     => 'property_location',
            'value'   => $location,
            'compare' => 'LIKE',
        );
    }
    
    // Add price range filters
    if ($min_price > 0) {
        $meta_query[] = array(
            'key'     => 'property_price',
            'value'   => $min_price,
            'compare' => '>=',
            'type'    => 'NUMERIC',
        );
    }
    
    if ($max_price > 0) {
        $meta_query[] = array(
            'key'     => 'property_price',
            'value'   => $max_price,
            'compare' => '<=',
            'type'    => 'NUMERIC',
        );
    }
    
    // Add bedrooms filter
    if (!empty($bedrooms)) {
        $meta_query[] = array(
            'key'     => 'property_bedrooms',
            'value'   => $bedrooms,
            'compare' => '=',
        );
    }
    
    // Add bathrooms filter
    if (!empty($bathrooms)) {
        $meta_query[] = array(
            'key'     => 'property_bathrooms',
            'value'   => $bathrooms,
            'compare' => '=',
        );
    }
    
    // Add property type filter
    if (!empty($property_type)) {
        $meta_query[] = array(
            'key'     => 'property_type',
            'value'   => $property_type,
            'compare' => '=',
        );
    }
    
    // Build query args
    $args = array(
        'post_type'      => 'property',
        'post_status'    => 'publish',
        'posts_per_page' => $per_page,
        'paged'          => $page,
        'meta_query'     => $meta_query,
    );
    
    // Execute query
    $query = new WP_Query($args);
    $properties = array();
    
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $post_id = get_the_ID();

            // Get all gallery images
            $gallery_images = get_field('property_gallery', $post_id);
            $images = array();
            if ($gallery_images) {
                foreach ($gallery_images as $image) {
                    $images[] = $image['url'];
                }
            }

            // Get the property data using ACF
            $price = get_field('property_price', $post_id);
            $currency = get_field('property_currency', $post_id) ?: 'CNY'; // Default to CNY
            $payment_terms = get_field('payment_terms', $post_id);
            $bedrooms = get_field('property_bedrooms', $post_id);
            $bathrooms = get_field('property_bathrooms', $post_id);
            $location = get_field('property_location', $post_id);
            $square_footage = get_field('property_square_footage', $post_id);
            $is_premium = get_field('is_premium', $post_id);
            $property_type = get_field('property_type', $post_id);
            $amenities = get_field('property_amenities', $post_id);

            // Format payment terms to be human-readable
            $payment_terms_display = $payment_terms ? ucfirst(str_replace('_', ' ', $payment_terms)) : 'Monthly';

            $properties[] = array(
                'id'             => $post_id,
                'title'          => get_the_title(),
                'description'    => get_the_content(),
                'excerpt'        => get_the_excerpt(),
                'link'           => get_permalink(),
                'featured_image' => get_the_post_thumbnail_url(null, 'large'),
                'images'         => $images,
                'price'          => $price ?: '',
                'currency'       => $currency,
                'paymentTerms'   => $payment_terms_display,
                'bedrooms'       => $bedrooms ?: '',
                'bathrooms'      => $bathrooms ?: '',
                'location'       => $location ?: '',
                'square_footage' => $square_footage ?: '',
                'propertyType'   => $property_type ?: 'apartment',
                'amenities'      => $amenities ?: array(),
                'isPremium'      => $is_premium ?: false,
            );
        }
        wp_reset_postdata();
    }
    
    // Return response with pagination info
    return new WP_REST_Response(array(
        'properties'  => $properties,
        'total'       => $query->found_posts,
        'total_pages' => $query->max_num_pages,
        'current_page' => $page,
    ), 200);
}
