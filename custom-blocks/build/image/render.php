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

    // WordPress doesn't retrieves svg dimensions easily, so we have to get the image width and height
    // from wp_get_attachment_image_src + a "dig into the svg" function
    // to retrieve the dimensions from the viewbox.
    // This allows us to use it in the image width and height attributes later.
    add_filter( 'wp_get_attachment_image_src', 'fix_wp_get_attachment_image_svg', 10, 4 );
    function fix_wp_get_attachment_image_svg($image, $attachment_id, $size, $icon) {
        if (is_array($image) && preg_match('/\.svg$/i', $image[0]) && $image[1] <= 1) {
            if(is_array($size)) {
                $image[1] = $size[0];
                $image[2] = $size[1];
            } elseif(($xml = simplexml_load_file($image[0])) !== false) {
                $attr = $xml->attributes();
                $viewbox = explode(' ', $attr->viewBox);
                $image[1] = isset($attr->width) && preg_match('/\d+/', $attr->width, $value) ? (int) $value[0] : (count($viewbox) == 4 ? (int) $viewbox[2] : null);
                $image[2] = isset($attr->height) && preg_match('/\d+/', $attr->height, $value) ? (int) $value[0] : (count($viewbox) == 4 ? (int) $viewbox[3] : null);
            } else {
                $image[1] = $image[2] = null;
            }
        }
        return $image;
    }
    $image_attributes = wp_get_attachment_image_src( $attachment_id = $attributes['pictureID'], 'full' );
?>

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
    src="<?php echo $attributes['pictureURL']; ?>"
    <?php if (!str_contains($attributes['pictureExtension'], 'svg')) { ?>
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

<?php $componentName = $attributes['blockName']; ?>
<?php if (!in_array($componentName, get_components())) { ?>
<style id="<?php echo 'blockstyles-' . $attributes['blockName']; ?>">
<?php echo $attributes['blockStyles']; ?>
</style>
<?php add_component($componentName); ?>
<?php } ?>

<?php if (!empty($attributes['renderedMediaQueries'])) { ?>
<style>
<?php echo $attributes['renderedMediaQueries']; ?>
</style>
<?php } ?>
