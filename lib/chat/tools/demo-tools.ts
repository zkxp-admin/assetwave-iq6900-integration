import { tool, generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'

/**
 * Demo tools for showcasing AI tool usage
 * These are simplified, stateless tools that demonstrate the pattern
 * for integration teams to follow
 */

export const demoTools = {
  // Simple calculator tool
  calculator: tool({
    description: 'Perform basic math calculations (add, subtract, multiply, divide)',
    inputSchema: z.object({
      operation: z.enum(['add', 'subtract', 'multiply', 'divide']).describe('The math operation to perform'),
      a: z.number().describe('First number'),
      b: z.number().describe('Second number'),
    }),
    execute: async ({ operation, a, b }) => {
      let result: number
      switch (operation) {
        case 'add':
          result = a + b
          break
        case 'subtract':
          result = a - b
          break
        case 'multiply':
          result = a * b
          break
        case 'divide':
          if (b === 0) {
            return {
              type: 'error',
              message: 'Cannot divide by zero',
            }
          }
          result = a / b
          break
      }
      return {
        type: 'calculation_complete',
        operation,
        operands: { a, b },
        result,
        message: `${a} ${operation === 'add' ? '+' : operation === 'subtract' ? '-' : operation === 'multiply' ? '×' : '÷'} ${b} = ${result}`,
      }
    },
  }),

  // Get current time
  getCurrentTime: tool({
    description: 'Get the current date and time',
    inputSchema: z.object({
      timezone: z.string().optional().describe('Optional timezone (e.g., "America/New_York", "UTC")'),
    }),
    execute: async ({ timezone }) => {
      const now = new Date()
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
      }

      if (timezone) {
        options.timeZone = timezone
      }

      return {
        type: 'time_retrieved',
        timestamp: now.toISOString(),
        formatted: now.toLocaleString('en-US', options),
        timezone: timezone || 'Local',
        message: `Current time: ${now.toLocaleString('en-US', options)}`,
      }
    },
  }),

  // Mock asset search (demonstrates integration pattern)
  searchAssets: tool({
    description: 'Search for IT assets in the inventory. This is a demo tool showing how asset management integrates.',
    inputSchema: z.object({
      search_query: z.string().min(1).describe('Search terms to find assets by name, model, or manufacturer'),
    }),
    execute: async ({ search_query }) => {
      // Mock data for demonstration
      const mockAssets = [
        { id: '1', name: 'MacBook Pro 16"', model: 'M3 Max', manufacturer: 'Apple', status: 'Active' },
        { id: '2', name: 'Dell XPS 15', model: 'XPS-9530', manufacturer: 'Dell', status: 'Active' },
        { id: '3', name: 'iPhone 15 Pro', model: 'A2848', manufacturer: 'Apple', status: 'Active' },
        { id: '4', name: 'Surface Laptop 5', model: 'SL5-001', manufacturer: 'Microsoft', status: 'Maintenance' },
      ]

      // Simple search filtering
      const results = mockAssets.filter(
        asset =>
          asset.name.toLowerCase().includes(search_query.toLowerCase()) ||
          asset.model.toLowerCase().includes(search_query.toLowerCase()) ||
          asset.manufacturer.toLowerCase().includes(search_query.toLowerCase())
      )

      if (results.length === 0) {
        return {
          type: 'no_assets_found',
          message: `No assets found matching "${search_query}". (This is demo data)`,
        }
      }

      return {
        type: 'assets_found',
        message: `Found ${results.length} asset(s) matching "${search_query}". (Demo data)`,
        assets: results,
        note: 'This is mock data for demonstration purposes. Real integration would connect to your asset database.',
      }
    },
  }),

  // Get asset statistics (demonstrates analytics)
  getAssetStatistics: tool({
    description: 'Get statistics about IT assets in the inventory. Demo tool for analytics integration.',
    inputSchema: z.object({
      metric: z.enum(['total_count', 'by_manufacturer', 'by_status']).describe('The statistic to retrieve'),
    }),
    execute: async ({ metric }) => {
      // Mock statistics
      const stats = {
        total_count: {
          total: 24,
          message: 'Total assets in inventory: 24 (Demo data)',
        },
        by_manufacturer: {
          data: [
            { manufacturer: 'Apple', count: 8 },
            { manufacturer: 'Dell', count: 6 },
            { manufacturer: 'Microsoft', count: 5 },
            { manufacturer: 'HP', count: 5 },
          ],
          message: 'Asset count by manufacturer (Demo data)',
        },
        by_status: {
          data: [
            { status: 'Active', count: 18 },
            { status: 'Maintenance', count: 4 },
            { status: 'Inactive', count: 2 },
          ],
          message: 'Asset count by status (Demo data)',
        },
      }

      return {
        type: 'statistics_retrieved',
        metric,
        ...stats[metric],
        note: 'This is mock data for demonstration purposes.',
      }
    },
  }),

  // Natural Language Query (demonstrates generateObject + structured output)
  queryAssetsNaturalLanguage: tool({
    description: `Advanced natural language query tool for complex asset analytics. 
    This demonstrates AI-powered query generation - converting natural language to structured queries.
    Use this for complex questions like:
    - "Show me the total cost of all Dell laptops"
    - "What's the average value of assets by manufacturer?"
    - "How many assets were purchased in the last 6 months?"
    - "Compare active vs inactive asset counts"`,
    inputSchema: z.object({
      query: z.string().min(1).describe('Natural language query about assets (e.g., "How many assets cost over $1000?", "Show total value by status")'),
    }),
    execute: async ({ query }) => {
      try {
        // Schema for structured query output
        const querySchema = z.object({
          description: z.string().describe('Brief description of what the query is finding'),
          query_type: z.enum(['count', 'sum', 'average', 'list', 'comparison']).describe('Type of analysis'),
          takeaway: z.string().describe('Main insight or takeaway from the query'),
        })

        // Use generateObject to convert natural language to structured query
        const result = await generateObject({
          model: openai('gpt-5-nano'),
          system: `You are an IT asset analytics expert. Convert natural language queries into structured query descriptions.
          
The asset database contains:
- name, model, manufacturer (text fields)
- status: Active, Inactive, Maintenance
- purchase_cost, current_value (numeric)
- purchase_date (date)
- location (text)

Analyze the user's query and describe what information they're looking for.`,
          prompt: `Convert this query into a structured description: "${query}"`,
          schema: querySchema,
        })

        // Generate mock data based on query type
        let mockData: any[] = []
        const queryType = result.object.query_type

        switch (queryType) {
          case 'count':
            mockData = [
              { category: 'Apple', count: 8 },
              { category: 'Dell', count: 6 },
              { category: 'Microsoft', count: 5 },
              { category: 'HP', count: 5 },
            ]
            break
          case 'sum':
          case 'average':
            mockData = [
              { category: 'Apple', value: 24500, count: 8 },
              { category: 'Dell', value: 15600, count: 6 },
              { category: 'Microsoft', value: 12800, count: 5 },
            ]
            break
          case 'comparison':
            mockData = [
              { category: 'Active', count: 18, percentage: 75 },
              { category: 'Maintenance', count: 4, percentage: 17 },
              { category: 'Inactive', count: 2, percentage: 8 },
            ]
            break
          case 'list':
            mockData = [
              { name: 'MacBook Pro 16"', manufacturer: 'Apple', value: 3500, status: 'Active' },
              { name: 'Dell XPS 15', manufacturer: 'Dell', value: 2200, status: 'Active' },
              { name: 'Surface Laptop 5', manufacturer: 'Microsoft', value: 1800, status: 'Maintenance' },
            ]
            break
        }

        return {
          type: 'query_success',
          message: `Natural language query processed successfully`,
          original_query: query,
          description: result.object.description,
          query_type: result.object.query_type,
          takeaway: result.object.takeaway,
          data: mockData,
          rowCount: mockData.length,
          note: 'This demonstrates AI-powered query generation using generateObject(). Real integration would execute against your database.',
        }
      } catch (error) {
        console.error('Natural language query error:', error)
        return {
          type: 'query_error',
          message: 'Failed to process natural language query',
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      }
    },
  }),
}

