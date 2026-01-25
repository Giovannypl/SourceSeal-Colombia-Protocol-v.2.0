mkdir -p shared
cat > shared/routes.ts << 'EOF'
export const api = {
  seals: '/api/seals',
  verify: '/api/verify',
  // Agrega más rutas según necesites
};

export function buildUrl(endpoint: string, params?: Record<string, string>) {
  const base = import.meta.env.DEV ? 'http://localhost:5000' : '';
  let url = `${base}${endpoint}`;
  
  if (params) {
    const query = new URLSearchParams(params).toString();
    url += `?${query}`;
  }
  
  return url;
}
EOF