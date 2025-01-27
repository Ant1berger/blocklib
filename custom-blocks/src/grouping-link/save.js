// This file is mainly here to allow Gutenberg to record the HTML in the database,
// in order to allow tools like Yoast SEO to crawl the content.

// Blocks that use InnerBlocks render with do_blocks( $content ) in render.php, and this takes the whole returned material of save(),
// unlike with RichText that renders only its value attribute.
// So in this case, save() has to handle the HTML and HTML attributes of the block instead of render.php.

import { InnerBlocks } from '@wordpress/block-editor';

export default function save(props) {
    const { attributes } = props;
    const { tag, url, persistentID, blockName, anchor, manualClasses, otherAttributes } = attributes;

    const extraAttributes = {};
    if (tag === 'a' && url) {
        extraAttributes.href = url;
    }
    if (anchor) {
        extraAttributes.id = anchor;
    }
    if (otherAttributes) {
        try {
            const div = document.createElement('div');
            div.innerHTML = `<div ${otherAttributes}></div>`;
            const attributes = div.firstChild.attributes;
            const parsedAttributes = {};
            for (let attr of attributes) {
                parsedAttributes[attr.name] = attr.value;
            }
            Object.assign(extraAttributes, parsedAttributes);
        } catch (error) {
            console.warn('Invalid attribute string in otherAttributes:', otherAttributes);
        }
    }

    return React.createElement(
        tag,
        {
            'data-persistentid': persistentID,
            className: [
                blockName,
                manualClasses || ''
            ].filter(Boolean).join(' '),
            ...extraAttributes
        },
        <InnerBlocks.Content />
    )
}
