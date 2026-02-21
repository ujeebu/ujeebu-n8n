/**
 * Unit Tests for Ujeebu Node Transport Layer
 */

import type { IExecuteFunctions } from 'n8n-workflow';
import { ujeebuApiRequest, ujeebuApiGet, ujeebuApiPost, UJEEBU_ENDPOINTS } from '../nodes/Ujeebu/transport';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
	NodeApiError: class NodeApiError extends Error {
		constructor(node: unknown, error: Error, options?: { message?: string }) {
			super(options?.message || error.message);
			this.name = 'NodeApiError';
		}
	},
}));

describe('Ujeebu Transport Layer', () => {
	let mockExecuteFunctions: jest.Mocked<IExecuteFunctions>;

	beforeEach(() => {
		mockExecuteFunctions = {
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				baseUrl: 'https://api.ujeebu.com',
			}),
			helpers: {
				httpRequest: jest.fn(),
			},
			getNode: jest.fn().mockReturnValue({ name: 'Ujeebu' }),
		} as unknown as jest.Mocked<IExecuteFunctions>;
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('UJEEBU_ENDPOINTS', () => {
		it('should have correct endpoint values', () => {
			expect(UJEEBU_ENDPOINTS.SCRAPE).toBe('/scrape');
			expect(UJEEBU_ENDPOINTS.EXTRACT).toBe('/extract');
			expect(UJEEBU_ENDPOINTS.SERP).toBe('/serp');
			expect(UJEEBU_ENDPOINTS.CARD).toBe('/card');
			expect(UJEEBU_ENDPOINTS.ACCOUNT).toBe('/account');
		});
	});

	describe('ujeebuApiRequest', () => {
		it('should make a GET request with correct headers', async () => {
			const mockResponse = { success: true };
			(mockExecuteFunctions.helpers.httpRequest as jest.Mock).mockResolvedValue(mockResponse);

			const result = await ujeebuApiRequest(
				mockExecuteFunctions,
				'GET',
				'/test',
				undefined,
				{ param: 'value' },
			);

			expect(mockExecuteFunctions.getCredentials).toHaveBeenCalledWith('ujeebuApi');
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: 'GET',
					url: 'https://api.ujeebu.com/test',
					headers: expect.objectContaining({
						ApiKey: 'test-api-key',
						'Content-Type': 'application/json',
					}),
					qs: { param: 'value' },
				}),
			);
			expect(result).toEqual(mockResponse);
		});

		it('should make a POST request with body', async () => {
			const mockResponse = { success: true };
			(mockExecuteFunctions.helpers.httpRequest as jest.Mock).mockResolvedValue(mockResponse);

			const body = { url: 'https://example.com' };
			await ujeebuApiRequest(
				mockExecuteFunctions,
				'POST',
				'/scrape',
				body,
			);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: 'POST',
					body: body,
				}),
			);
		});

		it('should throw NodeApiError on request failure', async () => {
			const error = new Error('Network error');
			(mockExecuteFunctions.helpers.httpRequest as jest.Mock).mockRejectedValue(error);

			await expect(
				ujeebuApiRequest(mockExecuteFunctions, 'GET', '/test'),
			).rejects.toThrow('Ujeebu API error');
		});
	});

	describe('ujeebuApiGet', () => {
		it('should call ujeebuApiRequest with GET method', async () => {
			const mockResponse = { data: 'test' };
			(mockExecuteFunctions.helpers.httpRequest as jest.Mock).mockResolvedValue(mockResponse);

			const result = await ujeebuApiGet(
				mockExecuteFunctions,
				'/scrape',
				{ url: 'https://example.com' },
			);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: 'GET',
					url: 'https://api.ujeebu.com/scrape',
				}),
			);
			expect(result).toEqual(mockResponse);
		});
	});

	describe('ujeebuApiPost', () => {
		it('should call ujeebuApiRequest with POST method', async () => {
			const mockResponse = { article: { title: 'Test' } };
			(mockExecuteFunctions.helpers.httpRequest as jest.Mock).mockResolvedValue(mockResponse);

			const body = { url: 'https://example.com/article' };
			const result = await ujeebuApiPost(mockExecuteFunctions, '/extract', body);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: 'POST',
					url: 'https://api.ujeebu.com/extract',
					body: body,
				}),
			);
			expect(result).toEqual(mockResponse);
		});
	});
});

