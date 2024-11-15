
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps, RichText } from '@wordpress/block-editor';
import { Fragment, useEffect, useState } from '@wordpress/element';
import { MyMonacoEditor, updatePersistentIDs, parseSVG, handleThemeOptionsForSelects, updateTagName, addMediaQuery, removeMediaQuery, updateMediaQuery } from '../blocks';
import { PanelBody, PanelRow, TextControl, Button, SelectControl, ToggleControl, BaseControl } from '@wordpress/components';
import { setAttributes } from '@wordpress/blocks';
import metadata from './block.json';
import apiFetch from '@wordpress/api-fetch';

export default function Edit(props) {
    const { attributes, setAttributes, clientId } = props;
    const { tag, url, openInNewTab, type, persistentID, blockName, otherAttributes, size, selectedColor, selectedBGColor, selectedBorderColor, selectedFont, rounded, inverted, invisibleBorder, leftIcon, invisibleText, fullWidth, manualClasses, mediaQueries = [], renderedMediaQueries, anchor, content } = attributes;
    const [tagName, setTagName] = useState(tag);
    const [themeOptions, setThemeOptions] = useState({});
    const [selectColorOptions, setSelectColorOptions] = useState([]);
    const [selectBGColorOptions, setSelectBGColorOptions] = useState([]);
    const [selectBorderColorOptions, setSelectBorderColorOptions] = useState([]);
    const [selectFontOptions, setSelectFontOptions] = useState([]);
    const blockProps = useBlockProps();

    // Fetches datas from WP database and pass it to the themeOptions state.
    useEffect(() => {
        apiFetch({ path: '/wp/v2/settings' })
        .then((settings) => {
            setThemeOptions(settings);
            setSelectColorOptions(handleThemeOptionsForSelects(settings.theme_colors, __( 'Select a color', 'bloclklib' )));
            setSelectBGColorOptions(handleThemeOptionsForSelects(settings.theme_colors, __( 'Select a background color', 'bloclklib' )));
            setSelectBorderColorOptions(handleThemeOptionsForSelects(settings.theme_colors, __( 'Select a border color', 'bloclklib' )));
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
        updatePersistentIDs(setAttributes, persistentID, blockName, clientId);
    }, [blockName] );

    // Write media queries. This function stays in this file otherwise copy/paste of blocks don't work properly.
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
    // Put the returned value in a renderedMediaQueries attribute.
    useEffect( () => {
        setAttributes({renderedMediaQueries: renderMediaQueries()});
    }, [persistentID, renderMediaQueries()] );

    const leftSvg = parseSVG(leftIcon);

    return (
        <Fragment>
            <InspectorControls>
                <PanelBody title={ __( 'Base settings', 'bloclklib' ) }>
                    <TextControl
                        __nextHasNoMarginBottom
                        label={ __( 'Tag', 'bloclklib' ) }
                        value={ tag || 'a' }
                        onChange={ (newTag) => updateTagName(setAttributes, setTagName, newTag, 'a') }
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
                        label={__( 'Border color', 'bloclklib' )}
                        options={selectBorderColorOptions}
                        value={selectedBorderColor}
                        onChange={(newValue) => setAttributes({ selectedBorderColor: newValue })}
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
                        help={ !inverted && invisibleBorder ? __( 'Invisible border is more suitable with Inverted buttons', 'bloclklib' ) : ''}
                    >
                        <ToggleControl
                            __nextHasNoMarginBottom
                            label={ __( 'Rounded ?', 'bloclklib' ) }
                            checked={ !! rounded }
                            onChange={ () =>
                                setAttributes( {
                                    rounded: ! rounded,
                                } )
                            }
                        />
                        <ToggleControl
                            __nextHasNoMarginBottom
                            label={ __( 'Inverted ?', 'bloclklib' ) }
                            checked={ !! inverted }
                            onChange={ () =>
                                setAttributes( {
                                    inverted: ! inverted,
                                } )
                            }
                        />
                        <ToggleControl
                            __nextHasNoMarginBottom
                            label={ __( 'Invisible border ?', 'bloclklib' ) }
                            checked={ !! invisibleBorder }
                            onChange={ () =>
                                setAttributes( {
                                    invisibleBorder: ! invisibleBorder,
                                } )
                            }
                        />
                    </BaseControl>
                    <BaseControl
                        __nextHasNoMarginBottom
                        help={ !leftIcon && invisibleText ? __( 'Hide text only if there is at least on icon, or your knob will be empty!', 'bloclklib' ) : ''}
                    >
                        <TextControl
                            __nextHasNoMarginBottom
                            label={ __( 'Left icon', 'bloclklib' ) }
                            value={ leftIcon || '' }
                            onChange={ ( value ) => setAttributes( { leftIcon: value } ) }
                            placeholder={ __( 'Paste <svg>', 'blocklib' ) }
                        />
                        <ToggleControl
                            __nextHasNoMarginBottom
                            label={ __( 'Invisible text ?', 'bloclklib' ) }
                            checked={ !! invisibleText }
                            onChange={ () =>
                                setAttributes( {
                                    invisibleText: ! invisibleText,
                                } )
                            }
                        />
                    </BaseControl>
                    <ToggleControl
                        __nextHasNoMarginBottom
                        label={ __( 'Full width ?', 'bloclklib' ) }
                        checked={ !! fullWidth }
                        onChange={ () =>
                            setAttributes( {
                                fullWidth: ! fullWidth,
                            } )
                        }
                    />
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
                                onChange={(value) => updateMediaQuery(setAttributes, index, 'minWidth', value, mediaQueries)}
                            />
                            <PanelRow className="monaco-editor">
                                <MyMonacoEditor
                                    defaultValue={`:not(#lalala) {\n}`}
                                    value={query.css}
                                    onChange={(value) => updateMediaQuery(setAttributes, index, 'css', value, mediaQueries)}
                                />
                            </PanelRow>
                            <Button
                                isDestructive
                                variant="secondary"
                                size="small"
                                icon="trash"
                                className="delete"
                                onClick={() => removeMediaQuery(setAttributes, index, mediaQueries)}
                            >
                            </Button>
                        </div>
                    ))}
                    <Button variant="primary" onClick={() => addMediaQuery(setAttributes, mediaQueries)} className="add-media-query">
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
                        '--borderColor': selectedBorderColor,
                        '--fontFamily': selectedFont
                    },
                    className: [
                        blockName,
                        rounded ? '-rounded' : '',
                        inverted ? '-inverted' : '',
                        invisibleBorder ? '-invisibleBorder' : '',
                        leftIcon ? '-leftIcon' : '',
                        invisibleText ? '-invisibleText' : '',
                        fullWidth ? '-fullWidth' : '',
                        manualClasses || ''
                    ].filter(Boolean).join(' ')
                },
                leftSvg,
                <span className={`${blockName}-text`}>
                    <RichText
                        placeholder={ __( 'Write your content here', 'blocklib' ) }
                        value={ content }
                        onChange={ ( content ) => setAttributes( { content } ) }
                        allowedFormats={ [ 'core/bold', 'core/italic', 'core/underline', 'core/strikethrough', 'core/code', 'core/keyboard', 'core/image', 'core/subscript', 'core/superscript', 'core/language', 'core/non-breaking-space' ] }
                    />
                </span>
            ) }
        </Fragment>
    )
}
