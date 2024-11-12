<?php
    $componentName = $attributes['blockName'];
    if (!in_array($componentName, get_components())) {

        // Add block styles
        $block_css_path = get_template_directory() . '/custom-blocks/build/' . $attributes['blockName'] . '/index.css';
        if (file_exists($block_css_path)) {
            $block_css_content = file_get_contents($block_css_path);
            wp_register_style('blb-' . $attributes['blockName'], false);
            wp_add_inline_style('blb-' . $attributes['blockName'], $block_css_content);
            // Allows the <style> to be printed right before the element while wp_enqueue_style doesn't.
            wp_print_styles('blb-' . $attributes['blockName']);
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

<?php if (!empty($attributes['renderedMediaQueries'])) { ?>
<style>
<?php echo $attributes['renderedMediaQueries']; ?>
</style>
<?php } ?>


<<?php
    if (isset($attributes['tag'])) {
        echo $attributes['tag'];
    } else {
        $attributes['tag'] = 'h1';
        echo $attributes['tag'];
    }
?>
    data-persistentid="<?php echo $attributes['persistentID']; ?>"
    <?php if (!empty($attributes['anchor'])) { ?>
    id="<?php echo $attributes['anchor']; ?>"
    <?php } ?>
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
    <?php echo wp_kses_post($attributes['otherAttributes']); ?>
>
<?php echo $attributes['content']; ?>
</<?php echo $attributes['tag']; ?>>
