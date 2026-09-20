(function () {
  'use strict';
  var $ = function (selector) { return document.querySelector(selector); };
  var $$ = function (selector) { return Array.from(document.querySelectorAll(selector)); };
  var esc = ERPComponents.escapeHtml;
  var warehouses = ['接口自动化测试1仓库（勿选）', '中转测试仓库', '云县中仓', '验证仓', '振华仓1', 'XWD仓'];
  var people = ['HF', 'XWD', 'test006', '黄小可', 'wang1', 'xu1'];
  var suppliers = ['自动化测试-供应商（勿动）', '36855128558', '测试-下单', '供应商A'];
  var statuses = ['全部', '待质检', '质检中', '待贴标', '贴标中', '待加工', '加工中', '待上架', '上架中', '部分入库', '已入库', '已作废', '异常'];
  var types = ['采购入库', '退货入库', '手工入库', '调拨入库'];
  var account = 'XWD';
  var products = [
    { sku: 'AUTO_20260918180132_HBpua_', name: 'Auto-商品-20260918180132_ajzwD3j0PILzaZeNNx', image: '🧑🏻‍🎤' },
    { sku: 'SKU-1214-1767106688', name: '111', image: '暂无数据' },
    { sku: '32111', name: '32111', image: '暂无数据' },
    { sku: 'SKU-XWD-001', name: '纯棉T恤', image: '👕' },
    { sku: 'vp1.13testsku', name: '集中测试商品', image: '📦' }
  ];
  function pad(value) { return String(value).padStart(2, '0'); }
  function formatTime(date) { return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + ' ' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds()); }
  function timestamp(value) { return value && value !== '--' ? new Date(value.replace(' ', 'T')).getTime() : null; }
  function toast(message) { var node = document.createElement('div'); node.className = 'toast'; node.textContent = message; $('#toastWrap').appendChild(node);setTimeout(function () { node.remove(); }, 2600); }
  window.toast = function (_, message) { toast(message); };
  function copy(value) { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(value).then(function () { toast('已复制：' + value); }); else { var input = document.createElement('textarea'); input.value = value; document.body.appendChild(input); input.select(); document.execCommand('copy'); input.remove(); toast('已复制：' + value); } }
  var data = [];
  var base = new Date(2026, 8, 18, 18, 2, 6).getTime();
  for (var i = 0; i < 8502; i++) {
    var product = products[i % products.length];
    var status = i % 13 === 0 ? '异常' : i % 11 === 0 ? '部分入库' : i % 8 === 0 ? '待上架' : i % 5 === 0 ? '已入库' : i % 3 === 0 ? '待质检' : '已作废';
    if (i < 3) status = ['已作废', '已作废', '已入库'][i];
    if (i === 3) status = '待上架';
    var created = formatTime(new Date(base - i * 112000));
    var warehouse = warehouses[i % warehouses.length];
    var supplier = suppliers[i % suppliers.length];
    var batch = '20260918' + String(10000019 - i).padStart(6, '0');
    data.push({
      id: 'IL-' + (i + 1), sku: product.sku, name: product.name, image: product.image,
      attr: i % 4 === 0 ? '颜色：白色 / 尺码：M' : '--', supplier: supplier,
      logistics: i % 4 === 0 ? 'SF091852207883213' : '--', warehouse: warehouse,
      location: i % 2 ? 'A01-01-01' : '--', exception: status === '异常' ? '数量异常 / 1' : '-- / --',
      voidBy: status === '已作废' ? 'HF' : '--', voidAt: status === '已作废' ? created : '--', created: created,
      signer: i % 3 ? 'XWD' : 'HF', signAt: created, inspector: i % 3 === 0 ? 'test006' : '--', inspectAt: i % 3 === 0 ? created : '--',
      labeler: '--', labelAt: '--', worker: '--', workAt: '--', shelfer: i % 4 === 0 ? 'XWD' : '--', shelfCode: i % 4 === 0 ? 'HF610' : '--', shelfAt: i % 4 === 0 ? created : '--',
      purchaseQty: i % 6 === 0 ? 5 : 1, signQty: i % 6 === 0 ? 5 : 1, inspectQty: 0, processQty: 0, labelQty: 0,
      weight: i % 4 === 0 ? '2.4567' : '--', processFee: '--', cost: '--', inboundQty: status === '已入库' ? 5 : 0,
      shelfQty: 0, badQty: status === '异常' ? 1 : 0, batch: batch, productBatch: i % 4 === 0 ? '2026091801' : '--',
      method: '采购入库', type: types[i % types.length], status: status, note: i % 8 === 0 ? '接口自动化测试第二次入库签收耗材' : '--',
      signMode: i % 2 ? '关联单号' : '物流单号', reference: 'SF' + String(91000000 + i),
      logs: [{ attribute: '创建入库任务', description: '创建入库任务，等待签收', operator: 'HF', time: created }, { attribute: '签收', description: '商品签收完成', operator: i % 3 ? 'XWD' : 'HF', time: created }]
    });
  }
  var state = { page: 1, size: 100, status: '全部', signMode: '全部', selected: new Set(), expanded: new Set(), filtered: data, batchSku: [], batchReference: [], batchNumber: [] };
  var controls = {};
  controls.warehouse = ERPComponents.createWarehouseDropdown({ root: '#warehouseSelect', button: '#warehouseButton', panel: '#warehousePanel', search: '#warehouseSearch', list: '#warehouseOptions', fieldName: '仓库', placeholder: '请选择', items: warehouses.map(function (name) { return { name: name, enabled: true }; }), getValue: function (item) { return item.name; }, getLabel: function (item) { return item.name; }, onChange: query });
  controls.type = ERPComponents.createFloatingSelect({ el: $('#inboundTypeSelect'), options: types.map(function (value) { return { value: value, label: value, enabled: true }; }), placeholder: '请选择', onChange: query });
  controls.person = ERPComponents.createFloatingSelect({ el: $('#personSelect'), options: people.map(function (value) { return { value: value, label: value, enabled: true }; }), placeholder: '请选择', fieldName: '人员', disabledLabel: '显示停用人员' });
  controls.supplier = ERPComponents.createFloatingSelect({ el: $('#supplierSelect'), options: suppliers.map(function (value) { return { value: value, label: value, enabled: true }; }), placeholder: '请选择', onChange: query });
  controls.status = ERPComponents.createTileGroup({ root: '#statusTiles', options: statuses, value: '全部', onChange: function (value) { state.status = value; query(); } });
  controls.sign = ERPComponents.createTileGroup({ root: '#signTiles', options: ['全部', '物流单号', '关联单号'], value: '全部', onChange: function (value) { state.signMode = value; query(); } });
  controls.date = ERPComponents.createDateRangePicker({ trigger: '#mainDateRange', panel: '#mainDatePicker', shortcuts: '#mainShortcuts', grid: '#mainCalGrid', title: '#mainCalTitle', startText: '#mainStartText', endText: '#mainEndText', prevMonth: '#mainPrevMonth', nextMonth: '#mainNextMonth', prevYear: '#mainPrevYear', nextYear: '#mainNextYear' });
  [['#skuText', 'batchSku', 'SKU编号'], ['#referenceText', 'batchReference', '关联单号'], ['#batchText', 'batchNumber', '入库批次号']].forEach(function (entry) {
    ERPComponents.createBatchSearch({ source: entry[0], title: '批量搜索', fields: [entry[2]], onConfirm: function (values) { state[entry[1]] = values.map(function (value) { return value.toLowerCase(); }); $(entry[0]).value = values.length ? '已输入 ' + values.length + ' 个' + entry[2] : ''; query(); } });
    $(entry[0]).addEventListener('input', function () { state[entry[1]] = []; });
  });
  controls.log = ERPComponents.createOperationLog({ title: '操作日志', operationAttributes: ['创建入库任务', '签收', '质检', '贴标', '加工', '上架', '作废'], operators: people.map(function (value) { return { value: value, label: value, enabled: true }; }), records: [] });
  function matches(value, text, batch) { value = String(value || '').toLowerCase(); return batch.length ? batch.indexOf(value) >= 0 : !text || value.indexOf(text) >= 0; }
  function query() {
    var warehouse = controls.warehouse.getValue(), type = $('#inboundTypeSelect').getValue(), supplier = $('#supplierSelect').getValue(), person = $('#personSelect').getValue();
    var sku = state.batchSku.length ? '' : $('#skuText').value.trim().toLowerCase();
    var reference = state.batchReference.length ? '' : $('#referenceText').value.trim().toLowerCase();
    var batch = state.batchNumber.length ? '' : $('#batchText').value.trim().toLowerCase();
    var logistics = $('#logisticsText').value.trim().toLowerCase(), shelf = $('#shelfTaskText').value.trim().toLowerCase();
    var role = $('#personRole').value, timeField = $('#timeField').value, start = controls.date.getStart(), end = controls.date.getEnd();
    state.filtered = data.filter(function (row) {
      if (warehouse && row.warehouse !== warehouse || type && row.type !== type || supplier && row.supplier !== supplier) return false;
      if (state.status !== '全部' && row.status !== state.status || state.signMode !== '全部' && row.signMode !== state.signMode) return false;
      if (!matches(row.sku, sku, state.batchSku) || !matches(row.reference, reference, state.batchReference) || !matches(row.batch, batch, state.batchNumber)) return false;
      if (logistics && row.logistics.toLowerCase().indexOf(logistics) < 0 || shelf && row.shelfCode.toLowerCase().indexOf(shelf) < 0) return false;
      var personField = { '签收员': 'signer', '质检员': 'inspector', '贴标员': 'labeler', '加工员': 'worker', '上架员': 'shelfer', '作废人': 'voidBy' }[role];
      if (person && row[personField] !== person) return false;
      var dateField = { '创建时间': 'created', '签收时间': 'signAt', '入库时间': 'signAt', '上架时间': 'shelfAt' }[timeField];
      var time = timestamp(row[dateField]);
      if ((start || end) && (time === null || start && time < start || end && time > end)) return false;
      return true;
    });
    state.page = 1; state.selected.clear(); render();
  }
  function reset() {
    ['skuText', 'logisticsText', 'referenceText', 'shelfTaskText', 'batchText'].forEach(function (id) { $('#' + id).value = ''; });
    state.batchSku = []; state.batchReference = []; state.batchNumber = []; state.status = '全部'; state.signMode = '全部';
    controls.warehouse.set('', true); $('#warehouseSearch').value = ''; $('#inboundTypeSelect').setValue('', true); $('#personSelect').setValue('', true); $('#supplierSelect').setValue('', true);
    controls.status.setValue('全部', true); controls.sign.setValue('全部', true); controls.date.reset(); $('#personRole').value = '签收员'; $('#timeField').value = '创建时间'; $('#originalOnly').checked = true; query();
  }
  function lines(values) { return '<div class="cell-lines">' + values.map(function (value) { return '<div>' + esc(value == null || value === '' ? '--' : value) + '</div>'; }).join('') + '</div>'; }
  function renderDetail(row) {
    return '<tr class="detail-row"><td colspan="13"><div class="inbound-subtable-wrap"><table class="inbound-subtable"><colgroup><col style="width:16%"><col style="width:8%"><col style="width:8%"><col style="width:27%"><col style="width:8%"><col style="width:22%"><col style="width:11%"></colgroup><thead><tr><th>关联单号</th><th>采购量</th><th>签收量</th><th>异常原因/数量</th><th>贴标数</th><th>入库量/上架破损量/质检不合格数</th><th>仓库成本价</th></tr></thead><tbody><tr><td><span class="sku-line"><span class="subtable-reference">' + esc(row.reference) + '</span><button type="button" class="copy" data-copy="' + esc(row.reference) + '" aria-label="复制关联单号"></button></span></td><td>' + esc(row.purchaseQty) + '</td><td>' + esc(row.signQty) + '</td><td>' + esc(row.exception) + '</td><td>' + esc(row.labelQty) + '</td><td>' + esc(row.inboundQty + '/' + row.shelfQty + '/' + row.badQty) + '</td><td>' + esc(row.cost) + '</td></tr></tbody></table></div></td></tr>';
  }
  function renderRow(row, index) {
    var selected = state.selected.has(row.id), expanded = state.expanded.has(row.id), canVoid = row.status !== '已入库' && row.status !== '部分入库' && row.status !== '已作废';
    var thumb = row.image === '暂无数据' ? '<span style="font-size:10px;color:#aaa">暂无数据</span>' : esc(row.image);
    return '<tr class="' + (selected ? 'selected' : '') + '"><td class="center"><div class="row-selector"><span>' + (index + 1) + '</span><button class="expand" data-expand="' + row.id + '" type="button">' + (expanded ? '−' : '+') + '</button><input type="checkbox" class="row-check" data-id="' + row.id + '" ' + (selected ? 'checked' : '') + '></div></td>' +
      '<td><div class="thumb">' + thumb + '</div></td><td><div class="cell-lines"><div class="sku-line"><a class="sku-link" data-product="' + esc(row.sku) + '">' + esc(row.sku) + '</a><button class="copy" data-copy="' + esc(row.sku) + '" title="复制SKU"></button></div><div>' + esc(row.name) + '</div></div></td>' +
      '<td>' + esc(row.attr) + '</td><td>' + lines([row.supplier, row.logistics, row.warehouse, row.location]) + '</td><td>' + lines([row.exception, row.voidBy + '/' + row.voidAt, row.created]) + '</td>' +
      '<td>' + lines([row.signer + '/' + row.signAt, row.inspector + '/' + row.inspectAt, row.labeler + '/' + row.labelAt, row.worker + '/' + row.workAt]) + '</td>' +
      '<td>' + lines([row.shelfer, row.shelfCode, row.shelfAt]) + '</td><td>' + lines([row.purchaseQty + '/' + row.signQty, row.inspectQty + '/' + row.processQty + '/' + row.labelQty, row.weight + '/' + row.processFee, row.cost]) + '</td>' +
      '<td>' + lines([row.inboundQty, row.shelfQty + '/' + row.badQty, row.batch, row.productBatch]) + '</td><td>' + lines([row.method, row.type, row.status]) + '</td><td>' + esc(row.note) + '</td>' +
      '<td><div class="inbound-operations"><button type="button" data-log="' + row.id + '">操作日志</button>' + (canVoid ? '<button type="button" class="void" data-void="' + row.id + '">作废</button>' : '') + '</div></td></tr>' +
      (expanded ? renderDetail(row) : '');
  }
  var pager = ERPComponents.createPagination({ numbers: '#pageNumbers', previous: '#prevPage', next: '#nextPage', jump: '#jumpPage', onChange: goPage, onPrevious: function () { goPage(state.page - 1); }, onNext: function () { goPage(state.page + 1); } });
  function pageCount() { return Math.max(1, Math.ceil(state.filtered.length / state.size)); }
  function goPage(page) { if (page < 1 || page > pageCount()) return; state.page = page; render(); }
  function render() {
    var offset = (state.page - 1) * state.size, rows = state.filtered.slice(offset, offset + state.size);
    $('#logBody').innerHTML = rows.length ? rows.map(function (row, index) { return renderRow(row, offset + index); }).join('') : '<tr><td colspan="13" class="empty-cell">暂无数据</td></tr>';
    $('#totalCount').textContent = '共 ' + state.filtered.length.toLocaleString() + ' 条';
    $('#selectionCount').textContent = '已选中 ' + state.selected.size + ' 条';
    $('#checkAll').checked = rows.length > 0 && rows.every(function (row) { return state.selected.has(row.id); });
    $('#checkAll').indeterminate = rows.some(function (row) { return state.selected.has(row.id); }) && !$('#checkAll').checked;
    $('#expandAll').textContent = rows.length && rows.every(function (row) { return state.expanded.has(row.id); }) ? '−' : '+';
    pager.render({ page: state.page, pageCount: pageCount() });
    $('#summaryText').textContent = '合计：SKU 种类：' + new Set(state.filtered.map(function (row) { return row.sku; })).size.toLocaleString() + '　签收商品种类/总量：' + state.filtered.length.toLocaleString() + '/' + state.filtered.reduce(function (sum, row) { return sum + row.signQty; }, 0).toLocaleString() + '　入库商品种类/总量：' + state.filtered.filter(function (row) { return row.inboundQty > 0; }).length.toLocaleString() + '/' + state.filtered.reduce(function (sum, row) { return sum + row.inboundQty; }, 0).toLocaleString();
  }
  function voidRows(ids) {
    var eligible = data.filter(function (row) { return ids.has(row.id) && row.status !== '已入库' && row.status !== '部分入库' && row.status !== '已作废'; });
    if (!eligible.length) { toast('所选记录不可作废'); return; }
    if (!confirm('确定作废 ' + eligible.length + ' 条入库日志？')) return;
    eligible.forEach(function (row) { row.status = '已作废'; row.voidBy = account; row.voidAt = formatTime(new Date()); row.logs.push({ attribute: '作废', description: '入库记录已作废', operator: account, time: row.voidAt }); });
    state.selected.clear(); query(); toast('已作废 ' + eligible.length + ' 条');
  }
  function downloadCsv(filename, rows) { var heads = ['SKU', '商品名称', '供应商', '仓库', '入库批次号', '入库类型', '状态', '创建时间']; var content = '\ufeff' + [heads].concat(rows.map(function (row) { return [row.sku, row.name, row.supplier, row.warehouse, row.batch, row.type, row.status, row.created]; })).map(function (line) { return line.map(function (value) { return '"' + String(value).replace(/"/g, '""') + '"'; }).join(','); }).join('\r\n'); var url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' })); var link = document.createElement('a'); link.href = url; link.download = filename; document.body.appendChild(link); link.click(); link.remove(); setTimeout(function () { URL.revokeObjectURL(url); }, 1000); }
  var exportTasks = [];
  $('#queryForm').addEventListener('submit', function (event) { event.preventDefault(); query(); }); $('#resetQuery').addEventListener('click', reset);
  $('#toggleFilters').addEventListener('click', function () { var grid = $('.inbound-grid'); grid.classList.toggle('collapsed'); this.textContent = grid.classList.contains('collapsed') ? '展开⌄' : '收起⌃'; });
  $('#checkAll').addEventListener('change', function () { var checked = this.checked, offset = (state.page - 1) * state.size; state.filtered.slice(offset, offset + state.size).forEach(function (row) { checked ? state.selected.add(row.id) : state.selected.delete(row.id); }); render(); });
  $('#expandAll').addEventListener('click', function () { var offset = (state.page - 1) * state.size, rows = state.filtered.slice(offset, offset + state.size), all = rows.every(function (row) { return state.expanded.has(row.id); }); rows.forEach(function (row) { all ? state.expanded.delete(row.id) : state.expanded.add(row.id); }); render(); });
  $('#logBody').addEventListener('change', function (event) { var checkbox = event.target.closest('.row-check'); if (!checkbox) return; checkbox.checked ? state.selected.add(checkbox.dataset.id) : state.selected.delete(checkbox.dataset.id); render(); });
  $('#logBody').addEventListener('click', function (event) { var button = event.target.closest('button, a'); if (!button) return; if (button.dataset.copy) { copy(button.dataset.copy); return; } if (button.dataset.expand) { state.expanded.has(button.dataset.expand) ? state.expanded.delete(button.dataset.expand) : state.expanded.add(button.dataset.expand); render(); return; } if (button.dataset.log) { var logRow = data.find(function (row) { return row.id === button.dataset.log; }); controls.log.open(logRow.logs); return; } if (button.dataset.void) { voidRows(new Set([button.dataset.void])); return; } if (button.dataset.product) toast('商品详情将在后续原型中补充'); });
  $('#batchVoid').addEventListener('click', function () { if (!state.selected.size) { toast('请先选择入库日志'); return; } voidRows(state.selected); });
  $('#printLabels').addEventListener('click', function () { toast(state.selected.size ? '已提交 ' + state.selected.size + ' 条打印任务（原型演示）' : '请先选择入库日志'); });
  $('#pageSize').addEventListener('change', function () { state.size = Number(this.value); state.page = 1; render(); });
  $('#exportToggle').addEventListener('click', function () { $('#exportWrap').classList.toggle('open'); });
  $('#exportBtn').addEventListener('click', function () { var rows = state.selected.size ? state.filtered.filter(function (row) { return state.selected.has(row.id); }) : state.filtered; var name = '入库日志-' + Date.now() + '.csv'; downloadCsv(name, rows); exportTasks.unshift({ name: name, operator: account, time: formatTime(new Date()), status: '成功' }); $('#exportWrap').classList.remove('open'); toast('导出成功'); });
  $('#historyBtn').addEventListener('click', function () { $('#exportWrap').classList.remove('open'); $('#historyBody').innerHTML = exportTasks.map(function (task) { return '<tr><td>' + esc(task.name) + '</td><td>' + esc(task.operator) + '</td><td>' + esc(task.time) + '</td><td>' + esc(task.status) + '</td><td>--</td></tr>'; }).join('') || '<tr><td colspan="5" class="center">暂无导出任务</td></tr>'; $('#historyMask').classList.add('show'); });
  $('#closeHistory').addEventListener('click', function () { $('#historyMask').classList.remove('show'); }); $('#historyMask').addEventListener('click', function (event) { if (event.target === this) this.classList.remove('show'); });
  query();
})();
