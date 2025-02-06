/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';
import './index.css';
import metadata from './block.json';

const blockIcon = (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M4 6C4 4.34315 5.34315 3 7 3H41C42.6569 3 44 4.34315 44 6V42C44 43.6569 42.6569 45 41 45H7C5.34315 45 4 43.6569 4 42V6ZM7 6V42H41V6H7Z" fill="black"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M10 16C10 17.1046 10.8954 18 12 18H36C37.1046 18 38 17.1046 38 16V13C38 11.8954 37.1046 11 36 11H12C10.8954 11 10 11.8954 10 13V16ZM12 16V13H36V16H12Z" fill="black"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M10 27C10 28.1046 10.8954 29 12 29H36C37.1046 29 38 28.1046 38 27V24C38 22.8954 37.1046 22 36 22H12C10.8954 22 10 22.8954 10 24V27ZM12 27V24H36V27H12Z" fill="black"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M18 36C18 36.5523 18.4477 37 19 37H29C29.5523 37 30 36.5523 30 36V34C30 33.4477 29.5523 33 29 33H19C18.4477 33 18 33.4477 18 34V36Z" fill="black"/>
</svg>

);

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType( metadata.name, {
    icon: blockIcon,
	/**
	 * @see ./edit.js
	 */
	edit: Edit,
    /**
     * @see ./save.js
     */
    save
} );
