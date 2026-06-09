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

INSTRUCCIONES:
- Evalúa si la respuesta del alumno demuestra comprensión de estos conceptos.
- Responde SIEMPRE en español.
- Para cada pregunta que evalúes, comienza con uno de estos marcadores:
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

// ── Call Gemini API ──────────────────────────────────
async function analyzeReflections() {
    // Note: The key is now handled by our backend (server.js)

    // Collect answers
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
    analyzeBtn.innerHTML = '<span class="spinner"></span>&nbsp;Analizando...';

    // Hide all previous feedbacks
    document.querySelectorAll('.qa-feedback').forEach(f => { f.classList.remove('show'); f.textContent = ''; });

    try {
        const resp = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: {
                    parts: { text: SYSTEM_PROMPT }
                },
                contents: [{
                    parts: [{
                        text: `Analiza las siguientes respuestas de un alumno sobre Gestión del Tiempo. Para cada pregunta, da feedback breve (máximo 3 oraciones). Usa el marcador ✅ EXCELENTE, ⚠️ AMPLIAR o 💡 SUGERENCIA al inicio de cada feedback:\n${allAnswers}`
                    }]
                }],
                generationConfig: {
                    temperature: 0.6,
                    maxOutputTokens: 1400,
                }
            })
        });

        const data = await resp.json();

        if (!resp.ok) {
            const errorMsg = data.error?.message || `Error ${resp.status}: ${JSON.stringify(data)}`;
            throw new Error(errorMsg);
        }

        // Gemini response parsing: data.candidates[0].content.parts[0].text
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // Parse feedback per question
        parseFeedback(text, cards);
        showToast('✅ Análisis completado', 'success');
        document.getElementById('grokResults')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (err) {
        console.error('API Error:', err);
        showToast('Error: ' + err.message, 'error');
    } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = '<span class="material-symbols-outlined">psychology</span>&nbsp;Analizar Reflexiones';
    }
}

function parseFeedback(text, cards) {
    // Split by PREGUNTA markers or numbered sections
    const blocks = text.split(/(?=PREGUNTA\s*\d+|^\d+[\.\):])/mi);

    // Try to map blocks to cards
    let feedbacks = [];
    if (blocks.length > 1) {
        feedbacks = blocks.filter(b => b.trim()).slice(0, cards.length);
    } else {
        // fallback: split by double newlines
        feedbacks = text.split(/\n{2,}/).filter(b => b.trim()).slice(0, cards.length);
    }

    // Assign to cards
    cards.forEach((card, i) => {
        const fb = feedbacks[i];
        const fbEl = card.querySelector('.qa-feedback');
        if (!fbEl) return;
        if (!fb) return;

        const cleanFb = fb.replace(/^(PREGUNTA\s*\d+[:\s]*)/i, '').trim();
        if (!cleanFb) return;

        // Determine type from marker
        let cls = 'suggest';
        let badge = '💡 Sugerencia';
        if (cleanFb.includes('✅') || cleanFb.toLowerCase().includes('excelente')) {
            cls = 'good'; badge = '✅ Excelente';
        } else if (cleanFb.includes('⚠️') || cleanFb.toLowerCase().includes('ampliar')) {
            cls = 'improve'; badge = '⚠️ Ampliar';
        }

        fbEl.innerHTML = `<div class="feedback-badge">${badge}</div>${cleanFb.replace(/^[✅⚠️💡]\s*(EXCELENTE|AMPLIAR|SUGERENCIA)[:\s]*/i, '').replace(/\n/g, '<br>')}`;
        fbEl.className = `qa-feedback ${cls} show`;
    });
}

// ── PDF Generation ────────────────────────────────
async function downloadPDF() {
    const nombre = document.getElementById('studentName')?.value?.trim();
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
        doc.text(`Turno: ${turnoLabel}`, marginL + 6, y + 14);
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

            if (fb) {
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

    // Theme toggle
    document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);

    // PDF
    document.getElementById('pdfBtn')?.addEventListener('click', downloadPDF);

    // IA analyze
    document.getElementById('analyzeBtn')?.addEventListener('click', analyzeReflections);

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
