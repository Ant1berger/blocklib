
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { Fragment, useEffect, useState } from '@wordpress/element';
import MonacoEditor from '@monaco-editor/react';
import { PanelBody, PanelRow, TextControl, Button, SelectControl, ToggleControl } from '@wordpress/components';
import { setAttributes } from '@wordpress/blocks';
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
// const uniqueIds = [];

export default function Edit(props) {
    const { attributes, setAttributes, clientId } = props;
    const { tag, uniqueId, blockStyles, blockName, selectedBGColorClass, manualClasses, mediaQueries = [], renderedMediaQueries, blockStylesTag } = attributes;
    const [tagName, setTagName] = useState(tag);
    const [themeOptions, setThemeOptions] = useState({});
    const [blockBGColorModifiers, setBlockBGColorModifiers] = useState('');
    const [selectBGColorOptions, setSelectBGColorOptions] = useState([]);
    const blockProps = useBlockProps();

    // Fetches datas from WP database and pass it to the themeOptions state.
    useEffect(() => {
        apiFetch({ path: '/wp/v2/settings' })
        .then((settings) => {
            setThemeOptions(settings);
            setBlockBGColorModifiers(handleThemeOptionsForModifiers(settings.theme_colors, 'background-color'));
            setSelectBGColorOptions(handleThemeOptionsForSelects(settings.theme_colors, __( 'Select a color', 'bloclklib' )));
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
    // useEffect( () => {
    //     if ( ( null === uniqueId || '' === uniqueId ) || uniqueIds.includes( uniqueId ) ) {
    //         const newUniqueId = 'blocklib-' + blockName + '-' + clientId.substr( 2, 9 ).replace( '-', '' );
    //         setAttributes( { uniqueId: newUniqueId } );
    //         uniqueIds.push( newUniqueId );
    //     } else {
    //         uniqueIds.push( uniqueId );
    //     }
    // }, [blockName] );

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
    useEffect( () => {
        setAttributes({
            blockStyles: `.${blockName} {
    display: flex;
    justify-content: center;
}
${blockBGColorModifiers}
.section-content {
    flex-grow: 0;
    flex-shrink: 0;
    inline-size: 100%;
    max-inline-size: 128rem;
    padding-inline: var(--sectionPadding);
}
`
        });
    }, [blockName, blockBGColorModifiers] );

    // Avoid empty tagName for the rendered component.
    const updateTagName = (newTag) => {
        if (newTag.trim() === '') {
            newTag = 'div';
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

    return (
        <Fragment>
            <InspectorControls>
                <PanelBody title={ __( 'Base settings', 'bloclklib' ) }>
                    <TextControl
                        label={ __( 'Tag', 'bloclklib' ) }
                        value={ tag || 'h1' }
                        onChange={ updateTagName }
                        placeholder={ __( 'Use any HTML tag', 'blocklib' ) }
                    />
                    <SelectControl
                        label={__( 'Color', 'bloclklib' )}
                        options={selectBGColorOptions}
                        value={selectedBGColorClass}
                        onChange={(newValue) => setAttributes({ selectedBGColorClass: newValue })}
                    />
                    <TextControl
                        label={ __( 'Classes', 'bloclklib' ) }
                        value={ manualClasses || '' }
                        onChange={ ( value ) => setAttributes( { manualClasses: value } ) }
                        placeholder={ __( 'Add HTML classes if needed', 'blocklib' ) }
                    />
                    <ToggleControl
                        label={ __( 'Insert block\'s <style> tag', 'bloclklib' ) }
                        checked={ !! blockStylesTag }
                        onChange={ () =>
                            setAttributes( {
                                blockStylesTag: ! blockStylesTag,
                            } )
                        }
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
                                    defaultValue=""
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
            { React.createElement(
                tag,
                {
                    ...blockProps,
                    id: clientId,
                    className: [
                        blockName,
                        selectedBGColorClass || '',
                        manualClasses || ''
                    ].filter(Boolean).join(' ')
                },
                <div className="section-content">
                    <InnerBlocks
                        template={ [
                            [ 'custom-blocks/text', { content: __( 'Default section content, put as many components as you like inside.', 'bloclklib' ) } ]
                        ] }
                    />
                </div>
            ) }
            { blockStylesTag && <style id={'blockstyles-' + blockName}>{blockStyles}</style> }
            { renderedMediaQueries && <style>#{clientId + ' {' + renderedMediaQueries + '}'}</style> }
        </Fragment>
    )
}
