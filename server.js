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

// Endpoint Proxy para IA (Grok o Gemini)
app.post('/api/analyze', (req, res) => {
    const geminiKey = process.env.GEMINI_API_KEY;
    const xaiKey = process.env.XAI_API_KEY;

    if (!xaiKey && !geminiKey) {
        return res.status(500).json({ error: { message: "No API keys (XAI or GEMINI) configured on server" } });
    }

    // Preferir Grok si está configurado, o usar Gemini como fallback
    if (xaiKey) {
        console.log("Usando xAI (Grok)...");
        const url = 'https://api.x.ai/v1/chat/completions';

        // Extraer el texto del formato que envía el frontend (Gemini style) y convertir a Chat Message
        const promptText = req.body.contents?.[0]?.parts?.[0]?.text || "";

        const data = JSON.stringify({
            model: 'grok-beta',
            messages: [
                { role: 'system', content: 'Eres un asistente educativo especializado en Gestión del Tiempo.' },
                { role: 'user', content: promptText }
            ],
            temperature: 0.6
        });

        const apiReq = https.request(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${xaiKey}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        }, (apiRes) => {
            let body = '';
            apiRes.on('data', (chunk) => body += chunk);
            apiRes.on('end', () => {
                // Adaptamos la respuesta de OpenAI a lo que espera el frontend (Gemini style)
                try {
                    const parsed = JSON.parse(body);
                    const content = parsed.choices?.[0]?.message?.content || "";
                    res.json({
                        candidates: [{ content: { parts: [{ text: content }] } }]
                    });
                } catch (e) {
                    res.status(apiRes.statusCode).send(body);
                }
            });
        });
        apiReq.on('error', (e) => res.status(500).json({ error: { message: "Error xAI: " + e.message } }));
        apiReq.write(data);
        apiReq.end();

    } else {
        console.log("Usando Google Gemini...");
        const model = 'gemini-1.5-flash';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
        const data = JSON.stringify(req.body);
        const apiReq = https.request(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
        }, (apiRes) => {
            let body = '';
            apiRes.on('data', (chunk) => body += chunk);
            apiRes.on('end', () => res.status(apiRes.statusCode).send(body));
        });
        apiReq.on('error', (e) => res.status(500).json({ error: { message: "Error Gemini: " + e.message } }));
        apiReq.write(data);
        apiReq.end();
    }
});

// Ruta por defecto para el index
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'web', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor iniciado en puerto ${PORT}`);
});
