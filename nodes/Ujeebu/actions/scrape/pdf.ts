/**
 * Scrape API - PDF Generation Operation
 *
 * Converts web pages to high-quality PDF documents.
 */

import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import { ujeebuApiGet, UJEEBU_ENDPOINTS } from '../../transport';
import { commonScrapeOptions, scrollOptions, proxyOptions } from './common';
import type { ScrapeParams, ScrapePdfResponse } from '../../types';

/**
 * PDF generation operation properties
 */
export const scrapePdfProperties: INodeProperties[] = [
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://example.com',
		description: 'URL to convert to PDF',
		displayOptions: {
			show: {
				resource: ['scrape'],
				operation: ['pdf'],
			},
		},
	},
	{
		displayName: 'Output Binary',
		name: 'outputBinary',
		type: 'boolean',
		default: true,
		description: 'Whether to output the PDF as binary data for download',
		displayOptions: {
			show: {
				resource: ['scrape'],
				operation: ['pdf'],
			},
		},
	},
	{
		displayName: 'Binary Property Name',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'pdf',
		description: 'Name of the binary property to store the PDF',
		displayOptions: {
			show: {
				resource: ['scrape'],
				operation: ['pdf'],
				outputBinary: [true],
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
				operation: ['pdf'],
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
 * Execute PDF generation operation
 */
export async function executeScrapePdf(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const url = this.getNodeParameter('url', index) as string;
	const outputBinary = this.getNodeParameter('outputBinary', index, true) as boolean;
	const options = this.getNodeParameter('options', index, {}) as Partial<ScrapeParams>;

	// Build request parameters
	const params: Partial<ScrapeParams> = {
		url,
		response_type: 'pdf',
		json: true,
		...options,
	};

	// Remove empty values
	const cleanParams = Object.fromEntries(
		Object.entries(params).filter(([, v]) => v !== undefined && v !== ''),
	);

	const response = await ujeebuApiGet(
		this,
		UJEEBU_ENDPOINTS.SCRAPE,
		cleanParams,
	) as ScrapePdfResponse;

	const result: INodeExecutionData = {
		json: {
			url,
		},
	};

	if (outputBinary && response.pdf) {
		const binaryPropertyName = this.getNodeParameter('binaryPropertyName', index, 'pdf') as string;
		const buffer = Buffer.from(response.pdf, 'base64');

		result.binary = {
			[binaryPropertyName]: await this.helpers.prepareBinaryData(
				buffer,
				'document.pdf',
				'application/pdf',
			),
		};
	} else {
		result.json.pdf = response.pdf;
	}

	return [result];
}

