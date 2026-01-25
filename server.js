if (process.env.REPL_ID) {
  const express = require('express');
  const app = express();
  const PORT = process.env.PORT || 3000;
  app.use(express.static('public'));
  app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));
  app.get('/api/status', (req, res) => res.json({
    message: 'SourceSeal Colombia Protocol V1.2',
    status: 'ACTIVE',
    ley: '1978-COL',
    zkp_shards: ['COL', 'UE'],
    timestamp: new Date().toISOString(),
    environment: 'Replit'
  }));
  app.get('/api/health', (req, res) => res.send('OK'));
  app.listen(PORT, () => console.log(`✅ Running on port ${PORT}`));
} else {
  module.exports = (req, res) => {
    const path = req.url;
    if (path === '/api/status' || path.includes('/api/status')) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        message: 'SourceSeal Colombia Protocol V1.2',
        status: 'ACTIVE',
        ley: '1978-COL',
        zkp_shards: ['COL', 'UE'],
        timestamp: new Date().toISOString(),
        environment: 'Vercel'
      }));
      return;
    }
    if (path === '/api/health') {
      res.end('OK');
      return;
    }
    res.status(404).json({ error: 'Not found' });
  };
}