/**
 * Ujeebu Node for n8n
 *
 * This node provides access to Ujeebu's web scraping, article extraction,
 * and SERP (Search Engine Results Page) APIs.
 *
 * Features:
 * - Extract API: Convert news/blog articles into structured JSON
 * - Scrape API: Get HTML, screenshots, PDFs, or extract data with rules
 * - SERP API: Get Google search results (web, news, images, videos, maps)
 *
 * @see https://ujeebu.com/docs
 */

import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

// Import Extract API actions
import {
	extractArticleProperties,
	executeExtractArticle,
} from './actions/extract';

// Import Scrape API actions
import {
	scrapeHtmlProperties,
	executeScrapeHtml,
	scrapeScreenshotProperties,
	executeScrapeScreenshot,
	scrapePdfProperties,
	executeScrapePdf,
	scrapeExtractRulesProperties,
	executeScrapeExtractRules,
} from './actions/scrape';

// Import SERP API actions
import {
	serpWebSearchProperties,
	executeSerpWebSearch,
	serpNewsSearchProperties,
	executeSerpNewsSearch,
	serpImageSearchProperties,
	executeSerpImageSearch,
	serpVideoSearchProperties,
	executeSerpVideoSearch,
	serpMapsSearchProperties,
	executeSerpMapsSearch,
} from './actions/serp';

export class Ujeebu implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Ujeebu',
		name: 'ujeebu',
		icon: 'file:ujeebu.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		description: 'Web scraping, article extraction, and Google SERP API',
		defaults: {
			name: 'Ujeebu',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'ujeebuApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.ujeebu.com',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			// Resource Selection
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Extract',
						value: 'extract',
						description: 'Extract article content from news/blog URLs',
					},
					{
						name: 'Scrape',
						value: 'scrape',
						description: 'Scrape web pages, take screenshots, or generate PDFs',
					},
					{
						name: 'SERP',
						value: 'serp',
						description: 'Get Google search results',
					},
				],
				default: 'scrape',
			},

			// ==================== EXTRACT OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['extract'],
					},
				},
				options: [
					{
						name: 'Article',
						value: 'article',
						description: 'Extract article content into structured JSON',
						action: 'Extract article content',
					},
				],
				default: 'article',
			},

			// ==================== SCRAPE OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['scrape'],
					},
				},
				options: [
					{
						name: 'Get HTML',
						value: 'getHtml',
						description: 'Get rendered HTML of a web page',
						action: 'Get HTML of a web page',
					},
					{
						name: 'Screenshot',
						value: 'screenshot',
						description: 'Capture a screenshot of a web page',
						action: 'Take screenshot of a web page',
					},
					{
						name: 'PDF',
						value: 'pdf',
						description: 'Convert a web page to PDF',
						action: 'Convert web page to PDF',
					},
					{
						name: 'Extract with Rules',
						value: 'extractRules',
						description: 'Extract structured data using CSS selectors',
						action: 'Extract data with rules',
					},
				],
				default: 'getHtml',
			},

			// ==================== SERP OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['serp'],
					},
				},
				options: [
					{
						name: 'Image Search',
						value: 'imageSearch',
						description: 'Search Google Images',
						action: 'Search images',
					},
					{
						name: 'Maps Search',
						value: 'mapsSearch',
						description: 'Search Google Maps / Local businesses',
						action: 'Search maps',
					},
					{
						name: 'News Search',
						value: 'newsSearch',
						description: 'Search Google News',
						action: 'Search news',
					},
					{
						name: 'Video Search',
						value: 'videoSearch',
						description: 'Search Google Videos',
						action: 'Search videos',
					},
					{
						name: 'Web Search',
						value: 'webSearch',
						description: 'Perform a Google web search',
						action: 'Perform web search',
					},
				],
				default: 'webSearch',
			},

			// Include all operation-specific properties
			...extractArticleProperties,
			...scrapeHtmlProperties,
			...scrapeScreenshotProperties,
			...scrapePdfProperties,
			...scrapeExtractRulesProperties,
			...serpWebSearchProperties,
			...serpNewsSearchProperties,
			...serpImageSearchProperties,
			...serpVideoSearchProperties,
			...serpMapsSearchProperties,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[];

				// Route to appropriate handler based on resource and operation
				if (resource === 'extract') {
					switch (operation) {
						case 'article':
							result = await executeExtractArticle.call(this, i);
							break;
						default:
							throw new NodeOperationError(this.getNode(), `Unknown Extract operation: ${operation}`);
					}
				} else if (resource === 'scrape') {
					switch (operation) {
						case 'getHtml':
							result = await executeScrapeHtml.call(this, i);
							break;
						case 'screenshot':
							result = await executeScrapeScreenshot.call(this, i);
							break;
						case 'pdf':
							result = await executeScrapePdf.call(this, i);
							break;
						case 'extractRules':
							result = await executeScrapeExtractRules.call(this, i);
							break;
						default:
							throw new NodeOperationError(this.getNode(), `Unknown Scrape operation: ${operation}`);
					}
				} else if (resource === 'serp') {
					switch (operation) {
						case 'webSearch':
							result = await executeSerpWebSearch.call(this, i);
							break;
						case 'newsSearch':
							result = await executeSerpNewsSearch.call(this, i);
							break;
						case 'imageSearch':
							result = await executeSerpImageSearch.call(this, i);
							break;
						case 'videoSearch':
							result = await executeSerpVideoSearch.call(this, i);
							break;
						case 'mapsSearch':
							result = await executeSerpMapsSearch.call(this, i);
							break;
						default:
							throw new NodeOperationError(this.getNode(), `Unknown SERP operation: ${operation}`);
					}
				} else {
					throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`);
				}

				returnData.push(...result);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as Error).message,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}

