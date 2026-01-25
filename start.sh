#!/bin/bash
# Iniciar backend
npm run dev &
BACKEND_PID=$!

# Esperar 2 segundos
sleep 2

# Iniciar frontend
cd client
npm run dev &
FRONTEND_PID=$!

# Mantener script corriendo
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "App corriendo en:"
echo "- Backend: http://localhost:5000"
echo "- Frontend: http://localhost:5173"
echo "Presiona Ctrl+C para detener"

wait $BACKEND_PID $FRONTEND_PID