import { useBlockProps, RichText } from '@wordpress/block-editor'
import { Fragment } from '@wordpress/element';

export default function save(props) {
    const { attributes } = props;
    const { tag, uniqueId, blockStyles, blockClasses, blockName, renderedMediaQueries, blockStylesTag, content } = attributes;

    return (
        <Fragment {...useBlockProps.save()}>
            <RichText.Content
                tagName={ tag }
                id={ uniqueId }
                className={blockName + blockClasses}
                value={ content }
            />
            { blockStylesTag && <style id={'blockstyles-' + blockName}>{blockStyles}</style> }
            { renderedMediaQueries && <style>{renderedMediaQueries}</style> }
        </Fragment>
    )
}
