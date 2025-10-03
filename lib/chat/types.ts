import type { UIMessage } from 'ai'

export type ChatMessage = UIMessage

export interface ToolInvocation {
  toolCallId: string
  toolName: string
  args: Record<string, unknown>
  result?: unknown
  state: 'call' | 'result' | 'partial-call'
}

// ============================================
// Code-In (IQ 6900) Type Definitions
// ============================================

/**
 * Asset record stored on Code-In (Solana blockchain)
 */
export interface CodeInAsset {
  // Core Asset Data
  id: string
  name: string
  model: string
  manufacturer: string
  status: 'active' | 'maintenance' | 'inactive' | 'retired'

  // Financial Data
  purchase_cost: number
  current_value: number
  currency: string

  // Dates
  purchase_date: string
  warranty_expiry?: string
  created_at: string
  updated_at: string

  // Location & Assignment
  location?: string
  assigned_to?: string
  department?: string

  // Metadata
  tags?: string[]
  notes?: string

  // Code-In Specific
  db_pda: string
  tail_txid: string
  datatype: 'asset_record'
  compression_offset?: number
}

/**
 * Transaction history record for asset changes
 */
export interface CodeInTransaction {
  // Transaction Identity
  tx_id: string
  timestamp: string
  block_height: number

  // Asset Reference
  asset_id: string

  // Change Tracking
  action: 'created' | 'updated' | 'status_changed' | 'transferred' | 'retired'
  field_changed?: string
  old_value?: any
  new_value?: any

  // Actor Information
  wallet_address: string
  actor_name?: string

  // Linked List Structure
  previous_tx_id?: string
  next_tx_id?: string

  // Code-In Specific
  db_pda: string
  datatype: 'transaction_record'
}

/**
 * Timeline event for UI display
 */
export interface TimelineEvent {
  // Display Information
  id: string
  timestamp: string
  title: string
  description: string

  // Event Details
  action: string
  actor: string

  // Change Details
  changes?: {
    field: string
    from: any
    to: any
  }[]

  // Metadata
  tx_id: string
  block_height: number

  // UI Styling
  icon?: string
  color?: 'success' | 'warning' | 'danger' | 'primary'
}
