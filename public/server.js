// server.js - CÓDIGO REVISADO Y FUNCIONAL
console.log("🔴 INICIANDO SOURCE SEAL...");

const http = require('http');
const crypto = require('crypto');

let sellos = [];

const server = http.createServer((req, res) => {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // PÁGINA PRINCIPAL
    if (req.url === '/' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
            <html><head><title>🔐 SourceSeal</title>
            <style>
                body{font-family:Arial;padding:20px;background:#1e1e1e;color:white;}
                .container{max-width:600px;margin:auto;background:#2d2d2d;padding:20px;border-radius:10px;}
                button{background:#007acc;color:white;padding:12px;border:none;border-radius:5px;cursor:pointer;margin:5px;}
                textarea{width:100%;height:80px;padding:10px;background:#3c3c3c;color:white;border:1px solid #007acc;}
                .result{background:#252526;padding:15px;margin:10px 0;border-radius:5px;border-left:4px solid #007acc;}
            </style></head>
            <body><div class="container">
                <h1>🔐 SourceSeal Colombia</h1>
                <p><strong>¡SISTEMA OPERATIVO!</strong></p>
                
                <h3>1. Crear Sello ZKP:</h3>
                <textarea id="datos" placeholder="Escribe datos para proteger..."></textarea>
                <button onclick="crearSello()">✨ CREAR SELLO</button>
                <div id="r1" class="result"></div>
                
                <h3>2. Verificar Sello:</h3>
                <input id="id" placeholder="ID del sello" style="width:100%;padding:10px;margin:5px 0;">
                <button onclick="verificarSello()">🔍 VERIFICAR</button>
                <div id="r2" class="result"></div>
                
                <button onclick="salud()">🩺 COMPROBAR SALUD</button>
                <div id="r3" class="result"></div>
            </div>
            
            <script>
                async function crearSello() {
                    const datos = document.getElementById('datos').value;
                    if(!datos) return alert('Escribe algo');
                    
                    const res = await fetch('/seal', {
                        method: 'POST',
                        headers: {'Content-Type':'application/json'},
                        body: JSON.stringify({datos: datos})
                    });
                    const r = await res.json();
                    
                    document.getElementById('r1').innerHTML = 
                        '<h4>✅ SELLO CREADO</h4>' +
                        '<p>ID: ' + r.id + '</p>' +
                        '<p>Hash: ' + r.hash.substring(0,20) + '...</p>' +
                        '<p><a href="/verify/' + r.id + '" target="_blank">Verificar este sello</a></p>';
                }
                
                async function verificarSello() {
                    const id = document.getElementById('id').value;
                    if(!id) return alert('Pon un ID');
                    
                    const res = await fetch('/verify/' + id);
                    const r = await res.json();
                    
                    if(r.error) {
                        document.getElementById('r2').innerHTML = '<h4>❌ ERROR</h4><p>' + r.error + '</p>';
                    } else {
                        document.getElementById('r2').innerHTML = '<h4>✅ VÁLIDO</h4><p>Sello verificado correctamente</p>';
                    }
                }
                
                async function salud() {
                    const res = await fetch('/health');
                    const r = await res.json();
                    document.getElementById('r3').innerHTML = 
                        '<h4>✅ SERVIDOR ACTIVO</h4>' +
                        '<p>Sellos creados: ' + r.total + '</p>' +
                        '<p>Hora: ' + r.hora + '</p>';
                }
            </script>
            </body></html>
        `);
        return;
    }

    // Endpoint: /seal
    if (req.url === '/seal' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { datos } = JSON.parse(body);
                const id = 'seal_' + Date.now();
                const hash = crypto.createHash('sha256').update(datos + Date.now()).digest('hex');
                const sello = { id, hash, datos, fecha: new Date() };
                sellos.push(sello);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ id, hash }));
            } catch(e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error en datos' }));
            }
        });
        return;
    }

    // Endpoint: /verify/:id
    if (req.url.startsWith('/verify/')) {
        const id = req.url.split('/')[2];
        const sello = sellos.find(s => s.id === id);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        if(!sello) {
            res.end(JSON.stringify({ error: 'Sello no encontrado' }));
        } else {
            res.end(JSON.stringify({ id: sello.id, fecha: sello.fecha }));
        }
        return;
    }

    // Endpoint: /health
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ total: sellos.length, hora: new Date().toLocaleString() }));
        return;
    }

    // Ruta no encontrada
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 - Ruta no encontrada');
});

// IMPORTANTE: Replit usa el puerto de la variable de entorno PORT
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ SOURCE SEAL COLOMBIA - ACTIVO EN PUERTO ${PORT}`);
    console.log(`🌐 URL: https://workspace.paredesharold62.repl.co`);
    console.log(`📅 ${new Date().toLocaleString()}`);
});