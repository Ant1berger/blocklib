// This file is mainly here to allow Gutenberg to record the HTML in the database,
// in order to allow tools like Yoast SEO to crawl the content.

export default function save(props) {
    const { attributes } = props;
    const { videoFile, persistentID } = attributes;

    const siteUrl = (typeof db_data !== 'undefined' && db_data.siteUrl)
        ? db_data.siteUrl
        : window.location.origin;

    return (
        <video src={`${siteUrl}/wp-content/uploads/${videoFile}`} data-persistentid={ persistentID }></video>
    );
}
