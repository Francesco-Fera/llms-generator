# LLMS Generator

A web application that automatically generates `llms.txt` files from any website's sitemap. Built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 What is LLMS Generator?

LLMS Generator is a free, no-code tool that helps website owners create `llms.txt` files for LLM (Large Language Model) SEO compliance. Simply provide your website's sitemap URL, and the tool will:

- Crawl your website pages
- Extract titles and descriptions
- Categorize content by sections
- Generate a properly formatted `llms.txt` file
- Provide real-time progress tracking

## ✨ Features

- **Automatic Content Extraction**: Fetches and parses HTML content from your website pages
- **Smart Categorization**: Automatically categorizes pages into logical sections (Home, About, Services, Blog, etc.)
- **Real-time Progress**: Live progress tracking with detailed status updates
- **Configurable Options**: Customize concurrency, priority thresholds, and content filtering
- **Modern UI**: Clean, responsive interface built with Tailwind CSS and ShadcnUI
- **Free & Open Source**: No registration required, completely free to use

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4, ShadcnUI components
- **Content Processing**: Cheerio (HTML parsing), Sitemapper (sitemap fetching)
- **Deployment**: Ready for Vercel, Netlify, or any Next.js hosting platform

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/llms-generator.git
cd llms-generator
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## 📖 How to Use

1. **Enter Sitemap URL**: Provide your website's sitemap URL (e.g., `https://example.com/sitemap.xml`)

2. **Configure Options** (Optional):

   - **Concurrency**: Number of simultaneous requests (default: 8)
   - **Priority Threshold**: Minimum priority for pages to include (default: 0.3)
   - **Include/Exclude Paths**: Filter specific URL patterns
   - **Custom Title/Description**: Override auto-generated site metadata

3. **Generate**: Click "Generate LLMS.txt" and watch the real-time progress

4. **Download**: Once complete, download your generated `llms.txt` file

## 🔧 Configuration Options

### Default Settings

```typescript
const DEFAULT_CONFIG = {
  concurrency: 8, // Simultaneous requests
  priorityThreshold: 0.3, // Minimum page priority
  requestTimeout: 10000, // Request timeout in ms
  userAgent: "Mozilla/5.0 (compatible; LLMS-txt-Generator/1.0)",
};
```

### Content Categories

The tool automatically categorizes pages into these sections:

- **Home**: Main landing pages
- **About**: Company information, team, mission
- **Services**: Products, pricing, solutions
- **Guides**: Tutorials, documentation, how-to content
- **Blog**: Articles, news, updates
- **Contact**: Support, help, contact forms
- **Legal**: Privacy policy, terms of service
- **Resources**: Downloads, tools, assets

## 📁 Project Structure

```
llms-generator/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── parse/         # Sitemap processing endpoint
│   ├── page.tsx           # Main page component
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── common/           # Shared components
│   ├── features/         # Feature-specific components
│   ├── forms/            # Form components
│   ├── layout/           # Layout components
│   └── ui/               # UI primitives (Shadcn UI)
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and types
│   ├── constants.ts      # Configuration constants
│   ├── sitemap-processor.ts  # Core processing logic
│   ├── types.ts          # TypeScript type definitions
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

## 🔌 API Endpoint

The application exposes a single API endpoint for processing sitemaps:

### POST `/api/parse`

**Request Body:**

```typescript
{
  sitemapUrl: string;
  options?: {
    concurrency?: number;
    includePaths?: string[];
    excludePaths?: string[];
    customTitle?: string;
    customDescription?: string;
    priorityThreshold?: number;
  };
}
```

**Response:** Server-sent events stream with progress updates and final result.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [ShadcnUI](https://www.radix-ui.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide React](https://lucide.dev/)

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/Francesco-Fera/llms-generator/issues) page
2. Create a new issue if your problem isn't already addressed
3. Join our community discussions

---

**Made with ❤️ for the LLM SEO community**
