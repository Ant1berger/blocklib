
import { __ } from '@wordpress/i18n';
import { InspectorControls, InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { Fragment, useEffect, useState } from '@wordpress/element';
import { MyMonacoEditor, updatePersistentIDs, handleWPOptionsColorsForSelects, updateTagName, addMediaQuery, removeMediaQuery, updateMediaQuery } from '../blocks';
import { PanelBody, PanelRow, TextControl, Button, Modal, ToggleControl, SelectControl, BaseControl } from '@wordpress/components';
import { setAttributes } from '@wordpress/blocks';
import metadata from './block.json';
import apiFetch from '@wordpress/api-fetch';

export default function Edit(props) {
    const { attributes, setAttributes, clientId } = props;
    const { tag, persistentID, blockName, closeWhenClickOutside, openOnHover, otherAttributes, manualClasses, mediaQueries = [], renderedMediaQueries, anchor } = attributes;
    const [tagName, setTagName] = useState(tag);
    const [themeOptions, setThemeOptions] = useState({});
    const [selectBGColorOptions, setSelectBGColorOptions] = useState([]);
    const blockProps = useBlockProps();

    // Fetches datas from WP database and pass it to the themeOptions state.
    useEffect(() => {
        apiFetch({ path: '/wp/v2/settings' })
        .then((settings) => {
            setThemeOptions(settings);
            setSelectBGColorOptions(handleWPOptionsColorsForSelects(settings.color_matching_mapping, __( 'Select a background color', 'bloclklib' )));
        })
        .catch((error) => {
            console.error('Erreur lors de la récupération des options de thème :', error);
        });
    }, [blockName]);

    // Set the block name attribute from json "name" path for automatic reuse.
    useEffect(() => {
        setAttributes({ blockName: metadata.name.slice(14) });
    }, []);

    // Create a unique and persistent ID for useBlockProps.
    useEffect( () => {
        updatePersistentIDs(setAttributes, persistentID, blockName, clientId);
    }, [blockName] );

    // Write media queries. This function stays in this file otherwise copy/paste of blocks don't work properly.
    const renderMediaQueries = () => {
        if (mediaQueries.length > 0) {
            return `[data-persistentid="${persistentID}"] {
${mediaQueries.map((query) => {
                    if (!query.css && !query.predefinedBGColor ) {
                        return null;
                    } else {
                        return `${query.minWidth ?
`@media (min-width: ${query.minWidth}px) {
${query.predefinedBGColor ? `background-color: ${query.predefinedBGColor};` : ''}
${query.css ? `${query.css}` : ''}
}` :
`${query.predefinedBGColor ? `background-color: ${query.predefinedBGColor};` : ''}
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

    const helpPopin = () => {
        const [ isOpen, setOpen ] = useState( false );
        const openModal = () => setOpen( true );
        const closeModal = () => setOpen( false );

        return (
            <>
            <Button variant="secondary" onClick={ openModal }>
                { __( 'Help', 'bloclklib' ) }
            </Button>
            { isOpen && (
                <Modal className='blocklib-popin' size="medium" title={ __( 'How to use the Dropdown block', 'bloclklib' ) } onRequestClose={ closeModal }>
                    <p>{__( 'Dropdowns are used to show or hide content when clicking on a controller. They integrate easily into components that require them. They can be found, for example, in navigation menus, language switchers, and other components like accordions, etc. Here’s how to use them on pages:', 'bloclklib' )}</p>
                    <ol>
                        <li>
                            {__( 'Place the dropdown where you want it to appear. Do not change its structure: keep its “Dropdown content” block inside. Then place the content to be shown/hidden inside “Dropdown content”', 'bloclklib' )}
                        </li>
                        <li>
                            {__( 'Add the class “dropdown-controller” to the element that will act as the trigger (most often a Trigger block with the <button type="button"> element).', 'bloclklib' )}
                        </li>
                        <li>
                            {__( 'Make sure the Dropdown and its controller share a common ancestor that contains no other Dropdowns. Give this ancestor the class “dropdown-parent”.', 'bloclklib' )}
                        </li>
                        <li>
                            {__( 'Avoid margins and paddings on the Dropdown or its Dropdown-content, as they can interfere with the animation. Prefer using translate or inset properties where possible, or apply spacing to the elements around the dropdown or to the content inside it.', 'bloclklib' )}
                        </li>
                    </ol>
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
                                label={__( 'Background color', 'bloclklib' )}
                                options={selectBGColorOptions}
                                value={query.predefinedBGColor}
                                onChange={(newValue) => updateMediaQuery(setAttributes, index, 'predefinedBGColor', newValue, mediaQueries)}
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
                    <ToggleControl
                        __nextHasNoMarginBottom
                        label={ __( 'Close when click outside ?', 'bloclklib' ) }
                        checked={ !! closeWhenClickOutside }
                        onChange={ () =>
                            setAttributes( {
                                closeWhenClickOutside: ! closeWhenClickOutside,
                            } )
                        }
                    />
                    <ToggleControl
                        __nextHasNoMarginBottom
                        help={ __( 'If "open on hover" is enabled, "close when click outside" has no effect.', 'bloclklib' ) }
                        label={ __( 'Open on hover ?', 'bloclklib' ) }
                        checked={ !! openOnHover }
                        onChange={ () =>
                            setAttributes( {
                                openOnHover: ! openOnHover,
                            } )
                        }
                    />
                    <BaseControl
                        __nextHasNoMarginBottom
                        label={ __( 'How to use?', 'bloclklib' ) }
                        className="flex-base-control"
                    >
                        {helpPopin()}
                    </BaseControl>
                </PanelBody>
                <PanelBody title={ __( 'Other settings', 'bloclklib' ) }>
                    <TextControl
                        __nextHasNoMarginBottom
                        label={ __( 'Tag', 'bloclklib' ) }
                        value={ tag || 'div' }
                        onChange={ (newTag) => updateTagName(setAttributes, setTagName, newTag, 'div') }
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
                        placeholder={ __( 'Add ID if needed (no spaces)', 'blocklib' ) }
                    />
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
                        closeWhenClickOutside ? '-closeWhenClickOutside' : '',
                        openOnHover ? '-openOnHover' : '',
                        manualClasses || ''
                    ].filter(Boolean).join(' ')
                },
                <InnerBlocks
                    template={ [[ 'custom-blocks/dropdown-content', {} ]] }
                />
            ) }
        </Fragment>
    )
}
