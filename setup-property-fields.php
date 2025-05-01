<?php
/**
 * An Jia Property Fields Setup
 * 
 * This script sets up all custom fields and taxonomies for the Property post type.
 */

if (!defined('ABSPATH')) {
    die('Direct access not allowed');
}

// Register Neighborhood Taxonomy
function anjia_register_neighborhood_taxonomy() {
    $labels = array(
        'name'              => _x('Neighborhoods', 'taxonomy general name', 'anjia'),
        'singular_name'     => _x('Neighborhood', 'taxonomy singular name', 'anjia'),
        'search_items'      => __('Search Neighborhoods', 'anjia'),
        'all_items'         => __('All Neighborhoods', 'anjia'),
        'edit_item'         => __('Edit Neighborhood', 'anjia'),
        'update_item'       => __('Update Neighborhood', 'anjia'),
        'add_new_item'      => __('Add New Neighborhood', 'anjia'),
        'new_item_name'     => __('New Neighborhood Name', 'anjia'),
        'menu_name'         => __('Neighborhoods', 'anjia'),
    );

    $args = array(
        'hierarchical'      => true,
        'labels'           => $labels,
        'show_ui'          => true,
        'show_admin_column' => true,
        'query_var'        => true,
        'rewrite'          => array('slug' => 'neighborhood'),
        'show_in_rest'     => true,
    );

    register_taxonomy('neighborhood', array('property'), $args);
}
add_action('init', 'anjia_register_neighborhood_taxonomy');

// Define amenities list
function anjia_get_amenities_choices() {
    return array(
        'wifi' => 'WiFi',
        'parking' => 'Parking',
        'security' => '24/7 Security',
        'swimming_pool' => 'Swimming Pool',
        'generator' => 'Standby Generator',
        'elevator' => 'Elevator',
        'terrace' => 'Terrace',
        'gym' => 'Gym/Fitness Center',
        'air_conditioning' => 'Air Conditioning',
        'furnished' => 'Furnished',
        'water_tank' => 'Water Tank',
        'cctv' => 'CCTV Surveillance',
        'garden' => 'Garden',
        'balcony' => 'Balcony',
        'solar_power' => 'Solar Power',
        'internet' => 'High-Speed Internet',
        'laundry' => 'Laundry Facilities',
        'playground' => 'Children Playground',
        'bbq' => 'BBQ Area',
        'storage' => 'Storage Room'
    );
}

// Register ACF Fields
function anjia_register_acf_fields() {
    if(!function_exists('acf_add_local_field_group')) {
        return;
    }

    // Property Details Field Group
    acf_add_local_field_group(array(
        'key' => 'group_property_details',
        'title' => 'Property Details',
        'fields' => array(
            array(
                'key' => 'field_property_type',
                'label' => 'Property Type',
                'name' => 'property_type',
                'type' => 'select',
                'instructions' => 'Select the type of property',
                'required' => 1,
                'choices' => array(
                    'apartment' => 'Apartment',
                    'house' => 'House',
                    'land' => 'Land',
                    'hotel' => 'Hotel',
                    'commercial' => 'Commercial'
                ),
                'default_value' => 'apartment',
                'allow_null' => 0,
                'multiple' => 0,
                'ui' => 1,
                'return_format' => 'value'
            ),
            array(
                'key' => 'field_description',
                'label' => 'Description',
                'name' => 'description',
                'type' => 'wysiwyg',
                'instructions' => 'Enter a detailed description of the property',
                'required' => 1,
                'default_value' => '',
                'tabs' => 'all',
                'toolbar' => 'full',
                'media_upload' => 1,
                'delay' => 0
            ),
            array(
                'key' => 'field_amenities',
                'label' => 'Available Amenities',
                'name' => 'amenities',
                'type' => 'checkbox',
                'instructions' => 'Select all amenities available in this property',
                'required' => 0,
                'choices' => array(
                    'wifi' => 'WiFi',
                    'parking' => 'Parking',
                    'security' => '24/7 Security',
                    'swimming_pool' => 'Swimming Pool',
                    'generator' => 'Standby Generator',
                    'elevator' => 'Elevator',
                    'terrace' => 'Terrace',
                    'gym' => 'Gym/Fitness Center',
                    'air_conditioning' => 'Air Conditioning',
                    'furnished' => 'Furnished',
                    'water_tank' => 'Water Tank',
                    'cctv' => 'CCTV Surveillance',
                    'garden' => 'Garden',
                    'balcony' => 'Balcony',
                    'solar_power' => 'Solar Power',
                    'internet' => 'High-Speed Internet',
                    'laundry' => 'Laundry Facilities',
                    'playground' => 'Children Playground',
                    'bbq' => 'BBQ Area',
                    'storage' => 'Storage Room'
                ),
                'allow_custom' => 0,
                'layout' => 'vertical',
                'toggle' => 1,
                'return_format' => 'value'
            ),
            array(
                'key' => 'field_owner_name',
                'label' => 'Owner Name',
                'name' => 'owner_name',
                'type' => 'text',
                'required' => 1
            ),
            array(
                'key' => 'field_owner_contact',
                'label' => 'Owner Contact',
                'name' => 'owner_contact',
                'type' => 'text',
                'required' => 1
            ),
            array(
                'key' => 'field_google_pin',
                'label' => 'Google Maps Location',
                'name' => 'google_pin',
                'type' => 'google_map',
                'required' => 0
            ),
            array(
                'key' => 'field_is_premium',
                'label' => 'Premium Property',
                'name' => 'is_premium',
                'type' => 'true_false',
                'instructions' => 'Mark this property as premium to feature it on the homepage',
                'ui' => 1
            )
        ),
        'location' => array(
            array(
                array(
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'property',
                ),
            ),
        ),
        'menu_order' => 0,
        'position' => 'normal',
        'style' => 'default',
        'label_placement' => 'top',
        'instruction_placement' => 'label',
        'hide_on_screen' => '',
        'active' => true,
        'description' => 'Property details including amenities and owner information',
    ));

        // Property Amenities Field Group
        acf_add_local_field_group(array(
            'key' => 'group_property_amenities',
            'title' => 'Property Amenities',
            'fields' => array(
                array(
                    'key' => 'field_amenities',
                    'label' => 'Available Amenities',
                    'name' => 'amenities',
                    'type' => 'checkbox',
                    'instructions' => 'Select all amenities available in this property',
                    'required' => 0,
                    'choices' => anjia_get_amenities_choices(),
                    'allow_custom' => 0,
                    'layout' => 'vertical',
                    'toggle' => 1,
                    'return_format' => 'array'
                )
            ),
            'location' => array(
                array(
                    array(
                        'param' => 'post_type',
                        'operator' => '==',
                        'value' => 'property',
                    ),
                ),
            ),
            'menu_order' => 0,
            'position' => 'normal',
            'style' => 'default',
            'label_placement' => 'top',
            'instruction_placement' => 'label',
            'active' => true,
        ));


        // Property Rating Fields
        acf_add_local_field_group(array(
            'key' => 'group_property_ratings',
            'title' => 'Property Ratings',
            'fields' => array(
                array(
                    'key' => 'field_rating_average',
                    'label' => 'Average Rating',
                    'name' => 'rating_average',
                    'type' => 'number',
                    'instructions' => 'Overall average rating (1-5)',
                    'required' => 0,
                    'min' => 0,
                    'max' => 5,
                    'step' => 0.1,
                ),
                array(
                    'key' => 'field_rating_count',
                    'label' => 'Rating Count',
                    'name' => 'rating_count',
                    'type' => 'number',
                    'instructions' => 'Number of ratings received',
                    'required' => 0,
                    'min' => 0,
                ),
                array(
                    'key' => 'field_reviews',
                    'label' => 'Reviews',
                    'name' => 'reviews',
                    'type' => 'repeater',
                    'instructions' => 'Property reviews',
                    'required' => 0,
                    'sub_fields' => array(
                        array(
                            'key' => 'field_review_author',
                            'label' => 'Author',
                            'name' => 'author',
                            'type' => 'text',
                            'required' => 1,
                        ),
                        array(
                            'key' => 'field_review_date',
                            'label' => 'Date',
                            'name' => 'date',
                            'type' => 'date_time_picker',
                            'required' => 1,
                        ),
                        array(
                            'key' => 'field_review_location_rating',
                            'label' => 'Location Rating',
                            'name' => 'location_rating',
                            'type' => 'number',
                            'required' => 1,
                            'min' => 1,
                            'max' => 5,
                        ),
                        array(
                            'key' => 'field_review_condition_rating',
                            'label' => 'Property Condition Rating',
                            'name' => 'condition_rating',
                            'type' => 'number',
                            'required' => 1,
                            'min' => 1,
                            'max' => 5,
                        ),
                        array(
                            'key' => 'field_review_value_rating',
                            'label' => 'Value for Money Rating',
                            'name' => 'value_rating',
                            'type' => 'number',
                            'required' => 1,
                            'min' => 1,
                            'max' => 5,
                        ),
                        array(
                            'key' => 'field_review_overall_rating',
                            'label' => 'Overall Rating',
                            'name' => 'overall_rating',
                            'type' => 'number',
                            'required' => 1,
                            'min' => 1,
                            'max' => 5,
                        ),
                        array(
                            'key' => 'field_review_comment',
                            'label' => 'Comment',
                            'name' => 'comment',
                            'type' => 'textarea',
                            'required' => 1,
                        ),
                    ),
                ),
            ),
            'location' => array(
                array(
                    array(
                        'param' => 'post_type',
                        'operator' => '==',
                        'value' => 'property',
                    ),
                ),
            ),
        ));

        // Neighborhood Fields
        acf_add_local_field_group(array(
            'key' => 'group_neighborhood',
            'title' => 'Neighborhood Information',
            'fields' => array(
                array(
                    'key' => 'field_area_description',
                    'label' => 'Area Description',
                    'name' => 'area_description',
                    'type' => 'textarea',
                    'required' => 1,
                ),
                array(
                    'key' => 'field_safety_rating',
                    'label' => 'Safety Rating',
                    'name' => 'safety_rating',
                    'type' => 'number',
                    'required' => 1,
                    'min' => 1,
                    'max' => 5,
                    'step' => 0.1,
                ),
                array(
                    'key' => 'field_nearby_amenities',
                    'label' => 'Nearby Amenities',
                    'name' => 'nearby_amenities',
                    'type' => 'repeater',
                    'required' => 0,
                    'sub_fields' => array(
                        array(
                            'key' => 'field_amenity_name',
                            'label' => 'Name',
                            'name' => 'name',
                            'type' => 'text',
                            'required' => 1,
                        ),
                        array(
                            'key' => 'field_amenity_type',
                            'label' => 'Type',
                            'name' => 'type',
                            'type' => 'select',
                            'choices' => array(
                                'shopping' => 'Shopping',
                                'dining' => 'Dining',
                                'education' => 'Education',
                                'healthcare' => 'Healthcare',
                                'transport' => 'Transportation',
                                'recreation' => 'Recreation',
                            ),
                            'required' => 1,
                        ),
                        array(
                            'key' => 'field_amenity_distance',
                            'label' => 'Distance (km)',
                            'name' => 'distance',
                            'type' => 'number',
                            'required' => 1,
                            'min' => 0,
                            'step' => 0.1,
                        ),
                    ),
                ),
                array(
                    'key' => 'field_avg_property_price',
                    'label' => 'Average Property Price',
                    'name' => 'avg_property_price',
                    'type' => 'number',
                    'required' => 1,
                ),
                array(
                    'key' => 'field_transportation',
                    'label' => 'Transportation Options',
                    'name' => 'transportation',
                    'type' => 'repeater',
                    'required' => 0,
                    'sub_fields' => array(
                        array(
                            'key' => 'field_transport_type',
                            'label' => 'Type',
                            'name' => 'type',
                            'type' => 'select',
                            'choices' => array(
                                'bus' => 'Bus',
                                'train' => 'Train',
                                'taxi' => 'Taxi Stand',
                                'other' => 'Other',
                            ),
                            'required' => 1,
                        ),
                        array(
                            'key' => 'field_transport_description',
                            'label' => 'Description',
                            'name' => 'description',
                            'type' => 'text',
                            'required' => 1,
                        ),
                    ),
                ),
                array(
                    'key' => 'field_schools_facilities',
                    'label' => 'Schools and Facilities',
                    'name' => 'schools_facilities',
                    'type' => 'repeater',
                    'required' => 0,
                    'sub_fields' => array(
                        array(
                            'key' => 'field_facility_name',
                            'label' => 'Name',
                            'name' => 'name',
                            'type' => 'text',
                            'required' => 1,
                        ),
                        array(
                            'key' => 'field_facility_type',
                            'label' => 'Type',
                            'name' => 'type',
                            'type' => 'select',
                            'choices' => array(
                                'primary' => 'Primary School',
                                'secondary' => 'Secondary School',
                                'university' => 'University',
                                'library' => 'Library',
                                'sports' => 'Sports Facility',
                                'other' => 'Other',
                            ),
                            'required' => 1,
                        ),
                    ),
                ),
                array(
                    'key' => 'field_google_maps_location',
                    'label' => 'Google Maps Location',
                    'name' => 'google_maps_location',
                    'type' => 'google_map',
                    'required' => 1,
                ),
            ),
            'location' => array(
                array(
                    array(
                        'param' => 'taxonomy',
                        'operator' => '==',
                        'value' => 'neighborhood',
                    ),
                ),
            ),
        ));

}
add_action('acf/init', 'anjia_register_acf_fields');

// Register REST API endpoints for ratings
function anjia_register_rating_endpoints() {
    register_rest_route('anjia/v1', '/properties/(?P<id>\d+)/rate', array(
        'methods' => 'POST',
        'callback' => 'anjia_handle_property_rating',
        'permission_callback' => '__return_true',
        'args' => array(
            'location_rating' => array(
                'required' => true,
                'type' => 'integer',
                'minimum' => 1,
                'maximum' => 5,
            ),
            'condition_rating' => array(
                'required' => true,
                'type' => 'integer',
                'minimum' => 1,
                'maximum' => 5,
            ),
            'value_rating' => array(
                'required' => true,
                'type' => 'integer',
                'minimum' => 1,
                'maximum' => 5,
            ),
            'overall_rating' => array(
                'required' => true,
                'type' => 'integer',
                'minimum' => 1,
                'maximum' => 5,
            ),
            'comment' => array(
                'required' => true,
                'type' => 'string',
            ),
            'author' => array(
                'required' => true,
                'type' => 'string',
            ),
        ),
    ));
}
add_action('rest_api_init', 'anjia_register_rating_endpoints');

// Handle property rating submission
function anjia_handle_property_rating($request) {
    $property_id = $request['id'];
    $params = $request->get_params();
    
    // Calculate average rating
    $ratings = array(
        $params['location_rating'],
        $params['condition_rating'],
        $params['value_rating'],
        $params['overall_rating']
    );
    $avg_rating = array_sum($ratings) / count($ratings);
    
    // Get existing reviews
    $reviews = get_field('reviews', $property_id) ?: array();
    
    // Add new review
    $reviews[] = array(
        'author' => $params['author'],
        'date' => current_time('mysql'),
        'location_rating' => $params['location_rating'],
        'condition_rating' => $params['condition_rating'],
        'value_rating' => $params['value_rating'],
        'overall_rating' => $params['overall_rating'],
        'comment' => $params['comment'],
    );
    
    // Update fields
    update_field('reviews', $reviews, $property_id);
    update_field('rating_count', count($reviews), $property_id);
    update_field('rating_average', $avg_rating, $property_id);
    
    return array(
        'success' => true,
        'rating_average' => $avg_rating,
        'rating_count' => count($reviews),
    );
}
