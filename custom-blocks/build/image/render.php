<?php
    if(!empty($attributes['pictureID'])) {
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

        $attachment_id = $attributes['pictureID'];
        $image_attributes = wp_get_attachment_image_src($attachment_id, 'full');
        $image_metadata = wp_get_attachment_metadata($attachment_id);
        $image_srcset = wp_get_attachment_image_srcset($attachment_id, 'full');

        if ($image_attributes && is_array($image_attributes)) {
            $image_url = $image_attributes[0];
            $image_width = $image_attributes[1];
            $image_height = $image_attributes[2];
            $image_sizes = $image_metadata['sizes'] ?? [];
        } else {
            $image_url = '';
            $image_width = '';
            $image_height = '';
            $image_sizes = [];
        }
    }
?>

<?php
global $components_instances_styles;
if (!empty($attributes['renderedMediaQueries'])) {
    $components_instances_styles .= $attributes['renderedMediaQueries'] . "\n";
}
?>

<?php if (!empty($attributes['pictureID'])) { ?>

<img
    data-persistentid="<?php echo $attributes['persistentID']; ?>"
    <?php if (!empty($attributes['anchor'])) { ?>
        id="<?php echo $attributes['anchor']; ?>"
    <?php } ?>
    class="<?php echo $attributes['blockName']; ?><?php
        if (!empty($attributes['manualClasses'])) {
            echo ' ' . $attributes['manualClasses'];
        }
    ?>"
    <?php if (!empty($attributes['pictureLoading'])) { ?>
        loading="<?php echo $attributes['pictureLoading']; ?>"
    <?php } ?>
    <?php if (!empty($attributes['pictureFetchPriority'])) { ?>
        fetchpriority="<?php echo $attributes['pictureFetchPriority']; ?>"
    <?php } ?>
    src="<?php echo get_site_url() . $image_url; ?>"
    <?php if (!str_contains($attributes['pictureMime'], 'svg')) { ?>
        srcset="<?php echo esc_attr($image_srcset) ?>"
        sizes="<?php echo $attributes['pictureSizesAttribute']; ?>"
    <?php } ?>
    <?php ?>
    width="<?php echo esc_attr($image_width); ?>"
    height="<?php echo esc_attr($image_height); ?>"
    alt="<?php echo $attributes['pictureAlt']; ?>"
    <?php echo wp_kses_post($attributes['otherAttributes']); ?>
/>

<?php } ?>
