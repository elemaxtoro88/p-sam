/* ================================================
   APP.JS — Taller de ESI | Proyecto Desafíos
   ================================================ */

// ── Constants ─────────────────────────────────────
const STORAGE_KEY_THEME = 'desafios-theme';

// Asistente context
const SYSTEM_PROMPT = `Eres un asistente educativo del Proyecto Desafíos, especializado en el Taller de ESI (Educación Sexual Integral). 
Analiza las respuestas de los alumnos basándote en estos conceptos clave:

1. LIBERTAD vs CAPRICHO (Andrés Luetich): La libertad es la capacidad de elegir lo que nos acerca a metas a largo plazo, no el impulso inmediato.
2. PROACTIVIDAD: Tomar el control de la propia vida y decisiones, en lugar de reaccionar a impulsos externos.
3. SISTEMAS vs METAS (James Clear): Las metas son resultados; los sistemas son procesos. El cambio real ocurre en el sistema.
4. IDENTIDAD: El cambio más duradero empieza por "quién quiero ser" (identidad) y no solo "qué quiero lograr". Cada acción es un voto por tu identidad.
5. VOLUNTAD: El fortalecimiento del carácter a través de pequeñas decisiones diarias.

INSTRUCCIONES:
- Evalúa si el alumno diferencia libertad de capricho o proactividad de reactividad.
- Responde SIEMPRE en español.
- Marcadores: ✅ EXCELENTE, ⚠️ AMPLIAR, 💡 SUGERENCIA.
- Feedback breve y motivador (2-3 oraciones).`;

// ── Theme ──────────────────────────────────────────
function initTheme() {
    const saved = localStorage.getItem(STORAGE_KEY_THEME) || 'light';
    setTheme(saved);
}

function setTheme(mode) {
    const html = document.documentElement;
    const icon = document.getElementById('themeIcon');
    if (mode === 'dark') {
        html.classList.add('dark');
        if (icon) icon.textContent = 'light_mode';
        localStorage.setItem(STORAGE_KEY_THEME, 'dark');
    } else {
        html.classList.remove('dark');
        if (icon) icon.textContent = 'dark_mode';
        localStorage.setItem(STORAGE_KEY_THEME, 'light');
    }
}

function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'light' : 'dark');
}

// ── Accordion ─────────────────────────────────────
function initAccordions() {
    document.querySelectorAll('.accordion-header').forEach(btn => {
        btn.addEventListener('click', () => {
            const body = btn.nextElementSibling;
            const isOpen = body.classList.contains('open');
            // Close all
            document.querySelectorAll('.accordion-body').forEach(b => b.classList.remove('open'));
            document.querySelectorAll('.accordion-header').forEach(b => b.classList.remove('active'));
            // Toggle clicked
            if (!isOpen) {
                body.classList.add('open');
                btn.classList.add('active');
            }
        });
    });
}

// ── Tabs ──────────────────────────────────────────
function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const group = btn.closest('[data-tabs]');
            const target = btn.dataset.tab;
            group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            group.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const content = group.querySelector(`[data-tab-content="${target}"]`);
            if (content) content.classList.add('active');
        });
    });
}

// ── Hero Particles ─────────────────────────────────
function initParticles() {
    const container = document.querySelector('.hero-particles');
    if (!container) return;

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'hero-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = (60 + Math.random() * 40) + '%';
        particle.style.animationDuration = (5 + Math.random() * 8) + 's';
        particle.style.animationDelay = (Math.random() * 8) + 's';
        particle.style.width = (2 + Math.random() * 4) + 'px';
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
}

// ── Scroll Reveal ─────────────────────────────────
function initScrollReveal() {
    const sections = document.querySelectorAll('.reveal-section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    sections.forEach(section => observer.observe(section));
}

// ── 3D Parallax on Mouse Move ─────────────────────
function initParallax() {
    const shapes = document.querySelectorAll('.shape');
    if (shapes.length === 0) return;

    let ticking = false;
    document.addEventListener('mousemove', (e) => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            shapes.forEach((shape, i) => {
                const factor = (i + 1) * 8;
                shape.style.transform = `translate3d(${x * factor}px, ${y * factor}px, 0)`;
            });
            ticking = false;
        });
    });
}

// ── Progress Rings ─────────────────────────────────
function setRing(id, pct) {
    const circle = document.getElementById(id);
    if (!circle) return;
    const r = circle.getAttribute('r');
    const circumference = 2 * Math.PI * r;
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference * (1 - pct / 100);
}

function updateProgressRings() {
    const answers = document.querySelectorAll('.qa-textarea');
    let filled = 0;
    answers.forEach(a => { if (a.value.trim().length > 20) filled++; });
    const pct = Math.round((filled / answers.length) * 100) || 0;
    setRing('ringProgress', pct);
    const el = document.getElementById('ringPct');
    if (el) el.textContent = pct + '%';

    // Activity completion
    const acts = document.querySelectorAll('.activity-textarea');
    let actFilled = 0;
    acts.forEach(a => { if (a.value.trim().length > 10) actFilled++; });
    const actPct = Math.round((actFilled / Math.max(acts.length, 1)) * 100) || 0;
    setRing('ringActivity', actPct);
    const el2 = document.getElementById('ringActPct');
    if (el2) el2.textContent = actPct + '%';
}

// ── Analyze SINGLE Question with AI ─────────────────
async function analyzeSingle(button) {
    const card = button.closest('.qa-card');
    if (!card) return;

    const textarea = card.querySelector('.qa-textarea');
    const feedbackEl = card.querySelector('.qa-feedback');
    const label = card.querySelector('.qa-label')?.textContent || 'Pregunta';
    const answer = textarea?.value?.trim() || '';

    if (answer.length < 5) {
        showToast('Escribí al menos una reflexión antes de analizar', 'error');
        textarea?.focus();
        return;
    }

    console.log(`[Analyze] Question: ${label}`);

    // UI: loading state
    button.disabled = true;
    const originalHTML = button.innerHTML;
    button.innerHTML = '<span class="spinner"></span>&nbsp;Analizando...';

    try {
        const resp = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${SYSTEM_PROMPT}\n\nAnaliza la siguiente respuesta de un alumno sobre Gestión del Tiempo. Da feedback breve (máximo 3 oraciones). Usa el marcador ✅ EXCELENTE, ⚠️ AMPLIAR o 💡 SUGERENCIA al inicio:\n\nPREGUNTA: ${label}\nRESPUESTA: ${answer}`
                    }]
                }],
                generationConfig: {
                    temperature: 0.6,
                    maxOutputTokens: 500,
                }
            })
        });

        const contentType = resp.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const raw = await resp.text();
            console.error("[Analyze] Non-JSON response:", raw.substring(0, 200));
            throw new Error(`El servidor devolvió un error inesperado (E${resp.status}). Revisa que el servidor esté actualizado.`);
        }

        const data = await resp.json();
        console.log('[Analyze] Response data:', data);

        if (!resp.ok) {
            const errorMsg = data.error?.message || data.message || `Error ${resp.status}`;
            throw new Error(errorMsg);
        }

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            throw new Error("La IA no devolvió una respuesta válida. Intentá de nuevo.");
        }

        // Parse and display feedback
        if (feedbackEl) {
            const cleanFb = text.trim();
            let cls = 'suggest';
            let badge = '💡 Sugerencia';
            if (cleanFb.includes('✅') || cleanFb.toLowerCase().includes('excelente')) {
                cls = 'good'; badge = '✅ Excelente';
            } else if (cleanFb.includes('⚠️') || cleanFb.toLowerCase().includes('ampliar')) {
                cls = 'improve'; badge = '⚠️ Ampliar';
            }

            const displayText = cleanFb.replace(/^[✅⚠️💡]\s*(EXCELENTE|AMPLIAR|SUGERENCIA)[:\s]*/i, '').replace(/\n/g, '<br>');
            feedbackEl.innerHTML = `<div class="feedback-badge">${badge}</div>${displayText}`;
            feedbackEl.className = `qa-feedback ${cls} has-feedback show`;
        }

        showToast('✅ Feedback recibido', 'success');
    } catch (err) {
        console.error('API Error:', err);
        if (feedbackEl) {
            feedbackEl.innerHTML = `<div class="feedback-badge" style="color:var(--error)">⚠️ Error</div>Hubo un problema al analizar tu respuesta: ${err.message}. Por favor, verifica que el servidor esté funcionando correctamente.`;
            feedbackEl.className = 'qa-feedback improve has-feedback show';
        }
        showToast('Error: ' + err.message, 'error');
    } finally {
        button.disabled = false;
        button.innerHTML = originalHTML;
    }
}

// ── Analyze ALL Questions (bulk) ──────────────────
async function analyzeReflections() {
    const cards = document.querySelectorAll('.qa-card');
    let allAnswers = '';
    let hasContent = false;
    cards.forEach((card, i) => {
        const textarea = card.querySelector('.qa-textarea');
        const label = card.querySelector('.qa-label')?.textContent || `Pregunta ${i + 1}`;
        const answer = textarea?.value?.trim() || '';
        if (answer.length > 5) hasContent = true;
        allAnswers += `\nPREGUNTA ${i + 1}: ${label}\nRESPUESTA: ${answer || '(sin respuesta)'}\n`;
    });

    if (!hasContent) {
        showToast('Escribí al menos una respuesta antes de analizar', 'error');
        return;
    }

    const analyzeBtn = document.getElementById('analyzeBtn');
    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = '<span class="spinner"></span>&nbsp;Analizando todas...';

    try {
        const resp = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${SYSTEM_PROMPT}\n\nAnaliza las siguientes respuestas de un alumno sobre el Taller de ESI. Para cada pregunta, da un feedback breve (máximo 3 oraciones). Usa el marcador ✅ EXCELENTE, ⚠️ AMPLIAR o 💡 SUGERENCIA al inicio de cada feedback. Separa cada feedback con "PREGUNTA X:" al inicio. \n\nIMPORTANTE: Finaliza tu respuesta con una sección llamada "CONCLUSIÓN GENERAL:" donde resumas el desempeño global del alumno y le des un consejo final motivador.\n\nRespuestas del alumno:\n${allAnswers}`
                    }]
                }],
                generationConfig: {
                    temperature: 0.6,
                    maxOutputTokens: 2000,
                }
            })
        });

        const data = await resp.json();

        if (!resp.ok) {
            const errorMsg = data.error?.message || `Error ${resp.status}: ${JSON.stringify(data)}`;
            throw new Error(errorMsg);
        }

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (!text) {
            console.error("Bulk Analyze: No text in response. Data:", data);
            throw new Error("La IA no devolvió una respuesta para el análisis masivo.");
        }
        parseFeedback(text, cards);
        showToast('✅ Análisis completado', 'success');

        // Update Global Feedback UI
        const globalFb = document.getElementById('globalFeedback');
        const globalContent = document.getElementById('globalFeedbackContent');
        if (globalFb && globalContent) {
            const conclusionMatch = text.match(/CONCLUSIÓN GENERAL:([\s\S]*)$/i);
            if (conclusionMatch && conclusionMatch[1]) {
                globalContent.innerHTML = `<strong>Conclusión General:</strong><br>${conclusionMatch[1].trim().replace(/\n/g, '<br>')}`;
                globalFb.classList.add('active');
            }
        }

    } catch (err) {
        console.error('API Error:', err);
        showToast('Error: ' + err.message, 'error');
    } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = '<span class="material-symbols-outlined">psychology</span>&nbsp;Analizar Todas las Reflexiones';
    }
}

function parseFeedback(text, cards) {
    // Remove the general conclusion before splitting questions
    const cleanText = text.split(/CONCLUSIÓN GENERAL:/i)[0];
    const blocks = cleanText.split(/(?=PREGUNTA\s*\d+|^\d+[\.\):])/mi);

    let feedbacks = [];
    if (blocks.length > 1) {
        feedbacks = blocks.filter(b => b.trim()).slice(0, cards.length);
    } else {
        feedbacks = text.split(/\n{2,}/).filter(b => b.trim()).slice(0, cards.length);
    }

    cards.forEach((card, i) => {
        const fb = feedbacks[i];
        const fbEl = card.querySelector('.qa-feedback');
        if (!fbEl || !fb) return;

        const cleanFb = fb.replace(/^(PREGUNTA\s*\d+[:\s]*)/i, '').trim();
        if (!cleanFb) return;

        let cls = 'suggest';
        let badge = '💡 Sugerencia';
        if (cleanFb.includes('✅') || cleanFb.toLowerCase().includes('excelente')) {
            cls = 'good'; badge = '✅ Excelente';
        } else if (cleanFb.includes('⚠️') || cleanFb.toLowerCase().includes('ampliar')) {
            cls = 'improve'; badge = '⚠️ Ampliar';
        }

        fbEl.innerHTML = `<div class="feedback-badge">${badge}</div>${cleanFb.replace(/^[✅⚠️💡]\s*(EXCELENTE|AMPLIAR|SUGERENCIA)[:\s]*/i, '').replace(/\n/g, '<br>')}`;
        fbEl.className = `qa-feedback ${cls} has-feedback show`;
    });
}

// ── Simulator (uses second AI endpoint or same) ────
async function runSimulator() {
    const input = document.getElementById('simulatorInput');
    const result = document.getElementById('simulatorResult');
    const btn = document.getElementById('simulateBtn');

    if (!input || !result || !btn) return;

    const scenario = input.value.trim();
    if (scenario.length < 10) {
        showToast('Describí una situación más detallada para simular', 'error');
        input.focus();
        return;
    }

    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span>&nbsp;Simulando...';
    result.className = 'simulator-result';
    // Removed result.style.display = 'none' to avoid overriding CSS "show" class

    try {
        const resp = await fetch('/api/simulate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Eres un coach de ética y ESI para estudiantes. Un alumno te presenta un dilema o situación de decisión:

"${scenario}"

Analiza la situación usando:
- Libertad vs Capricho (Luetich)
- Proactividad vs Reactividad
- Votos de Identidad (James Clear)

Da un análisis breve:
1. 🎯 Tu recomendación ética
2. 🏁 Cómo esto afecta su libertad a largo plazo
3. 💡 Un consejo para fortalecer su proactividad.`
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 600,
                }
            })
        });

        const data = await resp.json();

        if (!resp.ok) {
            throw new Error(data.error?.message || `Error ${resp.status}`);
        }

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No se pudo generar una respuesta.';
        result.innerHTML = text.replace(/\n/g, '<br>');
        result.className = 'simulator-result success show';
        showToast('🤖 Simulación completada', 'success');

    } catch (err) {
        console.error('Simulator Error:', err);
        result.innerHTML = `<span class="material-symbols-outlined" style="color:var(--error); vertical-align:text-bottom;">error</span> <strong>Error:</strong> ${err.message}`;
        result.className = 'simulator-result error show'; // Use error class
        showToast('Error en simulador: ' + err.message, 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<span class="material-symbols-outlined">smart_toy</span>&nbsp;Simular con IA';
    }
}

// ── PDF Generation ────────────────────────────────
async function downloadPDF() {
    const nombre = document.getElementById('studentName')?.value?.trim();
    const curso = document.getElementById('studentCurso')?.value?.trim() || '';
    const turno = document.getElementById('studentTurno')?.value;

    if (!nombre) {
        showToast('Ingresá tu nombre antes de descargar', 'error');
        document.getElementById('studentName')?.focus();
        return;
    }

    const pdfBtn = document.getElementById('pdfBtn');
    pdfBtn.disabled = true;
    pdfBtn.innerHTML = '<span class="spinner"></span>&nbsp;Generando PDF...';

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const pageW = 210; const pageH = 297;
        const marginL = 18; const marginR = 18; const contentW = pageW - marginL - marginR;
        let y = 18;

        // Colors
        const blue = [0, 74, 198];
        const orange = [253, 118, 26];
        const darkText = [19, 27, 46];
        const grayText = [100, 110, 130];
        const lightBg = [242, 243, 255];

        const checkPage = (needed = 12) => {
            if (y + needed > pageH - 18) { doc.addPage(); y = 18; }
        };

        // ── Header ──
        doc.setFillColor(...blue);
        doc.rect(0, 0, pageW, 38, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(15);
        doc.text('Taller de ESI · Proyecto Desafíos', marginL, 14);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('INSTITUTO SUPERIOR PEDRO GOYENA', marginL, 22);
        doc.text(`Fecha: ${new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}`, marginL, 29);

        const turnoLabel = turno === 'tarde' ? 'Turno Tarde' : 'Turno Mañana';
        doc.text(turnoLabel, pageW - 48, 14.5);

        // ── Rubric Seal (Stamp) ──
        const progressEl = document.getElementById('ringProgress');
        let progressVal = 0;
        if (progressEl) {
            // Get progress from the text element which is easier
            const pctText = document.getElementById('ringPct')?.textContent || '0%';
            progressVal = parseInt(pctText);
        }

        let rubric = 'Regular';
        let rubricColor = [186, 26, 26]; // Error/Red
        if (progressVal >= 90) { rubric = 'EXCELENTE'; rubricColor = [0, 74, 198]; }
        else if (progressVal >= 70) { rubric = 'MUY BIEN'; rubricColor = [99, 46, 205]; }
        else if (progressVal >= 40) { rubric = 'BIEN'; rubricColor = [253, 118, 26]; }

        doc.setDrawColor(...rubricColor);
        doc.setLineWidth(1.5);
        doc.rect(pageW - 50, 22, 34, 12);
        doc.setTextColor(...rubricColor);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        const rubricW = doc.getTextWidth(rubric);
        doc.text(rubric, pageW - 33 - (rubricW / 2), 30);
        doc.setFontSize(6);
        doc.text('CALIFICACIÓN', pageW - 33 - (doc.getTextWidth('CALIFICACIÓN') / 2), 26);

        y = 46;

        // ── Student Info ──
        doc.setFillColor(...lightBg);
        doc.roundedRect(marginL, y, contentW, 18, 3, 3, 'F');
        doc.setTextColor(...darkText);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(`Alumno/a: ${nombre}`, marginL + 6, y + 8);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...grayText);
        const infoLine = `Turno: ${turnoLabel}` + (curso ? ` · Curso: ${curso}` : '');
        doc.text(infoLine, marginL + 6, y + 14);
        y += 26;

        // ── Section: Resumen de Conceptos ──
        checkPage(12);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(...blue);
        doc.text('RESUMEN — CONCEPTOS CLAVE', marginL, y);
        doc.setDrawColor(...blue);
        doc.setLineWidth(0.8);
        doc.line(marginL, y + 2, marginL + 80, y + 2);
        y += 9;

        const concepts = [
            ['Libertad vs Capricho', 'La libertad es elegir lo que nos hace bien a largo plazo. El capricho es esclavo del impulso inmediato.'],
            ['Proactividad', 'Tomar la iniciativa y elegir nuestra respuesta ante los estímulos del entorno.'],
            ['Sistemas vs Metas', 'No te enfoques solo en el resultado, sino en el proceso diario que te llevará allí.'],
            ['Identidad', 'Cada acción es un voto para la persona en la que te quieres convertir.'],
            ['Voluntad', 'La capacidad de decidir lo correcto por encima de lo fácil o placentero.'],
        ];
        concepts.forEach(([title, desc]) => {
            checkPage(16);
            doc.setFillColor(...lightBg);
            doc.roundedRect(marginL, y, contentW, 13, 2, 2, 'F');
            doc.setDrawColor(...orange);
            doc.setLineWidth(1.2);
            doc.line(marginL, y, marginL, y + 13);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(...darkText);
            doc.text(title, marginL + 4, y + 5);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(...grayText);
            const lines = doc.splitTextToSize(desc, contentW - 6);
            doc.text(lines[0], marginL + 4, y + 10);
            y += 16;
        });

        // ── Section: Actividades ──
        checkPage(14);
        y += 4;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(...blue);
        doc.text('MIS ACTIVIDADES', marginL, y);
        doc.line(marginL, y + 2, marginL + 60, y + 2);
        y += 9;

        const actTextareas = document.querySelectorAll('.activity-textarea');
        const actLabels = document.querySelectorAll('.activity-label');
        actTextareas.forEach((ta, i) => {
            const val = ta.value.trim();
            if (!val) return;
            const lbl = actLabels[i]?.textContent || `Actividad ${i + 1}`;
            checkPage(20);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8.5);
            doc.setTextColor(...darkText);
            doc.text(lbl.substring(0, 70), marginL, y);
            y += 5;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(...grayText);
            const lines = doc.splitTextToSize(val, contentW);
            lines.slice(0, 4).forEach(line => {
                checkPage(6);
                doc.text(line, marginL + 3, y);
                y += 5;
            });
            y += 3;
        });

        // ── Section: Q&A Reflexiones ──
        checkPage(14);
        y += 2;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(...blue);
        doc.text('MIS REFLEXIONES', marginL, y);
        doc.line(marginL, y + 2, marginL + 60, y + 2);
        y += 9;

        const qaCards = document.querySelectorAll('.qa-card');
        qaCards.forEach((card, i) => {
            const qa = card.querySelector('.qa-textarea')?.value?.trim();
            if (!qa) return;
            const lbl = card.querySelector('.qa-label')?.textContent || `Pregunta ${i + 1}`;
            const fb = card.querySelector('.qa-feedback')?.innerText?.trim();
            checkPage(20);

            doc.setFillColor(...lightBg);
            doc.roundedRect(marginL, y, contentW, 6, 1.5, 1.5, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8.5);
            doc.setTextColor(...blue);
            doc.text(`P${i + 1}. ${lbl.substring(0, 72)}`, marginL + 3, y + 4.2);
            y += 8;

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(...darkText);
            const lines = doc.splitTextToSize(qa, contentW - 4);
            lines.slice(0, 3).forEach(line => {
                checkPage(5);
                doc.text(line, marginL + 3, y);
                y += 4.8;
            });

            if (fb && !fb.includes('Escribí tu reflexión') && !fb.includes('Reflexiona sobre')) {
                checkPage(12);
                const fbClean = fb.replace(/[✅⚠️💡]/g, '').replace('Excelente', '').replace('Ampliar', '').replace('Sugerencia', '').trim();
                doc.setFont('helvetica', 'italic');
                doc.setFontSize(7.5);
                doc.setTextColor(...orange);
                const fbLines = doc.splitTextToSize('Feedback: ' + fbClean, contentW - 6);
                fbLines.forEach(line => {
                    checkPage(4);
                    doc.text(line, marginL + 3, y);
                    y += 4;
                });
            }
            y += 5;
            y += 4;
        });

        // ── Footer on each page ──
        const totalPages = doc.getNumberOfPages();
        for (let pg = 1; pg <= totalPages; pg++) {
            doc.setPage(pg);
            doc.setFillColor(...blue);
            doc.rect(0, pageH - 10, pageW, 10, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7);
            doc.text('INSTITUTO SUPERIOR PEDRO GOYENA · Proyecto Desafíos · Taller de ESI', marginL, pageH - 4);
            doc.text(`Pág. ${pg} / ${totalPages}`, pageW - 25, pageH - 4);
        }

        // Save
        const safeName = nombre.replace(/[^a-zA-ZáéíóúñÁÉÍÓÚÑ\s]/g, '').trim().replace(/\s+/g, '_');
        doc.save(`${safeName}_${turno}_Taller_ESI.pdf`);
        showToast('📄 PDF descargado correctamente', 'success');

    } catch (err) {
        console.error('PDF error:', err);
        showToast('Error al generar el PDF: ' + err.message, 'error');
    } finally {
        pdfBtn.disabled = false;
        pdfBtn.innerHTML = '<span class="material-symbols-outlined">download</span>&nbsp;Descargar PDF';
    }
}

// ── Toast ──────────────────────────────────────────
function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.className = `toast ${type} show`;
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => toast.classList.remove('show'), 3500);
}

// ── Update student name display ────────────────────
function updateStudentDisplay() {
    const nombre = document.getElementById('studentName')?.value?.trim() || '';
    const el = document.getElementById('greetingName');
    if (el) el.textContent = nombre ? nombre : 'Alumno/a';
}

// ── Animated Number Counter ───────────────────────
function animateCounters() {
    const counters = document.querySelectorAll('.hero-stat-num[data-target]');
    counters.forEach(counter => {
        const target = counter.dataset.target;
        const isNum = !isNaN(target);
        if (!isNum) { counter.textContent = target; return; }
        const end = parseInt(target);
        let current = 0;
        const duration = 1500;
        const step = Math.max(1, Math.floor(end / (duration / 30)));
        const timer = setInterval(() => {
            current += step;
            if (current >= end) { current = end; clearInterval(timer); }
            counter.textContent = current;
        }, 30);
    });
}

// ── 3D Tilt Effect on Cards ──────────────────────
function initCardTilt() {
    const cards = document.querySelectorAll('.qa-card, .summary-card, .card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateY(0)';
            card.style.transition = 'transform 0.5s ease';
        });
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.1s ease';
        });
    });
}

// ── Staggered Scroll Reveal ──────────────────────
function initStaggeredReveal() {
    const items = document.querySelectorAll('.qa-card, .accordion, .summary-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                entry.target.style.transitionDelay = `${i * 80}ms`;
                entry.target.classList.add('stagger-revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });
    items.forEach(item => {
        item.classList.add('stagger-item');
        observer.observe(item);
    });
}

// ── Init ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initAccordions();
    initTabs();
    initParticles();
    initScrollReveal();
    initParallax();
    initCardTilt();
    initStaggeredReveal();

    // Animated counters on hero reveal
    const heroObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) { animateCounters(); heroObs.unobserve(e.target); }
        });
    }, { threshold: 0.3 });
    const heroEl = document.querySelector('.hero');
    if (heroEl) heroObs.observe(heroEl);

    // Theme toggle
    document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);

    // PDF
    document.getElementById('pdfBtn')?.addEventListener('click', downloadPDF);

    // IA analyze all
    document.getElementById('analyzeBtn')?.addEventListener('click', analyzeReflections);

    // Simulator
    document.getElementById('simulateBtn')?.addEventListener('click', runSimulator);

    // Progress rings (init at 0)
    setRing('ringProgress', 0);
    setRing('ringActivity', 0);

    // Textarea change → update rings
    document.querySelectorAll('.qa-textarea, .activity-textarea').forEach(ta => {
        ta.addEventListener('input', updateProgressRings);
    });

    // Student name
    document.getElementById('studentName')?.addEventListener('input', updateStudentDisplay);
});
