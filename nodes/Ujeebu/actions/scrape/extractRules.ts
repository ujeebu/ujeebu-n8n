/**
 * Scrape API - Extract with Rules Operation
 *
 * Extracts structured data from web pages using CSS selectors
 * and extraction rules.
 */

import type {
    IDataObject,
    IExecuteFunctions,
    INodeExecutionData,
    INodeProperties,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { ujeebuApiPost, UJEEBU_ENDPOINTS } from '../../transport';
import { commonScrapeOptions, scrollOptions, proxyOptions } from './common';
import type { ScrapeParams, ScrapeExtractRulesResponse } from '../../types';

/**
 * Extract rules operation properties
 */
export const scrapeExtractRulesProperties: INodeProperties[] = [
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://example.com/products',
		description: 'URL to extract data from',
		displayOptions: {
			show: {
				resource: ['scrape'],
				operation: ['extractRules'],
			},
		},
	},
	{
		displayName: 'Extract Rules Mode',
		name: 'rulesMode',
		type: 'options',
		options: [
			{ name: 'Visual Builder', value: 'builder' },
			{ name: 'JSON', value: 'json' },
		],
		default: 'builder',
		description: 'How to define extraction rules',
		displayOptions: {
			show: {
				resource: ['scrape'],
				operation: ['extractRules'],
			},
		},
	},
	{
		displayName: 'Extract Rules (JSON)',
		name: 'extractRulesJson',
		type: 'json',
		default: '{}',
		placeholder: '{"title": {"selector": "h1", "type": "text"}}',
		description: 'JSON object defining extraction rules',
		displayOptions: {
			show: {
				resource: ['scrape'],
				operation: ['extractRules'],
				rulesMode: ['json'],
			},
		},
	},
	{
		displayName: 'Extraction Rules',
		name: 'extractionRules',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		placeholder: 'Add Rule',
		description: 'Define rules to extract data from the page',
		displayOptions: {
			show: {
				resource: ['scrape'],
				operation: ['extractRules'],
				rulesMode: ['builder'],
			},
		},
		options: [
			{
				name: 'rules',
				displayName: 'Rules',
				values: [
					{
						displayName: 'Field Name',
						name: 'fieldName',
						type: 'string',
						default: '',
						placeholder: 'title',
						description: 'Name of the field in the output',
					},
					{
						displayName: 'CSS Selector',
						name: 'selector',
						type: 'string',
						default: '',
						placeholder: 'h1.title',
						description: 'CSS selector to find the element(s)',
					},
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						options: [
							{ name: 'Attribute', value: 'attr', description: 'Extract a specific attribute' },
							{ name: 'Image', value: 'image', description: 'Extract src attribute' },
							{ name: 'Link', value: 'link', description: 'Extract href attribute' },
							{ name: 'Object', value: 'obj', description: 'Extract nested data' },
							{ name: 'Text', value: 'text', description: 'Extract text content' },
						],
						default: 'text',
						description: 'Type of data to extract',
					},
					{
						displayName: 'Attribute Name',
						name: 'attribute',
						type: 'string',
						default: '',
						placeholder: 'data-ID',
						description: 'Attribute to extract (for attr type)',
						displayOptions: {
							show: {
								type: ['attr'],
							},
						},
					},
					{
						displayName: 'Multiple',
						name: 'multiple',
						type: 'boolean',
						default: false,
						description: 'Whether to extract all matching elements as an array',
					},
				],
			},
		],
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
				operation: ['extractRules'],
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
 * Build extraction rules from visual builder
 */
function buildExtractionRules(
	rules: Array<{
		fieldName: string;
		selector: string;
		type: string;
		attribute?: string;
		multiple?: boolean;
	}>,
): Record<string, unknown> {
	const extractRules: Record<string, unknown> = {};

	for (const rule of rules) {
		if (!rule.fieldName || !rule.selector) continue;

		const ruleConfig: Record<string, unknown> = {
			selector: rule.selector,
			type: rule.type,
		};

		if (rule.type === 'attr' && rule.attribute) {
			ruleConfig.attribute = rule.attribute;
		}

		if (rule.multiple) {
			ruleConfig.multiple = true;
		}

		extractRules[rule.fieldName] = ruleConfig;
	}

	return extractRules;
}

/**
 * Execute extract with rules operation
 */
export async function executeScrapeExtractRules(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const url = this.getNodeParameter('url', index) as string;
	const rulesMode = this.getNodeParameter('rulesMode', index) as string;
	const options = this.getNodeParameter('options', index, {}) as Partial<ScrapeParams>;

	let extractRules: Record<string, unknown>;

	if (rulesMode === 'json') {
		const rulesJson = this.getNodeParameter('extractRulesJson', index) as string;
		try {
			extractRules = JSON.parse(rulesJson);
		} catch {
			throw new NodeOperationError(this.getNode(), 'Invalid JSON in extract rules', { itemIndex: index });
		}
	} else {
		const rulesData = this.getNodeParameter('extractionRules', index, {}) as {
			rules?: Array<{
				fieldName: string;
				selector: string;
				type: string;
				attribute?: string;
				multiple?: boolean;
			}>;
		};
		extractRules = buildExtractionRules(rulesData.rules || []);
	}

	if (Object.keys(extractRules).length === 0) {
		throw new NodeOperationError(this.getNode(), 'At least one extraction rule is required', { itemIndex: index });
	}

	// Build request parameters
	const params: Record<string, unknown> = {
		url,
		extract_rules: extractRules,
		json: true,
		...options,
	};

	// Remove empty values
	const cleanParams = Object.fromEntries(
		Object.entries(params).filter(([, v]) => v !== undefined && v !== ''),
	);

	const response = await ujeebuApiPost(
		this,
		UJEEBU_ENDPOINTS.SCRAPE,
		cleanParams as IDataObject,
	) as ScrapeExtractRulesResponse;

	return [
		{
			json: {
				url,
				result: response.result,
			},
		},
	];
}

