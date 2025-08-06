<?php
function get_custom_block_common_styles() {
return '
/**********************************/
/* Global styles for every pages */
/* Order matters: keep variables first */
/*************************************/

/**********/
/* Fonts: */
/* @font-face are automatically created and injected into the <head> by the WP Font Manager and that is great! */
/* So nothing here, look for <style class="wp-fonts-local"> to find them. */
/********/

/**************/
/* Variables */
/************/

:root {

/* Generated colors variables */
' . generate_color_css_variables() . '

/* Generated fonts variables */
' . generate_font_css_variables() . '

}

/***********/
/* Global */
/*********/

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
        min-inline-size: 20rem;
        min-block-size: 100vh;
        display: flex;
        flex-direction: column;

        /* This should not be here but in the WordPress CSS editor. It could be different for each website. */
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
        background-color: white;
        padding: 1rem;
        color: black;
        display: block;
        position: relative;
        z-index: 1000000;
    }
}
';
}
