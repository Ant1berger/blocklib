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

function output_custom_css_directly() {
    $custom_css = wp_get_custom_css();
    if (!empty($custom_css)) {
        echo '<style id="wp-custom-css" type="text/css">' . "\n";
        echo $custom_css;
        echo "\n" . '</style>' . "\n";
    }
}
add_action('wp_head', 'output_custom_css_directly', 101);

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
// Remove REST API stuff (REST API remains available though).
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
// Fix Polylang JavaScript error in block theme Customizer.
//****************************
function fix_polylang_block_theme_customizer() {
    // Only in Customizer context
    if (!is_customize_preview() && !isset($_GET['customize_theme'])) {
        return;
    }
    // Check if we're in a block theme and Polylang is active
    if (wp_is_block_theme() && defined('POLYLANG_VERSION')) {
        // Remove Polylang's widgets customizer scripts
        remove_action('customize_controls_enqueue_scripts', array('PLL_Admin_Customize', 'customize_controls_enqueue_scripts'));

        // If that doesn't work, try this alternative
        add_action('customize_controls_enqueue_scripts', function() {
            wp_dequeue_script('pll_widgets');
            wp_deregister_script('pll_widgets');
        }, 999);
    }
}
add_action('init', 'fix_polylang_block_theme_customizer');

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
    register_block_type( get_stylesheet_directory() . '/custom-blocks/build/trigger' );
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
        'custom-blocks/trigger',
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
    wp_enqueue_style( 'additional-gutenberg-ui-styles', get_theme_file_uri('/additional-gutenberg-ui-styles.css'), array(), '1.0');
    wp_enqueue_script( 'additional-gutenberg-ui-scripts', get_theme_file_uri('/additional-gutenberg-ui-scripts.js'), array(), '1.0', true);

    // To pass database stuff to editor's JavaScript.
    wp_localize_script(
        'additional-gutenberg-ui-scripts',
        'db_data',
        [
            'siteUrl' => get_site_url()
        ]
    );
}
add_action('enqueue_block_editor_assets', 'add_scripts_to_gutenberg');

// For the editor iframe AND UI (avoid using it for UI only, use the above instead).
function enqueue_editor_iframe_assets() {
    if ( is_admin() ) { // Yes it runs in the frontend as well, so carefull with it.
        wp_enqueue_script(
            'additional-gutenberg-iframe-scripts',
            get_theme_file_uri('/additional-gutenberg-iframe-scripts.js'),
            array(
                'wp-data',          // Pour wp.data
                'wp-api-fetch',     // Pour wp.apiFetch
                'wp-edit-post',     // Pour l'éditeur Gutenberg
                'wp-editor'         // Pour les fonctions d'édition
            ),
            '1.0.0',
            true
        );
        wp_enqueue_style(
            'additional-gutenberg-iframe-scripts',
            get_theme_file_uri('/additional-gutenberg-iframe-styles.css')
        );
    }
}
add_action( 'enqueue_block_assets', 'enqueue_editor_iframe_assets' );

// For inside the editing area iframe to get a true WYSIWYG.
// This one doesn't work like the others.
add_action('enqueue_block_editor_assets', function() {
    // The global CSS from global-dynamic-css.php
    wp_add_inline_style('wp-edit-blocks', get_custom_block_common_styles());
    // The global CSS from Customizer => Additional CSS
    $custom_css = wp_get_custom_css();
    if (!empty($custom_css)) {
        wp_add_inline_style('wp-edit-blocks', $custom_css);
    }
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
// Add a meta boxe to allow adding CSS and JS to pages.
//****************************
// Enqueue code editor assets only once for both editors
function enqueue_custom_editors_assets() {
    // Check if we're on a post edit screen
    $screen = get_current_screen();
    if ($screen && in_array($screen->base, ['post', 'page'])) {
        // Enqueue base code editor
        wp_enqueue_code_editor(['type' => 'text/css']);

        // Manually enqueue JavaScript mode for CodeMirror
        wp_enqueue_script('code-editor');
        wp_enqueue_style('code-editor');

        // Add JavaScript mode
        wp_add_inline_script('code-editor', '
            if (typeof wp !== "undefined" && wp.codeEditor && wp.codeEditor.defaultSettings) {
                // Ensure JavaScript mode is available
                if (typeof CodeMirror !== "undefined") {
                    // Load JavaScript mode if not already loaded
                    if (!CodeMirror.modes.javascript) {
                        CodeMirror.defineMode("javascript", function() {
                            return CodeMirror.getMode({}, "text/javascript");
                        });
                    }
                }
            }
        ');
    }
}
add_action('admin_enqueue_scripts', 'enqueue_custom_editors_assets');
// Add meta box for custom CSS
function add_custom_css_meta_box() {
    add_meta_box(
        'custom-css-meta-box',
        __('Custom CSS for this page', 'blocklib'),
        'custom_css_meta_box_callback',
        ['page', 'post'],
        'normal',
        'low'
    );
}
add_action('add_meta_boxes', 'add_custom_css_meta_box');

// Meta box callback
function custom_css_meta_box_callback($post) {
    wp_nonce_field('custom_css_meta_box_nonce', 'custom_css_meta_box_nonce');

    $custom_css = get_post_meta($post->ID, '_custom_css', true);

    echo '<label for="custom_css">' . __('Add your custom CSS:', 'blocklib') . '</label>';
    echo '<textarea id="custom_css" name="custom_css" rows="15" style="width:100%;">' . esc_textarea($custom_css) . '</textarea>';
    echo '<p><em>' . __('This CSS will only be loaded on this specific page.', 'blocklib') . '</em></p>';

    echo '<style>
.CodeMirror {
    border: 1px solid #ddd;
}
</style>';

    // Initialize CodeMirror with proper save handling
    echo '<script>
        document.addEventListener("DOMContentLoaded", function() {
            let editor;
            let previewStyle = null;
            let iframePreviewStyle = null;
            let previewTimeout = null;

            if (typeof wp !== "undefined" && wp.codeEditor) {
                const settings = wp.codeEditor.defaultSettings ? wp.codeEditor.defaultSettings : {};

                const editorSettings = Object.assign({}, settings, {
                    codemirror: Object.assign({}, settings.codemirror || {}, {
                        mode: "css",
                        lineNumbers: false,
                        lineWrapping: true,
                        indentUnit: 2,
                        tabSize: 2,
                        theme: "default"
                    })
                });

                const cssEditorInstance = wp.codeEditor.initialize("custom_css", editorSettings);

                if (cssEditorInstance && cssEditorInstance.codemirror) {
                    editor = cssEditorInstance.codemirror;

                    // Save functionality
                    const cssForm = document.getElementById("post");
                    if (cssForm) {
                        cssForm.addEventListener("submit", function(e) {
                            editor.save();
                        });

                        const saveButtons = cssForm.querySelectorAll("input[type=submit], button[type=submit], #publish, #save-post");
                        saveButtons.forEach(function(button) {
                            button.addEventListener("click", function() {
                                editor.save();
                            });
                        });
                    }

                    editor.on("blur", function() {
                        editor.save();
                    });

                    // Function to find and inject CSS into Gutenberg iframe
                    function injectCSSIntoEditor(cssContent) {
                        // Try to find the Gutenberg editor iframe
                        const editorIframe = document.querySelector("iframe[name=\"editor-canvas\"]");

                        if (editorIframe && editorIframe.contentDocument) {
                            const iframeDoc = editorIframe.contentDocument;

                            // Remove existing preview style from iframe
                            if (iframePreviewStyle) {
                                iframePreviewStyle.remove();
                            }

                            if (cssContent.trim()) {
                                // Create and inject new style into iframe
                                iframePreviewStyle = iframeDoc.createElement("style");
                                iframePreviewStyle.id = "custom-css-live-preview";
                                iframePreviewStyle.textContent = cssContent;
                                iframeDoc.head.appendChild(iframePreviewStyle);
                            }
                        }

                        // Also inject into main admin page (for non-iframe elements)
                        if (previewStyle) {
                            previewStyle.remove();
                        }

                        if (cssContent.trim()) {
                            previewStyle = document.createElement("style");
                            previewStyle.id = "custom-css-admin-preview";
                            previewStyle.textContent = cssContent;
                            document.head.appendChild(previewStyle);
                        }
                    }

                    // Wait for Gutenberg to be loaded, then apply existing CSS
                    function waitForEditor() {
                        const editorIframe = document.querySelector("iframe[name=\"editor-canvas\"]");
                        if (editorIframe && editorIframe.contentDocument) {
                            const initialCSS = editor.getValue();
                            if (initialCSS.trim()) {
                                injectCSSIntoEditor(initialCSS);
                            }
                        } else {
                            // Retry after 500ms if iframe not ready
                            setTimeout(waitForEditor, 500);
                        }
                    }

                    // Start waiting for editor
                    setTimeout(waitForEditor, 1000);

                    // Update preview on every change with debounce
                    editor.on("change", function() {
                        // Clear existing timeout to debounce
                        if (previewTimeout) {
                            clearTimeout(previewTimeout);
                        }

                        // Set new timeout (300ms after user stops typing)
                        previewTimeout = setTimeout(function() {
                            injectCSSIntoEditor(editor.getValue());
                        }, 300);
                    });

                    // Clean up preview when leaving the page
                    window.addEventListener("beforeunload", function() {
                        if (previewStyle) {
                            previewStyle.remove();
                        }
                        if (iframePreviewStyle) {
                            iframePreviewStyle.remove();
                        }
                    });
                }
            }
        });
    </script>';
}

// Save meta box data
function save_custom_css_meta_box($post_id) {
    // Check if this is an autosave
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    // Verify nonce
    if (!isset($_POST['custom_css_meta_box_nonce']) || !wp_verify_nonce($_POST['custom_css_meta_box_nonce'], 'custom_css_meta_box_nonce')) {
        return;
    }

    // Check user permissions
    if (isset($_POST['post_type'])) {
        if ('page' === $_POST['post_type']) {
            if (!current_user_can('edit_page', $post_id)) {
                return;
            }
        } else {
            if (!current_user_can('edit_post', $post_id)) {
                return;
            }
        }
    }

    // Save the CSS
    if (isset($_POST['custom_css'])) {
        $custom_css = sanitize_textarea_field($_POST['custom_css']);
        if (!empty($custom_css)) {
            update_post_meta($post_id, '_custom_css', $custom_css);
        } else {
            delete_post_meta($post_id, '_custom_css');
        }
    }
}
add_action('save_post', 'save_custom_css_meta_box');

// Output custom CSS in the head
function output_custom_css() {
    error_log('output_custom_css function called');

    if (is_singular()) {
        global $post;

        if ($post && isset($post->ID)) {
            $custom_css = get_post_meta($post->ID, '_custom_css', true);

            if (!empty($custom_css)) {
                echo "\n<!-- Custom CSS for post ID: " . $post->ID . " -->\n";
                echo '<style id="custom-page-css">' . "\n";
                echo wp_strip_all_tags($custom_css) . "\n";
                echo '</style>' . "\n";
                echo "<!-- End Custom CSS -->\n";
            } else {
                echo "<!-- No custom CSS found for post ID: " . $post->ID . " -->\n";
            }
        } else {
            error_log('Global $post is not available or has no ID');
        }
    } else {
        error_log('is_singular() = false - Current page type: ' . (is_home() ? 'home' : (is_archive() ? 'archive' : 'other')));
    }
}
add_action('wp_head', 'output_custom_css', 5);

// Add meta box for custom JavaScript
function add_custom_js_meta_box() {
    add_meta_box(
        'custom-js-meta-box',
        __('Custom JavaScript for this page', 'blocklib'),
        'custom_js_meta_box_callback',
        ['page', 'post'],
        'normal',
        'low'
    );
}
add_action('add_meta_boxes', 'add_custom_js_meta_box');

// Meta box callback for JavaScript
function custom_js_meta_box_callback($post) {
    wp_nonce_field('custom_js_meta_box_nonce', 'custom_js_meta_box_nonce');

    $custom_js = get_post_meta($post->ID, '_custom_js', true);

    echo '<label for="custom_js">' . __('Add your custom JavaScript:', 'blocklib') . '</label>';
    echo '<textarea id="custom_js" name="custom_js" rows="15" style="width:100%;">' . esc_textarea($custom_js) . '</textarea>';
    echo '<p><em>' . __('This JavaScript will only be loaded on this specific page. Changes are previewed live in the editor.', 'blocklib') . '</em></p>';

    // Styles for CodeMirror
    echo '<style>
.CodeMirror {
    border: 1px solid #ddd;
}
</style>';

    // Initialize CodeMirror with live preview
    echo '<script>
        document.addEventListener("DOMContentLoaded", function() {
            let jsEditor;
            let previewScript = null;
            let iframePreviewScript = null;
            let previewTimeout = null;

            if (typeof wp !== "undefined" && wp.codeEditor) {
                const settings = wp.codeEditor.defaultSettings ? wp.codeEditor.defaultSettings : {};

                const editorSettings = Object.assign({}, settings, {
                    codemirror: Object.assign({}, settings.codemirror || {}, {
                        mode: "javascript",
                        lineNumbers: false,
                        lineWrapping: true,
                        indentUnit: 2,
                        tabSize: 2,
                        theme: "default"
                    })
                });

                const editorInstance = wp.codeEditor.initialize("custom_js", editorSettings);

                if (editorInstance && editorInstance.codemirror) {
                    jsEditor = editorInstance.codemirror;

                    // Save functionality
                    const form = document.getElementById("post");
                    if (form) {
                        form.addEventListener("submit", function(e) {
                            jsEditor.save();
                        });

                        const saveButtons = form.querySelectorAll("input[type=submit], button[type=submit], #publish, #save-post");
                        saveButtons.forEach(function(button) {
                            button.addEventListener("click", function() {
                                jsEditor.save();
                            });
                        });
                    }

                    jsEditor.on("blur", function() {
                        jsEditor.save();
                    });

                    // Function to inject JavaScript into editor and admin
                    function injectJSIntoEditor(jsContent) {
                        // Remove existing preview scripts
                        if (previewScript) {
                            previewScript.remove();
                        }
                        if (iframePreviewScript) {
                            iframePreviewScript.remove();
                        }

                        if (jsContent.trim()) {
                            try {
                                // Inject into main admin page
                                previewScript = document.createElement("script");
                                previewScript.id = "custom-js-admin-preview";
                                previewScript.textContent = jsContent;
                                document.head.appendChild(previewScript);

                                // Try to inject into Gutenberg iframe
                                const editorIframe = document.querySelector("iframe[name=\"editor-canvas\"]");
                                if (editorIframe && editorIframe.contentDocument) {
                                    const iframeDoc = editorIframe.contentDocument;
                                    iframePreviewScript = iframeDoc.createElement("script");
                                    iframePreviewScript.id = "custom-js-live-preview";
                                    iframePreviewScript.textContent = jsContent;
                                    iframeDoc.head.appendChild(iframePreviewScript);
                                }
                            } catch (error) {
                                console.warn("JavaScript preview error:", error);
                            }
                        }
                    }

                    // Wait for editor and apply existing JS
                    function waitForEditor() {
                        const editorIframe = document.querySelector("iframe[name=\"editor-canvas\"]");
                        if (editorIframe && editorIframe.contentDocument) {
                            const initialJS = jsEditor.getValue();
                            if (initialJS.trim()) {
                                injectJSIntoEditor(initialJS);
                            }
                        } else {
                            setTimeout(waitForEditor, 500);
                        }
                    }

                    setTimeout(waitForEditor, 1000);

                    // Update preview on every change with debounce
                    jsEditor.on("change", function() {
                        if (previewTimeout) {
                            clearTimeout(previewTimeout);
                        }

                        previewTimeout = setTimeout(function() {
                            injectJSIntoEditor(jsEditor.getValue());
                        }, 500); // Slightly longer debounce for JS to avoid too many executions
                    });

                    // Clean up on page unload
                    window.addEventListener("beforeunload", function() {
                        if (previewScript) {
                            previewScript.remove();
                        }
                        if (iframePreviewScript) {
                            iframePreviewScript.remove();
                        }
                    });
                }
            }
        });
    </script>';
}

// Save JavaScript meta box
function save_custom_js_meta_box($post_id) {
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    if (!isset($_POST['custom_js_meta_box_nonce']) || !wp_verify_nonce($_POST['custom_js_meta_box_nonce'], 'custom_js_meta_box_nonce')) {
        return;
    }

    if (isset($_POST['post_type'])) {
        if ('page' === $_POST['post_type']) {
            if (!current_user_can('edit_page', $post_id)) {
                return;
            }
        } else {
            if (!current_user_can('edit_post', $post_id)) {
                return;
            }
        }
    }

    if (isset($_POST['custom_js'])) {
        $custom_js = sanitize_custom_js($_POST['custom_js']);
        if (!empty($custom_js)) {
            update_post_meta($post_id, '_custom_js', $custom_js);
        } else {
            delete_post_meta($post_id, '_custom_js');
        }
    }
}
add_action('save_post', 'save_custom_js_meta_box');

// Output JavaScript in front-end
function output_custom_page_js() {
    if (is_singular()) {
        global $post;

        if ($post && isset($post->ID)) {
            $custom_js = get_post_meta($post->ID, '_custom_js', true);

            if (!empty($custom_js)) {
                echo "\n<!-- Custom JavaScript for post ID: " . $post->ID . " -->\n";
                echo '<script id="custom-page-js">' . "\n";
                echo wp_strip_all_tags($custom_js) . "\n";
                echo '</script>' . "\n";
                echo "<!-- End Custom JavaScript -->\n";
            }
        }
    }
}
add_action('wp_footer', 'output_custom_page_js');

//****************************
// Reactivate instant preview of Additional CSS in Customizer.
//****************************
function enable_custom_css_live_preview() {
    // Enable postMessage transport for custom CSS
    add_action('customize_register', function($wp_customize) {
        // Ensure the custom CSS setting uses postMessage transport
        if ($wp_customize->get_setting('custom_css[' . get_stylesheet() . ']')) {
            $wp_customize->get_setting('custom_css[' . get_stylesheet() . ']')->transport = 'postMessage';
        }
    });

    // Add JavaScript for live preview
    add_action('customize_preview_init', 'custom_css_live_preview_script');
}
add_action('after_setup_theme', 'enable_custom_css_live_preview');

function custom_css_live_preview_script() {
    ?>
    <script type="text/javascript">
    (function() {
        'use strict';

        function updateCustomCSS(cssContent) {
            const existingStyle = document.getElementById('wp-custom-css');
            if (existingStyle) {
                existingStyle.remove();
            }

            if (cssContent && cssContent.trim() !== '') {
                const styleElement = document.createElement('style');
                styleElement.id = 'wp-custom-css';
                styleElement.type = 'text/css';
                styleElement.textContent = cssContent;
                document.head.appendChild(styleElement);
            }
        }

        // Access parent customizer directly
        function bindCustomCSS() {
            if (parent.wp && parent.wp.customize) {
                const settingId = 'custom_css[<?php echo get_stylesheet(); ?>]';
                const setting = parent.wp.customize(settingId);

                if (setting) {
                    setting.bind(updateCustomCSS);
                }
            }
        }

        // Try immediately, then with delays if needed
        bindCustomCSS();
        setTimeout(bindCustomCSS, 100);
        setTimeout(bindCustomCSS, 500);

    })();
    </script>
    <?php
}

//****************************
// Add JS to Customizer.
//****************************
function add_custom_js_to_customizer($wp_customize) {
    // Add section for custom JavaScript
    $wp_customize->add_section('custom_js_section', array(
        'title'       => __('Additional JavaScript', 'blocklib'),
        'description' => __('Add your custom JavaScript code that will be loaded on all pages.', 'blocklib'),
        'priority'    => 201, // Right after Additional CSS
        'capability'  => 'edit_theme_options',
    ));

    // Add setting for custom JavaScript
    $wp_customize->add_setting('custom_js_code', array(
        'default'           => '',
        'type'              => 'theme_mod',
        'capability'        => 'edit_theme_options',
        'sanitize_callback' => 'sanitize_custom_js',
    ));

    // Add control for JavaScript editor
    $wp_customize->add_control('custom_js_code', array(
        'label'       => __('Custom JavaScript Code', 'blocklib'),
        'description' => __('Enter your JavaScript code here.', 'blocklib'),
        'section'     => 'custom_js_section',
        'settings'    => 'custom_js_code',
        'type'        => 'textarea',
        'input_attrs' => array(
            'placeholder' => __('// Your JavaScript code here...', 'blocklib'),
            'class'       => 'code',
            'rows'        => 15,
        ),
    ));
}
add_action('customize_register', 'add_custom_js_to_customizer');

// Output custom JavaScript in the frontend
function output_custom_global_js() {
    $custom_js = get_theme_mod('custom_js_code', '');

    if (!empty(trim($custom_js))) {
        echo '<script type="text/javascript" id="wp-custom-js">' . "\n";
        echo '/* Custom JavaScript from Customizer */' . "\n";
        echo $custom_js . "\n";
        echo '</script>' . "\n";
    }
}
add_action('wp_footer', 'output_custom_global_js', 99);

// Enhanced sanitization function for JavaScript code
function sanitize_custom_js($input) {
    if (empty($input)) {
        return '';
    }

    // Remove PHP tags and other potentially dangerous server-side content
    $input = preg_replace('/<\?php.*?\?>/s', '', $input);
    $input = preg_replace('/<\?.*?\?>/s', '', $input);

    // Remove external script tags (only allow inline JS)
    $input = preg_replace('/<script[^>]*src=[^>]*>/i', '', $input);
    $input = preg_replace('/<\/script>/i', '', $input);
    $input = preg_replace('/<script[^>]*>/i', '', $input);

    // Remove HTML tags but preserve JavaScript
    $input = strip_tags($input);

    // Basic XSS prevention - remove javascript: protocol
    $input = preg_replace('/javascript\s*:/i', '', $input);

    // Log warnings for potentially dangerous patterns
    $dangerous_patterns = array(
        'eval\s*\(' => 'eval() usage detected',
        'Function\s*\(' => 'Function() constructor detected',
        'document\.write\s*\(' => 'document.write() detected (deprecated)',
        'innerHTML\s*=.*<script' => 'Script injection via innerHTML detected',
        'outerHTML\s*=.*<script' => 'Script injection via outerHTML detected',
        'setTimeout\s*\(\s*["\']' => 'setTimeout with string detected (use function instead)',
        'setInterval\s*\(\s*["\']' => 'setInterval with string detected (use function instead)',
    );

    foreach ($dangerous_patterns as $pattern => $message) {
        if (preg_match('/' . $pattern . '/i', $input)) {
            error_log('Custom JS Warning: ' . $message);
        }
    }

    return $input;
}

// Load CodeMirror for the Customizer
function load_codemirror_for_customizer() {
    wp_enqueue_script('code-editor');
    wp_enqueue_style('code-editor');

    // Simple inline script to initialize CodeMirror
    wp_add_inline_script('code-editor', '
        document.addEventListener("DOMContentLoaded", function() {

            // Wait a bit for everything to load
            setTimeout(function() {
                var textarea = document.getElementById("_customize-input-custom_js_code");

                if (textarea && typeof wp !== "undefined" && wp.codeEditor) {

                    var settings = {
                        codemirror: {
                            mode: "javascript",
                            lineNumbers: true,
                            autoCloseBrackets: true,
                            matchBrackets: true
                        }
                    };

                    var editor = wp.codeEditor.initialize(textarea, settings);

                    if (editor && editor.codemirror) {

                        // Sync changes back to textarea
                        editor.codemirror.on("change", function(cm) {
                            cm.save();
                            var event = new Event("change", { bubbles: true });
                            textarea.dispatchEvent(event);
                        });
                    } else {
                    }
                } else {
                    console.log("Requirements not met:", {
                        textarea: !!textarea,
                        wp: typeof wp !== "undefined",
                        codeEditor: typeof wp !== "undefined" && !!wp.codeEditor
                    });
                }
            }, 1000);
        });
    ');
}
add_action('customize_controls_enqueue_scripts', 'load_codemirror_for_customizer');

//****************************
// Managing colors and fonts for wp_options.
//****************************
// They get a dedicated page
if (is_admin()) {
    require_once get_template_directory() . '/inc/graphic-chart-page.php';
}

// Need to expose colors and fonts in the REST API.
function expose_graphic_chart_in_rest() {

    register_setting('general', 'color_matching_mapping', [
        'show_in_rest' => [
            'schema' => [
                'type' => 'array',
                'items' => [
                    'type' => 'object',
                    'properties' => [
                        'variable' => [
                            'type' => 'string'
                        ],
                        'color' => [
                            'type' => 'string'
                        ]
                    ]
                ]
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
add_action('rest_api_init', 'expose_graphic_chart_in_rest');

// Saving colors matchings in wp_options
function save_color_matching_mapping($mappings) {
    update_option('color_matching_mapping', $mappings);
}

// Retrieving colors matchings (empty array if nothing)
function get_color_matching_mapping() {
    return get_option('color_matching_mapping', []);
}

function generate_color_css_variables() {
    $mappings = get_color_matching_mapping();

    if (empty($mappings)) {
        return '';
    }

    $css_variables = [];

    foreach ($mappings as $mapping) {
        $variable_name = $mapping['variable'];
        $color = $mapping['color'];

        $css_variables[] = "{$variable_name}: {$color};";
    }

    return implode("\n", $css_variables);
}

// A new way to manage @font-face with WP 6.5 Font Manager.
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

// Saving font matchings in wp_options
function save_font_matching_mapping($mappings) {
    update_option('font_matching_mapping', $mappings);
}

// Retrieving font matchings (empty array if nothing)
function get_font_matching_mapping() {
    return get_option('font_matching_mapping', []);
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

    return implode("\n", $css_variables);
}

//****************************
// Register meta field for used fonts and use it (for generating preloads).
//****************************
function register_used_fonts_meta() {
    register_post_meta('', 'used_fonts', [
        'type' => 'object',
        'single' => true,
        'show_in_rest' => [
            'schema' => [
                'type' => 'object',
                'properties' => [],
                'additionalProperties' => [
                    'type' => 'object',
                    'properties' => [
                        'url' => ['type' => 'string'],
                        'type' => ['type' => 'string']
                    ]
                ]
            ]
        ]
    ]);
}
add_action('init', 'register_used_fonts_meta');

// Dynamically generate font preloads
function generate_font_preloads() {
    global $post;

    if (!$post) {
        return;
    }

    $used_fonts = get_post_meta($post->ID, 'used_fonts', true);

    if (empty($used_fonts) || !is_array($used_fonts)) {
        return;
    }

    foreach ($used_fonts as $font_data) {
        $font_url = get_site_url() . $font_data['url'];
        $mime_type = $font_data['type'] ?? 'font/woff2';

        printf(
            '<link rel="preload" href="%s" as="font" type="%s" crossorigin="anonymous">%s',
            esc_url($font_url),
            esc_attr($mime_type),
            "\n"
        );
    }
}
add_action('wp_head', 'generate_font_preloads', 1);

//****************************
// Register meta field for LCP datas and use it (to generate preloads also).
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
        if (!empty($lcp_data) && !empty($lcp_data['url']) && str_contains($lcp_data['mime'], 'image')) {
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
        elseif (!empty($lcp_data) && !empty($lcp_data['url']) && str_contains($lcp_data['mime'], 'video')) {
            printf(
                '<link rel="preload" href="%s" as="%s" type="%s">',
                esc_url($lcp_data['url']),
                esc_attr($lcp_data['as']),
                esc_attr($lcp_data['mime'])
            );
        } else {
            echo '';
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
        } elseif(($xml = simplexml_load_file(get_site_url() . $image[0])) !== false) {
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
//****************************
require_once get_template_directory() . '/inc/global-dynamic-css.php';

?>
