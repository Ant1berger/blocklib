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
        <meta name="theme-color" content="black" />
        <title><?php bloginfo( 'name' ); ?></title>
        <?php wp_head(); ?>
    </head>
    <body <?php body_class(); ?>>
        <noscript class="noScript">
            Ce site a besoin de JavaScript pour fonctionner. Nous vous conseillons de l'activer dans votre navigateur pour profiter de toutes les fonctionnalités proposées.<br><br>This website needs JavaScript to run properly. We advice you to activate it in your browser in order to enjoy every provided functionalities.
        </noscript>
        <?php the_content(); ?>
        <?php wp_footer(); ?>
    </body>
</html>
