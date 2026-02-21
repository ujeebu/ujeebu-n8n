# n8n-nodes-ujeebu

This is an n8n community node package that provides integration with [Ujeebu API](https://ujeebu.com) for web scraping, article extraction, and Google SERP (Search Engine Results Page) retrieval.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Ujeebu](https://ujeebu.com) provides powerful APIs for web scraping, content extraction, and search engine results.

## Table of Contents

- [Installation](#installation)
- [Operations](#operations)
  - [Extract API](#extract-api)
  - [Scrape API](#scrape-api)
  - [SERP API](#serp-api)
- [Credentials](#credentials)
- [Usage Examples](#usage-examples)
- [Resources](#resources)
- [Development](#development)
- [License](#license)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### npm

```bash
npm install n8n-nodes-ujeebu
```

### Manual Installation

1. Go to **Settings > Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-ujeebu` in the npm package name field
4. Agree to the risks of using community nodes
5. Select **Install**

## Operations

### Extract API

The Extract API converts news or blog articles into structured JSON data.

| Operation | Description |
|-----------|-------------|
| **Article** | Extract article content (title, text, author, publish date, images, media) |

**Key Features:**
- Automatic article detection
- Author and publish date extraction
- Image and media extraction
- RSS feed discovery
- JavaScript rendering support
- Quick mode for faster processing

### Scrape API

The Scrape API provides powerful web scraping capabilities with a headless Chrome browser.

| Operation | Description |
|-----------|-------------|
| **Get HTML** | Retrieve rendered HTML of a web page |
| **Screenshot** | Capture screenshots (full page, viewport, or element) |
| **PDF** | Convert web pages to PDF documents |
| **Extract with Rules** | Extract structured data using CSS selectors |

**Key Features:**
- JavaScript rendering
- Custom user agents and cookies
- Proxy support (rotating, premium, residential, mobile)
- Wait for selectors or timeouts
- Scroll automation
- Ad blocking
- Mobile/desktop device emulation

### SERP API

The SERP API retrieves Google search results programmatically.

| Operation | Description |
|-----------|-------------|
| **Web Search** | Standard Google web search |
| **News Search** | Google News articles |
| **Image Search** | Google Images results |
| **Video Search** | Google Videos results |
| **Maps Search** | Google Maps / local business results |

**Key Features:**
- Multiple search types
- Location and language customization
- Device emulation (desktop, mobile, tablet)
- Pagination support
- Knowledge graph data

## Credentials

To use this node, you need to configure Ujeebu API credentials:

1. Sign up for a free account at [ujeebu.com/signup](https://ujeebu.com/signup)
2. Get your API key from the dashboard
3. In n8n, create new credentials of type **Ujeebu API**
4. Enter your API key

## Usage Examples

### Example 1: Extract Article Content

Extract structured content from a news article:

1. Add the **Ujeebu** node
2. Select **Extract** resource
3. Select **Article** operation
4. Enter the article URL
5. Configure options (JavaScript, images, etc.)

**Output:**
```json
{
  "article": {
    "title": "Article Title",
    "text": "Article content...",
    "author": "John Doe",
    "pub_date": "2025-01-01",
    "images": ["https://example.com/image.jpg"]
  }
}
```

### Example 2: Take Website Screenshot

Capture a full-page screenshot:

1. Add the **Ujeebu** node
2. Select **Scrape** resource
3. Select **Screenshot** operation
4. Enter the URL
5. Enable **Full Page** option
6. The screenshot is output as binary data

### Example 3: Scrape Product Data

Extract product information from an e-commerce page:

1. Add the **Ujeebu** node
2. Select **Scrape** resource
3. Select **Extract with Rules** operation
4. Enter the product page URL
5. Define extraction rules:

```json
{
  "title": { "selector": "h1.product-title", "type": "text" },
  "price": { "selector": ".price", "type": "text" },
  "image": { "selector": "img.product-image", "type": "image" },
  "description": { "selector": ".description", "type": "text" }
}
```

### Example 4: Monitor Google Search Rankings

Track search rankings for keywords:

1. Add the **Ujeebu** node
2. Select **SERP** resource
3. Select **Web Search** operation
4. Enter your search query
5. Configure location and language
6. Process organic_results to find your domain's position

### Example 5: News Monitoring Workflow

Monitor news for specific topics:

1. **Schedule Trigger** - Run every hour
2. **Ujeebu** node - SERP > News Search
3. **Filter** node - Filter by relevance
4. **Ujeebu** node - Extract > Article (for each news URL)
5. **Send Email** - Alert for important news

## API Credits

Each API operation consumes credits. Refer to [Ujeebu pricing](https://ujeebu.com/pricing) for details.

| API | Credits per Request |
|-----|---------------------|
| Extract | 5-50 (varies by options) |
| Scrape | 5-100 (varies by proxy/features) |
| SERP | 25 |

## Resources

- [Ujeebu Documentation](https://ujeebu.com/docs)
- [Extract API Docs](https://ujeebu.com/docs/extract)
- [Scrape API Docs](https://ujeebu.com/docs/scrape)
- [SERP API Docs](https://ujeebu.com/docs/serp)
- [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/)

## Development

### Prerequisites

- Node.js >= 18.10
- npm

### Setup

```bash
# Clone the repository
git clone https://github.com/ujeebu/n8n-nodes-ujeebu.git
cd n8n-nodes-ujeebu

# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Project Structure

```
├── credentials/
│   └── UjeebuApi.credentials.ts    # API credentials
├── nodes/
│   └── Ujeebu/
│       ├── Ujeebu.node.ts          # Main node definition
│       ├── types.ts                 # TypeScript interfaces
│       ├── transport/
│       │   └── index.ts            # API transport layer
│       └── actions/
│           ├── extract/            # Extract API operations
│           ├── scrape/             # Scrape API operations
│           └── serp/               # SERP API operations
├── __tests__/                      # Unit tests
├── package.json
└── README.md
```

### Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[MIT](LICENSE)

## Support

- **Documentation**: [ujeebu.com/docs](https://ujeebu.com/docs)
- **Issues**: [GitHub Issues](https://github.com/ujeebu/n8n-nodes-ujeebu/issues)
- **Email**: support@ujeebu.com
