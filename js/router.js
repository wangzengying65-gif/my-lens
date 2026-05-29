(function () {
  'use strict';

  var currentRoute = null;
  var currentParams = null;

  var routes = [
    { pattern: /^#\/$/, name: 'home' },
    { pattern: /^#\/post\/(.+)$/, name: 'detail' },
    { pattern: /^#\/tag\/(.+)$/, name: 'tag' },
    { pattern: /^#$/, name: 'home' }
  ];

  function parseHash() {
    var hash = location.hash || '#/';
    for (var i = 0; i < routes.length; i++) {
      var m = hash.match(routes[i].pattern);
      if (m) {
        return { name: routes[i].name, param: m[1] || null };
      }
    }
    return { name: 'home', param: null };
  }

  function onRouteChange() {
    var parsed = parseHash();
    if (currentRoute === parsed.name && currentParams === parsed.param) return;
    currentRoute = parsed.name;
    currentParams = parsed.param;

    var main = document.getElementById('main');
    main.style.opacity = '0';

    Data.load().then(function () {
      switch (currentRoute) {
        case 'home':
          Render.home();
          break;
        case 'detail':
          Render.detail(currentParams);
          break;
        case 'tag':
          Render.tag(currentParams);
          break;
      }
      setTimeout(function () { main.style.opacity = '1'; }, 50);
    });
  }

  window.addEventListener('hashchange', onRouteChange);

  var main = document.getElementById('main');
  main.style.transition = 'opacity 0.25s ease';

  Data.load().then(function () {
    onRouteChange();
  });
})();
