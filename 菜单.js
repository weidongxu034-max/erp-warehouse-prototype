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
  if (!isEmbedded) {
    var accountScriptUrl = new URL('账号菜单.js', document.currentScript ? document.currentScript.src : location.href);
    accountScriptUrl.searchParams.set('_t', String(Date.now()));
    var accountScript = document.createElement('script');
    accountScript.src = accountScriptUrl.href;
    document.head.appendChild(accountScript);
  }

  /* ---------- 菜单与布局样式（原各页面 <style> 中的「顶部导航 / 布局」两节） ---------- */
  var css = `
  html { background:#F5F5F5; -webkit-text-size-adjust:100%; text-size-adjust:100%; }
  body { opacity:1; transition:opacity .16s ease; }
  html.erp-page-loading body { opacity:0; }
  .main.erp-content-host { position:relative; height:calc(100vh - 38px); padding:0 !important; overflow:hidden; background:#F5F5F5; }
  .erp-content-frame { position:absolute; inset:0; width:100%; height:100%; border:0; opacity:0; transition:opacity .18s ease; background:#F5F5F5; }
  .erp-content-frame.ready { opacity:1; }
  .erp-sider-modal-shade { display:none; position:fixed; left:0; top:38px; bottom:0; width:170px; z-index:120; background:#0007; }
  .erp-sider-modal-shade.show { display:block; }
  .erp-sider-modal-shade.show::before { content:''; position:fixed; left:0; right:0; top:0; height:38px; background:#0007; }
  body:has(.sider.collapsed) .erp-sider-modal-shade { width:44px; }
  body.erp-hosting-content .pager,
  body.erp-hosting-content .pg,
  body.erp-hosting-content .cc-pager,
  body.erp-hosting-content .ap-pager,
  body.erp-hosting-content .selection-bar,
  body.erp-hosting-content .table-footer,
  body.erp-hosting-content .pagination-bar,
  body.erp-hosting-content .ap-form-footer,
  body.erp-hosting-content .savebar { display:none !important; }
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
  .top-menu .tm { position:relative; width:64px; flex:none; padding:0; display:flex; align-items:center; justify-content:center; color:rgba(255,255,255,.88); font-size:14px; font-weight:400 !important; cursor:pointer; user-select:none; }
  .top-menu .tm:hover { color:#fff; background:#395063; }
  .top-menu .tm.unavailable:hover::after { content:'该模块暂未构建'; position:absolute; top:42px; left:50%; z-index:120; width:max-content; padding:7px 10px; border-radius:4px; background:#303a44; box-shadow:0 3px 10px #0003; color:#fff; font-size:12px; font-weight:400; white-space:nowrap; transform:translateX(-50%); pointer-events:none; }
  .top-menu .tm.active { background:#3D68FF; color:#fff; }
  .top-menu .tm.mega-open { background:#3D68FF; color:#fff; }
  .warehouse-mega { display:none; position:fixed; top:42px; left:0; z-index:110; width:604px; max-height:calc(100vh - 54px); padding:11px 12px; overflow:auto; background:#fff; box-shadow:0 4px 14px rgba(25,38,55,.18); }
  .warehouse-mega.open { display:block; }
  .warehouse-mega-group { display:grid; grid-template-columns:100px repeat(4,120px); grid-auto-rows:38px; }
  .warehouse-mega a { display:flex; align-items:center; align-self:center; justify-self:start; width:max-content; height:30px; padding:0 15px; color:#24292f; font-size:13px; text-decoration:none; white-space:nowrap; border-radius:3px; }
  .warehouse-mega a:hover, .warehouse-mega a:focus-visible { color:#24292f; background:#f3f3f3; outline:none; }
  .warehouse-mega a.active, .warehouse-mega a.active:hover, .warehouse-mega a.active:focus-visible { color:#315efb; background:#f0f5ff; }
  .warehouse-mega a.mega-category { font-weight:600; }
  .warehouse-mega .mega-section { display:flex; align-items:center; align-self:center; justify-self:start; height:30px; padding:0 15px; color:#24292f; font-size:13px; font-weight:600; white-space:nowrap; }
  .report-mega .warehouse-mega-group { grid-auto-rows:35px; }
  .product-mega { width:728px; }
  .product-mega .warehouse-mega-group { grid-template-columns:120px repeat(4,145px); grid-auto-rows:42px; }
  .sider.product-sider .g-sub .sub-item.active { background:#f0f5ff; }
  .settings-mega { width:728px; }
  .settings-mega .warehouse-mega-group { grid-template-columns:120px repeat(4,145px); grid-auto-rows:35px; }
  .supply-mega { width:728px; }
  .supply-mega .warehouse-mega-group { grid-template-columns:120px repeat(4,145px); grid-auto-rows:38px; }
  .sider.supply-sider .g-sub .sub-item.active { background:#f0f5ff; }
  .logistics-mega { width:584px; }
  .logistics-mega .warehouse-mega-group { grid-template-columns:120px repeat(3,145px); grid-auto-rows:45px; }
  .logistics-count { display:inline-flex; align-items:center; justify-content:center; min-width:29px; height:21px; margin-left:5px; padding:0 6px; border-radius:12px; background:#f54b50; color:#fff; font-size:12px; line-height:1; }
  .sider.logistics-sider .g-sub .sub-item.active { background:#f0f5ff; }
  .sider.settings-sider .g-sub .sub-item.active { background:#f0f5ff; }
  .sider.settings-sider .menu-group.open .g-head { background:transparent; color:#3D68FF; }
  .sider.settings-sider .g-head svg:first-child { width:20px; height:20px; }
  @media (max-width:650px) { .warehouse-mega { width:calc(100vw - 16px); } .warehouse-mega-group { grid-template-columns:90px repeat(4,minmax(95px,1fr)); min-width:470px; } }
  .top-right { display:flex; align-items:center; gap:14px; }
  .pda-link { display:inline-flex; align-items:center; justify-content:center; height:26px; padding:0 8px; border-radius:4px; color:#fff; font-size:13px; font-weight:600; text-decoration:none; white-space:nowrap; }
  .pda-link:hover,.pda-link:focus-visible { background:rgba(255,255,255,.14); color:#fff; outline:none; }
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
  .menu-group .g-head:hover { color:#3D68FF; background:#F5F7FF; }
  .menu-group .g-head .arrow { margin-left:auto; transform:rotate(180deg); transition:transform .18s; color:#777; }
  .menu-group.open .g-head { margin:1px 6px; padding:0 7px; border-radius:8px; background:#F3F3F3; }
  .menu-group.open .g-head .arrow { transform:rotate(0); }
  .menu-group .g-sub { display:none; }
  .menu-group.open .g-sub { display:block; }
  .g-sub .sub-item { display:flex; align-items:center; height:42px; padding:0 12px 0 34px; color:#555; font-size:14px; cursor:pointer; white-space:nowrap; margin:1px 3px; border-radius:6px; }
  .g-sub .sub-item:hover { color:#3D68FF; background:#F5F7FF; }
  .g-sub .sub-item.active { color:#3D68FF; background:transparent; font-weight:500; }
  .sider.report-sider .g-sub .sub-item.active { background:#f0f5ff; }
  .g-sub .sub-label { padding:4px 12px 2px 22px; color:#a8a8a8; font-size:14px; white-space:nowrap; margin:1px 3px; user-select:none; }
  .menu-group .g-head.cur { color:#3D68FF; background:transparent; border-radius:6px; margin:1px 3px; font-weight:500; }
  .sider-item { display:flex; align-items:center; gap:8px; height:36px; padding:0 13px; color:#333; font-size:14px; cursor:pointer; white-space:nowrap; user-select:none; }
  .sider-item:hover { color:#3D68FF; background:#F5F7FF; }
  .erp-menu-notice { position:fixed; top:48px; left:50%; z-index:150; padding:8px 13px; border-radius:4px; background:#303a44; color:#fff; box-shadow:0 3px 10px #0003; transform:translateX(-50%); }
  .sider.collapsed .txt, .sider.collapsed .arrow, .sider.collapsed .g-sub { display:none !important; }
  .sider.collapsed .g-head, .sider.collapsed .sider-item { padding:0 14px; }

  .main { flex:1; padding:6px 13px 38px 7px; min-width:0; }
  `;
  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  if (isEmbedded) {
    document.addEventListener('DOMContentLoaded', function () {
      function syncModalShade() {
        var visible = Array.from(document.querySelectorAll('.mask,.dialog-shade,.modal-mask.show:has(.manual-generate-modal)')).some(function (element) {
          return !element.hidden && getComputedStyle(element).display !== 'none';
        });
        window.parent.postMessage({ type:'erp:sider-modal-shade', visible:visible }, '*');
      }
      new MutationObserver(syncModalShade).observe(document.body, { attributes:true, attributeFilter:['hidden','style','class'], childList:true, subtree:true });
      syncModalShade();
    });
    window.addEventListener('pagehide', function () {
      window.parent.postMessage({ type:'erp:sider-modal-shade', visible:false }, '*');
    });
    return;
  }

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
    cart:    '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 3h2l1.3 9h9.3l1.3-7H4.4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6.6" cy="15" r="1" fill="currentColor"/><circle cx="13.7" cy="15" r="1" fill="currentColor"/></svg>',
    supplier:'<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2.5 7 4 3.5h10L15.5 7M3 8v6.5h12V8M2.5 7c0 1.2.8 2 1.8 2s1.8-.8 1.8-2c0 1.2.8 2 1.8 2s1.8-.8 1.8-2c0 1.2.8 2 1.8 2s1.8-.8 1.8-2c0 1.2.8 2 1.8 2s1.8-.8 1.8-2M7 14.5v-4h4v4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    truck:   '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 4h8.5v8H2V4Zm8.5 3h2.8l2.7 2.5V12h-5.5V7Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><circle cx="5" cy="13" r="1.4" stroke="currentColor" stroke-width="1.3"/><circle cx="13.5" cy="13" r="1.4" stroke="currentColor" stroke-width="1.3"/></svg>',
    gear:    '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M8.2 1.5h3.6l.4 2a6.7 6.7 0 0 1 1.5.9l1.9-.7 1.8 3.1-1.5 1.3a7.2 7.2 0 0 1 0 1.8l1.5 1.3-1.8 3.1-1.9-.7a6.7 6.7 0 0 1-1.5.9l-.4 2H8.2l-.4-2a6.7 6.7 0 0 1-1.5-.9l-1.9.7-1.8-3.1 1.5-1.3a7.2 7.2 0 0 1 0-1.8L2.6 6.8l1.8-3.1 1.9.7a6.7 6.7 0 0 1 1.5-.9l.4-2Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><circle cx="10" cy="9" r="2.5" stroke="currentColor" stroke-width="1.4"/></svg>',
    log:     '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 1.8h6l2.2 2.2v10H4V1.8Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M10 1.8V4h2.2" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M6 7h4M6 9.5h4" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/></svg>'
  };

  var SIDE_MENUS = [
    { icon: 'in',     text: '入库',     children: ['入库签收', '入库上架', '入库单', '历史入库单', '快递签收', '退包签收', '退包分拣'] },
    { icon: 'ship',   text: '仓库发货', children: ['仓库订单', '仓库任务'] },
    { icon: 'direct', text: '入库直发', children: ['订制品直发'] },
    { icon: 'box',    text: '单品出库', children: [{ text: '配货', page: '单品配货.html' }, { text: '发货', page: '单品发货.html' }] },
    { icon: 'boxes',  text: '多品出库', children: [{ text: '配货', page: '多品配货.html' }, { text: '分拣', page: '多品分拣.html' }, { text: '发货', page: '多品发货.html' }] },
    { icon: 'hot',    text: '爆款出库', children: ['爆款配货', '单品爆款发货', '多品爆款发货'] },
    { icon: 'fast',   text: '快速发货', children: ['单品快速发货', '多品快速分拣', '多品快速发货'] },
    { icon: 'other',  text: '其他出库', children: ['称重出库', '手工出库单', '历史手工出库单'] },
    { icon: 'manage', text: '库内管理', children: [
        { label: '调拨' },     '调拨列表', '调拨出库', '调拨入库',
        { label: '盘点' },     '库存盘点',
        { label: '修改仓位' }, { text: '手动修改仓位', page: '手动修改仓位.html' }, { text: '任务管理', page: '任务管理.html' }, { text: '任务修改仓位', page: '任务修改仓位.html' },
        { label: '商品查询' }, { text: '商品信息查询', page: '商品信息查询.html' }
      ] },
    { icon: 'config', text: '基础配置', children: ['仓库列表', '篮子列表', '任务码', '仓储设置', '发货分类', '仓库审批设置', '仓库推荐货架'] },
    { icon: 'log',    text: '日志',     children: ['入库日志', '历史入库日志', '订单出库日志', '历史订单出库日志', '商品出库日志', '历史商品出库日志', '修改仓位日志', '历史修改仓位日志', '盘点日志', '历史盘点日志', '库内上架日志'] }
  ];

  var PRODUCT_MEGA = [
    { group: '商品管理', rows: [['商品SKU', 'SPU列表', '库存查询', '商品核实列表']] },
    { group: '基础配置', rows: [
      ['商品分类', '物流属性', '包材管理', '自定义分类'],
      ['违规原因配置', '申报敏感词库', '活跃度定义', '海关申报信息库'],
      ['商品核实配置']
    ] }
  ];
  var PRODUCT_SIDE_MENUS = PRODUCT_MEGA.map(function (section, index) {
    return { icon: index === 0 ? 'box' : 'config', text: section.group, children: section.rows.reduce(function (items, row) { return items.concat(row); }, []) };
  });
  var SETTINGS_MEGA = [
    { group: '设置', rows: [
      ['组织设置', '部门管理', '角色权限', '用户管理'],
      ['店铺管理', '地址管理', '标签管理']
    ] }
  ];
  var SETTINGS_SIDE_MENUS = [
    { icon: 'gear', text: '设置', children: ['组织设置', '部门管理', '角色权限', '用户管理', '店铺管理', '地址管理', '标签管理'] }
  ];
  var SUPPLY_MEGA = [
    { group: '采购管理', rows: [
      ['智能采购', '采购计划', '采购订单', '采购审核'],
      ['财务处理', '退货退款管理', '滞销商品SKU', '1688账号授权'],
      ['供应链数据跟进表']
    ] },
    { group: '供应商管理', rows: [['供应商列表', '供应商评级', '合同管理']] },
    { group: '基础配置', rows: [
      ['采购配置', '自定义分类', '供应商分类', '供应商标签'],
      ['审批设置']
    ] }
  ];
  var SUPPLY_SIDE_MENUS = SUPPLY_MEGA.map(function (section, index) {
    return { icon: index === 0 ? 'cart' : index === 1 ? 'supplier' : 'config', text: section.group, children: section.rows.reduce(function (items, row) { return items.concat(row); }, []) };
  });
  var LOGISTICS_MEGA = [
    { group: '物流中心', rows: [['物流授权', '订单物流跟踪', '区域管理']] },
    { group: '揽收管理', rows: [['物流揽收']] },
    { group: '基础配置', rows: [['自定义异常分类', '固定异常分类', '轨迹类型管理']] }
  ];
  var LOGISTICS_SIDE_MENUS = LOGISTICS_MEGA.map(function (section, index) {
    return { icon: index === 2 ? 'config' : 'truck', text: section.group, children: section.rows.reduce(function (items, row) { return items.concat(row); }, []) };
  });

  function logisticsRoute(label) {
    var fromOther = decodeURIComponent(location.pathname).indexOf('/其他内容/') >= 0;
    if (label === '物流揽收') return (fromOther ? '' : '../其他内容/') + '物流揽收.html';
    return (fromOther ? '../站点/' : '') + '物流.html?name=' + encodeURIComponent(label);
  }

  function supplyRoute(label) {
    var fromOther = decodeURIComponent(location.pathname).indexOf('/其他内容/') >= 0;
    if (label === '审批设置') return (fromOther ? '' : '../其他内容/') + '供应链审批设置.html';
    if (label === '采购订单') return (fromOther ? '../站点/' : '') + '采购订单.html';
    return (fromOther ? '../站点/' : '') + '供应链.html?name=' + encodeURIComponent(label);
  }

  function freshPageUrl(link) {
    var url = new URL(link, location.href);
    url.searchParams.set('_t', String(Date.now()));
    return url.href;
  }

  function productRoute(label) {
    if (label === '商品SKU') return '商品SKU.html';
    if (label === 'SPU列表') return 'SPU列表.html';
    if (label === '库存查询') return '库存查询.html';
    if (label === '商品核实列表') return '商品核实列表.html';
    if (label === '商品分类') return '商品分类.html';
    if (label === '物流属性') return '物流属性.html';
    if (label === '包材管理') return '包材管理.html';
    if (label === '自定义分类') return '自定义分类.html';
    if (label === '违规原因配置') return '违规原因配置.html';
    if (label === '申报敏感词库') return '申报敏感词库.html';
    if (label === '商品核实配置') return '商品核实配置.html';
    if (label === '活跃度定义') return '活跃度定义.html';
    if (label === '海关申报信息库') return '海关申报信息库.html';
    return '商品.html?name=' + encodeURIComponent(label);
  }
  function settingsRoute(label) {
    if (label === '组织设置') return '组织设置.html';
    if (label === '部门管理') return '部门管理.html';
    if (label === '角色权限') return '角色管理.html';
    if (label === '用户管理') return '用户管理.html';
    if (label === '店铺管理') return '店铺管理.html';
    if (label === '地址管理') return '地址管理.html';
    if (label === '标签管理') return '标签管理.html';
    return '设置.html?name=' + encodeURIComponent(label);
  }

  /* 页面跳转映射：左侧子菜单 -> 对应 html 文件（新增页面在此补充） */
  var PAGE_LINKS = {
    'SPU列表': 'SPU列表.html',
    '库存查询': '库存查询.html',
    '商品核实列表': '商品核实列表.html',
    '单品配货': '单品配货.html',
    '单品发货': '单品发货.html',
    '多品配货': '多品配货.html',
    '多品分拣': '多品分拣.html',
    '多品发货': '多品发货.html',
    '爆款配货': '爆款配货.html',
    '单品爆款发货': '单品爆款发货.html',
    '多品爆款发货': '多品爆款发货.html',
    '单品快速发货': '单品快速发货.html',
    '多品快速分拣': '多品快速分拣.html',
    '多品快速发货': '多品快速发货.html',
    '仓库订单': '仓库订单.html',
    '仓库任务': '仓库任务.html',
    '仓库列表': '仓库列表.html',
    '仓库审批设置': '仓库审批设置.html',
    '仓库推荐货架': '仓库推荐货架.html',
    '篮子列表': '篮子列表.html',
    '任务码': '任务码.html',
    '入库签收': '入库签收.html',
    '入库上架': '入库上架.html',
    '入库单': '入库单.html',
    '调拨列表': '调拨列表.html',
    '调拨出库': '调拨出库.html',
    '调拨入库': '调拨入库.html',
    '库存盘点': '库存盘点.html',
    '手动修改仓位': '手动修改仓位.html',
    '任务管理': '任务管理.html',
    '任务修改仓位': '任务修改仓位.html',
    '商品信息查询': '商品信息查询.html',
    '历史入库单': '历史入库单.html',
    '称重出库': '称重出库.html',
    '手工出库单': '手工出库单.html',
    '历史手工出库单': '历史手工出库单.html',
    '快递签收': '快递签收.html',
    '退包签收': '退包签收.html',
    '订制品直发': '订制品直发.html',
    '仓储设置': '仓储设置.html',
    '发货分类': '发货分类.html',
    '库内上架日志': '库内上架日志.html',
    '盘点日志': '盘点日志.html',
    '历史盘点日志': '历史盘点日志.html',
    '入库日志': '入库日志.html',
    '历史入库日志': '历史入库日志.html',
    '订单出库日志': '订单出库日志.html',
    '历史订单出库日志': '历史订单出库日志.html',
    '商品出库日志': '商品出库日志.html',
    '历史商品出库日志': '历史商品出库日志.html',
    '修改仓位日志': '修改仓位日志.html',
    '历史修改仓位日志': '历史仓位修改日志.html'
  };

  /* 仓储顶部导航展开内容，行列顺序与原系统保持一致。 */
  var WAREHOUSE_MEGA = [
    { group: '入库', target: '入库签收', rows: [['入库签收', '入库上架', '入库单', '历史入库单'], ['快递签收', '退包签收']] },
    { group: '仓库发货', target: '仓库订单', rows: [['仓库订单', '仓库任务']] },
    { group: '入库直发', target: '订制品直发', rows: [['订制品直发']] },
    { group: '单品出库', target: '单品配货', rows: [['配货', '发货']] },
    { group: '多品出库', target: '多品配货', rows: [['配货', '分拣', '发货']] },
    { group: '爆款出库', target: '爆款配货', rows: [['爆款配货', '单品爆款发货', '多品爆款发货']] },
    { group: '快速发货', target: '单品快速发货', rows: [['单品快速发货', '多品快速分拣', '多品快速发货']] },
    { group: '其他出库', target: '称重出库', rows: [['称重出库', '手工出库单', '历史手工出库单']] },
    { group: '库内管理', target: '调拨列表', rows: [
      [{ text: '调拨', target: '调拨列表', section: true }, '调拨列表', '调拨出库', '调拨入库'],
      [{ text: '盘点', target: '库存盘点', section: true }, '库存盘点'],
      [{ text: '修改仓位', target: '手动修改仓位', page: '手动修改仓位.html', section: true }, { text: '手动修改仓位', target: '手动修改仓位', page: '手动修改仓位.html' }, { text: '任务管理', target: '任务管理', page: '任务管理.html' }, { text: '任务修改仓位', target: '任务修改仓位', page: '任务修改仓位.html' }],
      [{ text: '商品查询', target: '商品信息查询', page: '商品信息查询.html', section: true }, { text: '商品信息查询', target: '商品信息查询', page: '商品信息查询.html' }]
    ] },
    { group: '基础配置', target: '仓库列表', rows: [['仓库列表', '篮子列表', '任务码', '仓储设置'], ['发货分类', '仓库审批设置', '仓库推荐货架']] },
    { group: '日志', target: '入库日志', rows: [
      ['入库日志', '历史入库日志', '订单出库日志', '历史订单出库日志'],
      ['商品出库日志', '历史商品出库日志', '修改仓位日志', '历史修改仓位日志'],
      ['盘点日志', '历史盘点日志', '库内上架日志']
    ] }
  ];

  var REPORT_MEGA = [
    { group: '销售报告', rows: [
      ['订单分析', '营业额报表', '发货率分析', '收支报表'],
      ['商品销量报表', '发货报表', '订单销售分析', '加工费分析'],
      ['超期未采购报表', '订单汇总统计', '24小时发货率', '热销商品Top500'],
      ['单品订单统计分析']
    ] },
    { group: '采购报告', rows: [['采购流水', '采购成本对比', '高未发待采购SPU']] },
    { group: '采购绩效', rows: [['采购情况分析', '采购员绩效', '库存率报表']] },
    { group: '仓储报告', rows: [['配货发货报表', '入库报表', '出入库流水']] }
  ];
  var REPORT_SIDE_MENUS = REPORT_MEGA.map(function (section) {
    return { icon: 'log', text: section.group, children: section.rows.reduce(function (items, row) { return items.concat(row); }, []) };
  });

  function reportRoute(label) {
    if (label === '配货发货报表') return '配货发货报表.html';
    if (label === '入库报表') return '入库报表.html';
    if (label === '出入库流水') return '出入库流水.html';
    return '报表.html?name=' + encodeURIComponent(label);
  }

  function placeholderRoute(label) {
    return '待构建页面.html?name=' + encodeURIComponent(label);
  }

  function megaTarget(group, cell) {
    var label = typeof cell === 'string' ? cell : cell.text;
    var target = typeof cell === 'string' ? label : (cell.target || label);
    if (group === '单品出库') target = label === '配货' ? '单品配货' : label === '发货' ? '单品发货' : target;
    if (group === '多品出库') target = label === '配货' ? '多品配货' : label === '分拣' ? '多品分拣' : label === '发货' ? '多品发货' : target;
    return { label: label, target: target, link: (cell && cell.page) || PAGE_LINKS[target] || placeholderRoute(target), section: Boolean(cell && cell.section) };
  }

  /* ---------- 当前页判断（按文件名自动高亮对应菜单） ---------- */
  var file = decodeURIComponent(location.pathname.split('/').pop() || '');
  var isProductHost = file === '商品.html' || file === '商品SKU.html' || file === 'SPU列表.html' || file === '库存查询.html' || file === '商品核实列表.html' || file === '图片中心.html' || file === '商品分类.html' || file === '物流属性.html' || file === '包材管理.html' || file === '自定义分类.html' || file === '违规原因配置.html' || file === '申报敏感词库.html' || file === '商品核实配置.html' || file === '活跃度定义.html' || file === '海关申报信息库.html';
  var isReportHost = file === '报表.html' || file === '配货发货报表.html' || file === '入库报表.html' || file === '出入库流水.html';
  var isSupplyHost = file === '供应链.html' || file === '采购订单.html' || file === '供应链审批设置.html';
  var isLogisticsHost = file === '物流.html' || file === '物流揽收.html';
  var isSettingsHost = file === '设置.html' || file === '组织设置.html' || file === '部门管理.html' || file === '角色管理.html' || file === '用户管理.html' || file === '店铺管理.html' || file === '地址管理.html' || file === '标签管理.html';
  var isHomeHost = file === '首页.html';
  var activeSideMenus = isProductHost ? PRODUCT_SIDE_MENUS : isReportHost ? REPORT_SIDE_MENUS : isSupplyHost ? SUPPLY_SIDE_MENUS : isLogisticsHost ? LOGISTICS_SIDE_MENUS : isSettingsHost ? SETTINGS_SIDE_MENUS : SIDE_MENUS;
  var current = '';
  Object.keys(PAGE_LINKS).forEach(function (k) { if (PAGE_LINKS[k] === file) current = k; });
  if (['仓库新增.html', '仓库详情.html', '货架新增.html', '货架详情.html', '货架编辑.html'].indexOf(file) >= 0) current = '仓库列表';
  if (['仓库审批新增.html', '仓库审批编辑.html'].indexOf(file) >= 0) current = '仓库审批设置';
  if (isReportHost) current = file === '配货发货报表.html' ? '配货发货报表' : file === '入库报表.html' ? '入库报表' : file === '出入库流水.html' ? '出入库流水' : (new URLSearchParams(location.search).get('name') || '订单分析');
  if (isProductHost) current = file === '商品SKU.html' || file === '图片中心.html' ? '商品SKU' : file === 'SPU列表.html' ? 'SPU列表' : file === '库存查询.html' ? '库存查询' : file === '商品核实列表.html' ? '商品核实列表' : file === '商品分类.html' ? '商品分类' : file === '物流属性.html' ? '物流属性' : file === '包材管理.html' ? '包材管理' : file === '自定义分类.html' ? '自定义分类' : file === '违规原因配置.html' ? '违规原因配置' : file === '申报敏感词库.html' ? '申报敏感词库' : file === '商品核实配置.html' ? '商品核实配置' : file === '活跃度定义.html' ? '活跃度定义' : file === '海关申报信息库.html' ? '海关申报信息库' : (new URLSearchParams(location.search).get('name') || '商品SKU');
  if (isSupplyHost) current = file === '采购订单.html' ? '采购订单' : file === '供应链审批设置.html' ? '审批设置' : (new URLSearchParams(location.search).get('name') || '智能采购');
  if (isLogisticsHost) current = file === '物流揽收.html' ? '物流揽收' : (new URLSearchParams(location.search).get('name') || '物流授权');
  if (isSettingsHost) current = file === '组织设置.html' ? '组织设置' : file === '部门管理.html' ? '部门管理' : file === '角色管理.html' ? '角色权限' : file === '用户管理.html' ? '用户管理' : file === '店铺管理.html' ? '店铺管理' : file === '地址管理.html' ? '地址管理' : file === '标签管理.html' ? '标签管理' : (new URLSearchParams(location.search).get('name') || '组织设置');
  var contentFrame = null;
  var frameTimer = null;
  var siderModalShade = null;

  function setSiderModalShade(visible) {
    if (!siderModalShade) {
      siderModalShade = document.createElement('div');
      siderModalShade.className = 'erp-sider-modal-shade';
      siderModalShade.setAttribute('aria-hidden', 'true');
      document.body.appendChild(siderModalShade);
    }
    siderModalShade.classList.toggle('show', Boolean(visible));
  }

  window.addEventListener('message', function (event) {
    if (!contentFrame || event.source !== contentFrame.contentWindow) return;
    if (!event.data || event.data.type !== 'erp:sider-modal-shade') return;
    setSiderModalShade(event.data.visible);
  });

  var menuNoticeTimer;
  function tip(type, msg) {
    if (typeof window.toast === 'function') { window.toast(type, msg); return; }
    var notice = document.getElementById('erpMenuNotice');
    if (!notice) { notice = document.createElement('div'); notice.id = 'erpMenuNotice'; notice.className = 'erp-menu-notice'; notice.setAttribute('role', 'status'); document.body.appendChild(notice); }
    notice.textContent = msg;
    notice.hidden = false;
    clearTimeout(menuNoticeTimer);
    menuNoticeTimer = setTimeout(function () { notice.hidden = true; }, 2100);
  }

  function switchContent(link, label, aside, sourceItem) {
    var main = document.querySelector('.layout > .main');
    if (!main) return;
    document.querySelectorAll('.warehouse-mega a.active').forEach(function (item) { item.classList.remove('active'); });
    document.querySelectorAll('.warehouse-mega a:not(.mega-category):not(.mega-section)').forEach(function (item) { item.classList.toggle('active', item.getAttribute('href') === link); });
    if (siderModalShade) setSiderModalShade(false);
    document.body.classList.add('erp-hosting-content');
    aside.querySelectorAll('.sub-item.active').forEach(function (item) { item.classList.remove('active'); });
    var targetItem = sourceItem || Array.from(aside.querySelectorAll('.sub-item')).find(function (item) { return (item.dataset.label || item.textContent.trim()) === label; });
    if (targetItem) {
      targetItem.classList.add('active');
      var targetGroup = targetItem.closest('.menu-group');
      if (targetGroup) {
        aside.querySelectorAll('.menu-group.open').forEach(function (group) { group.classList.remove('open'); });
        aside.querySelectorAll('.g-head.cur').forEach(function (head) { head.classList.remove('cur'); });
        targetGroup.classList.add('open');
        targetGroup.querySelector('.g-head').classList.add('cur');
      }
    }
    if (!contentFrame) {
      contentFrame = document.createElement('iframe');
      contentFrame.className = 'erp-content-frame';
      contentFrame.title = label;
      if (isSettingsHost) {
        /* 保留原页面节点，避免其全局事件处理器在切页后找不到控件。 */
        var parkedContent = document.createElement('div');
        parkedContent.style.display = 'none';
        while (main.firstChild) parkedContent.appendChild(main.firstChild);
        main.appendChild(parkedContent);
      } else {
        main.innerHTML = '';
      }
      main.classList.add('erp-content-host');
      main.appendChild(contentFrame);
    }
    clearTimeout(frameTimer);
    contentFrame.classList.remove('ready');
    contentFrame.title = label;
    contentFrame.onload = function () { contentFrame.classList.add('ready'); };
    /* 子页面使用嵌入模式：不重复渲染顶部与侧栏，也不再使用负偏移裁切。 */
    frameTimer = setTimeout(function () {
      var frameUrl = new URL(freshPageUrl(link));
      frameUrl.searchParams.set('_erp_embed', '1');
      if (isSettingsHost) contentFrame.contentWindow.location.replace(frameUrl.href);
      else contentFrame.src = frameUrl.href;
    }, 70);
    document.title = 'ERP - ' + (isSettingsHost ? '设置' : isProductHost ? '商品' : isSupplyHost ? '供应链' : isLogisticsHost ? '物流' : '仓储') + ' - ' + label;
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
      + '<a class="pda-link" href="PDA登录页.html" title="PDA登录">PDA</a>'
      + '<span class="icon-btn" title="消息"><svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 2a4.2 4.2 0 0 0-4.2 4.2c0 3-1.3 4.3-1.3 4.3h11s-1.3-1.3-1.3-4.3A4.2 4.2 0 0 0 8 2Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M6.8 13.2a1.3 1.3 0 0 0 2.4 0" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg></span>'
      + '<span class="icon-btn" title="帮助"><svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.4" stroke="currentColor" stroke-width="1.3"/><path d="M6.4 6.2c0-1 .8-1.7 1.7-1.7.9 0 1.6.7 1.6 1.6 0 1.2-1.6 1.3-1.6 2.6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><circle cx="8.05" cy="11.3" r=".8" fill="currentColor"/></svg></span>'
      + '<div class="user-box" title="账号菜单"><div class="avatar">XW</div><span class="user-name">XWD</span></div>'
      + '</div>';
    document.body.insertBefore(header, document.body.firstChild);

    /* 新增 HTML 页面链接无需单独配置，跳转时统一生成新的时间戳。 */
    function refreshHtmlAnchor(event) {
      var link = event.target.closest('a[href]');
      if (!link || link.hasAttribute('download')) return;
      var href = link.getAttribute('href');
      if (!href || href.charAt(0) === '#') return;
      var url = new URL(href, location.href);
      if (url.origin !== location.origin || !/\.html$/i.test(url.pathname)) return;
      link.href = freshPageUrl(href);
    }
    ['click', 'auxclick', 'contextmenu'].forEach(function (type) {
      document.addEventListener(type, refreshHtmlAnchor, true);
    });

    var topMenu = header.querySelector('#topMenu');
    topMenu.innerHTML = TOP_MENUS.map(function (m) {
      return '<div class="tm' + (m === (isHomeHost ? '首页' : isProductHost ? '商品' : isSupplyHost ? '供应链' : isLogisticsHost ? '物流' : isReportHost ? '报表' : isSettingsHost ? '设置' : '仓储') ? ' active' : '') + (m === '订单' ? ' unavailable' : '') + '">' + m + '</div>';
    }).join('');
    topMenu.querySelectorAll('.tm').forEach(function (t) {
      t.addEventListener('click', function () {
        if (t.textContent.trim() === '首页') { location.href = freshPageUrl('首页.html'); return; }
        if (t.textContent.trim() === '商品' || t.textContent.trim() === '供应链' || t.textContent.trim() === '仓储' || t.textContent.trim() === '物流' || t.textContent.trim() === '报表' || t.textContent.trim() === '设置') return;
        tip('info', '该模块页面将在后续原型中补充');
      });
    });

    /* 左侧菜单 */
    var layout = document.querySelector('.layout');
    if (!layout) return;
    var aside = document.createElement('aside');
    aside.className = 'sider' + (isReportHost ? ' report-sider' : isProductHost ? ' product-sider' : isSupplyHost ? ' supply-sider' : isLogisticsHost ? ' logistics-sider' : isSettingsHost ? ' settings-sider' : '');
    aside.id = 'sider';
    aside.innerHTML =
      '<div class="fold-btn" id="foldBtn"><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 3.5h12M2 8h12M2 12.5h12" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg><span class="txt">折叠面板</span></div>'
      + activeSideMenus.map(function (m, i) {
          var hasCurrent = m.children && m.children.some(function (c) { return c === current || (typeof c === 'object' && c.page === file); });
          var html = '<div class="' + (m.children ? 'menu-group' + (hasCurrent ? ' open' : '') : 'sider-item') + '" data-idx="' + i + '">';
          html += '<div class="g-head' + (hasCurrent ? ' cur' : '') + '">' + ICONS[m.icon] + '<span class="txt">' + m.text + '</span>'
               + (m.children ? '<span class="arrow"><svg width="9" height="9" viewBox="0 0 10 10"><path d="M1.5 6.5 5 3l3.5 3.5" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg></span>' : '')
               + '</div>';
          if (m.children) {
            html += '<div class="g-sub">' + m.children.map(function (c) {
              if (typeof c === 'object' && c.label && !c.page) return '<div class="sub-label">' + c.label + '</div>';
              if (typeof c === 'object' && c.page) return '<div class="sub-item' + (c.page === file ? ' active' : '') + '" data-page="' + c.page + '">' + c.text + '</div>';
              return '<div class="sub-item' + (c === current ? ' active' : '') + '" data-label="' + c + '">' + c + (isLogisticsHost && c === '物流揽收' ? '<span class="logistics-count">40</span>' : '') + '</div>';
            }).join('') + '</div>';
          }
          return html + '</div>';
        }).join('');
    layout.insertBefore(aside, layout.firstChild);

    function showSettingsPage(label, link, sourceItem, fromHistory) {
      switchContent(link, label, aside, sourceItem);
      if (!fromHistory) {
        var url = new URL(location.href);
        url.hash = link === file ? '' : 'erp_page=' + encodeURIComponent(link);
        if (url.href !== location.href) history.pushState({ settingsPage: link }, '', url.href);
      }
    }
    if (isSettingsHost) {
      window.addEventListener('popstate', function () {
        var target = location.hash.indexOf('#erp_page=') === 0 ? decodeURIComponent(location.hash.slice(10)) : file;
        var label = SETTINGS_SIDE_MENUS[0].children.find(function (item) { return settingsRoute(item) === target; });
        if (label) showSettingsPage(label, target, null, true);
      });
    }

    /* 顶部“仓储”悬浮菜单：分组标题仅作说明，具体页面名称可跳转。 */
    var warehouseTab = Array.from(topMenu.querySelectorAll('.tm')).find(function (item) { return item.textContent.trim() === '仓储'; });
    var mega = document.createElement('div');
    mega.id = 'warehouseMega';
    mega.className = 'warehouse-mega';
    mega.setAttribute('aria-label', '仓储页面导航');
    WAREHOUSE_MEGA.forEach(function (section) {
      var block = document.createElement('div');
      block.className = 'warehouse-mega-group';
      var category = document.createElement('a');
      var categoryRoute = megaTarget(section.group, { text: section.group, target: section.target });
      category.textContent = section.group;
      category.href = categoryRoute.link;
      category.className = 'mega-category';
      category.style.gridColumn = '1';
      category.style.gridRow = '1';
      category.dataset.megaLink = '1';
      category.dataset.group = section.group;
      category.dataset.label = section.group;
      category.dataset.target = categoryRoute.target;
      block.appendChild(category);
      section.rows.forEach(function (row, rowIndex) {
        row.forEach(function (cell, columnIndex) {
          var route = megaTarget(section.group, cell);
          var link = document.createElement(route.section ? 'span' : 'a');
          link.textContent = route.label;
          if (!route.section) link.href = route.link;
          link.style.gridColumn = String(columnIndex + 2);
          link.style.gridRow = String(rowIndex + 1);
          if (route.section) link.className = 'mega-section';
          if (!route.section && route.target === current) link.classList.add('active');
          if (!route.section) link.dataset.megaLink = '1';
          link.dataset.group = section.group;
          link.dataset.label = route.label;
          link.dataset.target = route.target;
          block.appendChild(link);
        });
      });
      mega.appendChild(block);
    });
    document.body.appendChild(mega);
    warehouseTab.setAttribute('role', 'button');
    warehouseTab.setAttribute('tabindex', '0');
    warehouseTab.setAttribute('aria-controls', 'warehouseMega');
    warehouseTab.setAttribute('aria-expanded', 'false');
    var megaPinned = false;
    var megaCloseTimer = null;
    function positionMega() {
      var tabLeft = warehouseTab.getBoundingClientRect().left;
      var maxLeft = window.innerWidth - mega.getBoundingClientRect().width - 8;
      mega.style.left = Math.max(8, Math.min(tabLeft, maxLeft)) + 'px';
    }
    function openMega() {
      clearTimeout(megaCloseTimer);
      if (reportMega) { reportPinned = false; closeReportMega(true); }
      if (productMega) { productPinned = false; closeProductMega(true); }
      if (supplyMega) { supplyPinned = false; closeSupplyMega(true); }
      if (settingsMega) { settingsPinned = false; closeSettingsMega(true); }
      if (logisticsMega) { logisticsPinned = false; closeLogisticsMega(true); }
      mega.classList.add('open');
      positionMega();
      warehouseTab.classList.add('mega-open');
      warehouseTab.setAttribute('aria-expanded', 'true');
    }
    function closeMega(force) {
      if (megaPinned && !force) return;
      clearTimeout(megaCloseTimer);
      mega.classList.remove('open');
      warehouseTab.classList.remove('mega-open');
      warehouseTab.setAttribute('aria-expanded', 'false');
    }
    function scheduleMegaClose() {
      clearTimeout(megaCloseTimer);
      megaCloseTimer = setTimeout(function () { closeMega(false); }, 180);
    }
    function toggleMega() {
      if (megaPinned) { megaPinned = false; closeMega(true); }
      else { megaPinned = true; openMega(); }
    }
    warehouseTab.addEventListener('mouseenter', openMega);
    warehouseTab.addEventListener('mouseleave', scheduleMegaClose);
    warehouseTab.addEventListener('click', function (event) { event.stopPropagation(); toggleMega(); });
    warehouseTab.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleMega(); }
    });
    mega.addEventListener('mouseenter', function () { clearTimeout(megaCloseTimer); });
    mega.addEventListener('mouseleave', scheduleMegaClose);
    window.addEventListener('resize', function () { if (mega.classList.contains('open')) positionMega(); });
    mega.addEventListener('click', function (event) {
      var link = event.target.closest('a[data-mega-link]');
      if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      megaPinned = false;
      closeMega(true);
      if (isReportHost || isProductHost || isSupplyHost || isSettingsHost) { location.href = freshPageUrl(link.getAttribute('href')); return; }
      var index = SIDE_MENUS.findIndex(function (group) { return group.text === link.dataset.group; });
      var sideGroup = aside.querySelector('.menu-group[data-idx="' + index + '"]');
      var sourceItem = sideGroup && Array.from(sideGroup.querySelectorAll('.sub-item')).find(function (item) {
        return item.dataset.page === link.getAttribute('href') || item.textContent.trim() === link.dataset.label || item.textContent.trim() === link.dataset.target;
      });
      switchContent(link.getAttribute('href'), link.dataset.target, aside, sourceItem);
    });
    document.addEventListener('pointerdown', function (event) {
      if (!mega.contains(event.target) && !warehouseTab.contains(event.target)) { megaPinned = false; closeMega(true); }
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && mega.classList.contains('open')) { megaPinned = false; closeMega(true); warehouseTab.focus(); }
    });

    /* 报表导航与仓储导航同样支持悬浮、点击和键盘展开。 */
    var reportTab = Array.from(topMenu.querySelectorAll('.tm')).find(function (item) { return item.textContent.trim() === '报表'; });
    var reportMega = document.createElement('div');
    reportMega.id = 'reportMega';
    reportMega.className = 'warehouse-mega report-mega';
    reportMega.setAttribute('aria-label', '报表页面导航');
    REPORT_MEGA.forEach(function (section) {
      var block = document.createElement('div');
      block.className = 'warehouse-mega-group';
      var category = document.createElement('a');
      category.textContent = section.group;
      category.href = reportRoute(section.rows[0][0]);
      category.className = 'mega-category';
      category.style.gridColumn = '1';
      category.style.gridRow = '1';
      block.appendChild(category);
      section.rows.forEach(function (row, rowIndex) {
        row.forEach(function (label, columnIndex) {
          var link = document.createElement('a');
          link.textContent = label;
          link.href = reportRoute(label);
          link.style.gridColumn = String(columnIndex + 2);
          link.style.gridRow = String(rowIndex + 1);
          if (label === current) link.classList.add('active');
          block.appendChild(link);
        });
      });
      reportMega.appendChild(block);
    });
    document.body.appendChild(reportMega);
    reportTab.setAttribute('role', 'button');
    reportTab.setAttribute('tabindex', '0');
    reportTab.setAttribute('aria-controls', 'reportMega');
    reportTab.setAttribute('aria-expanded', 'false');
    var reportPinned = false;
    var reportCloseTimer = null;
    function positionReportMega() {
      var tabLeft = reportTab.getBoundingClientRect().left;
      var maxLeft = window.innerWidth - reportMega.getBoundingClientRect().width - 8;
      reportMega.style.left = Math.max(8, Math.min(tabLeft, maxLeft)) + 'px';
    }
    function openReportMega() {
      clearTimeout(reportCloseTimer);
      megaPinned = false;
      closeMega(true);
      if (productMega) { productPinned = false; closeProductMega(true); }
      if (supplyMega) { supplyPinned = false; closeSupplyMega(true); }
      if (settingsMega) { settingsPinned = false; closeSettingsMega(true); }
      if (logisticsMega) { logisticsPinned = false; closeLogisticsMega(true); }
      reportMega.classList.add('open');
      positionReportMega();
      reportTab.classList.add('mega-open');
      reportTab.setAttribute('aria-expanded', 'true');
    }
    function closeReportMega(force) {
      if (reportPinned && !force) return;
      clearTimeout(reportCloseTimer);
      reportMega.classList.remove('open');
      reportTab.classList.remove('mega-open');
      reportTab.setAttribute('aria-expanded', 'false');
    }
    function scheduleReportClose() {
      clearTimeout(reportCloseTimer);
      reportCloseTimer = setTimeout(function () { closeReportMega(false); }, 180);
    }
    function toggleReportMega() {
      if (reportPinned) { reportPinned = false; closeReportMega(true); }
      else { reportPinned = true; openReportMega(); }
    }
    reportTab.addEventListener('mouseenter', openReportMega);
    reportTab.addEventListener('mouseleave', scheduleReportClose);
    reportTab.addEventListener('click', function (event) { event.stopPropagation(); toggleReportMega(); });
    reportTab.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleReportMega(); }
    });
    reportMega.addEventListener('mouseenter', function () { clearTimeout(reportCloseTimer); });
    reportMega.addEventListener('mouseleave', scheduleReportClose);
    window.addEventListener('resize', function () { if (reportMega.classList.contains('open')) positionReportMega(); });
    document.addEventListener('pointerdown', function (event) {
      if (!reportMega.contains(event.target) && !reportTab.contains(event.target)) { reportPinned = false; closeReportMega(true); }
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && reportMega.classList.contains('open')) { reportPinned = false; closeReportMega(true); reportTab.focus(); }
    });

    /* 商品导航与侧栏入口保持一致。 */
    var productTab = Array.from(topMenu.querySelectorAll('.tm')).find(function (item) { return item.textContent.trim() === '商品'; });
    var productMega = document.createElement('div');
    productMega.id = 'productMega';
    productMega.className = 'warehouse-mega product-mega';
    productMega.setAttribute('aria-label', '商品页面导航');
    PRODUCT_MEGA.forEach(function (section) {
      var block = document.createElement('div');
      block.className = 'warehouse-mega-group';
      var category = document.createElement('a');
      category.textContent = section.group;
      category.href = productRoute(section.rows[0][0]);
      category.className = 'mega-category';
      category.style.gridColumn = '1';
      category.style.gridRow = '1';
      block.appendChild(category);
      section.rows.forEach(function (row, rowIndex) {
        row.forEach(function (label, columnIndex) {
          var link = document.createElement('a');
          link.textContent = label;
          link.href = productRoute(label);
          link.style.gridColumn = String(columnIndex + 2);
          link.style.gridRow = String(rowIndex + 1);
          if (label === current) link.classList.add('active');
          block.appendChild(link);
        });
      });
      productMega.appendChild(block);
    });
    document.body.appendChild(productMega);
    productTab.setAttribute('role', 'button');
    productTab.setAttribute('tabindex', '0');
    productTab.setAttribute('aria-controls', 'productMega');
    productTab.setAttribute('aria-expanded', 'false');
    var productPinned = false;
    var productCloseTimer = null;
    function positionProductMega() {
      var tabLeft = productTab.getBoundingClientRect().left;
      var maxLeft = window.innerWidth - productMega.getBoundingClientRect().width - 8;
      productMega.style.left = Math.max(8, Math.min(tabLeft, maxLeft)) + 'px';
    }
    function openProductMega() {
      clearTimeout(productCloseTimer);
      megaPinned = false;
      reportPinned = false;
      closeMega(true);
      closeReportMega(true);
      if (supplyMega) { supplyPinned = false; closeSupplyMega(true); }
      if (settingsMega) { settingsPinned = false; closeSettingsMega(true); }
      if (logisticsMega) { logisticsPinned = false; closeLogisticsMega(true); }
      productMega.classList.add('open');
      positionProductMega();
      productTab.classList.add('mega-open');
      productTab.setAttribute('aria-expanded', 'true');
    }
    function closeProductMega(force) {
      if (productPinned && !force) return;
      clearTimeout(productCloseTimer);
      productMega.classList.remove('open');
      productTab.classList.remove('mega-open');
      productTab.setAttribute('aria-expanded', 'false');
    }
    function scheduleProductClose() {
      clearTimeout(productCloseTimer);
      productCloseTimer = setTimeout(function () { closeProductMega(false); }, 180);
    }
    function toggleProductMega() {
      if (productPinned) { productPinned = false; closeProductMega(true); }
      else { productPinned = true; openProductMega(); }
    }
    productTab.addEventListener('mouseenter', openProductMega);
    productTab.addEventListener('mouseleave', scheduleProductClose);
    productTab.addEventListener('click', function (event) { event.stopPropagation(); toggleProductMega(); });
    productTab.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleProductMega(); }
    });
    productMega.addEventListener('mouseenter', function () { clearTimeout(productCloseTimer); });
    productMega.addEventListener('mouseleave', scheduleProductClose);
    window.addEventListener('resize', function () { if (productMega.classList.contains('open')) positionProductMega(); });
    document.addEventListener('pointerdown', function (event) {
      if (!productMega.contains(event.target) && !productTab.contains(event.target)) { productPinned = false; closeProductMega(true); }
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && productMega.classList.contains('open')) { productPinned = false; closeProductMega(true); productTab.focus(); }
    });

    /* 供应链：顶部展开与左侧三个分组使用同一份菜单数据。 */
    var supplyTab = Array.from(topMenu.querySelectorAll('.tm')).find(function (item) { return item.textContent.trim() === '供应链'; });
    var supplyMega = document.createElement('div');
    supplyMega.id = 'supplyMega';
    supplyMega.className = 'warehouse-mega supply-mega';
    supplyMega.setAttribute('aria-label', '供应链页面导航');
    SUPPLY_MEGA.forEach(function (section) {
      var block = document.createElement('div');
      block.className = 'warehouse-mega-group';
      var category = document.createElement('a');
      category.textContent = section.group;
      category.href = supplyRoute(section.rows[0][0]);
      category.className = 'mega-category';
      category.style.gridColumn = '1';
      category.style.gridRow = '1';
      block.appendChild(category);
      section.rows.forEach(function (row, rowIndex) {
        row.forEach(function (label, columnIndex) {
          var link = document.createElement('a');
          link.textContent = label;
          link.href = supplyRoute(label);
          link.style.gridColumn = String(columnIndex + 2);
          link.style.gridRow = String(rowIndex + 1);
          if (label === current && isSupplyHost) link.classList.add('active');
          block.appendChild(link);
        });
      });
      supplyMega.appendChild(block);
    });
    document.body.appendChild(supplyMega);
    supplyTab.setAttribute('role', 'button');
    supplyTab.setAttribute('tabindex', '0');
    supplyTab.setAttribute('aria-controls', 'supplyMega');
    supplyTab.setAttribute('aria-expanded', 'false');
    var supplyPinned = false;
    var supplyCloseTimer = null;
    function positionSupplyMega() {
      var tabLeft = supplyTab.getBoundingClientRect().left;
      var maxLeft = window.innerWidth - supplyMega.getBoundingClientRect().width - 8;
      supplyMega.style.left = Math.max(8, Math.min(tabLeft, maxLeft)) + 'px';
    }
    function openSupplyMega() {
      clearTimeout(supplyCloseTimer);
      megaPinned = false;
      reportPinned = false;
      productPinned = false;
      closeMega(true);
      closeReportMega(true);
      closeProductMega(true);
      if (settingsMega) { settingsPinned = false; closeSettingsMega(true); }
      if (logisticsMega) { logisticsPinned = false; closeLogisticsMega(true); }
      supplyMega.classList.add('open');
      positionSupplyMega();
      supplyTab.classList.add('mega-open');
      supplyTab.setAttribute('aria-expanded', 'true');
    }
    function closeSupplyMega(force) {
      if (supplyPinned && !force) return;
      clearTimeout(supplyCloseTimer);
      supplyMega.classList.remove('open');
      supplyTab.classList.remove('mega-open');
      supplyTab.setAttribute('aria-expanded', 'false');
    }
    function scheduleSupplyClose() {
      clearTimeout(supplyCloseTimer);
      supplyCloseTimer = setTimeout(function () { closeSupplyMega(false); }, 180);
    }
    function toggleSupplyMega() {
      if (supplyPinned) { supplyPinned = false; closeSupplyMega(true); }
      else { supplyPinned = true; openSupplyMega(); }
    }
    supplyTab.addEventListener('mouseenter', openSupplyMega);
    supplyTab.addEventListener('mouseleave', scheduleSupplyClose);
    supplyTab.addEventListener('click', function (event) { event.stopPropagation(); toggleSupplyMega(); });
    supplyTab.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleSupplyMega(); }
    });
    supplyMega.addEventListener('mouseenter', function () { clearTimeout(supplyCloseTimer); });
    supplyMega.addEventListener('mouseleave', scheduleSupplyClose);
    window.addEventListener('resize', function () { if (supplyMega.classList.contains('open')) positionSupplyMega(); });
    document.addEventListener('pointerdown', function (event) {
      if (!supplyMega.contains(event.target) && !supplyTab.contains(event.target)) { supplyPinned = false; closeSupplyMega(true); }
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && supplyMega.classList.contains('open')) { supplyPinned = false; closeSupplyMega(true); supplyTab.focus(); }
    });

    /* 设置导航：顶部展开与侧栏七个入口保持一致。 */
    var settingsTab = Array.from(topMenu.querySelectorAll('.tm')).find(function (item) { return item.textContent.trim() === '设置'; });
    var settingsMega = document.createElement('div');
    settingsMega.id = 'settingsMega';
    settingsMega.className = 'warehouse-mega settings-mega';
    settingsMega.setAttribute('aria-label', '设置页面导航');
    SETTINGS_MEGA.forEach(function (section) {
      var block = document.createElement('div');
      block.className = 'warehouse-mega-group';
      var category = document.createElement('a');
      category.textContent = section.group;
      category.href = settingsRoute(section.rows[0][0]);
      category.className = 'mega-category';
      category.style.gridColumn = '1';
      category.style.gridRow = '1';
      block.appendChild(category);
      section.rows.forEach(function (row, rowIndex) {
        row.forEach(function (label, columnIndex) {
          var link = document.createElement('a');
          link.textContent = label;
          link.href = settingsRoute(label);
          link.style.gridColumn = String(columnIndex + 2);
          link.style.gridRow = String(rowIndex + 1);
          if (label === current) link.classList.add('active');
          block.appendChild(link);
        });
      });
      settingsMega.appendChild(block);
    });
    document.body.appendChild(settingsMega);
    settingsTab.setAttribute('role', 'button');
    settingsTab.setAttribute('tabindex', '0');
    settingsTab.setAttribute('aria-controls', 'settingsMega');
    settingsTab.setAttribute('aria-expanded', 'false');
    var settingsPinned = false;
    var settingsCloseTimer = null;
    function positionSettingsMega() {
      var tabLeft = settingsTab.getBoundingClientRect().left;
      var maxLeft = window.innerWidth - settingsMega.getBoundingClientRect().width - 8;
      settingsMega.style.left = Math.max(8, Math.min(tabLeft, maxLeft)) + 'px';
    }
    function openSettingsMega() {
      clearTimeout(settingsCloseTimer);
      megaPinned = false;
      reportPinned = false;
      productPinned = false;
      supplyPinned = false;
      closeMega(true);
      closeReportMega(true);
      closeProductMega(true);
      closeSupplyMega(true);
      if (logisticsMega) { logisticsPinned = false; closeLogisticsMega(true); }
      settingsMega.classList.add('open');
      positionSettingsMega();
      settingsTab.classList.add('mega-open');
      settingsTab.setAttribute('aria-expanded', 'true');
    }
    function closeSettingsMega(force) {
      if (settingsPinned && !force) return;
      clearTimeout(settingsCloseTimer);
      settingsMega.classList.remove('open');
      settingsTab.classList.remove('mega-open');
      settingsTab.setAttribute('aria-expanded', 'false');
    }
    function scheduleSettingsClose() {
      clearTimeout(settingsCloseTimer);
      settingsCloseTimer = setTimeout(function () { closeSettingsMega(false); }, 180);
    }
    function toggleSettingsMega() {
      if (settingsPinned) { settingsPinned = false; closeSettingsMega(true); }
      else { settingsPinned = true; openSettingsMega(); }
    }
    settingsTab.addEventListener('mouseenter', openSettingsMega);
    settingsTab.addEventListener('mouseleave', scheduleSettingsClose);
    settingsTab.addEventListener('click', function (event) { event.stopPropagation(); toggleSettingsMega(); });
    settingsTab.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleSettingsMega(); }
    });
    settingsMega.addEventListener('mouseenter', function () { clearTimeout(settingsCloseTimer); });
    settingsMega.addEventListener('mouseleave', scheduleSettingsClose);
    settingsMega.addEventListener('click', function (event) {
      var link = event.target.closest('a[href]');
      if (!isSettingsHost || !link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      settingsPinned = false;
      closeSettingsMega(true);
      var label = link.classList.contains('mega-category') ? SETTINGS_SIDE_MENUS[0].children[0] : link.textContent.trim();
      showSettingsPage(label, settingsRoute(label));
    });
    window.addEventListener('resize', function () { if (settingsMega.classList.contains('open')) positionSettingsMega(); });
    document.addEventListener('pointerdown', function (event) {
      if (!settingsMega.contains(event.target) && !settingsTab.contains(event.target)) { settingsPinned = false; closeSettingsMega(true); }
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && settingsMega.classList.contains('open')) { settingsPinned = false; closeSettingsMega(true); settingsTab.focus(); }
    });

    /* 物流：顶部展开与左侧三个分组共用同一份入口。 */
    var logisticsTab = Array.from(topMenu.querySelectorAll('.tm')).find(function (item) { return item.textContent.trim() === '物流'; });
    var logisticsMega = document.createElement('div');
    logisticsMega.id = 'logisticsMega';
    logisticsMega.className = 'warehouse-mega logistics-mega';
    logisticsMega.setAttribute('aria-label', '物流页面导航');
    LOGISTICS_MEGA.forEach(function (section) {
      var block = document.createElement('div');
      block.className = 'warehouse-mega-group';
      var category = document.createElement('a');
      category.textContent = section.group;
      category.href = logisticsRoute(section.rows[0][0]);
      category.className = 'mega-category';
      category.style.gridColumn = '1';
      category.style.gridRow = '1';
      block.appendChild(category);
      section.rows.forEach(function (row, rowIndex) {
        row.forEach(function (label, columnIndex) {
          var link = document.createElement('a');
          link.textContent = label;
          if (label === '物流揽收') link.innerHTML += '<span class="logistics-count">40</span>';
          link.href = logisticsRoute(label);
          link.style.gridColumn = String(columnIndex + 2);
          link.style.gridRow = String(rowIndex + 1);
          if (label === current && isLogisticsHost) link.classList.add('active');
          block.appendChild(link);
        });
      });
      logisticsMega.appendChild(block);
    });
    document.body.appendChild(logisticsMega);
    logisticsTab.setAttribute('role', 'button');
    logisticsTab.setAttribute('tabindex', '0');
    logisticsTab.setAttribute('aria-controls', 'logisticsMega');
    logisticsTab.setAttribute('aria-expanded', 'false');
    var logisticsPinned = false;
    var logisticsCloseTimer = null;
    function positionLogisticsMega() {
      var tabLeft = logisticsTab.getBoundingClientRect().left;
      var maxLeft = window.innerWidth - logisticsMega.getBoundingClientRect().width - 8;
      logisticsMega.style.left = Math.max(8, Math.min(tabLeft, maxLeft)) + 'px';
    }
    function openLogisticsMega() {
      clearTimeout(logisticsCloseTimer);
      megaPinned = reportPinned = productPinned = supplyPinned = settingsPinned = false;
      closeMega(true);
      closeReportMega(true);
      closeProductMega(true);
      closeSupplyMega(true);
      closeSettingsMega(true);
      logisticsMega.classList.add('open');
      positionLogisticsMega();
      logisticsTab.classList.add('mega-open');
      logisticsTab.setAttribute('aria-expanded', 'true');
    }
    function closeLogisticsMega(force) {
      if (logisticsPinned && !force) return;
      clearTimeout(logisticsCloseTimer);
      logisticsMega.classList.remove('open');
      logisticsTab.classList.remove('mega-open');
      logisticsTab.setAttribute('aria-expanded', 'false');
    }
    function scheduleLogisticsClose() {
      clearTimeout(logisticsCloseTimer);
      logisticsCloseTimer = setTimeout(function () { closeLogisticsMega(false); }, 180);
    }
    function toggleLogisticsMega() {
      if (logisticsPinned) { logisticsPinned = false; closeLogisticsMega(true); }
      else { logisticsPinned = true; openLogisticsMega(); }
    }
    logisticsTab.addEventListener('mouseenter', openLogisticsMega);
    logisticsTab.addEventListener('mouseleave', scheduleLogisticsClose);
    logisticsTab.addEventListener('click', function (event) { event.stopPropagation(); toggleLogisticsMega(); });
    logisticsTab.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleLogisticsMega(); }
    });
    logisticsMega.addEventListener('mouseenter', function () { clearTimeout(logisticsCloseTimer); });
    logisticsMega.addEventListener('mouseleave', scheduleLogisticsClose);
    window.addEventListener('resize', function () { if (logisticsMega.classList.contains('open')) positionLogisticsMega(); });
    document.addEventListener('pointerdown', function (event) {
      if (!logisticsMega.contains(event.target) && !logisticsTab.contains(event.target)) { logisticsPinned = false; closeLogisticsMega(true); }
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && logisticsMega.classList.contains('open')) { logisticsPinned = false; closeLogisticsMega(true); logisticsTab.focus(); }
    });

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
        /* 重按任何子菜单也重新载入其入口页。 */
        var label = el.dataset.label || el.textContent.trim();
        if (isProductHost) { location.href = freshPageUrl(productRoute(label)); return; }
        if (isSupplyHost) { location.href = freshPageUrl(supplyRoute(label)); return; }
        if (isLogisticsHost) { location.href = freshPageUrl(logisticsRoute(label)); return; }
        if (isReportHost) { location.href = freshPageUrl(reportRoute(label)); return; }
        if (isSettingsHost) { showSettingsPage(label, settingsRoute(label), el); return; }
        var link = el.dataset.page || PAGE_LINKS[label];
        if (link) {
          switchContent(link, label, aside, el);
          return;
        }
        switchContent(placeholderRoute(label), label, aside, el);
      });
    });

    if (isSettingsHost && location.hash.indexOf('#erp_page=') === 0) {
      var restoredLink = decodeURIComponent(location.hash.slice(10));
      var restoredLabel = SETTINGS_SIDE_MENUS[0].children.find(function (item) { return settingsRoute(item) === restoredLink; });
      if (restoredLabel) showSettingsPage(restoredLabel, restoredLink, null, true);
    }

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
