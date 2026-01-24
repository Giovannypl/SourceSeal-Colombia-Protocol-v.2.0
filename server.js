const express = require('express');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());
// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Almacenamiento en memoria (reemplazar con base de datos en producción)
const seals = new Map();

// Endpoint: Página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint: Crear sello ZKP
app.post('/seal', (req, res) => {
  try {
    const { data, userId, metadata } = req.body;

    // Generar un ID único
    const sealId = crypto.randomUUID();
    
    // Crear un hash (simulando un sello ZKP)
    const sealHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(data) + Date.now() + sealId)
      .digest('hex');

    // Marcar como honeytoken si se especifica
    const isHoneytoken = metadata?.isHoneytoken || false;

    const seal = {
      id: sealId,
      hash: sealHash,
      data: data,
      userId: userId || 'anonymous',
      timestamp: new Date(),
      isHoneytoken: isHoneytoken,
      verified: false
    };

    // Guardar en memoria
    seals.set(sealId, seal);

    res.json({
      success: true,
      sealId: sealId,
      sealHash: sealHash,
      isHoneytoken: isHoneytoken,
      message: 'Sello ZKP creado exitosamente',
      verifyUrl: `https://${req.get('host')}/verify/${sealId}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint: Verificar sello
app.get('/verify/:id', (req, res) => {
  const sealId = req.params.id;
  const seal = seals.get(sealId);

  if (!seal) {
    return res.status(404).json({ 
      success: false, 
      message: 'Sello no encontrado' 
    });
  }

  // Marcar como verificado
  seal.verified = true;
  seals.set(sealId, seal);

  res.json({
    success: true,
    sealId: sealId,
    hash: seal.hash,
    isHoneytoken: seal.isHoneytoken,
    verified: true,
    timestamp: seal.timestamp,
    message: seal.isHoneytoken 
      ? '⚠️ ¡ALERTA! Este es un honeytoken. Posible intento de acceso no autorizado.' 
      : '✅ Sello verificado correctamente.'
  });
});

// Endpoint: Estado del servidor
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date(),
    sealsCount: seals.size 
  });
});

// Mantén tus logs actuales
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor iniciado EXITOSAMENTE`);
  console.log(`✔ Puerto: ${PORT}`);
  console.log(`   URL Principal: https://workspace.paredesharold62.repl.co`);
  console.log(`   URL Alternativa: https://workspace--paredesharold62.repl.co`);
  console.log(`   Hora: ${new Date().toLocaleString()}`);
  console.log('\n❌ ¡FELICIDADES! LO LOGRASTE:');
  console.log('1. El servidor está funcionando');
  console.log('2. Replit está sirviendo tu app');
  console.log('3. Ahora tienes una API pública');
  console.log('4. Cualquiera puede usarla');
});