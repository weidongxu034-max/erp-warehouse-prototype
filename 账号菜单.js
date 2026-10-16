/* 顶部头像的公共入口，兼容公共菜单与仍使用内联菜单的页面。 */
(function () {
  'use strict';
  if (window.__erpAccountMenuReady) return;
  window.__erpAccountMenuReady = true;

  var scriptUrl = document.currentScript && document.currentScript.src;
  var baseUrl = new URL('.', scriptUrl || location.href);
  var menu;
  var activeBox;

  function pageUrl(file) {
    var url = new URL(file, baseUrl);
    url.searchParams.set('_t', String(Date.now()));
    return url.href;
  }

  function currentPageUrl() {
    var frame = document.querySelector('.erp-content-frame');
    if (frame && frame.src) {
      try {
        var url = new URL(frame.src, location.href);
        if (url.origin === location.origin && /\.html$/i.test(url.pathname)) {
          url.searchParams.delete('_erp_embed');
          return url.href;
        }
      } catch (_) {}
    }
    return location.href;
  }

  function prepareBoxes() {
    document.querySelectorAll('.user-box').forEach(function (box) {
      box.setAttribute('role', 'button');
      box.setAttribute('tabindex', '0');
      box.setAttribute('aria-haspopup', 'menu');
      if (!box.hasAttribute('aria-expanded')) box.setAttribute('aria-expanded', 'false');
      box.setAttribute('aria-label', '账号菜单');
    });
  }

  function ensureMenu() {
    if (menu) return menu;
    var style = document.createElement('style');
    style.textContent = '.erp-account-menu{position:fixed;z-index:300;min-width:88px;padding:4px;border:1px solid #e6e8ed;border-radius:6px;background:#fff;box-shadow:0 7px 20px #0002}.erp-account-menu[hidden]{display:none}.erp-account-menu button{display:block;width:100%;height:32px;padding:0 10px;border:0;border-radius:3px;background:#fff;color:#303133;text-align:left;font:14px "Microsoft YaHei",sans-serif;white-space:nowrap;cursor:pointer}.erp-account-menu button:hover,.erp-account-menu button:focus-visible{background:#f2f5ff;color:#3d68ff;outline:none}';
    document.head.appendChild(style);
    menu = document.createElement('div');
    menu.className = 'erp-account-menu';
    menu.setAttribute('role', 'menu');
    menu.hidden = true;
    menu.innerHTML = '<button type="button" role="menuitem" data-account-action="profile">个人中心</button><button type="button" role="menuitem" data-account-action="logout">安全退出</button>';
    document.body.appendChild(menu);
    return menu;
  }

  function closeMenu() {
    if (menu) menu.hidden = true;
    if (activeBox) activeBox.setAttribute('aria-expanded', 'false');
    activeBox = null;
  }

  function openMenu(box) {
    var popup = ensureMenu();
    if (activeBox === box && !popup.hidden) { closeMenu(); return; }
    closeMenu();
    activeBox = box;
    box.setAttribute('aria-expanded', 'true');
    var rect = box.getBoundingClientRect();
    popup.style.right = Math.max(8, window.innerWidth - rect.right) + 'px';
    popup.style.top = rect.bottom + 4 + 'px';
    popup.hidden = false;
  }

  document.addEventListener('click', function (event) {
    var action = event.target.closest('[data-account-action]');
    if (action && menu && menu.contains(action)) {
      var choice = action.dataset.accountAction;
      closeMenu();
      if (choice === 'profile') {
        if (!decodeURIComponent(location.pathname).endsWith('/个人中心.html')) {
          try { sessionStorage.setItem('erp-account-return', currentPageUrl()); } catch (_) {}
          location.href = pageUrl('个人中心.html');
        }
      } else if (choice === 'logout') {
        try { sessionStorage.removeItem('erp-demo-login'); } catch (_) {}
        location.href = pageUrl('登录页.html');
      }
      return;
    }
    var box = event.target.closest('.user-box');
    if (box) { prepareBoxes(); openMenu(box); return; }
    closeMenu();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') { closeMenu(); return; }
    var box = event.target.closest('.user-box');
    if (box && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      openMenu(box);
    }
  });
  window.addEventListener('resize', closeMenu);
  prepareBoxes();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', prepareBoxes);
})();
