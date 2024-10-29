<?php
    $componentName = $attributes['blockName'];
    if (!in_array($componentName, get_components())) {

        // Add block styles
        $view_css_path = get_template_directory() . '/custom-blocks/build/' . $attributes['blockName'] . '/index.css';
        if (file_exists($view_css_path)) {
            $view_css_content = file_get_contents($view_css_path);
            wp_register_style('blb-' . $attributes['blockName'], false);
            wp_add_inline_style('blb-' . $attributes['blockName'], $view_css_content);
            wp_enqueue_style('blb-' . $attributes['blockName']);
        }

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
?>

<<?php
    if (isset($attributes['tag'])) {
        echo $attributes['tag'];
    } else {
        $attributes['tag'] = 'p';
        echo $attributes['tag'];
    }
?>
    data-persistentid="<?php echo $attributes['persistentID']; ?>"
    id="<?php echo $attributes['anchor']; ?>"
    class="<?php echo $attributes['blockName']; ?><?php
        if (!empty($attributes['selectedColorClass'])) {
            echo ' ' . $attributes['selectedColorClass'];
        }
        if (!empty($attributes['selectedFontClass'])) {
            echo ' ' . $attributes['selectedFontClass'];
        }
        if (!empty($attributes['manualClasses'])) {
            echo ' ' . $attributes['manualClasses'];
        }
    ?>"
>
<?php echo $attributes['content']; ?>
</<?php echo $attributes['tag']; ?>>

<?php if (!empty($attributes['renderedMediaQueries'])) { ?>
<style>
<?php echo $attributes['renderedMediaQueries']; ?>
</style>
<?php } ?>
