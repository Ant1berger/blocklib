
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps, MediaUpload, MediaUploadCheck, store as blockEditorStore } from '@wordpress/block-editor';
import { Fragment, useEffect } from '@wordpress/element';
import { MyMonacoEditor, updatePersistentIDs, addMediaQuery, removeMediaQuery, updateMediaQuery } from '../blocks';
import { PanelBody, PanelRow, TextControl, Button, SelectControl, BaseControl, __experimentalText as Text } from '@wordpress/components';
import { setAttributes } from '@wordpress/blocks';
import metadata from './block.json';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';

export default function Edit(props) {
    const { attributes, setAttributes, clientId } = props;
    const { persistentID, blockName, otherAttributes, pictureID, pictureURL, pictureMime, pictureAlt, pictureSizes, pictureSrcset, pictureSizesAttribute, pictureLoading, pictureFetchPriority, manualClasses, mediaQueries = [], renderedMediaQueries, anchor } = attributes;
    const blockProps = useBlockProps();
    const { selectBlock } = useDispatch(blockEditorStore);

    const handleImageClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        selectBlock(clientId);
    };

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

    // Add and remove images
    const onSelectImage = picture => {
        setAttributes({
            pictureID: picture.id,
            pictureURL: picture.url,
            pictureMime: picture.mime,
            pictureAlt: picture.alt,
            pictureSizes: picture.sizes
        })
    }

    const onRemoveImage = () => {
        setAttributes({
            pictureID: null,
            pictureURL: null,
            pictureMime: null,
            pictureAlt: null,
            pictureSizes: null,
            pictureSrcset: null
        })
    }

    // Set srcset from pictureSizes
    useEffect(() => {
        let srcset = '';
        if (pictureSizes) {
            Object.keys(pictureSizes).forEach((size) => {
                if (pictureSizes[size].width != '150') {
                    srcset += `${pictureSizes[size].url} ${pictureSizes[size].width}w, `;
                }
            });
            setAttributes({ pictureSrcset: srcset.slice(0, -2) });
        }
    }, [pictureSizes]);

    // Manage LCP
    const postType = useSelect(
        ( select ) => select( 'core/editor' ).getCurrentPostType(),
        []
    );

    const [ meta, setMeta ] = useEntityProp( 'postType', postType, 'meta' );

    const setAsLCP = () => {
        const newMeta = {
            ...meta,
            lcp_preload: {
                url: pictureURL,
                srcset: pictureSrcset,
                sizes: pictureSizesAttribute,
                as: pictureMime?.split('/')[0] || 'image',
                mime: pictureMime
            }
        };
        setMeta(newMeta);
    };

    const disableLCP = () => {
        const newMeta = {
            ...meta,
            lcp_preload: {
                url: '',
                srcset: '',
                sizes: '',
                as: '',
                mime: ''
            }
        };
        setMeta(newMeta);
    };

    const lcpData = meta?.lcp_preload || {};
    const hasLCP = !!lcpData.url;
    const isThisImageLCP = hasLCP && lcpData.url === pictureURL;

    useEffect(() => {
        if (isThisImageLCP) {
            setAttributes({pictureLoading: '', pictureFetchPriority: 'high'});
        }
    }, [isThisImageLCP]);

    return (
        <Fragment>
            <InspectorControls>
                <PanelBody title={ __( 'Base settings', 'bloclklib' ) }>
                    <BaseControl
                        __nextHasNoMarginBottom
                        label={ __( 'Image', 'bloclklib' ) }
                    >
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={ onSelectImage }
                                allowedTypes={ [ 'image' ] }
                                value={ pictureID }
                                render={ ( { open } ) => (
                                    <div>
                                        { ! pictureID && <Button variant="secondary" onClick={ open }> {__( 'Select an image', 'bloclklib' )}</Button> }
                                        { !! pictureID && pictureID &&
                                            <Button variant="link" onClick={ open }>
                                                <img src={ pictureURL } alt={ pictureAlt } />
                                            </Button>
                                        }
                                    </div>
                                ) }
                            />
                        </MediaUploadCheck>
                        { !! pictureID &&
                            <Button
                                onClick={ onRemoveImage }
                                isDestructive
                                variant="secondary"
                                size="small"
                                icon="trash"
                                className="delete-image"
                            >
                            </Button>
                        }
                    </BaseControl>
                    <BaseControl
                        __nextHasNoMarginBottom
                        help={ __( '(min-width: 60rem) 80vw, (min-width: 40rem) 90vw, 100vw', 'bloclklib' ) }
                    >
                        <TextControl
                            __nextHasNoMarginBottom
                            label={ __( 'Sizes', 'bloclklib' ) }
                            value={ pictureSizesAttribute || '' }
                            onChange={ ( value ) => setAttributes( { pictureSizesAttribute: value } ) }
                            placeholder={ __( 'Add Sizes attribute', 'blocklib' ) }
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
                <PanelBody title={ __( 'Image performance settings', 'bloclklib' ) } initialOpen={true}>
                    <Text>
                    {
                        hasLCP && !isThisImageLCP
                            ? __('Warning: Another image is currently set as LCP. Clicking those buttons will override the previous setting.', 'blocklib')
                            : __('Manage LCP for this post.', 'blocklib')
                    }
                    </Text>
                    <BaseControl
                        __nextHasNoMarginBottom
                        help={
                            hasLCP
                                ? __(`Current LCP: ${lcpData.url}}`, 'blocklib')
                                : __('No current LCP')
                        }
                    >
                        <div className="lcp-controls">
                            <Button
                                variant={isThisImageLCP ? "secondary" : "primary"}
                                onClick={setAsLCP}
                                disabled={!pictureURL}
                                className="set-lcp-button"
                            >
                                {isThisImageLCP
                                    ? __('This image is the current LCP', 'blocklib')
                                    : __('Set this image as LCP', 'blocklib')
                                }
                            </Button>

                            <Button
                                variant="secondary"
                                onClick={disableLCP}
                                isDestructive
                                className="disable-lcp-button"
                                disabled={!hasLCP}
                            >
                                {__('Disable LCP preload for this post', 'blocklib')}
                            </Button>
                        </div>
                    </BaseControl>
                    <BaseControl
                        __nextHasNoMarginBottom
                        help={__( 'Don\'t lazy load images above the fold, but all the others.', 'bloclklib' )}
                    >
                        <SelectControl
                            __nextHasNoMarginBottom
                            label={__( 'Loading', 'bloclklib' )}
                            options={ [
                                { label: __( 'Not set', 'bloclklib' ), value: '' },
                                { label: __( 'Lazy', 'bloclklib' ), value: 'lazy' },
                                { label: __( 'Eager', 'bloclklib' ), value: 'eager' }
                            ] }
                            value={ pictureLoading }
                            onChange={(newValue) => setAttributes({ pictureLoading: newValue })}
                            disabled={isThisImageLCP}
                        />
                    </BaseControl>
                    <BaseControl
                        __nextHasNoMarginBottom
                        help={__( 'Don\'t overuse fetch priority, but use it when one image has to be loaded first among others, even below the fold.', 'bloclklib' )}
                    >
                        <SelectControl
                            __nextHasNoMarginBottom
                            label={__( 'Fetch priority', 'bloclklib' )}
                            options={ [
                                { label: __( 'Not set', 'bloclklib' ), value: '' },
                                { label: __( 'High', 'bloclklib' ), value: 'high' },
                                { label: __( 'Low', 'bloclklib' ), value: 'low' }
                            ] }
                            value={ pictureFetchPriority }
                            onChange={(newValue) => setAttributes({ pictureFetchPriority: newValue })}
                            disabled={isThisImageLCP}
                        />
                    </BaseControl>
                </PanelBody>
            </InspectorControls>
            { renderedMediaQueries && <style>{ renderedMediaQueries }</style> }
            { !! pictureID && pictureID ?
                <img
                    {...blockProps}
                    onClick={handleImageClick}
                    src={ pictureURL }
                    alt={ pictureAlt }
                    data-persistentid={ persistentID }
                    className={[
                        blockName,
                        manualClasses || ''
                    ].filter(Boolean).join(' ')}
                /> :
                <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="300" height="300"><title>no-image</title><path class="cls-1" d="M292,256.36a5.13,5.13,0,0,1-5.14,5.14H225.14a5.13,5.13,0,0,1-5.14-5.14V204.93a5.13,5.13,0,0,1,5.14-5.14h61.71a5.13,5.13,0,0,1,5.14,5.14v51.43Zm-5.14-41.14V204.93H253.59L251,210.08H225.14v5.14h61.71Zm0,41.14v-5.14H225.14v5.14h61.71Zm-41.14-48.85v-5.14H230.29v5.14h15.43ZM256,217.87a15.43,15.43,0,1,0,15.43,15.43A15.43,15.43,0,0,0,256,217.87Zm0,25.71a10.29,10.29,0,1,1,10.28-10.29A10.31,10.31,0,0,1,256,243.58Zm0-16.79a6.45,6.45,0,0,0-6.43,6.43,1.29,1.29,0,0,0,2.57,0,3.86,3.86,0,0,1,3.86-3.86A1.29,1.29,0,0,0,256,226.79Z"/><path class="cls-1" d="M162.67,298.14h2.45l0.25,2.52h0.11c1.66-1.66,3.46-3,5.87-3,3.67,0,5.33,2.38,5.33,6.84v11.09h-3V304.94c0-3.28-1-4.68-3.31-4.68-1.8,0-3,.94-4.79,2.7v12.67h-3V298.14Z"/><path class="cls-1" d="M189.17,297.71c4.28,0,8.1,3.35,8.1,9.21s-3.82,9.14-8.1,9.14-8.1-3.35-8.1-9.14S184.88,297.71,189.17,297.71Zm0,15.91c3,0,5-2.7,5-6.7s-2-6.77-5-6.77-5,2.74-5,6.77S186.18,313.62,189.17,313.62Z"/><path class="cls-1" d="M208.61,292.63a2.06,2.06,0,0,1,4.1,0A2.06,2.06,0,0,1,208.61,292.63Zm0.54,5.51h3v17.49h-3V298.14Z"/><path class="cls-1" d="M218,298.14h2.45l0.25,2.52h0.11c1.51-1.66,3.35-3,5.44-3a4.59,4.59,0,0,1,4.82,3.35c1.84-2,3.64-3.35,5.76-3.35,3.6,0,5.33,2.38,5.33,6.84v11.09h-3V304.94c0-3.28-1-4.68-3.24-4.68-1.37,0-2.77.9-4.39,2.7v12.67h-3V304.94c0-3.28-1-4.68-3.28-4.68-1.3,0-2.77.9-4.39,2.7v12.67h-3V298.14Z"/><path class="cls-1" d="M257.74,304.54c0-2.23-.76-4.39-3.6-4.39a9.41,9.41,0,0,0-5.22,1.87L247.74,300a13,13,0,0,1,6.88-2.27c4.28,0,6.08,2.84,6.08,7.2v10.73h-2.45L258,313.54h-0.07a9.51,9.51,0,0,1-5.8,2.52c-3,0-5.15-1.84-5.15-5C247,307.28,250.29,305.37,257.74,304.54ZM253,313.69c1.69,0,3.1-.83,4.79-2.34v-4.86c-5.87.72-7.85,2.16-7.85,4.39C249.9,312.86,251.23,313.69,253,313.69Z"/><path class="cls-1" d="M267.5,315v-0.14A3.23,3.23,0,0,1,266,312a4.1,4.1,0,0,1,1.91-3.24v-0.14a6.19,6.19,0,0,1-2.27-4.71c0-3.82,3-6.23,6.59-6.23a7,7,0,0,1,2.48.43h6.08v2.27h-3.6a5.07,5.07,0,0,1,1.44,3.6c0,3.74-2.84,6.08-6.41,6.08a6.1,6.1,0,0,1-2.63-.61,2.65,2.65,0,0,0-1.12,2.09c0,1.12.72,1.91,3.1,1.91h3.38c4.07,0,6.12,1.26,6.12,4.18,0,3.24-3.42,6-8.86,6-4.28,0-7.23-1.69-7.23-4.72A5.05,5.05,0,0,1,267.5,315Zm5.11,6.62c3.35,0,5.54-1.73,5.54-3.56,0-1.62-1.26-2.16-3.53-2.16h-3a8.52,8.52,0,0,1-2.27-.29,3.68,3.68,0,0,0-1.8,3C267.54,320.46,269.45,321.64,272.61,321.64Zm3.28-17.71c0-2.56-1.66-4.07-3.71-4.07s-3.71,1.51-3.71,4.07,1.69,4.17,3.71,4.17S275.89,306.49,275.89,303.93Z"/><path class="cls-1" d="M290.47,297.71c4.46,0,7,3.2,7,8.21a10.4,10.4,0,0,1-.11,1.62H285.54c0.22,3.78,2.48,6.16,5.83,6.16a7.9,7.9,0,0,0,4.36-1.37l1,1.94a10.41,10.41,0,0,1-5.76,1.8c-4.68,0-8.39-3.42-8.39-9.14S286.47,297.71,290.47,297.71Zm4.39,7.88c0-3.56-1.58-5.54-4.32-5.54-2.45,0-4.68,2-5,5.54h9.36Z"/><path class="cls-1" d="M309.19,320.71c2,0,3.24-1.58,4-3.74l0.4-1.3-7-17.53h3.06l3.56,9.68c0.54,1.51,1.15,3.31,1.69,4.93H315c0.5-1.58,1-3.38,1.48-4.93l3.13-9.68h2.88l-6.59,18.93c-1.22,3.46-3,6.08-6.55,6.08a5.81,5.81,0,0,1-2.05-.36l0.58-2.34A5.13,5.13,0,0,0,309.19,320.71Z"/><path class="cls-1" d="M332.26,297.71c4.46,0,7,3.2,7,8.21a10.4,10.4,0,0,1-.11,1.62H327.33c0.22,3.78,2.48,6.16,5.83,6.16a7.9,7.9,0,0,0,4.36-1.37l1,1.94a10.41,10.41,0,0,1-5.76,1.8c-4.68,0-8.39-3.42-8.39-9.14S328.27,297.71,332.26,297.71Zm4.39,7.88c0-3.56-1.58-5.54-4.32-5.54-2.45,0-4.68,2-5,5.54h9.36Z"/><path class="cls-1" d="M343.57,300.55H341v-2.23l2.74-.18,0.36-4.9h2.48v4.9h4.71v2.41h-4.71v9.72c0,2.16.68,3.38,2.7,3.38a6.36,6.36,0,0,0,2-.47l0.58,2.23a10.79,10.79,0,0,1-3.24.65c-3.74,0-5-2.37-5-5.83v-9.68Z"/><polygon class="cls-1" points="0 40 2 40 2 2 40 2 40 0 0 0 0 40"/><polygon class="cls-1" points="472 0 472 2 510 2 510 40 512 40 512 0 472 0"/><polygon class="cls-1" points="510 510 472 510 472 512 512 512 512 472 510 472 510 510"/><polygon class="cls-1" points="2 472 0 472 0 512 40 512 40 510 2 510 2 472"/></svg>
            }
        </Fragment>
    )
}
