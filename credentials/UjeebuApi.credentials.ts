import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

/**
 * Ujeebu API Credentials
 *
 * This credential type handles authentication for all Ujeebu API endpoints:
 * - Extract API (Article extraction)
 * - Scrape API (Web scraping, screenshots, PDFs)
 * - SERP API (Google search results)
 *
 * @see https://ujeebu.com/docs
 */
export class UjeebuApi implements ICredentialType {
	name = 'ujeebuApi';

	displayName = 'Ujeebu API';

	documentationUrl = 'https://ujeebu.com/docs';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your Ujeebu API key. Get one at https://ujeebu.com/signup',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.ujeebu.com',
			description: 'The base URL for the Ujeebu API',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				ApiKey: '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/account',
			method: 'GET',
		},
	};
}

