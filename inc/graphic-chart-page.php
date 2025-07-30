<?php
// Dedicated admin page creation
function add_graphic_chart_menu() {
    add_theme_page(
        __('Colors and fonts Management', 'blocklib'),
        __('Graphic chart', 'blocklib'),
        'manage_options',
        'graphic-chart',
        'graphic_chart_admin_page'
    );
}
add_action('admin_menu', 'add_graphic_chart_menu');

/**
 * Validate CSS variable name
 * Checks if the variable name follows CSS custom property rules
 */
function validate_css_variable_name($name) {
    // Remove leading/trailing whitespace only
    $name = trim($name);

    // If empty, return false
    if (empty($name)) {
        return false;
    }

    // Must start with --
    if (!str_starts_with($name, '--')) {
        return false;
    }

    // Must have at least 3 characters (-- + 1 character minimum)
    if (strlen($name) < 3) {
        return false;
    }

    // Check valid characters (letters, numbers, hyphens, underscores after --)
    if (!preg_match('/^--[a-zA-Z_][a-zA-Z0-9\-_]*$/', $name)) {
        return false;
    }

    return true;
}

function validate_css_color($color) {
    // Return false for empty values
    if (empty($color)) {
        return false;
    }

    $color = trim($color);

    $color_patterns = array(
        // Hex colors (#fff, #ffffff)
        '/^#([A-Fa-f0-9]{3}){1,2}$/',

        // Hex colors with alpha (#fff8, #ffffff88)
        '/^#([A-Fa-f0-9]{4}){1,2}$/',

        // RGB and RGBA - old and new syntaxes
        '/^rgb\(\s*(\d{1,3}(?:\.\d+)?%?)\s*(?:,\s*|\s+)(\d{1,3}(?:\.\d+)?%?)\s*(?:,\s*|\s+)(\d{1,3}(?:\.\d+)?%?)\s*(?:\/\s*(0|1|0?\.\d+|(?:\d{1,3})?%))?\s*\)$/',

        // HSL and HSLA - old and new syntaxes
        '/^hsl\(\s*(\d+|calc\([^)]+\))\s*(?:(?:,\s*(\d{1,3}%)\s*,\s*(\d{1,3}%)|(?:\s+\d{1,3}%\s+\d{1,3}%)))\s*(?:\/\s*(0|1|0?\.\d+|(?:\d{1,3})?%))?\s*\)$/',

        // LCH
        '/^lch\(\s*(\d+(?:\.\d+)?%?|0?\.\d+%?)\s+(\d+(?:\.\d+)?%?|0?\.\d+%?)\s+(\d+(?:\.\d+)?(?:deg|rad|grad|turn)?|0?\.\d+(?:deg|rad|grad|turn)?)\s*(?:\/\s*(\d+(?:\.\d+)?%?|0?\.\d+%?))?\s*\)$/i',

        // OKLCH
        '/^oklch\(\s*(\d+(?:\.\d+)?%?|0?\.\d+%?)\s+(\d+(?:\.\d+)?%?|0?\.\d+%?)\s+(\d+(?:\.\d+)?(?:deg|rad|grad|turn)?|0?\.\d+(?:deg|rad|grad|turn)?)\s*(?:\/\s*(\d+(?:\.\d+)?%?|0?\.\d+%?))?\s*\)$/i',

        // Keywords
        '/^(aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen|transparent|currentcolor|inherit)$/i',
    );

    foreach ($color_patterns as $pattern) {
        if (preg_match($pattern, $color)) {
            return true;
        }
    }

    return false;
}

function graphic_chart_admin_page() {
    $errors = [];
    $success_message = '';

    // === FORM PROCESSING ===
    // For fonts:
    if (isset($_POST['submit']) && wp_verify_nonce($_POST['font_matching_nonce'], 'save_font_matching')) {
        $fonts_mappings = [];
        $fonts_has_errors = false;

        // Get form data
        if (isset($_POST['variable_names']) && isset($_POST['font_families'])) {
            $variable_names = array_map('trim', wp_unslash($_POST['variable_names']));
            $font_families = array_map('trim', wp_unslash($_POST['font_families']));

            // Process each form row
            foreach ($variable_names as $index => $variable_name) {
                $variable_name = trim($variable_name);
                $font_family = $font_families[$index];

                // Skip empty rows
                if (empty($variable_name) && empty($font_family)) {
                    continue;
                }

                // Validate variable name
                if (!empty($variable_name)) {
                    if (!validate_css_variable_name($variable_name)) {
                        $errors[] = __('Save process failed: the variable name was not matching the naming rules.', 'blocklib');
                        $fonts_has_errors = true;
                        continue;
                    }

                    // Check for duplicates
                    $duplicate_found = false;
                    foreach ($fonts_mappings as $existing_mapping) {
                        if ($existing_mapping['variable'] === $variable_name) {
                            $errors[] = sprintf(
                                __('Duplicate variable name: "%s". Each variable name must be unique.', 'blocklib'),
                                esc_html($variable_name)
                            );
                            $fonts_has_errors = true;
                            $duplicate_found = true;
                            break;
                        }
                    }

                    if (!$duplicate_found && !empty($font_family)) {
                        $fonts_mappings[] = [
                            'variable' => $variable_name,
                            'font_family' => $font_family
                        ];
                    }
                }
            }
        }

        // Save if no errors
        if (!$fonts_has_errors) {
            save_font_matching_mapping($fonts_mappings);

            // Clear CSS cache
            delete_transient('theme_font_matching_v2');

            $success_message = __('Font variables saved successfully!', 'blocklib');
        }
    }

    // For colors:
    if (isset($_POST['submit']) && wp_verify_nonce($_POST['color_matching_nonce'], 'save_color_matching')) {
        $colors_mappings = [];
        $colors_has_errors = false;

        // Get form data
        if (isset($_POST['variable_names']) && isset($_POST['colors'])) {
            $variable_names = array_map('trim', wp_unslash($_POST['variable_names']));
            $colors = array_map('trim', wp_unslash($_POST['colors']));

            // Process each form row
            foreach ($variable_names as $index => $variable_name) {
                $variable_name = trim($variable_name);
                $color = isset($colors[$index]) ? trim($colors[$index]) : '';

                // Skip empty rows
                if (empty($variable_name) && empty($color)) {
                    continue;
                }

                // Validate variable name if provided
                if (!empty($variable_name)) {
                    if (!validate_css_variable_name($variable_name)) {
                        $errors[] = __('Save process failed: the variable name was not matching the naming rules.', 'blocklib');
                        $colors_has_errors = true;
                        continue;
                    }

                    // Check for duplicates
                    $duplicate_found = false;
                    foreach ($colors_mappings as $existing_mapping) {
                        if ($existing_mapping['variable'] === $variable_name) {
                            $errors[] = sprintf(
                                __('Duplicate variable name: "%s". Each variable name must be unique.', 'blocklib'),
                                esc_html($variable_name)
                            );
                            $colors_has_errors = true;
                            $duplicate_found = true;
                            break;
                        }
                    }

                    if ($duplicate_found) {
                        continue;
                    }
                }

                // Validate color if provided
                if (!empty($color)) {
                    if (!validate_css_color($color)) {
                        $errors[] = sprintf(
                            __('Invalid color format: "%s". Please use a valid CSS color (hex, rgb, oklch, keywords, etc.).', 'blocklib'),
                            esc_html($color)
                        );
                        $colors_has_errors = true;
                        continue;
                    }
                }

                // Add to mappings if both fields are valid and not empty
                if (!empty($variable_name) && !empty($color)) {
                    $colors_mappings[] = [
                        'variable' => $variable_name,
                        'color' => $color
                    ];
                } elseif (!empty($variable_name) || !empty($color)) {
                    // One field is filled but not the other
                    $errors[] = __('Both variable name and color value are required for each row.', 'blocklib');
                    $colors_has_errors = true;
                }
            }
        }

        // Save if no errors
        if (!$colors_has_errors) {
            save_color_matching_mapping($colors_mappings);

            // Clear CSS cache
            delete_transient('theme_color_matching_v2');

            $success_message = __('Color variables saved successfully!', 'blocklib');
        }
    }

    // === DATA RETRIEVAL FOR DISPLAY ===
    // For fonts:
    $available_fonts = get_fonts_from_global_styles(); // Installed fonts
    $current_font_mappings = get_font_matching_mapping(); // Current mappings

    ?>
    <div class="wrap">
        <h1><?php _e('Colors and fonts Management', 'blocklib'); ?></h1>

        <?php if ($success_message) : ?>
            <div class="notice notice-success is-dismissible"><p><?php echo esc_html($success_message); ?></p></div>
        <?php endif; ?>

        <?php if (!empty($errors)) : ?>
            <div class="notice notice-error is-dismissible">
                <?php foreach ($errors as $error) : ?>
                    <p><?php echo esc_html($error); ?></p>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>

        <div class="card">
            <h2><?php _e('Instructions', 'blocklib'); ?></h2>
            <p><?php _e('Create CSS custom properties linked to your installed fonts and theme colors. Variable names must follow CSS rules (letters, numbers, hyphens, underscores only).', 'blocklib'); ?></p>
            <p><strong><?php _e('Examples:', 'blocklib'); ?></strong> <code>--font-heading</code>, <code>--color-1</code>, <code>--color-accent</code>...</p>
        </div>

        <form method="post" action="">
            <?php wp_nonce_field('save_font_matching', 'font_matching_nonce'); ?>

            <table class="wp-list-table widefat striped" id="font-variables-table">
                <thead>
                    <tr>
                        <th><?php _e('CSS Variable Name', 'blocklib'); ?></th>
                        <th><?php _e('Assigned Font', 'blocklib'); ?></th>
                        <th><?php _e('Actions', 'blocklib'); ?></th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (!empty($current_font_mappings)) : ?>
                        <?php foreach ($current_font_mappings as $index => $mapping) : ?>
                            <tr>
                                <td>
                                    <input type="text"
                                        name="variable_names[]"
                                        value="<?php echo esc_attr($mapping['variable']); ?>"
                                        placeholder="<?php esc_attr_e('e.g: --font-heading', 'blocklib'); ?>"
                                        class="variable-name-input" />
                                </td>
                                <td>
                                    <select name="font_families[]">
                                        <option value=""><?php _e('Select a font', 'blocklib'); ?></option>
                                        <?php foreach ($available_fonts as $font) : ?>
                                            <option value="<?php echo esc_attr($font['fontFamily']); ?>"
                                                    <?php selected($mapping['font_family'], $font['fontFamily']); ?>>
                                                <?php echo esc_html($font['name']); ?>
                                            </option>
                                        <?php endforeach; ?>
                                    </select>
                                </td>
                                <td>
                                    <button type="button" class="button remove-row is-destructive"><?php _e('Remove', 'blocklib'); ?></button>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php else : ?>
                        <!-- If no mappings exist, display an empty row -->
                        <tr>
                            <td>
                                <input type="text"
                                    name="variable_names[]"
                                    placeholder="<?php esc_attr_e('e.g: --font-heading', 'blocklib'); ?>"
                                    class="variable-name-input" />
                            </td>
                            <td>
                                <select name="font_families[]">
                                    <option value=""><?php _e('Select a font', 'blocklib'); ?></option>
                                    <?php foreach ($available_fonts as $font) : ?>
                                        <option value="<?php echo esc_attr($font['fontFamily']); ?>">
                                            <?php echo esc_html($font['name']); ?>
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                            </td>
                            <td>
                                <button type="button" class="button remove-row"><?php _e('Remove', 'blocklib'); ?></button>
                            </td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>

            <p>
                <button type="button" class="button" id="add-font-row"><?php _e('Add Variable', 'blocklib'); ?></button>
            </p>

            <?php submit_button(__('Save fonts', 'blocklib')); ?>
        </form>
    </div>

    <?php
    // For colors:
    $current_color_mappings = get_color_matching_mapping(); // Current mappings

    ?>
    <div class="wrap">

        <?php if ($success_message) : ?>
            <div class="notice notice-success is-dismissible"><p><?php echo esc_html($success_message); ?></p></div>
        <?php endif; ?>

        <?php if (!empty($errors)) : ?>
            <div class="notice notice-error is-dismissible">
                <?php foreach ($errors as $error) : ?>
                    <p><?php echo esc_html($error); ?></p>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>

        <form method="post" action="">
            <?php wp_nonce_field('save_color_matching', 'color_matching_nonce'); ?>

            <table class="wp-list-table widefat striped" id="color-variables-table">
                <thead>
                    <tr>
                        <th><?php _e('CSS Variable Name', 'blocklib'); ?></th>
                        <th><?php _e('Assigned Color', 'blocklib'); ?></th>
                        <th><?php _e('Actions', 'blocklib'); ?></th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (!empty($current_color_mappings)) : ?>
                        <?php foreach ($current_color_mappings as $index => $mapping) : ?>
                            <tr>
                                <td>
                                    <input type="text"
                                        name="variable_names[]"
                                        value="<?php echo esc_attr($mapping['variable']); ?>"
                                        placeholder="<?php esc_attr_e('e.g: --color-primary', 'blocklib'); ?>"
                                        class="variable-name-input" />
                                </td>
                                <td>
                                    <input type="text"
                                        name="colors[]"
                                        value="<?php echo esc_attr($mapping['color']); ?>"
                                        placeholder="<?php esc_attr_e('e.g: oklch(0.79 0.18 96.46)', 'blocklib'); ?>"
                                        class="color-name-input" />
                                </td>
                                <td>
                                    <button type="button" class="button remove-row is-destructive"><?php _e('Remove', 'blocklib'); ?></button>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php else : ?>
                        <!-- If no mappings exist, display an empty row -->
                        <tr>
                            <td>
                                <input type="text"
                                    name="variable_names[]"
                                    placeholder="<?php esc_attr_e('e.g: --color-primary', 'blocklib'); ?>"
                                    class="variable-name-input" />
                            </td>
                            <td>
                                <input type="text"
                                        name="colors[]"
                                        placeholder="<?php esc_attr_e('e.g: oklch(0.79 0.18 96.46)', 'blocklib'); ?>"
                                        class="color-name-input" />
                            </td>
                            <td>
                                <button type="button" class="button remove-row"><?php _e('Remove', 'blocklib'); ?></button>
                            </td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>

            <p>
                <button type="button" class="button" id="add-color-row"><?php _e('Add Variable', 'blocklib'); ?></button>
            </p>

            <?php submit_button(__('Save colors', 'blocklib')); ?>
        </form>
    </div>

    <style>
        .card {
            background: #fff;
            border: 1px solid #ccd0d4;
            border-radius: 4px;
            padding: 20px;
            margin: 20px 0;
        }
        .card h2 {
            margin-top: 0;
        }
        .variable-name-input.error,
        .color-name-input.error {
            border-color: #dc3232;
        }
        .variable-name-input.valid,
        .color-name-input.valid {
            border-color: #46b450;
        }
    </style>

    <script>
    document.addEventListener('DOMContentLoaded', function() {
        // For fonts:
        const fontTable = document.getElementById('font-variables-table');
        const addFontButton = document.getElementById('add-font-row');
        const availableFonts = <?php echo json_encode($available_fonts); ?>;

        // === FUNCTION TO ADD A NEW ROW (FIXED) ===
        addFontButton.addEventListener('click', function() {
            const tbody = fontTable.querySelector('tbody');
            const newRow = document.createElement('tr');

            // Create the variable input
            const tdVariable = document.createElement('td');
            const inputVariable = document.createElement('input');
            inputVariable.type = 'text';
            inputVariable.name = 'variable_names[]';
            inputVariable.placeholder = '<?php esc_attr_e('e.g: --font-heading', 'blocklib'); ?>';
            inputVariable.className = 'variable-name-input';
            tdVariable.appendChild(inputVariable);

            // Create the font select (SAFE METHOD)
            const tdFont = document.createElement('td');
            const selectFont = document.createElement('select');
            selectFont.name = 'font_families[]';

            // Default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = '<?php _e('Select a font', 'blocklib'); ?>';
            selectFont.appendChild(defaultOption);

            // Add each available font
            availableFonts.forEach(font => {
                const option = document.createElement('option');
                option.value = font.fontFamily;  // ✅ No HTML escaping needed
                option.textContent = font.name;   // ✅ No HTML escaping needed
                selectFont.appendChild(option);
            });

            tdFont.appendChild(selectFont);

            // Create the remove button
            const tdAction = document.createElement('td');
            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.className = 'button remove-row';
            removeButton.textContent = '<?php _e('Remove', 'blocklib'); ?>';
            tdAction.appendChild(removeButton);

            // Assemble the row
            newRow.appendChild(tdVariable);
            newRow.appendChild(tdFont);
            newRow.appendChild(tdAction);

            tbody.appendChild(newRow);
        });

        // === FUNCTION TO REMOVE A ROW ===
        fontTable.addEventListener('click', function(event) {
            if (event.target.classList.contains('remove-row')) {
                event.target.closest('tr').remove();
            }
        });

        // === REAL-TIME VALIDATION ===
        fontTable.addEventListener('input', function(event) {
            if (event.target.classList.contains('variable-name-input')) {
                const input = event.target;
                const value = input.value.trim();

                input.classList.remove('error', 'valid');

                if (value) {
                    const isValid = /^--[a-zA-Z_][a-zA-Z0-9\-_]*$/.test(value);
                    input.classList.add(isValid ? 'valid' : 'error');
                }
            }
        });

        // For colors:
        const colorTable = document.getElementById('color-variables-table');
        const addColorButton = document.getElementById('add-color-row');

        // === FUNCTION TO ADD A NEW ROW (FIXED) ===
        addColorButton.addEventListener('click', function() {
            const tbody = colorTable.querySelector('tbody');
            const newRow = document.createElement('tr');

            // Create the variable input
            const tdVariable = document.createElement('td');
            const inputVariable = document.createElement('input');
            inputVariable.type = 'text';
            inputVariable.name = 'variable_names[]';
            inputVariable.placeholder = '<?php esc_attr_e('e.g: --color-primary', 'blocklib'); ?>';
            inputVariable.className = 'variable-name-input';
            tdVariable.appendChild(inputVariable);

            // Create the font select (SAFE METHOD)
            const tdColor = document.createElement('td');
            const inputColor = document.createElement('input');
            inputColor.name = 'colors[]';

            tdColor.appendChild(inputColor);

            // Create the remove button
            const tdAction = document.createElement('td');
            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.className = 'button remove-row';
            removeButton.textContent = '<?php _e('Remove', 'blocklib'); ?>';
            tdAction.appendChild(removeButton);

            // Assemble the row
            newRow.appendChild(tdVariable);
            newRow.appendChild(tdColor);
            newRow.appendChild(tdAction);

            tbody.appendChild(newRow);
        });

        // === FUNCTION TO REMOVE A ROW ===
        colorTable.addEventListener('click', function(event) {
            if (event.target.classList.contains('remove-row')) {
                event.target.closest('tr').remove();
            }
        });

        // === REAL-TIME VALIDATION ===
        colorTable.addEventListener('input', function(event) {
            if (event.target.classList.contains('variable-name-input')) {
                const input = event.target;
                const value = input.value.trim();

                input.classList.remove('error', 'valid');

                if (value) {
                    const isValid = /^--[a-zA-Z_][a-zA-Z0-9\-_]*$/.test(value);
                    input.classList.add(isValid ? 'valid' : 'error');
                }
            }
        });
    });
    </script>
    <?php
}
