#!/bin/bash
echo "Iniciando inyección de API Key..."

# Busca app.js en la raíz o en la carpeta web/ y reemplaza la clave
if [ -f "web/app.js" ]; then
    sed -i "s/REPLACE_WITH_GEMINI_API_KEY/$GEMINI_API_KEY/g" web/app.js
    echo "Clave inyectada en web/app.js"
elif [ -f "app.js" ]; then
    sed -i "s/REPLACE_WITH_GEMINI_API_KEY/$GEMINI_API_KEY/g" app.js
    echo "Clave inyectada en app.js"
else
    echo "ERROR: No se encontró app.js"
    exit 1
fi

echo "Build completado con éxito."
