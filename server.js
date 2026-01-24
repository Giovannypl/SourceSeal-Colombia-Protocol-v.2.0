const express = require('express');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Base de datos simple en memoria
let seals = [];

// Página principal CON BOTONES FUNCIONALES
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>🔐 SourceSeal - FUNCIONAL</title>
        <style>
            body { font-family: Arial; padding: 20px; background: #f0f0f0; }
            .container { max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px; }
            h1 { color: #333; }
            textarea, input { width: 100%; padding: 10px; margin: 10px 0; }
            button { background: #4CAF50; color: white; padding: 12px; border: none; cursor: pointer; width: 100%; }
            .result { background: #f9f9f9; padding: 15px; margin: 10px 0; border-radius: 5px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🔐 SourceSeal Colombia - SISTEMA FUNCIONAL</h1>
            
            <h2>Crear Sello ZKP:</h2>
            <textarea id="data" rows="3" placeholder="Escribe algo..."></textarea><br>
            <button onclick="createSeal()">✨ CREAR SELLO</button>
            <div id="result1" class="result"></div>
            
            <h2>Verificar Sello:</h2>
            <input id="sealId" placeholder="ID del sello"><br>
            <button onclick="verifySeal()">🔍 VERIFICAR</button>
            <div id="result2" class="result"></div>
            
            <button onclick="checkHealth()">🩺 Comprobar Salud</button>
            <div id="result3" class="result"></div>
        </div>
        
        <script>
            async function createSeal() {
                const data = document.getElementById('data').value;
                if(!data) { alert('Escribe algo'); return; }
                
                const res = await fetch('/seal', {
                    method: 'POST',
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify({data: data, honeytoken: true})
                });
                const result = await res.json();
                document.getElementById('result1').innerHTML = 
                    '<h3>✅ Sello Creado!</h3>' +
                    '<p>ID: ' + result.id + '</p>' +
                    '<p>Hash: ' + result.hash.substring(0,20) + '...</p>' +
                    '<p><a href="/verify/' + result.id + '" target="_blank">Verificar este sello</a></p>';
            }
            
            async function verifySeal() {
                const id = document.getElementById('sealId').value;
                if(!id) { alert('Pon un ID'); return; }
                
                const res = await fetch('/verify/' + id);
                const result = await res.json();
                document.getElementById('result2').innerHTML = 
                    '<h3>' + (result.valid ? '✅ Válido' : '❌ Inválido') + '</h3>' +
                    '<p>' + result.message + '</p>';
            }
            
            async function checkHealth() {
                const res = await fetch('/health');
                const result = await res.json();
                document.getElementById('result3').innerHTML = 
                    '<h3>✅ Servidor Activo</h3>' +
                    '<p>Estado: ' + result.status + '</p>' +
                    '<p>Sellos creados: ' + result.count + '</p>';
            }
        </script>
    </body>
    </html>
    `);
});

// ENDPOINT REAL: /seal
app.post('/seal', (req, res) => {
    console.log('Creando sello...', req.body);
    
    const id = 'seal_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const hash = crypto.createHash('sha256').update(JSON.stringify(req.body) + Date.now()).digest('hex');
    
    const seal = {
        id: id,
        hash: hash,
        data: req.body.data,
        honeytoken: req.body.honeytoken || false,
        timestamp: new Date()
    };
    
    seals.push(seal);
    
    res.json({
        success: true,
        id: id,
        hash: hash,
        message: 'Sello ZKP creado exitosamente',
        verifyUrl: `/verify/${id}`
    });
});

// ENDPOINT REAL: /verify/:id
app.get('/verify/:id', (req, res) => {
    const seal = seals.find(s => s.id === req.params.id);
    
    if (!seal) {
        return res.json({
            valid: false,
            message: 'Sello no encontrado'
        });
    }
    
    res.json({
        valid: true,
        id: seal.id,
        honeytoken: seal.honeytoken,
        message: seal.honeytoken ? 
            '⚠️ ¡ALERTA! Este es un HONEYTOKEN. Posible acceso no autorizado.' :
            '✅ Sello verificado correctamente.',
        timestamp: seal.timestamp
    });
});

// ENDPOINT REAL: /health
app.get('/health', (req, res) => {
    res.json({
        status: 'online',
        count: seals.length,
        timestamp: new Date()
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`
=====================================
🚀 SourceSeal Colombia - FUNCIONAL
=====================================
✅ Servidor activo en puerto ${PORT}
🌐 URL: https://workspace.paredesharold62.repl.co
🕐 ${new Date().toLocaleString()}
=====================================
✨ Endpoints activos:
   POST /seal       → Crear sello
   GET  /verify/:id → Verificar sello  
   GET  /health     → Estado
=====================================
    `);
});