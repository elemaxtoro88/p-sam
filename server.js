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

// Endpoints
app.post('/api/analyze', (req, res) => handleAIRequest(req, res));
app.post('/api/simulate', (req, res) => handleAIRequest(req, res));

// API 404 handler - prevents returning index.html for missing API calls
app.use('/api/*', (req, res) => {
    res.status(404).json({ error: { message: `API Endpoint ${req.originalUrl} not found` } });
});

/**
 * Lógica de Fallback: Intenta Gemini, si falla y hay clave de xAI, intenta Grok.
 */
async function handleAIRequest(req, res) {
    const geminiKey = process.env.GEMINI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY; // Switching to Groq as in Master Psico
    const xaiKey = process.env.XAI_API_KEY;

    if (!geminiKey && !groqKey && !xaiKey) {
        console.error("ERROR: No API keys configured.");
        return res.status(500).json({ error: { message: "No API keys configured on server." } });
    }

    console.log(`[IA Request] Endpoint: ${req.url} | Method: ${req.method}`);
    // Log body keys to see what's being sent
    console.log(`[IA Request] Body keys: ${Object.keys(req.body || {})}`);

    try {
        // 1. Intentar Gemini primero (con reintentos en diferentes modelos si falla el 404)
        if (geminiKey) {
            console.log("Intentando con Google Gemini (flash-latest)...");
            try {
                const geminiResult = await callGemini(req.body, geminiKey, 'gemini-1.5-flash-latest');
                return res.json(geminiResult);
            } catch (err1) {
                console.warn(`Gemini-1.5-flash-latest falló: ${err1.message}`);
                console.log("Intentando con Google Gemini (pro-latest) como respaldo...");
                const geminiResult = await callGemini(req.body, geminiKey, 'gemini-1.5-pro-latest');
                return res.json(geminiResult);
            }
        } else {
            throw new Error("No hay clave de Gemini (GEMINI_API_KEY).");
        }
    } catch (geminiError) {
        console.warn(`Todos los intentos de Gemini fallaron: ${geminiError.message}`);

        // 2. Fallback a Groq (Llama 3) si está disponible
        if (groqKey) {
            console.log("Fallback: Intentando con Groq (Llama 3)...");
            try {
                const grokResult = await callGroq(req.body, groqKey);
                return res.json(grokResult);
            } catch (groqError) {
                console.error(`Groq también falló (Clave inválida?): ${groqError.message}`);
                return res.status(500).json({ error: { message: `Falla Total. Gemini: ${geminiError.message} | Groq: ${groqError.message}. Verifica tus claves de API en Render.` } });
            }
        } else if (xaiKey) {
            console.log("Fallback: Intentando con xAI (Grok)...");
            try {
                const grokResult = await callGrok(req.body, xaiKey);
                return res.json(grokResult);
            } catch (xaiError) {
                console.error(`Grok también falló: ${xaiError.message}`);
                return res.status(500).json({ error: { message: `Falla Total. Gemini: ${geminiError.message} | xAI: ${xaiError.message}` } });
            }
        } else {
            return res.status(500).json({ error: { message: `Gemini falló y no hay claves de respaldo (GROQ_API_KEY o XAI_API_KEY) configuradas. Error: ${geminiError.message}` } });
        }
    }
}

/**
 * Llamada a Google Gemini
 */
function callGemini(body, key, model = 'gemini-1.5-flash') {
    return new Promise((resolve, reject) => {
        // Using v1beta for better model coverage
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
        const data = JSON.stringify(body);

        const req = https.request(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
            timeout: 10000
        }, (res) => {
            let resBody = '';
            res.on('data', chunk => resBody += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(resBody);
                    if (res.statusCode !== 200) {
                        const msg = parsed.error?.message || "Error en Gemini API";
                        return reject(new Error(msg));
                    }
                    if (!parsed.candidates || parsed.candidates.length === 0) {
                        console.warn("Gemini: Missing candidates. Full response:", JSON.stringify(parsed));
                        return reject(new Error("Gemini no devolvió candidatos (posible filtro de seguridad)"));
                    }
                    console.log("Gemini: Success response received.");
                    resolve(parsed);
                } catch (e) {
                    reject(new Error("Error parseando respuesta de Gemini"));
                }
            });
        });

        req.on('timeout', () => { req.destroy(); reject(new Error("Timeout en Gemini (10s)")); });
        req.on('error', e => reject(e));
        req.write(data);
        req.end();
    });
}

/**
 * Llamada a Groq (Llama 3) — Como en Master Psico
 */
function callGroq(geminiStyleBody, key) {
    return new Promise((resolve, reject) => {
        const url = 'https://api.groq.com/openai/v1/chat/completions';
        const promptText = geminiStyleBody.contents?.[0]?.parts?.[0]?.text || "";

        const data = JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: 'Eres un asistente educativo especializado en Gestión del Tiempo del Proyecto Desafíos.' },
                { role: 'user', content: promptText }
            ],
            temperature: 0.6
        });

        const req = https.request(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${key}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            },
            timeout: 10000
        }, (res) => {
            let resBody = '';
            res.on('data', chunk => resBody += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(resBody);
                    if (res.statusCode !== 200) {
                        return reject(new Error(parsed.error?.message || "Error en Groq API"));
                    }
                    const content = parsed.choices?.[0]?.message?.content || "";
                    if (!content) return reject(new Error("Groq devolvió una respuesta vacía"));

                    console.log("Groq: Success response received.");
                    resolve({
                        candidates: [{ content: { parts: [{ text: content }] } }]
                    });
                } catch (e) {
                    reject(new Error("Error parseando respuesta de Groq"));
                }
            });
        });

        req.on('timeout', () => { req.destroy(); reject(new Error("Timeout en Groq (10s)")); });
        req.on('error', e => reject(e));
        req.write(data);
        req.end();
    });
}

/**
 * Llamada a xAI (Grok)
 */
function callGrok(geminiStyleBody, key) {
    return new Promise((resolve, reject) => {
        const url = 'https://api.x.ai/v1/chat/completions';
        const promptText = geminiStyleBody.contents?.[0]?.parts?.[0]?.text || "";

        const data = JSON.stringify({
            model: 'grok-beta',
            messages: [
                { role: 'system', content: 'Eres un asistente educativo especializado en Gestión del Tiempo del Proyecto Desafíos.' },
                { role: 'user', content: promptText }
            ],
            temperature: 0.6
        });

        const req = https.request(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${key}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            },
            timeout: 10000
        }, (res) => {
            let resBody = '';
            res.on('data', chunk => resBody += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(resBody);
                    if (res.statusCode !== 200) {
                        const errorDetail = parsed.error?.message || JSON.stringify(parsed.error) || "Error en xAI API";
                        console.error(`Grok API Status ${res.statusCode}:`, errorDetail);
                        return reject(new Error(errorDetail));
                    }
                    const content = parsed.choices?.[0]?.message?.content || "";
                    if (!content) return reject(new Error("Grok devolvió una respuesta vacía"));

                    // Convertir a formato Gemini para que el frontend no note la diferencia
                    console.log("Grok: Success response received.");
                    resolve({
                        candidates: [{ content: { parts: [{ text: content }] } }]
                    });
                } catch (e) {
                    reject(new Error("Error parseando respuesta de xAI"));
                }
            });
        });

        req.on('timeout', () => { req.destroy(); reject(new Error("Timeout en xAI (10s)")); });
        req.on('error', e => reject(e));
        req.write(data);
        req.end();
    });
}

// Ruta por defecto para el index
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'web', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor iniciado en puerto ${PORT}`);
});
