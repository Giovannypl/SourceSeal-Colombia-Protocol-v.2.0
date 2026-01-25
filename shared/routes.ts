cat > shared/routes.ts << 'EOF'
// API routes configuration
export const api = {
  seals: '/api/seals',
  verify: '/api/verify',
  register: '/api/register',
  content: '/api/content',
  actions: '/api/actions',
  status: '/api/status'
};

// URL builder utility
export function buildUrl(endpoint: string, params?: Record<string, string>): string {
  const base = typeof window !== 'undefined' 
    ? window.location.origin.replace('5173', '5000')
    : 'http://localhost:5000';
  
  let url = `${base}${endpoint}`;
  
  if (params && Object.keys(params).length > 0) {
    const query = new URLSearchParams(params).toString();
    url += `?${query}`;
  }
  
  return url;
}

// Default export
export default { api, buildUrl };
EOF