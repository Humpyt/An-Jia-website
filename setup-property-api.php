<?php
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register custom REST API endpoint for properties
 */
function register_properties_api_routes() {
    register_rest_route('anjia/v1', '/properties', array(
        'methods' => 'GET',
        'callback' => 'get_properties_api_response',
        'permission_callback' => '__return_true'
    ));
}
add_action('rest_api_init', 'register_properties_api_routes');

/**
 * Get properties for the API response
 */
function get_properties_api_response() {
    $args = array(
        'post_type' => 'property',
        'posts_per_page' => -1,
        'post_status' => 'publish',
    );
    
    $properties_query = new WP_Query($args);
    $properties = array();
    
    if ($properties_query->have_posts()) {
        while ($properties_query->have_posts()) {
            $properties_query->the_post();
            $property_id = get_the_ID();
            
            // Get property metadata
            $price = get_post_meta($property_id, 'property_price', true);
            $currency = get_post_meta($property_id, 'property_currency', true) ?: 'USD';
            $bedrooms = get_post_meta($property_id, 'property_bedrooms', true);
            $bathrooms = get_post_meta($property_id, 'property_bathrooms', true);
            $location = get_post_meta($property_id, 'property_location', true);
            $payment_terms = get_post_meta($property_id, 'property_payment_terms', true);
            $is_premium = get_post_meta($property_id, 'property_is_premium', true) === 'yes';
            
            // Get property images
            $featured_image = get_the_post_thumbnail_url($property_id, 'full');
            $gallery_ids = get_post_meta($property_id, 'property_gallery', true);
            $images = array();
            
            if ($featured_image) {
                $images[] = $featured_image;
            }
            
            if (is_array($gallery_ids)) {
                foreach ($gallery_ids as $attachment_id) {
                    $image_url = wp_get_attachment_url($attachment_id);
                    if ($image_url) {
                        $images[] = $image_url;
                    }
                }
            }
            
            // Get amenities
            $amenities = array();
            $amenities_terms = get_the_terms($property_id, 'amenity');
            if ($amenities_terms && !is_wp_error($amenities_terms)) {
                foreach ($amenities_terms as $term) {
                    $amenities[] = $term->name;
                }
            }
            
            // Build property object
            $properties[] = array(
                'id' => (string)$property_id,
                'title' => get_the_title(),
                'location' => $location,
                'price' => $price,
                'currency' => $currency,
                'paymentTerms' => $payment_terms,
                'bedrooms' => $bedrooms,
                'bathrooms' => $bathrooms,
                'images' => $images,
                'isPremium' => $is_premium,
                'description' => get_the_content(),
                'amenities' => $amenities,
                'createdAt' => get_the_date('c'),
            );
        }
        wp_reset_postdata();
    }
    
    return array(
        'properties' => $properties
    );
}
