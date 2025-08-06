
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import { InspectorControls, useBlockProps, MediaUpload, MediaUploadCheck, store as blockEditorStore} from '@wordpress/block-editor';
import { Fragment, useEffect } from '@wordpress/element';
import { MyMonacoEditor, updatePersistentIDs, addMediaQuery, removeMediaQuery, updateMediaQuery } from '../blocks';
import { PanelBody, Spinner, Placeholder, PanelRow, TextControl, Button, Modal, BaseControl, __experimentalText as Text, ToggleControl, SelectControl, CheckboxControl, ExternalLink } from '@wordpress/components';
import { setAttributes } from '@wordpress/blocks';
import metadata from './block.json';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';

export default function Edit(props) {
    const { attributes, setAttributes, clientId } = props;
    const { persistentID, blockName, otherAttributes, manualClasses, mediaQueries = [], renderedMediaQueries, anchor, videoID, videoFile, videoMime, videoPreload, videoFetchPriority, videoWidth, videoHeight, videoDuration, autoplay, playsinline, controls, loop, muted, controlslistNoDownload, controlslistNoFullscreen, controlslistNoRemotePlayback } = attributes;
    const blockProps = useBlockProps();
    const { selectBlock } = useDispatch(blockEditorStore);

    const videoData = useSelect(select => {
        return videoID ? select('core').getMedia(videoID) : null;
    }, [videoID]);

    const handleVideoClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        selectBlock(clientId);
    };

    const isLoading = videoID && !videoData?.source_url;

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

    // Add and remove video
    const onSelectVideo = video => {
        setAttributes({
            videoID: video.id,
            videoFile: video.filename, // Only for use in save.js.
            videoMime: video.mime,
            videoWidth: video.width,
            videoHeight: video.height,
            videoDuration: video.fileLengthHumanReadable
        })
    }

    const onRemoveVideo = () => {
        setAttributes({
            videoID: null,
            videoFile: null,
            videoMime: null,
            videoWidth: null,
            videoHeight: null,
            videoDuration: null,
            autoplay: null,
            playsinline: null,
            controls: null,
            loop: null,
            muted: null,
            videoPreload: null,
            controlslistNoDownload: null,
            controlslistNoFullscreen: null,
            controlslistNoRemotePlayback: null
        })
    }

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
                url: db_data.siteUrl+videoData?.source_url,
                as: videoMime?.split('/')[0] || 'video',
                mime: videoMime
            }
        };
        setMeta(newMeta);
    };

    const disableLCP = () => {
        const newMeta = {
            ...meta,
            lcp_preload: {
                url: '',
                as: '',
                mime: ''
            }
        };
        setMeta(newMeta);
    };

    const lcpData = meta?.lcp_preload || {};
    const hasLCP = !!lcpData.url;
    const isThisVideoLCP = hasLCP && lcpData.url === db_data.siteUrl+videoData?.source_url;

    useEffect(() => {
        if (isThisVideoLCP) {
            setAttributes({videoPreload: 'auto', videoFetchPriority: 'high'});
        }
    }, [isThisVideoLCP]);

    const posterPopin = () => {
        const [ isOpen, setOpen ] = useState( false );
        const openModal = () => setOpen( true );
        const closeModal = () => setOpen( false );

        return (
            <>
            <Button variant="secondary" onClick={ openModal }>
                { __( 'Poster instructions', 'bloclklib' ) }
            </Button>
            { isOpen && (
                <Modal className='blocklib-popin' title={ __( 'Poster instructions:', 'bloclklib' ) } onRequestClose={ closeModal }>
                    <p>{__( 'To add a poster for this video, don\'t use the poster="..." attribute: it\'s not responsive and it can\'t be lazy loaded. Instead, with a bit of CSS, position an Image and a Knob blocks above the video following this structure:', 'bloclklib' )}</p>
                    <code>{__( 'An encompassing Group with the class "video-with-poster".', 'bloclklib' )}</code>
                    <code>{__( '|' )}</code>
                    <code>{__( '|——> The Video.', 'bloclklib' )}</code>
                    <code>{__( '|——> An Image (the poster, keep it the same ratio as the video).', 'bloclklib' )}</code>
                    <code>{__( '|——> A Knob (the "play" button).', 'bloclklib' )}</code>
                    <p>{__( 'A script will trigger automatically when reading the class "video-with-poster", having the following effects: on click on the button, the image and the button will disappear and the video will start playing.' )}</p>
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
                    <BaseControl
                        __nextHasNoMarginBottom
                        label={ __( 'Video', 'bloclklib' ) }
                    >
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={ onSelectVideo }
                                allowedTypes={ [ 'video' ] }
                                value={ videoID }
                                render={ ( { open } ) => (
                                    <div>
                                        { ! videoID &&
                                            <Button variant="primary" onClick={ open } className="add-media">
                                                {__( 'Select a video', 'bloclklib' )}
                                            </Button>
                                        }
                                        {videoID && !videoData && (
                                            <div className="components-placeholder">
                                                <Spinner />
                                                <p>{__('Loading video...', 'blocklib')}</p>
                                            </div>
                                        )}
                                        { !! videoData?.source_url &&
                                            <Button variant="link" onClick={ open }>
                                                <video src={ db_data.siteUrl + videoData.source_url } />
                                            </Button>
                                        }
                                        { !! videoID && <p>{__( 'Duration:', 'bloclklib' )} { videoDuration }</p> }
                                    </div>
                                ) }
                            />
                        </MediaUploadCheck>
                        { !! videoID &&
                            <Button
                                onClick={ onRemoveVideo }
                                isDestructive
                                variant="secondary"
                                size="small"
                                icon="trash"
                                className="delete-video"
                            >
                            </Button>
                        }
                    </BaseControl>
                    <BaseControl
                        __nextHasNoMarginBottom
                        label={ __( 'Need a poster?', 'bloclklib' ) }
                    >
                        {posterPopin()}
                    </BaseControl>
                    <ToggleControl
                        label={__('Autoplay', 'custom-blocks')}
                        checked={autoplay}
                        onChange={(val) => setAttributes({ autoplay: val })}
                        help={__('Warning: Autoplay may be blocked by browsers.', 'custom-blocks')}
                    />
                    <ToggleControl
                        label={__('Playsinline', 'custom-blocks')}
                        checked={playsinline}
                        onChange={(val) => setAttributes({ playsinline: val })}
                        help={__('Autoplay requires playsinline on iOS.', 'custom-blocks')}
                    />
                    <ToggleControl
                        label={__('Loop', 'custom-blocks')}
                        checked={loop}
                        onChange={(val) => setAttributes({ loop: val })}
                    />
                    <ToggleControl
                        label={__('Muted', 'custom-blocks')}
                        checked={muted}
                        onChange={(val) => setAttributes({ muted: val })}
                        help={__('Autoplay often requires the video to be muted.', 'custom-blocks')}
                    />
                    <ToggleControl
                        label={__('Show Controls', 'custom-blocks')}
                        checked={controls}
                        onChange={(val) => setAttributes({ controls: val })}
                    />
                    <p><strong>{__('Controls list', 'custom-blocks')}</strong></p>
                    <CheckboxControl
                        label={__('Hide Download Button', 'custom-blocks')}
                        checked={controlslistNoDownload}
                        onChange={(val) => setAttributes({ controlslistNoDownload: val })}
                    />
                    <CheckboxControl
                        label={__('Hide fullscreen button', 'custom-blocks')}
                        checked={controlslistNoFullscreen}
                        onChange={(val) => setAttributes({ controlslistNoFullscreen: val })}
                    />
                    <CheckboxControl
                        label={__('Hide Remote Playback Button', 'custom-blocks')}
                        checked={controlslistNoRemotePlayback}
                        onChange={(val) => setAttributes({ controlslistNoRemotePlayback: val })}
                    />
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
                <PanelBody title={ __( 'Video performance settings', 'bloclklib' ) } initialOpen={true}>
                    <Text>
                    {
                        hasLCP && !isThisVideoLCP
                            ? __('Warning: Another media is currently set as LCP. Clicking those buttons will override the previous setting.', 'blocklib')
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
                                variant={isThisVideoLCP ? "secondary" : "primary"}
                                onClick={setAsLCP}
                                disabled={!videoID}
                                className="set-lcp-button"
                            >
                                {isThisVideoLCP
                                    ? __('This video is the current LCP', 'blocklib')
                                    : __('Set this video as LCP', 'blocklib')
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
                            help={__( '"Metadata" setting suits most of the cases. If LCP, "auto" will be automatically set. Use "none" only if you care a lot about bandwidth.', 'bloclklib' )}
                            label={__('Preload', 'bloclklib')}
                            value={videoPreload}
                            options={[
                                { label: __('Metadata', 'bloclklib'), value: 'metadata' },
                                { label: __('Auto', 'bloclklib'), value: 'auto' },
                                { label: __('None', 'bloclklib'), value: 'none' },
                            ]}
                            onChange={(val) => setAttributes({ videoPreload: val })}
                            disabled={isThisVideoLCP}
                        />
                    </BaseControl>
                    <BaseControl
                        __nextHasNoMarginBottom
                        help={__( 'Don\'t overuse fetch priority, but use it when one element has to be loaded first among others, even below the fold.', 'bloclklib' )}
                    >
                        <SelectControl
                            __nextHasNoMarginBottom
                            label={__( 'Fetch priority', 'bloclklib' )}
                            options={ [
                                { label: __( 'Not set', 'bloclklib' ), value: '' },
                                { label: __( 'High', 'bloclklib' ), value: 'high' },
                                { label: __( 'Low', 'bloclklib' ), value: 'low' }
                            ] }
                            value={ videoFetchPriority }
                            onChange={(newValue) => setAttributes({ videoFetchPriority: newValue })}
                            disabled={isThisVideoLCP}
                        />
                    </BaseControl>
                </PanelBody>
            </InspectorControls>
            { renderedMediaQueries && <style>{ renderedMediaQueries }</style> }
                { isLoading && (
                    <Placeholder
                        icon="format-image"
                        label={__('Loading video...', 'blocklib')}
                        className="wp-block-image"
                    >
                        <Spinner />
                    </Placeholder>
                )}
                { !videoID && (
                    <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1484_31)">
<path d="M95.3145 174.691H96.75L96.8965 176.168H96.9609C97.9336 175.195 98.9883 174.41 100.4 174.41C102.551 174.41 103.523 175.805 103.523 178.418V184.916H101.766V178.676C101.766 176.754 101.18 175.934 99.8262 175.934C98.7715 175.934 98.0684 176.484 97.0195 177.516V184.939H95.2617V174.691H95.3145Z" fill="black"/>
<path d="M110.842 174.439C113.35 174.439 115.588 176.402 115.588 179.836C115.588 183.27 113.35 185.191 110.842 185.191C108.334 185.191 106.096 183.229 106.096 179.836C106.096 176.443 108.328 174.439 110.842 174.439ZM110.842 183.762C112.6 183.762 113.771 182.18 113.771 179.836C113.771 177.492 112.6 175.869 110.842 175.869C109.084 175.869 107.912 177.475 107.912 179.836C107.912 182.197 109.09 183.762 110.842 183.762Z" fill="black"/>
<path d="M181.166 187.916C182.338 187.916 183.064 186.99 183.51 185.725L183.744 184.963L179.643 174.691H181.436L183.521 180.363C183.838 181.248 184.195 182.303 184.512 183.252H184.57C184.863 182.326 185.156 181.271 185.438 180.363L187.271 174.691H188.959L185.098 185.783C184.383 187.811 183.34 189.346 181.26 189.346C180.85 189.348 180.443 189.277 180.059 189.135L180.398 187.764C180.647 187.848 180.905 187.899 181.166 187.916Z" fill="black"/>
<path d="M194.684 174.439C197.297 174.439 198.785 176.314 198.785 179.25C198.788 179.568 198.767 179.885 198.721 180.199H191.795C191.924 182.414 193.248 183.809 195.211 183.809C196.123 183.799 197.012 183.519 197.766 183.006L198.352 184.143C197.355 184.82 196.181 185.187 194.977 185.197C192.234 185.197 190.061 183.193 190.061 179.842C190.061 176.49 192.346 174.439 194.684 174.439ZM197.256 179.057C197.256 176.971 196.33 175.811 194.725 175.811C193.289 175.811 191.982 176.982 191.795 179.057H197.279H197.256Z" fill="black"/>
<path d="M201.311 176.104H199.805V174.797L201.41 174.691L201.621 171.82H203.074V174.691H205.834V176.104H203.074V181.799C203.074 183.064 203.473 183.779 204.656 183.779C205.059 183.752 205.455 183.659 205.828 183.504L206.168 184.811C205.558 185.034 204.918 185.163 204.27 185.191C202.078 185.191 201.34 183.803 201.34 181.775V176.104H201.311Z" fill="black"/>
<path d="M0 23.4375H1.17188V1.17188H23.4375V0H0V23.4375Z" fill="black"/>
<path d="M276.562 0V1.17188H298.828V23.4375H300V0H276.562Z" fill="black"/>
<path d="M298.828 298.828H276.562V300H300V276.562H298.828V298.828Z" fill="black"/>
<path d="M1.17188 276.562H0V300H23.4375V298.828H1.17188V276.562Z" fill="black"/>
<path d="M133.225 174.598L129.377 185.005H127.75L123.902 174.598H125.636L128.509 182.891H128.618L131.49 174.598H133.225Z" fill="black"/>
<path d="M135.336 185.005V174.598H136.935V185.005H135.336ZM136.149 172.863C135.837 172.863 135.568 172.757 135.342 172.545C135.121 172.332 135.01 172.077 135.01 171.779C135.01 171.481 135.121 171.226 135.342 171.013C135.568 170.801 135.837 170.695 136.149 170.695C136.46 170.695 136.727 170.801 136.948 171.013C137.174 171.226 137.287 171.481 137.287 171.779C137.287 172.077 137.174 172.332 136.948 172.545C136.727 172.757 136.46 172.863 136.149 172.863Z" fill="black"/>
<path d="M143.793 185.222C142.926 185.222 142.16 185.003 141.496 184.564C140.832 184.122 140.313 183.498 139.938 182.694C139.563 181.886 139.376 180.93 139.376 179.828C139.376 178.735 139.563 177.787 139.938 176.983C140.313 176.179 140.835 175.557 141.503 175.119C142.172 174.681 142.944 174.462 143.82 174.462C144.498 174.462 145.033 174.575 145.426 174.801C145.824 175.022 146.126 175.275 146.334 175.56C146.546 175.84 146.711 176.07 146.829 176.251H146.964V171.128H148.563V185.005H147.018V183.406H146.829C146.711 183.595 146.544 183.835 146.327 184.124C146.11 184.409 145.801 184.664 145.399 184.89C144.997 185.111 144.462 185.222 143.793 185.222ZM144.01 183.785C144.651 183.785 145.193 183.618 145.636 183.284C146.079 182.945 146.415 182.478 146.646 181.881C146.876 181.281 146.991 180.587 146.991 179.801C146.991 179.024 146.878 178.344 146.652 177.762C146.427 177.175 146.092 176.718 145.65 176.393C145.207 176.063 144.66 175.898 144.01 175.898C143.332 175.898 142.768 176.072 142.316 176.42C141.869 176.763 141.532 177.231 141.307 177.823C141.085 178.41 140.975 179.069 140.975 179.801C140.975 180.542 141.087 181.215 141.313 181.82C141.544 182.421 141.882 182.9 142.33 183.257C142.781 183.609 143.341 183.785 144.01 183.785Z" fill="black"/>
<path d="M156.077 185.222C155.074 185.222 154.209 185 153.482 184.558C152.76 184.11 152.202 183.487 151.809 182.688C151.42 181.884 151.226 180.949 151.226 179.882C151.226 178.816 151.42 177.877 151.809 177.064C152.202 176.246 152.748 175.609 153.448 175.153C154.153 174.692 154.975 174.462 155.915 174.462C156.457 174.462 156.992 174.552 157.52 174.733C158.049 174.914 158.53 175.207 158.964 175.614C159.397 176.016 159.743 176.549 160 177.213C160.258 177.877 160.387 178.694 160.387 179.666V180.343H152.364V178.961H158.76C158.76 178.374 158.643 177.85 158.408 177.389C158.178 176.928 157.848 176.565 157.419 176.298C156.994 176.032 156.493 175.898 155.915 175.898C155.278 175.898 154.727 176.057 154.261 176.373C153.801 176.684 153.446 177.091 153.198 177.592C152.949 178.094 152.825 178.631 152.825 179.205V180.126C152.825 180.912 152.961 181.579 153.232 182.125C153.507 182.667 153.889 183.081 154.377 183.365C154.864 183.645 155.431 183.785 156.077 183.785C156.497 183.785 156.877 183.726 157.216 183.609C157.559 183.487 157.855 183.306 158.103 183.067C158.352 182.823 158.544 182.52 158.679 182.159L160.224 182.593C160.061 183.117 159.788 183.577 159.404 183.975C159.02 184.368 158.546 184.675 157.981 184.896C157.417 185.113 156.782 185.222 156.077 185.222Z" fill="black"/>
<path d="M167.047 185.222C166.107 185.222 165.283 184.998 164.574 184.551C163.869 184.104 163.318 183.478 162.921 182.674C162.528 181.87 162.331 180.93 162.331 179.855C162.331 178.771 162.528 177.825 162.921 177.016C163.318 176.208 163.869 175.58 164.574 175.133C165.283 174.686 166.107 174.462 167.047 174.462C167.986 174.462 168.809 174.686 169.513 175.133C170.222 175.58 170.773 176.208 171.166 177.016C171.564 177.825 171.763 178.771 171.763 179.855C171.763 180.93 171.564 181.87 171.166 182.674C170.773 183.478 170.222 184.104 169.513 184.551C168.809 184.998 167.986 185.222 167.047 185.222ZM167.047 183.785C167.761 183.785 168.348 183.602 168.809 183.236C169.269 182.871 169.61 182.389 169.832 181.793C170.053 181.197 170.164 180.551 170.164 179.855C170.164 179.16 170.053 178.512 169.832 177.911C169.61 177.31 169.269 176.824 168.809 176.454C168.348 176.084 167.761 175.898 167.047 175.898C166.333 175.898 165.746 176.084 165.285 176.454C164.825 176.824 164.483 177.31 164.262 177.911C164.041 178.512 163.93 179.16 163.93 179.855C163.93 180.551 164.041 181.197 164.262 181.793C164.483 182.389 164.825 182.871 165.285 183.236C165.746 183.602 166.333 183.785 167.047 183.785Z" fill="black"/>
<path d="M168.884 122.663L160.971 127.721C160.839 124.688 158.402 122.267 155.395 122.267H134.506C131.413 122.267 128.906 124.819 128.906 127.963V133.351V135.88V142.191C128.906 145.336 131.413 147.887 134.506 147.887H155.395C158.405 147.887 160.84 145.464 160.971 142.433L168.884 147.492C170.177 148.359 171.23 147.721 171.23 146.068V124.09C171.246 122.434 170.183 121.793 168.884 122.663ZM154.767 127.091C155.689 127.091 156.438 127.843 156.438 128.762C156.438 129.685 155.689 130.433 154.767 130.433C153.843 130.433 153.096 129.685 153.096 128.762C153.096 127.843 153.84 127.091 154.767 127.091Z" fill="#1D1D1B"/>
</g>
<defs>
<clipPath id="clip0_1484_31">
<rect width="300" height="300" fill="white"/>
</clipPath>
</defs>
</svg>

                )}
                { !! videoID && videoData?.source_url ? (
                    <video
                        {...blockProps}
                        onClick={handleVideoClick}
                        src={ db_data.siteUrl + videoData.source_url }
                        width={ videoWidth }
                        height={ videoHeight }
                        data-persistentid={ persistentID }
                        className={[
                            blockName,
                            manualClasses || ''
                        ].filter(Boolean).join(' ')}
                    ></video>
                ) : null}
        </Fragment>
    )
}
