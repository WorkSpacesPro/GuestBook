/**
 * 留言本主逻辑
 * 功能：多语言切换（中/英）、深色/亮色模式切换、Giscus 评论动态加载
 */

// ---------- 多语言配置 ----------
const translations = {
    en: {
        site_name: "Guestbook",
        nav_home: "Home",
        nav_explore: "Explore",
        nav_guestbook: "Guestbook",
        nav_about: "About",
        title: "Floating Guestbook",
        subtitle: "Leave your footprint · Powered by GitHub Discussions",
        copyright: "© 2025 Floating Guestbook"
    },
    zh: {
        site_name: "留言本",
        nav_home: "首页",
        nav_explore: "探索",
        nav_guestbook: "留言板",
        nav_about: "关于",
        title: "浮光留言本",
        subtitle: "留下足迹 · 基于 GitHub 讨论",
        copyright: "© 2025 浮光留言本"
    }
};

let currentLang = 'en';      // 'en' 或 'zh'
let currentTheme = 'light';   // 'light' 或 'dark'

// 更新页面所有带 data-i18n 的文本
function updatePageText(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            if (el.children.length > 0) {
                let lastNode = el.lastChild;
                if (lastNode && lastNode.nodeType === Node.TEXT_NODE) {
                    lastNode.textContent = translations[lang][key];
                } else {
                    el.appendChild(document.createTextNode(translations[lang][key]));
                }
            } else {
                el.textContent = translations[lang][key];
            }
        }
    });
}

// ---------- Giscus 评论组件加载 ----------
function loadGiscus(lang) {
    const container = document.getElementById('giscus-container');
    if (!container) return;
    container.innerHTML = '';

    const giscusLang = lang === 'zh' ? 'zh-CN' : 'en';
    const isDark = document.body.classList.contains('dark');
    const giscusTheme = isDark ? 'dark_dimmed' : 'light_tritanopia';

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'WorkSpacesPro/guestbook');
    script.setAttribute('data-repo-id', 'R_kgDOOEORuw');
    script.setAttribute('data-category', 'General');
    script.setAttribute('data-category-id', 'DIC_kwDOOEORu84Cp384');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', giscusTheme);
    script.setAttribute('data-lang', giscusLang);
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;

    container.appendChild(script);
}

// 动态更新 Giscus 主题（不重新加载）
function updateGiscusTheme(isDark) {
    const theme = isDark ? 'dark_dimmed' : 'light_tritanopia';
    const iframe = document.querySelector('iframe.giscus-frame');
    if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ giscus: { setConfig: { theme } } }, 'https://giscus.app');
    } else {
        // 等待 iframe 加载完成
        const observer = new MutationObserver((_, obs) => {
            const frame = document.querySelector('iframe.giscus-frame');
            if (frame) {
                frame.addEventListener('load', () => {
                    frame.contentWindow.postMessage({ giscus: { setConfig: { theme } } }, 'https://giscus.app');
                });
                obs.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => observer.disconnect(), 10000);
    }
}

// ---------- 深色模式 ----------
function initDarkMode() {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = stored === 'dark' || (stored !== 'light' && prefersDark);

    if (isDark) {
        document.body.classList.add('dark');
        currentTheme = 'dark';
    } else {
        document.body.classList.remove('dark');
        currentTheme = 'light';
    }
    updateDarkModeIcons(isDark);
    if (document.querySelector('iframe.giscus-frame')) {
        updateGiscusTheme(isDark);
    }
}

function updateDarkModeIcons(isDark) {
    const btns = [
        document.getElementById('darkModeToggle'),
        document.getElementById('mobileDarkToggle')
    ];
    btns.forEach(btn => {
        if (btn) {
            btn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        }
    });
}

function toggleDarkMode() {
    const isDark = document.body.classList.contains('dark');
    if (isDark) {
        document.body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        currentTheme = 'light';
        updateDarkModeIcons(false);
        updateGiscusTheme(false);
    } else {
        document.body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        currentTheme = 'dark';
        updateDarkModeIcons(true);
        updateGiscusTheme(true);
    }
}

// ---------- 语言切换 ----------
function toggleLanguage() {
    const newLang = currentLang === 'en' ? 'zh' : 'en';
    currentLang = newLang;
    updatePageText(currentLang);
    loadGiscus(currentLang);
    localStorage.setItem('lang', currentLang);
}

function initLanguage() {
    const saved = localStorage.getItem('lang');
    if (saved === 'zh' || saved === 'en') {
        currentLang = saved;
    } else {
        currentLang = 'en';
    }
    updatePageText(currentLang);
    loadGiscus(currentLang);
}

// ---------- 绑定事件 (同时绑定桌面端和移动端按钮) ----------
function bindEvents() {
    const darkBtns = ['darkModeToggle', 'mobileDarkToggle'];
    darkBtns.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', toggleDarkMode);
    });

    const langBtns = ['langToggle', 'mobileLangToggle'];
    langBtns.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', toggleLanguage);
    });
}

// ---------- 启动 ----------
function init() {
    initDarkMode();
    initLanguage();
    bindEvents();
}

init();
