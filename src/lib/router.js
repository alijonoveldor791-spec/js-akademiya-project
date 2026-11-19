const PAGE_ROUTES = new Set(['/', '/courses', '/dashboard', '/learn', '/about', '/author']);

export function parseRoute(url = location.pathname + location.search + location.hash) {
  const parsed = new URL(url, location.origin);
  const pathname = parsed.pathname.replace(/\/+$/, '') || '/';
  const hash = parsed.hash || '';
  const searchParams = parsed.searchParams;

  // Legacy and direct lesson hash compatibility: /#/setup-01, /#/lesson-04
  const hashLessonMatch = hash.match(/^#\/((?:lesson|setup)-\d{2})$/);
  if (hashLessonMatch) {
    return {
      page: 'learn',
      lessonId: hashLessonMatch[1],
      tab: searchParams.get('tab') || null,
      anchor: null,
      path: pathname
    };
  }

  // Clean /learn/<lessonId> paths
  const learnPathMatch = pathname.match(/^\/learn\/((?:lesson|setup)-\d{2})$/);
  if (learnPathMatch) {
    return {
      page: 'learn',
      lessonId: learnPathMatch[1],
      tab: searchParams.get('tab') || null,
      anchor: hash ? hash.slice(1) : null,
      path: pathname
    };
  }

  if (pathname === '/learn') {
    return {
      page: 'learn',
      lessonId: searchParams.get('lesson') || null,
      tab: searchParams.get('tab') || null,
      anchor: hash ? hash.slice(1) : null,
      path: '/learn'
    };
  }

  if (pathname === '/courses') {
    return {
      page: 'courses',
      lessonId: null,
      tab: null,
      anchor: hash ? hash.slice(1) : null,
      path: '/courses'
    };
  }

  if (pathname === '/dashboard') {
    return {
      page: 'dashboard',
      lessonId: null,
      tab: null,
      anchor: null,
      path: '/dashboard'
    };
  }

  if (pathname === '/about') {
    return {
      page: 'about',
      lessonId: null,
      tab: null,
      anchor: null,
      path: '/about'
    };
  }

  if (pathname === '/author') {
    return {
      page: 'author',
      lessonId: null,
      tab: null,
      anchor: null,
      path: '/author'
    };
  }

  // Default / fallback for '/' and '#curriculum'
  if (PAGE_ROUTES.has(pathname) || pathname === '/') {
    return {
      page: 'home',
      lessonId: null,
      tab: null,
      anchor: hash ? hash.slice(1) : null,
      path: '/'
    };
  }

  return {
    page: 'home',
    lessonId: null,
    tab: null,
    anchor: null,
    path: '/'
  };
}

export function navigateTo(target, { replace = false } = {}) {
  const nextURL = target.startsWith('/') || target.startsWith('#') ? target : '/' + target;
  const current = location.pathname + location.search + location.hash;
  if (current !== nextURL) {
    if (replace) history.replaceState(null, '', nextURL);
    else history.pushState(null, '', nextURL);
  }
  window.dispatchEvent(new CustomEvent('akademiya:navigate'));
}

export function bindRouteLinks(root = document, onNavigate) {
  root.addEventListener('click', event => {
    const link = event.target.closest('a[data-route], button[data-route]');
    if (!link) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = link.dataset.route || link.getAttribute('href');
    if (!target) return;
    event.preventDefault();
    if (typeof onNavigate === 'function') onNavigate(target);
    else navigateTo(target);
  });
}
