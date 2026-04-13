/*
  Portfolio site bootstrap
  - Keeps interactive behaviour in one place
  - Exposes lightweight debug helpers on window.portfolioSite
  - Uses structured console logging for easier future updates
*/

(() => {
  const CONFIG = {
    themeStorageKey: 'neha-portfolio-theme',
    debugStorageKey: 'portfolio-debug',
    navSelector: 'a[href^="#"]',
    themeToggleSelector: '#theme-toggle'
  };

  const TODO = [
    'Add a future hero avatar once the visual direction is final.',
    'Add direct links or richer presentation for hobbies / outside-work items.',
    'Review and refine text content across hero, about, projects, and recommendations.'
  ];

  const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  const hasDebugQuery = new URLSearchParams(window.location.search).get('debug') === '1';

  const getStoredFlag = key => {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  };

  const setStoredFlag = (key, value) => {
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch (error) {
      return false;
    }
  };

  const clearStoredFlag = key => {
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  };

  const debugEnabled = hasDebugQuery || getStoredFlag(CONFIG.debugStorageKey) === 'true' || isLocalhost;

  const logger = {
    prefix: '[portfolio]',
    enabled: debugEnabled,
    log(level, message, payload) {
      if (!this.enabled) return;
      const method = console[level] ? level : 'log';
      if (payload !== undefined) {
        console[method](`${this.prefix} ${message}`, payload);
      } else {
        console[method](`${this.prefix} ${message}`);
      }
    },
    info(message, payload) {
      this.log('info', message, payload);
    },
    warn(message, payload) {
      this.log('warn', message, payload);
    },
    error(message, payload) {
      this.log('error', message, payload);
    },
    group(label, callback) {
      if (!this.enabled) return callback();
      console.group(`${this.prefix} ${label}`);
      try {
        callback();
      } finally {
        console.groupEnd();
      }
    }
  };

  const state = {
    theme: 'light',
    navLinkCount: 0,
    missingTargets: [],
    systemThemeAttached: false
  };

  const body = document.body;
  const themeToggle = document.querySelector(CONFIG.themeToggleSelector);

  const setToggleState = isDark => {
    if (!themeToggle) {
      logger.warn('Theme toggle button not found.');
      return;
    }

    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to day mode' : 'Switch to night mode');
  };

  const applyTheme = theme => {
    const isDark = theme === 'dark';

    if (isDark) {
      body.setAttribute('data-theme', 'dark');
    } else {
      body.removeAttribute('data-theme');
    }

    state.theme = isDark ? 'dark' : 'light';
    setToggleState(isDark);
    logger.info('Applied theme.', { theme: state.theme });
  };

  const initSmoothScroll = () => {
    const navLinks = Array.from(document.querySelectorAll(CONFIG.navSelector));
    state.navLinkCount = navLinks.length;

    logger.group('Initialising smooth scroll', () => {
      logger.info('Found navigation links.', { count: navLinks.length });
    });

    navLinks.forEach(link => {
      const targetId = link.getAttribute('href');

      if (!targetId || targetId === '#') {
        logger.warn('Skipping empty anchor link.', { link });
        return;
      }

      const target = document.querySelector(targetId);
      if (!target) {
        state.missingTargets.push(targetId);
        logger.warn('Anchor target not found.', { targetId });
        return;
      }

      link.addEventListener('click', event => {
        event.preventDefault();
        logger.info('Scrolling to section.', { targetId });
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  };

  const initTheme = () => {
    const systemThemeQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    const storedTheme = getStoredFlag(CONFIG.themeStorageKey);
    const preferredTheme = storedTheme || (systemThemeQuery?.matches ? 'dark' : 'light');

    logger.group('Initialising theme', () => {
      logger.info('Theme inputs resolved.', {
        storedTheme,
        systemPrefersDark: Boolean(systemThemeQuery?.matches),
        preferredTheme
      });
    });

    applyTheme(preferredTheme);

    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
        setStoredFlag(CONFIG.themeStorageKey, nextTheme);
        logger.info('Theme toggled from UI.', { nextTheme });
      });
    }

    if (!systemThemeQuery) {
      logger.warn('matchMedia is not available, system theme sync disabled.');
      return;
    }

    const syncWithSystemTheme = event => {
      if (getStoredFlag(CONFIG.themeStorageKey)) {
        logger.info('Stored theme exists, skipping system theme sync.');
        return;
      }

      logger.info('System theme changed.', { matchesDark: event.matches });
      applyTheme(event.matches ? 'dark' : 'light');
    };

    if (typeof systemThemeQuery.addEventListener === 'function') {
      systemThemeQuery.addEventListener('change', syncWithSystemTheme);
      state.systemThemeAttached = true;
    } else if (typeof systemThemeQuery.addListener === 'function') {
      systemThemeQuery.addListener(syncWithSystemTheme);
      state.systemThemeAttached = true;
    } else {
      logger.warn('System theme listeners are not supported in this browser.');
    }
  };

  window.portfolioSite = {
    config: CONFIG,
    todo: TODO,
    state,
    logger,
    enableDebug() {
      logger.enabled = true;
      setStoredFlag(CONFIG.debugStorageKey, 'true');
      logger.info('Debug logging enabled manually.');
    },
    disableDebug() {
      logger.info('Debug logging disabled manually.');
      logger.enabled = false;
      clearStoredFlag(CONFIG.debugStorageKey);
    },
    dumpState() {
      logger.group('State dump', () => {
        logger.info('Current state snapshot.', {
          ...state,
          todo: TODO
        });
      });
      return {
        ...state,
        todo: [...TODO]
      };
    }
  };

  logger.group('Booting portfolio site', () => {
    logger.info('Runtime configuration.', {
      ...CONFIG,
      debugEnabled,
      isLocalhost
    });
    logger.info('Pending content TODO items.', TODO);
  });

  initSmoothScroll();
  initTheme();
})();
