// This file is mainly here to allow Gutenberg to record the HTML in the database,
// in order to allow tools like Yoast SEO to crawl the content.

export default function save(props) {
    const { attributes } = props;
    const { url, persistentID } = attributes;

    return (
        <iframe src={ url } data-persistentid={ persistentID }></iframe>
    );
}
