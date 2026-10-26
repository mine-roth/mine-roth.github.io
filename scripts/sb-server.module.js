/**
 * Lightweight PostgREST wrapper for Supabase.
 */
export class SBServer {
    /**
     * @param {string} url - Supabase Project URL (e.g., "https://xyz.supabase.co")
     * @param {string} table - Database table name (e.g., "students")
     * @param {string} apiKey - Supabase anon/publishable key
     */
    constructor(url, table, apiKey) {
      this.endpoint = `${url.replace(/\/$/, '')}/rest/v1/${table}`;
      this.apiKey = apiKey;
    }
  
    /**
     * Helper to build request headers.
     */
    _headers(customHeaders = {}) {
      const headers = {
        'apikey': this.apiKey,
        ...customHeaders
      };
  
      // Service role / JWT keys require Authorization; publishable keys (sb_publishable_) do not.
      if (!this.apiKey.startsWith('sb_publishable_')) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }
  
      return headers;
    }
  
    /**
     * Internal wrapper to execute fetch and process errors cleanly.
     */
    async _request(url, options = {}) {
      const response = await fetch(url, options);
      
      // Parse JSON response if available
      let data;
      try {
        data = await response.json();
      } catch {
        data = null;
      }
  
      if (!response.ok) {
        const errorMsg = data?.message || response.statusText;
        const errorDetails = data?.details ? ` (${data.details})` : '';
        const errorHint = data?.hint ? ` Hint: ${data.hint}` : '';
        throw new Error(`[Supabase ${response.status}] ${errorMsg}${errorDetails}${errorHint}`);
      }
  
      return data;
    }
  
    /**
     * GET - Fetch records with optional PostgREST filtering syntax.
     * @example db.get('select=*&age=gt.20')
     */
    async get(filter = '') {
      const query = filter ? `?${filter.replace(/^\?/, '')}` : '';
      return this._request(`${this.endpoint}${query}`, {
        method: 'GET',
        headers: this._headers()
      });
    }
  
    /**
     * POST - Insert single record or array of records.
     * @param {Object|Object[]} payload
     */
    async post(payload) {
      return this._request(this.endpoint, {
        method: 'POST',
        headers: this._headers({
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        }),
        body: JSON.stringify(payload)
      });
    }
  
    /**
     * PATCH - Update records matching filter.
     * @param {string} filter - e.g., 'id=eq.5'
     * @param {Object} payload - Fields to update
     */
    async patch(filter, payload) {
      if (!filter) throw new Error('Filter is required for PATCH updates.');
      const query = `?${filter.replace(/^\?/, '')}`;
      return this._request(`${this.endpoint}${query}`, {
        method: 'PATCH',
        headers: this._headers({
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        }),
        body: JSON.stringify(payload)
      });
    }
  
    /**
     * DELETE - Remove records matching filter.
     * @param {string} filter - e.g., 'id=eq.5'
     */
    async delete(filter) {
      if (!filter) throw new Error('Filter is required for DELETE.');
      const query = `?${filter.replace(/^\?/, '')}`;
      return this._request(`${this.endpoint}${query}`, {
        method: 'DELETE',
        headers: this._headers({
          'Prefer': 'return=representation'
        })
      });
    }
  
    /**
     * COUNT - Get exact row count matching filter.
     * @param {string} filter - Optional query filter
     */
    async count(filter = '') {
      const query = filter ? `?${filter.replace(/^\?/, '')}` : '';
      const response = await fetch(`${this.endpoint}${query}`, {
        method: 'HEAD',
        headers: this._headers({
          'Prefer': 'count=exact'
        })
      });
  
      if (!response.ok) throw new Error(`Count failed with status ${response.status}`);
      const contentRange = response.headers.get('content-range');
      return contentRange ? parseInt(contentRange.split('/')[1], 10) : 0;
    }
  
    /**
     * RANGE - Paginate records.
     * @param {number} from - Start index (0-based)
     * @param {number} to - End index (inclusive)
     * @param {string} filter - Optional query filter
     */
    async range(from, to, filter = '') {
      const query = filter ? `?${filter.replace(/^\?/, '')}` : '';
      return this._request(`${this.endpoint}${query}`, {
        method: 'GET',
        headers: this._headers({
          'Range': `${from}-${to}`
        })
      });
    }
  }