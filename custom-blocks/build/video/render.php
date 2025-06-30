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

<video
    data-persistentid="<?php echo $attributes['persistentID']; ?>"
    <?php if (!empty($attributes['anchor'])) { ?>
        id="<?php echo $attributes['anchor']; ?>"
    <?php } ?>
    class="<?php echo $attributes['blockName']; ?><?php
        if (!empty($attributes['manualClasses'])) {
            echo ' ' . $attributes['manualClasses'];
        }
    ?>"
    src="<?php echo $attributes['videoURL']; ?>"
    <?php if (!empty($attributes['videoWidth'])) { ?>
        width="<?php echo $attributes['videoWidth']; ?>"
    <?php } ?>
    <?php if (!empty($attributes['videoHeight'])) { ?>
        height="<?php echo $attributes['videoHeight']; ?>"
    <?php } ?>
    <?php if (!empty($attributes['posterURL'])) { ?>
        poster="<?php echo $attributes['posterURL']; ?>"
    <?php } ?>
    <?php if (!empty($attributes['autoplay'])) { ?>
        autoplay
    <?php } ?>
    <?php if (!empty($attributes['playsinline'])) { ?>
        playsinline
    <?php } ?>
    <?php if (!empty($attributes['controls'])) { ?>
        controls
    <?php } ?>
    <?php if (!empty($attributes['loop'])) { ?>
        loop
    <?php } ?>
    <?php if (!empty($attributes['muted'])) { ?>
        muted
    <?php } ?>
    <?php if (!empty($attributes['preload'])) { ?>
        preload="<?php echo $attributes['preload']; ?>"
    <?php } ?>
    <?php
        $controlslist_values = [];
        if (!empty($attributes['controlslistNoDownload'])) {
            $controlslist_values[] = 'nodownload';
        }
        if (!empty($attributes['controlslistNoFullscreen'])) {
            $controlslist_values[] = 'nofullscreen';
        }
        if (!empty($attributes['controlslistNoRemotePlayback'])) {
            $controlslist_values[] = 'noremoteplayback';
        }
        $controlslist_attribute_value = implode(' ', $controlslist_values);
        if (!empty($controlslist_attribute_value)) {
            echo 'controlslist="' . esc_attr($controlslist_attribute_value) . '"';
        }
    ?>
    <?php if (!empty($attributes['anchor'])) { ?>
        id="<?php echo $attributes['anchor']; ?>"
    <?php } ?>
    <?php echo wp_kses_post($attributes['otherAttributes']); ?>
></video>
