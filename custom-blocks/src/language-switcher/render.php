<?php if (function_exists('pll_the_languages')) { ?>
<?php
    $languages = pll_the_languages(array('raw' => 1));
    $currentLanguage = pll_current_language();
    $componentName = $attributes['blockName'];
    if (!in_array($componentName, get_components())) {

        // Add block scripts
        $block_js_path = get_template_directory() . '/custom-blocks/build/' . $attributes['blockName'] . '/view-inline.js';
        if (file_exists($block_js_path)) {
            $block_js_content = file_get_contents($block_js_path);
            wp_register_script('blb-' . $attributes['blockName'] . '-inline', false);
            wp_add_inline_script('blb-' . $attributes['blockName'] . '-inline', $block_js_content);
            wp_enqueue_script('blb-' . $attributes['blockName'] . '-inline');
        }

        add_component($componentName);
    }

    global $components_instances_styles;
    if (!empty($attributes['renderedMediaQueries'])) {
        $components_instances_styles .= $attributes['renderedMediaQueries'] . "\n";
    }
?>


<div
    data-persistentid="<?php echo $attributes['persistentID']; ?>"
    <?php if (!empty($attributes['anchor'])) { ?>
    id="<?php echo $attributes['anchor']; ?>"
    <?php } ?>
    class="<?php echo $attributes['blockName']; ?><?php
        if (!empty($attributes['manualClasses'])) {
            echo ' ' . $attributes['manualClasses'];
        }
    ?>"
    <?php echo wp_kses_post($attributes['otherAttributes']); ?>
>
<?php if (count($languages) == 1) { ?>
    No other language yet, only <?php echo $currentLanguage;?>. You can remove the language switcher or add more languages.
<?php } elseif (count($languages) == 2) { ?>
    <ul class="language-switcher-list">
        <?php foreach ($languages as $language) { ?>
            <li class="language-switcher-item">
                <?php if ($language['slug'] == $currentLanguage) { ?>
                    <img class="language-switcher-image" width="16" height="11" src="<?php echo $language['flag']; ?>" alt="<?php echo $language['slug']; ?>">
                <?php } else { ?>
                    <a class="language-switcher-link" href="<?php echo $language['url']; ?>">
                        <img class="language-switcher-image" width="16" height="11" title="<?php echo $language['name']; ?>" src="<?php echo $language['flag']; ?>" alt="<?php echo $language['slug']; ?>">
                    </a>
                <?php } ?>
            </li>
        <?php } ?>
    </ul>
<?php } ?>
</div>
<?php } ?>
