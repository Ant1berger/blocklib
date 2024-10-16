import { useBlockProps, InnerBlocks } from '@wordpress/block-editor'
import { Fragment } from '@wordpress/element';

export default function save(props) {
    const { attributes } = props;
    const { tag, uniqueId, blockStyles, blockClasses, blockName, renderedMediaQueries, blockStylesTag } = attributes;

    return (
        <Fragment {...useBlockProps.save()}>
            { React.createElement(
                tag,
                {
                    id: uniqueId,
                    className: blockName + blockClasses,
                },
                <div className="section-content">
                    <InnerBlocks.Content />
                </div>
            ) }
            { blockStylesTag && <style id={'blockstyles-' + blockName}>{blockStyles}</style> }
            { renderedMediaQueries && <style>{renderedMediaQueries}</style> }
        </Fragment>
    )
}
