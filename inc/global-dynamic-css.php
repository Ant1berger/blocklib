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

/***********/
/* Global */
/*********/

/* This should not be here but in the WordPress CSS editor. It could be different for each website. */
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
        background-color: var(--grey_end);
        padding: 1rem;
        color: var(--grey_start);
        display: block;
        position: relative;
        z-index: 1000000;
    }
}
';
}
