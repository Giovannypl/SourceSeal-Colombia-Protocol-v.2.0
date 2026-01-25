cat > start.sh << 'EOF'
#!/bin/bash
echo "=== INICIANDO SOURCE SEAL PROTOCOL ==="

# 1. Iniciar backend (servidor API)
echo "1. Iniciando backend en puerto 5000..."
npm run dev &
BACKEND_PID=$!

# 2. Esperar 3 segundos para que el backend esté listo
echo "2. Esperando inicialización del backend..."
sleep 3

# 3. Iniciar frontend (cliente Vite)
echo "3. Iniciando frontend en puerto 5173..."
cd client
npm run dev &
FRONTEND_PID=$!
cd ..

# 4. Mostrar información
echo ""
echo "========================================"
echo "✅ APLICACIÓN INICIADA CORRECTAMENTE"
echo "========================================"
echo "- Frontend (UI): http://localhost:5173"
echo "- Backend (API): http://localhost:5000"
echo "- Replit URL: https://$(echo $REPL_SLUG).$(echo $REPL_OWNER).repl.co"
echo ""
echo "Presiona Ctrl+C para detener ambos servicios"
echo "========================================"

# 5. Mantener script vivo y capturar Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'Servidores detenidos'; exit" SIGINT

# Esperar a que ambos procesos terminen
wait $BACKEND_PID $FRONTEND_PID
EOF