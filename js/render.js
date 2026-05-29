var Render = (function () {
  'use strict';

  var PLACEHOLDER_SVGS = [
    '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f97316" stop-opacity="0.3"/><stop offset="100%" stop-color="#ec4899" stop-opacity="0.15"/></linearGradient></defs><rect width="400" height="300" fill="url(#g1)"/><circle cx="200" cy="130" r="40" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="2"/><polygon points="188,118 188,142 218,130" fill="rgba(255,255,255,0.15)"/></svg>',
    '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f59e0b" stop-opacity="0.3"/><stop offset="100%" stop-color="#f97316" stop-opacity="0.15"/></linearGradient></defs><rect width="400" height="300" fill="url(#g2)"/><circle cx="200" cy="130" r="40" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="2"/><polygon points="188,118 188,142 218,130" fill="rgba(255,255,255,0.15)"/></svg>',
    '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ec4899" stop-opacity="0.25"/><stop offset="100%" stop-color="#f43f5e" stop-opacity="0.1"/></linearGradient></defs><rect width="400" height="300" fill="url(#g3)"/><circle cx="200" cy="130" r="40" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="2"/><polygon points="188,118 188,142 218,130" fill="rgba(255,255,255,0.15)"/></svg>',
    '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fb923c" stop-opacity="0.25"/><stop offset="100%" stop-color="#f59e0b" stop-opacity="0.1"/></linearGradient></defs><rect width="400" height="300" fill="url(#g4)"/><circle cx="200" cy="130" r="40" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="2"/><polygon points="188,118 188,142 218,130" fill="rgba(255,255,255,0.15)"/></svg>'
  ];

  function el(tag, attrs, children) {
    var e = document.createElement(tag);
    if (attrs) {
      var keys = Object.keys(attrs);
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (k === 'className') {
          e.className = attrs[k];
        } else if (k === 'innerHTML') {
          e.innerHTML = attrs[k];
        } else if (k === 'textContent') {
          e.textContent = attrs[k];
        } else if (k.startsWith('on')) {
          e.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
        } else {
          e.setAttribute(k, attrs[k]);
        }
      }
    }
    if (children) {
      for (var j = 0; j < children.length; j++) {
        if (typeof children[j] === 'string') {
          e.appendChild(document.createTextNode(children[j]));
        } else if (children[j]) {
          e.appendChild(children[j]);
        }
      }
    }
    return e;
  }

  function placeholderSVG(index) {
    return PLACEHOLDER_SVGS[index % PLACEHOLDER_SVGS.length];
  }

  function isVideo(src) {
    return /\.(mp4|mov|webm)$/i.test(src);
  }

  function createPhotoImg(src, placeholderIdx, className) {
    var wrapper = el('div', { className: 'placeholder' });
    wrapper.innerHTML = placeholderSVG(placeholderIdx || 0);

    var container = el('div', { className: 'card-image' });

    if (isVideo(src)) {
      var playIcon = el('div', { className: 'play-icon', innerHTML: '<svg viewBox="0 0 24 24" fill="white"><polygon points="8,5 19,12 8,19"/></svg>' });
      container.appendChild(playIcon);
    }

    var media;
    if (isVideo(src)) {
      media = el('video', { src: src, preload: 'auto', playsinline: '', className: className || '' });
      media.addEventListener('loadeddata', function () { wrapper.style.display = 'none'; });
    } else {
      media = el('img', { src: src, alt: '', loading: 'lazy', className: className || '' });
      media.addEventListener('load', function () { wrapper.style.display = 'none'; });
    }

    media.addEventListener('error', function () { media.style.display = 'none'; });

    container.appendChild(wrapper);
    container.appendChild(media);
    return container;
  }

  /* ===== Home ===== */
  function home(posts) {
    var main = document.getElementById('main');
    main.innerHTML = '';

    Render.nav(null);

    if (!posts || posts.length === 0) {
      main.appendChild(emptyState());
      return;
    }

    var grid = el('div', { className: 'posts-grid' });

    for (var i = 0; i < posts.length; i++) {
      var post = posts[i];
      var card = el('div', {
        className: 'post-card',
        onClick: function (p) {
          return function () { location.hash = '#/post/' + p.id; };
        }(post)
      });

      card.appendChild(createPhotoImg(post.photos[0], i));

      var body = el('div', { className: 'card-body' });
      body.appendChild(el('div', { className: 'card-date', textContent: post.date }));
      body.appendChild(el('div', { className: 'card-title', textContent: post.title }));
      card.appendChild(body);
      grid.appendChild(card);
    }

    main.appendChild(grid);
  }

  /* ===== Detail ===== */
  function detail(id) {
    var post = Data.getById(id);
    var main = document.getElementById('main');
    main.innerHTML = '';

    Render.nav(null);

    if (!post) {
      main.appendChild(el('div', { className: 'empty-state' }, [
        el('p', { textContent: '没有找到这篇日记' })
      ]));
      return;
    }

    var container = el('div', { className: 'detail' });

    /* Back button */
    var backBtn = el('button', { className: 'detail-back', onClick: function () {
      location.hash = '#/';
    } }, ['← 返回首页']);
    container.appendChild(backBtn);

    /* Photo viewer */
    var viewer = el('div', { className: 'photo-viewer' });
    var stage = el('div', { className: 'photo-stage' });
    var imgs = [];
    var currentIdx = 0;

    for (var i = 0; i < post.photos.length; i++) {
      var src = post.photos[i];
      var placeholderDiv = el('div', { className: 'placeholder' });
      placeholderDiv.innerHTML = placeholderSVG(i);

      var mediaEl;
      if (isVideo(src)) {
        mediaEl = el('video', {
          src: src,
          controls: '',
          playsinline: '',
          preload: 'auto',
          className: i === 0 ? 'active' : ''
        });
        mediaEl.addEventListener('loadeddata', function (div) {
          return function () { div.style.display = 'none'; };
        }(placeholderDiv));
      } else {
        mediaEl = el('img', {
          src: src,
          alt: '',
          className: i === 0 ? 'active' : ''
        });
        mediaEl.addEventListener('load', function (div) {
          return function () { div.style.display = 'none'; };
        }(placeholderDiv));
      }
      mediaEl.addEventListener('error', function (el) {
        return function () { el.style.display = 'none'; };
      }(mediaEl));

      stage.appendChild(placeholderDiv);
      stage.appendChild(mediaEl);
      imgs.push(mediaEl);
    }

    function updatePhoto() {
      for (var j = 0; j < imgs.length; j++) {
        imgs[j].classList.toggle('active', j === currentIdx);
      }
      counterEl.textContent = (currentIdx + 1) + ' / ' + imgs.length;
    }

    /* Arrows */
    if (post.photos.length > 1) {
      var prevArrow = el('button', { className: 'photo-arrow prev', onClick: function () {
        currentIdx = (currentIdx - 1 + imgs.length) % imgs.length;
        updatePhoto();
      } }, ['‹']);
      viewer.appendChild(prevArrow);

      var nextArrow = el('button', { className: 'photo-arrow next', onClick: function () {
        currentIdx = (currentIdx + 1) % imgs.length;
        updatePhoto();
      } }, ['›']);
      viewer.appendChild(nextArrow);

      var counterEl = el('div', { className: 'photo-counter', textContent: '1 / ' + imgs.length });
      viewer.appendChild(counterEl);
    }

    viewer.appendChild(stage);
    container.appendChild(viewer);

    /* Info */
    var header = el('div', { className: 'detail-header' });
    header.appendChild(el('div', { className: 'detail-date', textContent: post.date }));
    header.appendChild(el('div', { className: 'detail-title', textContent: post.title }));
    container.appendChild(header);

    container.appendChild(el('div', { className: 'detail-desc', textContent: post.description }));

    /* Tags */
    var tagsDiv = el('div', { className: 'detail-tags' });
    for (var t = 0; t < post.tags.length; t++) {
      var tag = post.tags[t];
      tagsDiv.appendChild(el('span', {
        className: 'detail-tag',
        textContent: tag,
        onClick: function (tagName) {
          return function () { location.hash = '#/tag/' + encodeURIComponent(tagName); };
        }(tag)
      }));
    }
    container.appendChild(tagsDiv);

    /* Share button */
    var actions = el('div', { className: 'detail-actions' });
    var shareBtn = el('button', {
      className: 'btn-share',
      onClick: function () {
        var url = location.href;
        navigator.clipboard.writeText(url).then(function () {
          shareBtn.classList.add('copied');
          shareBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> 已复制链接';
          showToast('链接已复制，可以分享给朋友啦');
          setTimeout(function () {
            shareBtn.classList.remove('copied');
            shareBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> 复制分享链接';
          }, 2000);
        }).catch(function () {
          showToast('复制失败，请手动复制浏览器地址栏链接');
        });
      }
    }, ['<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> 复制分享链接']);
    actions.appendChild(shareBtn);
    container.appendChild(actions);

    main.appendChild(container);
  }

  /* ===== Tag Filter ===== */
  function tag(tagName) {
    var decoded = decodeURIComponent(tagName);
    var posts = Data.getByTag(decoded);
    var main = document.getElementById('main');
    main.innerHTML = '';

    Render.nav(decoded);

    if (posts.length === 0) {
      main.appendChild(el('div', { className: 'empty-state' }, [
        el('p', { textContent: '没有找到标签为「' + decoded + '」的日记' })
      ]));
      return;
    }

    var grid = el('div', { className: 'posts-grid' });
    var allPosts = Data.getAll();

    for (var i = 0; i < posts.length; i++) {
      var post = posts[i];
      var globalIdx = allPosts.indexOf(post);

      var card = el('div', {
        className: 'post-card',
        onClick: function (p) {
          return function () { location.hash = '#/post/' + p.id; };
        }(post)
      });

      card.appendChild(createPhotoImg(post.photos[0], globalIdx));

      var body = el('div', { className: 'card-body' });
      body.appendChild(el('div', { className: 'card-date', textContent: post.date }));
      body.appendChild(el('div', { className: 'card-title', textContent: post.title }));
      card.appendChild(body);
      grid.appendChild(card);
    }

    main.appendChild(grid);
  }

  /* ===== Nav ===== */
  function nav(activeTag) {
    var navTags = document.getElementById('navTags');
    navTags.innerHTML = '';

    var allBtn = el('button', {
      className: 'tag-btn' + (activeTag === null ? ' active' : ''),
      textContent: '全部',
      onClick: function () { location.hash = '#/'; }
    });
    navTags.appendChild(allBtn);

    var tags = Data.getAllTags();
    for (var i = 0; i < tags.length; i++) {
      var t = tags[i];
      var btn = el('button', {
        className: 'tag-btn' + (t === activeTag ? ' active' : ''),
        textContent: t,
        onClick: function (tagName) {
          return function () { location.hash = '#/tag/' + encodeURIComponent(tagName); };
        }(t)
      });
      navTags.appendChild(btn);
    }
  }

  /* ===== Empty State ===== */
  function emptyState() {
    return el('div', { className: 'empty-state' }, [
      el('div', { innerHTML: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>' }),
      el('p', { textContent: '还没有日记，在 data/posts.js 中添加你的第一条记录吧' })
    ]);
  }

  /* ===== Toast ===== */
  var toastTimer;
  function showToast(msg) {
    var toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, 2000);
  }

  return {
    home: function () { home(Data.getAll()); },
    detail: detail,
    tag: tag,
    nav: nav
  };
})();
