// En un NUEVO Replit
const express = require('express');
const app = express();
app.use(express.json());

let seals = [];

app.get('/', (req, res) => {
    res.send(`
        <h1>SourceSeal Colombia</h1>
        <button onclick="crear()">Crear Sello</button>
        <script>
            async function crear() {
                const res = await fetch('/seal', {
                    method: 'POST',
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify({data: 'prueba'})
                });
                const r = await res.json();
                alert('Sello creado: ' + r.id);
            }
        </script>
    `);
});

app.post('/seal', (req, res) => {
    const id = 'seal_' + Date.now();
    seals.push({id, data: req.body.data});
    res.json({id, message: 'Sello creado'});
});

app.listen(3000, () => console.log('✅ Funcionando'));