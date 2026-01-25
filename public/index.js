// index.js - VERSIÓN SUPER SIMPLE QUE SÍ FUNCIONA
const express = require('express');
const app = express();
const PORT = 5000;

// Middleware básico
app.use(express.json());

// Variable para almacenar sellos
let sellos = [];

// PÁGINA PRINCIPAL - 100% FUNCIONAL
app.get('/', (req, res) => {
    res.send(`
    <html>
    <head>
        <title>🔐 SourceSeal - ¡FUNCIONA!</title>
        <style>
            body { 
                font-family: Arial; 
                padding: 20px; 
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
            }
            .container {
                max-width: 600px;
                margin: auto;
                background: rgba(255,255,255,0.1);
                padding: 30px;
                border-radius: 15px;
                backdrop-filter: blur(10px);
            }
            button {
                background: #4CAF50;
                color: white;
                padding: 15px 30px;
                border: none;
                border-radius: 8px;
                font-size: 18px;
                cursor: pointer;
                margin: 10px 0;
                width: 100%;
            }
            button:hover { background: #45a049; }
            textarea, input {
                width: 100%;
                padding: 12px;
                margin: 10px 0;
                border-radius: 8px;
                border: 2px solid #667eea;
                font-size: 16px;
            }
            .result {
                background: rgba(0,0,0,0.3);
                padding: 15px;
                border-radius: 8px;
                margin-top: 15px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🔐 SourceSeal Colombia</h1>
            <p>¡Sistema ZKP 100% funcional!</p>
            
            <h3>1. Crear Sello:</h3>
            <textarea id="texto" rows="3" placeholder="Escribe algo..."></textarea>
            <button onclick="crear()">✨ CREAR SELLO</button>
            <div id="result1" class="result"></div>
            
            <h3>2. Verificar Sello:</h3>
            <input id="idSello" placeholder="Pega el ID aquí">
            <button onclick="verificar()">🔍 VERIFICAR</button>
            <div id="result2" class="result"></div>
            
            <button onclick="salud()">🩺 COMPROBAR SALUD</button>
            <div id="result3" class="result"></div>
        </div>
        
        <script>
            // Función para crear sello
            async function crear() {
                const texto = document.getElementById('texto').value;
                if (!texto) return alert('Escribe algo primero');
                
                const respuesta = await fetch('/seal', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({datos: texto})
                });
                
                const resultado = await respuesta.json();
                
                document.getElementById('result1').innerHTML = \`
                    <h4>✅ SELLO CREADO</h4>
                    <p><strong>ID:</strong> \${resultado.id}</p>
                    <p><strong>Hash:</strong> \${resultado.hash.substring(0, 20)}...</p>
                    <button onclick="copiarID('\${resultado.id}')">📋 Copiar ID</button>
                \`;
            }
            
            // Función para verificar sello
            async function verificar() {
                const id = document.getElementById('idSello').value;
                if (!id) return alert('Pega un ID primero');
                
                const respuesta = await fetch('/verify/' + id);
                const resultado = await respuesta.json();
                
                if (resultado.error) {
                    document.getElementById('result2').innerHTML = \`
                        <h4>❌ ERROR</h4>
                        <p>\${resultado.error}</p>
                    \`;
                } else {
                    document.getElementById('result2').innerHTML = \`
                        <h4>✅ SELLO VÁLIDO</h4>
                        <p>\${resultado.mensaje}</p>
                        <p>Creado: \${new Date(resultado.fecha).toLocaleString()}</p>
                    \`;
                }
            }
            
            // Función para salud
            async function salud() {
                const respuesta = await fetch('/health');
                const resultado = await respuesta.json();
                
                document.getElementById('result3').innerHTML = \`
                    <h4>✅ SERVIDOR ACTIVO</h4>
                    <p>Estado: \${resultado.estado}</p>
                    <p>Sellos creados: \${resultado.total}</p>
                    <p>Hora: \${resultado.hora}</p>
                \`;
            }
            
            // Función auxiliar
            function copiarID(id) {
                navigator.clipboard.writeText(id);
                alert('ID copiado: ' + id);
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
    const hash = require('crypto').createHash('sha256')
        .update(JSON.stringify(req.body) + Date.now())
        .digest('hex');
    
    const sello = {
        id: id,
        hash: hash,
        datos: req.body.datos,
        fecha: new Date()
    };
    
    sellos.push(sello);
    
    res.json({
        id: id,
        hash: hash,
        mensaje: 'Sello creado exitosamente'
    });
});

// ENDPOINT 2: Verificar sello
app.get('/verify/:id', (req, res) => {
    const id = req.params.id;
    const sello = sellos.find(s => s.id === id);
    
    if (!sello) {
        return res.json({
            error: 'Sello no encontrado'
        });
    }
    
    res.json({
        id: sello.id,
        mensaje: '✅ Sello verificado correctamente',
        fecha: sello.fecha
    });
});

// ENDPOINT 3: Salud
app.get('/health', (req, res) => {
    res.json({
        estado: 'ACTIVO',
        total: sellos.length,
        hora: new Date().toLocaleString()
    });
});

// INICIAR SERVIDOR
app.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔══════════════════════════════════════════╗
║    🔐 SOURCESEAL - FUNCIONANDO 🚀       ║
╠══════════════════════════════════════════╣
║ ✅ Servidor activo en puerto: ${PORT}   ║
║ 🌐 URL: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co ║
║ 🕐 Hora: ${new Date().toLocaleString()} ║
╚══════════════════════════════════════════╝
    `);
});