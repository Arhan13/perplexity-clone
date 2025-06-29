# Hanover Park Perplexity Clone - Architecture Documentation

## 🏗️ **Project Structure**

The application has been refactored using senior-level engineering practices with proper separation of concerns, modular components, and clean code organization.

### **Directory Structure**

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   │   ├── chat/          # AI chat endpoint
│   │   ├── search/        # Search endpoint with domain filtering
│   │   └── test/          # Test endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # UI components
│   ├── ui/               # shadcn/ui base components
│   │   ├── avatar.tsx
│   │   ├── progress.tsx
│   │   └── separator.tsx
│   ├── historical-message.tsx  # Individual message with tabs
│   ├── search-interface.tsx    # Main search interface
│   ├── search-step.tsx         # Individual search step (inline display)
│   └── source-card.tsx         # Source result card with numbering
├── hooks/                 # Custom React hooks
│   └── use-search.ts       # Search logic and state management
├── types/                 # TypeScript type definitions
│   └── search.ts          # All search-related types including images
├── utils/                 # Utility functions
│   ├── citations.ts       # Citation preprocessing
│   └── helpers.ts         # General helper functions
└── lib/
    └── utils.ts           # shadcn/ui utilities
```

## 🧩 **Component Architecture**

### **1. search-interface.tsx** - Main Container

- **Purpose**: Root component that orchestrates the entire search experience
- **Dependencies**: Uses `useSearch` hook for state management
- **Features**:
  - Conversational chat interface
  - Domain filtering dropdown with 5 preset options
  - Tab management for current search (Perplexity Clone, Sources, Images)
  - Inline search steps during active search
  - Welcome screen for new users
  - Fixed input at bottom with domain selector

### **2. historical-message.tsx** - Completed Conversations

- **Purpose**: Displays completed conversations with full tab interface
- **Features**:
  - Independent tab state per message
  - Perplexity Clone/Sources/Images tabs
  - Citation click handling
  - Markdown rendering with custom components
  - Image grid display with descriptions
  - Saved domain selection per message

### **3. search-step.tsx** - Enhanced Step Display

- **Purpose**: Shows individual search steps with rich details (inline only)
- **Features**:
  - Status indicators (pending/active/completed)
  - Animated progress for active steps
  - Detailed completion summaries
  - Duration tracking
  - Source previews
  - Real-time updates during search process

### **4. source-card.tsx** - Source Result Display

- **Purpose**: Reusable component for displaying search results with clear numbering
- **Features**:
  - Compact and full display modes
  - Numbered blue badges for citation mapping
  - Domain favicons with fallback to domain initial
  - Domain highlighting
  - Clickable external links
  - Proper z-index handling for overlays

## 🔧 **Hooks & State Management**

### **use-search.ts** - Core Search Logic

- **Purpose**: Centralized search state and operations
- **Features**:
  - Complete search workflow management
  - Domain filtering with preset options
  - Image search integration
  - Step tracking with timing details
  - Streaming response handling
  - Conversation history management
  - Enhanced error handling

**Key Functions**:

- `handleSearch()` - Main search orchestration with domain filtering
- `updateSearchStep()` - Dynamic step updates with details
- `initializeSearchSteps()` - Step initialization with timing
- `updateQuery()` - Query state management
- `updateSelectedDomain()` - Domain filter management

**Domain Options**:

- 🌐 All Web - Search entire internet
- 🟠 Reddit - Reddit communities
- 📰 News Sites - Major publications (CNN, BBC, Reuters, AP News, NPR)
- 🎓 Academic - Research sources (Scholar, arXiv, PubMed, JSTOR)
- 💻 Tech Sites - Technology websites (Stack Overflow, GitHub, TechCrunch)

## 📊 **Enhanced Step Details**

Each search step now provides comprehensive information (displayed inline during search):

### **Step 1: Searching the web**

- Query processed with domain filtering
- Number of sources found
- Search depth configuration (advanced)
- Processing time and selected domain

### **Step 2: Reading sources**

- Source analysis summary
- Content extraction details
- Top sources preview with domain icons
- Source ranking information
- Image processing status

### **Step 3: Generating response**

- Response length metrics
- Model information (GPT-4o)
- Citation processing status
- Markdown formatting confirmation
- Image integration status

## 🎯 **Type Safety**

### **search.ts** - Complete Type Definitions

```typescript
interface SearchImage {
  url: string;
  description?: string;
}

interface DomainOption {
  id: string;
  name: string;
  domains: string[];
  description: string;
  icon: string;
}

interface SearchStep {
  id: string;
  title: string;
  status: "pending" | "active" | "completed";
  description?: string;
  sources?: SearchResult[];
  details?: {
    duration?: number;
    sourcesFound?: number;
    responseLength?: number;
    startTime?: number;
    endTime?: number;
  };
}

interface Message {
  id: string;
  query: string;
  results: SearchResult[];
  images: SearchImage[];
  aiResponse: string;
  searchSteps: SearchStep[];
  selectedDomain: DomainOption;
  timestamp: Date;
}
```

## 🛠️ **API Integrations**

### **Tavily Search API** - Enhanced Features

- **Domain Filtering**: `include_domains` parameter for targeted search
- **Image Search**: `include_images` and `include_image_descriptions` enabled
- **Search Depth**: Advanced (2 API credits) for better results
- **Max Results**: 15 sources per search
- **Content**: Raw content extraction for better AI responses

### **OpenAI API** - Streaming Integration

- **Model**: GPT-4o for optimal performance
- **Context**: Search results, images, and conversation history
- **Citations**: Automatic [1], [2], [3] generation with source mapping
- **Streaming**: Real-time response generation with proper parsing

## 🎨 **UI/UX Enhancements**

### **Three-Tab System**

- **🔮 Perplexity Clone**: AI response with inline search steps during active search
- **🌐 Sources**: Numbered source cards with favicons and domain info
- **🖼️ Images**: Responsive grid with descriptions and click-to-open functionality

### **Domain Filtering Interface**

- **Dropdown Selector**: Above search input with 5 preset options
- **Visual Indicators**: Emoji icons and descriptions for each domain
- **Persistent Selection**: Choice saved with each conversation
- **Real-time Updates**: Instant filtering without page refresh

### **Source Card Numbering**

- **Blue Badges**: Prominent numbered badges (1, 2, 3...)
- **Citation Mapping**: Direct correspondence to [1], [2] in AI responses
- **Favicon Integration**: Domain favicons with fallback to domain initials
- **Proper Layering**: No z-index conflicts with fixed elements

### **Image Search Display**

- **Responsive Grid**: 2 columns mobile, 3 columns desktop
- **Interactive Images**: Click to open full-size in new tab
- **Descriptions**: AI-generated descriptions when available
- **Error Handling**: Graceful fallback for broken image links
- **Conversation History**: Images saved with each search

## 🚀 **Performance Optimizations**

1. **Component Modularity**: Smaller, focused components with kebab-case naming
2. **Custom Hooks**: Separated logic from UI with proper TypeScript
3. **Efficient API Calls**: Combined search and image requests
4. **Smart State Management**: Clear state after search completion to prevent duplicates
5. **Image Optimization**: Next.js Image component with remote patterns
6. **Streaming Responses**: Real-time AI response display

## 🔄 **Data Flow**

```
User Input → Domain Selection → useSearch Hook → Tavily API (with domains) → State Updates
     ↓                                    ↓                                        ↓
Search Steps (Inline) → OpenAI API → Citation Processing → Component Re-renders
     ↓                        ↓                   ↓                    ↓
Image Grid Display ← Source Cards ← Conversation History ← Real-time Updates
```

## 🧪 **Development Benefits**

1. **Maintainability**: Clear separation of concerns with kebab-case consistency
2. **Testability**: Isolated components and hooks
3. **Reusability**: Modular component design with proper props
4. **Scalability**: Easy to extend with new domains and features
5. **Developer Experience**: Better code organization and comprehensive TypeScript
6. **User Experience**: Inline steps, domain filtering, and rich media integration

## 📈 **Recent Enhancements**

### **Steps Tab Removal**

- Steps now display inline during search in Perplexity tab
- Cleaner interface with focused functionality
- Better user flow without tab switching during search

### **Domain Filtering System**

- 5 preset domain categories for targeted search
- Tavily API integration with `include_domains` parameter
- Persistent domain selection across conversations

### **Image Search Integration**

- Visual results with AI-generated descriptions
- Responsive grid layout with hover effects
- Click-to-open functionality for full-size viewing
- Complete conversation history including images

### **Source Numbering Enhancement**

- Prominent blue badges for clear citation mapping
- Side-by-side layout (number + favicon) without z-index issues
- Improved user comprehension of citation sources

## 🏗️ **Future Enhancements**

The modular architecture makes it easy to add:

- Additional domain categories (social media, government, etc.)
- Custom domain input for advanced users
- Image search filters (size, type, color)
- Export functionality for conversations
- User authentication and saved searches
- Real-time collaboration features
- Search analytics and insights

This architecture follows industry best practices and provides a solid foundation for scaling the application while maintaining excellent user experience and developer productivity.
