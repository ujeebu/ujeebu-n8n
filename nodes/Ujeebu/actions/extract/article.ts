/**
 * Extract API - Article Extraction Action
 *
 * Extracts article content from news and blog URLs, returning structured
 * JSON data including title, text, author, publish date, images, and more.
 */

import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	IDataObject,
} from 'n8n-workflow';
import { ujeebuApiPost, UJEEBU_ENDPOINTS } from '../../transport';
import type { ExtractResponse, ExtractParams } from '../../types';

/**
 * Extract article operation properties
 */
export const extractArticleProperties: INodeProperties[] = [
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://example.com/article',
		description: 'URL of the article to extract',
		displayOptions: {
			show: {
				resource: ['extract'],
				operation: ['article'],
			},
		},
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['extract'],
				operation: ['article'],
			},
		},
		options: [
			{
				displayName: 'Enable JavaScript',
				name: 'js',
				type: 'options',
				options: [
					{ name: 'No', value: false },
					{ name: 'Yes', value: true },
					{ name: 'Auto', value: 'auto' },
				],
				default: false,
				description: 'Whether to execute JavaScript. Set to "Auto" to let the extractor decide.',
			},
			{
				displayName: 'Extract Author',
				name: 'author',
				type: 'boolean',
				default: true,
				description: 'Whether to extract the article author',
			},
			{
				displayName: 'Extract Feeds',
				name: 'feeds',
				type: 'boolean',
				default: false,
				description: 'Whether to extract RSS feeds',
			},
			{
				displayName: 'Extract HTML',
				name: 'html',
				type: 'boolean',
				default: true,
				description: 'Whether to extract the article HTML',
			},
			{
				displayName: 'Extract Images',
				name: 'images',
				type: 'boolean',
				default: true,
				description: 'Whether to extract images from the article',
			},
			{
				displayName: 'Extract Media',
				name: 'media',
				type: 'boolean',
				default: false,
				description: 'Whether to extract embedded media (videos, audio)',
			},
			{
				displayName: 'Extract Publish Date',
				name: 'pub_date',
				type: 'boolean',
				default: true,
				description: 'Whether to extract the publish date',
			},
			{
				displayName: 'Extract Text',
				name: 'text',
				type: 'boolean',
				default: true,
				description: 'Whether to extract the article text',
			},
			{
				displayName: 'Image Analysis',
				name: 'image_analysis',
				type: 'boolean',
				default: true,
				description: 'Whether to analyze images for minimum dimensions',
			},
			{
				displayName: 'Is Article Detection',
				name: 'is_article',
				type: 'boolean',
				default: true,
				description: 'Whether to return the probability of the URL being an article (0-1)',
			},
			{
				displayName: 'JS Timeout',
				name: 'js_timeout',
				type: 'number',
				default: 30,
				description: 'Seconds to wait for JavaScript to render (when JS is enabled)',
			},
			{
				displayName: 'Min Image Height',
				name: 'min_image_height',
				type: 'number',
				default: 100,
				description: 'Minimum height of images to keep in the HTML',
			},
			{
				displayName: 'Min Image Width',
				name: 'min_image_width',
				type: 'number',
				default: 200,
				description: 'Minimum width of images to keep in the HTML',
			},
			{
				displayName: 'Proxy Country',
				name: 'proxy_country',
				type: 'string',
				default: 'US',
				placeholder: 'US, UK, DE',
				description: 'Country ISO code for the proxy (valid when using premium proxy)',
			},
			{
				displayName: 'Proxy Type',
				name: 'proxy_type',
				type: 'options',
				options: [
					{ name: 'Rotating', value: 'rotating' },
					{ name: 'Advanced', value: 'advanced' },
					{ name: 'Premium', value: 'premium' },
					{ name: 'Residential', value: 'residential' }
				],
				default: 'rotating',
				description: 'Type of proxy to use for the request',
			},
			{
				displayName: 'Quick Mode',
				name: 'quick_mode',
				type: 'boolean',
				default: false,
				description: 'Whether to enable quick analysis mode (30-60% faster but less detailed)',
			},
			{
				displayName: 'Scroll Down',
				name: 'scroll_down',
				type: 'boolean',
				default: false,
				description: 'Whether to scroll down the page (applies when JS is enabled)',
			},
			{
				displayName: 'Scroll Wait',
				name: 'scroll_wait',
				type: 'number',
				default: 100,
				description: 'Wait time in milliseconds between scroll actions',
			},
			{
				displayName: 'Strip Tags',
				name: 'strip_tags',
				type: 'string',
				default: 'form',
				placeholder: 'form,script,style',
				description: 'Comma-separated list of tags/CSS selectors to strip from the extracted HTML',
			},
			{
				displayName: 'Timeout',
				name: 'timeout',
				type: 'number',
				default: 60,
				description: 'Maximum number of seconds before request timeout',
			},
			{
				displayName: 'Wait Until',
				name: 'wait_until',
				type: 'options',
				options: [
					{ name: 'Load', value: 'load' },
					{ name: 'DOM Content Loaded', value: 'domcontentloaded' },
					{ name: 'Network Idle', value: 'networkidle' },
					{ name: 'Commit', value: 'commit' },
				],
				default: 'load',
				description: 'When to consider page load complete',
			},
		],
	},
];

/**
 * Execute article extraction
 */
export async function executeExtractArticle(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const url = this.getNodeParameter('url', index) as string;
	const options = this.getNodeParameter('options', index, {}) as Partial<ExtractParams>;

	// Build request parameters
	const params: ExtractParams = {
		url,
		...options,
	};

	// Remove undefined values
	const cleanParams = Object.fromEntries(
		Object.entries(params).filter(([, v]) => v !== undefined && v !== ''),
	);

	const response = await ujeebuApiPost(
		this,
		UJEEBU_ENDPOINTS.EXTRACT,
		cleanParams,
	) as ExtractResponse;


    return [
		{
			json: response as unknown as IDataObject,
		},
	];
}

