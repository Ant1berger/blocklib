<?php
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
?>

<?php
global $components_instances_styles;
if (!empty($attributes['renderedMediaQueries'])) {
    $components_instances_styles .= $attributes['renderedMediaQueries'] . "\n";
}
?>

<<?php
    if (isset($attributes['tag'])) {
        echo $attributes['tag'];
    } else {
        $attributes['tag'] = 'a';
        echo $attributes['tag'];
    }
?>
    data-persistentid="<?php echo $attributes['persistentID']; ?>"
    <?php if (!empty($attributes['anchor'])) { ?>
        id="<?php echo $attributes['anchor']; ?>"
    <?php } ?>
    <?php if ($attributes['tag'] === 'a' && !empty($attributes['url'])) { ?>
        href="<?php echo $attributes['url']; ?>"
    <?php } ?>
    <?php if ($attributes['openInNewTab'] && $attributes['tag'] === 'a') { echo 'target="_blank" rel="noopener noreferrer"';} ?>
    <?php if ($attributes['tag'] === 'button' && !empty($attributes['type'])) { ?>
        type="<?php echo $attributes['type']; ?>"
    <?php } ?>
    class="<?php echo $attributes['blockName']; ?><?php
        if (!empty($attributes['manualClasses'])) {
            echo ' ' . $attributes['manualClasses'];
        }
        if (!empty($attributes['rounded'])) {
            echo ' -rounded';
        }
        if (!empty($attributes['inverted'])) {
            echo ' -inverted';
        }
        if (!empty($attributes['leftIcon'])) {
            echo ' -leftIcon';
        }
        if (!empty($attributes['invisibleText'])) {
            echo ' -invisibleText';
        }
        if (!empty($attributes['fullWidth'])) {
            echo ' -fullWidth';
        }
        if (!empty($attributes['hoverState'])) {
            echo ' ' . $attributes['hoverState'];
        }
    ?>"
    <?php echo wp_kses_post($attributes['otherAttributes']); ?>
>
<?php if (!empty($attributes['leftIcon'])) { ?>
    <?php echo $attributes['leftIcon'];?>
<?php } ?>
<span class="<?php echo $attributes['blockName']; ?>-text">
    <?php echo $attributes['content']; ?>
</span>
</<?php echo $attributes['tag']; ?>>
