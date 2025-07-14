<?php
// Dedicated admin page creation
function add_font_matching_menu() {
    add_theme_page(
        __('Font Matching Management', 'blocklib'),
        __('Font Matching', 'blocklib'),
        'manage_options',
        'font-matching',
        'font_matching_admin_page'
    );
}
add_action('admin_menu', 'add_font_matching_menu');

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

function font_matching_admin_page() {
    $errors = [];
    $success_message = '';

    // === FORM PROCESSING ===
    if (isset($_POST['submit']) && wp_verify_nonce($_POST['font_matching_nonce'], 'save_font_matching')) {
        $mappings = [];
        $has_errors = false;

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
                        $has_errors = true;
                        continue;
                    }

                    // Check for duplicates
                    $duplicate_found = false;
                    foreach ($mappings as $existing_mapping) {
                        if ($existing_mapping['variable'] === $variable_name) {
                            $errors[] = sprintf(
                                __('Duplicate variable name: "%s". Each variable name must be unique.', 'blocklib'),
                                esc_html($variable_name)
                            );
                            $has_errors = true;
                            $duplicate_found = true;
                            break;
                        }
                    }

                    if (!$duplicate_found && !empty($font_family)) {
                        $mappings[] = [
                            'variable' => $variable_name,
                            'font_family' => $font_family
                        ];
                    }
                }
            }
        }

        // Save if no errors
        if (!$has_errors) {
            save_font_matching_mapping($mappings);

            // Clear CSS cache
            delete_transient('theme_font_matching_v2');

            $success_message = __('Font variables saved successfully!', 'blocklib');
        }
    }

    // === DATA RETRIEVAL FOR DISPLAY ===
    $available_fonts = get_fonts_from_global_styles();  // Installed fonts
    $current_mappings = get_font_matching_mapping();    // Current mappings

    ?>
    <div class="wrap">
        <h1><?php _e('Font Matching Management', 'blocklib'); ?></h1>

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
            <p><?php _e('Create CSS custom properties linked to your installed fonts. Variable names must follow CSS rules (letters, numbers, hyphens, underscores only).', 'blocklib'); ?></p>
            <p><strong><?php _e('Examples:', 'blocklib'); ?></strong> <code>--font-heading</code>, <code>--font-body</code>, <code>--font-accent</code></p>
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
                    <?php if (!empty($current_mappings)) : ?>
                        <?php foreach ($current_mappings as $index => $mapping) : ?>
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
                <button type="button" class="button" id="add-row"><?php _e('Add Variable', 'blocklib'); ?></button>
            </p>

            <?php submit_button(__('Save Variables', 'blocklib')); ?>
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
        .variable-name-input.error {
            border-color: #dc3232;
        }
        .variable-name-input.valid {
            border-color: #46b450;
        }
    </style>

    <script>
    document.addEventListener('DOMContentLoaded', function() {
        const table = document.getElementById('font-variables-table');
        const addButton = document.getElementById('add-row');
        const availableFonts = <?php echo json_encode($available_fonts); ?>;

        // === FUNCTION TO ADD A NEW ROW (FIXED) ===
        addButton.addEventListener('click', function() {
            const tbody = table.querySelector('tbody');
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
        table.addEventListener('click', function(event) {
            if (event.target.classList.contains('remove-row')) {
                event.target.closest('tr').remove();
            }
        });

        // === REAL-TIME VALIDATION ===
        table.addEventListener('input', function(event) {
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
