// sandbox/index.js
import { ImageManager } from './core/image_manager.js';
import { SessionManager } from './core/session_manager.js';
import { UIController } from './ui/controller.js';
import { AppController } from './app_controller.js';
import { sendToBackground } from '../lib/messaging.js';
import { configureMarkdown } from './render/config.js';
import { applyTranslations } from './core/i18n.js';
import { renderLayout } from './ui/layout.js';
import { MathHandler } from './render/math_utils.js';

// --- Initialization ---

const params = new URLSearchParams(window.location.search);
const isRendererMode = params.get('mode') === 'renderer';

// 3. Lazy Load Heavy Dependencies (Background)
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

function loadCSS(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
}

// Load external libs
const loadLibs = async () => {
    try {
        // Load Marked (Priority for chat rendering)
        await loadScript('https://cdn.jsdelivr.net/npm/marked/marked.min.js');
        // Re-run config now that marked is loaded
        configureMarkdown();

        // Load others in parallel
        loadCSS('https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css');
        loadCSS('https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/atom-one-dark.min.css');

        await Promise.all([
            loadScript('https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js'),
            loadScript('https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js'),
            loadScript('https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.basic.min.js')
        ]);
        
        // Auto-render ext for Katex
        await loadScript('https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js');

        console.log("Lazy dependencies loaded.");
    } catch (e) {
        console.warn("Deferred loading failed", e);
    }
};


if (isRendererMode) {
    // --- RENDERER MODE (Headless for Content Script) ---
    document.body.innerHTML = ''; // Clear UI
    
    // Load libs immediately
    loadLibs().then(() => {
        window.addEventListener('message', (e) => {
            if (e.data.action === 'RENDER') {
                const { text, reqId } = e.data;
                
                if (typeof marked === 'undefined') {
                    // Not ready yet, return raw text or retry? 
                    // Just return text for now to prevent hang
                     e.source.postMessage({ action: 'RENDER_RESULT', html: text, reqId }, { targetOrigin: '*' });
                     return;
                }

                try {
                    const mathHandler = new MathHandler();
                    let processedText = mathHandler.protect(text || '');
                    let html = marked.parse(processedText);
                    html = mathHandler.restore(html);
                    
                    if (typeof katex !== 'undefined') {
                        // Regex replace delimiters with katex.renderToString
                        
                        // Block Math
                        html = html.replace(/\$\$([\s\S]+?)\$\$/g, (m, c) => {
                            try { return katex.renderToString(c, { displayMode: true, throwOnError: false }); } catch(err){ return m; }
                        });
                        
                        // Inline Math
                        html = html.replace(/(?<!\$)\$(?!\$)([^$\n]+?)(?<!\$)\$/g, (m, c) => {
                             try { return katex.renderToString(c, { displayMode: false, throwOnError: false }); } catch(err){ return m; }
                        });
                    }

                    e.source.postMessage({ action: 'RENDER_RESULT', html: html, reqId }, { targetOrigin: '*' });
                } catch (err) {
                    console.error("Render error", err);
                    e.source.postMessage({ action: 'RENDER_RESULT', html: text, reqId }, { targetOrigin: '*' });
                }
            }
        });
    });

} else {
    // --- NORMAL MODE ---
    
    // 0. Render App Layout (Before DOM query)
    renderLayout();

    // 1. Apply Initial Translations
    applyTranslations();

    // 2. Critical Optimization: Signal Ready Immediately
    window.parent.postMessage({ action: 'UI_READY' }, '*');

    // 4. Listen for Language Changes
    document.addEventListener('gemini-language-changed', () => {
        applyTranslations();
    });

    let app;

    // Init Managers immediately (Script is type="module", so DOM is ready)
    const sessionManager = new SessionManager();

    const ui = new UIController({
        historyListEl: document.getElementById('history-list'),
        sidebar: document.getElementById('history-sidebar'),
        sidebarOverlay: document.getElementById('sidebar-overlay'),
        statusDiv: document.getElementById('status'),
        historyDiv: document.getElementById('chat-history'),
        inputFn: document.getElementById('prompt'),
        sendBtn: document.getElementById('send'),
        historyToggleBtn: document.getElementById('history-toggle'),
        closeSidebarBtn: document.getElementById('close-sidebar'),
        modelSelect: document.getElementById('model-select')
    });

    const imageManager = new ImageManager({
        imageInput: document.getElementById('image-input'),
        imagePreview: document.getElementById('image-preview'),
        previewThumb: document.getElementById('preview-thumb'),
        removeImgBtn: document.getElementById('remove-img'),
        inputWrapper: document.querySelector('.input-wrapper'),
        inputFn: document.getElementById('prompt')
    }, {
        onUrlDrop: (url) => {
            ui.updateStatus("Loading image...");
            sendToBackground({ action: "FETCH_IMAGE", url: url });
        }
    });

    // Initialize Controller
    app = new AppController(sessionManager, ui, imageManager);

    // Trigger dependency load in parallel, and re-render if needed when done
    loadLibs().then(() => {
        // If content was rendered before libs were ready (e.g. race condition), 
        // it might be unformatted text. Trigger a re-render now that everything is loaded.
        if (app) app.rerender();
    });

    // Configure Markdown (Initial pass, might be skipped if marked not loaded yet)
    configureMarkdown();

    // Bind Events
    bindAppEvents(app, ui);
    
    // --- Event Binding ---
    function bindAppEvents(app, ui) {
        // ... (Existing Event Binding Code) ...
        // New Chat Buttons
        document.getElementById('new-chat-header-btn').addEventListener('click', () => app.handleNewChat());

        // Tools
        document.getElementById('quote-btn').addEventListener('click', () => {
            sendToBackground({ action: "GET_ACTIVE_SELECTION" });
        });

        document.getElementById('ocr-btn').addEventListener('click', () => {
            app.setCaptureMode('ocr');
            sendToBackground({ action: "INITIATE_CAPTURE" });
            ui.updateStatus("Select area for OCR...");
        });

        document.getElementById('snip-btn').addEventListener('click', () => {
            app.setCaptureMode('snip');
            sendToBackground({ action: "INITIATE_CAPTURE" });
            ui.updateStatus("Select area to capture...");
        });

        // Page Context Toggle
        const contextBtn = document.getElementById('page-context-btn');
        if (contextBtn) {
            contextBtn.addEventListener('click', () => app.togglePageContext());
        }

        // Model Selector
        const modelSelect = document.getElementById('model-select');
        
        // Auto-resize Logic
        const resizeModelSelect = () => {
            if (!modelSelect) return;
            const tempSpan = document.createElement('span');
            Object.assign(tempSpan.style, {
                visibility: 'hidden',
                position: 'absolute',
                fontSize: '13px',
                fontWeight: '500',
                fontFamily: window.getComputedStyle(modelSelect).fontFamily,
                whiteSpace: 'nowrap'
            });
            tempSpan.textContent = modelSelect.options[modelSelect.selectedIndex].text;
            document.body.appendChild(tempSpan);
            const width = tempSpan.getBoundingClientRect().width;
            document.body.removeChild(tempSpan);
            modelSelect.style.width = `${width + 34}px`;
        };

        if (modelSelect) {
            modelSelect.addEventListener('change', (e) => {
                 app.handleModelChange(e.target.value);
                 resizeModelSelect();
            });
            resizeModelSelect();
        }

        // Input Key Handling
        const inputFn = document.getElementById('prompt');
        const sendBtn = document.getElementById('send');

        inputFn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendBtn.click();
            }
        });

        sendBtn.addEventListener('click', () => {
            if (app.isGenerating) {
                app.handleCancel();
            } else {
                app.handleSendMessage();
            }
        });

        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
                e.preventDefault();
                inputFn.focus();
            }
        });

        window.addEventListener('message', (event) => {
            const { action, payload } = event.data;
            
            if (action === 'RESTORE_SHORTCUTS') {
                ui.updateShortcuts(payload);
                return;
            }

            if (action === 'RESTORE_THEME') {
                ui.updateTheme(payload);
                return;
            }
            
            if (action === 'RESTORE_LANGUAGE') {
                ui.updateLanguage(payload);
                return;
            }

            if (action === 'RESTORE_MODEL') {
                if (ui.modelSelect) {
                    ui.modelSelect.value = payload;
                    resizeModelSelect();
                }
                return;
            }
            
            app.handleIncomingMessage(event);
        });
    }
}