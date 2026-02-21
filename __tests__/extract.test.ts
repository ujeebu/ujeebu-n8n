/**
 * Unit Tests for Ujeebu Extract API Actions
 */

import type { IExecuteFunctions } from 'n8n-workflow';
import { executeExtractArticle } from '../nodes/Ujeebu/actions/extract/article';

// Mock the transport module
jest.mock('../nodes/Ujeebu/transport', () => ({
	ujeebuApiPost: jest.fn(),
	UJEEBU_ENDPOINTS: {
		EXTRACT: '/extract',
		SCRAPE: '/scrape',
		SERP: '/serp',
	},
}));

import { ujeebuApiPost } from '../nodes/Ujeebu/transport';

describe('Extract API Actions', () => {
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
			},
			getNode: jest.fn().mockReturnValue({ name: 'Ujeebu' }),
		} as unknown as jest.Mocked<IExecuteFunctions>;

		jest.clearAllMocks();
	});

	describe('executeExtractArticle', () => {
		it('should extract article with default options', async () => {
			const mockResponse = {
				article: {
					title: 'Test Article',
					text: 'Article content...',
					author: 'John Doe',
					pub_date: '2025-01-01',
				},
				time: 1.5,
			};

			(mockExecuteFunctions.getNodeParameter as jest.Mock)
				.mockReturnValueOnce('https://example.com/article') // url
				.mockReturnValueOnce({}); // options

			(ujeebuApiPost as jest.Mock).mockResolvedValue(mockResponse);

			const result = await executeExtractArticle.call(mockExecuteFunctions, 0);

			expect(ujeebuApiPost).toHaveBeenCalledWith(
				mockExecuteFunctions,
				'/extract',
				expect.objectContaining({
					url: 'https://example.com/article',
				}),
			);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});

		it('should extract article with custom options', async () => {
			const mockResponse = {
				article: {
					title: 'Test Article',
					text: 'Article content...',
				},
			};

			(mockExecuteFunctions.getNodeParameter as jest.Mock)
				.mockReturnValueOnce('https://example.com/article')
				.mockReturnValueOnce({
					js: true,
					quick_mode: true,
					timeout: 30,
					images: true,
					media: false,
				});

			(ujeebuApiPost as jest.Mock).mockResolvedValue(mockResponse);

			const result = await executeExtractArticle.call(mockExecuteFunctions, 0);

			expect(ujeebuApiPost).toHaveBeenCalledWith(
				mockExecuteFunctions,
				'/extract',
				expect.objectContaining({
					url: 'https://example.com/article',
					js: true,
					quick_mode: true,
					timeout: 30,
					images: true,
					media: false,
				}),
			);

			expect(result[0].json).toEqual(mockResponse);
		});

		it('should handle proxy options', async () => {
			const mockResponse = { article: { title: 'Test' } };

			(mockExecuteFunctions.getNodeParameter as jest.Mock)
				.mockReturnValueOnce('https://example.com/article')
				.mockReturnValueOnce({
					proxy_type: 'premium',
					proxy_country: 'US',
				});

			(ujeebuApiPost as jest.Mock).mockResolvedValue(mockResponse);

			await executeExtractArticle.call(mockExecuteFunctions, 0);

			expect(ujeebuApiPost).toHaveBeenCalledWith(
				mockExecuteFunctions,
				'/extract',
				expect.objectContaining({
					proxy_type: 'premium',
					proxy_country: 'US',
				}),
			);
		});
	});
});

