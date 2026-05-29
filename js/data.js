var Data = (function () {
  'use strict';

  var posts = null;
  var loading = false;

  function load() {
    if (posts) return Promise.resolve(posts);

    try {
      posts = (window.POSTS_DATA || []).sort(function (a, b) {
        return b.date.localeCompare(a.date);
      });
    } catch (e) {
      console.error('Failed to load posts data:', e);
      posts = [];
    }
    loading = true;
    return Promise.resolve(posts);
  }

  function getAll() {
    return posts || [];
  }

  function getById(id) {
    if (!posts) return null;
    for (var i = 0; i < posts.length; i++) {
      if (posts[i].id === id) return posts[i];
    }
    return null;
  }

  function getByTag(tag) {
    if (!posts) return [];
    return posts.filter(function (p) {
      return p.tags.indexOf(tag) !== -1;
    });
  }

  function getAllTags() {
    if (!posts) return [];
    var tagMap = {};
    for (var i = 0; i < posts.length; i++) {
      var tags = posts[i].tags;
      for (var j = 0; j < tags.length; j++) {
        tagMap[tags[j]] = (tagMap[tags[j]] || 0) + 1;
      }
    }
    return Object.keys(tagMap).sort();
  }

  return {
    load: load,
    getAll: getAll,
    getById: getById,
    getByTag: getByTag,
    getAllTags: getAllTags
  };
})();
