// This file is mainly here to allow Gutenberg to record the HTML in the database,
// in order to allow tools like Yoast SEO to crawl the content.

export default function save(props) {
    const { attributes } = props;
    const { videoURL, persistentID } = attributes;

    return (
        <video src={ videoURL } data-persistentid={ persistentID }></video>
    );
}
