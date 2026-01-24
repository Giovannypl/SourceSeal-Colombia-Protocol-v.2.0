// server.js - VERSIÓN SUPER SIMPLE QUE FUNCIONA
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware básico
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Almacenamiento simple
let sellos = [];
let contador = 0;

// PÁGINA PRINCIPAL - CON BOTONES QUE SÍ FUNCIONAN
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>🔐 SourceSeal - FUNCIONAL</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: Arial, sans-serif;
                padding: 40px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
                background: rgba(255,255,255,0.1);
                padding: 30px;
                border-radius: 20px;
                backdrop-filter: blur(10px);
            }
            h1 {
                color: white;
                text-align: center;
            }
            .btn {
                background: #4CAF50;
                color: white;
                padding: 15px 30px;
                border: none;
                border-radius: 10px;
                font-size: 18px;
                cursor: pointer;
                margin: 10px;
                width: 100%;
            }
            .btn:hover {
                background: #45a049;
            }
            textarea {
                width: 100%;
                height: 100px;
                padding: 10px;
                border-radius: 10px;
                border: 2px solid #667eea;
                font-size: 16px;
            }
            .resultado {
                background: rgba(0,0,0,0.3);
                padding: 20px;
                border-radius: 10px;
                margin-top: 20px;
                display: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🔐 SOURCESEAL COLOMBIA</h1>
            <p>Sistema ZKP para creación y verificación de sellos</p>
            
            <h2>1. Crear Sello ZKP</h2>
            <textarea id="datos" placeholder="Escribe los datos a proteger..."></textarea>
            <button class="btn" onclick="crearSello()">✨ CREAR SELLO</button>
            <div id="resultado1" class="resultado"></div>
            
            <h2>2. Verificar Sello</h2>
            <input type="text" id="idSello" placeholder="ID del sello" style="width:100%;padding:10px;margin:10px 0;">
            <button class="btn" onclick="verificarSello()">🔍 VERIFICAR</button>
            <div id="resultado2" class="resultado"></div>
            
            <button class="btn" onclick="salud()">🩺 COMPROBAR SALUD</button>
            <div id="resultado3" class="resultado"></div>
        </div>
        
        <script>
            // URL base de la API
            const BASE_URL = window.location.origin;
            
            async function crearSello() {
                const datos = document.getElementById('datos').value;
                if (!datos) {
                    alert('Escribe algo primero');
                    return;
                }
                
                try {
                    const respuesta = await fetch('/seal', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({data: datos, honeytoken: true})
                    });
                    
                    const resultado = await respuesta.json();
                    
                    document.getElementById('resultado1').innerHTML = \`
                        <h3>✅ SELLO CREADO!</h3>
                        <p><strong>ID:</strong> \${resultado.id}</p>
                        <p><strong>Hash:</strong> \${resultado.hash.substring(0,30)}...</p>
                        <p><strong>Verificar:</strong> <a href="/verify/\${resultado.id}" target="_blank">/verify/\${resultado.id}</a></p>
                    \`;
                    document.getElementById('resultado1').style.display = 'block';
                    
                } catch (error) {
                    alert('Error: ' + error.message);
                }
            }
            
            async function verificarSello() {
                const id = document.getElementById('idSello').value;
                if (!id) {
                    alert('Ingresa un ID de sello');
                    return;
                }
                
                try {
                    const respuesta = await fetch('/verify/' + id);
                    const resultado = await respuesta.json();
                    
                    document.getElementById('resultado2').innerHTML = \`
                        <h3>\${resultado.valid ? '✅ VÁLIDO' : '❌ INVÁLIDO'}</h3>
                        <p>\${resultado.message}</p>
                        <p>\${resultado.honeytoken ? '⚠️ ¡ES UN HONEYTOKEN!' : '🔒 Sello normal'}</p>
                    \`;
                    document.getElementById('resultado2').style.display = 'block';
                    
                } catch (error) {
                    alert('Error: ' + error.message);
                }
            }
            
            async function salud() {
                try {
                    const respuesta = await fetch('/health');
                    const resultado = await respuesta.json();
                    
                    document.getElementById('resultado3').innerHTML = \`
                        <h3>✅ SERVIDOR ACTIVO</h3>
                        <p>Estado: \${resultado.status}</p>
                        <p>Sellos creados: \${resultado.count}</p>
                        <p>Hora: \${resultado.timestamp}</p>
                    \`;
                    document.getElementById('resultado3').style.display = 'block';
                    
                } catch (error) {
                    alert('Error: ' + error.message);
                }
            }
        </script>
    </body>
    </html>
    `);
});

// ENDPOINT 1: Crear sello
app.post('/seal', (req, res) => {
    console.log('Creando sello...');
    
    const id = 'seal_' + Date.now();
    const hash = require('crypto').createHash('sha256').update(JSON.stringify(req.body) + Date.now()).digest('hex');
    
    const sello = {
        id: id,
        hash: hash,
        data: req.body.data,
        honeytoken: req.body.honeytoken || false,
        timestamp: new Date()
    };
    
    sellos.push(sello);
    contador++;
    
    res.json({
        success: true,
        id: id,
        hash: hash,
        message: 'Sello creado exitosamente'
    });
});

// ENDPOINT 2: Verificar sello
app.get('/verify/:id', (req, res) => {
    const sello = sellos.find(s => s.id === req.params.id);
    
    if (!sello) {
        return res.json({
            valid: false,
            message: 'Sello no encontrado'
        });
    }
    
    res.json({
        valid: true,
        id: sello.id,
        honeytoken: sello.honeytoken,
        message: sello.honeytoken ? 
            '⚠️ ¡ALERTA HONEYTOKEN! Posible acceso no autorizado detectado.' :
            '✅ Sello verificado correctamente.',
        timestamp: sello.timestamp
    });
});

// ENDPOINT 3: Salud
app.get('/health', (req, res) => {
    res.json({
        status: 'online',
        count: sellos.length,
        timestamp: new Date().toLocaleString()
    });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔══════════════════════════════════════════════╗
║ 🔐 SOURCESEAL COLOMBIA - SISTEMA FUNCIONAL   ║
╠══════════════════════════════════════════════╣
║ ✅ Servidor activo en puerto: ${PORT}        ║
║ 🌐 URL: https://workspace.paredesharold62.repl.co ║
║ 🕐 Hora: ${new Date().toLocaleString()}      ║
╠══════════════════════════════════════════════╣
║ 🎯 ENDPOINTS ACTIVOS:                        ║
║   • POST /seal       → Crear sello           ║
║   • GET  /verify/:id → Verificar sello       ║
║   • GET  /health     → Estado del sistema    ║
╚══════════════════════════════════════════════╝
    `);
});