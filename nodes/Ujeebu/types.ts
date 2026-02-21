/**
 * Ujeebu API Types
 *
 * This file contains all TypeScript interfaces and types used throughout
 * the Ujeebu n8n node integration.
 */

// ==================== Common Types ====================

export interface UjeebuApiCredentials {
	apiKey: string;
	baseUrl: string;
}

export interface UjeebuErrorResponse {
	url?: string;
	message?: string;
	error_code?: number;
	errors?: Record<string, string>[];
}

// ==================== Extract API Types ====================

export interface ExtractParams {
	url: string;
	raw_html?: string;
	js?: boolean | 'auto';
	text?: boolean;
	html?: boolean;
	media?: boolean;
	feeds?: boolean;
	images?: boolean;
	author?: boolean;
	pub_date?: boolean;
	partial?: number | string;
	is_article?: boolean;
	quick_mode?: boolean;
	strip_tags?: string;
	timeout?: number;
	js_timeout?: number;
	scroll_down?: boolean;
	scroll_wait?: number;
	wait_until?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit';
	image_analysis?: boolean;
	min_image_width?: number;
	min_image_height?: number;
	proxy_type?: string;
	proxy_country?: string;
}

export interface Article {
	url?: string;
	canonical_url?: string | null;
	title?: string | null;
	text?: string | null;
	html?: string | null;
	summary?: string | null;
	image?: string | null;
	images?: string[] | null;
	media?: string[] | null;
	language?: string | null;
	author?: string | null;
	pub_date?: string | null;
	modified_date?: string | null;
	site_name?: string | null;
	favicon?: string | null;
	encoding?: string | null;
}

export interface ExtractResponse {
	article?: Article;
	time?: number;
	js?: boolean;
	pagination?: boolean;
}

// ==================== Scrape API Types ====================

export type ScrapeResponseType = 'html' | 'raw' | 'pdf' | 'screenshot';
export type ProxyType = 'rotating' | 'advanced' | 'premium' | 'residential' | 'mobile' | 'custom';
export type DeviceType = 'desktop' | 'mobile';
export type WaitUntilType = 'load' | 'domcontentloaded' | 'networkidle' | 'commit';

export interface ScrapeParams {
	url: string;
	response_type?: ScrapeResponseType;
	json?: boolean;
	useragent?: string;
	cookies?: string;
	timeout?: number;
	js?: boolean;
	js_timeout?: number;
	custom_js?: string;
	wait_for?: string | number;
	wait_for_timeout?: number;
	screenshot_fullpage?: boolean;
	screenshot_partial?: string;
	scroll_down?: boolean;
	scroll_wait?: number;
	progressive_scroll?: boolean;
	scroll_percent?: number;
	scroll_callback?: string;
	scroll_to_selector?: string;
	proxy_type?: ProxyType;
	proxy_country?: string;
	auto_proxy?: boolean;
	session_id?: string;
	device?: DeviceType;
	window_width?: number;
	window_height?: number;
	block_ads?: boolean;
	block_resources?: boolean;
	extract_rules?: string;
	strip_tags?: string;
	http_method?: 'GET' | 'POST' | 'PUT';
	post_data?: string;
	custom_proxy?: string;
	custom_proxy_username?: string;
	custom_proxy_password?: string;
	wait_until?: WaitUntilType;
}

export interface ScrapeHtmlResponse {
	html?: string;
	html_source?: string;
}

export interface ScrapePdfResponse {
	pdf: string; // Base64 encoded
}

export interface ScrapeScreenshotResponse {
	screenshot: string; // Base64 encoded
}

export interface ScrapeExtractRulesResponse {
	result: Record<string, unknown>;
}

export type ScrapeResponse =
	| string
	| ScrapeHtmlResponse
	| ScrapePdfResponse
	| ScrapeScreenshotResponse
	| ScrapeExtractRulesResponse;

// ==================== SERP API Types ====================

export type SerpSearchType = 'search' | 'images' | 'news' | 'videos' | 'maps';
export type SerpDeviceType = 'desktop' | 'mobile' | 'tablet';

export interface SerpParams {
	url?: string;
	search?: string;
	search_type?: SerpSearchType;
	lang?: string;
	location?: string;
	device?: SerpDeviceType;
	results_count?: number;
	page?: number;
	extra_params?: string;
}

export interface SerpMetadata {
	google_url: string;
	number_of_results?: number;
	query_displayed: string;
	results_time?: string;
}

export interface SerpPagination {
	google: {
		current: string;
		next: string;
		other_pages: Record<string, string>;
	};
	api: {
		current: string;
		next: string;
		other_pages: Record<string, string>;
	};
}

export interface SerpOrganicResult {
	cite?: string;
	link: string;
	position?: number;
	site_name?: string;
	title: string;
	description?: string;
}

export interface SerpKnowledgeGraph {
	[key: string]: string | undefined;
	title?: string;
	type?: string;
}

export interface SerpNewsResult {
	date?: string;
	description?: string;
	favicon?: string;
	image?: string;
	link: string;
	position: number;
	siteName?: string;
	title: string;
}

export interface SerpVideoResult {
	author?: string;
	date?: string;
	description?: string;
	position?: number;
	provider?: string;
	site?: string;
	summary?: string;
	title: string;
	url: string;
}

export interface SerpImageResult {
	google_thumbnail?: string;
	height?: number;
	image: string;
	link: string;
	position?: number;
	source?: string;
	title?: string;
	width?: number;
}

export interface SerpMapResult {
	address?: string;
	category?: string;
	cid?: string;
	opening_hours?: string | null;
	position?: number;
	rating?: number;
	reviews?: number;
	title?: string;
}

export interface SerpSearchResponse {
	metadata: SerpMetadata;
	pagination: SerpPagination;
	knowledge_graph?: SerpKnowledgeGraph;
	organic_results: SerpOrganicResult[];
	related_questions?: string[];
	top_stories?: unknown[];
	videos?: unknown[];
}

export interface SerpNewsResponse {
	metadata: SerpMetadata;
	pagination: SerpPagination;
	news: SerpNewsResult[];
}

export interface SerpVideosResponse {
	metadata: SerpMetadata;
	pagination: SerpPagination;
	videos: SerpVideoResult[];
}

export interface SerpImagesResponse {
	metadata: SerpMetadata;
	pagination: SerpPagination;
	images: SerpImageResult[];
	suggestions?: unknown[];
}

export interface SerpMapsResponse {
	metadata: SerpMetadata;
	pagination: SerpPagination;
	maps_results: SerpMapResult[];
}

export type SerpResponse =
	| SerpSearchResponse
	| SerpNewsResponse
	| SerpVideosResponse
	| SerpImagesResponse
	| SerpMapsResponse;

// ==================== Account Types ====================

export interface AccountResponse {
	balance: number;
	days_till_next_billing: number;
	next_billing_date: string | null;
	plan: string;
	quota: string;
	concurrent_requests: number;
	total_requests: number;
	used: number;
	used_percent: number;
	userid: string;
}

