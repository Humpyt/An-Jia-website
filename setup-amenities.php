<?php
if (!defined('ABSPATH')) {
    exit;
}

// Register Amenities Field Group
function anjia_register_amenities_fields() {
    if (!function_exists('acf_add_local_field_group')) {
        return;
    }

    acf_add_local_field_group(array(
        'key' => 'group_property_amenities',
        'title' => 'Property Amenities',
        'fields' => array(
            array(
                'key' => 'field_property_amenities',
                'label' => 'Available Amenities',
                'name' => 'property_amenities',
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
                'default_value' => array(),
                'layout' => 'vertical',
                'toggle' => 1,
                'allow_custom' => 0,
                'save_custom' => 0,
                'return_format' => 'value'
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
        'menu_order' => 0,
        'position' => 'normal',
        'style' => 'default',
        'label_placement' => 'top',
        'instruction_placement' => 'label',
        'hide_on_screen' => '',
        'active' => true,
        'description' => 'Select amenities available for this property',
    ));
}
add_action('acf/init', 'anjia_register_amenities_fields');

// Add amenities to REST API response
function anjia_add_amenities_to_rest_api() {
    register_rest_field('property', 'amenities', array(
        'get_callback' => function($post) {
            $amenities = get_field('property_amenities', $post['id']);
            
            // If no amenities are selected, return an empty array
            if (empty($amenities)) {
                return array();
            }
            
            // Ensure we're returning an array of strings
            if (!is_array($amenities)) {
                $amenities = array($amenities);
            }
            
            // Filter out any null or empty values
            $amenities = array_filter($amenities, function($value) {
                return !empty($value) && is_string($value);
            });
            
            // Return array of amenity keys
            return array_values($amenities);
        },
        'schema' => array(
            'description' => 'Property amenities',
            'type' => 'array',
            'items' => array(
                'type' => 'string',
                'enum' => array(
                    'wifi',
                    'parking',
                    'security',
                    'swimming_pool',
                    'generator',
                    'elevator',
                    'terrace',
                    'gym',
                    'air_conditioning',
                    'furnished',
                    'water_tank',
                    'cctv',
                    'garden',
                    'balcony',
                    'solar_power',
                    'internet',
                    'laundry',
                    'playground',
                    'bbq',
                    'storage'
                )
            )
        ),
    ));
}
add_action('rest_api_init', 'anjia_add_amenities_to_rest_api');
