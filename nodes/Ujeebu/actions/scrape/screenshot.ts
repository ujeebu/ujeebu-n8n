/**
 * Scrape API - Screenshot Operation
 *
 * Captures screenshots of web pages with support for full-page,
 * viewport, and element-specific captures.
 */

import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import { ujeebuApiGet, UJEEBU_ENDPOINTS } from '../../transport';
import { commonScrapeOptions, scrollOptions, proxyOptions } from './common';
import type { ScrapeParams, ScrapeScreenshotResponse } from '../../types';

/**
 * Screenshot operation properties
 */
export const scrapeScreenshotProperties: INodeProperties[] = [
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://example.com',
		description: 'URL to capture screenshot of',
		displayOptions: {
			show: {
				resource: ['scrape'],
				operation: ['screenshot'],
			},
		},
	},
	{
		displayName: 'Full Page',
		name: 'fullPage',
		type: 'boolean',
		default: false,
		description: 'Whether to capture the full scrollable page instead of just the viewport',
		displayOptions: {
			show: {
				resource: ['scrape'],
				operation: ['screenshot'],
			},
		},
	},
	{
		displayName: 'Partial Screenshot',
		name: 'screenshotType',
		type: 'options',
		options: [
			{ name: 'Full Page or Viewport', value: 'none' },
			{ name: 'CSS Selector', value: 'selector' },
			{ name: 'Coordinates', value: 'coordinates' },
		],
		default: 'none',
		description: 'Capture a specific element or region',
		displayOptions: {
			show: {
				resource: ['scrape'],
				operation: ['screenshot'],
			},
		},
	},
	{
		displayName: 'Element Selector',
		name: 'elementSelector',
		type: 'string',
		default: '',
		placeholder: '#main-content',
		description: 'CSS selector of the element to screenshot',
		displayOptions: {
			show: {
				resource: ['scrape'],
				operation: ['screenshot'],
				screenshotType: ['selector'],
			},
		},
	},
	{
		displayName: 'X Coordinate',
		name: 'coordX',
		type: 'number',
		default: 0,
		description: 'X coordinate of the region',
		displayOptions: {
			show: {
				resource: ['scrape'],
				operation: ['screenshot'],
				screenshotType: ['coordinates'],
			},
		},
	},
	{
		displayName: 'Y Coordinate',
		name: 'coordY',
		type: 'number',
		default: 0,
		description: 'Y coordinate of the region',
		displayOptions: {
			show: {
				resource: ['scrape'],
				operation: ['screenshot'],
				screenshotType: ['coordinates'],
			},
		},
	},
	{
		displayName: 'Width',
		name: 'coordWidth',
		type: 'number',
		default: 800,
		description: 'Width of the region in pixels',
		displayOptions: {
			show: {
				resource: ['scrape'],
				operation: ['screenshot'],
				screenshotType: ['coordinates'],
			},
		},
	},
	{
		displayName: 'Height',
		name: 'coordHeight',
		type: 'number',
		default: 600,
		description: 'Height of the region in pixels',
		displayOptions: {
			show: {
				resource: ['scrape'],
				operation: ['screenshot'],
				screenshotType: ['coordinates'],
			},
		},
	},
	{
		displayName: 'Output Binary',
		name: 'outputBinary',
		type: 'boolean',
		default: true,
		description: 'Whether to output the screenshot as binary data for download',
		displayOptions: {
			show: {
				resource: ['scrape'],
				operation: ['screenshot'],
			},
		},
	},
	{
		displayName: 'Binary Property Name',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'screenshot',
		description: 'Name of the binary property to store the screenshot',
		displayOptions: {
			show: {
				resource: ['scrape'],
				operation: ['screenshot'],
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
				operation: ['screenshot'],
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
 * Execute screenshot operation
 */
export async function executeScrapeScreenshot(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const url = this.getNodeParameter('url', index) as string;
	const fullPage = this.getNodeParameter('fullPage', index, false) as boolean;
	const screenshotType = this.getNodeParameter('screenshotType', index, 'none') as string;
	const outputBinary = this.getNodeParameter('outputBinary', index, true) as boolean;
	const options = this.getNodeParameter('options', index, {}) as Partial<ScrapeParams>;

	// Build request parameters
	const params: Partial<ScrapeParams> = {
		url,
		response_type: 'screenshot',
		json: true,
		screenshot_fullpage: fullPage,
		...options,
	};

	// Handle partial screenshots
	if (screenshotType === 'selector') {
		params.screenshot_partial = this.getNodeParameter('elementSelector', index) as string;
	} else if (screenshotType === 'coordinates') {
		const coords = {
			x: this.getNodeParameter('coordX', index) as number,
			y: this.getNodeParameter('coordY', index) as number,
			width: this.getNodeParameter('coordWidth', index) as number,
			height: this.getNodeParameter('coordHeight', index) as number,
		};
		params.screenshot_partial = JSON.stringify(coords);
	}

	// Remove empty values
	const cleanParams = Object.fromEntries(
		Object.entries(params).filter(([, v]) => v !== undefined && v !== ''),
	);

	const response = await ujeebuApiGet(
		this,
		UJEEBU_ENDPOINTS.SCRAPE,
		cleanParams,
	) as ScrapeScreenshotResponse;

	const result: INodeExecutionData = {
		json: {
			url,
			fullPage,
		},
	};

	if (outputBinary && response.screenshot) {
		const binaryPropertyName = this.getNodeParameter('binaryPropertyName', index, 'screenshot') as string;
		const buffer = Buffer.from(response.screenshot, 'base64');

		result.binary = {
			[binaryPropertyName]: await this.helpers.prepareBinaryData(
				buffer,
				'screenshot.png',
				'image/png',
			),
		};
	} else {
		result.json.screenshot = response.screenshot;
	}

	return [result];
}

