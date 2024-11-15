
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { Fragment, useEffect, useState } from '@wordpress/element';
import { MyMonacoEditor, updatePersistentIDs, handleThemeOptionsForSelects, updateTagName, addMediaQuery, removeMediaQuery, updateMediaQuery } from '../blocks';
import { PanelBody, PanelRow, TextControl, Button, SelectControl, BaseControl } from '@wordpress/components';
import { setAttributes } from '@wordpress/blocks';
import metadata from './block.json';
import apiFetch from '@wordpress/api-fetch';

export default function Edit(props) {
    const { attributes, setAttributes, clientId } = props;
    const { tag, persistentID, blockName, otherAttributes, selectedBGColor, manualClasses, mediaQueries = [], renderedMediaQueries, anchor } = attributes;
    const [tagName, setTagName] = useState(tag);
    const [themeOptions, setThemeOptions] = useState({});
    const [selectBGColorOptions, setSelectBGColorOptions] = useState([]);
    const blockProps = useBlockProps();
    const innerBlocksProps = useInnerBlocksProps(blockProps, {
        template: [[ 'custom-blocks/text', { content: __( 'Default Group content, put as many components as you like inside.', 'bloclklib' ) } ]],
        templateLock: false
    });

    // Fetches datas from WP database and pass it to the themeOptions state.
    useEffect(() => {
        apiFetch({ path: '/wp/v2/settings' })
        .then((settings) => {
            setThemeOptions(settings);
            setSelectBGColorOptions(handleThemeOptionsForSelects(settings.theme_colors, __( 'Select a background color', 'bloclklib' )));
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

    return (
        <Fragment>
            <InspectorControls>
                <PanelBody title={ __( 'Base settings', 'bloclklib' ) }>
                    <TextControl
                        __nextHasNoMarginBottom
                        label={ __( 'Tag', 'bloclklib' ) }
                        value={ tag || 'div' }
                        onChange={ (newTag) => updateTagName(setAttributes, setTagName, newTag, 'div') }
                        placeholder={ __( 'Use any HTML tag', 'blocklib' ) }
                    />
                    <SelectControl
                        __nextHasNoMarginBottom
                        label={__( 'Background color', 'bloclklib' )}
                        options={selectBGColorOptions}
                        value={selectedBGColor}
                        onChange={(newValue) => setAttributes({ selectedBGColor: newValue })}
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
                    ...innerBlocksProps,
                    'data-persistentid': persistentID,
                    style: {
                        '--bgColor': selectedBGColor
                    },
                    className: [
                        blockName,
                        manualClasses || ''
                    ].filter(Boolean).join(' ')
                },
            ) }
        </Fragment>
    )
}
