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
    <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#000000"><path d="M307-80 161-226l146-145 42 42-74 73h410l-72-73 42-42 145 145L654-80l-42-42 74-74H276l72 74-41 42ZM200-480v-400h60v400h-60Zm250 0v-400h60v400h-60Zm250 0v-400h60v400h-60Z"/></svg>
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
