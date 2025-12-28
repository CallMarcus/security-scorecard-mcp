/**
 * Schema extraction utility for SecurityScorecard API
 * Extracts request/response schema metadata from api-docs.json (Swagger 2.0)
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface ParameterSchema {
  name: string;
  in: 'path' | 'query' | 'body' | 'header' | 'formData';
  required: boolean;
  type?: string;
  description?: string;
  schema?: any;
}

export interface EndpointSchema {
  operationId: string;
  method: string;
  path: string;
  summary?: string;
  description?: string;
  deprecated?: boolean;
  tags: string[];
  parameters: ParameterSchema[];
  requestBodySchema?: any;
  responses: Record<string, {
    description?: string;
    schema?: any;
  }>;
}

export class ApiSchemaExtractor {
  private specPath: string;
  private spec: any = null;
  private schemaCache: Map<string, EndpointSchema> = new Map();

  constructor() {
    const projectRoot = resolve(__dirname, '../..');
    this.specPath = resolve(projectRoot, 'api-docs.json');
  }

  private loadSpec(): any {
    if (this.spec) return this.spec;

    try {
      const raw = readFileSync(this.specPath, 'utf8');
      this.spec = JSON.parse(raw);
      return this.spec;
    } catch (error) {
      console.warn(`Failed to load API spec from ${this.specPath}: ${error}`);
      return null;
    }
  }

  /**
   * Get schema metadata for an endpoint by operationId
   */
  getSchemaByOperationId(operationId: string): EndpointSchema | null {
    // Check cache first
    if (this.schemaCache.has(operationId)) {
      return this.schemaCache.get(operationId) || null;
    }

    const spec = this.loadSpec();
    if (!spec?.paths) return null;

    // Search for the operation
    for (const [path, methods] of Object.entries(spec.paths)) {
      for (const [method, operation] of Object.entries(methods as Record<string, any>)) {
        if (operation.operationId === operationId) {
          const schema = this.extractEndpointSchema(path, method, operation);
          this.schemaCache.set(operationId, schema);
          return schema;
        }
      }
    }

    return null;
  }

  /**
   * Get schema metadata for an endpoint by method + path
   */
  getSchemaByPath(method: string, path: string): EndpointSchema | null {
    const spec = this.loadSpec();
    if (!spec?.paths?.[path]) return null;

    const operation = spec.paths[path][method.toLowerCase()];
    if (!operation) return null;

    const cacheKey = operation.operationId || `${method}-${path}`;
    if (this.schemaCache.has(cacheKey)) {
      return this.schemaCache.get(cacheKey) || null;
    }

    const schema = this.extractEndpointSchema(path, method, operation);
    this.schemaCache.set(cacheKey, schema);
    return schema;
  }

  private extractEndpointSchema(path: string, method: string, operation: any): EndpointSchema {
    const parameters: ParameterSchema[] = (operation.parameters || []).map((p: any) => ({
      name: p.name,
      in: p.in,
      required: p.required || false,
      type: p.type,
      description: p.description,
      schema: p.schema,
    }));

    // Extract request body schema (from body parameter in Swagger 2.0)
    const bodyParam = parameters.find(p => p.in === 'body');
    const requestBodySchema = bodyParam?.schema;

    // Extract response schemas
    const responses: Record<string, { description?: string; schema?: any }> = {};
    for (const [code, resp] of Object.entries(operation.responses || {})) {
      const response = resp as any;
      responses[code] = {
        description: response.description,
        schema: response.schema,
      };
    }

    return {
      operationId: operation.operationId || `${method}-${path}`,
      method: method.toUpperCase(),
      path,
      summary: operation.summary,
      description: operation.description,
      deprecated: operation.deprecated || false,
      tags: operation.tags || [],
      parameters: parameters.filter(p => p.in !== 'body'),
      requestBodySchema,
      responses,
    };
  }

  /**
   * Resolve a $ref to its definition
   */
  resolveRef(ref: string): any {
    const spec = this.loadSpec();
    if (!spec || !ref.startsWith('#/')) return null;

    const parts = ref.slice(2).split('/');
    let current = spec;
    for (const part of parts) {
      current = current?.[part];
      if (!current) return null;
    }
    return current;
  }

  /**
   * Get a simplified schema description for an endpoint
   */
  getSchemaDescription(operationId: string): string | null {
    const schema = this.getSchemaByOperationId(operationId);
    if (!schema) return null;

    const lines: string[] = [];
    lines.push(`## ${schema.method} ${schema.path}`);

    if (schema.summary) {
      lines.push(`\n${schema.summary}`);
    }

    if (schema.deprecated) {
      lines.push('\n**DEPRECATED**');
    }

    // Parameters
    const pathParams = schema.parameters.filter(p => p.in === 'path');
    const queryParams = schema.parameters.filter(p => p.in === 'query');

    if (pathParams.length > 0) {
      lines.push('\n### Path Parameters');
      for (const p of pathParams) {
        const req = p.required ? '**required**' : 'optional';
        lines.push(`- \`${p.name}\` (${req}) - ${p.description || p.type || 'string'}`);
      }
    }

    if (queryParams.length > 0) {
      lines.push('\n### Query Parameters');
      for (const p of queryParams) {
        const req = p.required ? '**required**' : 'optional';
        lines.push(`- \`${p.name}\` (${req}) - ${p.description || p.type || 'string'}`);
      }
    }

    if (schema.requestBodySchema) {
      lines.push('\n### Request Body');
      if (schema.requestBodySchema.$ref) {
        const refName = schema.requestBodySchema.$ref.split('/').pop();
        lines.push(`Schema: \`${refName}\``);
      } else {
        lines.push('```json');
        lines.push(JSON.stringify(schema.requestBodySchema, null, 2));
        lines.push('```');
      }
    }

    // Response schemas (just 200/201 for brevity)
    const successResponse = schema.responses['200'] || schema.responses['201'];
    if (successResponse?.schema) {
      lines.push('\n### Success Response');
      if (successResponse.schema.$ref) {
        const refName = successResponse.schema.$ref.split('/').pop();
        lines.push(`Schema: \`${refName}\``);
      }
    }

    return lines.join('\n');
  }
}

// Singleton instance
let instance: ApiSchemaExtractor | null = null;

export function getApiSchemaExtractor(): ApiSchemaExtractor {
  if (!instance) {
    instance = new ApiSchemaExtractor();
  }
  return instance;
}
