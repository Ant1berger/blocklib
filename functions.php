<?php

//****************************
// Remove block theme support.
//****************************
remove_theme_support( 'block-templates' );

//****************************
// Remove type attribute in <script> and <style>.
//****************************
function register_html_support() {
    add_theme_support( 'html5', array( 'script', 'style' ) );
}
add_action( 'after_setup_theme', 'register_html_support' );

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

/* DISABLE GUTENBERG STYLE IN HEADER| WordPress 5.9 */
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
/* In addition to that, the first line of the svg file must be: <?xml version="1.0" encoding="UTF-8"?> */
function wpc_mime_types($mimes) {
    $mimes['svg'] = 'image/svg+xml';
    return $mimes;
}
add_filter('upload_mimes', 'wpc_mime_types');

//****************************
// Disable lazy loading on images (it is handled in the image block).
//****************************
add_filter( 'wp_lazy_loading_enabled', '__return_false' );

// Disable auto-sizes to fix bug that WordPress 671 added.
add_filter( 'wp_img_tag_add_auto_sizes', '__return_false' );

//****************************
// Enqueue main styles and scripts
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

    // We take our main styles and scripts...
    $main_css_content = get_custom_block_common_styles();
    $main_js_path = get_template_directory() . '/main.js';

    // ... And we inject their content inside our registered <style> and <script> shells.
    wp_add_inline_style('blb-main', $main_css_content);
    if (file_exists($main_js_path)) {
        $main_js_content = file_get_contents($main_js_path);
        wp_add_inline_script('blb-main-inline', $main_js_content);
    }

    // And let's finally enqueue all this.
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
// A bit similar to the previous: we initialise a variable to compile all blocks instances styles.
//****************************
$components_instances_styles = '';

//****************************
// Register Gutenberg custom blocks.
//****************************
function theme_register_blocks() {
    register_block_type( get_stylesheet_directory() . '/custom-blocks/build/title' );
    register_block_type( get_stylesheet_directory() . '/custom-blocks/build/text' );
    register_block_type( get_stylesheet_directory() . '/custom-blocks/build/stage' );
    register_block_type( get_stylesheet_directory() . '/custom-blocks/build/group' );
    register_block_type( get_stylesheet_directory() . '/custom-blocks/build/grouping-link' );
    register_block_type( get_stylesheet_directory() . '/custom-blocks/build/image' );
    register_block_type( get_stylesheet_directory() . '/custom-blocks/build/knob' );
    register_block_type( get_stylesheet_directory() . '/custom-blocks/build/stackable-link' );
    register_block_type( get_stylesheet_directory() . '/custom-blocks/build/dropdown' );
    register_block_type( get_stylesheet_directory() . '/custom-blocks/build/list' );
}
add_action( 'init', 'theme_register_blocks' );

//****************************
// We only want our custom blocks in the Gutenberg editor (and a few more).
//****************************
function custom_allowed_block_types( $allowed_block_types, $block_editor_context ) {
    $allowed_block_types = array(
        'core/paragraph', // To keep the ability to insert blocks, copy/paste etc.
        'core/block', // To allow the creation of Patterns.
        'custom-blocks/text',
        'custom-blocks/title',
        'custom-blocks/stage',
        'custom-blocks/group',
        'custom-blocks/grouping-link',
        'custom-blocks/image',
        'custom-blocks/knob',
        'custom-blocks/stackable-link',
        'custom-blocks/dropdown',
        'custom-blocks/list'
    );
    return $allowed_block_types;
}
add_filter( 'allowed_block_types_all', 'custom_allowed_block_types', 10, 2 );

//****************************
// Add styles to Admin.
//****************************
function theme_admin_styles() {
    wp_enqueue_style('admin_style', get_theme_file_uri('admin.css'));
}
add_action('admin_enqueue_scripts', 'theme_admin_styles');

//****************************
// Add styles and scripts to Gutenberg editor.
//****************************
// For the Gutenberg interface.
function add_scripts_to_gutenberg() {
    wp_enqueue_style( 'additional-gutenberg-styles', get_theme_file_uri('/additional-gutenberg-styles.css'), array(), '1.0');
    wp_enqueue_script( 'additional-gutenberg-scripts', get_theme_file_uri('/additional-gutenberg-scripts.js'), array(), '1.0');
}
add_action('enqueue_block_editor_assets', 'add_scripts_to_gutenberg');
// For inside the editing area iframe to get a true WYSIWYG.
add_action('enqueue_block_editor_assets', function() {
    wp_add_inline_style('wp-edit-blocks', get_custom_block_common_styles());
});

//****************************
// Bring blocks styles (blocks global styles AND instances styles) into the <head> for a better page quality in the front-end.
//****************************
add_action('template_redirect', function () {
    // Start buffering to capture the whole document.
    ob_start();
});

add_action('shutdown', function () {
    global $components, $components_instances_styles;

    // Stop buffering and give the result to $final_output.
    $final_output = ob_get_clean();
    if (!$final_output) {
        return;
    }

    // Loop between blocks to retrieve their global styles.
    $inline_styles = '';
    foreach ($components as $component) {
        $style_path = get_template_directory() . "/custom-blocks/build/{$component}/index.css";
        if (file_exists($style_path)) {
            $inline_styles .= file_get_contents($style_path) . "\n";
        }
    }

    // Add instances styles to global styles.
    $inline_styles .= $components_instances_styles . "\n";

    if (!empty($inline_styles)) {
        // Inject all styles into a <style> tag
        $style_tag = "<style id='blb-blocks-inline-css'>\n" . $inline_styles . "</style>";

        // Inject the <style> tag before the end of <head>.
        $final_output = preg_replace(
            '/<\/head>/',
            $style_tag . "\n</head>",
            $final_output,
            1
        );
    }

    // Render the modified content
    echo $final_output;
}, 0);

//****************************
// Add theme customizer options.
//****************************
add_action( 'customize_register', 'my_theme_customize_register' );
function my_theme_customize_register( $wp_customize ) {

    // Add Graphic Chart panel
    $wp_customize->add_panel( 'graphic_chart_panel', array(
        'title' => __( 'Graphic Chart', 'blocklib' ),
        'description' => __( 'Manage styles of the site: colors, fonts, etc.', 'blocklib' ),
        'priority' => 10,
    ));

    // Add Colors section
    $wp_customize->add_section(
        // ID
        'colors_section',
        // Arguments array
        array(
            'title' => __( 'Colors', 'blocklib' ),
            'panel' => 'graphic_chart_panel',
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

//****************************
// Add a filter to retrieve SVG's dimensions:
// WordPress doesn't retrieves SVG dimensions easily, so when we need an image width and height
// from wp_get_attachment_image_src, we must add a "dig into the svg" function to retrieve its dimensions from the viewbox.
//****************************
add_filter( 'wp_get_attachment_image_src', 'fix_wp_get_attachment_image_svg', 10, 4 );
function fix_wp_get_attachment_image_svg($image, $attachment_id, $size, $icon) {
    if (is_array($image) && preg_match('/\.svg$/i', $image[0]) && $image[1] <= 1) {
        if(is_array($size)) {
            $image[1] = $size[0];
            $image[2] = $size[1];
        } elseif(($xml = simplexml_load_file($image[0])) !== false) {
            $attr = $xml->attributes();
            $viewbox = explode(' ', $attr->viewBox);
            $image[1] = isset($attr->width) && preg_match('/\d+/', $attr->width, $value) ? (int) $value[0] : (count($viewbox) == 4 ? (int) $viewbox[2] : null);
            $image[2] = isset($attr->height) && preg_match('/\d+/', $attr->height, $value) ? (int) $value[0] : (count($viewbox) == 4 ? (int) $viewbox[3] : null);
        } else {
            $image[1] = $image[2] = null;
        }
    }
    return $image;
}

//****************************
// to insert theme variables into the main CSS.
//****************************
function writeCssVariablesFromThemeOptions( $optionId ) {
    $css_vars_array = array();
    foreach(get_option( $optionId ) as $key => $value) {
        if ( isset($value) && !empty($value) ) {
            $css_vars_array[] .= '    --' . $key . ': ' . $value . ';';
        }
    }
    return implode("\n", $css_vars_array);
}

//****************************
// Global and dynamic website styles for both the front-end <head> and the Gutenberg editor.
// I'd have prefered to put them in a separated PHP file but I couldn't do it
// nor from a file include (or equivalent) because servers might forbid them in functions.php for security reasons,
// nor from a global variable,
// nor from a filter. None of those three worked. Let's try something else some time.
//****************************
function get_custom_block_common_styles() {
    return '
/**********************************/
/* Global styles for every pages */
/* Order matters: keep variables first */
/*************************************/

/**************/
/* Variables */
/************/

/* As a reminder for media queries:
    $sm: 480px;
    $md: 768px;
    $lg: 992px;
    $xl: 1280px;
*/
:root {

' . writeCssVariablesFromThemeOptions( 'theme_colors' ) . '

' . writeCssVariablesFromThemeOptions( 'theme_fonts' ) . '

    /* Some recurring lengths */
    --stagePadding: 1rem;
    --headerPadding: 1.2rem;
    --headerHeight: 8rem;
    &:has(.-pageScrolled) {
        --headerHeight: 6rem;
    }

    @media(min-width: 992px) {
        --stagePadding: 3rem;
        --headerPadding: 1.8rem;
        --headerHeight: 12rem;
        &:has(.-pageScrolled) {
            --headerHeight: 8rem;
        }
    }
}

/**********/
/* Fonts */
/********/

/* math */
@font-face {
    font-family: "Bodoni Moda";
    font-style: italic;
    font-weight: 400 900;
    font-display: swap;
    src: url(' . get_template_directory_uri() . '/assets/fonts/bodonimoda-italic-math.woff2) format("woff2");
    unicode-range: U+0302-0303, U+0305, U+0307-0308, U+0330, U+0391-03A1, U+03A3-03A9, U+03B1-03C9, U+03D1, U+03D5-03D6, U+03F0-03F1, U+03F4-03F5, U+2034-2037, U+2057, U+20D0-20DC, U+20E1, U+20E5-20EF, U+2102, U+210A-210E, U+2110-2112, U+2115, U+2119-211D, U+2124, U+2128, U+212C-212D, U+212F-2131, U+2133-2138, U+213C-2140, U+2145-2149, U+2190, U+2192, U+2194-21AE, U+21B0-21E5, U+21F1-21F2, U+21F4-2211, U+2213-2214, U+2216-22FF, U+2308-230B, U+2310, U+2319, U+231C-2321, U+2336-237A, U+237C, U+2395, U+239B-23B6, U+23D0, U+23DC-23E1, U+2474-2475, U+25AF, U+25B3, U+25B7, U+25BD, U+25C1, U+25CA, U+25CC, U+25FB, U+266D-266F, U+27C0-27FF, U+2900-2AFF, U+2B0E-2B11, U+2B30-2B4C, U+2BFE, U+FF5B, U+FF5D, U+1D400-1D7FF, U+1EE00-1EEFF;
}
/* symbols */
@font-face {
    font-family: "Bodoni Moda";
    font-style: italic;
    font-weight: 400 900;
    font-display: swap;
    src: url(' . get_template_directory_uri() . '/assets/fonts/bodonimoda-italic-symbol.woff2) format("woff2");
    unicode-range: U+0001-000C, U+000E-001F, U+007F-009F, U+20DD-20E0, U+20E2-20E4, U+2150-218F, U+2190, U+2192, U+2194-2199, U+21AF, U+21E6-21F0, U+21F3, U+2218-2219, U+2299, U+22C4-22C6, U+2300-243F, U+2440-244A, U+2460-24FF, U+25A0-27BF, U+2800-28FF, U+2921-2922, U+2981, U+29BF, U+29EB, U+2B00-2BFF, U+4DC0-4DFF, U+FFF9-FFFB, U+10140-1018E, U+10190-1019C, U+101A0, U+101D0-101FD, U+102E0-102FB, U+10E60-10E7E, U+1D2C0-1D2D3, U+1D2E0-1D37F, U+1F000-1F0FF, U+1F100-1F1AD, U+1F1E6-1F1FF, U+1F30D-1F30F, U+1F315, U+1F31C, U+1F31E, U+1F320-1F32C, U+1F336, U+1F378, U+1F37D, U+1F382, U+1F393-1F39F, U+1F3A7-1F3A8, U+1F3AC-1F3AF, U+1F3C2, U+1F3C4-1F3C6, U+1F3CA-1F3CE, U+1F3D4-1F3E0, U+1F3ED, U+1F3F1-1F3F3, U+1F3F5-1F3F7, U+1F408, U+1F415, U+1F41F, U+1F426, U+1F43F, U+1F441-1F442, U+1F444, U+1F446-1F449, U+1F44C-1F44E, U+1F453, U+1F46A, U+1F47D, U+1F4A3, U+1F4B0, U+1F4B3, U+1F4B9, U+1F4BB, U+1F4BF, U+1F4C8-1F4CB, U+1F4D6, U+1F4DA, U+1F4DF, U+1F4E3-1F4E6, U+1F4EA-1F4ED, U+1F4F7, U+1F4F9-1F4FB, U+1F4FD-1F4FE, U+1F503, U+1F507-1F50B, U+1F50D, U+1F512-1F513, U+1F53E-1F54A, U+1F54F-1F5FA, U+1F610, U+1F650-1F67F, U+1F687, U+1F68D, U+1F691, U+1F694, U+1F698, U+1F6AD, U+1F6B2, U+1F6B9-1F6BA, U+1F6BC, U+1F6C6-1F6CF, U+1F6D3-1F6D7, U+1F6E0-1F6EA, U+1F6F0-1F6F3, U+1F6F7-1F6FC, U+1F700-1F7FF, U+1F800-1F80B, U+1F810-1F847, U+1F850-1F859, U+1F860-1F887, U+1F890-1F8AD, U+1F8B0-1F8B1, U+1F900-1F90B, U+1F93B, U+1F946, U+1F984, U+1F996, U+1F9E9, U+1FA00-1FA6F, U+1FA70-1FA7C, U+1FA80-1FA88, U+1FA90-1FABD, U+1FABF-1FAC5, U+1FACE-1FADB, U+1FAE0-1FAE8, U+1FAF0-1FAF8, U+1FB00-1FBFF;
}
/* latin-ext */
@font-face {
    font-family: "Bodoni Moda";
    font-style: italic;
    font-weight: 400 900;
    font-display: swap;
    src: url(' . get_template_directory_uri() . '/assets/fonts/bodonimoda-italic-latinext.woff2) format("woff2");
    unicode-range: U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
    font-family: "Bodoni Moda";
    font-style: italic;
    font-weight: 400 900;
    font-display: swap;
    src: url(' . get_template_directory_uri() . '/assets/fonts/bodonimoda-italic-latin.woff2) format("woff2");
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* math */
@font-face {
    font-family: "Bodoni Moda";
    font-style: normal;
    font-weight: 400 900;
    font-display: swap;
    src: url(' . get_template_directory_uri() . '/assets/fonts/bodonimoda-normal-math.woff2) format("woff2");
    unicode-range: U+0302-0303, U+0305, U+0307-0308, U+0330, U+0391-03A1, U+03A3-03A9, U+03B1-03C9, U+03D1, U+03D5-03D6, U+03F0-03F1, U+03F4-03F5, U+2034-2037, U+2057, U+20D0-20DC, U+20E1, U+20E5-20EF, U+2102, U+210A-210E, U+2110-2112, U+2115, U+2119-211D, U+2124, U+2128, U+212C-212D, U+212F-2131, U+2133-2138, U+213C-2140, U+2145-2149, U+2190, U+2192, U+2194-21AE, U+21B0-21E5, U+21F1-21F2, U+21F4-2211, U+2213-2214, U+2216-22FF, U+2308-230B, U+2310, U+2319, U+231C-2321, U+2336-237A, U+237C, U+2395, U+239B-23B6, U+23D0, U+23DC-23E1, U+2474-2475, U+25AF, U+25B3, U+25B7, U+25BD, U+25C1, U+25CA, U+25CC, U+25FB, U+266D-266F, U+27C0-27FF, U+2900-2AFF, U+2B0E-2B11, U+2B30-2B4C, U+2BFE, U+FF5B, U+FF5D, U+1D400-1D7FF, U+1EE00-1EEFF;
}
/* symbols */
@font-face {
    font-family: "Bodoni Moda";
    font-style: normal;
    font-weight: 400 900;
    font-display: swap;
    src: url(' . get_template_directory_uri() . '/assets/fonts/bodonimoda-normal-symbol.woff2) format("woff2");
    unicode-range: U+0001-000C, U+000E-001F, U+007F-009F, U+20DD-20E0, U+20E2-20E4, U+2150-218F, U+2190, U+2192, U+2194-2199, U+21AF, U+21E6-21F0, U+21F3, U+2218-2219, U+2299, U+22C4-22C6, U+2300-243F, U+2440-244A, U+2460-24FF, U+25A0-27BF, U+2800-28FF, U+2921-2922, U+2981, U+29BF, U+29EB, U+2B00-2BFF, U+4DC0-4DFF, U+FFF9-FFFB, U+10140-1018E, U+10190-1019C, U+101A0, U+101D0-101FD, U+102E0-102FB, U+10E60-10E7E, U+1D2C0-1D2D3, U+1D2E0-1D37F, U+1F000-1F0FF, U+1F100-1F1AD, U+1F1E6-1F1FF, U+1F30D-1F30F, U+1F315, U+1F31C, U+1F31E, U+1F320-1F32C, U+1F336, U+1F378, U+1F37D, U+1F382, U+1F393-1F39F, U+1F3A7-1F3A8, U+1F3AC-1F3AF, U+1F3C2, U+1F3C4-1F3C6, U+1F3CA-1F3CE, U+1F3D4-1F3E0, U+1F3ED, U+1F3F1-1F3F3, U+1F3F5-1F3F7, U+1F408, U+1F415, U+1F41F, U+1F426, U+1F43F, U+1F441-1F442, U+1F444, U+1F446-1F449, U+1F44C-1F44E, U+1F453, U+1F46A, U+1F47D, U+1F4A3, U+1F4B0, U+1F4B3, U+1F4B9, U+1F4BB, U+1F4BF, U+1F4C8-1F4CB, U+1F4D6, U+1F4DA, U+1F4DF, U+1F4E3-1F4E6, U+1F4EA-1F4ED, U+1F4F7, U+1F4F9-1F4FB, U+1F4FD-1F4FE, U+1F503, U+1F507-1F50B, U+1F50D, U+1F512-1F513, U+1F53E-1F54A, U+1F54F-1F5FA, U+1F610, U+1F650-1F67F, U+1F687, U+1F68D, U+1F691, U+1F694, U+1F698, U+1F6AD, U+1F6B2, U+1F6B9-1F6BA, U+1F6BC, U+1F6C6-1F6CF, U+1F6D3-1F6D7, U+1F6E0-1F6EA, U+1F6F0-1F6F3, U+1F6F7-1F6FC, U+1F700-1F7FF, U+1F800-1F80B, U+1F810-1F847, U+1F850-1F859, U+1F860-1F887, U+1F890-1F8AD, U+1F8B0-1F8B1, U+1F900-1F90B, U+1F93B, U+1F946, U+1F984, U+1F996, U+1F9E9, U+1FA00-1FA6F, U+1FA70-1FA7C, U+1FA80-1FA88, U+1FA90-1FABD, U+1FABF-1FAC5, U+1FACE-1FADB, U+1FAE0-1FAE8, U+1FAF0-1FAF8, U+1FB00-1FBFF;
}
/* latin-ext */
@font-face {
    font-family: "Bodoni Moda";
    font-style: normal;
    font-weight: 400 900;
    font-display: swap;
    src: url(' . get_template_directory_uri() . '/assets/fonts/bodonimoda-normal-latinext.woff2) format("woff2");
    unicode-range: U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
    font-family: "Bodoni Moda";
    font-style: normal;
    font-weight: 400 900;
    font-display: swap;
    src: url(' . get_template_directory_uri() . '/assets/fonts/bodonimoda-normal-latin.woff2) format("woff2");
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic */
@font-face {
    font-family: "Jost";
    font-style: italic;
    font-weight: 100 900;
    font-display: swap;
    src: url(' . get_template_directory_uri() . '/assets/fonts/jost-italic-cyrillic.woff2) format("woff2");
    unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* latin-ext */
@font-face {
    font-family: "Jost";
    font-style: italic;
    font-weight: 100 900;
    font-display: swap;
    src: url(' . get_template_directory_uri() . '/assets/fonts/jost-italic-latinext.woff2) format("woff2");
    unicode-range: U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
    font-family: "Jost";
    font-style: italic;
    font-weight: 100 900;
    font-display: swap;
    src: url(' . get_template_directory_uri() . '/assets/fonts/jost-italic-latin.woff2) format("woff2");
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic */
@font-face {
    font-family: "Jost";
    font-style: normal;
    font-weight: 100 900;
    font-display: swap;
    src: url(' . get_template_directory_uri() . '/assets/fonts/jost-normal-cyrillic.woff2) format("woff2");
    unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* latin-ext */
@font-face {
    font-family: "Jost";
    font-style: normal;
    font-weight: 100 900;
    font-display: swap;
    src: url(' . get_template_directory_uri() . '/assets/fonts/jost-normal-latinext.woff2) format("woff2");
    unicode-range: U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
    font-family: "Jost";
    font-style: normal;
    font-weight: 100 900;
    font-display: swap;
    src: url(' . get_template_directory_uri() . '/assets/fonts/jost-normal-latin.woff2) format("woff2");
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/***********/
/* Global */
/*********/

/* carefull with those two : test contrast for accessibility. Should be optional. */
/* * {
    scrollbar-color: var(--brand_1) var(--brand_2);
}

::selection {
    color: var(--brand_2);
    background-color: var(--brand_1);
} */

html {
    font-size: 62.5%;
    -webkit-text-size-adjust: none; /* for iOS Safari */
    text-size-adjust: none; /* for other mobile browsers */
}

@media(prefers-reduced-motion: no-preference) {

    html {
        scroll-behavior: smooth;
    }
}

body {
    margin: 0;
    font-family: var(--font_1);
    font-size: 1.6rem;
    color: var(--grey_start);
    min-inline-size: 32rem;
    min-block-size: 100vh;
    display: flex;
    flex-direction: column;

    &:has(.menuOpen) {
        overflow: hidden;

        @media(min-width: 1240px) {
            overflow: visible;
        }
    }
}

*,
*::before,
*::after {
    box-sizing: border-box;
    border: none;
}

label,
button,
select,
summary,
[type=radio],
[type=submit],
[type=checkbox] {
    cursor: pointer;
}

article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section {
display: block;
}

.noScript {
    background-color: var(--grey_end);
    padding: 1rem;
    color: var(--grey_start);
    display: block;
    position: relative;
    z-index: 1000000;
}

/* To hide page title on editing area. */
.editor-visual-editor__post-title-wrapper {
    display: none;
}

/* To see transparent header in composition editor. */
.block-editor-iframe__body:not(.post-type-page) {
    background-color: #eeeeee;
}
';
}
?>
