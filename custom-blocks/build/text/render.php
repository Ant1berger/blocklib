<?php

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

<?php
static $script_added = false;
if (!$script_added) {
    $block_js_path = get_template_directory() . '/custom-blocks/build/' . $attributes['blockName'] . '/view-inline.js';
    if (file_exists($block_js_path)) {
        $block_js_content = file_get_contents($block_js_path);

        wp_register_script($attributes['blockName'] . '-inline', '');
        wp_add_inline_script($attributes['blockName'] . '-inline', $block_js_content);
        wp_enqueue_script($attributes['blockName'] . '-inline');
    }
    $script_added = true;
}
