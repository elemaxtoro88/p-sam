/* ================================================
   APP.JS — Gestión del Tiempo | Proyecto Desafíos
   ================================================ */

// ── Constants ─────────────────────────────────────
const STORAGE_KEY_THEME = 'desafios-theme';

// Asistente context — key content from the project summary
const SYSTEM_PROMPT = `Eres un asistente educativo del Proyecto Desafíos, especializado en Gestión del Tiempo para estudiantes secundarios. 
Analiza las respuestas de los alumnos basándote en estos conceptos clave del material de estudio:

GESTIÓN DEL TIEMPO - CONCEPTOS FUNDAMENTALES:
1. PLANIFICACIÓN: Definir metas claras, priorizar tareas, usar agenda y calendario. Sin plan, el tiempo se escapa sin resultados.
2. MATRIZ DE EISENHOWER: Clasificar tareas en: Urgente+Importante (hazlo ya), Importante+No urgente (agenda), Urgente+No importante (delega), Ni urgente ni importante (elimina).
3. HÁBITOS ATÓMICOS (James Clear): Cambios pequeños y consistentes generan resultados extraordinarios. Las 4 leyes: hacerlo obvio, atractivo, sencillo y satisfactorio. Identidad → Proceso → Resultado.
4. FACULTADES DE LA PERSONA: Inteligencia (conocer), Voluntad (querer/decidir), Afectividad (sentir). La gestión del tiempo requiere las tres facultades trabajando juntas.
5. TIEMPOS DE DOLOR: Los momentos difíciles y de incomodidad son necesarios para el crecimiento. Aprender a tolerar la frustración y la demora de la gratificación es clave.
6. AUTOGESTIÓN: Ser protagonista de tu propio tiempo. Evitar la procrastinación. Reflexionar sobre cómo aprendemos (metacognición).
7. EQUILIBRIO: Gestionar tiempo no es solo producir, sino equilibrar estudio, descanso, relaciones y crecimiento personal.
8. IDENTIDAD Y HÁBITOS: El cambio más duradero empieza por la identidad ("soy una persona organizada") y no solo por los resultados.

INSTRUCCIONES:
- Evalúa si la respuesta del alumno demuestra comprensión de estos conceptos.
- Responde SIEMPRE en español.
- Comienza con uno de estos marcadores:
  ✅ EXCELENTE: (si la respuesta está bien fundamentada)
  ⚠️ AMPLIAR: (si la respuesta es correcta pero superficial)
  💡 SUGERENCIA: (si la respuesta necesita orientación)
- Luego da 2-3 oraciones de feedback constructivo, mencionando el concepto específico del material.
- Sé motivador y respetuoso, como un buen docente.`;

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

        const data = await resp.json();

        if (!resp.ok) {
            const errorMsg = data.error?.message || `Error ${resp.status}`;
            throw new Error(errorMsg);
        }

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // Parse and display feedback
        if (text && feedbackEl) {
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
                        text: `${SYSTEM_PROMPT}\n\nAnaliza las siguientes respuestas de un alumno sobre Gestión del Tiempo. Para cada pregunta, da feedback breve (máximo 3 oraciones). Usa el marcador ✅ EXCELENTE, ⚠️ AMPLIAR o 💡 SUGERENCIA al inicio de cada feedback. Separa cada feedback con "PREGUNTA X:" al inicio:\n${allAnswers}`
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
        parseFeedback(text, cards);
        showToast('✅ Análisis completado', 'success');

    } catch (err) {
        console.error('API Error:', err);
        showToast('Error: ' + err.message, 'error');
    } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = '<span class="material-symbols-outlined">psychology</span>&nbsp;Analizar Todas las Reflexiones';
    }
}

function parseFeedback(text, cards) {
    const blocks = text.split(/(?=PREGUNTA\s*\d+|^\d+[\.\):])/mi);

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
    result.style.display = 'none';

    try {
        const resp = await fetch('/api/simulate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Eres un coach de gestión del tiempo para estudiantes secundarios. Un alumno te presenta esta situación donde debe tomar una decisión:

"${scenario}"

Analiza la situación usando los conceptos de:
- Matriz de Eisenhower (urgente vs importante)
- Hábitos Atómicos (las 4 leyes)
- Equilibrio entre estudio y vida personal
- Facultades de la persona (inteligencia, voluntad, afectividad)

Da un análisis breve (máximo 5 oraciones) con:
1. 🎯 Tu recomendación
2. 📊 Cómo clasificarías esta decisión en la Matriz de Eisenhower
3. 💡 Un consejo práctico basado en Hábitos Atómicos

Responde en español, de forma motivadora y respetuosa.`
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
        doc.text('Gestión del Tiempo · Proyecto Desafíos', marginL, 14);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('Colegio Pedro Goyena', marginL, 22);
        doc.text(`Fecha: ${new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}`, marginL, 29);

        // Turno badge
        doc.setFillColor(...orange);
        doc.roundedRect(pageW - 50, 8, 34, 10, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        const turnoLabel = turno === 'tarde' ? 'Turno Tarde' : 'Turno Mañana';
        doc.text(turnoLabel, pageW - 48, 14.5);

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
            ['Planificación', 'Definir metas, priorizar tareas y usar agenda. El plan es el mapa hacia tus objetivos.'],
            ['Matriz de Eisenhower', 'Urgente+Importante: hazlo ya. Importante+No urgente: agéndalo. Urgente+No importante: delégalo.'],
            ['Hábitos Atómicos', '4 Leyes: Obvio → Atractivo → Sencillo → Satisfactorio. Cambios pequeños, resultados extraordinarios.'],
            ['Facultades', 'Inteligencia (conocer), Voluntad (decidir), Afectividad (sentir). Las tres trabajan juntas.'],
            ['Identidad', 'El cambio duradero empieza por tu identidad: "Soy una persona organizada", no solo "quiero organizarme".'],
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

            if (fb && !fb.includes('Escribí tu reflexión')) {
                checkPage(10);
                const fbClean = fb.replace(/[✅⚠️💡]/g, '').substring(0, 120);
                doc.setFont('helvetica', 'italic');
                doc.setFontSize(7.5);
                doc.setTextColor(...orange);
                doc.text('Feedback: ' + fbClean, marginL + 3, y);
                y += 5;
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
            doc.text('Colegio Pedro Goyena · Proyecto Desafíos · Gestión del Tiempo', marginL, pageH - 4);
            doc.text(`Pág. ${pg} / ${totalPages}`, pageW - 25, pageH - 4);
        }

        // Save
        const safeName = nombre.replace(/[^a-zA-ZáéíóúñÁÉÍÓÚÑ\s]/g, '').trim().replace(/\s+/g, '_');
        doc.save(`${safeName}_${turno}_GestionTiempo.pdf`);
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

// ── Init ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initAccordions();
    initTabs();
    initParticles();
    initScrollReveal();
    initParallax();

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
