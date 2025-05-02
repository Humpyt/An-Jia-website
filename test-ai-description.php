<?php
require_once('wp-load.php');

// Create a test property
$property_data = array(
    'post_title'    => 'Luxury Apartment in City Center',
    'post_content'  => 'Test property content',
    'post_status'   => 'publish',
    'post_type'     => 'property'
);

$property_id = wp_insert_post($property_data);

if ($property_id) {
    // Set property details using ACF
    update_field('property_type', 'apartment', $property_id);
    update_field('price', '250000', $property_id);
    update_field('bedrooms', '3', $property_id);
    update_field('bathrooms', '2', $property_id);
    update_field('size', '1500', $property_id);
    
    // Set amenities
    update_field('amenities', array('wifi', 'parking', 'swimming_pool', 'gym'), $property_id);
    
    // Create a test neighborhood
    $neighborhood = wp_insert_term('Downtown', 'neighborhood');
    if (!is_wp_error($neighborhood)) {
        wp_set_object_terms($property_id, $neighborhood['term_id'], 'neighborhood');
    }
    
    // Force regenerate description
    update_field('regenerate_description', true, $property_id);
    
    // Save post to trigger the AI description generation
    wp_update_post(array('ID' => $property_id));
    
    // Check if AI description was generated
    $ai_description = get_field('ai_description', $property_id);
    
    echo "Test Results:\n";
    echo "Property ID: $property_id\n";
    echo "AI Description Generated: " . (!empty($ai_description) ? "Yes" : "No") . "\n";
    if (!empty($ai_description)) {
        echo "\nGenerated Description:\n$ai_description\n";
    }
} else {
    echo "Failed to create test property\n";
}
