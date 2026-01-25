cat > client/src/routes-fix.ts << 'EOF'
export const api = {
  seals: '/api/seals',
  verify: '/api/verify',
  register: '/api/register',
  content: '/api/content',
  actions: '/api/actions'
};

export function buildUrl(endpoint: string, params?: Record<string, string>) {
  const base = 'http://localhost:5000';
  let url = `${base}${endpoint}`;
  if (params) {
    const query = new URLSearchParams(params).toString();
    url += `?${query}`;
  }
  return url;
}
EOF