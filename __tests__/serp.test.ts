/**
 * Unit Tests for Ujeebu SERP API Actions
 */

import type { IExecuteFunctions } from 'n8n-workflow';
import {
	executeSerpWebSearch,
	executeSerpNewsSearch,
	executeSerpImageSearch,
	executeSerpVideoSearch,
	executeSerpMapsSearch,
} from '../nodes/Ujeebu/actions/serp';

// Mock the transport module
jest.mock('../nodes/Ujeebu/transport', () => ({
	ujeebuApiGet: jest.fn(),
	UJEEBU_ENDPOINTS: {
		SERP: '/serp',
	},
}));

import { ujeebuApiGet } from '../nodes/Ujeebu/transport';

describe('SERP API Actions', () => {
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

	describe('executeSerpWebSearch', () => {
		it('should perform web search with default options', async () => {
			const mockResponse = {
				metadata: {
					google_url: 'https://google.com/search?q=test',
					query_displayed: 'test',
					number_of_results: 1000000,
				},
				organic_results: [
					{ title: 'Result 1', link: 'https://example.com/1' },
					{ title: 'Result 2', link: 'https://example.com/2' },
				],
				pagination: {
					google: { current: 'url1', next: 'url2', other_pages: {} },
					api: { current: 'url1', next: 'url2', other_pages: {} },
				},
			};

			(mockExecuteFunctions.getNodeParameter as jest.Mock)
				.mockReturnValueOnce('web scraping API') // search
				.mockReturnValueOnce({}); // options

			(ujeebuApiGet as jest.Mock).mockResolvedValue(mockResponse);

			const result = await executeSerpWebSearch.call(mockExecuteFunctions, 0);

			expect(ujeebuApiGet).toHaveBeenCalledWith(
				mockExecuteFunctions,
				'/serp',
				expect.objectContaining({
					search: 'web scraping API',
					search_type: 'search',
				}),
			);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});

		it('should perform web search with custom options', async () => {
			(mockExecuteFunctions.getNodeParameter as jest.Mock)
				.mockReturnValueOnce('test query')
				.mockReturnValueOnce({
					lang: 'es',
					location: 'mx',
					device: 'mobile',
					results_count: 20,
					page: 2,
				});

			(ujeebuApiGet as jest.Mock).mockResolvedValue({ organic_results: [] });

			await executeSerpWebSearch.call(mockExecuteFunctions, 0);

			expect(ujeebuApiGet).toHaveBeenCalledWith(
				mockExecuteFunctions,
				'/serp',
				expect.objectContaining({
					search: 'test query',
					search_type: 'search',
					lang: 'es',
					location: 'mx',
					device: 'mobile',
					results_count: 20,
					page: 2,
				}),
			);
		});
	});

	describe('executeSerpNewsSearch', () => {
		it('should perform news search', async () => {
			const mockResponse = {
				metadata: { query_displayed: 'AI news' },
				news: [
					{ title: 'News 1', link: 'https://news.com/1', date: '2 hours ago' },
					{ title: 'News 2', link: 'https://news.com/2', date: '5 hours ago' },
				],
				pagination: {
					google: { current: 'url', next: 'url', other_pages: {} },
					api: { current: 'url', next: 'url', other_pages: {} },
				},
			};

			(mockExecuteFunctions.getNodeParameter as jest.Mock)
				.mockReturnValueOnce('AI news')
				.mockReturnValueOnce({});

			(ujeebuApiGet as jest.Mock).mockResolvedValue(mockResponse);

			const result = await executeSerpNewsSearch.call(mockExecuteFunctions, 0);

			expect(ujeebuApiGet).toHaveBeenCalledWith(
				mockExecuteFunctions,
				'/serp',
				expect.objectContaining({
					search: 'AI news',
					search_type: 'news',
				}),
			);

			expect(result[0].json.news).toHaveLength(2);
		});
	});

	describe('executeSerpImageSearch', () => {
		it('should perform image search', async () => {
			const mockResponse = {
				metadata: { query_displayed: 'sunset' },
				images: [
					{ image: 'https://img.com/1.jpg', title: 'Sunset 1' },
					{ image: 'https://img.com/2.jpg', title: 'Sunset 2' },
				],
				pagination: {
					google: { current: 'url', next: 'url', other_pages: {} },
					api: { current: 'url', next: 'url', other_pages: {} },
				},
			};

			(mockExecuteFunctions.getNodeParameter as jest.Mock)
				.mockReturnValueOnce('sunset')
				.mockReturnValueOnce({});

			(ujeebuApiGet as jest.Mock).mockResolvedValue(mockResponse);

			const result = await executeSerpImageSearch.call(mockExecuteFunctions, 0);

			expect(ujeebuApiGet).toHaveBeenCalledWith(
				mockExecuteFunctions,
				'/serp',
				expect.objectContaining({
					search: 'sunset',
					search_type: 'images',
				}),
			);

			expect(result[0].json.images).toHaveLength(2);
		});
	});

	describe('executeSerpVideoSearch', () => {
		it('should perform video search', async () => {
			const mockResponse = {
				metadata: { query_displayed: 'tutorial' },
				videos: [
					{ title: 'Video 1', url: 'https://youtube.com/1' },
					{ title: 'Video 2', url: 'https://youtube.com/2' },
				],
				pagination: {
					google: { current: 'url', next: 'url', other_pages: {} },
					api: { current: 'url', next: 'url', other_pages: {} },
				},
			};

			(mockExecuteFunctions.getNodeParameter as jest.Mock)
				.mockReturnValueOnce('tutorial')
				.mockReturnValueOnce({});

			(ujeebuApiGet as jest.Mock).mockResolvedValue(mockResponse);

			const result = await executeSerpVideoSearch.call(mockExecuteFunctions, 0);

			expect(ujeebuApiGet).toHaveBeenCalledWith(
				mockExecuteFunctions,
				'/serp',
				expect.objectContaining({
					search: 'tutorial',
					search_type: 'videos',
				}),
			);

			expect(result[0].json.videos).toHaveLength(2);
		});
	});

	describe('executeSerpMapsSearch', () => {
		it('should perform maps search', async () => {
			const mockResponse = {
				metadata: { query_displayed: 'restaurants' },
				maps_results: [
					{ title: 'Restaurant 1', address: '123 Main St', rating: 4.5 },
					{ title: 'Restaurant 2', address: '456 Oak Ave', rating: 4.2 },
				],
				pagination: {
					google: { current: 'url', next: 'url', other_pages: {} },
					api: { current: 'url', next: 'url', other_pages: {} },
				},
			};

			(mockExecuteFunctions.getNodeParameter as jest.Mock)
				.mockReturnValueOnce('restaurants near me')
				.mockReturnValueOnce({ location: 'us' });

			(ujeebuApiGet as jest.Mock).mockResolvedValue(mockResponse);

			const result = await executeSerpMapsSearch.call(mockExecuteFunctions, 0);

			expect(ujeebuApiGet).toHaveBeenCalledWith(
				mockExecuteFunctions,
				'/serp',
				expect.objectContaining({
					search: 'restaurants near me',
					search_type: 'maps',
					location: 'us',
				}),
			);

			expect(result[0].json.maps_results).toHaveLength(2);
		});
	});
});

