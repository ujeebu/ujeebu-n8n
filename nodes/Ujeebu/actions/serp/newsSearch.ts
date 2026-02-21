/**
 * SERP API - News Search Operation
 *
 * Performs Google News search and returns news articles.
 */

import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	IDataObject,
} from 'n8n-workflow';
import { ujeebuApiGet, UJEEBU_ENDPOINTS } from '../../transport';
import { commonSerpOptions } from './common';
import type { SerpParams, SerpNewsResponse } from '../../types';

/**
 * News search operation properties
 */
export const serpNewsSearchProperties: INodeProperties[] = [
	{
		displayName: 'Search Query',
		name: 'search',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'artificial intelligence',
		description: 'The news search query to perform',
		displayOptions: {
			show: {
				resource: ['serp'],
				operation: ['newsSearch'],
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
				operation: ['newsSearch'],
			},
		},
		options: commonSerpOptions,
	},
];

/**
 * Execute news search operation
 */
export async function executeSerpNewsSearch(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const search = this.getNodeParameter('search', index) as string;
	const options = this.getNodeParameter('options', index, {}) as Partial<SerpParams>;

	const params: SerpParams = {
		search,
		search_type: 'news',
		...options,
	};

	const cleanParams = Object.fromEntries(
		Object.entries(params).filter(([, v]) => v !== undefined && v !== ''),
	);

	const response = await ujeebuApiGet(
		this,
		UJEEBU_ENDPOINTS.SERP,
		cleanParams,
	) as SerpNewsResponse;

	return [
		{
			json: response as unknown as IDataObject,
		},
	];
}

