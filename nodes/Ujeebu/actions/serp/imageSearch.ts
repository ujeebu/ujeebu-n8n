/**
 * SERP API - Image Search Operation
 *
 * Performs Google Image search and returns image results.
 */

import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	IDataObject,
} from 'n8n-workflow';
import { ujeebuApiGet, UJEEBU_ENDPOINTS } from '../../transport';
import { commonSerpOptions } from './common';
import type { SerpParams, SerpImagesResponse } from '../../types';

/**
 * Image search operation properties
 */
export const serpImageSearchProperties: INodeProperties[] = [
	{
		displayName: 'Search Query',
		name: 'search',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'sunset landscape',
		description: 'The image search query to perform',
		displayOptions: {
			show: {
				resource: ['serp'],
				operation: ['imageSearch'],
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
				operation: ['imageSearch'],
			},
		},
		options: commonSerpOptions,
	},
];

/**
 * Execute image search operation
 */
export async function executeSerpImageSearch(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const search = this.getNodeParameter('search', index) as string;
	const options = this.getNodeParameter('options', index, {}) as Partial<SerpParams>;

	const params: SerpParams = {
		search,
		search_type: 'images',
		...options,
	};

	const cleanParams = Object.fromEntries(
		Object.entries(params).filter(([, v]) => v !== undefined && v !== ''),
	);

	const response = await ujeebuApiGet(
		this,
		UJEEBU_ENDPOINTS.SERP,
		cleanParams,
	) as SerpImagesResponse;

	return [
		{
			json: response as unknown as IDataObject,
		},
	];
}

