// This file is mainly here to allow Gutenberg to record the HTML in the database,
// in order to allow tools like Yoast SEO to crawl the content.

import { RichText } from '@wordpress/block-editor';

export default function save(props) {
    const { attributes } = props;
    const { tag, url, content } = attributes;

    return (
        <RichText.Content
            tagName={ tag }
            href={ url }
            value={ content }
        />
    );
}
