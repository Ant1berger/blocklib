<?php

//****************************
// Remove block theme support.
//****************************
remove_theme_support( 'block-templates' );

//****************************
// Remove DNS prefetch <link rel="dns-prefetch" href="//s.w.org">
//****************************
add_filter( 'emoji_svg_url', '__return_false' );

// REMOVE WP EMOJI
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');
remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
remove_action( 'admin_print_styles', 'print_emoji_styles' );

// REMOVE DASHICONS
add_action( 'wp_print_styles', 'my_deregister_styles', 100 );
function my_deregister_styles() {
    //wp_deregister_style( 'amethyst-dashicons-style' );
    wp_deregister_style( 'dashicons' );
}

//Remove Gutenberg Block Library CSS from loading on the frontend
function smartwp_remove_wp_block_library_css(){
    wp_dequeue_style( 'wp-block-library' );
    wp_dequeue_style( 'wp-block-library-theme' );
    wp_dequeue_style( 'wc-blocks-style' ); // Remove WooCommerce block CSS
}
add_action( 'wp_enqueue_scripts', 'smartwp_remove_wp_block_library_css', 100 );

// Remove other stuff.
add_action( 'wp_enqueue_scripts', function() {
    wp_dequeue_style( 'classic-theme-styles' );
}, 20 );

/*  DISABLE GUTENBERG STYLE IN HEADER| WordPress 5.9 */
function wps_deregister_styles() {
    wp_dequeue_style( 'global-styles' );
}
add_action( 'wp_enqueue_scripts', 'wps_deregister_styles', 100 );

//****************************
// Remove core (and old) jQuery on the front-end.
//****************************
add_action('wp_enqueue_scripts', 'no_more_jquery', 100);
function no_more_jquery(){
    if ( !is_admin() ) {
        wp_deregister_script('jquery');
        wp_dequeue_style('jquery-ui');
    }
}

//****************************
// Remove REST API (Put it back if some plugin need it)
//****************************
// Disable REST API link tag
remove_action('wp_head', 'rest_output_link_wp_head', 10);
// Disable oEmbed Discovery Links
remove_action('wp_head', 'wp_oembed_add_discovery_links', 10);
// Disable REST API link in HTTP headers
remove_action('template_redirect', 'rest_output_link_header', 11, 0);

//****************************
// Remove XMLRPC, wlwmanifest, WP version, shortlink and script versions from head
//****************************
remove_action ('wp_head', 'rsd_link');
remove_action( 'wp_head', 'wlwmanifest_link');
function thistheme_remove_version() {
    return '';
}
add_filter('the_generator', 'thistheme_remove_version');
remove_action( 'wp_head', 'wp_shortlink_wp_head');
function _remove_script_version( $src ){
    $parts = explode( '?ver', $src );
    return $parts[0];
}
add_filter( 'script_loader_src', '_remove_script_version', 15, 1 );
add_filter( 'style_loader_src', '_remove_script_version', 15, 1 );

//****************************
// Remove styles and scripts from CF7 plugin.
//****************************
function remove_plugin_assets() {
    wp_dequeue_style( 'contact-form-7' );
    wp_dequeue_script( 'contact-form-7' );
}
add_action( 'wp_enqueue_scripts', 'remove_plugin_assets', 100 );
// And remove the <p> tags around the form elements.
add_filter('wpcf7_autop_or_not', '__return_false');

//****************************
// Allow svg files in media library.
//****************************
/*  In addition to that, the first line of the svg file must be: <?xml version="1.0" encoding="UTF-8"?> */
function wpc_mime_types($mimes) {
    $mimes['svg'] = 'image/svg+xml';
    return $mimes;
}
add_filter('upload_mimes', 'wpc_mime_types');

//****************************
// Disable lazy loading on images (it is handled in the image block).
//****************************
add_filter( 'wp_lazy_loading_enabled', '__return_false' );

//****************************
// Enqueue styles and scripts
//****************************
function addMainCssJs() {
    // We don't want to enqueue files with src to reduce the number of http requests.
    // So we register empty <style> and <script> shells to inject our code inside.
    wp_register_style(
        'blb-main',
        false,
        array(),
        false,
        'all'
    );
    wp_register_script(
        'blb-main-inline',
        false,
        array(),
        false,
        array(
            'in_footer' => true
        )
    );

    // We take our main files...
    $main_css_path = get_template_directory() . '/main-auto-generated-dont-edit-me.css';
    $main_js_path = get_template_directory() . '/main.js';

    // ... And we inject their content inside our registered <style> and <script> shells.
    if (file_exists($main_css_path)) {
        $main_css_content = file_get_contents($main_css_path);
        wp_add_inline_style('blb-main', $main_css_content);
    }
    if (file_exists($main_js_path)) {
        $main_js_content = file_get_contents($main_js_path);
        wp_add_inline_script('blb-main-inline', $main_js_content);
    }

    // And let's finally enqueue everybody.
    wp_enqueue_style('blb-main');
    wp_enqueue_script('blb-main-inline');
}
add_action('wp_enqueue_scripts', 'addMainCssJs');

//****************************
// Functions for updating and retrieving a list of included components in a page.
// Used to execute the loading of styles and scripts when (and only when) their component is first included in the page.
//****************************
$components = [];
function add_component($componentName) {
    global $components;
    $components[] = $componentName;
}
function get_components() {
    global $components;
    return $components;
}

//****************************
// Register Gutenberg custom blocks.
//****************************
function theme_register_blocks() {
    register_block_type( get_stylesheet_directory() . '/custom-blocks/build/title' );
    register_block_type( get_stylesheet_directory() . '/custom-blocks/build/text' );
    register_block_type( get_stylesheet_directory() . '/custom-blocks/build/section' );
    register_block_type( get_stylesheet_directory() . '/custom-blocks/build/group' );
    register_block_type( get_stylesheet_directory() . '/custom-blocks/build/grouping-link' );
    register_block_type( get_stylesheet_directory() . '/custom-blocks/build/image' );
}
add_action( 'init', 'theme_register_blocks' );

//****************************
// We only want our custom blocks in the Gutenberg editor (and a few more).
//****************************
// function example_allowed_block_types( $allowed_block_types, $block_editor_context ) {
//     $allowed_block_types = array(
//         'core/paragraph', // To keep the ability to insert blocks, copy/paste etc.
//         'core/block', // To allow create Compositions.
//         'custom-blocks/text',
//         'custom-blocks/title',
//         'custom-blocks/section',
//         'custom-blocks/group',
//         'custom-blocks/grouping-link',
//         'custom-blocks/image'
//     );
//     return $allowed_block_types;
// }
// add_filter( 'allowed_block_types_all', 'example_allowed_block_types', 10, 2 );

//****************************
// to insert theme variables into the main CSS.
//****************************
function handleThemeOptionsForCSSVarsPlaceholders( $optionId ) {
    $css_vars_array = array();
    foreach(get_option( $optionId ) as $key => $value) {
        if ( isset($value) && !empty($value) ) {
            $css_vars_array[] .= '    --' . $key . ': ' . $value . ';';
        }
    }
    return implode("\n", $css_vars_array);
}

// And the corresponding classes
function handleThemeOptionsForClassesPlaceholders( $optionId, $cssProperty ) {
    $css_vars_array = array();
    foreach(get_option( $optionId ) as $key => $value) {
        if ( isset($value) && !empty($value) ) {
            $css_vars_array[] .= '.u-' . $cssProperty . '-' . $key . ' {
    ' . $cssProperty . ': var(--' . $key . ');
}';
        }
    }
    return implode("\n", $css_vars_array);
}

//****************************
// To dynamically insert values in the main.css file.
// It's not possible to use get_template_directory_uri() or other php stuff directly in the main.css file because it's not a php file.
// If we try to change the css file extension to php, it will be loaded properly by wp_enqueue_style, but the styles won't be applied.
// So we have to read the main.css file, replace the placeholders with the dynamic values we need,
// and write it back in an auto-generated file that we can finally load in Gutenberg with wp_enqueue_style.
//****************************
$cssString = file_get_contents(get_template_directory_uri() . '/main.css');
$cssString = str_replace('[get_template_directory_uri_placeholder]', get_template_directory_uri(), $cssString);
// We also have to make placeholders for theme customizer options.
$cssString = str_replace('/*colors_placholder*/', handleThemeOptionsForCSSVarsPlaceholders( 'theme_colors' ), $cssString);
$cssString = str_replace('/*fonts_placholder*/', handleThemeOptionsForCSSVarsPlaceholders( 'theme_fonts' ), $cssString);
$cssString = str_replace('/*colors_utilities_placholder*/', handleThemeOptionsForClassesPlaceholders( 'theme_colors', 'color' ), $cssString);
$cssString = str_replace('/*background_colors_utilities_placholder*/', handleThemeOptionsForClassesPlaceholders( 'theme_colors', 'background-color' ), $cssString);
$cssString = str_replace('/*fonts_utilities_placholder*/', handleThemeOptionsForClassesPlaceholders( 'theme_fonts', 'font-family' ), $cssString);
file_put_contents(get_template_directory() . '/main-auto-generated-dont-edit-me.css', $cssString);

//****************************
// Add styles to Admin.
//****************************
function theme_admin_styles() {
    wp_enqueue_style('admin_style', get_theme_file_uri('admin.css'));
}
add_action('admin_enqueue_scripts', 'theme_admin_styles');

//****************************
// Add styles to Gutenberg editor.
//****************************
function add_scripts_to_gutenberg() {
    wp_enqueue_style( 'main-styles', get_theme_file_uri('/main-auto-generated-dont-edit-me.css'), array(), '1.0' );
    wp_enqueue_style( 'additional-gutenberg-styles', get_theme_file_uri('/additional-gutenberg-styles.css'), array(), '1.0');
}
add_action('enqueue_block_editor_assets', 'add_scripts_to_gutenberg');

//****************************
// Add theme customizer options.
//****************************
add_action( 'customize_register', 'my_theme_customize_register' );
function my_theme_customize_register( $wp_customize ) {

    // Add Graphic Chart panel
    $wp_customize->add_panel( 'graphic_chart_panel', array(
        'title'       => __( 'Graphic Chart', 'blocklib' ),
        'description' => __( 'Manage styles of the site: colors, fonts, etc.', 'blocklib' ),
        'priority'    => 10,
    ));

    // Add Colors section
    $wp_customize->add_section(
        // ID
        'colors_section',
        // Arguments array
        array(
            'title' => __( 'Colors', 'blocklib' ),
            'panel'       => 'graphic_chart_panel',
            'capability' => 'edit_theme_options',
            'description' => __( 'Manage theme\'s colors.', 'blocklib' )
        )
    );

    // Add colors array setting.
    $wp_customize->add_setting( 'theme_colors[brand_1]', array( 'default' => '', 'type' => 'option', 'capability' => 'edit_theme_options', ));
    $wp_customize->add_setting( 'theme_colors[brand_2]', array( 'default' => '', 'type' => 'option', 'capability' => 'edit_theme_options', ));
    $wp_customize->add_setting( 'theme_colors[brand_3]', array( 'default' => '', 'type' => 'option', 'capability' => 'edit_theme_options', ));
    $wp_customize->add_setting( 'theme_colors[brand_4]', array( 'default' => '', 'type' => 'option', 'capability' => 'edit_theme_options', ));
    $wp_customize->add_setting( 'theme_colors[brand_5]', array( 'default' => '', 'type' => 'option', 'capability' => 'edit_theme_options', ));
    $wp_customize->add_setting( 'theme_colors[relax]', array( 'default' => '', 'type' => 'option', 'capability' => 'edit_theme_options', ));
    $wp_customize->add_setting( 'theme_colors[warning]', array( 'default' => '', 'type' => 'option', 'capability' => 'edit_theme_options', ));
    $wp_customize->add_setting( 'theme_colors[danger]', array( 'default' => '', 'type' => 'option', 'capability' => 'edit_theme_options', ));
    $wp_customize->add_setting( 'theme_colors[grey_start]', array( 'default' => '', 'type' => 'option', 'capability' => 'edit_theme_options', ));
    $wp_customize->add_setting( 'theme_colors[grey_end]', array( 'default' => '', 'type' => 'option', 'capability' => 'edit_theme_options', ));

    // Add each color setting.
    /* !!! WARNING !!! Carfull when changing control keys. Old keys will persist in the array. Check phpMyAdmin if cleaning is needed. */
    $wp_customize->add_control(
        'brand_1', array( 'label' => __( 'Brand 1', 'blocklib' ), 'section' => 'colors_section', 'settings' => 'theme_colors[brand_1]', 'type' => 'text' )
    );

    $wp_customize->add_control(
        'brand_2', array( 'label' => __( 'Brand 2', 'blocklib' ), 'section' => 'colors_section', 'settings' => 'theme_colors[brand_2]', 'type' => 'text' )
    );

    $wp_customize->add_control(
        'brand_3', array( 'label' => __( 'Brand 3', 'blocklib' ), 'section' => 'colors_section', 'settings' => 'theme_colors[brand_3]', 'type' => 'text' )
    );

    $wp_customize->add_control(
        'brand_4', array( 'label' => __( 'Brand 4', 'blocklib' ), 'section' => 'colors_section', 'settings' => 'theme_colors[brand_4]', 'type' => 'text' )
    );

    $wp_customize->add_control(
        'brand_5', array( 'label' => __( 'Brand 5', 'blocklib' ), 'section' => 'colors_section', 'settings' => 'theme_colors[brand_5]', 'type' => 'text' )
    );

    $wp_customize->add_control(
        'relax', array( 'label' => __( 'Relax', 'blocklib' ), 'section' => 'colors_section', 'settings' => 'theme_colors[relax]', 'type' => 'text' )
    );

    $wp_customize->add_control(
        'warning', array( 'label' => __( 'Warning', 'blocklib' ), 'section' => 'colors_section', 'settings' => 'theme_colors[warning]', 'type' => 'text' )
    );

    $wp_customize->add_control(
        'danger', array( 'label' => __( 'Danger', 'blocklib' ), 'section' => 'colors_section', 'settings' => 'theme_colors[danger]', 'type' => 'text' )
    );

    $wp_customize->add_control(
        'grey_start', array( 'label' => __( 'Grey start', 'blocklib' ), 'section' => 'colors_section', 'settings' => 'theme_colors[grey_start]', 'type' => 'text' )
    );

    $wp_customize->add_control(
        'grey_end', array( 'label' => __( 'Grey end', 'blocklib' ), 'section' => 'colors_section', 'settings' => 'theme_colors[grey_end]', 'type' => 'text' )
    );

    // Add Typography section
    $wp_customize->add_section(
        // ID
        'typography_section',
        // Arguments array
        array(
            'title' => __( 'Typograpy', 'blocklib' ),
            'panel'       => 'graphic_chart_panel',
            'capability' => 'edit_theme_options',
            'description' => __( 'Manage theme\'s typography.', 'blocklib' )
        )
    );

    // Add fonts array setting.
    $wp_customize->add_setting( 'theme_fonts[font_1]', array( 'default' => '', 'type' => 'option', 'capability' => 'edit_theme_options', ));
    $wp_customize->add_setting( 'theme_fonts[font_2]', array( 'default' => '', 'type' => 'option', 'capability' => 'edit_theme_options', ));
    $wp_customize->add_setting( 'theme_fonts[font_3]', array( 'default' => '', 'type' => 'option', 'capability' => 'edit_theme_options', ));
    $wp_customize->add_setting( 'theme_fonts[font_4]', array( 'default' => '', 'type' => 'option', 'capability' => 'edit_theme_options', ));
    $wp_customize->add_setting( 'theme_fonts[font_5]', array( 'default' => '', 'type' => 'option', 'capability' => 'edit_theme_options', ));

    // Add each font setting.
    /* !!! WARNING !!! Carfull when changing control keys. Old keys will persist in the array. Check phpMyAdmin if cleaning is needed. */
    $wp_customize->add_control(
        'font_1', array( 'label' => __( 'Font 1', 'blocklib' ), 'section' => 'typography_section', 'settings' => 'theme_fonts[font_1]', 'type' => 'text' )
    );

    $wp_customize->add_control(
        'font_2', array( 'label' => __( 'Font 2', 'blocklib' ), 'section' => 'typography_section', 'settings' => 'theme_fonts[font_2]', 'type' => 'text' )
    );

    $wp_customize->add_control(
        'font_3', array( 'label' => __( 'Font 3', 'blocklib' ), 'section' => 'typography_section', 'settings' => 'theme_fonts[font_3]', 'type' => 'text' )
    );

    $wp_customize->add_control(
        'font_4', array( 'label' => __( 'Font 4', 'blocklib' ), 'section' => 'typography_section', 'settings' => 'theme_fonts[font_4]', 'type' => 'text' )
    );

    $wp_customize->add_control(
        'font_5', array( 'label' => __( 'Font 5', 'blocklib' ), 'section' => 'typography_section', 'settings' => 'theme_fonts[font_5]', 'type' => 'text' )
    );
}

// Need to expose theme options in the REST API.
function mytheme_register_theme_options_in_rest() {

    register_setting('general', 'theme_colors', [
        'show_in_rest' => [
            'schema' => [
                'type' => 'object',
                'additionalProperties' => [
                    'type' => 'string'
                ],
            ],
        ],
        'type' => 'array',
        'default' => [],
    ]);

    register_setting('general', 'theme_fonts', [
        'show_in_rest' => [
            'schema' => [
                'type' => 'object',
                'additionalProperties' => [
                    'type' => 'string'
                ],
            ],
        ],
        'type' => 'array',
        'default' => [],
    ]);
}
add_action('rest_api_init', 'mytheme_register_theme_options_in_rest');

//****************************
// Add a custom field that stores LCP datas.
//****************************

function register_gutenberg_custom_fields() {
    register_post_meta( '', 'lcp_preload', [
        'type' => 'object',
        'single' => true,
        'show_in_rest' => [
            'schema' => [
                'type' => 'object',
                'properties' => array(
                    'url' => array('type' => 'string'),
                    'srcset' => array('type' => 'string'),
                    'sizes' => array('type' => 'string'),
                    'as' => array('type' => 'string'),
                    'mime' => array('type' => 'string')
                ),
            ],
        ]
    ]);
}
add_action('init', 'register_gutenberg_custom_fields');

function add_lcp_preload_link() {
    if (is_singular()) {
        $lcp_data = get_post_meta(get_the_ID(), 'lcp_preload', true);
        if (!empty($lcp_data) && !empty($lcp_data['url']) && !str_contains($lcp_data['mime'], 'svg')) {
            printf(
                '<link rel="preload" href="%s" imagesrcset="%s" imagesizes="%s" as="%s" type="%s">',
                esc_url($lcp_data['url']),
                esc_attr($lcp_data['srcset']),
                esc_attr($lcp_data['sizes']),
                esc_attr($lcp_data['as']),
                esc_attr($lcp_data['mime'])
            );
        } elseif (!empty($lcp_data) && !empty($lcp_data['url']) && str_contains($lcp_data['mime'], 'svg')) {
            printf(
                '<link rel="preload" href="%s" as="%s" type="%s">',
                esc_url($lcp_data['url']),
                esc_attr($lcp_data['as']),
                esc_attr($lcp_data['mime'])
            );
        }
    }
}
add_action('wp_head', 'add_lcp_preload_link', 5);


?>
