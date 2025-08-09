
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps, RichText } from '@wordpress/block-editor';
import { Fragment, useEffect, useState } from '@wordpress/element';
import { MyMonacoEditor, updatePersistentIDs, parseSVG, handleWPOptionsColorsForSelects, handleWPOptionsFontsForSelects, updateTagName, addMediaQuery, removeMediaQuery, updateMediaQuery } from '../blocks';
import { PanelBody, PanelRow, TextControl, Button, Modal, SelectControl, ToggleControl, BaseControl } from '@wordpress/components';
import { setAttributes } from '@wordpress/blocks';
import metadata from './block.json';
import apiFetch from '@wordpress/api-fetch';

export default function Edit(props) {
    const { attributes, setAttributes, clientId } = props;
    const { tag, url, openInNewTab, type, persistentID, blockName, otherAttributes, rounded, leftIcon, rightIcon, invisibleText, fullWidth, manualClasses, mediaQueries = [], renderedMediaQueries, anchor, content } = attributes;
    const [tagName, setTagName] = useState(tag);
    const [themeOptions, setThemeOptions] = useState({});
    const [selectColorOptions, setSelectColorOptions] = useState([]);
    const [selectBGColorOptions, setSelectBGColorOptions] = useState([]);
    const [selectBorderColorOptions, setSelectBorderColorOptions] = useState([]);
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
            setSelectBGColorOptions(handleWPOptionsColorsForSelects(settings.color_matching_mapping, __( 'Select a background color', 'bloclklib' )));
            setSelectBorderColorOptions(handleWPOptionsColorsForSelects(settings.color_matching_mapping, __( 'Select a border color', 'bloclklib' )));
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
                    if (!query.css && !query.predefinedColor && !query.predefinedBGColor && !query.predefinedBorderColor && !query.predefinedBorderStyle && !query.predefinedBorderWidth && !query.predefinedFont && !query.predefinedFontSize && !query.predefinedFontSize && !query.predefinedBorderRadius && !query.predefinedPaddingInline && !query.predefinedPaddingBlock && !query.predefinedGap && !query.predefinedLineHeight ) {
                        return null;
                    } else {
                        return `${query.minWidth ?
`@media (min-width: ${query.minWidth}px) {
${query.predefinedColor ? `color: ${query.predefinedColor};` : ''}
${query.predefinedBGColor ? `background-color: ${query.predefinedBGColor};` : ''}
${query.predefinedBorderColor ? `border-color: ${query.predefinedBorderColor};` : ''}
${query.predefinedBorderStyle ? `border-style: ${query.predefinedBorderStyle};` : ''}
${query.predefinedBorderWidth ? `border-width: ${query.predefinedBorderWidth};` : ''}
${query.predefinedFont ? `font-family: ${query.predefinedFont};` : ''}
${query.predefinedFontSize ? `font-size: ${query.predefinedFontSize};` : ''}
${query.predefinedBorderRadius ? `border-radius: ${query.predefinedBorderRadius};` : ''}
${query.predefinedPaddingInline ? `padding-inline: ${query.predefinedPaddingInline};` : ''}
${query.predefinedPaddingBlock ? `padding-block: ${query.predefinedPaddingBlock};` : ''}
${query.predefinedGap ? `gap: ${query.predefinedGap};` : ''}
${query.predefinedLineHeight ? `line-height: ${query.predefinedLineHeight};` : ''}
${query.css ? `${query.css}` : ''}
}` :
`${query.predefinedColor ? `color: ${query.predefinedColor};` : ''}
${query.predefinedBGColor ? `background-color: ${query.predefinedBGColor};` : ''}
${query.predefinedBorderColor ? `border-color: ${query.predefinedBorderColor};` : ''}
${query.predefinedBorderStyle ? `border-style: ${query.predefinedBorderStyle};` : ''}
${query.predefinedBorderWidth ? `border-width: ${query.predefinedBorderWidth};` : ''}
${query.predefinedFont ? `font-family: ${query.predefinedFont};` : ''}
${query.predefinedFontSize ? `font-size: ${query.predefinedFontSize};` : ''}
${query.predefinedBorderRadius ? `border-radius: ${query.predefinedBorderRadius};` : ''}
${query.predefinedPaddingInline ? `padding-inline: ${query.predefinedPaddingInline};` : ''}
${query.predefinedPaddingBlock ? `padding-block: ${query.predefinedPaddingBlock};` : ''}
${query.predefinedGap ? `gap: ${query.predefinedGap};` : ''}
${query.predefinedLineHeight ? `line-height: ${query.predefinedLineHeight};` : ''}
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

    const iframeBody = document.querySelector('iframe[name="editor-canvas"]').contentDocument?.body || document.querySelector('iframe[name="editor-canvas"]').contentWindow?.document?.body;

    const hoverPopin = () => {
        const [ isOpen, setOpen ] = useState( false );
        const openModal = () => setOpen( true );
        const closeModal = () => setOpen( false );

        return (
            <>
            <Button variant="secondary" onClick={ openModal }>
                { __( 'Show hover samples', 'bloclklib' ) }
            </Button>
            { isOpen && (
                <Modal className='blocklib-popin' title={ __( 'Hover and focus samples', 'bloclklib' ) } onRequestClose={ closeModal }>
                    <p>{__( 'Copy and paste those CSS templates in your block instances CSS to quick style hover and focus states. Change the values afterwards to suit your needs. You can even mix several templates if you like.' )}</p>
                    <div className='two-columns'>
                        <pre className='codesample'>
                        {__( `/* "Underlined" hover & focus-visible */

@media(prefers-reduced-motion: no-preference) {

    &:after {
        transition: block-size .2s;
    }
}

position: relative;

&:after {
    content: "";
    position: absolute;
    inset-block-end: 0;
    inset-inline-start: 0;
    inset-inline-end: 0;
    block-size: 0;
    background-color: var(--test-color);
}

&:hover::after,
&:focus-visible::after,
&.-current::after {
    block-size: .2em;
}`, 'bloclklib' )}
                        </pre>
                        <pre className='codesample'>
                        {__( `/* "Inverted" hover & focus-visible */

@media(prefers-reduced-motion: no-preference) {

    transition: background-color .2s, color .2s;

    .-leftIcon svg {
        transition: fill .2s;
    }
}

outline: none;

&:hover,
&:focus-visible {
    background-color: transparent;
    color: var(--test-color);
}`, 'bloclklib' )}
                        </pre>
                        <pre className='codesample'>
                        {__( `/* "Unstuck" hover & focus-visible */

@media(prefers-reduced-motion: no-preference) {

    transition: scale .2s, box-shadow .2s;
}

scale: 1;
box-shadow: none;
outline: none;

&:hover,
&:focus-visible {
    scale: 1.05;
    box-shadow: 0 0.2em 0.5em oklch(from var(--grey_start) l c h / 40%);
}`, 'bloclklib' )}
                        </pre>
                        <pre className='codesample'>
                        {__( `/* "BG Lighten / darken" hover & focus-visible */

@media(prefers-reduced-motion: no-preference) {

    transition: background-color .2s;
}

outline: none;

/* Ask for a result in HSL to get a constant */
/* lightening (or darkening) while keeping the same hue. */
&:hover,
&:focus-visible {
    background-color: color-mix(in hsl, #fff 100%, #000000 30%);
}`, 'bloclklib' )}
                        </pre>
                        <pre className='codesample'>
                        {__( `/* "Outlined" hover & focus-visible */

@media(prefers-reduced-motion: no-preference) {

    transition: outline-color .2s;
}

outline-color: oklch(from var(--grey_end) l c h / 0%);
outline-width: .3rem;
outline-offset: .3rem;
outline-style: dotted;

&:hover,
&:focus-visible {
    outline-color: oklch(from var(--grey_end) l c h / 100%);
}`, 'bloclklib' )}
                        </pre>
                        <pre className='codesample'>
                        {__( `/* "Translated icon" hover & focus-visible */

@media(prefers-reduced-motion: no-preference) {

    &.-rightIcon > svg:last-child {
        transition: translate .2s;
    }
}

&.-rightIcon > svg:last-child,
&.-rightIcon > svg:last-child {
    translate: 0;
}

&:hover.-rightIcon > svg:last-child,
&:focus-visible.-rightIcon > svg:last-child {
    translate: .5em;
}`, 'bloclklib' )}
                        </pre>
                    </div>
                    <Button variant="secondary" onClick={ closeModal }>
                        { __( 'Close', 'bloclklib' ) }
                    </Button>
                </Modal>
            ) }
            </>
        );
    };

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
                                label={__( 'Background color', 'bloclklib' )}
                                options={selectBGColorOptions}
                                value={query.predefinedBGColor}
                                onChange={(newValue) => updateMediaQuery(setAttributes, index, 'predefinedBGColor', newValue, mediaQueries)}
                            />
                            <SelectControl
                                __nextHasNoMarginBottom
                                label={__( 'Border color', 'bloclklib' )}
                                options={selectBorderColorOptions}
                                value={query.predefinedBorderColor}
                                onChange={(newValue) => updateMediaQuery(setAttributes, index, 'predefinedBorderColor', newValue, mediaQueries)}
                            />
                            <TextControl
                                __nextHasNoMarginBottom
                                label={ __( 'Border style', 'bloclklib' ) }
                                value={query.predefinedBorderStyle}
                                onChange={(newValue) => updateMediaQuery(setAttributes, index, 'predefinedBorderStyle', newValue, mediaQueries)}
                                placeholder={ __( 'Défault: none', 'blocklib' ) }
                            />
                            <TextControl
                                __nextHasNoMarginBottom
                                label={ __( 'Border width', 'bloclklib' ) }
                                value={query.predefinedBorderWidth}
                                onChange={(newValue) => updateMediaQuery(setAttributes, index, 'predefinedBorderWidth', newValue, mediaQueries)}
                                placeholder={ __( 'Défault: medium', 'blocklib' ) }
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
                                label={ __( 'Font size', 'bloclklib' ) }
                                value={query.predefinedFontSize}
                                onChange={(newValue) => updateMediaQuery(setAttributes, index, 'predefinedFontSize', newValue, mediaQueries)}
                                placeholder={ __( 'Défault: inherit', 'blocklib' ) }
                            />
                            <TextControl
                                __nextHasNoMarginBottom
                                label={ __( 'Border radius', 'bloclklib' ) }
                                value={query.predefinedBorderRadius}
                                onChange={(newValue) => updateMediaQuery(setAttributes, index, 'predefinedBorderRadius', newValue, mediaQueries)}
                                placeholder={ __( 'Défault: 0', 'blocklib' ) }
                            />
                            <TextControl
                                __nextHasNoMarginBottom
                                label={ __( 'Padding inline', 'bloclklib' ) }
                                value={query.predefinedPaddingInline}
                                onChange={(newValue) => updateMediaQuery(setAttributes, index, 'predefinedPaddingInline', newValue, mediaQueries)}
                                placeholder={ __( 'Défault: 0', 'blocklib' ) }
                            />
                            <TextControl
                                __nextHasNoMarginBottom
                                label={ __( 'Padding block', 'bloclklib' ) }
                                value={query.predefinedPaddingBlock}
                                onChange={(newValue) => updateMediaQuery(setAttributes, index, 'predefinedPaddingBlock', newValue, mediaQueries)}
                                placeholder={ __( 'Défault: 0', 'blocklib' ) }
                            />
                            <TextControl
                                __nextHasNoMarginBottom
                                label={ __( 'Gap', 'bloclklib' ) }
                                value={query.predefinedGap}
                                onChange={(newValue) => updateMediaQuery(setAttributes, index, 'predefinedGap', newValue, mediaQueries)}
                                placeholder={ __( 'Défault: normal', 'blocklib' ) }
                            />
                            <TextControl
                                __nextHasNoMarginBottom
                                label={ __( 'Line height', 'bloclklib' ) }
                                value={query.predefinedLineHeight}
                                onChange={(newValue) => updateMediaQuery(setAttributes, index, 'predefinedLineHeight', newValue, mediaQueries)}
                                placeholder={ __( 'Défault: normal', 'blocklib' ) }
                            />
                            <p>{ __( 'Try "em" unit for other lengths to follow the font-size of your block.', 'bloclklib' ) }</p>
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
                    <BaseControl
                        __nextHasNoMarginBottom
                        help={ !leftIcon && invisibleText ? __( 'Hide text only if there is at least one icon, or your Trigger will be empty!', 'bloclklib' ) : ''}
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
                    <BaseControl
                        __nextHasNoMarginBottom
                        label={ __( 'Hover state?', 'bloclklib' ) }
                    >
                        {hoverPopin()}
                    </BaseControl>
                </PanelBody>
                <PanelBody title={ __( 'Other settings', 'bloclklib' ) }>
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
            { React.createElement(
                tag,
                {
                    ...blockProps,
                    'data-persistentid': persistentID,
                    className: [
                        blockName,
                        isEditingHidden ? 'beingAlternativelyEdited' : '',
                        rounded ? '-rounded' : '',
                        leftIcon ? '-leftIcon' : '',
                        rightIcon ? '-rightIcon' : '',
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
                </span>,
                rightSvg
            ) }
        </Fragment>
    )
}
