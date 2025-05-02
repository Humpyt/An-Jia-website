<?php
if (!defined('ABSPATH')) {
    exit;
}

// Register Property Post Type
function register_property_post_type() {
    $labels = array(
        'name'                  => 'Properties',
        'singular_name'         => 'Property',
        'menu_name'            => 'Properties',
        'name_admin_bar'       => 'Property',
        'add_new'              => 'Add New',
        'add_new_item'         => 'Add New Property',
        'new_item'             => 'New Property',
        'edit_item'            => 'Edit Property',
        'view_item'            => 'View Property',
        'all_items'            => 'All Properties',
        'search_items'         => 'Search Properties',
        'parent_item_colon'    => 'Parent Properties:',
        'not_found'            => 'No properties found.',
        'not_found_in_trash'   => 'No properties found in Trash.',
        'featured_image'        => 'Property Featured Image',
        'set_featured_image'    => 'Set featured image',
        'remove_featured_image' => 'Remove featured image',
        'use_featured_image'    => 'Use as featured image',
    );

    $args = array(
        'labels'             => $labels,
        'public'             => true,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'query_var'          => true,
        'rewrite'            => array('slug' => 'properties'),
        'capability_type'    => 'post',
        'has_archive'        => true,
        'hierarchical'       => false,
        'menu_position'      => 5,
        'menu_icon'          => 'dashicons-building',
        'supports'           => array('title', 'editor', 'thumbnail', 'excerpt'),
        'show_in_rest'       => true,
    );

    register_post_type('property', $args);
}
add_action('init', 'register_property_post_type');
