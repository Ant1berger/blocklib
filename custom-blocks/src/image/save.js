// This file is mainly here to allow Gutenberg to record the HTML in the database,
// in order to allow tools like Yoast SEO to crawl the content.

export default function save(props) {
    const { attributes } = props;
    const { pictureURL, pictureAlt, persistentID } = attributes;

    return (
        <img src={ pictureURL } alt={ pictureAlt } data-persistentid={ persistentID } />
    );
}
