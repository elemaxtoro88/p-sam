#!/bin/bash
# Proyecto Desafíos - Build Script
# No se requiere inyección de claves en el cliente ya que usamos un proxy en el servidor.
echo "Verificando estructura del proyecto..."

if [ ! -d "web" ]; then
    echo "ERROR: La carpeta 'web' no existe."
    exit 1
fi

if [ ! -f "server.js" ]; then
    echo "ERROR: No se encontró 'server.js'."
    exit 1
fi

echo "Entorno listo para deploy en Render."
echo "Build completado con éxito."
