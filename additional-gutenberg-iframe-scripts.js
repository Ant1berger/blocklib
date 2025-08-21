// Only for information.
if(window.parent === window) {
    console.log('Additional Gutenberg IFRAME scripts OUTSIDE iframe');
} else {
    console.log('Additional Gutenberg IFRAME scripts INSIDE iframe');
}

// =============================================================================
// Get fonts urls and types actually used on the page with precise weight/style matching.
// =============================================================================
function getUsedFonts() {
    let usedFonts = new Set();
    let fontFaceRules = new Set();

    // Get all font-faces on the website with their weight and style properties
    Array.from(document.styleSheets).forEach(sheet => {
        try {
            Array.from(sheet.cssRules || []).forEach(rule => {
                if (rule.type === CSSRule.FONT_FACE_RULE) {
                    const src = rule.style.src;
                    if (src) {
                        // Extract font URLs and their types
                        const urls = src.match(/url\(['"]?([^'"]+)['"]?\)(\s+format\(['"]?([^'"]+)['"]?\))?/g);
                        if (urls) {
                            urls.forEach(urlMatch => {
                                const matches = urlMatch.match(/url\(['"]?([^'"]+)['"]?\)(?:\s+format\(['"]?([^'"]+)['"]?\))?/);
                                if (matches) {
                                    const url = matches[1];
                                    let type = matches[2]; // Format explicitly declared

                                    // Only process WordPress uploaded fonts
                                    if (url.includes('/wp-content/uploads/')) {
                                        // If no explicit format, derive from URL extension
                                        if (!type) {
                                            const extension = url.split('.').pop().toLowerCase();
                                            switch (extension) {
                                                case 'woff2':
                                                    type = 'font/woff2';
                                                    break;
                                                case 'woff':
                                                    type = 'font/woff';
                                                    break;
                                                case 'otf':
                                                    type = 'font/otf';
                                                    break;
                                                case 'ttf':
                                                    type = 'font/ttf';
                                                    break;
                                                case 'eot':
                                                    type = 'application/vnd.ms-fontobject';
                                                    break;
                                                default:
                                                    type = 'font/' + extension;
                                            }
                                        } else {
                                            // Normalize format values to proper MIME types
                                            switch (type.toLowerCase()) {
                                                case 'woff2':
                                                    type = 'font/woff2';
                                                    break;
                                                case 'woff':
                                                    type = 'font/woff';
                                                    break;
                                                case 'opentype':
                                                case 'otf':
                                                    type = 'font/otf';
                                                    break;
                                                case 'truetype':
                                                case 'ttf':
                                                    type = 'font/ttf';
                                                    break;
                                                case 'embedded-opentype':
                                                case 'eot':
                                                    type = 'application/vnd.ms-fontobject';
                                                    break;
                                                default:
                                                    // Keep original if already properly formatted
                                                    if (!type.startsWith('font/') && !type.startsWith('application/')) {
                                                        type = 'font/' + type;
                                                    }
                                            }
                                        }

                                        // Extract font-weight and font-style from the @font-face rule
                                        const fontWeight = rule.style.fontWeight || '400'; // Default to normal
                                        const fontStyle = rule.style.fontStyle || 'normal'; // Default to normal

                                        // Create a unique identifier for this font variant
                                        const fontVariantKey = `${rule.style.fontFamily.replace(/['"]/g, '')}-${fontWeight}-${fontStyle}`;

                                        fontFaceRules.add({
                                            family: rule.style.fontFamily.replace(/['"]/g, ''),
                                            weight: fontWeight,
                                            style: fontStyle,
                                            url: url.substring(url.indexOf('/wp-content')),
                                            type: type,
                                            variantKey: fontVariantKey
                                        });
                                    }
                                }
                            });
                        }
                    }
                }
            });
        } catch (e) {
            // Ignore CORS errors from external stylesheets
            console.warn('Could not access stylesheet:', e);
        }
    });

    // Iterate through all loaded font-families in the page and create variant keys
    for (const font of document.fonts) {
        // Only consider fonts that are actually loaded
        if (font.status === 'loaded') {
            // Create the same variant key format as in @font-face rules
            const fontVariantKey = `${font.family}-${font.weight}-${font.style}`;

            usedFonts.add(fontVariantKey);
        }
    }

    // Cross-reference with declared @font-face rules using precise variant matching
    const actuallyUsedFontUrls = [];
    fontFaceRules.forEach(fontFace => {
        if (usedFonts.has(fontFace.variantKey)) {
            actuallyUsedFontUrls.push({
                url: fontFace.url,
                type: fontFace.type,
                family: fontFace.family,
                weight: fontFace.weight,
                style: fontFace.style
            });
        }
    });

    return actuallyUsedFontUrls;
}

// =============================================================================
// CONTEXT DETECTION AND SETUP
// =============================================================================
let isProcessing = false;

// Check if we're in the PARENT context (editor)
if (window.parent === window) {

    // =============================================================================
    // PARENT CONTEXT: Listen for WordPress save events
    // =============================================================================
    if (typeof wp !== 'undefined' && wp.data && wp.data.select('core/editor')) {
        wp.data.subscribe(() => {
            const isSavingPost = wp.data.select('core/editor').isSavingPost();
            const isAutosaving = wp.data.select('core/editor').isAutosavingPost();

            // Trigger font detection when saving (not autosaving)
            if (isSavingPost && !isAutosaving && !isProcessing) {
                isProcessing = true;

                // =============================================================================
                // Find iframe and send message to trigger font detection
                // =============================================================================
                // Try different iframe selectors (WordPress can use different ones)
                const iframeSelectors = [
                    'iframe[name="editor-canvas"]',
                    'iframe[title="Editor canvas"]',
                    '.edit-site-visual-editor__editor-canvas iframe',
                    '.block-editor-iframe__body iframe'
                ];

                let iframe = null;
                for (let selector of iframeSelectors) {
                    iframe = document.querySelector(selector);
                    if (iframe) {
                        break;
                    }
                }

                if (iframe) {
                    // Send message to iframe to trigger font detection
                    iframe.contentWindow.postMessage({
                        type: 'TRIGGER_FONT_DETECTION',
                        action: 'save',
                        timestamp: Date.now()
                    }, '*');
                } else {
                    // No iframe found, reset processing flag
                    isProcessing = false;
                }
            }
        });

        // =============================================================================
        // Listen for font detection results from iframe
        // =============================================================================
        window.addEventListener('message', (event) => {
            // Filter out messages from other sources (React DevTools, extensions, etc.)
            if (event.data.type === 'FONT_DETECTION_RESULT') {
                const usedFonts = event.data.fonts;

                // =============================================================================
                // Save fonts to WordPress meta
                // =============================================================================
                if (Object.keys(usedFonts).length > 0) {
                    // Update post meta with detected fonts
                    wp.data.dispatch('core/editor').editPost({
                        meta: {
                            'used_fonts': usedFonts
                        }
                    });

                    // Trigger save
                    wp.data.dispatch('core/editor').savePost().then(response => {
                        isProcessing = false;
                    }).catch(error => {
                        isProcessing = false;
                    });
                } else {
                    // No fonts detected, just reset processing flag
                    isProcessing = false;
                }
            }
        });
    }
} else {

    // =============================================================================
    // IFRAME CONTEXT: Listen for font detection triggers
    // =============================================================================
    window.addEventListener('message', (event) => {
        // Filter out messages from other sources and only respond to font detection triggers
        if (event.data.type === 'TRIGGER_FONT_DETECTION') {
            // Small delay to ensure DOM is ready
            setTimeout(() => {
                // Execute font detection in iframe context
                const usedFonts = getUsedFonts();

                // Send result back to parent
                window.parent.postMessage({
                    type: 'FONT_DETECTION_RESULT',
                    fonts: usedFonts,
                    timestamp: Date.now()
                }, '*');
            }, 1000);
        }
    });
}
