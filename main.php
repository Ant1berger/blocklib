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
        <meta name="theme-color" content="oklch(23% 0.1 259.47)" />
        <title><?php bloginfo( 'name' ); ?></title>
        <!-- ENQUEUE all the other css and js files in functions.php -->
        <?php wp_head(); ?>
        <style>
            <?php include 'main-auto-generated-dont-edit-me.css'; ?>
        </style>
    </head>
    <body class="<?php body_class(); ?>">
        <!-- Header -->
        <main class="mainContent" id="main-content">
            <?php the_content(); ?>
        </main>
        <?php wp_footer(); ?>
    </body>
</html>
