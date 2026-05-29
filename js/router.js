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

    Data.load().then(function () {
      try {
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
      } catch (e) {
        document.getElementById('main').innerHTML = '<p style="color:red;padding:20px;">Error: ' + e.message + '</p>';
      }
    });
  }

  window.addEventListener('hashchange', onRouteChange);

  Data.load().then(function () {
    onRouteChange();
  });
})();
