/**
 * Scrape API - Get HTML Operation
 *
 * Retrieves the rendered HTML of a web page after JavaScript execution.
 */

import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import { ujeebuApiGet, UJEEBU_ENDPOINTS } from '../../transport';
import { commonScrapeOptions, scrollOptions, proxyOptions } from './common';
import type { ScrapeParams, ScrapeHtmlResponse } from '../../types';

/**
 * Get HTML operation properties
 */
export const scrapeHtmlProperties: INodeProperties[] = [
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://example.com',
		description: 'URL to scrape',
		displayOptions: {
			show: {
				resource: ['scrape'],
				operation: ['getHtml'],
			},
		},
	},
	{
		displayName: 'Strip Tags',
		name: 'stripTags',
		type: 'string',
		default: '',
		placeholder: 'script,style,noscript',
		description: 'Comma-separated list of tags/selectors to remove after rendering',
		displayOptions: {
			show: {
				resource: ['scrape'],
				operation: ['getHtml'],
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
				resource: ['scrape'],
				operation: ['getHtml'],
			},
		},
		options: [
			...commonScrapeOptions,
			...scrollOptions,
			...proxyOptions,
		],
	},
];

/**
 * Execute get HTML operation
 */
export async function executeScrapeHtml(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const url = this.getNodeParameter('url', index) as string;
	const stripTags = this.getNodeParameter('stripTags', index, '') as string;
	const options = this.getNodeParameter('options', index, {}) as Partial<ScrapeParams>;

	// Build request parameters
	const params: Partial<ScrapeParams> = {
		url,
		response_type: 'html',
		json: true,
		...options,
	};

	if (stripTags) {
		params.strip_tags = stripTags;
	}

	// Remove empty values
	const cleanParams = Object.fromEntries(
		Object.entries(params).filter(([, v]) => v !== undefined && v !== ''),
	);

	const response = await ujeebuApiGet(
		this,
		UJEEBU_ENDPOINTS.SCRAPE,
		cleanParams,
	) as ScrapeHtmlResponse;

	return [
		{
			json: {
				html: response.html || response.html_source,
				url,
			},
		},
	];
}

