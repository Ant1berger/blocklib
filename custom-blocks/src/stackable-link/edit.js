
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
    const { tag, url, openInNewTab, type, persistentID, blockName, otherAttributes, leftIcon, rightIcon, manualClasses, mediaQueries = [], renderedMediaQueries, anchor, content } = attributes;
    const [tagName, setTagName] = useState(tag);
    const [themeOptions, setThemeOptions] = useState({});
    const [selectColorOptions, setSelectColorOptions] = useState([]);
    const [selectBGColorOptions, setSelectBGColorOptions] = useState([]);
    const [selectFontOptions, setSelectFontOptions] = useState([]);
    const blockProps = useBlockProps();

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
        updatePersistentIDs(setAttributes, persistentID, blockName, clientId);
    }, [blockName] );

    // Write media queries. This function stays in this file otherwise copy/paste of blocks don't work properly.
    const renderMediaQueries = () => {
        if (mediaQueries.length > 0) {
            return `[data-persistentid="${persistentID}"] {
${mediaQueries.map((query) => {
                    if (!query.css && !query.predefinedColor && !query.predefinedBGColor && !query.predefinedFont && !query.predefinedSize ) {
                        return null;
                    } else {
                        return `${query.minWidth ?
`@media (min-width: ${query.minWidth}px) {
${query.predefinedColor ? `--color: ${query.predefinedColor};` : ''}
${query.predefinedBGColor ? `--bgColor: ${query.predefinedBGColor};` : ''}
${query.predefinedFont ? `--fontFamily: ${query.predefinedFont};` : ''}
${query.predefinedSize ? `--size: ${query.predefinedSize};` : ''}
${query.css ? `${query.css}` : ''}
}` :
`${query.predefinedColor ? `--color: ${query.predefinedColor};` : ''}
${query.predefinedBGColor ? `--bgColor: ${query.predefinedBGColor};` : ''}
${query.predefinedFont ? `--fontFamily: ${query.predefinedFont};` : ''}
${query.predefinedSize ? `--size: ${query.predefinedSize};` : ''}
${query.css ? `${query.css}` : ''}`
}`;
                    }
                }).join('\n')}
}`;
        } else {
            return null;
        }
    };
    // Put the returned value in a renderedMediaQueries attribute.
    useEffect( () => {
        setAttributes({renderedMediaQueries: renderMediaQueries()});
    }, [persistentID, renderMediaQueries()] );

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
                                onChange={(value) => updateMediaQuery(setAttributes, index, 'minWidth', value, mediaQueries)}
                            />
                            <SelectControl
                                __nextHasNoMarginBottom
                                label={__( 'Color', 'bloclklib' )}
                                options={selectColorOptions}
                                value={query.predefinedColor}
                                onChange={(newValue) => updateMediaQuery(setAttributes, index, 'predefinedColor', newValue, mediaQueries)}
                            />
                            <SelectControl
                                __nextHasNoMarginBottom
                                label={__( 'Background color', 'bloclklib' )}
                                options={selectBGColorOptions}
                                value={query.predefinedBGColor}
                                onChange={(newValue) => updateMediaQuery(setAttributes, index, 'predefinedBGColor', newValue, mediaQueries)}
                            />
                            <SelectControl
                                __nextHasNoMarginBottom
                                label={__( 'Font', 'bloclklib' )}
                                options={selectFontOptions}
                                value={query.predefinedFont}
                                onChange={(newValue) => updateMediaQuery(setAttributes, index, 'predefinedFont', newValue, mediaQueries)}
                            />
                            <SelectControl
                                __nextHasNoMarginBottom
                                label={__( 'Size', 'bloclklib' )}
                                options={selectSizeOptions}
                                value={query.predefinedSize}
                                onChange={(newValue) => updateMediaQuery(setAttributes, index, 'predefinedSize}', newValue, mediaQueries)}
                            />
                            <PanelRow className="monaco-editor">
                                <MyMonacoEditor
                                    defaultValue={`& {\n}`}
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
