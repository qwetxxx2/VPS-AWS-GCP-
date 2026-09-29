(function () {
  'use strict';

  /* ===== 1. Переключатель темы ===== */
  var THEME_KEY = 'cloudhost-theme';
  var rootEl = document.documentElement;

  function getSavedTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (error) {
      return null;
    }
  }

  function applyTheme(theme) {
    rootEl.setAttribute('data-theme', theme);
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.textContent = theme === 'light' ? '🌙' : '☀️';
      btn.title = theme === 'light'
        ? 'Переключить на тёмную тему'
        : 'Переключить на светлую тему';
      btn.setAttribute('aria-label', btn.title);
    }
  }

  function initTheme() {
    if (!document.getElementById('theme-toggle')) {
      var host = document.querySelector('.site-header .nav') ||
                 document.querySelector('.site-header');
      if (host) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.id = 'theme-toggle';
        btn.className = 'theme-toggle';
        btn.setAttribute('aria-label', 'Переключить тему');
        host.appendChild(btn);
      }
    }

    var startTheme = getSavedTheme() ||
      (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    applyTheme(startTheme);

    var themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        var next = rootEl.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        try {
          localStorage.setItem(THEME_KEY, next);
        } catch (error) { /* приватный режим — просто переключаем */ }
        applyTheme(next);
      });
    }
  }

  /* ===== 2. Бургер-меню ===== */
  function initMenu() {
    var toggle = document.querySelector('.nav__toggle');
    var menu = document.getElementById('site-menu');
    if (!toggle || !menu) return;

    var closeMenu = function () {
      menu.classList.remove('main-menu--open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = '&#9776;';
    };

    toggle.addEventListener('click', function () {
      var isOpen = menu.classList.toggle('main-menu--open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.innerHTML = isOpen ? '&#10005;' : '&#9776;';
    });

    menu.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMenu();
    });
  }

  /* ===== 3. Активный пункт меню ===== */
  function initActiveLink() {
    var current = location.pathname.split('/').pop() || 'index.html';
    var links = document.querySelectorAll('.main-menu .tabs a');
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute('href') === current) {
        links[i].classList.add('active');
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initTheme();
      initMenu();
      initActiveLink();
    });
  } else {
    initTheme();
    initMenu();
    initActiveLink();
  }
})();