
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps, RichText } from '@wordpress/block-editor';
import { Fragment, useEffect, useState } from '@wordpress/element';
import MonacoEditor from '@monaco-editor/react';
import { PanelBody, PanelRow, TextControl, Button, SelectControl } from '@wordpress/components';
import { setAttributes } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import metadata from './block.json';
import apiFetch from '@wordpress/api-fetch';

// Initialize Monaco editor
const MyMonacoEditor = ({ defaultValue, value, onChange }) => {
    return (
        <MonacoEditor
            height="100%"
            language="css"
            theme="vs-dark"
            defaultValue={defaultValue}
            value={value}
            onChange={(newValue) => onChange(newValue)}
            options={{
                minimap: { enabled: false },
                automaticLayout: true,
                lineNumbers: false
            }}
        />
    );
};

// Initialize unique IDs array
const uniqueIds = [];

export default function Edit(props) {
    const { attributes, setAttributes, clientId } = props;
    const { tag, uniqueId, blockStyles, blockClasses, blockName, selectedColorClass, selectedFontClass, manualClasses, mediaQueries = [], renderedMediaQueries, blockStylesTag, content } = attributes;
    const [tagName, setTagName] = useState(tag);
    const [themeOptions, setThemeOptions] = useState({});

    // Fetches datas from WP database and pass it to the themeOptions state.
    useEffect(() => {
        apiFetch({ path: '/wp/v2/settings' })
        .then((settings) => {
            setThemeOptions(settings);
        })
        .catch((error) => {
            console.error('Erreur lors de la récupération des options de thème :', error);
        });
    }, []);

    // Set the block name attribute from json "name" path for automatic reuse.
    useEffect( () => {
        setAttributes({ blockName: metadata.name.slice(14) });
    }, [] );

    // Create a unique and persistent ID for useBlockProps.
    useEffect( () => {
        if ( ( null === uniqueId || '' === uniqueId ) || uniqueIds.includes( uniqueId ) ) {
            const newUniqueId = 'blocklib-' + blockName + '-' + clientId.substr( 2, 9 ).replace( '-', '' );
            setAttributes( { uniqueId: newUniqueId } );
            uniqueIds.push( newUniqueId );
        } else {
            uniqueIds.push( uniqueId );
        }
    }, [blockName] );

    // Check if the block is the first of its kind in the page to avoid injecting the <style> tag multiple times.
    useEffect(() => {
        if( blockList && blockList.length > 1 ) {
            blockList.forEach(block => {
                if( block.id.includes('blocklib-' + blockName) ) {
                    if( block.id.includes(uniqueId) ) {
                        setAttributes({ blockStylesTag: false });
                        return
                    } else {
                        setAttributes({ blockStylesTag: true });
                        return
                    }
                } else {
                    setAttributes({ blockStylesTag: false });
                }
            });
        } else if( blockList && blockList.length == 1 ) {
            setAttributes({ blockStylesTag: false });
        }
    }, [blockList, blockStylesTag]);

    // Generates the CSS from the theme options.
    const handleThemeOptionsForModifiers = (optionId, cssProp) => {
        let cssVarsString = '';
        for (const property in optionId) {
            if( optionId[property] ) {
                cssVarsString += `.${blockName}.-${property} {
    ${cssProp}: var(--${property});
}
`;
}
        };
        return cssVarsString;
    }

    // Generates the choices for <select> from the theme options.
    const handleThemeOptionsForSelects = (optionId, emptyOptionText) => {
        let optionsArray = [{ label: emptyOptionText, value: '' }];
        for (const property in optionId) {
            if( optionId[property] ) {
                optionsArray.push({ label: property, value: '-' + property });
}
        };
        return optionsArray;
    }

    // Update block's CSS modifiers from theme options.
    setAttributes({
            blockStyles: `.${blockName} {
    margin: 0;
    text-wrap: balance;
    hyphens: auto;
}
${handleThemeOptionsForModifiers(themeOptions.theme_colors, 'color')}
${handleThemeOptionsForModifiers(themeOptions.theme_fonts, 'font-family')}
`
    });

    // Avoid empty tagName for the rendered component.
    const updateTagName = (newTag) => {
        if (newTag.trim() === '') {
            newTag = 'h1';
        }
        setTagName(newTag);
        setAttributes({ tag: newTag });
    };

    // Add, remove, update and render the instance CSS, organized by media queries.
    const addMediaQuery = () => {
        const newQuery = {
            minWidth: '',
            css: '',
        };
        setAttributes({ mediaQueries: [...mediaQueries, newQuery] });
    };

    const removeMediaQuery = (index) => {
        const updatedQueries = mediaQueries.filter((_, i) => i !== index);
        setAttributes({ mediaQueries: updatedQueries });
    };

    const updateMediaQuery = (index, field, value) => {
        const updatedQueries = mediaQueries.map((query, i) =>
            i === index ? { ...query, [field]: value } : query
        );
        setAttributes({ mediaQueries: updatedQueries });
    };

    // Put the returned value in a renderedMediaQueries attribute.
    const renderMediaQueries = () => {
        return mediaQueries.map((query) => {
            if (!query.minWidth || !query.css) return null;
            if (query.minWidth !== '0') {
                return `@media (min-width: ${query.minWidth}px) {
${query.css}
}`;
            } else {
                return `${query.css}`;
            }
        }).join('\n');
    };
    setAttributes({renderedMediaQueries: renderMediaQueries()});

    // Put the returned value in a blockClasses attribute.
    const buildClasses = () => {
        let addedClasses = '';
        if (selectedColorClass) {
            addedClasses += ' ' + selectedColorClass;
        }
        if (selectedFontClass) {
            addedClasses += ' ' + selectedFontClass;
        }
        if (manualClasses) {
            addedClasses += ' ' + manualClasses;
        }
        return addedClasses;
    };
    setAttributes({blockClasses: buildClasses()});

    return (
        <Fragment {...useBlockProps()}>
            <InspectorControls>
                <PanelBody title={ __( 'Base settings', 'bloclklib' ) }>
                    <TextControl
                        label={ __( 'Tag', 'bloclklib' ) }
                        value={ tag || 'h1' }
                        onChange={ updateTagName }
                        placeholder={ __( 'Use any HTML tag', 'blocklib' ) }
                    />
                    <SelectControl
                        label={__( 'Font', 'bloclklib' )}
                        options={handleThemeOptionsForSelects(themeOptions.theme_fonts, __( 'Select a font', 'bloclklib' ))}
                        value={selectedFontClass}
                        onChange={(newValue) => setAttributes({ selectedFontClass: newValue })}
                    />
                    <SelectControl
                        label={__( 'Color', 'bloclklib' )}
                        options={handleThemeOptionsForSelects(themeOptions.theme_colors, __( 'Select a color', 'bloclklib' ))}
                        value={selectedColorClass}
                        onChange={(newValue) => setAttributes({ selectedColorClass: newValue })}
                    />
                    <TextControl
                        label={ __( 'Classes', 'bloclklib' ) }
                        value={ manualClasses || '' }
                        onChange={ ( value ) => setAttributes( { manualClasses: value } ) }
                        placeholder={ __( 'Add HTML classes if needed', 'blocklib' ) }
                    />
                </PanelBody>
                <PanelBody title={ __( 'Spacing, sizing, moving...', 'bloclklib' ) } initialOpen={true}>
                    {mediaQueries.map((query, index) => (
                        <div key={index} className="media-query">
                            <TextControl
                                label={ __( '@media (min-width: ', 'bloclklib' ) }
                                value={query.minWidth}
                                onChange={(value) => updateMediaQuery(index, 'minWidth', value)}
                            />
                            <PanelRow className="monaco-editor">
                                <MyMonacoEditor
                                    defaultValue={ "#" + uniqueId + " {}" }
                                    value={query.css}
                                    onChange={(value) => updateMediaQuery(index, 'css', value)}
                                />
                            </PanelRow>
                            <Button
                                isDestructive
                                variant="secondary"
                                size="small"
                                icon="trash"
                                className="delete"
                                onClick={() => removeMediaQuery(index)}
                            >
                            </Button>
                        </div>
                    ))}
                    <Button variant="primary" onClick={addMediaQuery} className="add-media-query">
                    { __( 'Add a media query', 'bloclklib' ) }
                    </Button>
                </PanelBody>
            </InspectorControls>
            <RichText
                tagName={ tag }
                id={ uniqueId }
                placeholder={ __( 'Write your content here', 'blocklib' ) }
                value={ content }
                className={blockName + blockClasses}
                onChange={ ( content ) => props.setAttributes( { content } ) }
                allowedFormats={ [ 'core/bold', 'core/italic', 'core/underline', 'core/strikethrough', 'core/link', 'core/code', 'core/image', 'core/subscript', 'core/superscript' ] }
            />
            { !blockStylesTag && <style id={'blockstyles-' + blockName}>{blockStyles}</style> }
            { renderedMediaQueries && <style>{renderedMediaQueries}</style> }
        </Fragment>
    )
}
