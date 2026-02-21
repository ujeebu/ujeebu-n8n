/**
 * Ujeebu API Transport Layer
 *
 * This module handles all HTTP communication with the Ujeebu API.
 * It provides a clean abstraction for making authenticated requests
 * to the various Ujeebu API endpoints.
 */

import type {
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	IDataObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import type { UjeebuApiCredentials } from '../types';

/**
 * API endpoints for Ujeebu services
 */
export const UJEEBU_ENDPOINTS = {
	SCRAPE: '/scrape',
	EXTRACT: '/extract',
	SERP: '/serp',
	CARD: '/card',
	ACCOUNT: '/account',
} as const;

/**
 * Make an authenticated request to the Ujeebu API
 *
 * @param context - The n8n execution context
 * @param method - HTTP method to use
 * @param endpoint - API endpoint (e.g., '/scrape')
 * @param options - Additional request options
 * @returns The API response
 */
export async function ujeebuApiRequest(
	context: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	qs?: IDataObject,
	options: Partial<IHttpRequestOptions> = {},
): Promise<unknown> {
	const credentials = await context.getCredentials('ujeebuApi') as UjeebuApiCredentials;

	const requestOptions: IHttpRequestOptions = {
		method,
		url: `${credentials.baseUrl}${endpoint}`,
		headers: {
			ApiKey: credentials.apiKey,
			'Content-Type': 'application/json',
		},
		...options,
	};

	if (body && Object.keys(body).length > 0) {
		requestOptions.body = body;
	}

	if (qs && Object.keys(qs).length > 0) {
		requestOptions.qs = qs;
	}

	try {
		const response = await context.helpers.httpRequest(requestOptions);
		return response;
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		throw new NodeApiError(context.getNode(), {
			message: `Ujeebu API error: ${errorMessage}`,
		});
	}
}

/**
 * Make a GET request to the Ujeebu API
 */
export async function ujeebuApiGet(
	context: IExecuteFunctions,
	endpoint: string,
	qs?: IDataObject,
	options?: Partial<IHttpRequestOptions>,
): Promise<unknown> {
	return ujeebuApiRequest(context, 'GET', endpoint, undefined, qs, options);
}

/**
 * Make a POST request to the Ujeebu API
 */
export async function ujeebuApiPost(
	context: IExecuteFunctions,
	endpoint: string,
	body?: IDataObject,
	qs?: IDataObject,
	options?: Partial<IHttpRequestOptions>,
): Promise<unknown> {
	return ujeebuApiRequest(context, 'POST', endpoint, body, qs, options);
}

/**
 * Download binary data from Ujeebu API (for screenshots/PDFs)
 */
export async function ujeebuApiBinaryRequest(
	context: IExecuteFunctions,
	endpoint: string,
	qs?: IDataObject,
): Promise<Buffer> {
	const credentials = await context.getCredentials('ujeebuApi') as UjeebuApiCredentials;

	const response = await context.helpers.httpRequest({
		method: 'GET',
		url: `${credentials.baseUrl}${endpoint}`,
		headers: {
			ApiKey: credentials.apiKey,
		},
		qs,
		encoding: 'arraybuffer',
		returnFullResponse: false,
	});

	return Buffer.from(response as ArrayBuffer);
}

