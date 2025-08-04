
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps, RichText } from '@wordpress/block-editor';
import { Fragment, useEffect, useState } from '@wordpress/element';
import { MyMonacoEditor, updatePersistentIDs, handleWPOptionsColorsForSelects, handleWPOptionsFontsForSelects, updateTagName, addMediaQuery, removeMediaQuery, updateMediaQuery } from '../blocks';
import { PanelBody, PanelRow, TextControl, Button, SelectControl, BaseControl } from '@wordpress/components';
import { setAttributes } from '@wordpress/blocks';
import metadata from './block.json';
import apiFetch from '@wordpress/api-fetch';

export default function Edit(props) {
    const { attributes, setAttributes, clientId } = props;
    const { tag, persistentID, blockName, otherAttributes, manualClasses, mediaQueries = [], renderedMediaQueries, anchor, content } = attributes;
    const [tagName, setTagName] = useState(tag);
    const [themeOptions, setThemeOptions] = useState({});
    const [selectColorOptions, setSelectColorOptions] = useState([]);
    const [selectFontOptions, setSelectFontOptions] = useState([]);
    const [isEditingHidden, setIsEditingHidden] = useState(false);
    const [overlayColor, setOverlayColor] = useState('#f5f5f5');
    const blockProps = useBlockProps();

    // Fetches datas from WP database and pass it to the themeOptions state.
    useEffect(() => {
        apiFetch({ path: '/wp/v2/settings' })
        .then((settings) => {
            setThemeOptions(settings);
            setSelectColorOptions(handleWPOptionsColorsForSelects(settings.color_matching_mapping, __( 'Select a color', 'bloclklib' )));
            setSelectFontOptions(handleWPOptionsFontsForSelects(settings.font_matching_mapping, __( 'Select a font', 'bloclklib' )));
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
                    if (!query.css && !query.predefinedColor && !query.predefinedFont && !query.predefinedSize ) {
                        return null;
                    } else {
                        return `${query.minWidth ?
`@media (min-width: ${query.minWidth}px) {
${query.predefinedColor ? `--color: ${query.predefinedColor};` : ''}
${query.predefinedFont ? `--fontFamily: ${query.predefinedFont};` : ''}
${query.predefinedSize ? `--size: ${query.predefinedSize};` : ''}
${query.css ? `${query.css}` : ''}
}` :
`${query.predefinedColor ? `--color: ${query.predefinedColor};` : ''}
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

    const iframeBody = document.querySelector('iframe[name="editor-canvas"]').contentDocument?.body || document.querySelector('iframe[name="editor-canvas"]').contentWindow?.document?.body;

    return (
        <Fragment>
            <InspectorControls>
                <PanelBody title={ __( 'Styles', 'bloclklib' ) } initialOpen={true}>
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
                                label={__( 'Font', 'bloclklib' )}
                                options={selectFontOptions}
                                value={query.predefinedFont}
                                onChange={(newValue) => updateMediaQuery(setAttributes, index, 'predefinedFont', newValue, mediaQueries)}
                            />
                            <TextControl
                                __nextHasNoMarginBottom
                                label={ __( 'Size', 'bloclklib' ) }
                                value={query.predefinedSize}
                                onChange={(newValue) => updateMediaQuery(setAttributes, index, 'predefinedSize', newValue, mediaQueries)}
                                placeholder={ __( 'Défault: inherit', 'blocklib' ) }
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
                <PanelBody title={ __( 'Other settings', 'bloclklib' ) }>
                    <TextControl
                        __nextHasNoMarginBottom
                        label={ __( 'Tag', 'bloclklib' ) }
                        value={ tag || 'p' }
                        onChange={ (newTag) => updateTagName(setAttributes, setTagName, newTag, 'p') }
                        placeholder={ __( 'Use any HTML tag', 'blocklib' ) }
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
                <PanelBody title={ __( 'Alternative editing', 'bloclklib' ) } initialOpen={false}>
                    <BaseControl
                        __nextHasNoMarginBottom
                        help={ __( 'Use this to edit some hidden content.', 'bloclklib' )}
                    >
                        <div className="alternative-editing">
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setIsEditingHidden(!isEditingHidden);
                                    if (!isEditingHidden) {
                                        iframeBody.style.setProperty('--alt-edit-overlay-bg', overlayColor);
                                    }
                                }}
                            >
                                {isEditingHidden ? __('Stop editing', 'bloclklib') : __('Start editing', 'bloclklib')}
                            </Button>
                            <input
                                type="color"
                                value={overlayColor}
                                onChange={(e) => {
                                    const newColor = e.target.value;
                                    setOverlayColor(newColor);
                                    if (isEditingHidden) {
                                        iframeBody.style.setProperty('--alt-edit-overlay-bg', newColor);
                                    }
                                }}
                                title={__('Overlay color', 'bloclklib')}
                            />
                        </div>
                    </BaseControl>
                </PanelBody>
            </InspectorControls>
            { renderedMediaQueries && <style>{ renderedMediaQueries }</style> }
            <RichText {...blockProps}
                tagName={ tag }
                placeholder={ __( 'Write your content here', 'blocklib' ) }
                value={ content }
                data-persistentid={ persistentID }
                className={[
                    blockName,
                    isEditingHidden ? 'beingAlternativelyEdited' : '',
                    manualClasses || ''
                ].filter(Boolean).join(' ')}
                onChange={ ( content ) => setAttributes( { content } ) }
                allowedFormats={ [ 'core/bold', 'core/italic', 'core/underline', 'core/strikethrough', 'core/link', 'core/code', 'core/keyboard', 'core/image', 'core/subscript', 'core/superscript', 'core/language', 'core/non-breaking-space' ] }
            />
        </Fragment>
    )
}
