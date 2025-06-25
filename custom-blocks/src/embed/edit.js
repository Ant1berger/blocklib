
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { Fragment, useEffect, useState } from '@wordpress/element';
import { MyMonacoEditor, updatePersistentIDs, handleThemeOptionsForSelects, addMediaQuery, removeMediaQuery, updateMediaQuery } from '../blocks';
import { PanelBody, PanelRow, TextControl, Button, BaseControl, __experimentalText as Text } from '@wordpress/components';
import { setAttributes } from '@wordpress/blocks';
import metadata from './block.json';

export default function Edit(props) {
    const { attributes, setAttributes, clientId } = props;
    const { persistentID, blockName, url, width, height, otherAttributes, manualClasses, mediaQueries = [], renderedMediaQueries, anchor } = attributes;
    const blockProps = useBlockProps();
    const innerBlocksProps = useInnerBlocksProps(blockProps);

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
                    if (!query.css ) {
                        return null;
                    } else {
                        return `${query.minWidth ?
`@media (min-width: ${query.minWidth}px) {
${query.css ? `${query.css}` : ''}
}` :
`${query.css ? `${query.css}` : ''}`
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
                        label={ __( 'Classes', 'bloclklib' ) }
                        value={ manualClasses || '' }
                        onChange={ ( value ) => setAttributes( { manualClasses: value } ) }
                        placeholder={ __( 'Add HTML classes if needed', 'blocklib' ) }
                    />
                    <TextControl
                        __nextHasNoMarginBottom
                        help={ __( 'https://www.youtube-nocookie.com/embed/bssZTv3BgkE', 'bloclklib' ) }
                        label={ __( 'Url', 'bloclklib' ) }
                        value={ url || '' }
                        onChange={ ( value ) => setAttributes( { url: value } ) }
                        placeholder={ __( 'Add the iframe src value', 'blocklib' ) }
                    />
                    <TextControl
                        __nextHasNoMarginBottom
                        label={ __( 'Width', 'bloclklib' ) }
                        value={ width || '' }
                        onChange={ ( value ) => setAttributes( { width: value } ) }
                        placeholder={ __( 'Add the iframe src value', 'blocklib' ) }
                    />
                    <TextControl
                        __nextHasNoMarginBottom
                        help={ __( 'Set width and height to prevent layout shifts', 'bloclklib' ) }
                        label={ __( 'Height', 'bloclklib' ) }
                        value={ height || '' }
                        onChange={ ( value ) => setAttributes( { height: value } ) }
                        placeholder={ __( 'Add the iframe src value', 'blocklib' ) }
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
                        <Text>
                            <strong>{ __( 'A few handy attributes for iframes:', 'blocklib' ) }</strong>
                            <pre className='white-space-normal'>{ __( 'loading="lazy" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"', 'blocklib' ) }</pre>
                        </Text>
                    </BaseControl>
                    <TextControl
                        __nextHasNoMarginBottom
                        label={ __( 'Anchor', 'bloclklib' ) }
                        value={ anchor || '' }
                        onChange={ ( value ) => setAttributes( { anchor: value } ) }
                        placeholder={ __( 'Add HTML ID if needed (no spaces)', 'blocklib' ) }
                    />
                </PanelBody>
            </InspectorControls>
            { renderedMediaQueries && <style>{ renderedMediaQueries }</style> }
            <iframe {...blockProps}
                data-persistentid={ persistentID }
                src={ url }
                width={ width }
                height={ height }
                className={[
                    blockName,
                    manualClasses || ''
                ].filter(Boolean).join(' ')}
                frameborder="0"
            ></iframe>
        </Fragment>
    )
}
