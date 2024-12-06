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
    ?>"
    <?php if (!empty($attributes['selectedBGColor'])) { ?>
        style="--bgColor: <?php echo $attributes['selectedBGColor'];?>;"
    <?php } ?>
    <?php echo wp_kses_post($attributes['otherAttributes']); ?>
>
<?php echo do_blocks( $content ); ?>
</<?php echo $attributes['tag']; ?>>
