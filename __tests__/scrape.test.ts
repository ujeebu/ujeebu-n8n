/**
 * Unit Tests for Ujeebu Scrape API Actions
 */

import type { IExecuteFunctions, IBinaryData } from 'n8n-workflow';
import {
	executeScrapeHtml,
	executeScrapeScreenshot,
	executeScrapePdf,
	executeScrapeExtractRules,
} from '../nodes/Ujeebu/actions/scrape';

// Mock the transport module
jest.mock('../nodes/Ujeebu/transport', () => ({
	ujeebuApiGet: jest.fn(),
	ujeebuApiPost: jest.fn(),
	UJEEBU_ENDPOINTS: {
		EXTRACT: '/extract',
		SCRAPE: '/scrape',
		SERP: '/serp',
	},
}));

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
	NodeOperationError: class NodeOperationError extends Error {
		constructor(node: unknown, message: string, options?: { itemIndex?: number }) {
			super(message);
			this.name = 'NodeOperationError';
		}
	},
}));

import { ujeebuApiGet, ujeebuApiPost } from '../nodes/Ujeebu/transport';

describe('Scrape API Actions', () => {
	let mockExecuteFunctions: jest.Mocked<IExecuteFunctions>;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				baseUrl: 'https://api.ujeebu.com',
			}),
			helpers: {
				httpRequest: jest.fn(),
				prepareBinaryData: jest.fn().mockImplementation(
					async (buffer: Buffer, fileName: string, mimeType: string): Promise<IBinaryData> => ({
						data: buffer.toString('base64'),
						mimeType,
						fileName,
					}),
				),
			},
			getNode: jest.fn().mockReturnValue({ name: 'Ujeebu' }),
		} as unknown as jest.Mocked<IExecuteFunctions>;

		jest.clearAllMocks();
	});

	describe('executeScrapeHtml', () => {
		it('should get HTML with default options', async () => {
			const mockResponse = {
				html: '<html><body>Test</body></html>',
			};

			(mockExecuteFunctions.getNodeParameter as jest.Mock)
				.mockReturnValueOnce('https://example.com') // url
				.mockReturnValueOnce('') // stripTags
				.mockReturnValueOnce({}); // options

			(ujeebuApiGet as jest.Mock).mockResolvedValue(mockResponse);

			const result = await executeScrapeHtml.call(mockExecuteFunctions, 0);

			expect(ujeebuApiGet).toHaveBeenCalledWith(
				mockExecuteFunctions,
				'/scrape',
				expect.objectContaining({
					url: 'https://example.com',
					response_type: 'html',
					json: true,
				}),
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.html).toBe(mockResponse.html);
		});

		it('should apply strip_tags option', async () => {
			(mockExecuteFunctions.getNodeParameter as jest.Mock)
				.mockReturnValueOnce('https://example.com')
				.mockReturnValueOnce('script,style')
				.mockReturnValueOnce({ js: true });

			(ujeebuApiGet as jest.Mock).mockResolvedValue({ html: '<html></html>' });

			await executeScrapeHtml.call(mockExecuteFunctions, 0);

			expect(ujeebuApiGet).toHaveBeenCalledWith(
				mockExecuteFunctions,
				'/scrape',
				expect.objectContaining({
					strip_tags: 'script,style',
					js: true,
				}),
			);
		});
	});

	describe('executeScrapeScreenshot', () => {
		it('should capture screenshot and return binary data', async () => {
			const base64Screenshot = Buffer.from('fake-image-data').toString('base64');
			const mockResponse = {
				screenshot: base64Screenshot,
			};

			(mockExecuteFunctions.getNodeParameter as jest.Mock)
				.mockReturnValueOnce('https://example.com') // url
				.mockReturnValueOnce(false) // fullPage
				.mockReturnValueOnce('none') // screenshotType
				.mockReturnValueOnce(true) // outputBinary
				.mockReturnValueOnce({}) // options
				.mockReturnValueOnce('screenshot'); // binaryPropertyName

			(ujeebuApiGet as jest.Mock).mockResolvedValue(mockResponse);

			const result = await executeScrapeScreenshot.call(mockExecuteFunctions, 0);

			expect(result).toHaveLength(1);
			expect(result[0].binary).toBeDefined();
			expect(result[0].binary?.screenshot).toBeDefined();
		});

		it('should capture full page screenshot', async () => {
			(mockExecuteFunctions.getNodeParameter as jest.Mock)
				.mockReturnValueOnce('https://example.com')
				.mockReturnValueOnce(true) // fullPage
				.mockReturnValueOnce('none')
				.mockReturnValueOnce(false) // outputBinary - return base64 in json
				.mockReturnValueOnce({});

			const base64 = Buffer.from('test').toString('base64');
			(ujeebuApiGet as jest.Mock).mockResolvedValue({ screenshot: base64 });

			const result = await executeScrapeScreenshot.call(mockExecuteFunctions, 0);

			expect(ujeebuApiGet).toHaveBeenCalledWith(
				mockExecuteFunctions,
				'/scrape',
				expect.objectContaining({
					screenshot_fullpage: true,
				}),
			);

			expect(result[0].json.screenshot).toBe(base64);
		});

		it('should capture element screenshot by selector', async () => {
			(mockExecuteFunctions.getNodeParameter as jest.Mock)
				.mockReturnValueOnce('https://example.com')
				.mockReturnValueOnce(false)
				.mockReturnValueOnce('selector') // screenshotType
				.mockReturnValueOnce(false)
				.mockReturnValueOnce({})
				.mockReturnValueOnce('#main-content'); // elementSelector

			(ujeebuApiGet as jest.Mock).mockResolvedValue({ screenshot: 'abc' });

			await executeScrapeScreenshot.call(mockExecuteFunctions, 0);

			expect(ujeebuApiGet).toHaveBeenCalledWith(
				mockExecuteFunctions,
				'/scrape',
				expect.objectContaining({
					screenshot_partial: '#main-content',
				}),
			);
		});
	});

	describe('executeScrapePdf', () => {
		it('should generate PDF and return binary data', async () => {
			const base64Pdf = Buffer.from('fake-pdf-data').toString('base64');
			const mockResponse = {
				pdf: base64Pdf,
			};

			(mockExecuteFunctions.getNodeParameter as jest.Mock)
				.mockReturnValueOnce('https://example.com')
				.mockReturnValueOnce(true) // outputBinary
				.mockReturnValueOnce({})
				.mockReturnValueOnce('pdf'); // binaryPropertyName

			(ujeebuApiGet as jest.Mock).mockResolvedValue(mockResponse);

			const result = await executeScrapePdf.call(mockExecuteFunctions, 0);

			expect(result).toHaveLength(1);
			expect(result[0].binary).toBeDefined();
			expect(result[0].binary?.pdf).toBeDefined();
		});
	});

	describe('executeScrapeExtractRules', () => {
		it('should extract data with JSON rules', async () => {
			const extractRules = {
				title: { selector: 'h1', type: 'text' },
				link: { selector: 'a.main', type: 'link' },
			};

			const mockResponse = {
				result: {
					title: 'Page Title',
					link: 'https://example.com/page',
				},
			};

			(mockExecuteFunctions.getNodeParameter as jest.Mock)
				.mockReturnValueOnce('https://example.com')
				.mockReturnValueOnce('json') // rulesMode
				.mockReturnValueOnce({}) // options
				.mockReturnValueOnce(JSON.stringify(extractRules)); // extractRulesJson

			(ujeebuApiPost as jest.Mock).mockResolvedValue(mockResponse);

			const result = await executeScrapeExtractRules.call(mockExecuteFunctions, 0);

			expect(result[0].json.result).toEqual(mockResponse.result);
		});

		it('should extract data with builder rules', async () => {
			const builderRules = {
				rules: [
					{ fieldName: 'title', selector: 'h1', type: 'text', multiple: false },
					{ fieldName: 'images', selector: 'img', type: 'image', multiple: true },
				],
			};

			(mockExecuteFunctions.getNodeParameter as jest.Mock)
				.mockReturnValueOnce('https://example.com')
				.mockReturnValueOnce('builder') // rulesMode
				.mockReturnValueOnce({}) // options
				.mockReturnValueOnce(builderRules); // extractionRules

			(ujeebuApiPost as jest.Mock).mockResolvedValue({ result: { title: 'Test' } });

			await executeScrapeExtractRules.call(mockExecuteFunctions, 0);

			expect(ujeebuApiPost).toHaveBeenCalledWith(
				mockExecuteFunctions,
				'/scrape',
				expect.objectContaining({
					extract_rules: expect.objectContaining({
						title: { selector: 'h1', type: 'text' },
						images: { selector: 'img', type: 'image', multiple: true },
					}),
				}),
			);
		});

		it('should throw error for invalid JSON rules', async () => {
			(mockExecuteFunctions.getNodeParameter as jest.Mock)
				.mockReturnValueOnce('https://example.com')
				.mockReturnValueOnce('json')
				.mockReturnValueOnce({})
				.mockReturnValueOnce('invalid json {{{');

			await expect(
				executeScrapeExtractRules.call(mockExecuteFunctions, 0),
			).rejects.toThrow('Invalid JSON');
		});

		it('should throw error when no rules provided', async () => {
			(mockExecuteFunctions.getNodeParameter as jest.Mock)
				.mockReturnValueOnce('https://example.com')
				.mockReturnValueOnce('builder')
				.mockReturnValueOnce({})
				.mockReturnValueOnce({ rules: [] }); // empty rules

			await expect(
				executeScrapeExtractRules.call(mockExecuteFunctions, 0),
			).rejects.toThrow('At least one extraction rule is required');
		});
	});
});

