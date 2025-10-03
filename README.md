# AssetWave Chat + Code-In Integration

A Next.js application demonstrating AI chat with tool usage and **Code-In (IQ 6900)** integration - the on-chain Solana database system. Built for asset management with decentralized storage and 2000x cost reduction.

## 🎯 START HERE

**What is this?**
- Chat interface with AI tool usage (calculator, time, asset queries)
- Code-In integration ready (placeholder tools for IQ team to implement)
- Stores encrypted asset inventory + transaction history on Solana

**For Users:**
1. `bun install && cp env.example .env.local`
2. Add your OpenAI API key to `.env.local`
3. `bun dev` → Visit http://localhost:3000

**For IQ Team:**
- See **[CODE_IN_INTEGRATION.md](./CODE_IN_INTEGRATION.md)** for implementation guide
- 5 placeholder tools in `lib/chat/tools/code-in-tools.ts`
- TypeScript types in `lib/chat/types.ts`
- Implement: Code-In SDK, wallet connection, encryption, timeline

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
bun install
```

### 2. Set Up Environment Variables

```bash
cp env.example .env.local
```

Add your OpenAI API key

### 3. Run Development Server

```bash
bun dev
```

Visit `http://localhost:3000` and click "Try Chat Demo" to test the chat interface.

## 📁 Project Structure

```
merge-iq/
├── app/
│   ├── api/chat/
│   │   └── route.ts                    # API endpoint with agent
│   ├── chat/
│   │   └── page.tsx                    # Chat page
│   └── page.tsx                        # Landing page
├── lib/
│   └── chat/
│       ├── agents/
│       │   └── demo-agent.ts           # Agent configuration with tools
│       ├── components/
│       │   ├── chat-interface.tsx      # Main chat component
│       │   ├── message-list.tsx        # Message display with tool rendering
│       │   └── message-input.tsx       # Input field
│       ├── hooks/
│       │   └── use-simple-chat.ts      # Chat hook wrapper
│       ├── tools/
│       │   ├── demo-tools.ts           # 5 demo tools (calc, time, assets)
│       │   └── code-in-tools.ts        # Code-In integration tools (IQ team)
│       └── types.ts                    # TypeScript types + Code-In types
├── CODE_IN_INTEGRATION.md              # Code-In integration guide for IQ team
├── INTEGRATION_GUIDE.md                # How to add your tools
├── ENV_SETUP.md                        # Environment setup
└── README.md                           # This file
```

## ✅ Completed Implementation

### Step 1 & 2: Chat Foundation ✅
- ✅ Full chat UI with message display
- ✅ User and AI message rendering with avatars
- ✅ Streaming responses from OpenAI
- ✅ Proper UIMessage handling

### Step 3 & 4: Tools + Visual Display ✅
- ✅ **Calculator Tool** - Math operations (add, subtract, multiply, divide)
- ✅ **Time Tool** - Get current date/time with timezone support
- ✅ **Asset Search Tool** - Demo integration with asset management
- ✅ **Asset Statistics Tool** - Demo analytics integration
- ✅ **Natural Language Query Tool** - AI-powered query generation using `generateObject()`
- ✅ **Tool Execution Display** - Shows tool name, parameters, and results
- ✅ **Visual Indicators** - Icons for tool status (in-progress, complete)
- ✅ **Agent Pattern** - Proper Experimental_Agent implementation

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router)
- **AI SDK**: Vercel AI SDK v5
- **Model Provider**: OpenAI (`gpt-4o-mini`)
- **Styling**: Tailwind CSS
- **Package Manager**: Bun
- **TypeScript**: Full type safety

## 🎯 Features

- ✅ Real-time streaming chat responses
- ✅ Clean message display with user/AI distinction
- ✅ **5 Demo Tools** showing integration patterns
- ✅ **AI-Powered Natural Language Queries** using `generateObject()`
- ✅ Visual tool call display with parameters and results
- ✅ Agent-based architecture (Experimental_Agent)
- ✅ Responsive design
- ✅ Full type safety

## 💡 Try These Prompts

Once running, try asking:
- "What is 42 times 13?"
- "What time is it in Tokyo?"
- "Search for Apple devices"
- "How many assets do we have by manufacturer?"
- "What's the total cost of all Dell laptops?" ← **Natural Language Query!**
- "Show me average asset value by status" ← **AI converts to structured query!**
- "Calculate 150 divided by 3, then search for Dell"

Watch how the AI uses tools and displays results!

## 🔗 Code-In Integration (IQ 6900)

### **What is Code-In?**

Code-In is an on-chain Solana database system that enables:
- ✅ **2000x cost reduction** vs traditional on-chain storage
- ✅ **Fast retrieval** via DB PDA (Program Derived Address)
- ✅ **Full on-chain reliability** using state updates
- ✅ **Transaction history** via linked list structure
- ✅ **Split compression** for large text data

### **Integration Status**

- ✅ Architecture: Tanstack Query (React Native compatible)
- ✅ Tools: 5 placeholder tools with types
- ✅ Docs: Complete integration guide
- 🔨 IQ Team: Code-In SDK, wallet, encryption, timeline

### **What Gets Stored on Code-In:**

1. **Asset Inventory** - Complete asset records stored on Solana
2. **Transaction History** - All asset changes tracked as timeline events

### **For IQ Team:**

See **[CODE_IN_INTEGRATION.md](./CODE_IN_INTEGRATION.md)** for:
- Data structures & TypeScript types
- 5 Code-In tools (query, store, update, history, search)
- Encryption requirements (wallet private key)
- Timeline visualization component
- Testing checklist

## 📚 Docs

- **[CODE_IN_INTEGRATION.md](./CODE_IN_INTEGRATION.md)** - Complete integration guide (tools, encryption, timeline, examples)

