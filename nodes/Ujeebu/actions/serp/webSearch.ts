/**
 * SERP API - Web Search Operation
 *
 * Performs Google web search and returns structured results including
 * organic results, knowledge graph, related questions, and more.
 */

import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	IDataObject,
} from 'n8n-workflow';
import { ujeebuApiGet, UJEEBU_ENDPOINTS } from '../../transport';
import { commonSerpOptions } from './common';
import type { SerpParams, SerpSearchResponse } from '../../types';

/**
 * Web search operation properties
 */
export const serpWebSearchProperties: INodeProperties[] = [
	{
		displayName: 'Search Query',
		name: 'search',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'web scraping API',
		description: 'The search query to perform on Google',
		displayOptions: {
			show: {
				resource: ['serp'],
				operation: ['webSearch'],
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
				resource: ['serp'],
				operation: ['webSearch'],
			},
		},
		options: commonSerpOptions,
	},
];

/**
 * Execute web search operation
 */
export async function executeSerpWebSearch(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const search = this.getNodeParameter('search', index) as string;
	const options = this.getNodeParameter('options', index, {}) as Partial<SerpParams>;

	const params: SerpParams = {
		search,
		search_type: 'search',
		...options,
	};

	// Remove empty values
	const cleanParams = Object.fromEntries(
		Object.entries(params).filter(([, v]) => v !== undefined && v !== ''),
	);

	const response = await ujeebuApiGet(
		this,
		UJEEBU_ENDPOINTS.SERP,
		cleanParams,
	) as SerpSearchResponse;

	return [
		{
			json: response as unknown as IDataObject,
		},
	];
}

