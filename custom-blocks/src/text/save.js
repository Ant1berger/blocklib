import { useBlockProps, RichText } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';

export default function save(props) {
    const { attributes } = props;
    const { tag, persistentID, blockName, selectedColor, selectedFont, manualClasses, content } = attributes;

    return (
        <Fragment {...useBlockProps.save()}>
            <RichText.Content
                tagName={ tag }
                value={ content }
                data-persistentid={ persistentID }
                style={{
                    '--color': selectedColor,
                    '--fontFamily': selectedFont
                }}
                className={[
                    blockName,
                    manualClasses || ''
                ].filter(Boolean).join(' ')}
            />
        </Fragment>
    );
}
