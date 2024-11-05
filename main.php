<?php
/**
 * Template Name: Main
 * Description: Main template for almost all pages.
 */
?>
<!-- Default structure for a wide majority of pages. -->
<!doctype html>
<html <?php language_attributes(); ?>>
    <head>
        <meta charset="<?php bloginfo('charset'); ?>">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="preload" href="<?php echo get_template_directory_uri() ?>/assets/fonts/bodonimoda-italic-math.woff2" as="font" type="font/woff2" crossorigin="anonymous">
        <link rel="preload" href="<?php echo get_template_directory_uri() ?>/assets/fonts/bodonimoda-italic-symbol.woff2" as="font" type="font/woff2" crossorigin="anonymous">
        <link rel="preload" href="<?php echo get_template_directory_uri() ?>/assets/fonts/bodonimoda-italic-latinext.woff2" as="font" type="font/woff2" crossorigin="anonymous">
        <link rel="preload" href="<?php echo get_template_directory_uri() ?>/assets/fonts/bodonimoda-italic-latin.woff2" as="font" type="font/woff2" crossorigin="anonymous">
        <link rel="preload" href="<?php echo get_template_directory_uri() ?>/assets/fonts/bodonimoda-normal-math.woff2" as="font" type="font/woff2" crossorigin="anonymous">
        <link rel="preload" href="<?php echo get_template_directory_uri() ?>/assets/fonts/bodonimoda-normal-symbol.woff2" as="font" type="font/woff2" crossorigin="anonymous">
        <link rel="preload" href="<?php echo get_template_directory_uri() ?>/assets/fonts/bodonimoda-normal-latinext.woff2" as="font" type="font/woff2" crossorigin="anonymous">
        <link rel="preload" href="<?php echo get_template_directory_uri() ?>/assets/fonts/bodonimoda-normal-latin.woff2" as="font" type="font/woff2" crossorigin="anonymous">
        <link rel="preload" href="<?php echo get_template_directory_uri() ?>/assets/fonts/jost-italic-cyrillic.woff2" as="font" type="font/woff2" crossorigin="anonymous">
        <link rel="preload" href="<?php echo get_template_directory_uri() ?>/assets/fonts/jost-italic-latinext.woff2" as="font" type="font/woff2" crossorigin="anonymous">
        <link rel="preload" href="<?php echo get_template_directory_uri() ?>/assets/fonts/jost-italic-latin.woff2" as="font" type="font/woff2" crossorigin="anonymous">
        <link rel="preload" href="<?php echo get_template_directory_uri() ?>/assets/fonts/jost-normal-cyrillic.woff2" as="font" type="font/woff2" crossorigin="anonymous">
        <link rel="preload" href="<?php echo get_template_directory_uri() ?>/assets/fonts/jost-normal-latinext.woff2" as="font" type="font/woff2" crossorigin="anonymous">
        <link rel="preload" href="<?php echo get_template_directory_uri() ?>/assets/fonts/jost-normal-latin.woff2" as="font" type="font/woff2" crossorigin="anonymous">
        <meta name="theme-color" content="oklch(23% 0.1 259.47)" />
        <title><?php bloginfo( 'name' ); ?></title>
        <?php // ENQUEUE all the other css and js files in functions.php ?>
        <?php wp_head(); ?>
    </head>
    <body class="<?php body_class(); ?>">
        <!-- Header -->
        <main class="mainContent" id="main-content">
            <?php the_content(); ?>
        </main>
        <?php wp_footer(); ?>
    </body>
</html>
