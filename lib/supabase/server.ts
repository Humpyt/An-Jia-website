import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

// Create a single supabase client for server components
export const createServerClient = () => {
  // Check if we're in a build/SSG environment
  const isBuildTime = process.env.NODE_ENV === 'production' && typeof window === 'undefined' && !process.env.SUPABASE_URL;

  // Use real Supabase client if environment variables are available
  if (!isBuildTime && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return createClient<Database>(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }

  // For build time or when environment variables are not available, use a mock client
  console.log('Creating enhanced mock Supabase client for build/demo purposes');

  // Sample mock data for dashboard
  const mockData = {
    properties: Array(10).fill(0).map((_, i) => ({
      id: `prop-${i}`,
      title: `Property ${i}`,
      views: Math.floor(Math.random() * 100),
      active: true,
      location: ['Kololo', 'Nakasero', 'Bukoto', 'Ntinda'][Math.floor(Math.random() * 4)] + ', Kampala'
    })),
    inquiries: Array(20).fill(0).map((_, i) => ({
      id: `inq-${i}`,
      property_id: `prop-${Math.floor(Math.random() * 10)}`,
      name: `User ${i}`,
      email: `user${i}@example.com`,
      message: `Inquiry message ${i}`,
      created_at: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
    })),
    property_views: Array(100).fill(0).map((_, i) => ({
      id: `view-${i}`,
      property_id: `prop-${Math.floor(Math.random() * 10)}`,
      viewed_at: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
    })),
    property_images: Array(20).fill(0).map((_, i) => ({
      id: `img-${i}`,
      property_id: `prop-${Math.floor(i/2)}`,
      image_url: `https://picsum.photos/id/${i + 100}/500/300`,
      is_primary: i % 2 === 0
    }))
  };

  // Create a chainable mock client with methods that return mock data
  const createChainableMock = (table) => {
    // Keep track of the current query state
    let currentData = [...mockData[table] || []];
    let countMode = false;
    let headMode = false;
    let selectedFields = '*';

    // The chainable object with all query methods
    const chainable = {
      // Selection methods
      select: (fields, options = {}) => {
        selectedFields = fields;
        countMode = options.count === 'exact';
        headMode = options.head === true;
        return chainable;
      },

      // Filter methods
      eq: (column, value) => {
        currentData = currentData.filter(item => item[column] === value);
        return chainable;
      },
      neq: (column, value) => {
        currentData = currentData.filter(item => item[column] !== value);
        return chainable;
      },
      gt: (column, value) => {
        currentData = currentData.filter(item => item[column] > value);
        return chainable;
      },
      gte: (column, value) => {
        currentData = currentData.filter(item => item[column] >= value);
        return chainable;
      },
      lt: (column, value) => {
        currentData = currentData.filter(item => item[column] < value);
        return chainable;
      },
      lte: (column, value) => {
        currentData = currentData.filter(item => item[column] <= value);
        return chainable;
      },
      like: (column, pattern) => {
        const regex = new RegExp(pattern.replace(/%/g, '.*'));
        currentData = currentData.filter(item => regex.test(String(item[column])));
        return chainable;
      },
      ilike: (column, pattern) => {
        const regex = new RegExp(pattern.replace(/%/g, '.*'), 'i');
        currentData = currentData.filter(item => regex.test(String(item[column])));
        return chainable;
      },
      in: (column, values) => {
        currentData = currentData.filter(item => values.includes(item[column]));
        return chainable;
      },

      // Ordering methods
      order: (column, { ascending = true } = {}) => {
        currentData.sort((a, b) => {
          if (ascending) return a[column] > b[column] ? 1 : -1;
          return a[column] < b[column] ? 1 : -1;
        });
        return chainable;
      },

      // Pagination methods
      limit: (n) => {
        currentData = currentData.slice(0, n);
        return chainable;
      },
      offset: (n) => {
        currentData = currentData.slice(n);
        return chainable;
      },

      // Execute the query and return results
      then: (callback) => {
        let result;
        if (countMode) {
          result = { data: headMode ? null : currentData, count: currentData.length, error: null };
        } else {
          result = { data: currentData, error: null };
        }
        return Promise.resolve(result).then(callback);
      },

      // Make it a proper Promise
      catch: (callback) => {
        return Promise.resolve({ data: currentData, error: null }).catch(callback);
      },
      finally: (callback) => {
        return Promise.resolve({ data: currentData, error: null }).finally(callback);
      },

      // Auto-resolve as a Promise
      [Symbol.toStringTag]: 'Promise',

      // Automatically execute and return a Promise
      valueOf: () => Promise.resolve({ data: currentData, error: null }),
      toString: () => '[object SupabaseMockPromise]',
    };

    // Make it work with await
    chainable.then = (resolve, reject) => {
      let result;
      if (countMode) {
        result = { data: headMode ? null : currentData, count: currentData.length, error: null };
      } else {
        result = { data: currentData, error: null };
      }
      return Promise.resolve(result).then(resolve, reject);
    };

    return chainable;
  };

  // The main mock client
  const mockClient = {
    from: (table) => {
      // Basic validation
      if (!mockData[table]) {
        console.warn(`Mock table '${table}' not found, returning empty data`);
      }

      return {
        select: (fields, options) => createChainableMock(table).select(fields, options),
        insert: (data) => Promise.resolve({ data, error: null }),
        update: (data) => ({
          eq: (column, value) => Promise.resolve({ data, error: null }),
          match: (criteria) => Promise.resolve({ data, error: null }),
        }),
        delete: () => ({
          eq: (column, value) => Promise.resolve({ error: null }),
          match: (criteria) => Promise.resolve({ error: null }),
        }),
        upsert: (data) => Promise.resolve({ data, error: null }),
      };
    },
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
    },
    storage: {
      from: (bucket) => ({
        upload: (path, file) => Promise.resolve({ data: { path }, error: null }),
        getPublicUrl: (path) => ({ data: { publicUrl: `https://example.com/${bucket}/${path}` } }),
      }),
    },
  };

  return mockClient as any;
}
