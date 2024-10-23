import { useBlockProps, RichText } from '@wordpress/block-editor'
import { Fragment } from '@wordpress/element';

export default function save(props) {
    const { attributes, clientId } = props;
    const { tag, uniqueId, blockStyles, blockName, selectedColorClass, selectedFontClass, manualClasses, renderedMediaQueries, blockStylesTag, content } = attributes;

    return (
        <Fragment {...useBlockProps.save()}>
            <RichText.Content
                tagName={ tag }
                id={ clientId }
                className={[
                    blockName,
                    selectedColorClass || '',
                    selectedFontClass || '',
                    manualClasses || ''
                ].filter(Boolean).join(' ')}
                value={ content }
            />
            { blockStylesTag && <style id={'blockstyles-' + blockName}>{blockStyles}</style> }
            { renderedMediaQueries && <style>#{clientId + ' {' + renderedMediaQueries + '}'}</style> }
        </Fragment>
    )
}
