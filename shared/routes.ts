cd ~/workspace

cat > shared/routes.ts << 'EOF'
// API Routes structure matching server expectations
export const api = {
  seals: {
    create: {
      path: '/api/seals',
      method: 'POST'
    },
    list: {
      path: '/api/seals',
      method: 'GET'
    },
    get: {
      path: '/api/seals/:id',
      method: 'GET'
    },
    update: {
      path: '/api/seals/:id',
      method: 'PUT'
    },
    delete: {
      path: '/api/seals/:id',
      method: 'DELETE'
    }
  },
  verify: {
    create: {
      path: '/api/verify',
      method: 'POST'
    }
  },
  register: {
    create: {
      path: '/api/register',
      method: 'POST'
    }
  },
  content: {
    create: {
      path: '/api/content',
      method: 'POST'
    },
    list: {
      path: '/api/content',
      method: 'GET'
    }
  },
  actions: {
    create: {
      path: '/api/actions',
      method: 'POST'
    },
    list: {
      path: '/api/actions',
      method: 'GET'
    }
  }
};

// Simple string paths for client
export const API_PATHS = {
  seals: '/api/seals',
  verify: '/api/verify',
  register: '/api/register',
  content: '/api/content',
  actions: '/api/actions',
  status: '/api/status'
};

// URL builder for client
export function buildUrl(endpoint: string, params?: Record<string, string>): string {
  const base = 'http://localhost:5000';
  let url = `${base}${endpoint}`;
  if (params) {
    const query = new URLSearchParams(params).toString();
    url += `?${query}`;
  }
  return url;
}
EOF