/**
 * Adventure Wales MCP Server API Route
 * 
 * HTTP transport for MCP protocol.
 * AI travel agents can connect to this endpoint to search Welsh adventure data.
 * 
 * Usage:
 * POST /api/mcp with JSON-RPC 2.0 requests
 */

import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { db } from '@/db';
import { 
  activities, 
  accommodation, 
  events, 
  itineraries, 
  regions,
  operators,
  activityTypes
} from '@/db/schema';
import { ilike, and, gte, lte, or, eq } from 'drizzle-orm';

// MCP Protocol Types
interface MCPRequest {
  jsonrpc: '2.0';
  id: string | number;
  method: string;
  params?: Record<string, any>;
}

// Tool definitions for AI agents
const TOOLS = [
  {
    name: 'search_activities',
    description: 'Search for adventure activities in Wales. Returns activities like coasteering, mountain biking, hiking, kayaking, surfing, rock climbing, etc.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search term (e.g., "coasteering", "family friendly", "Snowdonia")' },
        limit: { type: 'number', description: 'Max results to return', default: 10 }
      }
    }
  },
  {
    name: 'search_accommodation',
    description: 'Search for accommodation in Wales, including quirky stays like treehouses, yurts, castles, and glamping.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search term (e.g., "treehouse", "glamping", "Pembrokeshire")' },
        limit: { type: 'number', default: 10 }
      }
    }
  },
  {
    name: 'search_events',
    description: 'Search for adventure events in Wales - races, festivals, competitions, outdoor gatherings.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search term' },
        startDate: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
        endDate: { type: 'string', description: 'End date (YYYY-MM-DD)' },
        eventType: { type: 'string', description: 'Event type (Running, Triathlon, Swimming, Festival, etc.)' },
        limit: { type: 'number', default: 10 }
      }
    }
  },
  {
    name: 'search_itineraries',
    description: 'Search for ready-made adventure itineraries and trip plans in Wales.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search term (e.g., "weekend", "family", "romantic", "Snowdonia")' },
        limit: { type: 'number', default: 10 }
      }
    }
  },
  {
    name: 'search_operators',
    description: 'Search for adventure activity operators and companies in Wales.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search term or activity type' },
        limit: { type: 'number', default: 10 }
      }
    }
  },
  {
    name: 'get_regions',
    description: 'Get all adventure regions in Wales with descriptions.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'get_activity_types',
    description: 'Get all available adventure activity types.',
    inputSchema: { type: 'object', properties: {} }
  }
];

// Tool implementations
async function searchActivities(params: any) {
  const { query, limit = 10 } = params;
  
  let whereClause;
  if (query) {
    whereClause = or(
      ilike(activities.name, `%${query}%`),
      ilike(activities.description, `%${query}%`)
    );
  }
  
  const results = await db.query.activities.findMany({
    where: whereClause,
    limit,
    with: {
      region: true,
      activityType: true
    }
  });

  return results.map(a => ({
    name: a.name,
    slug: a.slug,
    description: a.description,
    region: a.region?.name || 'Wales',
    difficulty: a.difficulty,
    duration: a.duration,
    activityType: a.activityType?.name,
    priceFrom: a.priceFrom,
    url: `https://adventurewales.co.uk/activities/${a.slug}`
  }));
}

async function searchAccommodation(params: any) {
  const { query, limit = 10 } = params;
  
  let whereClause;
  if (query) {
    whereClause = or(
      ilike(accommodation.name, `%${query}%`),
      ilike(accommodation.description, `%${query}%`),
      ilike(accommodation.type, `%${query}%`)
    );
  }
  
  const results = await db.query.accommodation.findMany({
    where: whereClause,
    limit,
    with: {
      region: true
    }
  });

  return results.map(a => ({
    name: a.name,
    slug: a.slug,
    description: a.description,
    region: a.region?.name || 'Wales',
    type: a.type,
    priceFrom: a.priceFrom,
    priceTo: a.priceTo,
    website: a.website,
    url: `https://adventurewales.co.uk/accommodation/${a.slug}`
  }));
}

async function searchEvents(params: any) {
  const { query, startDate, endDate, eventType, limit = 10 } = params;
  
  const conditions = [];
  if (query) {
    conditions.push(or(
      ilike(events.name, `%${query}%`),
      ilike(events.description, `%${query}%`)
    ));
  }
  if (startDate) {
    conditions.push(gte(events.dateStart, new Date(startDate)));
  }
  if (endDate) {
    conditions.push(lte(events.dateStart, new Date(endDate)));
  }
  if (eventType) {
    conditions.push(eq(events.type, eventType));
  }
  
  const results = await db.query.events.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
    limit,
    orderBy: (events, { asc }) => [asc(events.dateStart)]
  });

  return results.map(e => ({
    name: e.name,
    slug: e.slug,
    description: e.description,
    location: e.location,
    startDate: e.dateStart,
    endDate: e.dateEnd,
    eventType: e.type,
    website: e.website,
    url: `https://adventurewales.co.uk/events/${e.slug}`
  }));
}

async function searchItineraries(params: any) {
  const { query, limit = 10 } = params;
  
  let whereClause;
  if (query) {
    whereClause = or(
      ilike(itineraries.title, `%${query}%`),
      ilike(itineraries.description, `%${query}%`)
    );
  }
  
  const results = await db.query.itineraries.findMany({
    where: whereClause,
    limit,
    with: {
      region: true
    }
  });

  return results.map(i => ({
    name: i.title,
    slug: i.slug,
    description: i.description,
    tagline: i.tagline,
    region: i.region?.name || 'Wales',
    durationDays: i.durationDays,
    difficulty: i.difficulty,
    url: `https://adventurewales.co.uk/itineraries/${i.slug}`
  }));
}

async function searchOperators(params: any) {
  const { query, limit = 10 } = params;
  
  let whereClause;
  if (query) {
    whereClause = or(
      ilike(operators.name, `%${query}%`),
      ilike(operators.description, `%${query}%`),
      ilike(operators.tagline, `%${query}%`)
    );
  }
  
  const results = await db.query.operators.findMany({
    where: whereClause,
    limit
  });

  return results.map(o => ({
    name: o.name,
    slug: o.slug,
    description: o.description,
    tagline: o.tagline,
    website: o.website,
    phone: o.phone,
    email: o.email,
    googleRating: o.googleRating,
    url: `https://adventurewales.co.uk/directory/${o.slug}`
  }));
}

async function getRegions() {
  const results = await db.query.regions.findMany();

  return results.map(r => ({
    name: r.name,
    slug: r.slug,
    description: r.description,
    url: `https://adventurewales.co.uk/regions/${r.slug}`
  }));
}

async function getActivityTypes() {
  const results = await db.query.activityTypes.findMany();

  return results.map(t => ({
    name: t.name,
    slug: t.slug,
    description: t.description,
    url: `https://adventurewales.co.uk/${t.slug}`
  }));
}

// Handle MCP requests
async function handleMCPRequest(request: MCPRequest) {
  const { id, method, params } = request;

  try {
    switch (method) {
      case 'initialize':
        return {
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: { tools: {} },
            serverInfo: {
              name: 'adventure-wales',
              version: '1.0.0',
              description: 'Welsh adventure tourism data for AI travel agents. Search activities, accommodation, events, itineraries, and operators across Wales.'
            }
          }
        };

      case 'tools/list':
        return { jsonrpc: '2.0', id, result: { tools: TOOLS } };

      case 'tools/call':
        const { name, arguments: args } = params || {};
        let result;

        switch (name) {
          case 'search_activities':
            result = await searchActivities(args || {});
            break;
          case 'search_accommodation':
            result = await searchAccommodation(args || {});
            break;
          case 'search_events':
            result = await searchEvents(args || {});
            break;
          case 'search_itineraries':
            result = await searchItineraries(args || {});
            break;
          case 'search_operators':
            result = await searchOperators(args || {});
            break;
          case 'get_regions':
            result = await getRegions();
            break;
          case 'get_activity_types':
            result = await getActivityTypes();
            break;
          default:
            return {
              jsonrpc: '2.0',
              id,
              error: { code: -32601, message: `Unknown tool: ${name}` }
            };
        }

        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
          }
        };

      default:
        return {
          jsonrpc: '2.0',
          id,
          error: { code: -32601, message: `Method not found: ${method}` }
        };
    }
  } catch (error: any) {
    console.error('MCP Error:', error);
    return {
      jsonrpc: '2.0',
      id,
      error: { code: -32603, message: error.message || 'Internal error' }
    };
  }
}

function timingSafeStringEqual(a: string, b: string): boolean {
  try {
    const aBytes = new TextEncoder().encode(a.padEnd(64));
    const bBytes = new TextEncoder().encode(b.padEnd(64));
    return timingSafeEqual(Buffer.from(aBytes), Buffer.from(bBytes)) && a.length === b.length;
  } catch {
    return false;
  }
}

// POST handler for MCP requests
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // tools/call requires a valid MCP_API_KEY bearer token
    if (body?.method === 'tools/call') {
      const mcpKey = process.env.MCP_API_KEY;
      if (!mcpKey) {
        return NextResponse.json(
          { jsonrpc: '2.0', id: body.id ?? null, error: { code: -32001, message: 'Unauthorized' } },
          { status: 401 }
        );
      }
      const authHeader = request.headers.get('authorization') ?? '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
      if (!timingSafeStringEqual(token, mcpKey)) {
        return NextResponse.json(
          { jsonrpc: '2.0', id: body.id ?? null, error: { code: -32001, message: 'Unauthorized' } },
          { status: 401 }
        );
      }
    }

    const response = await handleMCPRequest(body);
    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({
      jsonrpc: '2.0',
      id: null,
      error: { code: -32700, message: 'Parse error' }
    }, { status: 400 });
  }
}

// GET handler for discovery
export async function GET() {
  return NextResponse.json({
    name: 'adventure-wales',
    version: '1.0.0',
    description: 'Welsh adventure tourism MCP server. AI travel agents can search activities, accommodation, events, itineraries, and operators across Wales.',
    protocol: 'mcp',
    transport: 'http',
    endpoint: 'https://adventurewales.co.uk/api/mcp',
    tools: TOOLS.map(t => ({ name: t.name, description: t.description })),
    usage: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      example: {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: {
          name: 'search_activities',
          arguments: { query: 'coasteering', limit: 5 }
        }
      }
    }
  });
}
