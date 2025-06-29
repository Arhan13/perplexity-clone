# Perplexity Clone - Setup Instructions

## 🚀 Quick Setup (5 minutes)

### 1. Get API Keys

#### Tavily API Key (Required)

1. Go to [https://app.tavily.com](https://app.tavily.com)
2. Sign up for free (1,000 searches/month)
3. Copy your API key (starts with `tvly-`)

#### OpenAI API Key (Required)

1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy your key (starts with `sk-`)

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# Required API Keys
TAVILY_API_KEY=tvly-your-actual-key-here
OPENAI_API_KEY=sk-your-actual-key-here
```

### 3. Start the Application

The dev server should already be running. If not:

```bash
pnpm dev
```

### 4. Open the App

Visit [http://localhost:3000](http://localhost:3000)

## ✨ Features

- **Live Search Updates**: Real-time status during search
- **Multiple Sources**: Gets 15 high-quality sources via Tavily
- **AI Synthesis**: GPT-4o analyzes sources and provides comprehensive answers
- **Inline Citations**: Proper citation format [1], [2], etc.
- **Streaming Response**: Real-time AI response generation
- **Clean UI**: Perplexity-style interface with shadcn/ui

## 🧪 Testing

### 1. Test API Configuration

- Visit [localhost:3000/api/test](http://localhost:3000/api/test)
- Should show both API keys as "Configured"

### 2. Test Search Queries

Try these queries:

- "What are the latest developments in AI?"
- "How does quantum computing work?"
- "What happened in the news today?"

### 3. Debug Streaming Issues

- Open browser dev tools (F12) → Console tab
- Look for debug logs showing received streaming data
- Check Network tab for API call responses

### 4. Fallback for Streaming Issues

If AI response doesn't appear:

- Edit `src/app/api/chat/route.ts` line 21
- Change `useStreaming = true` to `useStreaming = false`
- This uses non-streaming fallback for debugging

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── search/     # Tavily search integration
│   │   └── chat/       # OpenAI streaming response
│   ├── page.tsx        # Main search interface
│   └── layout.tsx      # App layout
├── components/
│   ├── search-interface.tsx  # Main search component
│   └── ui/            # shadcn/ui components
└── lib/
    └── utils.ts       # Utility functions
```

## 🔧 Troubleshooting

1. **No search results**: Check your Tavily API key
2. **No AI response**: Check your OpenAI API key
3. **CORS errors**: Make sure you're using `.env.local` (not `.env`)
4. **TypeScript errors**: Run `pnpm build` to check for issues

## 🚀 Next Steps

- Add query reframing
- Implement Firecrawl for better content extraction
- Add conversation history
- Enhance citation formatting
- Add image search results
