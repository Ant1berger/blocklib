// The file for all shared stuff among blocks.

import MonacoEditor from '@monaco-editor/react';

// Initialize Monaco editor
export const MyMonacoEditor = ({ defaultValue, value, onChange }) => {
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
export const persistentIDs = [];

// Create a unique and persistent ID for useBlockProps.
export const updatePersistentIDs = function(setAttributes, persistentID, blockName, clientId) {
    if ( ( null === persistentID || '' === persistentID ) || persistentIDs.includes( persistentID ) ) {
        const newpersistentID = 'blb-' + blockName + '-' + clientId.substr( 2, 9 ).replace( '-', '' );
        setAttributes( { persistentID: newpersistentID } );
        persistentIDs.push( newpersistentID );
    } else {
        persistentIDs.push( persistentID );
    }
}

// Transform an SVG string into a React element.
export const parseSVG = (svgString) => {
    if (!svgString) return null;
    // Create a temporary element
    const div = document.createElement('div');
    div.innerHTML = svgString.trim();

    // Retrieve the first SVG element.
    const svg = div.firstChild;

    // Extract SVG attributes.
    const attrs = {};
    for (let i = 0; i < svg.attributes.length; i++) {
        const attr = svg.attributes[i];
        attrs[attr.name] = attr.value;
    }

    // Return a React element with the SVG content and attributes.
    return React.createElement(
        'svg',
        { ...attrs, dangerouslySetInnerHTML: { __html: svg.innerHTML } }
    );
};

// Generates the choices for <select>s from the theme options.
export const handleThemeOptionsForSelects = (optionId, emptyOptionText) => {
    let optionsArray = [{ label: emptyOptionText, value: '' }];
    for (const property in optionId) {
        if( optionId[property] ) {
            optionsArray.push({ label: property, value: 'var(--' + property + ')' });
        }
    };
    return optionsArray;
}

// Avoid empty tagName for the rendered component.
export const updateTagName = (setAttributes, setTagName, newTag, defaultTag) => {
    if (newTag.trim() === '') {
        newTag = defaultTag;
    }
    setTagName(newTag);
    setAttributes({ tag: newTag });
};

// Add, remove, update and render the instances CSS, organized by media queries.
export const addMediaQuery = (setAttributes, mediaQueries) => {
    const newQuery = {
        minWidth: '',
        css: '',
    };
    setAttributes({ mediaQueries: [...mediaQueries, newQuery] });
};

export const removeMediaQuery = (setAttributes, index, mediaQueries) => {
    const updatedQueries = mediaQueries.filter((_, i) => i !== index);
    setAttributes({ mediaQueries: updatedQueries });
};

export const updateMediaQuery = (setAttributes, index, field, value, mediaQueries) => {
    const updatedQueries = mediaQueries.map((query, i) =>
        i === index ? { ...query, [field]: value } : query
    );
    setAttributes({ mediaQueries: updatedQueries });
};
