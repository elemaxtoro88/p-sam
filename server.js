const express = require('express');
const cors = require('cors');
const path = require('path');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Servir archivos estáticos de la carpeta /web
app.use(express.static(path.join(__dirname, 'web')));

// Endpoint Proxy para Gemini
app.post('/api/analyze', (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: { message: "GEMINI_API_KEY no configurada en el servidor" } });
    }

    const model = 'gemini-1.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const data = JSON.stringify(req.body);

    const apiReq = https.request(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        }
    }, (apiRes) => {
        let body = '';
        apiRes.on('data', (chunk) => body += chunk);
        apiRes.on('end', () => {
            res.status(apiRes.statusCode).send(body);
        });
    });

    apiReq.on('error', (e) => {
        console.error(e);
        res.status(500).json({ error: { message: "Error al contactar con Gemini" } });
    });

    apiReq.write(data);
    apiReq.end();
});

// Ruta por defecto para el index
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'web', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor iniciado en puerto ${PORT}`);
});
