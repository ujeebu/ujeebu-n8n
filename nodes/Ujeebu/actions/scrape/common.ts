/**
 * Common Scrape API Properties
 *
 * Shared options used across multiple scrape operations.
 */

import type { INodeProperties } from 'n8n-workflow';

/**
 * Common scrape options that apply to most operations
 */
export const commonScrapeOptions: INodeProperties[] = [
	{
		displayName: 'Enable JavaScript',
		name: 'js',
		type: 'boolean',
		default: true,
		description: 'Whether to execute JavaScript on the page',
	},
	{
		displayName: 'Timeout',
		name: 'timeout',
		type: 'number',
		default: 60,
		description: 'Maximum number of seconds before request timeout',
	},
	{
		displayName: 'JS Timeout',
		name: 'js_timeout',
		type: 'number',
		default: 30,
		description: 'Seconds to wait for JavaScript to render',
	},
	{
		displayName: 'Wait For',
		name: 'wait_for',
		type: 'string',
		default: '',
		placeholder: '#element or 5000',
		description: 'CSS selector to wait for, or milliseconds to wait',
	},
	{
		displayName: 'Wait For Timeout',
		name: 'wait_for_timeout',
		type: 'number',
		default: 30000,
		description: 'Timeout in milliseconds for the wait_for parameter',
	},
	{
		displayName: 'Wait Until',
		name: 'wait_until',
		type: 'options',
		options: [
			{ name: 'Load', value: 'load' },
			{ name: 'DOM Content Loaded', value: 'domcontentloaded' },
			{ name: 'Network Idle', value: 'networkidle' },
			{ name: 'Commit', value: 'commit' },
		],
		default: 'load',
		description: 'When to consider page load complete',
	},
	{
		displayName: 'Custom User Agent',
		name: 'useragent',
		type: 'string',
		default: '',
		placeholder: 'Mozilla/5.0...',
		description: 'Custom user agent string to use',
	},
	{
		displayName: 'Cookies',
		name: 'cookies',
		type: 'string',
		default: '',
		placeholder: 'name1=value1; name2=value2',
		description: 'Cookies to send with the request',
	},
	{
		displayName: 'Device',
		name: 'device',
		type: 'options',
		options: [
			{ name: 'Desktop', value: 'desktop' },
			{ name: 'Mobile', value: 'mobile' },
		],
		default: 'desktop',
		description: 'Type of device to emulate',
	},
	{
		displayName: 'Window Width',
		name: 'window_width',
		type: 'number',
		default: 1920,
		description: 'Browser viewport width in pixels',
	},
	{
		displayName: 'Window Height',
		name: 'window_height',
		type: 'number',
		default: 1080,
		description: 'Browser viewport height in pixels',
	},
	{
		displayName: 'Block Ads',
		name: 'block_ads',
		type: 'boolean',
		default: false,
		description: 'Whether to block advertisements',
	},
	{
		displayName: 'Block Resources',
		name: 'block_resources',
		type: 'boolean',
		default: false,
		description: 'Whether to block images, CSS, and fonts',
	},
];

/**
 * Scroll-related options
 */
export const scrollOptions: INodeProperties[] = [
	{
		displayName: 'Scroll Down',
		name: 'scroll_down',
		type: 'boolean',
		default: false,
		description: 'Whether to scroll down the page',
	},
	{
		displayName: 'Scroll Wait',
		name: 'scroll_wait',
		type: 'number',
		default: 100,
		description: 'Wait time in milliseconds between scroll actions',
	},
	{
		displayName: 'Progressive Scroll',
		name: 'progressive_scroll',
		type: 'boolean',
		default: false,
		description: 'Whether to enable progressive scrolling until page height stops increasing',
	},
	{
		displayName: 'Scroll Percent',
		name: 'scroll_percent',
		type: 'number',
		default: 100,
		description: 'Percentage of the page to scroll (0-100)',
	},
	{
		displayName: 'Scroll To Selector',
		name: 'scroll_to_selector',
		type: 'string',
		default: '',
		placeholder: '#footer',
		description: 'CSS selector of element to scroll to',
	},
];

/**
 * Proxy-related options
 */
export const proxyOptions: INodeProperties[] = [
	{
		displayName: 'Proxy Type',
		name: 'proxy_type',
		type: 'options',
		options: [
			{ name: 'Advanced', value: 'advanced' },
			{ name: 'Custom', value: 'custom' },
			{ name: 'Mobile', value: 'mobile' },
			{ name: 'Premium', value: 'premium' },
			{ name: 'Residential', value: 'residential' },
			{ name: 'Rotating', value: 'rotating' },
		],
		default: 'rotating',
		description: 'Type of proxy to use',
	},
	{
		displayName: 'Proxy Country',
		name: 'proxy_country',
		type: 'string',
		default: 'US',
		placeholder: 'US, UK, DE',
		description: 'ISO 3166-1 alpha-2 country code for premium proxy',
	},
	{
		displayName: 'Auto Proxy',
		name: 'auto_proxy',
		type: 'boolean',
		default: false,
		description: 'Whether to automatically try different proxy types until content is retrieved',
	},
	{
		displayName: 'Session ID',
		name: 'session_id',
		type: 'string',
		default: '',
		placeholder: 'mysession123',
		description: 'Alphanumeric ID (1-16 chars) for persistent proxy sessions (30 min)',
	},
	{
		displayName: 'Custom Proxy URL',
		name: 'custom_proxy',
		type: 'string',
		default: '',
		placeholder: 'http://proxy.example.com:8080',
		description: 'Custom proxy URL (when proxy_type is custom)',
	},
	{
		displayName: 'Custom Proxy Username',
		name: 'custom_proxy_username',
		type: 'string',
		default: '',
		description: 'Username for custom proxy authentication',
	},
	{
		displayName: 'Custom Proxy Password',
		name: 'custom_proxy_password',
		type: 'string',
		typeOptions: { password: true },
		default: '',
		description: 'Password for custom proxy authentication',
	},
];

