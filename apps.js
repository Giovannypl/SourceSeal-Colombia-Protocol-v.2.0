// app.js - CÓDIGO DEFINITIVO QUE SÍ FUNCIONA
console.log("🚀 INICIANDO SOURCE SEAL...");

// 1. Crea un servidor HTTP básico (sin Express)
const http = require('http');
const crypto = require('crypto');

// Base de datos simple
const database = {
    seals: [],
    total: 0
};

// 2. Crea el servidor
const server = http.createServer((req, res) => {
    // Configurar headers CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Manejar OPTIONS para CORS
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // RUTA PRINCIPAL - Interfaz web
    if (req.url === '/' && req.method === 'GET') {
        console.log("📄 Sirviendo página principal...");
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>🔐 SourceSeal Colombia</title>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: 'Arial', sans-serif;
                        background: linear-gradient(135deg, #0c2461, #1e3799);
                        color: white;
                        min-height: 100vh;
                        padding: 20px;
                    }
                    .container {
                        max-width: 800px;
                        margin: 0 auto;
                        background: rgba(255, 255, 255, 0.1);
                        backdrop-filter: blur(10px);
                        border-radius: 20px;
                        padding: 40px;
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    }
                    h1 {
                        text-align: center;
                        margin-bottom: 20px;
                        font-size: 2.8rem;
                        color: #4bcffa;
                    }
                    .subtitle {
                        text-align: center;
                        margin-bottom: 40px;
                        opacity: 0.9;
                    }
                    .card {
                        background: rgba(255, 255, 255, 0.05);
                        border-radius: 15px;
                        padding: 30px;
                        margin-bottom: 30px;
                        border: 1px solid rgba(255, 255, 255, 0.1);
                    }
                    h2 {
                        color: #0be881;
                        margin-bottom: 20px;
                        font-size: 1.8rem;
                    }
                    textarea, input {
                        width: 100%;
                        padding: 15px;
                        border-radius: 10px;
                        border: 2px solid #4bcffa;
                        background: rgba(0, 0, 0, 0.3);
                        color: white;
                        font-size: 16px;
                        margin-bottom: 15px;
                        resize: vertical;
                    }
                    button {
                        background: linear-gradient(to right, #0be881, #4bcffa);
                        color: #0c2461;
                        border: none;
                        padding: 16px 32px;
                        border-radius: 10px;
                        font-size: 18px;
                        font-weight: bold;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        display: block;
                        width: 100%;
                        margin-top: 10px;
                    }
                    button:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
                    }
                    .result {
                        background: rgba(0, 0, 0, 0.4);
                        border-radius: 10px;
                        padding: 20px;
                        margin-top: 20px;
                        border-left: 5px solid #4bcffa;
                        display: none;
                    }
                    .honeytoken {
                        border-left-color: #ff3f34;
                    }
                    .url {
                        color: #4bcffa;
                        word-break: break-all;
                        font-weight: bold;
                    }
                    .stats {
                        display: flex;
                        justify-content: space-around;
                        margin: 30px 0;
                        text-align: center;
                    }
                    .stat-box {
                        background: rgba(255, 255, 255, 0.05);
                        padding: 20px;
                        border-radius: 10px;
                        flex: 1;
                        margin: 0 10px;
                    }
                    .stat-number {
                        font-size: 2.5rem;
                        font-weight: bold;
                        color: #0be881;
                    }
                    .stat-label {
                        font-size: 0.9rem;
                        opacity: 0.8;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>🔐 SOURCE SEAL COLOMBIA</h1>
                    <p class="subtitle">Sistema ZKP para integridad de datos y honeytokens</p>
                    
                    <div class="stats">
                        <div class="stat-box">
                            <div class="stat-number" id="totalSeals">0</div>
                            <div class="stat-label">Sellos Creados</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-number" id="honeytokens">0</div>
                            <div class="stat-label">Honeytokens</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-number" id="verifications">0</div>
                            <div class="stat-label">Verificaciones</div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <h2>✨ Crear Nuevo Sello ZKP</h2>
                        <textarea id="dataInput" rows="4" placeholder="Ingresa los datos que deseas proteger..."></textarea>
                        <label style="display: block; margin: 15px 0;">
                            <input type="checkbox" id="honeytokenCheck">
                            🍯 Marcar como Honeytoken (alerta en verificación)
                        </label>
                        <button onclick="createSeal()">🚀 Crear Sello ZKP</button>
                        <div id="createResult" class="result"></div>
                    </div>
                    
                    <div class="card">
                        <h2>🔍 Verificar Sello Existente</h2>
                        <input type="text" id="verifyInput" placeholder="Pega aquí el ID del sello...">
                        <button onclick="verifySeal()">🔍 Verificar Sello</button>
                        <div id="verifyResult" class="result"></div>
                    </div>
                    
                    <div class="card">
                        <h2>📊 Estado del Sistema</h2>
                        <button onclick="checkHealth()">🩺 Comprobar Salud del Servidor</button>
                        <div id="healthResult" class="result"></div>
                    </div>
                </div>
                
                <script>
                    // URL base
                    const API_BASE = window.location.origin;
                    
                    // Actualizar estadísticas
                    async function updateStats() {
                        try {
                            const response = await fetch('/health');
                            const data = await response.json();
                            document.getElementById('totalSeals').textContent = data.sealsCount || 0;
                            document.getElementById('honeytokens').textContent = data.honeytokensCount || 0;
                            document.getElementById('verifications').textContent = data.verificationsCount || 0;
                        } catch (error) {
                            console.log('Error actualizando stats:', error);
                        }
                    }
                    
                    // Crear sello
                    async function createSeal() {
                        const data = document.getElementById('dataInput').value;
                        const isHoneytoken = document.getElementById('honeytokenCheck').checked;
                        
                        if (!data.trim()) {
                            alert('Por favor, ingresa datos para crear el sello.');
                            return;
                        }
                        
                        const btn = event.target;
                        btn.disabled = true;
                        btn.textContent = 'Creando sello...';
                        
                        try {
                            const response = await fetch('/seal', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    data: data,
                                    metadata: { isHoneytoken: isHoneytoken }
                                })
                            });
                            
                            const result = await response.json();
                            
                            if (result.success) {
                                const resultDiv = document.getElementById('createResult');
                                resultDiv.innerHTML = \`
                                    <h3>✅ Sello Creado Exitosamente</h3>
                                    <p><strong>ID del Sello:</strong> <code>\${result.sealId}</code></p>
                                    <p><strong>Hash ZKP:</strong> <code>\${result.sealHash.substring(0, 40)}...</code></p>
                                    <p><strong>Tipo:</strong> \${result.isHoneytoken ? '🍯 HONEYTOKEN' : '🔐 Sello Normal'}</p>
                                    <p><strong>URL para Verificar:</strong></p>
                                    <p class="url"><a href="\${result.verifyUrl}" target="_blank">\${result.verifyUrl}</a></p>
                                    <button onclick="copyToClipboard('\${result.verifyUrl}')">📋 Copiar URL</button>
                                \`;
                                resultDiv.style.display = 'block';
                                
                                if (result.isHoneytoken) {
                                    resultDiv.classList.add('honeytoken');
                                }
                                
                                alert('¡Sello creado exitosamente! ID: ' + result.sealId);
                            } else {
                                alert('Error: ' + result.message);
                            }
                        } catch (error) {
                            alert('Error de conexión: ' + error.message);
                        } finally {
                            btn.disabled = false;
                            btn.textContent = '🚀 Crear Sello ZKP';
                            updateStats();
                        }
                    }
                    
                    // Verificar sello
                    async function verifySeal() {
                        const sealId = document.getElementById('verifyInput').value.trim();
                        
                        if (!sealId) {
                            alert('Por favor, ingresa un ID de sello.');
                            return;
                        }
                        
                        const btn = event.target;
                        btn.disabled = true;
                        btn.textContent = 'Verificando...';
                        
                        try {
                            const response = await fetch('/verify/' + encodeURIComponent(sealId));
                            const result = await response.json();
                            
                            const resultDiv = document.getElementById('verifyResult');
                            resultDiv.style.display = 'block';
                            
                            if (result.success) {
                                resultDiv.innerHTML = \`
                                    <h3>\${result.isHoneytoken ? '⚠️ ¡ALERTA HONEYTOKEN!' : '✅ Sello Válido'}</h3>
                                    <p><strong>Estado:</strong> \${result.isHoneytoken ? '🔴 HONEYTOKEN DETECTADO' : '🟢 Válido'}</p>
                                    <p><strong>Mensaje:</strong> \${result.message}</p>
                                    <p><strong>Verificaciones:</strong> \${result.verificationCount} veces</p>
                                    <p><strong>Fecha de Creación:</strong> \${new Date(result.timestamp).toLocaleString()}</p>
                                \`;
                                
                                if (result.isHoneytoken) {
                                    resultDiv.classList.add('honeytoken');
                                }
                            } else {
                                resultDiv.innerHTML = \`
                                    <h3>❌ Error de Verificación</h3>
                                    <p><strong>Mensaje:</strong> \${result.message}</p>
                                \`;
                            }
                        } catch (error) {
                            alert('Error de conexión: ' + error.message);
                        } finally {
                            btn.disabled = false;
                            btn.textContent = '🔍 Verificar Sello';
                            updateStats();
                        }
                    }
                    
                    // Comprobar salud
                    async function checkHealth() {
                        try {
                            const response = await fetch('/health');
                            const result = await response.json();
                            
                            const healthDiv = document.getElementById('healthResult');
                            healthDiv.innerHTML = \`
                                <h3>✅ Servidor Activo</h3>
                                <p><strong>Estado:</strong> \${result.status}</p>
                                <p><strong>Sellos Creados:</strong> \${result.sealsCount}</p>
                                <p><strong>Honeytokens:</strong> \${result.honeytokensCount}</p>
                                <p><strong>Verificaciones:</strong> \${result.verificationsCount}</p>
                                <p><strong>Hora del Servidor:</strong> \${new Date(result.timestamp).toLocaleString()}</p>
                            \`;
                            healthDiv.style.display = 'block';
                            
                        } catch (error) {
                            alert('Error conectando al servidor');
                        }
                    }
                    
                    // Función auxiliar para copiar
                    function copyToClipboard(text) {
                        navigator.clipboard.writeText(text);
                        alert('✅ URL copiada al portapapeles');
                    }
                    
                    // Cargar estadísticas al inicio
                    updateStats();
                </script>
            </body>
            </html>
        `);
        return;
    }
    
    // ENDPOINT: /seal (POST)
    if (req.url === '/seal' && req.method === 'POST') {
        console.log("📦 Creando sello...");
        
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { data, metadata } = JSON.parse(body);
                
                if (!data) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ 
                        success: false, 
                        message: 'Se requiere el campo "data"' 
                    }));
                }
                
                // Generar ID único
                const sealId = 'seal_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                
                // Generar hash ZKP
                const sealHash = crypto
                    .createHash('sha256')
                    .update(JSON.stringify(data) + Date.now() + sealId)
                    .digest('hex');
                
                const isHoneytoken = metadata?.isHoneytoken || false;
                
                // Crear objeto sello
                const seal = {
                    id: sealId,
                    hash: sealHash,
                    data: data,
                    timestamp: new Date(),
                    isHoneytoken: isHoneytoken,
                    verified: false,
                    verificationCount: 0
                };
                
                // Guardar en base de datos
                database.seals.push(seal);
                database.total++;
                
                console.log(`✅ Sello creado: ${sealId} (Honeytoken: ${isHoneytoken})`);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    sealId: sealId,
                    sealHash: sealHash,
                    isHoneytoken: isHoneytoken,
                    message: isHoneytoken 
                        ? 'Sello ZKP creado como HONEYTOKEN 🍯' 
                        : 'Sello ZKP creado exitosamente',
                    verifyUrl: `http://${req.headers.host}/verify/${sealId}`,
                    timestamp: new Date()
                }));
                
            } catch (error) {
                console.error('❌ Error en /seal:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    message: 'Error interno del servidor'
                }));
            }
        });
        return;
    }
    
    // ENDPOINT: /verify/:id (GET)
    if (req.url.startsWith('/verify/') && req.method === 'GET') {
        const sealId = req.url.split('/')[2];
        console.log(`🔍 Verificando sello: ${sealId}`);
        
        // Buscar sello
        const seal = database.seals.find(s => s.id === sealId);
        
        if (!seal) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({
                success: false,
                message: 'Sello no encontrado. Verifica el ID.'
            }));
        }
        
        // Actualizar contadores
        seal.verified = true;
        seal.verificationCount = (seal.verificationCount || 0) + 1;
        
       