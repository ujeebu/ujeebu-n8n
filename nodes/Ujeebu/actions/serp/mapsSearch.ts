/**
 * SERP API - Maps Search Operation
 *
 * Performs Google Maps search and returns local business results.
 */

import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	IDataObject,
} from 'n8n-workflow';
import { ujeebuApiGet, UJEEBU_ENDPOINTS } from '../../transport';
import { commonSerpOptions } from './common';
import type { SerpParams, SerpMapsResponse } from '../../types';

/**
 * Maps search operation properties
 */
export const serpMapsSearchProperties: INodeProperties[] = [
	{
		displayName: 'Search Query',
		name: 'search',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'restaurants near me',
		description: 'The maps/local search query to perform',
		displayOptions: {
			show: {
				resource: ['serp'],
				operation: ['mapsSearch'],
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
				operation: ['mapsSearch'],
			},
		},
		options: commonSerpOptions,
	},
];

/**
 * Execute maps search operation
 */
export async function executeSerpMapsSearch(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const search = this.getNodeParameter('search', index) as string;
	const options = this.getNodeParameter('options', index, {}) as Partial<SerpParams>;

	const params: SerpParams = {
		search,
		search_type: 'maps',
		...options,
	};

	const cleanParams = Object.fromEntries(
		Object.entries(params).filter(([, v]) => v !== undefined && v !== ''),
	);

	const response = await ujeebuApiGet(
		this,
		UJEEBU_ENDPOINTS.SERP,
		cleanParams,
	) as SerpMapsResponse;

	return [
		{
			json: response as unknown as IDataObject,
		},
	];
}

