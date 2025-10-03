# Code-In (IQ 6900) Integration Guide for IQ Team

## 🎯 Overview

This document provides the IQ team with complete specifications for integrating **Code-In**, the on-chain Solana database system, into the AssetWave chat interface. Code-In will enable decentralized storage of asset inventory and transaction history with 2000x cost reduction compared to traditional on-chain storage.

---

## 📋 Integration Scope

### **What Needs to Be Stored on Code-In:**

1. **Asset Inventory** - Complete asset records stored on-chain
2. **Transaction History** - All asset changes tracked as timeline events

### **What the IQ Team Needs to Implement:**

1. ✅ Code-In client SDK integration
2. ✅ Solana wallet connection (Phantom/Solflare)
3. ✅ Code-In tools for chat interface
4. ✅ Asset storage/retrieval via DB PDA
5. ✅ Transaction history tracking
6. ✅ Timeline query functionality

---

## 🏗️ Architecture Overview

```
┌─────────────────┐
│   User Wallet   │ ← Phantom/Solflare connection
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────────┐
│          Chat Interface (merge-iq)              │
│  ┌──────────────────────────────────────────┐  │
│  │  AI Agent + Code-In Tools                │  │
│  │  - queryAssets (from Code-In)            │  │
│  │  - storeAsset (to Code-In)               │  │
│  │  - updateAsset (state change)            │  │
│  │  - getAssetHistory (timeline)            │  │
│  └──────────────┬───────────────────────────┘  │
└─────────────────┼───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│          Tanstack Query Cache Layer             │
│  - Fast retrieval (5-60 min cache)              │
│  - Automatic refetching                          │
│  - React Native compatible                       │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│          Code-In Client SDK (IQ Team)           │
│  - DB PDA access (fast retrieval)               │
│  - State updates (not logs)                      │
│  - Split compression for large text              │
│  - Linked list for sequential access             │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│          Solana Blockchain (Code-In)            │
│  - User's DB PDA (per wallet)                   │
│  - Asset records (state updates)                 │
│  - Transaction history (linked list)             │
│  - Tail TxID + Datatype + Offset                │
└─────────────────────────────────────────────────┘
```

---

## 💾 Data Structures

### **1. Asset Record (On-Chain)**

```typescript
interface CodeInAsset {
  // Core Asset Data
  id: string                    // Unique asset identifier
  name: string                  // Asset name (e.g., "MacBook Pro 16")
  model: string                 // Model number/identifier
  manufacturer: string          // Manufacturer name
  status: 'active' | 'maintenance' | 'inactive' | 'retired'
  
  // Financial Data
  purchase_cost: number         // Original purchase cost (USD)
  current_value: number         // Current estimated value (USD)
  currency: string              // Currency code (default: 'USD')
  
  // Dates
  purchase_date: string         // ISO 8601 timestamp
  warranty_expiry?: string      // Optional warranty date
  created_at: string            // Creation timestamp
  updated_at: string            // Last update timestamp
  
  // Location & Assignment
  location?: string             // Physical location
  assigned_to?: string          // User assigned to
  department?: string           // Department/team
  
  // Metadata
  tags?: string[]               // User-defined tags
  notes?: string                // Additional notes
  
  // Code-In Specific
  db_pda: string                // DB PDA address
  tail_txid: string             // Most recent transaction ID
  datatype: 'asset_record'      // Fixed datatype for assets
  compression_offset?: number   // Offset if using split compression
}
```

### **2. Transaction History Record (On-Chain)**

```typescript
interface CodeInTransaction {
  // Transaction Identity
  tx_id: string                 // Solana transaction signature
  timestamp: string             // ISO 8601 timestamp
  block_height: number          // Solana block number
  
  // Asset Reference
  asset_id: string              // Reference to asset
  
  // Change Tracking
  action: 'created' | 'updated' | 'status_changed' | 'transferred' | 'retired'
  field_changed?: string        // Field that was updated (e.g., "status", "location")
  old_value?: any               // Previous value (null for creation)
  new_value?: any               // New value
  
  // Actor Information
  wallet_address: string        // User wallet who made the change
  actor_name?: string           // Optional human-readable name
  
  // Linked List Structure
  previous_tx_id?: string       // Previous transaction in chain
  next_tx_id?: string           // Next transaction (for sequential access)
  
  // Code-In Specific
  db_pda: string                // DB PDA address
  datatype: 'transaction_record'
}
```

### **3. Timeline Event (UI Representation)**

```typescript
interface TimelineEvent {
  // Display Information
  id: string                    // Unique event ID
  timestamp: string             // ISO 8601 timestamp
  title: string                 // Event title (e.g., "Asset Created")
  description: string           // Human-readable description
  
  // Event Details
  action: string                // Action type
  actor: string                 // Who performed the action
  
  // Change Details (for updates)
  changes?: {
    field: string
    from: any
    to: any
  }[]
  
  // Metadata
  tx_id: string                 // Solana transaction ID
  block_height: number          // Block number
  
  // UI Styling
  icon?: string                 // Icon name for timeline
  color?: 'success' | 'warning' | 'danger' | 'primary'
}
```

---

## 🛠️ Code-In Tools to Implement

Create these tools in `lib/chat/tools/code-in-tools.ts`:

### **Tool 1: Query Assets from Code-In**

```typescript
import { tool } from 'ai'
import { z } from 'zod'

export const queryCodeInAssets = tool({
  description: `Query asset inventory from Code-In (Solana on-chain database).
  Retrieves assets stored in user's DB PDA with fast access.
  Use for: "Show my assets", "Find Dell laptops", "List all active devices"`,
  
  inputSchema: z.object({
    search_query: z.string()
      .optional()
      .describe('Optional search terms (name, model, manufacturer)'),
    status: z.enum(['active', 'maintenance', 'inactive', 'retired', 'all'])
      .optional()
      .describe('Filter by asset status'),
    manufacturer: z.string()
      .optional()
      .describe('Filter by manufacturer'),
    limit: z.number()
      .optional()
      .default(20)
      .describe('Maximum results to return'),
  }),
  
  execute: async ({ search_query, status, manufacturer, limit }) => {
    // TODO: IQ Team - Implement Code-In query
    // 1. Get user's wallet address from context
    // 2. Derive DB PDA for the wallet
    // 3. Query Code-In using DB PDA for fast access
    // 4. Apply filters (search_query, status, manufacturer)
    // 5. Return results
    
    try {
      // Placeholder - Replace with actual Code-In SDK call
      const assets = await codeInClient.queryAssets({
        dbPda: userDbPda,
        filters: {
          search: search_query,
          status: status !== 'all' ? status : undefined,
          manufacturer,
        },
        limit,
      })
      
      return {
        type: 'assets_retrieved',
        message: `Found ${assets.length} asset(s)`,
        assets: assets,
        source: 'code-in',
        db_pda: userDbPda,
      }
    } catch (error) {
      return {
        type: 'error',
        message: 'Failed to query Code-In',
        error: error.message,
      }
    }
  },
})
```

### **Tool 2: Store Asset to Code-In**

```typescript
export const storeAssetToCodeIn = tool({
  description: `Store a new asset to Code-In (Solana on-chain database).
  Creates state update transaction and initializes DB PDA entry.
  Use for: "Add new laptop", "Register device", "Create asset"`,
  
  inputSchema: z.object({
    name: z.string().describe('Asset name'),
    model: z.string().describe('Model number'),
    manufacturer: z.string().describe('Manufacturer'),
    purchase_cost: z.number().describe('Purchase cost in USD'),
    status: z.enum(['active', 'maintenance', 'inactive']).default('active'),
    location: z.string().optional().describe('Physical location'),
    notes: z.string().optional().describe('Additional notes'),
  }),
  
  execute: async (assetData) => {
    // TODO: IQ Team - Implement Code-In storage
    // 1. Get user's wallet address
    // 2. Create/get DB PDA for wallet
    // 3. Generate asset ID (UUID)
    // 4. Create state update transaction (NOT logs)
    // 5. Store asset data using split compression if needed (>10KB)
    // 6. Update DB PDA with tail_txid, datatype, offset
    // 7. Create initial transaction history record
    // 8. Return success with transaction signature
    
    try {
      const result = await codeInClient.storeAsset({
        dbPda: userDbPda,
        walletAddress: userWallet.publicKey,
        assetData: {
          ...assetData,
          id: generateUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          datatype: 'asset_record',
        },
      })
      
      return {
        type: 'asset_stored',
        message: `Asset "${assetData.name}" stored on-chain`,
        asset_id: result.assetId,
        tx_signature: result.txSignature,
        db_pda: userDbPda,
        explorer_url: `https://explorer.solana.com/tx/${result.txSignature}`,
      }
    } catch (error) {
      return {
        type: 'error',
        message: 'Failed to store asset to Code-In',
        error: error.message,
      }
    }
  },
})
```

### **Tool 3: Update Asset in Code-In**

```typescript
export const updateCodeInAsset = tool({
  description: `Update an existing asset in Code-In using state changes.
  Creates new state update transaction and adds to transaction history.
  Use for: "Update asset status", "Change location", "Modify asset"`,
  
  inputSchema: z.object({
    asset_id: z.string().describe('Asset ID to update'),
    updates: z.object({
      name: z.string().optional(),
      status: z.enum(['active', 'maintenance', 'inactive', 'retired']).optional(),
      location: z.string().optional(),
      current_value: z.number().optional(),
      notes: z.string().optional(),
    }).describe('Fields to update'),
  }),
  
  execute: async ({ asset_id, updates }) => {
    // TODO: IQ Team - Implement Code-In update
    // 1. Retrieve current asset from DB PDA
    // 2. Create state update transaction with changes
    // 3. Update DB PDA tail_txid
    // 4. Create transaction history record with old/new values
    // 5. Link to previous transaction (linked list)
    // 6. Return success
    
    try {
      const result = await codeInClient.updateAsset({
        dbPda: userDbPda,
        assetId: asset_id,
        updates: {
          ...updates,
          updated_at: new Date().toISOString(),
        },
      })
      
      return {
        type: 'asset_updated',
        message: `Asset updated successfully`,
        asset_id: asset_id,
        tx_signature: result.txSignature,
        changes: result.changes,
        explorer_url: `https://explorer.solana.com/tx/${result.txSignature}`,
      }
    } catch (error) {
      return {
        type: 'error',
        message: 'Failed to update asset',
        error: error.message,
      }
    }
  },
})
```

### **Tool 4: Get Asset History Timeline**

```typescript
export const getAssetHistoryTimeline = tool({
  description: `Retrieve complete transaction history for an asset as a timeline.
  Uses linked list structure for sequential access of all changes.
  Use for: "Show asset history", "Timeline of changes", "Audit trail"`,
  
  inputSchema: z.object({
    asset_id: z.string().describe('Asset ID to get history for'),
    limit: z.number()
      .optional()
      .default(50)
      .describe('Maximum timeline events to return'),
  }),
  
  execute: async ({ asset_id, limit }) => {
    // TODO: IQ Team - Implement timeline retrieval
    // 1. Get asset's DB PDA and tail_txid
    // 2. Traverse linked list backwards from tail_txid
    // 3. Collect all transaction records
    // 4. Transform to TimelineEvent format
    // 5. Sort by timestamp (newest first)
    // 6. Return timeline events
    
    try {
      const history = await codeInClient.getAssetHistory({
        dbPda: userDbPda,
        assetId: asset_id,
        limit,
      })
      
      // Transform to timeline events
      const timeline: TimelineEvent[] = history.map(tx => ({
        id: tx.tx_id,
        timestamp: tx.timestamp,
        title: formatActionTitle(tx.action),
        description: formatActionDescription(tx),
        action: tx.action,
        actor: tx.actor_name || truncateWallet(tx.wallet_address),
        changes: tx.field_changed ? [{
          field: tx.field_changed,
          from: tx.old_value,
          to: tx.new_value,
        }] : undefined,
        tx_id: tx.tx_id,
        block_height: tx.block_height,
        icon: getActionIcon(tx.action),
        color: getActionColor(tx.action),
      }))
      
      return {
        type: 'timeline_retrieved',
        message: `Retrieved ${timeline.length} timeline event(s)`,
        asset_id: asset_id,
        timeline: timeline,
        total_events: timeline.length,
      }
    } catch (error) {
      return {
        type: 'error',
        message: 'Failed to retrieve asset history',
        error: error.message,
      }
    }
  },
})
```

### **Tool 5: Search Code-In Database**

```typescript
export const searchCodeInDatabase = tool({
  description: `Advanced search across all data in user's Code-In database.
  Supports natural language queries converted to structured searches.
  Use for: "Find all laptops over $2000", "Show retired assets", "Assets by location"`,
  
  inputSchema: z.object({
    query: z.string().describe('Natural language search query'),
  }),
  
  execute: async ({ query }) => {
    // TODO: IQ Team - Implement advanced search
    // 1. Parse natural language query (use AI if needed)
    // 2. Convert to Code-In query parameters
    // 3. Execute search across DB PDA
    // 4. Return results with relevance scoring
    
    try {
      const results = await codeInClient.search({
        dbPda: userDbPda,
        query: query,
      })
      
      return {
        type: 'search_complete',
        message: `Found ${results.length} result(s)`,
        query: query,
        results: results,
      }
    } catch (error) {
      return {
        type: 'error',
        message: 'Search failed',
        error: error.message,
      }
    }
  },
})
```

---

## 🔐 Encryption Requirements

### **Data Encryption with Wallet Private Key**

All asset data stored on Code-In **must be encrypted** before storage.

**Requirements:**
1. Encrypt data using wallet private key before storing to Code-In
2. Decrypt data after retrieval using same private key
3. Use authenticated encryption (e.g., `nacl.secretbox`)

**Implementation:**

```typescript
import nacl from 'tweetnacl'
import { decodeUTF8, encodeUTF8, encodeBase64, decodeBase64 } from 'tweetnacl-util'

// Encrypt before storing
async function encryptAssetData(data: CodeInAsset, walletPrivateKey: Uint8Array): Promise<string> {
  const nonce = nacl.randomBytes(nacl.secretbox.nonceLength)
  const message = decodeUTF8(JSON.stringify(data))
  const encrypted = nacl.secretbox(message, nonce, walletPrivateKey.slice(0, 32))
  
  return encodeBase64(nonce) + '.' + encodeBase64(encrypted)
}

// Decrypt after retrieval
async function decryptAssetData(encrypted: string, walletPrivateKey: Uint8Array): Promise<CodeInAsset> {
  const [nonceB64, encryptedB64] = encrypted.split('.')
  const nonce = decodeBase64(nonceB64)
  const encryptedData = decodeBase64(encryptedB64)
  
  const decrypted = nacl.secretbox.open(encryptedData, nonce, walletPrivateKey.slice(0, 32))
  if (!decrypted) throw new Error('Decryption failed')
  
  return JSON.parse(encodeUTF8(decrypted))
}
```

**Tool Integration:**

```typescript
// Store encrypted
execute: async (assetData) => {
  const encrypted = await encryptAssetData(assetData, wallet.privateKey)
  const result = await codeInClient.storeAsset({ encrypted })
  return result
}

// Query and decrypt
execute: async (params) => {
  const encryptedAssets = await codeInClient.queryAssets(params)
  const decrypted = await Promise.all(
    encryptedAssets.map(a => decryptAssetData(a, wallet.privateKey))
  )
  return decrypted
}
```

---

## 📊 Timeline Visualization

### **Component to Create:**

Create `lib/chat/components/asset-timeline.tsx`:

```typescript
'use client'

import { TimelineEvent } from '@/lib/types/code-in'

interface AssetTimelineProps {
  events: TimelineEvent[]
}

export function AssetTimeline({ events }: AssetTimelineProps) {
  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <div key={event.id} className="flex gap-4">
          {/* Timeline Line */}
          <div className="flex flex-col items-center">
            <div className={`w-3 h-3 rounded-full bg-${event.color}-500`} />
            {index < events.length - 1 && (
              <div className="w-0.5 flex-1 bg-gray-300 my-1" />
            )}
          </div>
          
          {/* Event Content */}
          <div className="flex-1 pb-8">
            <div className="font-semibold">{event.title}</div>
            <div className="text-sm text-gray-600">{event.description}</div>
            <div className="text-xs text-gray-400 mt-1">
              {formatTimestamp(event.timestamp)} • {event.actor}
            </div>
            
            {/* Show changes if present */}
            {event.changes && (
              <div className="mt-2 text-sm bg-gray-50 p-2 rounded">
                {event.changes.map(change => (
                  <div key={change.field}>
                    <span className="font-medium">{change.field}:</span>{' '}
                    <span className="text-red-600">{JSON.stringify(change.from)}</span>
                    {' → '}
                    <span className="text-green-600">{JSON.stringify(change.to)}</span>
                  </div>
                ))}
              </div>
            )}
            
            {/* Solana Explorer Link */}
            <a
              href={`https://explorer.solana.com/tx/${event.tx_id}`}
              target="_blank"
              className="text-xs text-blue-500 hover:underline mt-1 inline-block"
            >
              View on Explorer ↗
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleString()
}
```

The timeline will automatically display when the `getAssetHistoryTimeline` tool returns results!

---

## 🔧 Code-In SDK Setup

### **Dependencies to Install:**

```bash
bun add @solana/web3.js @solana/wallet-adapter-react @solana/wallet-adapter-wallets
```

### **Environment Variables:**

Add to `.env.local`:

```bash
# Code-In Configuration
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta  # or devnet for testing
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_CODE_IN_PROGRAM_ID=<your-code-in-program-id>
```

### **Code-In Client Setup:**

Create `lib/code-in/client.ts`:

```typescript
import { Connection, PublicKey } from '@solana/web3.js'

export class CodeInClient {
  private connection: Connection
  private programId: PublicKey
  
  constructor(rpcUrl: string, programId: string) {
    this.connection = new Connection(rpcUrl)
    this.programId = new PublicKey(programId)
  }
  
  // TODO: IQ Team - Implement Code-In methods
  
  async queryAssets(params: any) {
    // 1. Derive DB PDA from wallet address
    // 2. Fetch account data from DB PDA
    // 3. Parse assets (handle split compression if needed)
    // 4. Apply filters
    // 5. Return results
  }
  
  async storeAsset(params: any) {
    // 1. Create/get DB PDA
    // 2. Build state update transaction
    // 3. Handle split compression for large data
    // 4. Update DB PDA metadata (tail_txid, datatype, offset)
    // 5. Submit transaction
    // 6. Return signature
  }
  
  async updateAsset(params: any) {
    // 1. Fetch current asset
    // 2. Create state update with changes
    // 3. Update linked list structure
    // 4. Create transaction history record
    // 5. Submit transaction
  }
  
  async getAssetHistory(params: any) {
    // 1. Get DB PDA and tail_txid
    // 2. Traverse linked list backwards
    // 3. Collect all transaction records
    // 4. Return history
  }
  
  async search(params: any) {
    // 1. Query all assets from DB PDA
    // 2. Apply search filters
    // 3. Rank by relevance
    // 4. Return results
  }
}
```

---

## ✅ React Native Compatibility Notes

**Good News**: The chosen architecture is React Native compatible!

### **Compatible Technologies:**
- ✅ **Tanstack Query** - Full React Native support
- ✅ **@solana/web3.js** - Works in React Native
- ✅ **Wallet Adapters** - Mobile wallet support available
- ✅ **AI SDK** - React Native compatible

### **React Native Specific Considerations:**

1. **Wallet Connection**: Use `@solana/wallet-adapter-react-native` instead of web wallet adapter
2. **Storage**: Tanstack Query works identically in React Native
3. **Crypto**: May need polyfills for crypto operations
4. **Deep Linking**: For wallet connection redirects

### **Future Migration Path:**

```bash
# When moving to React Native:
npm install @solana/wallet-adapter-react-native
npm install react-native-get-random-values  # Crypto polyfill
npm install @react-native-async-storage/async-storage  # Optional persistence
```

Code changes will be minimal - primarily wallet connection UI!

---

## 🧪 Testing Checklist

### **Phase 1: Wallet Connection**
- [ ] User can connect Phantom wallet
- [ ] User can connect Solflare wallet
- [ ] Wallet address displays correctly
- [ ] Disconnect works properly
- [ ] Wallet events handled (account change, disconnect)

### **Phase 2: Asset Storage**
- [ ] Encrypt asset data with wallet private key
- [ ] Store encrypted asset to Code-In
- [ ] Asset data persists on-chain
- [ ] DB PDA created successfully
- [ ] Transaction signature returned
- [ ] Can view transaction on Explorer

### **Phase 3: Asset Queries**
- [ ] Query encrypted assets from Code-In
- [ ] Decrypt assets with wallet private key
- [ ] Filter by status works
- [ ] Search by name/model/manufacturer
- [ ] Results display in chat
- [ ] Empty state handled

### **Phase 4: Asset Updates**
- [ ] Update asset status
- [ ] Update asset location
- [ ] Update multiple fields
- [ ] Changes reflected immediately
- [ ] Transaction history created

### **Phase 5: Timeline**
- [ ] Retrieve asset history
- [ ] Timeline displays chronologically
- [ ] Shows all change details
- [ ] Actor information displays
- [ ] Links to Solana Explorer work

### **Phase 6: Integration**
- [ ] Tools work from chat interface
- [ ] AI agent calls tools correctly
- [ ] Tool results display properly
- [ ] Error handling works
- [ ] Loading states show

### **Phase 7: Performance**
- [ ] DB PDA fast retrieval (<1s)
- [ ] Split compression works for large data
- [ ] Linked list traversal efficient
- [ ] Tanstack Query caching effective
- [ ] No unnecessary refetches

---

## 📚 Resources for IQ Team

### **Code-In Documentation:**
- DB PDA design and derivation
- State update transaction format
- Split compression algorithm
- Linked list structure

### **Example Tools:**
- See `lib/chat/tools/demo-tools.ts` for tool pattern
- See `lib/chat/agents/demo-agent.ts` for agent setup
- See `app/api/chat/route.ts` for API integration

### **Solana Development:**
- [@solana/web3.js docs](https://solana-labs.github.io/solana-web3.js/)
- [Solana Cookbook](https://solanacookbook.com/)
- [Wallet Adapter docs](https://github.com/solana-labs/wallet-adapter)

### **Vercel AI SDK:**
- [Tool documentation](https://sdk.vercel.ai/docs/ai-sdk-core/tools-and-tool-calling)
- [Agent documentation](https://sdk.vercel.ai/docs/ai-sdk-core/agents)

---
