
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps, RichText } from '@wordpress/block-editor';
import { Fragment, useEffect, useState } from '@wordpress/element';
import MonacoEditor from '@monaco-editor/react';
import { PanelBody, PanelRow, TextControl, Button, SelectControl, ToggleControl, BaseControl } from '@wordpress/components';
import { setAttributes } from '@wordpress/blocks';
import metadata from './block.json';
import apiFetch from '@wordpress/api-fetch';
import { useSelect } from '@wordpress/data';

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
const persistentIDs = [];

// Transform an SVG string into a React element.
const parseSVG = (svgString) => {
    if (!svgString) return null;
    // Créer un élément temporaire pour parser le SVG
    const div = document.createElement('div');
    div.innerHTML = svgString.trim();

    // Récupérer le premier élément SVG
    const svg = div.firstChild;

    // Extraire les attributs du SVG
    const attrs = {};
    for (let i = 0; i < svg.attributes.length; i++) {
        const attr = svg.attributes[i];
        attrs[attr.name] = attr.value;
    }

    // Retourner un élément React SVG avec ses attributs et son contenu
    return React.createElement(
        'svg',
        { ...attrs, dangerouslySetInnerHTML: { __html: svg.innerHTML } }
    );
};

export default function Edit(props) {
    const { attributes, setAttributes, clientId } = props;
    const { tag, url, openInNewTab, type, persistentID, blockName, otherAttributes, size, selectedColor, selectedBGColor, selectedFont, leftIcon, rightIcon, manualClasses, mediaQueries = [], renderedMediaQueries, anchor, content } = attributes;
    const [tagName, setTagName] = useState(tag);
    const [themeOptions, setThemeOptions] = useState({});
    const [selectColorOptions, setSelectColorOptions] = useState([]);
    const [selectBGColorOptions, setSelectBGColorOptions] = useState([]);
    const [selectBorderColorOptions, setSelectBorderColorOptions] = useState([]);
    const [selectFontOptions, setSelectFontOptions] = useState([]);
    const blockProps = useBlockProps();
    const siteUrl = useSelect((select) => {
        const entity = select('core').getEntityRecord('root', 'site');
        return entity ? entity.url : '';
    }, []);

    // Fetches datas from WP database and pass it to the themeOptions state.
    useEffect(() => {
        apiFetch({ path: '/wp/v2/settings' })
        .then((settings) => {
            setThemeOptions(settings);
            setSelectColorOptions(handleThemeOptionsForSelects(settings.theme_colors, __( 'Select a color', 'bloclklib' )));
            setSelectBGColorOptions(handleThemeOptionsForSelects(settings.theme_colors, __( 'Select a background color', 'bloclklib' )));
            setSelectFontOptions(handleThemeOptionsForSelects(settings.theme_fonts, __( 'Select a font', 'bloclklib' )));
        })
        .catch((error) => {
            console.error('Erreur lors de la récupération des options de thème :', error);
        });
    }, [blockName]);

    // Set the block name attribute from json "name" path for automatic reuse.
    useEffect( () => {
        setAttributes({ blockName: metadata.name.slice(14) });
    }, [] );

    // Create a unique and persistent ID for useBlockProps.
    useEffect( () => {
        if ( ( null === persistentID || '' === persistentID ) || persistentIDs.includes( persistentID ) ) {
            const newpersistentID = 'blb-' + blockName + '-' + clientId.substr( 2, 9 ).replace( '-', '' );
            setAttributes( { persistentID: newpersistentID } );
            persistentIDs.push( newpersistentID );
        } else {
            persistentIDs.push( persistentID );
        }
    }, [blockName] );

    // Generates the choices for <select> from the theme options.
    const handleThemeOptionsForSelects = (optionId, emptyOptionText) => {
        let optionsArray = [{ label: emptyOptionText, value: '' }];
        for (const property in optionId) {
            if( optionId[property] ) {
                optionsArray.push({ label: property, value: 'var(--' + property + ')' });
            }
        };
        return optionsArray;
    }

    // Avoid empty tagName for the rendered component.
    const updateTagName = (newTag) => {
        if (newTag.trim() === '') {
            newTag = 'p';
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
[data-persistentid="${persistentID}"]${query.css}
}`;
            } else {
                return `[data-persistentid="${persistentID}"]${query.css}`;
            }
        }).join('\n');
    };
    useEffect( () => {
        setAttributes({renderedMediaQueries: renderMediaQueries()});
    }, [renderMediaQueries()] );

    const leftSvg = parseSVG(leftIcon);
    const rightSvg = parseSVG(rightIcon);

    return (
        <Fragment>
            <InspectorControls>
                <PanelBody title={ __( 'Base settings', 'bloclklib' ) }>
                    <TextControl
                        __nextHasNoMarginBottom
                        label={ __( 'Tag', 'bloclklib' ) }
                        value={ tag || 'a' }
                        onChange={ updateTagName }
                        placeholder={ __( 'Use any HTML tag', 'blocklib' ) }
                    />
                    { tag === 'a' &&
                        <div>
                            <TextControl
                                __nextHasNoMarginBottom
                                label={ __( 'URL', 'bloclklib' ) }
                                value={ url || '#' }
                                onChange={(newValue) => setAttributes({ url: newValue })}
                                placeholder={ __( 'Enter a URL', 'blocklib' ) }
                            />
                            <ToggleControl
                                __nextHasNoMarginBottom
                                label={ __( 'Open in a new tab ?', 'bloclklib' ) }
                                checked={ !! openInNewTab }
                                onChange={ () =>
                                    setAttributes( {
                                        openInNewTab: ! openInNewTab,
                                    } )
                                }
                            />
                        </div>
                    }
                    { tag === 'button' &&
                        <TextControl
                            __nextHasNoMarginBottom
                            label={ __( 'Type', 'bloclklib' ) }
                            value={ type || '' }
                            onChange={(newValue) => setAttributes({ type: newValue })}
                            placeholder={ __( 'Enter a type', 'blocklib' ) }
                        />
                    }
                    <TextControl
                        __nextHasNoMarginBottom
                        label={ __( 'Size', 'bloclklib' ) }
                        value={ size || '' }
                        onChange={ ( value ) => setAttributes( { size: value } ) }
                        placeholder={ __( 'Default: 1.8rem', 'blocklib' ) }
                    />
                    <SelectControl
                        __nextHasNoMarginBottom
                        label={__( 'Color', 'bloclklib' )}
                        options={selectColorOptions}
                        value={selectedColor}
                        onChange={(newValue) => setAttributes({ selectedColor: newValue })}
                    />
                    <SelectControl
                        __nextHasNoMarginBottom
                        label={__( 'Background color', 'bloclklib' )}
                        options={selectBGColorOptions}
                        value={selectedBGColor}
                        onChange={(newValue) => setAttributes({ selectedBGColor: newValue })}
                    />
                    <SelectControl
                        __nextHasNoMarginBottom
                        label={__( 'Font', 'bloclklib' )}
                        options={selectFontOptions}
                        value={selectedFont}
                        onChange={(newValue) => setAttributes({ selectedFont: newValue })}
                    />
                    <hr/>
                    <BaseControl
                        __nextHasNoMarginBottom
                    >
                        <TextControl
                            __nextHasNoMarginBottom
                            label={ __( 'Left icon', 'bloclklib' ) }
                            value={ leftIcon || '' }
                            onChange={ ( value ) => setAttributes( { leftIcon: value } ) }
                            placeholder={ __( 'Paste <svg>', 'blocklib' ) }
                        />
                        <TextControl
                            __nextHasNoMarginBottom
                            label={ __( 'Right icon', 'bloclklib' ) }
                            value={ rightIcon || '' }
                            onChange={ ( value ) => setAttributes( { rightIcon: value } ) }
                            placeholder={ __( 'Paste <svg>', 'blocklib' ) }
                        />
                    </BaseControl>
                    <hr/>
                    <TextControl
                        __nextHasNoMarginBottom
                        label={ __( 'Classes', 'bloclklib' ) }
                        value={ manualClasses || '' }
                        onChange={ ( value ) => setAttributes( { manualClasses: value } ) }
                        placeholder={ __( 'Add HTML classes if needed', 'blocklib' ) }
                    />
                    <BaseControl
                        __nextHasNoMarginBottom
                        help={ __( 'Avoid using style attribute, it\'s already in use and might be ignored.', 'bloclklib' ) }
                    >
                        <TextControl
                            __nextHasNoMarginBottom
                            label={ __( 'Other attributes', 'bloclklib' ) }
                            value={ otherAttributes || '' }
                            onChange={ ( value ) => setAttributes( { otherAttributes: value } ) }
                            placeholder={ __( 'Add HTML attributes if needed', 'blocklib' ) }
                        />
                    </BaseControl>
                    <TextControl
                        __nextHasNoMarginBottom
                        label={ __( 'Anchor', 'bloclklib' ) }
                        value={ anchor || '' }
                        onChange={ ( value ) => setAttributes( { anchor: value } ) }
                        placeholder={ __( 'Add HTML ID if needed (no spaces)', 'blocklib' ) }
                    />
                </PanelBody>
                <PanelBody title={ __( 'Spacing, sizing, moving...', 'bloclklib' ) } initialOpen={true}>
                    {mediaQueries.map((query, index) => (
                        <div key={index} className="media-query">
                            <TextControl
                                __nextHasNoMarginBottom
                                label={ __( '@media (min-width: ', 'bloclklib' ) }
                                value={query.minWidth}
                                onChange={(value) => updateMediaQuery(index, 'minWidth', value)}
                            />
                            <PanelRow className="monaco-editor">
                                <MyMonacoEditor
                                    defaultValue={`:not(#lalala) {\n}`}
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
            { renderedMediaQueries && <style>{ renderedMediaQueries }</style> }
            { React.createElement(
                tag,
                {
                    ...blockProps,
                    'data-persistentid': persistentID,
                    style: {
                        '--size': size,
                        '--color': selectedColor,
                        '--bgColor': selectedBGColor,
                        '--fontFamily': selectedFont
                    },
                    className: [
                        blockName,
                        leftIcon ? '-leftIcon' : '',
                        rightIcon ? '-rightIcon' : '',
                        manualClasses || ''
                    ].filter(Boolean).join(' '),
                },
                leftSvg,
                <span className={`${blockName}-text`}>
                    <RichText
                        placeholder={ __( 'Write your content here', 'blocklib' ) }
                        value={ content }
                        onChange={ ( content ) => setAttributes( { content } ) }
                        allowedFormats={ [ 'core/bold', 'core/italic', 'core/underline', 'core/strikethrough', 'core/code', 'core/keyboard', 'core/image', 'core/subscript', 'core/superscript', 'core/language', 'core/non-breaking-space' ] }
                    />
                </span>,
                rightSvg
            ) }
        </Fragment>
    )
}
