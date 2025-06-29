# Perplexity Clone

A modern AI-powered search engine that combines web search with intelligent responses, built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Search Experience

- **Conversational Interface** - Chat-style layout with user queries and AI responses
- **Real-time Search** - Live web search with progress indicators and status updates
- **Streaming AI Responses** - GPT-4o powered responses with real-time streaming
- **Smart Citations** - Clickable citation links that open source websites
- **Search History** - Complete conversation history with persistent tabs

### Advanced Search Capabilities

- **Domain Filtering** - Search specific domains or the entire web:
  - 🌐 All Web - Search across the entire internet
  - 🟠 Reddit - Reddit discussions and communities
  - 📰 News Sites - Major news publications (CNN, BBC, Reuters, AP News, NPR)
  - 🎓 Academic - Academic papers and research (Scholar, arXiv, PubMed, JSTOR)
  - 💻 Tech Sites - Technology websites (Stack Overflow, GitHub, TechCrunch, Ars Technica, Wired)

### Rich Media Integration

- **Image Search** - Visual results with AI-generated descriptions
- **Source Cards** - Rich source previews with favicons and numbered citations
- **Responsive Grid Layout** - Optimized for mobile and desktop viewing

### User Experience

- **Three-Tab Interface** - Perplexity Clone, Sources, and Images tabs
- **Inline Search Steps** - Real-time progress updates during search process
- **Error Handling** - Graceful fallbacks for failed requests and broken images
- **Accessibility** - ARIA labels, keyboard navigation, and screen reader support

## 🛠 Tech Stack

- **Framework**: Next.js 15.3.4 with App Router and Turbopack
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS v4 with dark mode support
- **UI Components**: shadcn/ui (Radix UI primitives)
- **AI Integration**: OpenAI GPT-4o with streaming
- **Search API**: Tavily Search API with advanced features
- **Image Handling**: Next.js Image component with remote patterns
- **State Management**: React hooks with custom useSearch hook
- **Markdown**: react-markdown with GitHub Flavored Markdown

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- pnpm (recommended) or npm/yarn
- OpenAI API key
- Tavily API key

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
OPENAI_API_KEY=your_openai_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
```

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd hanover-park
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**

   ```bash cp .env.example .env.local
   # Add your API keys to .env.local
   ```

4. **Run the development server**

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts        # OpenAI streaming API endpoint
│   │   └── search/route.ts      # Tavily search API endpoint
│   ├── globals.css              # Global styles and Tailwind imports
│   ├── layout.tsx               # Root layout with metadata
│   └── page.tsx                 # Main application page
├── components/
│   ├── ui/                      # shadcn/ui components
│   │   ├── avatar.tsx
│   │   ├── progress.tsx
│   │   └── separator.tsx
│   ├── historical-message.tsx   # Individual message display
│   ├── search-interface.tsx     # Main search orchestrator
│   ├── search-step.tsx          # Search progress steps
│   └── source-card.tsx          # Source result cards
├── hooks/
│   └── use-search.ts           # Custom search state management
├── types/
│   └── search.ts               # TypeScript interfaces
└── utils/
    ├── citations.ts            # Citation preprocessing
    └── helpers.ts              # Utility functions
```

## 🔧 API Integrations

### Tavily Search API

- **Search Depth**: Advanced (2 API credits per request)
- **Max Results**: 15 sources per search
- **Features**: Domain filtering, image search, raw content extraction
- **Rate Limiting**: Built-in error handling and retries

### OpenAI API

- **Model**: GPT-4o for optimal performance
- **Streaming**: Real-time response generation
- **Context**: Includes search results and conversation history
- **Citations**: Automatic citation generation with source linking

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

### Environment Variables for Production

```bash
OPENAI_API_KEY=your_production_openai_key
TAVILY_API_KEY=your_production_tavily_key
```

### Build Command

```bash
pnpm build
pnpm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Tavily](https://tavily.com/) for the search API
- [OpenAI](https://openai.com/) for GPT-4o
- [shadcn/ui](https://ui.shadcn.com/) for the component library
- [Vercel](https://vercel.com/) for Next.js and deployment platform
