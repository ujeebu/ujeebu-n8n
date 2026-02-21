/**
 * Common SERP API Properties
 *
 * Shared options used across SERP operations.
 */

import type { INodeProperties } from 'n8n-workflow';

/**
 * Common SERP search options
 */
export const commonSerpOptions: INodeProperties[] = [
	{
		displayName: 'Language',
		name: 'lang',
		type: 'string',
		default: 'en',
		placeholder: 'en, es, fr, de',
		description: 'ISO 639-1 language code for search results',
	},
	{
		displayName: 'Location',
		name: 'location',
		type: 'string',
		default: 'us',
		placeholder: 'us, uk, fr, de',
		description: 'Geographic location for the search (ISO 3166-1 alpha-2)',
	},
	{
		displayName: 'Device',
		name: 'device',
		type: 'options',
		options: [
			{ name: 'Desktop', value: 'desktop' },
			{ name: 'Mobile', value: 'mobile' },
			{ name: 'Tablet', value: 'tablet' },
		],
		default: 'desktop',
		description: 'Type of device to simulate during the search',
	},
	{
		displayName: 'Results Count',
		name: 'results_count',
		type: 'number',
		default: 10,
		description: 'Maximum number of results to retrieve per page',
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		default: 1,
		description: 'Page number to retrieve (for pagination)',
	},
	{
		displayName: 'Extra Parameters',
		name: 'extra_params',
		type: 'string',
		default: '',
		placeholder: '&safe=active',
		description: 'Additional query parameters to include in the search',
	},
];

