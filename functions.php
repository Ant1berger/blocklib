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
    //wp_dequeue_script( 'contact-form-7' );
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

// Disable auto-sizes to fix bug that WordPress 6.7.1 added.
add_filter( 'wp_img_tag_add_auto_sizes', '__return_false' );

//****************************
// Disable featured image button in Gutenberg. Maybe put it back another day if needed.
//****************************
function remove_featured_image_support() {
    remove_post_type_support('post', 'thumbnail');
    remove_post_type_support('page', 'thumbnail');
}
add_action('init', 'remove_featured_image_support');

//****************************
// Make media urls relative to /wp-content...
//****************************
function make_media_urls_relative( $url ) {
    // Test if $url is OK.
    if ( ! is_string( $url ) || empty( $url ) ) {
        return $url;
    }
    // Make relative path.
    $relative_path = strstr( $url, '/wp-content/' );
    // Test if relative path is OK
    if ( false === $relative_path ) {
        return $url;
    }
    return $relative_path;
}
add_filter( 'wp_get_attachment_url', 'make_media_urls_relative' );

//****************************
// Make media library use custom urls to display its own images.
// Because relative urls from "/" don't work if the website is in a sub-directory.
//****************************

// Hook principal pour intercepter les URLs d'images
add_filter('image_downsize', 'custom_medias_urls_for_admin', 10, 3);

function custom_medias_urls_for_admin($out, $id, $size) {
    // Vérifier si on est dans la media library
    if (!is_media_library_context()) {
        return false; // Laisser WordPress gérer normalement
    }

    // Récupérer les métadonnées de l'image
    $image_meta = wp_get_attachment_metadata($id);
    $image_url = wp_get_attachment_url($id);

    if (!$image_url || empty($image_meta) || !isset($image_meta['width']) || !isset($image_meta['height'])) {
        return false;
    }

    // Transformer l'URL selon ta logique
    $custom_url = transform_media_url($image_url);

    // Gérer les différentes tailles
    if ($size === 'full') {
        return array($custom_url, $image_meta['width'], $image_meta['height'], false);
    }

    // Si c'est un tableau de dimensions [width, height]
    if (is_array($size)) {
        return array($custom_url, $image_meta['width'], $image_meta['height'], false);
    }

    // Pour les tailles spécifiques (thumbnail, medium, large)
    if (isset($image_meta['sizes'][$size])) {
        $size_data = $image_meta['sizes'][$size];

        // Construire l'URL pour la taille spécifique
        $path_info = pathinfo($image_url);
        $custom_sized_url = $path_info['dirname'] . '/' . $size_data['file'];
        $custom_sized_url = transform_media_url($custom_sized_url);

        return array($custom_sized_url, $size_data['width'], $size_data['height'], true);
    }

    // Si la taille n'existe pas, retourner l'image complète
    return array($custom_url, $image_meta['width'], $image_meta['height'], false);
}

// Hook complémentaire pour être sûr
add_filter('wp_get_attachment_url', 'custom_medias_urls_for_admin_url', 10, 2);

function custom_medias_urls_for_admin_url($url, $attachment_id) {
    if (!is_media_library_context()) {
        return $url;
    }

    return transform_media_url($url);
}

// Détecter si on est dans le contexte de la media library
function is_media_library_context() {
    // Vérifier si on est dans l'admin
    if (!is_admin()) {
        return false;
    }

    global $pagenow;

    // Page upload.php (Media Library)
    if ($pagenow === 'upload.php') {
        return true;
    }

    // Requêtes AJAX de la media library
    if (defined('DOING_AJAX') && DOING_AJAX) {
        $action = $_POST['action'] ?? $_GET['action'] ?? '';

        // L'action principale qu'on a vue dans tes logs
        if ($action === 'query-attachments') {
            $referer = wp_get_referer();
            // Vérifier que le referer contient upload.php OU post.php/post-new.php (Gutenberg)
            if ($referer && (strpos($referer, 'upload.php') !== false ||
                                strpos($referer, 'post.php') !== false ||
                                strpos($referer, 'post-new.php') !== false)) {
                return true;
            }
        }

        // Actions spécifiques à Gutenberg
        $gutenberg_media_actions = array(
            'get-attachment',
            'save-attachment',
            'save-attachment-compat',
            'send-link-to-editor',
            'send-attachment-to-editor',
            'get-media-item',
            'save-attachment-order',
            // Actions spécifiques à l'éditeur de blocs
            'wp-rest-endpoint', // Pour les requêtes REST API de Gutenberg
            'heartbeat' // Parfois utilisé par Gutenberg
        );

        if (in_array($action, $gutenberg_media_actions)) {
            return true;
        }

        // Vérifier si c'est une requête REST API pour les médias
        if (isset($_SERVER['REQUEST_URI']) && strpos($_SERVER['REQUEST_URI'], '/wp-json/wp/v2/media') !== false) {
            return true;
        }
    }

    // Vérifier si on est dans l'éditeur de posts/pages (contexte Gutenberg)
    if (in_array($pagenow, array('post.php', 'post-new.php'))) {
        // Vérifier si c'est une requête pour les médias
        if (defined('DOING_AJAX') && DOING_AJAX) {
            return true; // Dans le doute, on active pour l'éditeur
        }
    }

    return false;
}

// Transformation de l'URL
function transform_media_url($original_url) {
    // Si l'URL commence déjà par http, ne pas la transformer
    if (strpos($original_url, 'http') === 0) {
        return $original_url;
    }

    return get_site_url() . $original_url;
}

//****************************
// Enqueue main styles and scripts in the frontend.
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
    register_block_type( get_stylesheet_directory() . '/custom-blocks/build/stage-content' );
    register_block_type( get_stylesheet_directory() . '/custom-blocks/build/group' );
    register_block_type( get_stylesheet_directory() . '/custom-blocks/build/grouping-link' );
    register_block_type( get_stylesheet_directory() . '/custom-blocks/build/image' );
    register_block_type( get_stylesheet_directory() . '/custom-blocks/build/knob' );
    register_block_type( get_stylesheet_directory() . '/custom-blocks/build/knob-glossy' );
    register_block_type( get_stylesheet_directory() . '/custom-blocks/build/knob-neumo' );
    register_block_type( get_stylesheet_directory() . '/custom-blocks/build/knob-clipped' );
    register_block_type( get_stylesheet_directory() . '/custom-blocks/build/stackable-link' );
    register_block_type( get_stylesheet_directory() . '/custom-blocks/build/dropdown' );
    register_block_type( get_stylesheet_directory() . '/custom-blocks/build/dropdown-content' );
    register_block_type( get_stylesheet_directory() . '/custom-blocks/build/list' );
    register_block_type( get_stylesheet_directory() . '/custom-blocks/build/list-item' );
    register_block_type( get_stylesheet_directory() . '/custom-blocks/build/language-switcher' );
    register_block_type( get_stylesheet_directory() . '/custom-blocks/build/form' );
    register_block_type( get_stylesheet_directory() . '/custom-blocks/build/embed' );
    register_block_type( get_stylesheet_directory() . '/custom-blocks/build/video' );
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
        'custom-blocks/stage-content',
        'custom-blocks/group',
        'custom-blocks/grouping-link',
        'custom-blocks/image',
        'custom-blocks/knob',
        'custom-blocks/knob-glossy',
        'custom-blocks/knob-neumo',
        'custom-blocks/knob-clipped',
        'custom-blocks/stackable-link',
        'custom-blocks/dropdown',
        'custom-blocks/dropdown-content',
        'custom-blocks/list',
        'custom-blocks/list-item',
        'custom-blocks/language-switcher',
        'custom-blocks/form',
        'custom-blocks/embed',
        'custom-blocks/video'
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
    wp_enqueue_script( 'additional-gutenberg-scripts', get_theme_file_uri('/additional-gutenberg-scripts.js'), array(), '1.0', true);

    // To pass database stuff to editor's JavaScript.
    wp_localize_script(
        'additional-gutenberg-scripts',
        'db_data',
        [
            'siteUrl' => get_site_url()
        ]
    );
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

    // Sanitize colors

    function sanitize_css_color($color) {
        if (empty($color)) {
            return '';
        }

        $color = trim($color);

        $color_patterns = array(
            // Hex colors (#fff, #ffffff)
            '/^#([A-Fa-f0-9]{3}){1,2}$/',

            // Hex colors with alpha (#fff8, #ffffff88)
            '/^#([A-Fa-f0-9]{4}){1,2}$/',

            // RGB and RGBA - old and new syntaxes
            '/^rgb\(\s*(\d{1,3}(?:\.\d+)?%?)\s*(?:,\s*|\s+)(\d{1,3}(?:\.\d+)?%?)\s*(?:,\s*|\s+)(\d{1,3}(?:\.\d+)?%?)\s*(?:\/\s*(0|1|0?\.\d+|(?:\d{1,3})?%))?\s*\)$/',

            // HSL and HSLA - old and new syntaxes
            '/^hsl\(\s*(\d+|calc\([^)]+\))\s*(?:(?:,\s*(\d{1,3}%)\s*,\s*(\d{1,3}%)|(?:\s+\d{1,3}%\s+\d{1,3}%)))\s*(?:\/\s*(0|1|0?\.\d+|(?:\d{1,3})?%))?\s*\)$/',

            // LCH
            '/^lch\(\s*(\d+(?:\.\d+)?%?|0?\.\d+%?)\s+(\d+(?:\.\d+)?%?|0?\.\d+%?)\s+(\d+(?:\.\d+)?(?:deg|rad|grad|turn)?|0?\.\d+(?:deg|rad|grad|turn)?)\s*(?:\/\s*(\d+(?:\.\d+)?%?|0?\.\d+%?))?\s*\)$/i',

            // OKLCH
            '/^oklch\(\s*(\d+(?:\.\d+)?%?|0?\.\d+%?)\s+(\d+(?:\.\d+)?%?|0?\.\d+%?)\s+(\d+(?:\.\d+)?(?:deg|rad|grad|turn)?|0?\.\d+(?:deg|rad|grad|turn)?)\s*(?:\/\s*(\d+(?:\.\d+)?%?|0?\.\d+%?))?\s*\)$/i',

            // Keywords
            '/^(aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen|transparent|currentcolor|inherit)$/i',
        );

        foreach ($color_patterns as $pattern) {
            if (preg_match($pattern, $color)) {
                return $color;
            }
        }

        return '';
    }

    // Add colors array setting.
    $wp_customize->add_setting( 'theme_colors[brand_1]', array( 'default' => '', 'type' => 'option', 'capability' => 'edit_theme_options', 'sanitize_callback' => 'sanitize_css_color' ));
    $wp_customize->add_setting( 'theme_colors[brand_2]', array( 'default' => '', 'type' => 'option', 'capability' => 'edit_theme_options', 'sanitize_callback' => 'sanitize_css_color' ));
    $wp_customize->add_setting( 'theme_colors[brand_3]', array( 'default' => '', 'type' => 'option', 'capability' => 'edit_theme_options', 'sanitize_callback' => 'sanitize_css_color' ));
    $wp_customize->add_setting( 'theme_colors[brand_4]', array( 'default' => '', 'type' => 'option', 'capability' => 'edit_theme_options', 'sanitize_callback' => 'sanitize_css_color' ));
    $wp_customize->add_setting( 'theme_colors[brand_5]', array( 'default' => '', 'type' => 'option', 'capability' => 'edit_theme_options', 'sanitize_callback' => 'sanitize_css_color' ));
    $wp_customize->add_setting( 'theme_colors[brand_6]', array( 'default' => '', 'type' => 'option', 'capability' => 'edit_theme_options', 'sanitize_callback' => 'sanitize_css_color' ));
    $wp_customize->add_setting( 'theme_colors[brand_7]', array( 'default' => '', 'type' => 'option', 'capability' => 'edit_theme_options', 'sanitize_callback' => 'sanitize_css_color' ));
    $wp_customize->add_setting( 'theme_colors[brand_8]', array( 'default' => '', 'type' => 'option', 'capability' => 'edit_theme_options', 'sanitize_callback' => 'sanitize_css_color' ));
    $wp_customize->add_setting( 'theme_colors[brand_9]', array( 'default' => '', 'type' => 'option', 'capability' => 'edit_theme_options', 'sanitize_callback' => 'sanitize_css_color' ));
    $wp_customize->add_setting( 'theme_colors[brand_10]', array( 'default' => '', 'type' => 'option', 'capability' => 'edit_theme_options', 'sanitize_callback' => 'sanitize_css_color' ));
    $wp_customize->add_setting( 'theme_colors[cool]', array( 'default' => '', 'type' => 'option', 'capability' => 'edit_theme_options', 'sanitize_callback' => 'sanitize_css_color' ));
    $wp_customize->add_setting( 'theme_colors[relax]', array( 'default' => '', 'type' => 'option', 'capability' => 'edit_theme_options', 'sanitize_callback' => 'sanitize_css_color' ));
    $wp_customize->add_setting( 'theme_colors[warning]', array( 'default' => '', 'type' => 'option', 'capability' => 'edit_theme_options', 'sanitize_callback' => 'sanitize_css_color' ));
    $wp_customize->add_setting( 'theme_colors[danger]', array( 'default' => '', 'type' => 'option', 'capability' => 'edit_theme_options', 'sanitize_callback' => 'sanitize_css_color' ));
    $wp_customize->add_setting( 'theme_colors[grey_start]', array( 'default' => '', 'type' => 'option', 'capability' => 'edit_theme_options', 'sanitize_callback' => 'sanitize_css_color' ));
    $wp_customize->add_setting( 'theme_colors[grey_end]', array( 'default' => '', 'type' => 'option', 'capability' => 'edit_theme_options', 'sanitize_callback' => 'sanitize_css_color' ));
    $wp_customize->add_setting( 'theme_colors[transparent]', array( 'default' => '', 'type' => 'option', 'capability' => 'edit_theme_options', 'sanitize_callback' => 'sanitize_css_color' ));

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
        'brand_6', array( 'label' => __( 'Brand 6', 'blocklib' ), 'section' => 'colors_section', 'settings' => 'theme_colors[brand_6]', 'type' => 'text' )
    );

    $wp_customize->add_control(
        'brand_7', array( 'label' => __( 'Brand 7', 'blocklib' ), 'section' => 'colors_section', 'settings' => 'theme_colors[brand_7]', 'type' => 'text' )
    );

    $wp_customize->add_control(
        'brand_8', array( 'label' => __( 'Brand 8', 'blocklib' ), 'section' => 'colors_section', 'settings' => 'theme_colors[brand_8]', 'type' => 'text' )
    );

    $wp_customize->add_control(
        'brand_9', array( 'label' => __( 'Brand 9', 'blocklib' ), 'section' => 'colors_section', 'settings' => 'theme_colors[brand_9]', 'type' => 'text' )
    );

    $wp_customize->add_control(
        'brand_10', array( 'label' => __( 'Brand 10', 'blocklib' ), 'section' => 'colors_section', 'settings' => 'theme_colors[brand_10]', 'type' => 'text' )
    );

    $wp_customize->add_control(
        'cool', array( 'label' => __( 'Cool', 'blocklib' ), 'section' => 'colors_section', 'settings' => 'theme_colors[cool]', 'type' => 'text' )
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

    $wp_customize->add_control(
        'transparent', array( 'label' => __( 'Transparent', 'blocklib' ), 'section' => 'colors_section', 'settings' => 'theme_colors[transparent]', 'type' => 'text' )
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

    register_setting('general', 'font_matching_mapping', [
        'show_in_rest' => [
            'schema' => [
                'type' => 'array',
                'items' => [
                    'type' => 'object',
                    'properties' => [
                        'variable' => [
                            'type' => 'string'
                        ],
                        'font_family' => [
                            'type' => 'string'
                        ]
                    ]
                ]
            ],
        ],
        'type' => 'array',
        'default' => [],
    ]);
}
add_action('rest_api_init', 'mytheme_register_theme_options_in_rest');

//****************************
// A new way to manage fonts with WP 6.5 Font Manager.
//****************************
function get_fonts_from_global_styles() {
    $global_styles_posts = get_posts([
        'post_type' => 'wp_global_styles',
        'post_status' => 'publish',
        'numberposts' => -1
    ]);

    $fonts_data = [];

    foreach ($global_styles_posts as $post) {
        $content = json_decode($post->post_content, true);

        // Do we have custom fonts ?
        if (isset($content['settings']['typography']['fontFamilies']['custom'])) {
            $custom_fonts = $content['settings']['typography']['fontFamilies']['custom'];

            foreach ($custom_fonts as $font) {
                // Avoid duplicate (same slug)
                $exists = false;
                foreach ($fonts_data as $existing_font) {
                    if ($existing_font['slug'] === $font['slug']) {
                        $exists = true;
                        break;
                    }
                }

                if (!$exists) {
                    $fonts_data[] = [
                        'name' => $font['name'],
                        'slug' => $font['slug'],
                        'fontFamily' => $font['fontFamily']
                    ];
                }
            }
        }
    }

    return $fonts_data;
}

// Saving matchings in wp_options
function save_font_matching_mapping($mappings) {
    update_option('font_matching_mapping', $mappings);
}

// Retrieving matchings (empty array if nothing)
function get_font_matching_mapping() {
    return get_option('font_matching_mapping', []);
}

if (is_admin()) {
    require_once get_template_directory() . '/inc/font-matching/font-matching.php';
}

function generate_font_css_variables() {
    $mappings = get_font_matching_mapping();

    if (empty($mappings)) {
        return '';
    }

    $css_variables = [];

    foreach ($mappings as $mapping) {
        $variable_name = $mapping['variable'];
        $font_family = $mapping['font_family'];

        $css_variables[] = "{$variable_name}: {$font_family};";
    }

    return implode('; ', $css_variables);
}

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
// To insert theme variables into the main CSS.
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

:root {

' . writeCssVariablesFromThemeOptions( 'theme_colors' ) . '

' . generate_font_css_variables() . '

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
/* Fonts: @font-face are automatically created by the new WP Font Manager and that is great! */
/********/

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

/* Our custom properties for predifined styles must not inherit sometimes. */
/* And they should not have initial values either: properties of which they are the values should themselve fallback to their own initial values. */
/* But Chrome seems to not apply inherits: false; if there is no initial value, so we try to mimic the native CSS initial value. */

@property --color {
    syntax: "*";
    inherits: true;
}

@property --bgColor {
    syntax: "*";
    inherits: false;
    initial-value: transparent;
}

@property --borderColor {
    syntax: "*";
    inherits: false;
    initial-value: currentcolor;
}

@property --fontFamily {
    syntax: "*";
    inherits: true;
}

@property --size {
    syntax: "*";
    inherits: true;
}

@media(prefers-reduced-motion: no-preference) {

    [class="blb-html"],
    [class="block-editor-iframe__html"] { /* Styles scoped to avoid bleeding outside the editor iframe. */
        scroll-behavior: smooth;
    }
}

[class="blb-html"],
[class="block-editor-iframe__html"] { /* Styles scoped to avoid bleeding outside the editor iframe. */

    body {
        margin: 0;
        font-family: var(--font_1);
        font-size: 1rem;
        color: var(--grey_start);
        min-inline-size: 20rem;
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

    .noScript {
        background-color: var(--grey_end);
        padding: 1rem;
        color: var(--grey_start);
        display: block;
        position: relative;
        z-index: 1000000;
    }
}

/* To hide page title on editing area. */
.editor-visual-editor__post-title-wrapper {
    display: none;
}

/* To see white stuff in composition editor. */
.block-editor-iframe__body:not(.post-type-page) {
    background-color: #eeeeee;
}

/* Disable styles of some intermediary editor blocks to preserve the WYSIWYG experience */
/* For Stage and Dropdown blocks */
.is-root-container .stage > .block-editor-inner-blocks,
.is-root-container .stage > .block-editor-inner-blocks > .block-editor-block-list__layout,
.is-root-container .stage-content > .block-editor-inner-blocks,
.is-root-container .stage-content > .block-editor-inner-blocks > .block-editor-block-list__layout,
.is-root-container .dropdown > .block-editor-inner-blocks,
.is-root-container .dropdown > .block-editor-inner-blocks > .block-editor-block-list__layout {
    display: contents;
}

/* To apply a background image to iframes when they have no url yet. */
.is-root-container iframe.embed[src=""] {
    background-image: url(' . get_template_directory_uri() . '/assets/images/iframe.webp);
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    background-color: lightgray;
}

';
}
?>
