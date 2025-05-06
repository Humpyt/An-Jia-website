<?php
/**
 * Plugin Name: An Jia Properties Endpoint (Updated)
 * Description: Adds a custom REST API endpoint for properties with flexible field handling
 * Version: 1.1
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
    
    // Define possible field names for each property attribute
    $field_mappings = array(
        'location' => array('property_location', 'location'),
        'bedrooms' => array('property_bedrooms', 'bedrooms'),
        'bathrooms' => array('property_bathrooms', 'bathrooms'),
        'price' => array('property_price', 'price'),
        'currency' => array('property_currency', 'currency'),
        'property_type' => array('property_type', 'type'),
        'amenities' => array('property_amenities', 'amenities'),
        'gallery' => array('property_gallery', 'gallery', 'images'),
    );
    
    // Build meta query
    $meta_query = array('relation' => 'AND');
    
    // Add location filter (try both possible field names)
    if (!empty($location)) {
        $location_query = array('relation' => 'OR');
        foreach ($field_mappings['location'] as $field_name) {
            $location_query[] = array(
                'key'     => $field_name,
                'value'   => $location,
                'compare' => 'LIKE',
            );
        }
        $meta_query[] = $location_query;
    }
    
    // Add price range filters (try both possible field names)
    if ($min_price > 0) {
        $min_price_query = array('relation' => 'OR');
        foreach ($field_mappings['price'] as $field_name) {
            $min_price_query[] = array(
                'key'     => $field_name,
                'value'   => $min_price,
                'compare' => '>=',
                'type'    => 'NUMERIC',
            );
        }
        $meta_query[] = $min_price_query;
    }
    
    if ($max_price > 0) {
        $max_price_query = array('relation' => 'OR');
        foreach ($field_mappings['price'] as $field_name) {
            $max_price_query[] = array(
                'key'     => $field_name,
                'value'   => $max_price,
                'compare' => '<=',
                'type'    => 'NUMERIC',
            );
        }
        $meta_query[] = $max_price_query;
    }
    
    // Add bedrooms filter (try both possible field names)
    if (!empty($bedrooms)) {
        $bedrooms_query = array('relation' => 'OR');
        foreach ($field_mappings['bedrooms'] as $field_name) {
            $bedrooms_query[] = array(
                'key'     => $field_name,
                'value'   => $bedrooms,
                'compare' => '=',
            );
        }
        $meta_query[] = $bedrooms_query;
    }
    
    // Add bathrooms filter (try both possible field names)
    if (!empty($bathrooms)) {
        $bathrooms_query = array('relation' => 'OR');
        foreach ($field_mappings['bathrooms'] as $field_name) {
            $bathrooms_query[] = array(
                'key'     => $field_name,
                'value'   => $bathrooms,
                'compare' => '=',
            );
        }
        $meta_query[] = $bathrooms_query;
    }
    
    // Add property type filter (try both possible field names)
    if (!empty($property_type)) {
        $property_type_query = array('relation' => 'OR');
        foreach ($field_mappings['property_type'] as $field_name) {
            $property_type_query[] = array(
                'key'     => $field_name,
                'value'   => $property_type,
                'compare' => '=',
            );
        }
        $meta_query[] = $property_type_query;
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

            // Helper function to get field value trying multiple possible field names
            $get_field_value = function($field_type) use ($post_id, $field_mappings) {
                foreach ($field_mappings[$field_type] as $field_name) {
                    $value = get_field($field_name, $post_id);
                    if (!empty($value)) {
                        return $value;
                    }
                }
                return '';
            };

            // Get images using multiple possible field names
            $images = array();
            $gallery = $get_field_value('gallery');
            
            if (is_array($gallery)) {
                foreach ($gallery as $image) {
                    if (is_array($image) && isset($image['url'])) {
                        $images[] = $image['url'];
                    } elseif (is_string($image)) {
                        $images[] = $image;
                    }
                }
            }
            
            // If no gallery images, use featured image
            if (empty($images)) {
                $featured_image = get_the_post_thumbnail_url(null, 'large');
                if ($featured_image) {
                    $images[] = $featured_image;
                }
            }

            // Get property data using our helper function
            $location = $get_field_value('location');
            $bedrooms = $get_field_value('bedrooms');
            $bathrooms = $get_field_value('bathrooms');
            $price = $get_field_value('price');
            $currency = $get_field_value('currency') ?: 'CNY'; // Default to CNY
            $property_type = $get_field_value('property_type') ?: 'apartment';
            $amenities = $get_field_value('amenities');
            
            // Also try regular post meta as fallback
            if (empty($location)) $location = get_post_meta($post_id, 'location', true);
            if (empty($bedrooms)) $bedrooms = get_post_meta($post_id, 'bedrooms', true);
            if (empty($bathrooms)) $bathrooms = get_post_meta($post_id, 'bathrooms', true);
            if (empty($price)) $price = get_post_meta($post_id, 'price', true);
            if (empty($currency)) $currency = get_post_meta($post_id, 'currency', true) ?: 'CNY';
            
            // Format payment terms
            $payment_terms = get_field('payment_terms', $post_id) ?: get_post_meta($post_id, 'payment_terms', true);
            $payment_terms_display = $payment_terms ? ucfirst(str_replace('_', ' ', $payment_terms)) : 'Monthly';

            // Build property object
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
                'propertyType'   => $property_type,
                'amenities'      => is_array($amenities) ? $amenities : array(),
                'isPremium'      => get_field('is_premium', $post_id) ?: false,
                'debug_info'     => array(
                    'field_mappings' => $field_mappings,
                    'meta_query' => $meta_query,
                ),
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
