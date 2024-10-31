
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Fragment, useEffect } from '@wordpress/element';
import MonacoEditor from '@monaco-editor/react';
import { PanelBody, PanelRow, TextControl, Button, SelectControl, BaseControl, Spinner } from '@wordpress/components';
import { setAttributes } from '@wordpress/blocks';
import metadata from './block.json';

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

export default function Edit(props) {
    const { attributes, setAttributes, clientId } = props;
    const { persistentID, blockName, otherAttributes, pictureID, pictureURL, pictureExtension, pictureAlt, pictureSizes, pictureSizesAttribute, pictureLoading, manualClasses, mediaQueries = [], renderedMediaQueries, anchor } = attributes;
    const blockProps = useBlockProps();

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

    const onSelectImage = picture => {
        setAttributes( {
            pictureID: picture.id,
            pictureURL: picture.url,
            pictureExtension: picture.subtype,
            pictureAlt: picture.alt,
            pictureSizes: picture.sizes
        })
    }

    const onRemoveImage = () => {
        setAttributes({
            thePicture: null,
            pictureID: null,
            pictureURL: null,
            pictureExtension: null,
            pictureAlt: null,
            pictureSizes: null
        })
    }

    return (
        <Fragment>
            <InspectorControls>
                <PanelBody title={ __( 'Base settings', 'bloclklib' ) }>
                    <BaseControl label={ __( 'Image', 'bloclklib' ) }>
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
                                className="delete"
                            >
                            </Button>
                        }
                    </BaseControl>
                    <SelectControl
                        label={__( 'Loading', 'bloclklib' )}
                        options={ [
                            { label: __( 'Not set', 'bloclklib' ), value: '' },
                            { label: __( 'Lazy', 'bloclklib' ), value: 'lazy' },
                            { label: __( 'Eager', 'bloclklib' ), value: 'eager' },
                            { label: __( 'Auto', 'bloclklib' ), value: 'auto' }
                        ] }
                        value={ pictureLoading }
                        onChange={(newValue) => setAttributes({ pictureLoading: newValue })}
                    />
                    <BaseControl
                        help={ __( '(min-width: 60rem) 80vw, (min-width: 40rem) 90vw, 100vw', 'bloclklib' ) }
                    >
                        <TextControl
                            label={ __( 'Sizes', 'bloclklib' ) }
                            value={ pictureSizesAttribute || '' }
                            onChange={ ( value ) => setAttributes( { pictureSizesAttribute: value } ) }
                            placeholder={ __( 'Add Sizes attribute', 'blocklib' ) }
                        />
                    </BaseControl>
                    <hr/>
                    <TextControl
                        label={ __( 'Classes', 'bloclklib' ) }
                        value={ manualClasses || '' }
                        onChange={ ( value ) => setAttributes( { manualClasses: value } ) }
                        placeholder={ __( 'Add HTML classes if needed', 'blocklib' ) }
                    />
                    <TextControl
                        label={ __( 'Other attributes', 'bloclklib' ) }
                        value={ otherAttributes || '' }
                        onChange={ ( value ) => setAttributes( { otherAttributes: value } ) }
                        placeholder={ __( 'Add HTML attributes if needed', 'blocklib' ) }
                    />
                    <TextControl
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
            { !! pictureID && pictureID &&
                <img {...blockProps}
                    src={ pictureURL }
                    alt={ pictureAlt }
                    data-persistentid={ persistentID }
                    className={[
                        blockName,
                        manualClasses || ''
                    ].filter(Boolean).join(' ')}
                />
            }
            { renderedMediaQueries && <style>{ renderedMediaQueries }</style> }
        </Fragment>
    )
}
