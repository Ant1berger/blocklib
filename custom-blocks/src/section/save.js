import { useBlockProps, InnerBlocks } from '@wordpress/block-editor'
import { Fragment } from '@wordpress/element';

export default function save(props) {
    const { attributes } = props;
    const { tag, persistentID, blockStyles, blockName, selectedBGColorClass, manualClasses, renderedMediaQueries, blockStylesTag } = attributes;

    return (
        <Fragment {...useBlockProps.save()}>
            { React.createElement(
                tag,
                {
                    dataPersistentid: persistentID,
                    className: [
                        blockName,
                        selectedBGColorClass || '',
                        manualClasses || ''
                    ].filter(Boolean).join(' ')
                },
                <div className="section-content">
                    <InnerBlocks.Content />
                </div>
            ) }
            { blockStylesTag && <style id={'blockstyles-' + blockName}>{blockStyles}</style> }
            { renderedMediaQueries && <style>{ renderedMediaQueries }</style> }
        </Fragment>
    )
}
