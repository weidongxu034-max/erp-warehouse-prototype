/* ============================================================
 * ERP 仓储原型 - 公共布局（顶部导航 + 左侧菜单）
 * ------------------------------------------------------------
 * 所有页面通过 <script src="菜单.js"></script> 引用本文件，
 * 顶部导航与左侧菜单的样式、渲染、高亮、折叠、页面跳转全部
 * 由本文件统一处理，各页面不再各自维护菜单代码。
 *
 * 新增页面时只需两步：
 *   1) 新页面在自身内联 <script> 之前引用本文件：
 *      <script src="菜单.js"></script>
 *      并保留 <div class="layout"><main class="main">…</main></div> 结构
 *   2) 在下方 PAGE_LINKS 中补充「菜单名 -> 文件名」映射
 * ============================================================ */
(function () {
  'use strict';

  /* iframe 内只渲染业务内容，避免重复注入菜单并依赖负偏移裁切。 */
  var isEmbedded = new URLSearchParams(window.location.search).get('_erp_embed') === '1';
  document.documentElement.classList.add(isEmbedded ? 'erp-embedded' : 'erp-page-loading');

  /* ---------- 菜单与布局样式（原各页面 <style> 中的「顶部导航 / 布局」两节） ---------- */
  var css = `
  html { background:#F5F5F5; }
  body { opacity:1; transition:opacity .16s ease; }
  html.erp-page-loading body { opacity:0; }
  .main.erp-content-host { position:relative; height:calc(100vh - 38px); padding:0 !important; overflow:hidden; background:#F5F5F5; }
  .erp-content-frame { position:absolute; inset:0; width:100%; height:100%; border:0; opacity:0; transition:opacity .18s ease; background:#F5F5F5; }
  .erp-content-frame.ready { opacity:1; }
  html.erp-embedded body { padding-top:0 !important; }
  html.erp-embedded body::after { inset:0 !important; }
  html.erp-embedded .layout { min-height:100vh !important; }
  html.erp-embedded .savebar,
  html.erp-embedded .table-card > .pager,
  html.erp-embedded .pager,
  html.erp-embedded .pg { left:0 !important; }
  html.erp-embedded .tbl thead th,
  html.erp-embedded .sku-tbl thead th,
  html.erp-embedded .main-table > thead > tr > th,
  html.erp-embedded .scan-card,
  html.erp-embedded .settings-tabs { top:0 !important; }
  html.erp-embedded .anchor-nav { top:122px !important; }
  @media (prefers-reduced-motion: reduce) { body { transition:none; } }

  /* ============ 顶部导航 ============ */
  .topbar { height:38px; background:#273542; display:flex; align-items:center; padding:0 14px; position:fixed; top:0; left:0; right:0; z-index:100; }
  .logo { width:124px; flex:none; display:flex; align-items:center; gap:7px; margin-right:0; color:#fff; font-size:14px; font-weight:500; letter-spacing:0; }
  .logo svg { flex:none; }
  .top-menu { display:flex; height:38px; flex:1; }
  .top-menu .tm { width:64px; flex:none; padding:0; display:flex; align-items:center; justify-content:center; color:rgba(255,255,255,.88); font-size:16px; font-weight:600; cursor:pointer; user-select:none; }
  .top-menu .tm:hover { color:#fff; }
  .top-menu .tm.active { background:#3D68FF; color:#fff; }
  .top-right { display:flex; align-items:center; gap:14px; }
  .top-right .icon-btn { width:26px; height:26px; display:flex; align-items:center; justify-content:center; border-radius:4px; cursor:pointer; color:rgba(255,255,255,.75); }
  .top-right .icon-btn:hover { background:rgba(255,255,255,.12); color:#fff; }
  .user-box { display:flex; align-items:center; gap:7px; cursor:pointer; padding:4px 6px; border-radius:4px; }
  .user-box:hover { background:rgba(255,255,255,.1); }
  .avatar { width:24px; height:24px; border-radius:50%; background:#3D68FF; color:#fff; font-size:14px; display:flex; align-items:center; justify-content:center; font-weight:600; }
  .user-name { color:rgba(255,255,255,.88); font-size:14px; }

  /* ============ 布局 ============ */
  .layout { display:flex; min-height:calc(100vh - 38px); }
  .sider { width:170px; height:calc(100vh - 38px); position:sticky; top:38px; align-self:flex-start; background:#fff; border-right:1px solid #e8e8e8; flex:none; padding:7px 0; transition:width .18s; overflow:hidden auto; z-index:91; }
  .sider.collapsed { width:44px; }
  .fold-btn { display:flex; align-items:center; gap:8px; height:34px; padding:0 13px; color:#555; cursor:pointer; white-space:nowrap; }
  .fold-btn:hover { color:#3D68FF; }
  .sider.collapsed .fold-btn { padding:0 14px; }
  .menu-group .g-head { display:flex; align-items:center; gap:8px; height:36px; padding:0 13px; color:#333; font-size:14px; cursor:pointer; white-space:nowrap; user-select:none; }
  .menu-group .g-head:hover { color:#3D68FF; }
  .menu-group .g-head .arrow { margin-left:auto; transform:rotate(180deg); transition:transform .18s; color:#777; }
  .menu-group.open .g-head { margin:1px 6px; padding:0 7px; border-radius:8px; background:#F3F3F3; }
  .menu-group.open .g-head .arrow { transform:rotate(0); }
  .menu-group .g-sub { display:none; }
  .menu-group.open .g-sub { display:block; }
  .g-sub .sub-item { display:flex; align-items:center; height:42px; padding:0 12px 0 34px; color:#555; font-size:14px; cursor:pointer; white-space:nowrap; margin:1px 3px; border-radius:6px; }
  .g-sub .sub-item:hover { color:#3D68FF; background:#F5F7FF; }
  .g-sub .sub-item.active { color:#3D68FF; background:transparent; font-weight:500; }
  .g-sub .sub-label { padding:4px 12px 2px 22px; color:#a8a8a8; font-size:14px; white-space:nowrap; margin:1px 3px; user-select:none; }
  .menu-group .g-head.cur { color:#3D68FF; background:transparent; border-radius:6px; margin:1px 3px; font-weight:500; }
  .sider-item { display:flex; align-items:center; gap:8px; height:36px; padding:0 13px; color:#333; font-size:14px; cursor:pointer; white-space:nowrap; user-select:none; }
  .sider-item:hover { color:#3D68FF; }
  .sider.collapsed .txt, .sider.collapsed .arrow, .sider.collapsed .g-sub { display:none !important; }
  .sider.collapsed .g-head, .sider.collapsed .sider-item { padding:0 14px; }

  .main { flex:1; padding:6px 13px 38px 7px; min-width:0; }
  `;
  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  if (isEmbedded) return;

  /* ---------- 菜单数据 ---------- */
  var TOP_MENUS = ['首页', '商品', '订单', '供应链', '仓储', '物流', '报表', '设置'];

  var ICONS = {
    in:      '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 7.2 8 2.2l6 5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 6.6V13h8V6.6" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M8 7.4v3.4M8 10.8l-1.4-1.4M8 10.8l1.4-1.4" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    ship:    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M1.6 7.4 6.2 3l4.6 4.4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.2 6.8V13h6V6.8" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M8.6 10h6M12.6 8.2l1.8 1.8-1.8 1.8" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    direct:  '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="3.2" y="2.6" width="9.6" height="11.4" rx="1.2" stroke="currentColor" stroke-width="1.2"/><path d="M6 2h4v2.2H6V2Z" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round"/><path d="M5.8 7.2h4.4M5.8 9.8h4.4" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/></svg>',
    box:     '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 7.2 8 2.2l6 5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 6.6V13h8V6.6" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>',
    boxes:   '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 7.2 8 2.2l6 5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 6.6V13h8V6.6" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><rect x="5.6" y="8.6" width="2.1" height="2.1" stroke="currentColor" stroke-width="1"/><rect x="8.3" y="8.6" width="2.1" height="2.1" stroke="currentColor" stroke-width="1"/></svg>',
    hot:     '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 7.2 8 2.2l6 5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 6.6V13h8V6.6" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M8.3 7.6c.15 1-.5 1.5-1 2.1-.45.55-.7 1-.7 1.6a1.7 1.7 0 0 0 3.4 0c0-.7-.35-1.2-.65-1.65-.2.3-.45.5-.8.6.25-.9-.05-2.1-.25-2.65Z" stroke="currentColor" stroke-width="1" stroke-linejoin="round"/></svg>',
    fast:    '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 7.2 8 2.2l6 5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 6.6V13h8V6.6" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M8.7 7.6 6.9 10h1.6l-.8 2.6 2-2.7H8.1l.6-2.3Z" stroke="currentColor" stroke-width="1" stroke-linejoin="round"/></svg>',
    other:   '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5.6" stroke="currentColor" stroke-width="1.2"/><circle cx="8" cy="8" r="2.9" stroke="currentColor" stroke-width="1.1"/><circle cx="8" cy="8" r="0.9" fill="currentColor"/></svg>',
    manage:  '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 7.2 8 2.2l6 5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 6.6V13h8V6.6" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M8 11.6V8.2M8 8.2 6.6 9.6M8 8.2l1.4 1.4" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    config:  '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.2"/><rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.2"/><rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.2"/><rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.2"/></svg>',
    log:     '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 1.8h6l2.2 2.2v10H4V1.8Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M10 1.8V4h2.2" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M6 7h4M6 9.5h4" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/></svg>'
  };

  var SIDE_MENUS = [
    { icon: 'in',     text: '入库',     children: ['入库签收', '入库上架', '入库单', '历史入库单', '快递签收', '退包签收', '退包分拣'] },
    { icon: 'ship',   text: '仓库发货', children: ['仓库订单', '仓库任务'] },
    { icon: 'direct', text: '入库直发', children: ['订制品直发'] },
    { icon: 'box',    text: '单品出库', children: ['配货', '发货'] },
    { icon: 'boxes',  text: '多品出库', children: ['配货', '分拣', '发货'] },
    { icon: 'hot',    text: '爆款出库', children: ['爆款配货', '单品爆款发货', '多品爆款发货'] },
    { icon: 'fast',   text: '快速发货', children: ['单品快速发货', '多品快速分拣', '多品快速发货'] },
    { icon: 'other',  text: '其他出库', children: ['称重出库', '手工出库单', '历史手工出库单'] },
    { icon: 'manage', text: '库内管理', children: [
        { label: '调拨' },     '调拨列表', '调拨出库', '调拨入库',
        { label: '盘点' },     '库存盘点',
        { label: '修改仓位' }, '手动修改仓位', '任务管理', '任务修改仓位',
        { label: '商品查询' }, '商品信息查询'
      ] },
    { icon: 'config', text: '基础配置', children: ['仓库列表', '篮子列表', '任务码', '仓储设置', '发货分类', '仓库审批设置'] },
    { icon: 'log',    text: '日志',     children: ['入库日志', '历史入库日志', '订单出库日志', '历史订单出库日志', '商品出库日志', '历史商品出库日志', '修改仓位日志', '历史修改仓位日志', '盘点日志', '历史盘点日志', '库内上架日志'] }
  ];

  /* 页面跳转映射：左侧子菜单 -> 对应 html 文件（新增页面在此补充） */
  var PAGE_LINKS = {
    '入库签收': '入库签收.html',
    '入库上架': '入库上架.html',
    '入库单': '入库单.html',
    '历史入库单': '历史入库单.html',
    '快递签收': '快递签收.html',
    '退包签收': '退包签收.html',
    '仓储设置': '仓储设置.html',
    '发货分类': '发货分类.html'
  };

  /* ---------- 当前页判断（按文件名自动高亮对应菜单） ---------- */
  var file = decodeURIComponent(location.pathname.split('/').pop() || '');
  var current = '';
  Object.keys(PAGE_LINKS).forEach(function (k) { if (PAGE_LINKS[k] === file) current = k; });
  var contentFrame = null;
  var frameTimer = null;

  function tip(type, msg) { if (window.toast) window.toast(type, msg); }

  function switchContent(link, label, aside) {
    var main = document.querySelector('.layout > .main');
    if (!main) return;
    aside.querySelectorAll('.sub-item.active').forEach(function (item) { item.classList.remove('active'); });
    var targetItem = Array.from(aside.querySelectorAll('.sub-item')).find(function (item) { return item.textContent.trim() === label; });
    if (targetItem) targetItem.classList.add('active');
    if (!contentFrame) {
      contentFrame = document.createElement('iframe');
      contentFrame.className = 'erp-content-frame';
      contentFrame.title = label;
      main.innerHTML = '';
      main.classList.add('erp-content-host');
      main.appendChild(contentFrame);
    }
    clearTimeout(frameTimer);
    contentFrame.classList.remove('ready');
    contentFrame.title = label;
    contentFrame.onload = function () { contentFrame.classList.add('ready'); };
    /* 子页面使用嵌入模式：不重复渲染顶部与侧栏，也不再使用负偏移裁切。 */
    frameTimer = setTimeout(function () {
      contentFrame.src = link + (link.indexOf('?') >= 0 ? '&' : '?') + '_erp_embed=1&_t=' + Date.now();
    }, 70);
    document.title = 'ERP - 仓储 - 入库 - ' + label;
  }

  /* ---------- 渲染 ---------- */
  function render() {
    /* 顶部导航 */
    var header = document.createElement('header');
    header.className = 'topbar';
    header.innerHTML =
      '<div class="logo">'
      + '<svg width="20" height="20" viewBox="0 0 20 20"><rect x="1" y="1" width="18" height="18" rx="4" fill="#3D68FF"/><path d="M6 7.2v5.6M6 7.2 10 4l4 3.2M10 6v10M14 9.5v3.5" stroke="#fff" stroke-width="1.6" stroke-linecap="round" fill="none"/></svg>'
      + 'ERP</div>'
      + '<nav class="top-menu" id="topMenu"></nav>'
      + '<div class="top-right">'
      + '<span class="icon-btn" title="消息"><svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 2a4.2 4.2 0 0 0-4.2 4.2c0 3-1.3 4.3-1.3 4.3h11s-1.3-1.3-1.3-4.3A4.2 4.2 0 0 0 8 2Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M6.8 13.2a1.3 1.3 0 0 0 2.4 0" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg></span>'
      + '<span class="icon-btn" title="帮助"><svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.4" stroke="currentColor" stroke-width="1.3"/><path d="M6.4 6.2c0-1 .8-1.7 1.7-1.7.9 0 1.6.7 1.6 1.6 0 1.2-1.6 1.3-1.6 2.6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><circle cx="8.05" cy="11.3" r=".8" fill="currentColor"/></svg></span>'
      + '<div class="user-box" title="个人中心"><div class="avatar">XW</div><span class="user-name">XWD</span></div>'
      + '</div>';
    document.body.insertBefore(header, document.body.firstChild);

    var topMenu = header.querySelector('#topMenu');
    topMenu.innerHTML = TOP_MENUS.map(function (m) {
      return '<div class="tm' + (m === '仓储' ? ' active' : '') + '">' + m + '</div>';
    }).join('');
    topMenu.querySelectorAll('.tm').forEach(function (t) {
      t.addEventListener('click', function () {
        if (t.classList.contains('active')) return;
        tip('info', '原型演示：本次仅实现【仓储】模块相关页面');
      });
    });

    /* 左侧菜单 */
    var layout = document.querySelector('.layout');
    if (!layout) return;
    var aside = document.createElement('aside');
    aside.className = 'sider';
    aside.id = 'sider';
    aside.innerHTML =
      '<div class="fold-btn" id="foldBtn"><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 3.5h12M2 8h12M2 12.5h12" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg><span class="txt">折叠面板</span></div>'
      + SIDE_MENUS.map(function (m, i) {
          var hasCurrent = m.children && m.children.some(function (c) { return typeof c === 'string' && c === current; });
          var html = '<div class="' + (m.children ? 'menu-group' + (hasCurrent ? ' open' : '') : 'sider-item') + '" data-idx="' + i + '">';
          html += '<div class="g-head' + (hasCurrent ? ' cur' : '') + '">' + ICONS[m.icon] + '<span class="txt">' + m.text + '</span>'
               + (m.children ? '<span class="arrow"><svg width="9" height="9" viewBox="0 0 10 10"><path d="M1.5 6.5 5 3l3.5 3.5" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg></span>' : '')
               + '</div>';
          if (m.children) {
            html += '<div class="g-sub">' + m.children.map(function (c) {
              if (typeof c === 'object' && c.label) return '<div class="sub-label">' + c.label + '</div>';
              return '<div class="sub-item' + (c === current ? ' active' : '') + '">' + c + '</div>';
            }).join('') + '</div>';
          }
          return html + '</div>';
        }).join('');
    layout.insertBefore(aside, layout.firstChild);

    /* 菜单事件 */
    aside.querySelector('#foldBtn').addEventListener('click', function () {
      aside.classList.toggle('collapsed');
    });
    aside.querySelectorAll('.g-head, .sider-item, .sub-item').forEach(function (el) {
      el.addEventListener('click', function () {
        if (el.classList.contains('g-head')) {
          var group = el.parentElement;
          var willOpen = !group.classList.contains('open');
          aside.querySelectorAll('.menu-group.open').forEach(function (item) { item.classList.remove('open'); });
          if (willOpen) group.classList.add('open');
          return;
        }
        if (el.classList.contains('active')) return;
        var link = PAGE_LINKS[el.textContent.trim()];
        if (link) {
          switchContent(link, el.textContent.trim(), aside);
          return;
        }
        tip('info', '该菜单页面将在后续原型中补充');
      });
    });

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        document.documentElement.classList.remove('erp-page-loading');
      });
    });
  }

  window.addEventListener('pageshow', function () {
    document.documentElement.classList.remove('erp-page-loading');
  });

  if (document.body) render();
  else document.addEventListener('DOMContentLoaded', render);
})();
