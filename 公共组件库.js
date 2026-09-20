(function (global) {
  'use strict';

  var doc = global.document;
  var activeFloatingPanel = null;

  function ensureStyles() {
    if (!doc || !doc.createElement || !doc.head || doc.getElementById('erp-common-component-styles')) return;
    var style = doc.createElement('style');
    style.id = 'erp-common-component-styles';
    style.textContent = '.erp-disabled-toggle{min-height:40px;display:flex;align-items:center;gap:8px;padding:0 12px;border-top:1px solid #eee;background:#fff;white-space:nowrap;color:#303133}.erp-disabled-toggle input{width:16px!important;height:16px!important;margin:0!important;accent-color:#3d68ff}.select-panel>.erp-disabled-toggle{margin:6px -6px -6px}.dropdown-panel>.erp-disabled-toggle{border-radius:0 0 4px 4px}.user-options>.erp-disabled-toggle,.person-menu>.erp-disabled-toggle{position:sticky;bottom:-5px;margin:5px -5px -5px;z-index:2}.warehouse-panel>.erp-disabled-toggle{margin:5px -5px -5px}' +
      '.erp-date-range{height:32px;display:flex;align-items:center;padding:0 9px;border:1px solid #dcdfe6;border-radius:5px;background:#fff;color:#bbb;cursor:pointer}.erp-date-range:hover{border-color:#3d68ff}.erp-date-range .date-value{color:#333}.erp-date-range .dash{margin:0 7px;color:#999}' +
      '.date-picker.hidden,.erp-date-picker.hidden{display:none!important}.erp-date-picker{position:absolute;left:0;top:35px;z-index:540;display:flex;width:410px;border:1px solid #e3e6ec;border-radius:5px;background:#fff;box-shadow:0 8px 24px #0002}.erp-date-picker .date-shortcuts{width:115px;padding:6px 0;border-right:1px solid #eee}.erp-date-picker .date-shortcuts button{display:block;width:100%;height:32px;padding:0 14px;border:0;background:#fff;text-align:left;cursor:pointer}.erp-date-picker .date-shortcuts button:hover{background:#f3f6ff;color:#3d68ff}.erp-date-picker .calendar{flex:1}.erp-date-picker .cal-head{height:42px;display:flex;align-items:center;justify-content:space-between;margin:0;padding:0 12px;border-bottom:1px solid #eee}.erp-date-picker .cal-nav{width:auto;height:auto;border:0;background:none;color:#999;cursor:pointer}.erp-date-picker .cal-title{font-weight:600}.erp-date-picker .cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:0;padding:7px 10px 10px}.erp-date-picker .cal-grid span,.erp-date-picker .cal-grid button{height:34px;display:flex;align-items:center;justify-content:center;border:0;background:#fff}.erp-date-picker .cal-grid .weekday{height:27px}.erp-date-picker .cal-day{cursor:pointer;border-radius:4px!important}.erp-date-picker .cal-day:hover{background:#edf2ff!important;color:#3d68ff}.erp-date-picker .cal-day.muted{color:#bbb}.erp-date-picker .cal-day.in-range{background:#f0f4ff}.erp-date-picker .cal-day.selected{border:1px solid #3d68ff!important;color:#3d68ff}';
    style.textContent += '.erp-batch-search-mask{position:fixed;inset:0;z-index:5000;display:none;align-items:center;justify-content:center;background:#0006}.erp-batch-search-mask.show{display:flex}.erp-batch-search-modal{width:520px;max-width:calc(100vw - 32px);border-radius:6px;background:#fff;box-shadow:0 15px 40px #0003;overflow:hidden;color:#303133}.erp-batch-search-head{height:51px;display:flex;align-items:center;padding:0 18px;border-bottom:1px solid #eee;font-size:15px;font-weight:600}.erp-batch-search-close{margin-left:auto;padding:0;border:0;background:none;color:#888;font-size:18px;cursor:pointer}.erp-batch-search-body{padding:20px 18px 36px}.erp-batch-search-types{display:flex;flex-wrap:wrap;gap:8px 18px;margin-bottom:28px}.erp-batch-search-types label{display:flex;align-items:center;gap:7px;white-space:nowrap;cursor:pointer}.erp-batch-search-types input{width:14px;height:14px;margin:0;accent-color:#3d68ff}.erp-batch-search-field label{display:block;margin-bottom:7px}.erp-batch-search-textarea{display:block;width:100%;height:88px;padding:9px;border:1px solid #dcdfe6;border-radius:5px;resize:vertical;outline:0;font:inherit;color:#303133}.erp-batch-search-textarea:focus{border-color:#3d68ff}.erp-batch-search-textarea::placeholder{color:#909399}.erp-batch-search-foot{height:57px;display:flex;align-items:center;justify-content:flex-end;gap:8px;padding:0 18px;border-top:1px solid #eee}.erp-batch-search-btn{height:32px;padding:0 16px;border:1px solid #dcdfe6;border-radius:5px;background:#fff;color:#303133;cursor:pointer}.erp-batch-search-btn.primary{border-color:#3d68ff;background:#3d68ff;color:#fff}';
    style.textContent += '.erp-column-trigger{flex:none;height:28px;min-width:44px;padding:0 8px;border:1px solid #dcdfe6;border-radius:4px;background:#fff;color:#606266;cursor:pointer}.erp-column-trigger:hover{border-color:#3d68ff;color:#3d68ff}.erp-column-mask{position:fixed;inset:0;z-index:4900;display:none;background:#0006}.erp-column-mask.show{display:block}.erp-column-drawer{position:absolute;top:0;right:0;bottom:0;width:240px;display:flex;flex-direction:column;background:#fff;box-shadow:-4px 0 20px #0002;color:#303133}.erp-column-head{height:56px;display:flex;align-items:center;padding:0 16px;border-bottom:1px solid #eee;font-size:16px;font-weight:600}.erp-column-close{margin-right:12px;padding:0;border:0;background:none;color:#909399;font-size:24px;cursor:pointer}.erp-column-list{flex:1;overflow:auto;padding:5px 4px}.erp-column-item{min-height:42px;display:flex;align-items:center;gap:7px;padding:6px 10px;border-bottom:1px solid #eee;background:#fff;transition:opacity .12s,box-shadow .12s}.erp-column-item.dragging{opacity:.45;box-shadow:0 3px 12px #0002}.erp-column-handle{flex:none;color:#909399;letter-spacing:-2px;cursor:grab;user-select:none}.erp-column-handle:active{cursor:grabbing}.erp-column-item label{display:flex;align-items:center;gap:7px;cursor:pointer}.erp-column-item input{width:16px;height:16px;margin:0;accent-color:#3d68ff}.erp-column-foot{height:48px;display:flex;align-items:center;padding:0 16px;border-top:1px solid #eee}.erp-column-reset{height:32px;padding:0 16px;border:1px solid #dcdfe6;border-radius:4px;background:#fff;color:#303133;cursor:pointer}.erp-column-reset:hover{border-color:#3d68ff;color:#3d68ff}';
    style.textContent += '.erp-oplog-mask{position:fixed;inset:0;z-index:5200;display:none;align-items:center;justify-content:center;padding:12px;background:#0006}.erp-oplog-mask.show{display:flex}.erp-oplog-dialog{width:min(1000px,calc(100vw - 24px));max-height:calc(100vh - 24px);overflow:auto;border-radius:8px;background:#fff;box-shadow:0 16px 46px #0004;color:#303133}.erp-oplog-head{height:56px;display:flex;align-items:center;padding:0 24px;font-size:16px;font-weight:600}.erp-oplog-close{margin-left:auto;border:0;background:none;color:#909399;font-size:25px;cursor:pointer}.erp-oplog-body{padding:0 24px 20px}.erp-oplog-filters{display:grid;grid-template-columns:220px 220px 290px 1fr;gap:24px;align-items:end;margin-bottom:22px}.erp-oplog-field{position:relative}.erp-oplog-field label{display:block;margin-bottom:8px;color:#303133;font-size:13px}.erp-oplog-select{height:32px;position:relative;border:1px solid #dcdfe6;border-radius:5px;background:#fff;cursor:pointer}.erp-oplog-select:focus-within{border-color:#3d68ff}.erp-oplog-select .floating-select{height:30px;min-height:30px;border:0;border-radius:5px}.erp-oplog-date-wrap{position:relative}.erp-oplog-date{height:32px;width:100%;padding:0 30px 0 10px;justify-content:flex-start;white-space:nowrap;overflow:hidden}.erp-oplog-date .dash{margin:0 13px}.erp-oplog-date-icon{position:absolute;right:10px;top:7px;color:#909399;font-style:normal;pointer-events:none}.erp-oplog-date-picker{z-index:5300!important}.erp-oplog-actions{display:flex;justify-content:flex-end;gap:10px;grid-column:1 / -1;margin-top:0}.erp-oplog-btn{height:32px;padding:0 17px;border:1px solid #dcdfe6;border-radius:5px;background:#fff;color:#303133;cursor:pointer}.erp-oplog-btn:hover{border-color:#3d68ff;color:#3d68ff}.erp-oplog-btn.primary{border-color:#3d68ff;background:#3d68ff;color:#fff}.erp-oplog-btn.primary:hover{color:#fff}.erp-oplog-table-wrap{overflow:auto;border:1px solid #bfc3c9}.erp-oplog-table{width:100%;min-width:760px;border-collapse:collapse;table-layout:fixed;font-size:14px}.erp-oplog-table th,.erp-oplog-table td{height:60px;padding:10px;border-right:1px solid #bfc3c9;border-bottom:1px solid #bfc3c9;text-align:left;vertical-align:middle;word-break:break-word}.erp-oplog-table th{height:39px;background:#e9e9e9;color:#1f2d3d;font-weight:600}.erp-oplog-table tr>:last-child{border-right:0}.erp-oplog-table tbody tr:last-child td{border-bottom:0}.erp-oplog-table .erp-oplog-index{width:40px;text-align:center}.erp-oplog-empty{text-align:center!important;color:#909399}.erp-oplog-pager{height:42px;display:flex;align-items:center;justify-content:flex-end;gap:8px;font-size:13px}.erp-oplog-page{height:26px;min-width:26px;padding:0 6px;border:1px solid transparent;border-radius:5px;background:#fff;cursor:pointer}.erp-oplog-page.active{border-color:#3d68ff;color:#3d68ff}.erp-oplog-page:disabled{color:#c0c4cc;cursor:not-allowed}.erp-oplog-size{height:28px;min-width:96px;border:1px solid #dcdfe6;border-radius:5px;background:#fff;padding:0 6px}@media(max-width:760px){.erp-oplog-body{padding:0 14px 14px}.erp-oplog-filters{grid-template-columns:1fr;gap:12px}.erp-oplog-actions{grid-column:auto}.erp-oplog-dialog{width:calc(100vw - 16px)}.erp-oplog-head{padding:0 14px}}' +
      '.erp-sticky-table thead th{position:sticky;top:var(--erp-sticky-header-top,0px);z-index:var(--erp-sticky-header-z-index,30);background:var(--erp-sticky-header-background,#e9e9e9)}';
    style.textContent += '.floating-select{position:relative;display:flex;align-items:center;flex-wrap:wrap;gap:3px;min-height:32px;padding:0 24px 0 8px;border:1px solid #dcdfe6;border-radius:5px;background:#fff;color:#303133;cursor:pointer}.floating-select:focus-within{border-color:#3d68ff}.floating-select .ph{padding:0 2px;color:#c0c4cc;font-size:13px}.floating-select .val{overflow:hidden;max-width:100%;text-overflow:ellipsis;white-space:nowrap}.floating-select .caret{position:absolute;top:50%;right:8px;transform:translateY(-50%);color:#999;pointer-events:none}.floating-select .clear{display:none;position:absolute;top:50%;right:25px;transform:translateY(-50%);color:#a0a4ad;font-size:12px}.floating-select .clear.has-v{display:block}.floating-select .tag{display:inline-flex;align-items:center;gap:3px;max-width:110px;height:22px;padding:0 5px;border:1px solid #c9d6ff;border-radius:3px;background:#f5f7ff;color:#3d68ff;font-size:13px}.floating-select .tag i{font-style:normal;cursor:pointer}.dropdown-panel{position:fixed;z-index:2000;min-width:140px;padding:6px;border:1px solid #e4e7ed;border-radius:5px;background:#fff;box-shadow:0 6px 16px #0002;color:#303133}.dropdown-panel .dp-search input{width:100%;height:30px;margin-bottom:5px;padding:0 8px;border:1px solid #dcdfe6;border-radius:4px}.dropdown-panel .dp-list{max-height:210px;overflow:auto}.dropdown-panel .dp-opt{display:flex;align-items:center;gap:6px;height:32px;padding:0 8px;overflow:hidden;border-radius:3px;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.dropdown-panel .dp-opt:hover,.dropdown-panel .dp-opt.sel{background:#f1f5ff;color:#3d68ff}.dropdown-panel .dp-opt .ck{width:16px;flex:none;color:#3d68ff}.dropdown-panel .dp-empty{padding:12px;text-align:center;color:#909399}.erp-tile-group{display:flex;align-items:center;gap:5px;flex-wrap:wrap}.erp-tile-group .tile{height:32px;padding:0 10px;border:1px solid #dcdfe6;border-radius:5px;background:#fff;font-size:13px}.erp-tile-group .tile:hover{border-color:#3d68ff;color:#3d68ff}.erp-tile-group .tile.active{border-color:#3d68ff;background:#3d68ff;color:#fff}';
    style.textContent += '.warehouse-filter{position:relative}.warehouse-filter-button{position:relative;padding:0 28px 0 9px;text-align:left;cursor:pointer}.warehouse-filter-button:after{position:absolute;right:10px;color:#999;content:"⌄"}.warehouse-filter-button.placeholder{color:#bbb}.warehouse-filter-panel{position:absolute;top:35px;right:0;left:0;z-index:90;min-width:180px;padding:5px;border:1px solid #e5e7eb;border-radius:5px;background:#fff;box-shadow:0 6px 18px #00000018}.warehouse-filter-panel>.erp-disabled-toggle{margin:5px -5px -5px}.warehouse-filter-search{width:100%;height:30px;margin-bottom:5px;padding:0 8px;border:1px solid #dcdfe6;border-radius:4px}.warehouse-filter-options{max-height:220px;overflow:auto}.warehouse-filter-options button{display:block;width:100%;height:30px;padding:0 8px;border:0;border-radius:3px;background:#fff;text-align:left;cursor:pointer}.warehouse-filter-options button:hover,.warehouse-filter-options button.active{background:#f3f6ff;color:#3d68ff}';
    doc.head.appendChild(style);
  }

  ensureStyles();

  function element(target, root) {
    if (!target) return null;
    if (typeof target !== 'string') return target;
    return (root || doc).querySelector(target);
  }

  function elements(target, root) {
    if (!target) return [];
    if (typeof target !== 'string') return Array.prototype.slice.call(target);
    return Array.prototype.slice.call((root || doc).querySelectorAll(target));
  }

  // Shared list behavior: createStickyTableHeader({ table, wrapper?, scrollContainer?, top? }).
  // Let the page scroll and keep its table header flush with the visible scrollport edge.
  function createStickyTableHeader(options) {
    options = options || {};
    var target = options.table || options.tables;
    var tables = typeof target === 'string' ? elements(target, options.root) : (target && target.nodeType ? [target] : elements(target));
    var zIndex = String(options.zIndex == null ? 30 : options.zIndex);
    var wrappers = [];
    function scrollContainerFor(table) {
      var explicit = element(options.scrollContainer);
      if (explicit) return explicit;
      var wrapper = element(options.wrapper) || table.parentElement;
      var current = table.parentElement;
      while (current && current !== doc.body) {
        if (current !== wrapper && /(auto|scroll)/.test(global.getComputedStyle(current).overflowY)) return current;
        current = current.parentElement;
      }
      return doc.scrollingElement || doc.documentElement;
    }
    function topFor(table) {
      if (options.top != null) return typeof options.top === 'number' ? options.top + 'px' : String(options.top);
      var scroller = scrollContainerFor(table);
      if (scroller === doc.scrollingElement || scroller === doc.documentElement || scroller === doc.body) {
        var nav = doc.querySelector('.topbar');
        return nav && global.getComputedStyle(nav).position === 'fixed' ? nav.getBoundingClientRect().height + 'px' : '0px';
      }
      var padding = parseFloat(global.getComputedStyle(scroller).paddingTop) || 0;
      return padding ? -padding + 'px' : '0px';
    }
    function apply() {
      tables.forEach(function (table) {
        if (!table || !table.classList) return;
        table.classList.add('erp-sticky-table');
        table.style.setProperty('--erp-sticky-header-top', topFor(table));
        table.style.setProperty('--erp-sticky-header-z-index', zIndex);
        if (options.background) table.style.setProperty('--erp-sticky-header-background', options.background);
        var wrapper = element(options.wrapper) || table.parentElement;
        if (wrapper && wrapper !== table && wrappers.every(function (saved) { return saved.el !== wrapper; })) {
          wrappers.push({ el: wrapper, overflow: wrapper.style.overflow, maxHeight: wrapper.style.maxHeight, minHeight: wrapper.style.minHeight });
          wrapper.style.overflow = 'visible';
          wrapper.style.maxHeight = 'none';
          wrapper.style.minHeight = '0';
        }
      });
    }
    function destroy() {
      global.removeEventListener('resize', apply);
      tables.forEach(function (table) {
        if (!table || !table.classList) return;
        table.classList.remove('erp-sticky-table');
        table.style.removeProperty('--erp-sticky-header-top');
        table.style.removeProperty('--erp-sticky-header-z-index');
        table.style.removeProperty('--erp-sticky-header-background');
      });
      wrappers.forEach(function (saved) { saved.el.style.overflow = saved.overflow; saved.el.style.maxHeight = saved.maxHeight; saved.el.style.minHeight = saved.minHeight; });
    }
    apply();
    global.addEventListener('resize', apply);
    return { apply: apply, refresh: apply, destroy: destroy };
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
    });
  }

  function disabledToggleHtml(fieldName, checked, label) {
    return '<label class="erp-disabled-toggle"><input type="checkbox" data-common-show-disabled ' + (checked ? 'checked' : '') + '> ' + escapeHtml(label || ('显示停用' + fieldName)) + '</label>';
  }

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function dateZero(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function dateAdd(date, amount) {
    var result = new Date(date);
    result.setDate(result.getDate() + amount);
    return result;
  }

  function dateText(date) {
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
  }

  function createDateRangePicker(options) {
    var trigger = element(options.trigger);
    var panel = element(options.panel);
    var shortcuts = element(options.shortcuts);
    var grid = element(options.grid);
    var title = element(options.title);
    var startText = element(options.startText);
    var endText = element(options.endText);
    trigger.classList.add('erp-date-range');
    panel.classList.add('erp-date-picker');
    var state = options.state || { view: new Date(), start: null, end: null };
    state.view = new Date(state.view.getFullYear(), state.view.getMonth(), 1);

    function sync() {
      if (state.start) {
        startText.textContent = dateText(state.start) + (options.startSuffix == null ? '　00:00' : options.startSuffix);
        startText.className = options.valueClass || 'date-value';
      } else {
        startText.textContent = options.startPlaceholder || '开始日期　　开始时间';
        startText.className = '';
      }
      if (state.end) {
        endText.textContent = dateText(state.end) + (options.endSuffix == null ? '　23:59' : options.endSuffix);
        endText.className = options.valueClass || 'date-value';
      } else {
        endText.textContent = options.endPlaceholder || '结束日期　　结束时间';
        endText.className = '';
      }
      if (options.startInput) element(options.startInput).value = state.start ? dateText(state.start) + ' 00:00:00' : '';
      if (options.endInput) element(options.endInput).value = state.end ? dateText(state.end) + ' 23:59:59' : '';
      if (options.onChange) options.onChange(api.getStart(), api.getEnd(), state);
    }

    function render() {
      var year = state.view.getFullYear();
      var month = state.view.getMonth();
      var first = new Date(year, month, 1);
      var offset = (first.getDay() + 6) % 7;
      var calendarStart = dateAdd(first, -offset);
      var html = ['一', '二', '三', '四', '五', '六', '日'].map(function (day) {
        return '<span class="weekday">' + day + '</span>';
      }).join('');
      for (var index = 0; index < 42; index += 1) {
        var date = dateAdd(calendarStart, index);
        var className = 'cal-day' + (date.getMonth() !== month ? ' muted' : '');
        if (state.start && dateZero(date).getTime() === dateZero(state.start).getTime()) className += ' selected';
        if (state.end && dateZero(date).getTime() === dateZero(state.end).getTime()) className += ' selected';
        if (state.start && state.end && date > state.start && date < state.end) className += ' in-range';
        html += '<button type="button" class="' + className + '" data-date="' + dateText(date) + '">' + date.getDate() + '</button>';
      }
      title.textContent = year + '年　' + (month + 1) + '月';
      grid.innerHTML = html;
    }

    function close() {
      panel.classList.add(options.hiddenClass || 'hidden');
    }

    function setRange(start, end, closeAfter) {
      state.start = start ? dateZero(start) : null;
      state.end = end ? dateZero(end) : null;
      var viewDate = state.end || state.start || new Date();
      state.view = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
      sync();
      render();
      if (closeAfter) close();
    }

    trigger.addEventListener('click', function (event) {
      event.stopPropagation();
      var hiddenClass = options.hiddenClass || 'hidden';
      var willOpen = panel.classList.contains(hiddenClass);
      if (options.closeOthers) options.closeOthers(willOpen ? panel : null);
      panel.classList.toggle(hiddenClass, !willOpen);
      if (willOpen) render();
    });
    panel.addEventListener('click', function (event) { event.stopPropagation(); });
    shortcuts.addEventListener('click', function (event) {
      var button = event.target.closest('button');
      if (!button) return;
      var today = dateZero(new Date());
      var start = today;
      var end = today;
      if (button.dataset.days != null) {
        start = dateAdd(today, -Number(button.dataset.days));
        end = start;
      } else if (button.dataset.range) {
        start = dateAdd(today, -Number(button.dataset.range) + 1);
      } else {
        start = dateAdd(today, -90);
        end = dateAdd(today, -1);
      }
      setRange(start, end, true);
    });
    grid.addEventListener('click', function (event) {
      var button = event.target.closest('[data-date]');
      if (!button) return;
      var parts = button.dataset.date.split('-');
      var selected = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      if (!state.start || state.end) {
        state.start = selected;
        state.end = null;
      } else if (selected < state.start) {
        state.end = state.start;
        state.start = selected;
      } else {
        state.end = selected;
      }
      state.view = new Date(selected.getFullYear(), selected.getMonth(), 1);
      sync();
      render();
      if (state.end) close();
    });

    function move(months, years) {
      if (months) state.view.setMonth(state.view.getMonth() + months);
      if (years) state.view.setFullYear(state.view.getFullYear() + years);
      render();
    }

    element(options.prevMonth).addEventListener('click', function () { move(-1, 0); });
    element(options.nextMonth).addEventListener('click', function () { move(1, 0); });
    element(options.prevYear).addEventListener('click', function () { move(0, -1); });
    element(options.nextYear).addEventListener('click', function () { move(0, 1); });

    var api = {
      getStart: function () {
        return state.start ? new Date(state.start.getFullYear(), state.start.getMonth(), state.start.getDate(), 0, 0, 0).getTime() : null;
      },
      getEnd: function () {
        return state.end ? new Date(state.end.getFullYear(), state.end.getMonth(), state.end.getDate(), 23, 59, 59).getTime() : null;
      },
      getState: function () { return state; },
      setRange: function (start, end) { setRange(start, end, false); },
      reset: function () {
        state.start = null;
        state.end = null;
        sync();
        close();
      },
      render: render,
      close: close
    };
    sync();
    return api;
  }

  function createSearchDropdown(options) {
    var root = element(options.root || options.control);
    var button = element(options.button, root) || root;
    var panel = element(options.panel, root);
    var search = element(options.search, root);
    var list = element(options.list, root);
    if (options.variant === 'warehouse') {
      root.classList.add('warehouse-filter');
      button.classList.add('warehouse-filter-button');
      panel.classList.add('warehouse-filter-panel');
      list.classList.add('warehouse-filter-options');
      if (search) search.classList.add('warehouse-filter-search');
    }
    var value = options.value == null ? '' : String(options.value);
    var showDisabled = Boolean(options.showDisabled);
    var disabledToggle = null;
    if (options.fieldName || options.disabledLabel) {
      disabledToggle = doc.createElement('label');
      disabledToggle.className = 'erp-disabled-toggle';
      panel.appendChild(disabledToggle);
    }

    function getItems() {
      return typeof options.items === 'function' ? options.items(search ? search.value : '') : (options.items || []);
    }

    function label(item) {
      return options.getLabel ? options.getLabel(item) : String(item.label == null ? item : item.label);
    }

    function itemValue(item) {
      return String(options.getValue ? options.getValue(item) : (item.value == null ? item : item.value));
    }

    function render() {
      var allItems = getItems();
      var items = allItems.filter(function (item) { return showDisabled || (options.getEnabled ? options.getEnabled(item) : item.enabled !== false); });
      if (search && options.items && typeof options.items !== 'function') {
        var keyword = search.value.trim().toLowerCase();
        items = items.filter(function (item) { return !keyword || label(item).toLowerCase().indexOf(keyword) >= 0; });
      }
      list.innerHTML = (options.allLabel == null ? '' : '<button type="button" data-common-value="" role="option">' + escapeHtml(options.allLabel) + '</button>') + items.map(function (item) {
        var itemLabel = label(item);
        var currentValue = itemValue(item);
        return '<button type="button" data-common-value="' + escapeHtml(currentValue) + '" role="option" aria-selected="' + (currentValue === value) + '" class="' + (options.itemClass || '') + ' ' + (currentValue === value ? 'active' : '') + '">' + escapeHtml(itemLabel) + '</button>';
      }).join('') + (!items.length && options.emptyLabel ? '<div class="select-empty">' + escapeHtml(options.emptyLabel) + '</div>' : '');
      var selected = getItems().find(function (item) { return itemValue(item) === value; });
      button.textContent = selected ? label(selected) : (value && options.valueLabel ? options.valueLabel(value) : (options.placeholder || '请选择'));
      button.classList.toggle(options.placeholderClass || 'placeholder', !value);
      root.dataset.value = value;
      if (disabledToggle) disabledToggle.innerHTML = '<input type="checkbox" data-common-show-disabled ' + (showDisabled ? 'checked' : '') + '> ' + escapeHtml(options.disabledLabel || ('显示停用' + options.fieldName));
    }

    function close() {
      panel.classList.add(options.hiddenClass || 'hidden');
      button.setAttribute('aria-expanded', 'false');
    }

    function open() {
      if (options.closeOthers) options.closeOthers(panel);
      panel.classList.remove(options.hiddenClass || 'hidden');
      button.setAttribute('aria-expanded', 'true');
      if (search) {
        if (options.clearSearchOnOpen !== false) search.value = '';
        render();
        search.focus();
      }
    }

    function closeOnOutsideClick(event) {
      if (options.variant === 'warehouse' && !root.contains(event.target)) close();
    }

    button.addEventListener('click', function (event) {
      event.stopPropagation();
      if (panel.classList.contains(options.hiddenClass || 'hidden')) open(); else close();
    });
    panel.addEventListener('click', function (event) {
      event.stopPropagation();
      var target = event.target.closest('[data-common-value]');
      if (!target) return;
      value = target.dataset.commonValue;
      render();
      close();
      if (options.onChange) options.onChange(value);
    });
    panel.addEventListener('change', function (event) {
      if (!event.target.matches('[data-common-show-disabled]')) return;
      showDisabled = event.target.checked;
      render();
      if (options.onDisabledChange) options.onDisabledChange(showDisabled);
    });
    if (search) search.addEventListener('input', render);
    if (options.variant === 'warehouse') doc.addEventListener('click', closeOnOutsideClick);
    render();

    return {
      getValue: function () { return value; },
      set: function (nextValue, silent) {
        value = nextValue == null ? '' : String(nextValue);
        render();
        if (!silent && options.onChange) options.onChange(value);
      },
      render: render,
      open: open,
      close: close,
      destroy: function () {
        if (options.variant === 'warehouse') doc.removeEventListener('click', closeOnOutsideClick);
      }
    };
  }

  function createWarehouseDropdown(options) {
    options = Object.assign({}, options || {}, { variant: 'warehouse' });
    if (!options.fieldName) options.fieldName = '仓库';
    return createSearchDropdown(options);
  }

  function createFloatingSelect(options) {
    var root = options.el;
    var value = options.multiple ? [] : '';
    var panel = null;
    var showDisabled = Boolean(options.showDisabled);

    function closePanels() {
      if (panel && panel.parentNode) panel.remove();
      if (activeFloatingPanel && activeFloatingPanel.parentNode) activeFloatingPanel.remove();
      panel = null;
      activeFloatingPanel = null;
      setActivePanel(null);
      if (options.closePanels) options.closePanels();
    }
    function getActivePanel() { return options.getActivePanel ? options.getActivePanel() : null; }
    function setActivePanel(nextPanel) { if (options.setActivePanel) options.setActivePanel(nextPanel); }
    function visibleOptions(keyword) {
      var items = (options.options || []).filter(function (item) { return showDisabled || item.enabled !== false; });
      if (!keyword) return items;
      keyword = keyword.toLowerCase();
      return items.filter(function (item) { return String(item.label).toLowerCase().indexOf(keyword) >= 0; });
    }
    function render() {
      if (options.multiple) {
        var values = value;
        var inner = '';
        if (!values.length) inner = '<span class="ph">' + escapeHtml(options.placeholder || '请选择') + '</span>';
        else {
          inner = values.slice(0, 2).map(function (current) { return '<span class="tag" data-v="' + escapeHtml(current) + '">' + escapeHtml(current) + '<i data-del="' + escapeHtml(current) + '">✕</i></span>'; }).join('') + (values.length > 2 ? '<span class="tag more">+' + (values.length - 2) + '</span>' : '');
        }
        root.innerHTML = inner + '<span class="caret"><svg width="9" height="9" viewBox="0 0 10 10"><path d="M1.5 3.5 5 7l3.5-3.5" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg></span>';
        elements('.tag i', root).forEach(function (icon) { icon.addEventListener('click', function (event) { event.stopPropagation(); remove(icon.dataset.del); }); });
      } else {
        root.innerHTML = (value ? '<span class="val">' + escapeHtml(value) + '</span>' : '<span class="ph">' + escapeHtml(options.placeholder || '请选择') + '</span>') + '<span class="clear ' + (value ? 'has-v' : '') + '" data-clear>✕</span><span class="caret"><svg width="9" height="9" viewBox="0 0 10 10"><path d="M1.5 3.5 5 7l3.5-3.5" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg></span>';
        var clear = root.querySelector('[data-clear]');
        if (clear) clear.addEventListener('mousedown', function (event) { event.stopPropagation(); setValue('', true); });
      }
    }
    function remove(current) {
      value = value.filter(function (item) { return item !== current; });
      render();
      renderList(panel && panel.querySelector('input') ? panel.querySelector('input').value : '');
      if (options.onChange) options.onChange(value);
    }
    function renderList(keyword) {
      if (!panel) return;
      var list = panel.querySelector('.dp-list');
      var items = visibleOptions(keyword);
      list.innerHTML = items.length ? items.map(function (item) {
        var selected = options.multiple ? value.indexOf(item.value) >= 0 : String(value) === String(item.value);
        return '<div class="dp-opt' + (selected ? ' sel' : '') + '" data-v="' + escapeHtml(item.value) + '">' + (options.multiple ? '<span class="ck">' + (selected ? '✓' : '') + '</span>' : '') + escapeHtml(item.label) + '</div>';
      }).join('') : '<div class="dp-empty">无匹配数据</div>';
      elements('.dp-opt', list).forEach(function (itemElement) {
        itemElement.addEventListener('click', function () {
          var nextValue = itemElement.dataset.v;
          if (options.multiple) {
            if (value.indexOf(nextValue) >= 0) value = value.filter(function (item) { return item !== nextValue; }); else value.push(nextValue);
            render(); renderList(keyword); if (options.onChange) options.onChange(value);
          } else {
            setValue(nextValue, true); closePanels();
          }
        });
      });
    }
    function open() {
      if (panel && (getActivePanel() === panel || activeFloatingPanel === panel)) { closePanels(); return; }
      closePanels();
      panel = doc.createElement('div');
      panel.className = 'dropdown-panel';
      var minimumWidth = Math.max(root.offsetWidth, 120);
      panel.style.minWidth = minimumWidth + 'px';
      panel.innerHTML = (options.searchable ? '<div class="dp-search"><input placeholder="搜索"></div>' : '') + '<div class="dp-list"></div>' + ((options.fieldName || options.disabledLabel) ? '<label class="erp-disabled-toggle"><input type="checkbox" data-common-show-disabled ' + (showDisabled ? 'checked' : '') + '> ' + escapeHtml(options.disabledLabel || ('显示停用' + options.fieldName)) + '</label>' : '');
      doc.body.appendChild(panel);
      activeFloatingPanel = panel;
      if (options.panelZIndex) panel.style.zIndex = String(options.panelZIndex);
      setActivePanel(panel);
      var rect = root.getBoundingClientRect();
      var height = panel.offsetHeight || 200;
      var top = rect.bottom + 4;
      if (top + Math.min(height, 300) > global.innerHeight - 8) top = Math.max(8, rect.top - height - 8);
      panel.style.left = Math.min(rect.left, global.innerWidth - minimumWidth - 8) + 'px';
      panel.style.top = top + 'px';
      renderList('');
      var search = panel.querySelector('.dp-search input');
      if (search) {
        search.addEventListener('input', function () { renderList(search.value); });
        search.addEventListener('mousedown', function (event) { event.stopPropagation(); });
        global.setTimeout(function () { search.focus(); }, 30);
      }
      var toggle = panel.querySelector('[data-common-show-disabled]');
      if (toggle) toggle.addEventListener('change', function () { showDisabled = toggle.checked; renderList(search ? search.value : ''); });
    }
    function setValue(nextValue, fire) {
      value = nextValue;
      render();
      if (fire && options.onChange) options.onChange(value);
    }
    function onOutsideClick(event) {
      if (!activeFloatingPanel || root.contains(event.target) || activeFloatingPanel.contains(event.target)) return;
      closePanels();
    }
    function onRootClick(event) { event.stopPropagation(); if (!event.target.closest('[data-clear]')) open(); }
    root.addEventListener('click', onRootClick);
    doc.addEventListener('click', onOutsideClick);
    render();
    root.setValue = setValue;
    root.getValue = function () { return value; };
    return { setValue: setValue, getValue: function () { return value; }, close: closePanels, destroy: function () { closePanels(); doc.removeEventListener('click', onOutsideClick); root.removeEventListener('click', onRootClick); } };
  }

  function createTileGroup(options) {
    options = options || {};
    var root = element(options.root || options.el);
    if (!root) throw new Error('createTileGroup requires root');
    root.classList.add(options.rootClass || 'erp-tile-group');
    var values = options.options || options.items || [];
    var value = options.value == null ? '' : String(options.value);
    function render() {
      root.innerHTML = values.map(function (item) {
        var itemValue = String(item.value == null ? item : item.value);
        var itemLabel = item.label == null ? itemValue : String(item.label);
        return '<button type="button" class="' + escapeHtml(options.buttonClass || 'tile') + (itemValue === value ? ' active' : '') + '" data-common-tile-value="' + escapeHtml(itemValue) + '">' + escapeHtml(itemLabel) + '</button>';
      }).join('');
    }
    function onClick(event) {
      var button = event.target.closest('[data-common-tile-value]');
      if (!button || !root.contains(button)) return;
      event.stopPropagation();
      var next = button.dataset.commonTileValue;
      if (next === value) return;
      var previous = value;
      value = next;
      render();
      if (!options.onChange) return;
      options.onChange(value, previous);
    }
    root.addEventListener('click', onClick);
    render();
    return {
      render: render,
      getValue: function () { return value; },
      setValue: function (next, silent) {
        value = next == null ? '' : String(next);
        render();
        if (!silent && options.onChange) options.onChange(value);
      },
      destroy: function () { root.removeEventListener('click', onClick); root.innerHTML = ''; }
    };
  }

  function createStaticDropdown(options) {
    var control = element(options.control);
    var display = element(options.display, control) || control.querySelector('span');
    var panel = doc.createElement('div');
    var value = options.value || '';
    panel.className = (options.panelClass || 'history-select-panel') + ' ' + (options.hiddenClass || 'hidden');
    control.appendChild(panel);

    function render() {
      panel.innerHTML = (options.items || []).map(function (item) {
        var itemValue = typeof item === 'object' ? item.value : item;
        var itemLabel = typeof item === 'object' ? item.label : item;
        return '<button type="button" data-common-value="' + escapeHtml(itemValue) + '" class="' + (String(itemValue) === String(value) ? 'active' : '') + '">' + escapeHtml(itemLabel) + '</button>';
      }).join('');
      control.dataset.value = value;
      display.textContent = value || options.placeholder || '请选择';
      display.classList.toggle(options.placeholderClass || 'placeholder', !value);
    }

    control.addEventListener('click', function (event) {
      event.stopPropagation();
      if (options.closeOthers) options.closeOthers(panel);
      panel.classList.toggle(options.hiddenClass || 'hidden');
    });
    panel.addEventListener('click', function (event) {
      event.stopPropagation();
      var button = event.target.closest('[data-common-value]');
      if (!button) return;
      value = button.dataset.commonValue;
      render();
      panel.classList.add(options.hiddenClass || 'hidden');
      if (options.onChange) options.onChange(value);
    });
    render();
    return {
      getValue: function () { return value; },
      set: function (nextValue, silent) {
        value = nextValue || '';
        render();
        if (!silent && options.onChange) options.onChange(value);
      },
      close: function () { panel.classList.add(options.hiddenClass || 'hidden'); },
      render: render
    };
  }

  function pageItems(page, count, variant) {
    page = Math.max(1, Math.min(page, count));
    if (variant === 'category') {
      var category = [];
      var categoryIndex;
      if (count <= 7) for (categoryIndex = 1; categoryIndex <= count; categoryIndex += 1) category.push({ type: 'page', page: categoryIndex, active: categoryIndex === page });
      else {
        var categoryValues = page <= 4 ? [1, 2, 3, 4, 5, 'ellipsis', count] : page >= count - 3 ? [1, 'ellipsis', count - 4, count - 3, count - 2, count - 1, count] : [1, 'ellipsis', page - 1, page, page + 1, 'ellipsis', count];
        category = categoryValues.map(function (value) { return value === 'ellipsis' ? { type: 'ellipsis' } : { type: 'page', page: value, active: value === page }; });
      }
      return category;
    }
    if (variant === 'neighbor') {
      var neighborValues = [];
      if (count <= 7) for (var neighborIndex = 1; neighborIndex <= count; neighborIndex += 1) neighborValues.push(neighborIndex);
      else {
        neighborValues.push(1);
        if (page > 3) neighborValues.push('ellipsis');
        for (var current = Math.max(2, page - 1); current <= Math.min(count - 1, page + 1); current += 1) neighborValues.push(current);
        if (page < count - 2) neighborValues.push('ellipsis');
        neighborValues.push(count);
      }
      return neighborValues.map(function (value) { return value === 'ellipsis' ? { type: 'ellipsis' } : { type: 'page', page: value, active: value === page }; });
    }
    var numbers = [1, count];
    var number;
    for (number = Math.max(1, page - 2); number <= Math.min(count, page + 2); number += 1) numbers.push(number);
    if (page < 4) for (number = 1; number <= Math.min(5, count); number += 1) numbers.push(number);
    numbers = Array.from(new Set(numbers)).sort(function (a, b) { return a - b; });
    var output = [];
    var last = 0;
    numbers.forEach(function (current) {
      if (last && current - last > 1) output.push({ type: 'ellipsis' });
      output.push({ type: 'page', page: current, active: current === page });
      last = current;
    });
    return output;
  }

  function createPagination(options) {
    var numbers = element(options.numbers);
    var previous = element(options.previous);
    var next = element(options.next);
    var jump = element(options.jump);

    function render(state) {
      var count = Math.max(1, Number(state.pageCount));
      var page = Math.max(1, Math.min(Number(state.page), count));
      numbers.innerHTML = pageItems(page, count).map(function (item) {
        if (item.type === 'ellipsis') return '<span aria-hidden="true">…</span>';
        return '<button type="button" class="' + (options.buttonClass || 'page-btn') + ' ' + (item.active ? (options.activeClass || 'active') : '') + '" data-common-page="' + item.page + '" aria-label="第' + item.page + '页" ' + (item.active ? 'aria-current="page"' : '') + '>' + item.page + '</button>';
      }).join('');
      previous.disabled = page <= 1;
      next.disabled = page >= count;
      if (jump) {
        jump.max = count;
        jump.value = '';
      }
    }

    numbers.addEventListener('click', function (event) {
      var button = event.target.closest('[data-common-page]');
      if (button && options.onChange) options.onChange(Number(button.dataset.commonPage));
    });
    previous.addEventListener('click', function () { if (options.onPrevious) options.onPrevious(); });
    next.addEventListener('click', function () { if (options.onNext) options.onNext(); });
    if (jump) jump.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' && options.onChange) options.onChange(Number(jump.value));
    });
    return { render: render, items: pageItems };
  }

  function parseBatch(text) {
    return Array.from(new Set(String(text || '').split(/[\s,，;；]+/).map(function (value) { return value.trim(); }).filter(Boolean)));
  }

  function createBatchInput(options) {
    var source = element(options.source);
    var textarea = element(options.textarea);
    var count = element(options.count);
    var confirm = element(options.confirm);

    function values() { return (options.parse || parseBatch)(textarea.value); }
    function updateCount() {
      if (count) count.textContent = (options.countPrefix || '共 ') + values().length + (options.countSuffix || ' 个SKU');
    }
    function open() {
      textarea.value = options.getInitialValue ? options.getInitialValue() : source.value;
      updateCount();
      options.open();
      textarea.focus();
    }
    source.addEventListener('dblclick', open);
    textarea.addEventListener('input', updateCount);
    confirm.addEventListener('click', function () { if (options.onConfirm) options.onConfirm(values()); });
    return { open: open, values: values, updateCount: updateCount, parse: options.parse || parseBatch };
  }

  var batchSearchSeed = 0;
  function createBatchSearch(options) {
    var source = element(options.source);
    var fields = (options.fields || []).map(function (field) {
      return typeof field === 'string' ? { value: field, label: field } : field;
    });
    if (!source || !fields.length) throw new Error('createBatchSearch requires source and fields');
    var name = 'erp-batch-search-' + (++batchSearchSeed);
    var root = doc.createElement('div');
    root.className = 'erp-batch-search-mask';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.innerHTML = '<div class="erp-batch-search-modal"><div class="erp-batch-search-head"><span>' + escapeHtml(options.title || '批量搜索') + '</span><button type="button" class="erp-batch-search-close" data-batch-close aria-label="关闭">×</button></div><div class="erp-batch-search-body"><div class="erp-batch-search-types">' + fields.map(function (field, index) {
      return '<label><input type="radio" name="' + name + '" value="' + escapeHtml(field.value) + '" ' + (index === 0 ? 'checked' : '') + '>' + escapeHtml(field.label) + '</label>';
    }).join('') + '</div><div class="erp-batch-search-field"><label data-batch-label></label><textarea class="erp-batch-search-textarea" data-batch-textarea></textarea></div></div><div class="erp-batch-search-foot"><button type="button" class="erp-batch-search-btn" data-batch-close>取消</button><button type="button" class="erp-batch-search-btn primary" data-batch-confirm>确定</button></div></div>';
    doc.body.appendChild(root);
    var textarea = root.querySelector('[data-batch-textarea]');
    var label = root.querySelector('[data-batch-label]');
    var selectedField = fields[0];

    function findField(value) {
      return fields.find(function (field) { return String(field.value) === String(value); }) || fields[0];
    }
    function syncField(value) {
      selectedField = findField(value);
      Array.prototype.forEach.call(root.querySelectorAll('input[name="' + name + '"]'), function (radio) {
        radio.checked = String(radio.value) === String(selectedField.value);
      });
      label.textContent = selectedField.queryLabel || (selectedField.label + '查询');
      textarea.placeholder = selectedField.placeholder || ('每行一个' + selectedField.label + '（支持Excel复制粘贴）');
      if (options.onFieldChange) options.onFieldChange(selectedField.value, selectedField);
    }
    function values() { return (options.parse || parseBatch)(textarea.value); }
    function open() {
      syncField(options.getInitialField ? options.getInitialField() : selectedField.value);
      textarea.value = options.getInitialValue ? options.getInitialValue(selectedField.value) : '';
      root.classList.add('show');
      textarea.focus();
      if (options.onOpen) options.onOpen(api);
    }
    function close() { root.classList.remove('show'); source.focus(); }
    root.addEventListener('change', function (event) {
      if (event.target.name === name) syncField(event.target.value);
    });
    root.addEventListener('click', function (event) {
      if (event.target === root || event.target.closest('[data-batch-close]')) { close(); return; }
      if (!event.target.closest('[data-batch-confirm]')) return;
      var result = options.onConfirm ? options.onConfirm(values(), selectedField.value, api) : undefined;
      if (result !== false) close();
    });
    source.addEventListener('dblclick', open);
    var api = { open: open, close: close, values: values, setField: syncField, root: root, textarea: textarea };
    return api;
  }

  /*
   * 操作日志弹窗：页面只需传入各自的业务操作属性、人员和日志记录。
   * 操作属性是固定枚举，不显示停用项；操作员复用人员数据并显示“停用人员”。
   */
  function createOperationLog(options) {
    options = options || {};
    var trigger = element(options.trigger);
    var sourceRecords = Array.isArray(options.records) ? options.records.slice() : [];
    var page = 1;
    var pageSize = Number(options.pageSize) || 100;
    var pageSizes = options.pageSizes || [10, 20, 30, 50, 100, 200, 500];
    var filteredRecords = [];
    var activePanel = null;
    function normalizedItems(items, preferLabel) {
      return (items || []).map(function (item) {
        if (typeof item === 'string') return { value: item, label: item, enabled: true };
        var label = item.label == null ? (item.name == null ? (item.userName == null ? (item.text == null ? item.value : item.text) : item.userName) : item.name) : item.label;
        return {
          value: String(preferLabel || item.value == null ? label : item.value),
          label: String(label == null ? '' : label),
          enabled: item.enabled !== false && item.disabled !== true
        };
      });
    }

    function closePanels() {
      if (activePanel && activePanel.parentNode) activePanel.parentNode.removeChild(activePanel);
      activePanel = null;
    }

    function itemTime(record) {
      var value = record.time == null ? (record.operationTime == null ? (record.createdAt == null ? record.created : record.createdAt) : record.operationTime) : record.time;
      if (value instanceof Date) return value.getTime();
      var result = new Date(String(value || '').replace(/-/g, '/')).getTime();
      return isNaN(result) ? null : result;
    }

    function recordValue(record, names) {
      for (var index = 0; index < names.length; index += 1) {
        if (record[names[index]] != null) return String(record[names[index]]);
      }
      return '';
    }

    var root = doc.createElement('div');
    root.className = 'erp-oplog-mask';
    root.innerHTML = '<section class="erp-oplog-dialog" role="dialog" aria-modal="true" aria-label="' + escapeHtml(options.title || '操作日志') + '">' +
      '<div class="erp-oplog-head"><span>' + escapeHtml(options.title || '操作日志') + '</span><button type="button" class="erp-oplog-close" data-oplog-close aria-label="关闭">×</button></div>' +
      '<div class="erp-oplog-body"><div class="erp-oplog-filters">' +
      '<div class="erp-oplog-field"><label>操作属性</label><div class="erp-oplog-select"><div class="floating-select" data-oplog-attribute></div></div></div>' +
      '<div class="erp-oplog-field"><label>操作员</label><div class="erp-oplog-select"><div class="floating-select" data-oplog-operator></div></div></div>' +
      '<div class="erp-oplog-field erp-oplog-date-wrap"><label>操作时间</label><div class="erp-oplog-date" data-oplog-date><span data-oplog-start></span><span class="dash">—</span><span data-oplog-end></span><i class="erp-oplog-date-icon">▣</i></div>' +
      '<div class="erp-oplog-date-picker hidden" data-oplog-date-panel><div class="date-shortcuts" data-oplog-shortcuts><button type="button" data-range="0">今天</button><button type="button" data-range="6">近7天</button><button type="button" data-range="29">近30天</button><button type="button" data-range="89">近90天</button></div><div class="calendar"><div class="cal-head"><button type="button" class="cal-nav" data-oplog-prev-year>«</button><button type="button" class="cal-nav" data-oplog-prev-month>‹</button><span class="cal-title" data-oplog-cal-title></span><button type="button" class="cal-nav" data-oplog-next-month>›</button><button type="button" class="cal-nav" data-oplog-next-year>»</button></div><div class="cal-grid" data-oplog-cal-grid></div></div></div></div>' +
      '<div class="erp-oplog-actions"><button type="button" class="erp-oplog-btn" data-oplog-reset>重置</button><button type="button" class="erp-oplog-btn primary" data-oplog-query>搜索</button></div>' +
      '</div><div class="erp-oplog-table-wrap"><table class="erp-oplog-table"><colgroup><col style="width:40px"><col style="width:120px"><col><col style="width:120px"><col style="width:180px"></colgroup><thead><tr><th class="erp-oplog-index"></th><th>操作属性</th><th>操作描述</th><th>操作人</th><th>操作时间</th></tr></thead><tbody data-oplog-body></tbody></table></div>' +
      '<div class="erp-oplog-pager"><span data-oplog-total></span><button type="button" class="erp-oplog-page" data-oplog-prev>‹</button><span data-oplog-pages></span><button type="button" class="erp-oplog-page" data-oplog-next>›</button><select class="erp-oplog-size" data-oplog-size></select></div>' +
      '</div></section>';
    doc.body.appendChild(root);

    var attributeRoot = root.querySelector('[data-oplog-attribute]');
    var operatorRoot = root.querySelector('[data-oplog-operator]');
    var body = root.querySelector('[data-oplog-body]');
    var total = root.querySelector('[data-oplog-total]');
    var pages = root.querySelector('[data-oplog-pages]');
    var prev = root.querySelector('[data-oplog-prev]');
    var next = root.querySelector('[data-oplog-next]');
    var sizeSelect = root.querySelector('[data-oplog-size]');
    var datePanel = root.querySelector('[data-oplog-date-panel]');

    var attributeItems = normalizedItems(options.operationAttributes || options.attributes);
    var operatorItems = normalizedItems(options.operators || options.people, true);
    var attributeSelect = createFloatingSelect({
      el: attributeRoot, options: attributeItems, searchable: true, placeholder: '请选择',
      closePanels: closePanels, getActivePanel: function () { return activePanel; }, setActivePanel: function (panel) { activePanel = panel; }, panelZIndex: 5400
    });
    var operatorSelect = createFloatingSelect({
      el: operatorRoot, options: operatorItems, searchable: true, placeholder: '请选择', fieldName: '人员', disabledLabel: '显示停用人员',
      closePanels: closePanels, getActivePanel: function () { return activePanel; }, setActivePanel: function (panel) { activePanel = panel; }, panelZIndex: 5400
    });
    var datePicker = createDateRangePicker({
      trigger: root.querySelector('[data-oplog-date]'), panel: datePanel, shortcuts: root.querySelector('[data-oplog-shortcuts]'), grid: root.querySelector('[data-oplog-cal-grid]'), title: root.querySelector('[data-oplog-cal-title]'),
      startText: root.querySelector('[data-oplog-start]'), endText: root.querySelector('[data-oplog-end]'), prevMonth: root.querySelector('[data-oplog-prev-month]'), nextMonth: root.querySelector('[data-oplog-next-month]'), prevYear: root.querySelector('[data-oplog-prev-year]'), nextYear: root.querySelector('[data-oplog-next-year]'),
      state: { view: new Date(), start: null, end: null }, startPlaceholder: '开始日期', endPlaceholder: '结束日期', startSuffix: '', endSuffix: '', closeOthers: function () { closePanels(); }
    });

    sizeSelect.innerHTML = pageSizes.map(function (size) { return '<option value="' + Number(size) + '"' + (Number(size) === pageSize ? ' selected' : '') + '>' + Number(size) + '条/页</option>'; }).join('');

    function filters() {
      return { attribute: attributeSelect.getValue(), operator: operatorSelect.getValue(), start: datePicker.getStart(), end: datePicker.getEnd() };
    }

    function filterRecords(records) {
      var current = filters();
      function matches(value, selected, items) {
        if (!selected) return true;
        var selectedItem = items.find(function (item) { return String(item.value) === String(selected); });
        return value === String(selected) || Boolean(selectedItem && value === selectedItem.label);
      }
      return (records || []).filter(function (record) {
        var attribute = recordValue(record, ['attribute', 'action', 'property', 'operationAttribute']);
        var operator = recordValue(record, ['operator', 'user', 'creator', 'operatorName']);
        var time = itemTime(record);
        return matches(attribute, current.attribute, attributeItems) && matches(operator, current.operator, operatorItems) &&
          (!current.start || (time != null && time >= current.start)) && (!current.end || (time != null && time <= current.end));
      });
    }

    function renderPager() {
      var count = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
      if (page > count) page = count;
      total.textContent = '共 ' + filteredRecords.length + ' 条';
      prev.disabled = page <= 1;
      next.disabled = page >= count;
      var start = Math.max(1, Math.min(page - 2, count - 4));
      var end = Math.min(count, start + 4);
      var html = '';
      for (var current = start; current <= end; current += 1) html += '<button type="button" class="erp-oplog-page' + (current === page ? ' active' : '') + '" data-oplog-page="' + current + '">' + current + '</button>';
      pages.innerHTML = html;
    }

    function render() {
      var from = (page - 1) * pageSize;
      var rows = filteredRecords.slice(from, from + pageSize);
      body.innerHTML = rows.length ? rows.map(function (record, index) {
        return '<tr><td class="erp-oplog-index">' + (from + index + 1) + '</td><td>' + escapeHtml(recordValue(record, ['attribute', 'action', 'property', 'operationAttribute'])) + '</td><td>' + escapeHtml(recordValue(record, ['description', 'desc', 'detail', 'operationDescription'])) + '</td><td>' + escapeHtml(recordValue(record, ['operator', 'user', 'creator', 'operatorName'])) + '</td><td>' + escapeHtml(recordValue(record, ['time', 'operationTime', 'createdAt', 'created'])) + '</td></tr>';
      }).join('') : '<tr><td class="erp-oplog-empty" colspan="5">暂无数据</td></tr>';
      renderPager();
    }

    function query(resetPage) {
      if (resetPage !== false) page = 1;
      var rows = typeof options.getRecords === 'function' ? options.getRecords(filters(), api) : sourceRecords;
      if (typeof options.onQuery === 'function') {
        var result = options.onQuery(filters(), api, rows);
        if (Array.isArray(result)) rows = result;
      }
      filteredRecords = filterRecords(Array.isArray(rows) ? rows : sourceRecords);
      render();
      return filteredRecords.slice();
    }

    function reset() {
      attributeSelect.setValue('');
      operatorSelect.setValue('');
      datePicker.reset();
      if (options.onReset) options.onReset(api);
      return query(true);
    }

    function open(records) {
      if (Array.isArray(records)) sourceRecords = records.slice();
      root.classList.add('show');
      query(true);
      if (options.onOpen) options.onOpen(api);
    }

    function close() {
      closePanels();
      datePanel.classList.add('hidden');
      root.classList.remove('show');
      if (trigger) trigger.focus();
      if (options.onClose) options.onClose(api);
    }

    root.addEventListener('click', function (event) {
      if (event.target === root || event.target.closest('[data-oplog-close]')) { close(); return; }
      if (event.target.closest('[data-oplog-query]')) { query(true); return; }
      if (event.target.closest('[data-oplog-reset]')) { reset(); return; }
      var pageButton = event.target.closest('[data-oplog-page]');
      if (pageButton) { page = Number(pageButton.dataset.oplogPage); render(); return; }
      if (event.target.closest('[data-oplog-prev]') && page > 1) { page -= 1; render(); return; }
      if (event.target.closest('[data-oplog-next]') && page * pageSize < filteredRecords.length) { page += 1; render(); }
    });
    sizeSelect.addEventListener('change', function () { pageSize = Number(sizeSelect.value) || 100; page = 1; render(); });
    doc.addEventListener('click', function (event) {
      if (!root.classList.contains('show')) return;
      if (!root.contains(event.target) && !(activePanel && activePanel.contains(event.target))) { closePanels(); datePanel.classList.add('hidden'); }
    });
    doc.addEventListener('keydown', function (event) { if (event.key === 'Escape' && root.classList.contains('show')) close(); });
    if (trigger) trigger.addEventListener('click', open);

    var api = {
      open: open, close: close, query: query, reset: reset, root: root,
      getFilters: filters,
      setRecords: function (records) { sourceRecords = Array.isArray(records) ? records.slice() : []; if (root.classList.contains('show')) query(false); },
      setOperationAttributes: function (items) { attributeItems.splice.apply(attributeItems, [0, attributeItems.length].concat(normalizedItems(items))); attributeSelect.setValue(''); },
      setOperators: function (items) { operatorItems.splice.apply(operatorItems, [0, operatorItems.length].concat(normalizedItems(items, true))); operatorSelect.setValue(''); }
    };
    query(true);
    return api;
  }

  function createColumnCustomizer(options) {
    var pager = element(options.pager);
    var table = element(options.table);
    var originalColumns = (options.columns || []).map(function (column) { return Object.assign({}, column); });
    var columns = originalColumns.slice();
    if (!pager || !table || !columns.length) throw new Error('createColumnCustomizer requires pager, table and columns');
    var defaults = columns.filter(function (column) { return column.defaultVisible !== false; }).map(function (column) { return String(column.key); });
    var visible = new Set(defaults);
    if (options.storageKey) {
      try {
        var saved = JSON.parse(global.localStorage.getItem(options.storageKey) || 'null');
        if (Array.isArray(saved)) visible = new Set(saved.map(String));
        else if (saved && typeof saved === 'object') {
          if (Array.isArray(saved.visible)) visible = new Set(saved.visible.map(String));
          if (Array.isArray(saved.order)) {
            var byKey = {};
            columns.forEach(function (column) { byKey[String(column.key)] = column; });
            columns = saved.order.map(String).map(function (key) { return byKey[key]; }).filter(Boolean);
            originalColumns.forEach(function (column) { if (columns.indexOf(column) < 0) columns.push(column); });
          }
        }
      } catch (error) {}
    }
    var trigger = doc.createElement('button');
    trigger.type = 'button';
    trigger.className = 'erp-column-trigger';
    trigger.title = '自定义列';
    trigger.setAttribute('aria-label', '自定义列');
    trigger.textContent = '⚙';
    pager.appendChild(trigger);
    var mask = doc.createElement('div');
    mask.className = 'erp-column-mask';
    mask.innerHTML = '<aside class="erp-column-drawer" role="dialog" aria-modal="true" aria-label="自定义列"><div class="erp-column-head"><button type="button" class="erp-column-close" aria-label="关闭">×</button><span>' + escapeHtml(options.title || '自定义列') + '</span></div><div class="erp-column-list"></div><div class="erp-column-foot"><button type="button" class="erp-column-reset">重置</button></div></aside>';
    doc.body.appendChild(mask);
    var list = mask.querySelector('.erp-column-list');

    function save() {
      if (!options.storageKey) return;
      try { global.localStorage.setItem(options.storageKey, JSON.stringify({ visible: Array.from(visible), order: columns.map(function (column) { return String(column.key); }) })); } catch (error) {}
    }
    function render() {
      list.innerHTML = columns.map(function (column) {
        return '<div class="erp-column-item" data-column-item="' + escapeHtml(column.key) + '"><span class="erp-column-handle" draggable="true" title="拖拽调整字段位置" aria-label="拖拽调整' + escapeHtml(column.label) + '的位置">⠿</span><label><input type="checkbox" data-column-key="' + escapeHtml(column.key) + '" ' + (visible.has(String(column.key)) ? 'checked' : '') + '><span>' + escapeHtml(column.label) + '</span></label></div>';
      }).join('');
    }
    function tagCells(cells) {
      if (!cells || !cells.length || Array.prototype.some.call(cells, function (cell) { return cell.hasAttribute('data-erp-column-key'); })) return;
      originalColumns.forEach(function (column) {
        var cell = cells[Number(column.index) - 1];
        if (cell) cell.setAttribute('data-erp-column-key', String(column.key));
      });
    }
    function tagStructure() {
      var colgroup = table.querySelector('colgroup');
      if (colgroup) tagCells(colgroup.children);
      Array.prototype.forEach.call(table.tHead ? table.tHead.rows : [], function (row) { tagCells(row.cells); });
      Array.prototype.forEach.call(table.tBodies, function (tbody) {
        Array.prototype.forEach.call(tbody.rows, function (row) {
          if (row.classList.contains('detail-row') || row.cells.length === 1) return;
          tagCells(row.cells);
        });
      });
    }
    function reorderChildren(parent, children) {
      if (!parent || !children || !children.length) return;
      var slots = originalColumns.map(function (column) { return Number(column.index) - 1; }).sort(function (a, b) { return a - b; });
      var current = Array.prototype.slice.call(children);
      var keyed = {};
      current.forEach(function (node) { var key = node.getAttribute && node.getAttribute('data-erp-column-key'); if (key) keyed[key] = node; });
      var next = current.slice();
      columns.forEach(function (column, orderIndex) { if (keyed[String(column.key)] && slots[orderIndex] != null) next[slots[orderIndex]] = keyed[String(column.key)]; });
      if (current.every(function (node, index) { return node === next[index]; })) return;
      var fragment = doc.createDocumentFragment();
      next.forEach(function (node) { fragment.appendChild(node); });
      parent.appendChild(fragment);
    }
    function reorderTable() {
      var colgroup = table.querySelector('colgroup');
      if (colgroup) reorderChildren(colgroup, colgroup.children);
      Array.prototype.forEach.call(table.tHead ? table.tHead.rows : [], function (row) { reorderChildren(row, row.cells); });
      Array.prototype.forEach.call(table.tBodies, function (tbody) {
        Array.prototype.forEach.call(tbody.rows, function (row) {
          if (row.classList.contains('detail-row') || row.cells.length === 1) return;
          reorderChildren(row, row.cells);
        });
      });
    }
    function apply() {
      tagStructure();
      reorderTable();
      columns.forEach(function (column) {
        var show = visible.has(String(column.key));
        Array.prototype.forEach.call(table.querySelectorAll('[data-erp-column-key]'), function (node) {
          if (node.getAttribute('data-erp-column-key') === String(column.key)) node.style.display = show ? '' : 'none';
        });
      });
      save();
      if (options.onChange) options.onChange(Array.from(visible));
    }
    function open() { render(); mask.classList.add('show'); }
    function close() { mask.classList.remove('show'); trigger.focus(); }
    trigger.addEventListener('click', open);
    mask.querySelector('.erp-column-close').addEventListener('click', close);
    mask.addEventListener('click', function (event) { if (event.target === mask) close(); });
    list.addEventListener('change', function (event) {
      var input = event.target.closest('[data-column-key]');
      if (!input) return;
      if (input.checked) visible.add(String(input.dataset.columnKey)); else visible.delete(String(input.dataset.columnKey));
      apply();
    });
    var draggingItem = null;
    list.addEventListener('dragstart', function (event) {
      var handle = event.target.closest('.erp-column-handle');
      if (!handle) { event.preventDefault(); return; }
      draggingItem = handle.closest('.erp-column-item');
      draggingItem.classList.add('dragging');
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', draggingItem.dataset.columnItem);
    });
    list.addEventListener('dragover', function (event) {
      if (!draggingItem) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      var target = event.target.closest('.erp-column-item');
      if (!target || target === draggingItem) return;
      var rect = target.getBoundingClientRect();
      list.insertBefore(draggingItem, event.clientY > rect.top + rect.height / 2 ? target.nextSibling : target);
    });
    list.addEventListener('drop', function (event) {
      if (!draggingItem) return;
      event.preventDefault();
      var order = Array.prototype.map.call(list.querySelectorAll('.erp-column-item'), function (item) { return item.dataset.columnItem; });
      var byKey = {};
      columns.forEach(function (column) { byKey[String(column.key)] = column; });
      columns = order.map(function (key) { return byKey[key]; }).filter(Boolean);
      draggingItem.classList.remove('dragging');
      draggingItem = null;
      render();
      apply();
    });
    list.addEventListener('dragend', function () { if (draggingItem) { draggingItem.classList.remove('dragging'); draggingItem = null; render(); } });
    mask.querySelector('.erp-column-reset').addEventListener('click', function () { visible = new Set(defaults); columns = originalColumns.slice(); render(); apply(); });
    var observer = new MutationObserver(function () { apply(); });
    Array.prototype.forEach.call(table.tBodies, function (tbody) { observer.observe(tbody, { childList: true }); });
    apply();
    return { open: open, close: close, apply: apply, reset: function () { visible = new Set(defaults); columns = originalColumns.slice(); render(); apply(); }, visible: function () { return Array.from(visible); }, order: function () { return columns.map(function (column) { return String(column.key); }); } };
  }

  function createWarehouseSelector(options) {
    var root = element(options.root);
    var state = options.state || { value: '', panelOpen: false, showDisabled: false };

    function items() { return typeof options.items === 'function' ? options.items() : (options.items || []); }
    function render() {
      var all = items();
      var enabled = all.filter(function (item) { return item.enabled !== false; });
      var visible = enabled.slice(0, options.inlineLimit == null ? 9 : options.inlineLimit);
      var overflow = enabled.slice(visible.length);
      var disabled = all.filter(function (item) { return item.enabled === false; });
      var moreItems = overflow.concat(state.showDisabled ? disabled : []);
      var selectedInMore = overflow.concat(disabled).some(function (item) { return String(item.id) === String(state.value); });
      root.innerHTML = '<button type="button" class="' + (options.buttonClass || 'warehouse-btn') + ' ' + (!state.value ? (options.activeClass || 'active') : '') + '" data-common-warehouse="" aria-pressed="' + (!state.value) + '">' + escapeHtml(options.allLabel || '全部') + '</button>' + visible.map(function (item) {
        return '<button type="button" class="' + (options.buttonClass || 'warehouse-btn') + ' ' + (String(item.id) === String(state.value) ? (options.activeClass || 'active') : '') + '" data-common-warehouse="' + escapeHtml(item.id) + '" aria-pressed="' + (String(item.id) === String(state.value)) + '">' + escapeHtml(item.name) + '</button>';
      }).join('') + '<div class="warehouse-more-wrap"><button type="button" class="' + (options.moreButtonClass || 'more-btn') + ' ' + (selectedInMore ? (options.activeClass || 'active') : '') + '" data-common-more aria-expanded="' + state.panelOpen + '">' + escapeHtml(options.moreLabel || '更多') + ' ' + (state.panelOpen ? '⌃' : '⌄') + '</button><div class="warehouse-more-panel ' + (state.panelOpen ? '' : (options.hiddenClass || 'hidden')) + '"><div class="warehouse-more-scroll">' + moreItems.map(function (item) {
        return '<button type="button" class="warehouse-option ' + (String(item.id) === String(state.value) ? (options.activeClass || 'active') : '') + '" data-common-warehouse="' + escapeHtml(item.id) + '">' + escapeHtml(item.name) + (item.enabled === false ? '（停用）' : '') + '</button>';
      }).join('') + '</div><label class="warehouse-disabled-toggle"><input type="checkbox" data-common-disabled ' + (state.showDisabled ? 'checked' : '') + '>' + escapeHtml(options.disabledLabel || ('显示停用' + (options.fieldName || '仓库'))) + '</label></div></div>';
    }

    root.addEventListener('click', function (event) {
      event.stopPropagation();
      var warehouse = event.target.closest('[data-common-warehouse]');
      if (warehouse) {
        state.value = warehouse.dataset.commonWarehouse;
        state.panelOpen = false;
        render();
        if (options.onChange) options.onChange(state.value, state);
        return;
      }
      if (event.target.closest('[data-common-more]')) {
        state.panelOpen = !state.panelOpen;
        render();
      }
    });
    root.addEventListener('change', function (event) {
      event.stopPropagation();
      if (!event.target.matches('[data-common-disabled]')) return;
      state.showDisabled = event.target.checked;
      state.panelOpen = true;
      render();
    });
    render();
    return {
      render: render,
      getValue: function () { return state.value; },
      set: function (value, silent) {
        state.value = value || '';
        render();
        if (!silent && options.onChange) options.onChange(state.value, state);
      },
      reset: function () { state.value = ''; state.panelOpen = false; state.showDisabled = false; render(); },
      state: state
    };
  }

  function createHistoryExportTasks(options) {
    function matchesName(name, term, mode) {
      if (!term) return true;
      if (mode === '等于') return name === term;
      if (mode === '包含') return name.indexOf(term) >= 0;
      if (mode === '结尾是') return name.endsWith(term);
      return name.startsWith(term);
    }
    function filter(tasks, filters) {
      var filtered = tasks.filter(function (task) {
        var time = options.timeValue(task[options.timeField || 'started']);
        return (!filters.start || time >= filters.start) && (!filters.end || time <= filters.end) &&
          (!filters.status || task.status === filters.status) && matchesName(task.name, filters.name, filters.nameMode) &&
          (!filters.fileType || task.fileType === filters.fileType) && (!filters.exportType || task.exportType === filters.exportType);
      });
      if (options.sort === false) return filtered;
      return filtered.sort(function (left, right) {
        return options.timeValue(right[options.timeField || 'started']) - options.timeValue(left[options.timeField || 'started']);
      });
    }
    return { filter: filter, matchesName: matchesName };
  }

  global.ERPComponents = Object.freeze({
    version: '1.4.0',
    element: element,
    elements: elements,
    escapeHtml: escapeHtml,
    disabledToggleHtml: disabledToggleHtml,
    dateText: dateText,
    createDateRangePicker: createDateRangePicker,
    createSearchDropdown: createSearchDropdown,
    createWarehouseDropdown: createWarehouseDropdown,
    createFloatingSelect: createFloatingSelect,
    createTileGroup: createTileGroup,
    createStaticDropdown: createStaticDropdown,
    createPagination: createPagination,
    createBatchInput: createBatchInput,
    createBatchSearch: createBatchSearch,
    createOperationLog: createOperationLog,
    createColumnCustomizer: createColumnCustomizer,
    createWarehouseSelector: createWarehouseSelector,
    createHistoryExportTasks: createHistoryExportTasks,
    createStickyTableHeader: createStickyTableHeader,
    parseBatch: parseBatch,
    pageItems: pageItems
  });
})(window);
