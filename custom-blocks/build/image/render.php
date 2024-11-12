<?php
    if(!empty($attributes['pictureURL'])) {
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

        $image_attributes = wp_get_attachment_image_src( $attachment_id = $attributes['pictureID'], 'full' );
    }
?>

<?php if (!empty($attributes['renderedMediaQueries'])) { ?>
<style>
<?php echo $attributes['renderedMediaQueries']; ?>
</style>
<?php } ?>

<?php if (!empty($attributes['pictureURL'])) { ?>

<img
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
    <?php if (!empty($attributes['pictureLoading'])) { ?>
        loading="<?php echo $attributes['pictureLoading']; ?>"
    <?php } ?>
    <?php if (!empty($attributes['pictureFetchPriority'])) { ?>
        fetchpriority="<?php echo $attributes['pictureFetchPriority']; ?>"
    <?php } ?>
    src="<?php echo $attributes['pictureURL']; ?>"
    <?php if (!str_contains($attributes['pictureMime'], 'svg')) { ?>
        srcset="
            <?php foreach( $attributes['pictureSizes'] as $size ): ?>
                <?php if ($size['width'] != '150') { ?>
                    <?php echo $size['url'] . ' ' . $size['width'] . 'w,'; ?>
                <?php } ?>
            <?php endforeach; ?>
        "
        sizes="<?php echo $attributes['pictureSizesAttribute']; ?>"
    <?php } ?>
    <?php // Here we use the dimensions from wp_get_attachment_image_src, in case the image is a SVG. ?>
    width="<?php echo $image_attributes[1]; ?>"
    height="<?php echo $image_attributes[2]; ?>"
    alt="<?php echo $attributes['pictureAlt']; ?>"
    <?php echo wp_kses_post($attributes['otherAttributes']); ?>
/>

<?php } ?>
