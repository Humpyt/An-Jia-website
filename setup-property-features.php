<?php
if (!defined('ABSPATH')) {
    exit;
}

// Register Property Type Taxonomy
function register_property_type_taxonomy() {
    $labels = array(
        'name'              => 'Property Types',
        'singular_name'     => 'Property Type',
        'search_items'      => 'Search Property Types',
        'all_items'         => 'All Property Types',
        'parent_item'       => 'Parent Property Type',
        'parent_item_colon' => 'Parent Property Type:',
        'edit_item'         => 'Edit Property Type',
        'update_item'       => 'Update Property Type',
        'add_new_item'      => 'Add New Property Type',
        'new_item_name'     => 'New Property Type Name',
        'menu_name'         => 'Property Types'
    );

    register_taxonomy('property_type', 'property', array(
        'hierarchical'      => true,
        'labels'            => $labels,
        'show_ui'           => true,
        'show_admin_column' => true,
        'query_var'         => true,
        'rewrite'           => array('slug' => 'type'),
        'show_in_rest'      => true,
    ));
}
add_action('init', 'register_property_type_taxonomy');

// Register Price Range Taxonomy
function register_price_range_taxonomy() {
    $labels = array(
        'name'              => 'Price Ranges',
        'singular_name'     => 'Price Range',
        'search_items'      => 'Search Price Ranges',
        'all_items'         => 'All Price Ranges',
        'parent_item'       => 'Parent Price Range',
        'parent_item_colon' => 'Parent Price Range:',
        'edit_item'         => 'Edit Price Range',
        'update_item'       => 'Update Price Range',
        'add_new_item'      => 'Add New Price Range',
        'new_item_name'     => 'New Price Range Name',
        'menu_name'         => 'Price Ranges'
    );

    register_taxonomy('price_range', 'property', array(
        'hierarchical'      => true,
        'labels'            => $labels,
        'show_ui'           => true,
        'show_admin_column' => true,
        'query_var'         => true,
        'rewrite'           => array('slug' => 'price-range'),
        'show_in_rest'      => true,
    ));
}
add_action('init', 'register_price_range_taxonomy');

// Register Property Location (Neighborhood) Taxonomy
function register_property_location_taxonomy() {
    $labels = array(
        'name'              => 'Neighborhoods',
        'singular_name'     => 'Neighborhood',
        'search_items'      => 'Search Neighborhoods',
        'all_items'         => 'All Neighborhoods',
        'parent_item'       => 'Parent Neighborhood',
        'parent_item_colon' => 'Parent Neighborhood:',
        'edit_item'         => 'Edit Neighborhood',
        'update_item'       => 'Update Neighborhood',
        'add_new_item'      => 'Add New Neighborhood',
        'new_item_name'     => 'New Neighborhood Name',
        'menu_name'         => 'Neighborhoods'
    );

    register_taxonomy('neighborhood', 'property', array(
        'hierarchical'      => true,
        'labels'           => $labels,
        'show_ui'          => true,
        'show_admin_column' => true,
        'query_var'        => true,
        'rewrite'          => array('slug' => 'neighborhood'),
        'show_in_rest'     => true, // Enable for Gutenberg and REST API
    ));
}
add_action('init', 'register_property_location_taxonomy');

// Add Featured Property Meta Box
function add_featured_property_meta_box() {
    // Featured Property Meta Box
    add_meta_box(
        'featured_property_meta',
        'Featured Property',
        'featured_property_meta_box_html',
        'property',
        'side',
        'high'
    );

    // Premium Property Meta Box
    add_meta_box(
        'premium_property_meta',
        'Premium Property',
        'premium_property_meta_box_html',
        'property',
        'side',
        'high'
    );

    // Property Gallery Meta Box
    add_meta_box(
        'property_gallery_meta',
        'Property Gallery',
        'property_gallery_meta_box_html',
        'property',
        'normal',
        'high'
    );

    // Payment Terms Meta Box
    add_meta_box(
        'payment_terms_meta',
        'Payment Terms',
        'payment_terms_meta_box_html',
        'property',
        'side',
        'default'
    );
}
add_action('add_meta_boxes', 'add_featured_property_meta_box');

// Featured Property Meta Box HTML
function featured_property_meta_box_html($post) {
    $featured = get_post_meta($post->ID, '_is_featured', true);
    ?>
    <label>
        <input type="checkbox" name="is_featured" value="1" <?php checked($featured, '1'); ?>>
        Mark as Featured Property
    </label>
    <?php
}

function premium_property_meta_box_html($post) {
    $premium = get_post_meta($post->ID, '_is_premium', true);
    ?>
    <label>
        <input type="checkbox" name="is_premium" value="1" <?php checked($premium, '1'); ?>>
        Mark as Premium Property
    </label>
    <?php
}

function property_gallery_meta_box_html($post) {
    $gallery = get_post_meta($post->ID, '_property_gallery', true);
    $gallery_ids = $gallery ? explode(',', $gallery) : array();
    ?>
    <div class="property-gallery-container">
        <input type="hidden" name="property_gallery" id="property_gallery" value="<?php echo esc_attr($gallery); ?>">
        <div id="property_gallery_preview" class="gallery-preview">
            <?php
            if (!empty($gallery_ids)) {
                foreach ($gallery_ids as $image_id) {
                    $image_url = wp_get_attachment_image_url($image_id, 'thumbnail');
                    if ($image_url) {
                        echo '<div class="gallery-image"><img src="' . esc_url($image_url) . '"></div>';
                    }
                }
            }
            ?>
        </div>
        <p>
            <button type="button" class="button" id="add_gallery_images">Add Gallery Images</button>
        </p>
    </div>
    <script>
    jQuery(document).ready(function($) {
        var gallery_frame;
        $('#add_gallery_images').on('click', function(e) {
            e.preventDefault();
            
            if (gallery_frame) {
                gallery_frame.open();
                return;
            }
            
            gallery_frame = wp.media({
                title: 'Select Gallery Images',
                button: {
                    text: 'Add to Gallery'
                },
                multiple: true
            });
            
            gallery_frame.on('select', function() {
                var selection = gallery_frame.state().get('selection');
                var gallery_ids = [];
                
                $('#property_gallery_preview').html('');
                
                selection.each(function(attachment) {
                    gallery_ids.push(attachment.id);
                    $('#property_gallery_preview').append(
                        '<div class="gallery-image"><img src="' + attachment.attributes.sizes.thumbnail.url + '"></div>'
                    );
                });
                
                $('#property_gallery').val(gallery_ids.join(','));
            });
            
            gallery_frame.open();
        });
    });
    </script>
    <style>
    .gallery-preview {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin: 10px 0;
    }
    .gallery-image {
        width: 100px;
        height: 100px;
        overflow: hidden;
        border: 1px solid #ddd;
    }
    .gallery-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    </style>
    <?php
}

function payment_terms_meta_box_html($post) {
    $terms = get_post_meta($post->ID, '_payment_terms', true) ?: 'month';
    ?>
    <select name="payment_terms" id="payment_terms">
        <option value="month" <?php selected($terms, 'month'); ?>>Per Month</option>
        <option value="year" <?php selected($terms, 'year'); ?>>Per Year</option>
        <option value="total" <?php selected($terms, 'total'); ?>>Total Price</option>
    </select>
    <?php
}

// Save Featured Property Meta
function save_featured_property_meta($post_id) {
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if ($parent_id = wp_is_post_revision($post_id)) {
        $post_id = $parent_id;
    }
    
    // Save Featured Status
    if (isset($_POST['is_featured'])) {
        update_post_meta($post_id, '_is_featured', '1');
    } else {
        delete_post_meta($post_id, '_is_featured');
    }

    // Save Premium Status
    if (isset($_POST['is_premium'])) {
        update_post_meta($post_id, '_is_premium', '1');
    } else {
        delete_post_meta($post_id, '_is_premium');
    }

    // Save Gallery
    if (isset($_POST['property_gallery'])) {
        update_post_meta($post_id, '_property_gallery', sanitize_text_field($_POST['property_gallery']));
    }

    // Save Payment Terms
    if (isset($_POST['payment_terms'])) {
        update_post_meta($post_id, '_payment_terms', sanitize_text_field($_POST['payment_terms']));
    }
}
add_action('save_post_property', 'save_featured_property_meta');

// Add REST API Support for Featured Properties
function register_featured_property_meta() {
    register_meta('post', '_is_featured', array(
        'type' => 'boolean',
        'single' => true,
        'show_in_rest' => true,
    ));
}
add_action('init', 'register_featured_property_meta');

// Add Featured and Latest Properties to REST API
function add_property_meta_to_api() {
    register_rest_field('property', 'is_featured', array(
        'get_callback' => function($post) {
            return (bool) get_post_meta($post['id'], '_is_featured', true);
        },
        'schema' => array(
            'type' => 'boolean',
        ),
    ));

    register_rest_field('property', 'neighborhood_info', array(
        'get_callback' => function($post) {
            $neighborhoods = get_the_terms($post['id'], 'neighborhood');
            if (is_wp_error($neighborhoods) || empty($neighborhoods)) {
                return array();
            }
            return array_map(function($term) {
                return array(
                    'id' => $term->term_id,
                    'name' => $term->name,
                    'slug' => $term->slug,
                );
            }, $neighborhoods);
        },
        'schema' => array(
            'type' => 'array',
        ),
    ));

    register_rest_field('property', 'property_type_info', array(
        'get_callback' => function($post) {
            $types = get_the_terms($post['id'], 'property_type');
            if (is_wp_error($types) || empty($types)) {
                return array();
            }
            return array_map(function($term) {
                return array(
                    'id' => $term->term_id,
                    'name' => $term->name,
                    'slug' => $term->slug,
                );
            }, $types);
        },
        'schema' => array(
            'type' => 'array',
        ),
    ));

    register_rest_field('property', 'price_range_info', array(
        'get_callback' => function($post) {
            $ranges = get_the_terms($post['id'], 'price_range');
            if (is_wp_error($ranges) || empty($ranges)) {
                return array();
            }
            return array_map(function($term) {
                return array(
                    'id' => $term->term_id,
                    'name' => $term->name,
                    'slug' => $term->slug,
                );
            }, $ranges);
        },
        'schema' => array(
            'type' => 'array',
        ),
    ));
}
add_action('rest_api_init', 'add_property_meta_to_api');

// Add Custom REST API Endpoints
function register_property_rest_routes() {
    // Featured Properties Endpoint
    register_rest_route('anjia/v1', '/featured-properties', array(
        'methods' => 'GET',
        'callback' => 'get_featured_properties',
        'permission_callback' => '__return_true',
    ));

    // Latest Properties Endpoint
    register_rest_route('anjia/v1', '/latest-properties', array(
        'methods' => 'GET',
        'callback' => 'get_latest_properties',
        'permission_callback' => '__return_true',
    ));

    // Properties by Neighborhood Endpoint
    register_rest_route('anjia/v1', '/properties-by-neighborhood/(?P<neighborhood_id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'get_properties_by_neighborhood',
        'permission_callback' => '__return_true',
    ));

    // Properties by Type Endpoint
    register_rest_route('anjia/v1', '/properties-by-type/(?P<type_id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'get_properties_by_type',
        'permission_callback' => '__return_true',
    ));

    // Properties by Price Range Endpoint
    register_rest_route('anjia/v1', '/properties-by-price-range/(?P<range_id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'get_properties_by_price_range',
        'permission_callback' => '__return_true',
    ));
}
add_action('rest_api_init', 'register_property_rest_routes');

// Featured Properties Callback
function get_featured_properties($request) {
    $args = array(
        'post_type' => 'property',
        'posts_per_page' => 6,
        'meta_query' => array(
            array(
                'key' => '_is_featured',
                'value' => '1',
            ),
        ),
    );

    $query = new WP_Query($args);
    $properties = array();

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $properties[] = prepare_property_response(get_post());
        }
    }
    wp_reset_postdata();

    return new WP_REST_Response($properties, 200);
}

// Latest Properties Callback
function get_latest_properties($request) {
    $args = array(
        'post_type' => 'property',
        'posts_per_page' => 6,
        'orderby' => 'date',
        'order' => 'DESC',
    );

    $query = new WP_Query($args);
    $properties = array();

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $properties[] = prepare_property_response(get_post());
        }
    }
    wp_reset_postdata();

    return new WP_REST_Response($properties, 200);
}

// Properties by Neighborhood Callback
function get_properties_by_neighborhood($request) {
    $neighborhood_id = $request->get_param('neighborhood_id');

    $args = array(
        'post_type' => 'property',
        'posts_per_page' => 6,
        'tax_query' => array(
            array(
                'taxonomy' => 'neighborhood',
                'field' => 'term_id',
                'terms' => $neighborhood_id,
            ),
        ),
    );

    $query = new WP_Query($args);
    $properties = array();

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $properties[] = prepare_property_response(get_post());
        }
    }
    wp_reset_postdata();

    return new WP_REST_Response($properties, 200);
}

// Helper function to prepare property response
// Properties by Type Callback
function get_properties_by_type($request) {
    $type_id = $request->get_param('type_id');

    $args = array(
        'post_type' => 'property',
        'posts_per_page' => 6,
        'tax_query' => array(
            array(
                'taxonomy' => 'property_type',
                'field' => 'term_id',
                'terms' => $type_id,
            ),
        ),
    );

    $query = new WP_Query($args);
    $properties = array();

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $properties[] = prepare_property_response(get_post());
        }
    }
    wp_reset_postdata();

    return new WP_REST_Response($properties, 200);
}

// Properties by Price Range Callback
function get_properties_by_price_range($request) {
    $range_id = $request->get_param('range_id');

    $args = array(
        'post_type' => 'property',
        'posts_per_page' => 6,
        'tax_query' => array(
            array(
                'taxonomy' => 'price_range',
                'field' => 'term_id',
                'terms' => $range_id,
            ),
        ),
    );

    $query = new WP_Query($args);
    $properties = array();

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $properties[] = prepare_property_response(get_post());
        }
    }
    wp_reset_postdata();

    return new WP_REST_Response($properties, 200);
}

function prepare_property_response($post) {
    // Get featured image
    $featured_image = get_the_post_thumbnail_url($post->ID, 'large');
    
    // Get gallery images
    $gallery_images = array();
    $gallery = get_post_meta($post->ID, '_property_gallery', true);
    if (!empty($gallery)) {
        $gallery_ids = explode(',', $gallery);
        foreach ($gallery_ids as $image_id) {
            $image_url = wp_get_attachment_image_url($image_id, 'large');
            if ($image_url) {
                $gallery_images[] = $image_url;
            }
        }
    }
    
    // Get taxonomies
    $neighborhoods = get_the_terms($post->ID, 'neighborhood');
    $property_types = get_the_terms($post->ID, 'property_type');
    $price_ranges = get_the_terms($post->ID, 'price_range');
    
    $neighborhood_data = array();
    $property_type_data = array();
    $price_range_data = array();

    if ($neighborhoods && !is_wp_error($neighborhoods)) {
        foreach ($neighborhoods as $neighborhood) {
            $neighborhood_data[] = array(
                'id' => $neighborhood->term_id,
                'name' => $neighborhood->name,
                'slug' => $neighborhood->slug,
            );
        }
    }

    if ($property_types && !is_wp_error($property_types)) {
        foreach ($property_types as $type) {
            $property_type_data[] = array(
                'id' => $type->term_id,
                'name' => $type->name,
                'slug' => $type->slug,
            );
        }
    }

    if ($price_ranges && !is_wp_error($price_ranges)) {
        foreach ($price_ranges as $range) {
            $price_range_data[] = array(
                'id' => $range->term_id,
                'name' => $range->name,
                'slug' => $range->slug,
            );
        }
    }

    return array(
        'id' => $post->ID,
        'title' => get_the_title($post->ID),
        'slug' => $post->post_name,
        'featured_image' => $featured_image ? $featured_image : null,
        'gallery_images' => $gallery_images,
        'price' => get_post_meta($post->ID, '_property_price', true),
        'bedrooms' => get_post_meta($post->ID, '_property_bedrooms', true),
        'bathrooms' => get_post_meta($post->ID, '_property_bathrooms', true),
        'square_footage' => get_post_meta($post->ID, '_property_square_footage', true),
        'is_featured' => (bool) get_post_meta($post->ID, '_is_featured', true),
        'isPremium' => (bool) get_post_meta($post->ID, '_is_premium', true),
        'location' => get_post_meta($post->ID, '_property_location', true),
        'paymentTerms' => get_post_meta($post->ID, '_payment_terms', true) ?: 'month',
        'neighborhoods' => $neighborhood_data,
        'property_types' => $property_type_data,
        'price_ranges' => $price_range_data,
        'date' => get_the_date('c', $post->ID),
        'excerpt' => get_the_excerpt($post->ID),
    );
}
