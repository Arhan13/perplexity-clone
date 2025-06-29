# Hanover Park Perplexity Clone - Architecture Documentation

## 🏗️ **Project Structure**

The application has been refactored using senior-level engineering practices with proper separation of concerns, modular components, and clean code organization.

### **Directory Structure**

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   │   ├── chat/          # AI chat endpoint
│   │   ├── search/        # Search endpoint
│   │   └── test/          # Test endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # UI components
│   ├── ui/               # shadcn/ui base components
│   │   ├── avatar.tsx
│   │   ├── progress.tsx
│   │   └── separator.tsx
│   ├── HistoricalMessage.tsx  # Individual message with tabs
│   ├── SearchInterface.tsx    # Main search interface
│   ├── SearchStep.tsx         # Individual search step
│   └── SourceCard.tsx         # Source result card
├── hooks/                 # Custom React hooks
│   └── useSearch.ts       # Search logic and state management
├── types/                 # TypeScript type definitions
│   └── search.ts          # All search-related types
├── utils/                 # Utility functions
│   ├── citations.ts       # Citation preprocessing
│   └── helpers.ts         # General helper functions
└── lib/
    └── utils.ts           # shadcn/ui utilities
```

## 🧩 **Component Architecture**

### **1. SearchInterface.tsx** - Main Container

- **Purpose**: Root component that orchestrates the entire search experience
- **Dependencies**: Uses `useSearch` hook for state management
- **Features**:
  - Conversational chat interface
  - Tab management for current search
  - Welcome screen for new users
  - Fixed input at bottom

### **2. HistoricalMessage.tsx** - Completed Conversations

- **Purpose**: Displays completed conversations with full tab interface
- **Features**:
  - Independent tab state per message
  - Perplexity/Sources/Steps tabs
  - Citation click handling
  - Markdown rendering with custom components

### **3. SearchStep.tsx** - Enhanced Step Display

- **Purpose**: Shows individual search steps with rich details
- **Features**:
  - Status indicators (pending/active/completed)
  - Animated progress for active steps
  - Detailed completion summaries
  - Duration tracking
  - Source previews

### **4. SourceCard.tsx** - Source Result Display

- **Purpose**: Reusable component for displaying search results
- **Features**:
  - Compact and full display modes
  - Numbered avatars
  - Domain highlighting
  - Clickable external links

## 🔧 **Hooks & State Management**

### **useSearch.ts** - Core Search Logic

- **Purpose**: Centralized search state and operations
- **Features**:
  - Complete search workflow management
  - Step tracking with timing details
  - Streaming response handling
  - Conversation history management
  - Enhanced error handling

**Key Functions**:

- `handleSearch()` - Main search orchestration
- `updateSearchStep()` - Dynamic step updates with details
- `initializeSearchSteps()` - Step initialization with timing
- `updateQuery()` - Query state management

## 📊 **Enhanced Step Details**

Each search step now provides comprehensive information:

### **Step 1: Searching the web**

- Query processed
- Number of sources found
- Search depth configuration
- Processing time

### **Step 2: Reading sources**

- Source analysis summary
- Content extraction details
- Top sources preview with icons
- Source ranking information

### **Step 3: Generating response**

- Response length metrics
- Model information (GPT-4o)
- Citation processing status
- Markdown formatting confirmation

## 🎯 **Type Safety**

### **search.ts** - Complete Type Definitions

```typescript
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
```

## 🛠️ **Utility Functions**

### **citations.ts** - Citation Processing

- Converts `[1]`, `[2]` to clickable markdown links
- Maintains source indexing integrity

### **helpers.ts** - General Utilities

- `getSourceIcon()` - Domain-based emoji icons
- `formatDuration()` - Human-readable time formatting
- `formatTimestamp()` - Consistent time display

## 🎨 **UI/UX Enhancements**

### **Tab System**

- **Perplexity**: AI response with embedded steps during search
- **Sources**: Clean source cards with metadata
- **Steps**: Detailed process visualization with timing

### **Responsive Design**

- Mobile-first approach
- Fixed bottom input
- Scrollable conversation history
- Proper spacing and typography

### **Visual Feedback**

- Animated progress indicators
- Status-based color coding
- Loading states and transitions
- Hover effects and interactions

## 🚀 **Performance Optimizations**

1. **Component Modularity**: Smaller, focused components
2. **Custom Hooks**: Separated logic from UI
3. **Type Safety**: Comprehensive TypeScript coverage
4. **Code Splitting**: Natural Next.js optimization
5. **Efficient Re-renders**: Proper state management

## 🔄 **Data Flow**

```
User Input → useSearch Hook → API Calls → State Updates → Component Re-renders
     ↓                              ↓                       ↓
SearchInterface ← HistoricalMessage ← Enhanced Step Details ← Real-time Updates
```

## 🧪 **Development Benefits**

1. **Maintainability**: Clear separation of concerns
2. **Testability**: Isolated components and hooks
3. **Reusability**: Modular component design
4. **Scalability**: Easy to extend with new features
5. **Developer Experience**: Better code organization and readability

## 📈 **Future Enhancements**

The modular architecture makes it easy to add:

- Additional search providers
- New response formats
- Enhanced source analysis
- User authentication
- Search history persistence
- Real-time collaboration features

This architecture follows industry best practices and provides a solid foundation for scaling the application.
