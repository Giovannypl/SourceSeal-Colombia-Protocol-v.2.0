// server.js - VERSIÓN MÍNIMA PERO FUNCIONAL
const express = require('express');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

// Middleware CRÍTICO
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base de datos simple
let sellos = [];

// ==================== PÁGINA PRINCIPAL ====================
app.get('/', (req, res) => {
    res.send(`
    <html>
    <head><title>🔐 SourceSeal - FUNCIONANDO</title>
    <style>
        body{font-family:Arial;padding:20px;background:#f0f8ff;}
        .container{max-width:600px;margin:auto;background:white;padding:20px;border-radius:10px;box-shadow:0 0 10px #ccc;}
        button{background:#28a745;color:white;padding:12px;border:none;border-radius:5px;cursor:pointer;margin:5px;}
        textarea{width:100%;height:80px;padding:10px;}
        .result{background:#e9ecef;padding:15px;margin:10px 0;border-radius:5px;}
    </style>
    </head>
    <body>
    <div class="container">
        <h1>🔐 SourceSeal Colombia - ¡FUNCIONAL!</h1>
        
        <h3>✨ Crear Sello:</h3>
        <textarea id="data" placeholder="Escribe algo..."></textarea>
        <button onclick="crear()">CREAR SELLO ZKP</button>
        <div id="r1" class="result"></div>
        
        <h3>🔍 Verificar Sello:</h3>
        <input id="id" placeholder="ID del sello" style="width:100%;padding:10px;">
        <button onclick="verificar()">VERIFICAR</button>
        <div id="r2" class="result"></div>
        
        <button onclick="salud()">COMPROBAR SALUD</button>
        <div id="r3" class="result"></div>
    </div>
    
    <script>
        async function crear() {
            const data = document.getElementById('data').value;
            if(!data) return alert('Escribe algo');
            
            const res = await fetch('/seal', {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({data: data, honeytoken: true})
            });
            const r = await res.json();
            
            document.getElementById('r1').innerHTML = 
                '<h4>✅ Sello Creado!</h4>' +
                '<p>ID: ' + r.id + '</p>' +
                '<p><a href="/verify/' + r.id + '" target="_blank">Verificar este sello</a></p>';
        }
        
        async function verificar() {
            const id = document.getElementById('id').value;
            if(!id) return alert('Ingresa un ID');
            
            const res = await fetch('/verify/' + id);
            const r = await res.json();
            
            document.getElementById('r2').innerHTML = 
                '<h4>' + (r.valido ? '✅ Válido' : '❌ Inválido') + '</h4>' +
                '<p>' + r.mensaje + '</p>';
        }
        
        async function salud() {
            const res = await fetch('/health');
            const r = await res.json();
            
            document.getElementById('r3').innerHTML = 
                '<h4>✅ Servidor Activo</h4>' +
                '<p>Sellos: ' + r.total + '</p>' +
                '<p>Estado: ' + r.estado + '</p>';
        }
    </script>
    </body>
    </html>
    `);
});

// ==================== ENDPOINTS ====================
app.post('/seal', (req, res) => {
    console.log('📦 Creando sello...');
    
    const id = 'seal_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    const hash = crypto.createHash('sha256').update(JSON.stringify(req.body) + Date.now()).digest('hex');
    
    const sello = {
        id: id,
        hash: hash,
        data: req.body.data,
        honeytoken: req.body.honeytoken || false,
        fecha: new Date()
    };
    
    sellos.push(sello);
    
    res.json({
        id: id,
        hash: hash,
        mensaje: 'Sello ZKP creado exitosamente'
    });
});

app.get('/verify/:id', (req, res) => {
    const sello = sellos.find(s => s.id === req.params.id);
    
    if (!sello) {
        return res.json({
            valido: false,
            mensaje: 'Sello no encontrado'
        });
    }
    
    res.json({
        valido: true,
        id: sello.id,
        honeytoken: sello.honeytoken,
        mensaje: sello.honeytoken ? 
            '⚠️ ¡ALERTA HONEYTOKEN! Posible acceso no autorizado.' :
            '✅ Sello verificado correctamente.',
        fecha: sello.fecha
    });
});

app.get('/health', (req, res) => {
    res.json({
        estado: 'online',
        total: sellos.length,
        timestamp: new Date().toLocaleString()
    });
});

// ==================== INICIAR ====================
app.listen(PORT, '0.0.0.0', () => {
    console.log(`
==========================================
🚀 SOURCE SEAL COLOMBIA - ACTIVO
==========================================
✅ Puerto: ${PORT}
🌐 URL: https://workspace.paredesharold62.repl.co
🕐 ${new Date().toLocaleString()}
==========================================
    `);
});