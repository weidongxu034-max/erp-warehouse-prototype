(function () {
  'use strict';
  var $ = function (selector) { return document.querySelector(selector); };
  var esc = ERPComponents.escapeHtml;
  var warehouses = ['tang01', '云县中仓', '振华仓1', '验证仓', 'XWD仓'];
  var groups = ['中堂仓', '振华仓组', '云县仓组'];
  var people = ['tzx-ES账号', 'WSQ', 'XWD', '张三', '李明', '黄小可'];
  var categories = ['A类', 'B类', '分类2', '常规分类'];
  var urgencies = ['A类', 'B类', '加急分类6'];
  var shipTypes = ['全部', '单品发货', '多品发货', '称重出库', '爆款发货', '多品协作', '标记发货', '快速发货', '入库直发'];
  var orderTypes = ['全部', '单品', '单品单量', '单品多量', '多品'];
  var data = [];
  var batchValues = [];
  var exportTasks = [];
  var controls = {};
  var state = { page: 1, size: 10, filtered: [], selected: new Set(), expanded: new Set(), shipType: '全部', orderType: '全部', pickupStatus: '全部', custom: '全部', deduct: '全部', pickupMode: 'pickup' };
  function pad(n) { return String(n).padStart(2, '0'); }
  function formatTime(value) { var d = new Date(value); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()); }
  function millis(value) { var n = new Date(String(value || '').replace(' ', 'T')).getTime(); return isNaN(n) ? null : n; }
  function toast(message) { var node = document.createElement('div'); node.className = 'toast'; node.textContent = message; $('#toastWrap').appendChild(node); setTimeout(function () { node.remove(); }, 2600); }
  function copy(value) { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(value).then(function () { toast('已复制：' + value); }); else { var input = document.createElement('textarea'); input.value = value; document.body.appendChild(input); input.select(); document.execCommand('copy'); input.remove(); toast('已复制：' + value); } }
  function text(value) { return value == null || value === '' ? '--' : String(value); }
  function lines(values) { return '<div class="cell-lines">' + values.map(function (value) { return '<div>' + esc(text(value)) + '</div>'; }).join('') + '</div>'; }
  function copyLine(value, linked) { return '<div class="sku-line"><span class="' + (linked ? 'sku-link' : '') + '">' + esc(text(value)) + '</span>' + (value && value !== '--' ? '<button type="button" class="copy" data-copy="' + esc(value) + '" aria-label="复制"></button>' : '') + '</div>'; }
  var base = new Date(2026, 8, 18, 10, 50, 31).getTime();
  for (var i = 0; i < 243; i++) {
    var shipped = formatTime(base - i * 3600000);
    var order = i === 0 ? 'WD20260918024939' : 'WD' + String(20260918024645 - i);
    var warehouse = warehouses[i % warehouses.length];
    var wasPickedUp = i % 6 === 4;
    data.push({
      id: 'OL-' + (i + 1), order: order, urgent: i % 5 === 0 ? urgencies[i % urgencies.length] : '--', shipWarehouse: warehouse, shipWarehouseGroup: groups[i % groups.length],
      outBatch: 'MS' + String(2026091873527359 + i), pickTask: i % 4 ? '--' : 'PK' + (202609180010 + i), sortBasket: i % 3 ? '--' : 'A' + (i + 1),
      orderType: orderTypes[1 + i % 4], shipCategory: i % 5 ? '--' : categories[i % categories.length], shipType: shipTypes[1 + i % 8], deduct: i % 4 === 0 ? '是' : '否',
      channel: i % 4 === 0 ? '加拿⼤专线小包普货' : '--', waybill: i % 3 ? '--' : 'ZS' + String(2223935699 + i),
      transferBy: i % 4 === 0 ? 'WSQ' : '--', transferAt: i % 4 === 0 ? shipped : '--', estimatedWeight: i % 5 === 0 ? '50.00' : '700.00', weighed: i % 5 === 0 ? '60.00' : '0.00',
      assignBy: i % 5 === 0 ? 'WSQ' : '--', assignAt: i % 5 === 0 ? shipped : '--', pickBy: i % 5 === 0 ? 'WSQ' : '--', pickAt: i % 5 === 0 ? shipped : '--', sortBy: '--', sortAt: '--',
      shipBy: i % 4 === 0 ? 'WSQ' : 'tzx-ES账号', shipAt: shipped, pickupAt: wasPickedUp ? shipped : '--', pickupBatch: wasPickedUp ? '20260918001' : '--', pickupGroup: wasPickedUp ? groups[i % groups.length] : '--', pickupWarehouse: wasPickedUp ? warehouse : '--', bagCount: 0,
      custom: i % 7 === 0 ? '是' : '否', cost: i % 5 === 0 ? 60 : 0, goods: [{ image: i % 5 === 0 ? '👕' : '暂无数据', sku: i % 5 === 0 ? 'Tang-h1' : 'Tang-普通4', name: i % 5 === 0 ? '大家好' : '2222', attr: i % 5 === 0 ? '蓝色 / XL' : '--', quantity: i % 5 === 0 ? 1 : 2, outboundQty: i % 5 === 0 ? 1 : 0, warehouse: warehouse, location: i % 5 === 0 ? 'A01-01-01' : '--' }],
      logs: [{ attribute: '订单发货', description: '订单已标记发货', operator: i % 4 === 0 ? 'WSQ' : 'tzx-ES账号', time: shipped }]
    });
  }
  function options(items) { return items.map(function (value) { return { value: value, label: value, enabled: true }; }); }
  controls.shipWarehouse = ERPComponents.createFloatingSelect({ el: $('#shipWarehouseSelect'), options: options(warehouses.concat(groups)), placeholder: '请选择', onChange: query });
  controls.pickupWarehouse = ERPComponents.createFloatingSelect({ el: $('#pickupWarehouseSelect'), options: options(warehouses.concat(groups)), placeholder: '请选择', onChange: query });
  controls.operator = ERPComponents.createFloatingSelect({ el: $('#operatorSelect'), options: options(people), placeholder: '请选择', fieldName: '人员', onChange: query });
  controls.category = ERPComponents.createFloatingSelect({ el: $('#shipCategorySelect'), options: options(categories), placeholder: '请选择', onChange: query });
  controls.urgent = ERPComponents.createFloatingSelect({ el: $('#urgentSelect'), options: options(urgencies), placeholder: '请选择', onChange: query });
  controls.modalWarehouse = ERPComponents.createFloatingSelect({ el: $('#pickupModalWarehouse'), options: options(warehouses.concat(groups)), placeholder: '请选择', panelZIndex: 3000 });
  function tile(id, values, key) { return ERPComponents.createTileGroup({ root: id, options: values, value: '全部', onChange: function (value) { state[key] = value; query(); } }); }
  controls.shipType = tile('#shipTypeTiles', shipTypes, 'shipType');
  controls.orderType = tile('#orderTypeTiles', orderTypes, 'orderType');
  controls.pickupStatus = tile('#pickupStatusTiles', ['全部', '已揽收', '未揽收'], 'pickupStatus');
  controls.custom = tile('#customTiles', ['全部', '是', '否'], 'custom');
  controls.deduct = tile('#deductTiles', ['全部', '是', '否'], 'deduct');
  controls.date = ERPComponents.createDateRangePicker({ trigger: '#mainDateRange', panel: '#mainDatePicker', shortcuts: '#mainShortcuts', grid: '#mainCalGrid', title: '#mainCalTitle', startText: '#mainStartText', endText: '#mainEndText', prevMonth: '#mainPrevMonth', nextMonth: '#mainNextMonth', prevYear: '#mainPrevYear', nextYear: '#mainNextYear' });
  controls.date.setRange(new Date(2026, 7, 21), new Date(2026, 8, 19));
  ERPComponents.createBatchSearch({ source: '#orderInfoText', title: '批量查询订单信息', fields: ['订单号', '货运单号', '出库批次号'], onConfirm: function (values, field) { $('#orderInfoMode').value = field; batchValues = values.map(function (value) { return value.toLowerCase(); }); $('#orderInfoText').value = values.length ? '已输入 ' + values.length + ' 个' + field : ''; query(); } });
  $('#orderInfoText').addEventListener('input', function () { batchValues = []; });
  controls.log = ERPComponents.createOperationLog({ title: '操作日志', operationAttributes: ['订单发货', '揽收', '修改揽收时间'], operators: options(people), records: [] });
  function query() {
    var shipWarehouse = controls.shipWarehouse.getValue(), pickupWarehouse = controls.pickupWarehouse.getValue(), operator = controls.operator.getValue(), category = controls.category.getValue(), urgent = controls.urgent.getValue();
    var orderSearch = batchValues.length ? '' : $('#orderInfoText').value.trim().toLowerCase(), task = $('#taskText').value.trim().toLowerCase(), channel = $('#channelText').value.trim().toLowerCase();
    var orderKey = { '订单号': 'order', '货运单号': 'waybill', '出库批次号': 'outBatch' }[$('#orderInfoMode').value];
    var taskKey = $('#taskMode').value === '配货任务码' ? 'pickTask' : 'sortBasket';
    var operatorKey = { '配货员': 'pickBy', '分拣员': 'sortBy', '发货员': 'shipBy', '指派人': 'assignBy', '转入人': 'transferBy' }[$('#operatorMode').value];
    var timeKey = { '发货时间': 'shipAt', '转入时间': 'transferAt', '配货时间': 'pickAt', '分拣时间': 'sortAt', '揽收时间': 'pickupAt' }[$('#timeField').value];
    var start = controls.date.getStart(), end = controls.date.getEnd(), min = $('#rangeMin').value === '' ? null : Number($('#rangeMin').value), max = $('#rangeMax').value === '' ? null : Number($('#rangeMax').value);
    state.filtered = data.filter(function (row) {
      var warehouseValue = $('#shipWarehouseMode').value === '发货仓' ? row.shipWarehouse : row.shipWarehouseGroup;
      var pickupValue = $('#pickupWarehouseMode').value === '揽收仓' ? row.pickupWarehouse : row.pickupGroup;
      if (shipWarehouse && warehouseValue !== shipWarehouse || pickupWarehouse && pickupValue !== pickupWarehouse) return false;
      if (state.shipType !== '全部' && row.shipType !== state.shipType || state.orderType !== '全部' && row.orderType !== state.orderType) return false;
      if (state.pickupStatus === '已揽收' && row.pickupAt === '--' || state.pickupStatus === '未揽收' && row.pickupAt !== '--') return false;
      if (state.custom !== '全部' && row.custom !== state.custom || state.deduct !== '全部' && row.deduct !== state.deduct) return false;
      if (category && row.shipCategory !== category || urgent && row.urgent !== urgent || operator && row[operatorKey] !== operator) return false;
      var orderValue = String(row[orderKey]).toLowerCase();
      if (batchValues.length ? batchValues.indexOf(orderValue) < 0 : orderSearch && orderValue.indexOf(orderSearch) < 0) return false;
      if (task && String(row[taskKey]).toLowerCase().indexOf(task) < 0 || channel && row.channel.toLowerCase().indexOf(channel) < 0) return false;
      var measure = $('#rangeMode').value === 'SKU种类' ? row.goods.length : $('#rangeMode').value === '商品数量' ? row.goods.reduce(function (sum, item) { return sum + item.quantity; }, 0) : Number(row.estimatedWeight);
      if (min !== null && measure < min || max !== null && measure > max) return false;
      var time = millis(row[timeKey]);
      if ((start || end) && (time === null || start && time < start || end && time > end)) return false;
      return true;
    });
    state.page = 1; state.selected.clear(); render();
  }
  function renderGoods(row) {
    return '<tr class="detail-row"><td colspan="13"><div class="outbound-goods-wrap"><table class="outbound-goods"><colgroup><col style="width:14%"><col style="width:19%"><col style="width:16%"><col style="width:13%"><col style="width:9%"><col style="width:11%"><col style="width:10%"><col style="width:8%"></colgroup><thead><tr><th>缩略图</th><th>SKU编号</th><th>中文名称</th><th>拓展属性</th><th>数量</th><th>出库数量</th><th>发货仓</th><th>仓位</th></tr></thead><tbody>' + row.goods.map(function (item) { return '<tr><td><div class="thumb">' + esc(item.image) + '</div></td><td><span class="sku-link">' + esc(item.sku) + '</span><button class="copy" type="button" data-copy="' + esc(item.sku) + '" aria-label="复制SKU"></button></td><td>' + esc(item.name) + '</td><td>' + esc(item.attr) + '</td><td>' + item.quantity + '</td><td>' + item.outboundQty + '</td><td>' + esc(item.warehouse) + '</td><td>' + esc(item.location) + '</td></tr>'; }).join('') + '</tbody></table></div></td></tr>';
  }
  function renderRow(row, index) {
    var selected = state.selected.has(row.id), expanded = state.expanded.has(row.id);
    return '<tr class="' + (selected ? 'selected' : '') + '"><td class="center"><div class="row-selector"><span>' + (index + 1) + '</span><button class="expand" type="button" data-expand="' + row.id + '">' + (expanded ? '−' : '+') + '</button><input class="row-check" type="checkbox" data-id="' + row.id + '" ' + (selected ? 'checked' : '') + '></div></td>' +
      '<td><div class="cell-lines">' + copyLine(row.order, true) + '<div>' + esc(row.urgent) + '</div><div>' + esc(row.shipWarehouse) + '</div></div></td><td><div class="cell-lines">' + copyLine(row.outBatch, false) + '<div>' + esc(row.pickTask) + '</div><div>' + esc(row.sortBasket) + '</div></div></td><td>' + lines([row.orderType, row.shipCategory, row.shipType, row.deduct]) + '</td>' +
      '<td>' + lines([row.channel, row.waybill]) + '</td><td>' + lines([row.transferBy, row.transferAt]) + '</td><td>' + lines([row.estimatedWeight, row.weighed]) + '</td><td>' + lines([row.assignBy, row.assignAt]) + '</td>' +
      '<td>' + lines([row.pickBy, row.pickAt]) + '</td><td>' + lines([row.sortBy, row.sortAt]) + '</td><td>' + lines([row.shipBy, row.shipAt, row.pickupAt]) + '</td><td>' + lines([row.pickupBatch, row.pickupGroup, row.pickupWarehouse]) + '</td><td class="center"><button type="button" class="link-btn" data-log="' + row.id + '">操作日志</button></td></tr>' + (expanded ? renderGoods(row) : '');
  }
  var pager = ERPComponents.createPagination({ numbers: '#pageNumbers', previous: '#prevPage', next: '#nextPage', jump: '#jumpPage', onChange: goPage, onPrevious: function () { goPage(state.page - 1); }, onNext: function () { goPage(state.page + 1); } });
  function pageCount() { return Math.max(1, Math.ceil(state.filtered.length / state.size)); }
  function goPage(page) { if (page < 1 || page > pageCount()) return; state.page = page; render(); }
  function render() {
    var offset = (state.page - 1) * state.size, rows = state.filtered.slice(offset, offset + state.size);
    $('#logBody').innerHTML = rows.length ? rows.map(function (row, index) { return renderRow(row, offset + index); }).join('') : '<tr><td colspan="13" class="empty-cell">暂无数据</td></tr>';
    $('#selectionCount').textContent = '已选中 ' + state.selected.size + ' 条'; $('#totalCount').textContent = '共 ' + state.filtered.length + ' 条';
    $('#checkAll').checked = rows.length > 0 && rows.every(function (row) { return state.selected.has(row.id); });
    $('#checkAll').indeterminate = rows.some(function (row) { return state.selected.has(row.id); }) && !$('#checkAll').checked;
    $('#expandAll').textContent = rows.length && rows.every(function (row) { return state.expanded.has(row.id); }) ? '−' : '+';
    $('#summaryText').textContent = '合计：　出库总量：' + state.filtered.reduce(function (sum, row) { return sum + row.goods.reduce(function (quantity, item) { return quantity + item.outboundQty; }, 0); }, 0) + '　　 累计总成本（元）：' + state.filtered.reduce(function (sum, row) { return sum + row.cost; }, 0).toFixed(4) + '（从2024-06-07起仓库成本价才有值）';
    pager.render({ page: state.page, pageCount: pageCount() });
  }
  function reset() {
    ['orderInfoText', 'taskText', 'channelText', 'rangeMin', 'rangeMax'].forEach(function (id) { $('#' + id).value = ''; }); batchValues = [];
    ['shipWarehouse', 'pickupWarehouse', 'operator', 'category', 'urgent'].forEach(function (key) { controls[key].setValue('', false); });
    ['shipWarehouseMode', 'pickupWarehouseMode', 'orderInfoMode', 'taskMode', 'operatorMode', 'timeField', 'rangeMode'].forEach(function (id) { $('#' + id).selectedIndex = 0; });
    ['shipType', 'orderType', 'pickupStatus', 'custom', 'deduct'].forEach(function (key) { state[key] = '全部'; controls[key].setValue('全部', true); });
    controls.date.reset(); query();
  }
  function selectedRows() { return data.filter(function (row) { return state.selected.has(row.id); }); }
  function openPickup(mode) {
    var rows = selectedRows(); if (!rows.length) { toast('请先勾选订单'); return; }
    state.pickupMode = mode; $('#pickupTitle').textContent = mode === 'pickup' ? '一键揽收' : '修改揽收时间';
    $('#pickupInfo').innerHTML = mode === 'pickup' ? '<ol><li>确认后系统会将发货时间内的未揽收订单按揽收时间标记为已揽收</li><li>揽收时间可自行修改</li><li>也可选择加入当天已有的揽收批次；不加入系统将创建新批次</li></ol>' : '<ol><li>设置时间后，可选择加入已有揽收批次；不加入则系统将按揽收时间创建新批次，不改变揽收状态</li><li>若时间未设置，所选订单将清空揽收时间变为未揽收</li></ol>';
    var times = rows.map(function (row) { return millis(row.shipAt); }).filter(function (value) { return value !== null; });
    $('#pickupShipTime').textContent = mode === 'pickup' ? '发货时间：' + formatTime(Math.min.apply(Math, times)) + ' ~ ' + formatTime(Math.max.apply(Math, times)) : '';
    $('#bagCountField').classList.toggle('hidden', mode !== 'pickup'); $('#bagCountInput').value = '0';
    $('#pickupModalMode').value = '揽收仓'; controls.modalWarehouse.setValue(rows[0].pickupWarehouse !== '--' ? rows[0].pickupWarehouse : rows[0].shipWarehouse, false);
    $('#pickupTimeInput').value = mode === 'modify' && rows[0].pickupAt !== '--' ? rows[0].pickupAt : formatTime(new Date());
    $('#pickupBatchHint').textContent = '当天无揽收批次'; $('#pickupMask').classList.add('show');
  }
  function closePickup() { $('#pickupMask').classList.remove('show'); }
  function confirmPickup() {
    var value = $('#pickupTimeInput').value.trim(), time = value ? millis(value) : null;
    if (value && time === null) { toast('请输入正确的揽收时间，格式：YYYY-MM-DD HH:mm:ss'); return; }
    if (state.pickupMode === 'pickup' && (!value || Number($('#bagCountInput').value) < 0)) { toast('请填写揽收时间和有效袋数'); return; }
    var rows = selectedRows(), warehouse = controls.modalWarehouse.getValue();
    if (!warehouse) { toast('请选择揽收仓（组）'); return; }
    var changed = 0;
    rows.forEach(function (row) {
      if (state.pickupMode === 'pickup' && row.pickupAt !== '--') return;
      row.pickupAt = value || '--'; row.pickupBatch = value ? value.slice(0, 10).replace(/-/g, '') + '001' : '--';
      row.pickupWarehouse = $('#pickupModalMode').value === '揽收仓' ? warehouse : row.shipWarehouse;
      row.pickupGroup = $('#pickupModalMode').value === '仓库分组' ? warehouse : row.shipWarehouseGroup;
      row.bagCount = state.pickupMode === 'pickup' ? Number($('#bagCountInput').value) : row.bagCount;
      row.logs.push({ attribute: state.pickupMode === 'pickup' ? '揽收' : '修改揽收时间', description: value ? '揽收时间：' + value : '清空揽收时间', operator: 'XWD', time: formatTime(new Date()) }); changed += 1;
    });
    closePickup(); state.selected.clear(); query(); toast((state.pickupMode === 'pickup' ? '已揽收 ' : '已修改 ') + changed + ' 条订单');
  }
  function csv(rows) { var headers = ['订单号', '出库批次号', '订单类型', '发货类型', '发货仓', '发货时间', '揽收时间', '揽收仓']; var content = '\ufeff' + [headers].concat(rows.map(function (row) { return [row.order, row.outBatch, row.orderType, row.shipType, row.shipWarehouse, row.shipAt, row.pickupAt, row.pickupWarehouse]; })).map(function (line) { return line.map(function (value) { return '"' + String(value).replace(/"/g, '""') + '"'; }).join(','); }).join('\r\n'); var url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' })); var link = document.createElement('a'); link.href = url; link.download = '订单出库日志-' + Date.now() + '.csv'; document.body.appendChild(link); link.click(); link.remove(); setTimeout(function () { URL.revokeObjectURL(url); }, 1000); }
  $('#queryForm').addEventListener('submit', function (event) { event.preventDefault(); query(); });
  $('#resetQuery').addEventListener('click', reset);
  $('#toggleFilters').addEventListener('click', function () { var grid = $('.outbound-grid'); grid.classList.toggle('collapsed'); this.textContent = grid.classList.contains('collapsed') ? '展开⌄' : '收起⌃'; });
  $('#checkAll').addEventListener('change', function () { var checked = this.checked, offset = (state.page - 1) * state.size; state.filtered.slice(offset, offset + state.size).forEach(function (row) { checked ? state.selected.add(row.id) : state.selected.delete(row.id); }); render(); });
  $('#expandAll').addEventListener('click', function () { var offset = (state.page - 1) * state.size, rows = state.filtered.slice(offset, offset + state.size), all = rows.every(function (row) { return state.expanded.has(row.id); }); rows.forEach(function (row) { all ? state.expanded.delete(row.id) : state.expanded.add(row.id); }); render(); });
  $('#logBody').addEventListener('change', function (event) { var box = event.target.closest('.row-check'); if (!box) return; box.checked ? state.selected.add(box.dataset.id) : state.selected.delete(box.dataset.id); render(); });
  $('#logBody').addEventListener('click', function (event) { var button = event.target.closest('button'); if (!button) return; if (button.dataset.copy) { copy(button.dataset.copy); return; } if (button.dataset.expand) { state.expanded.has(button.dataset.expand) ? state.expanded.delete(button.dataset.expand) : state.expanded.add(button.dataset.expand); render(); return; } if (button.dataset.log) { var row = data.find(function (item) { return item.id === button.dataset.log; }); controls.log.open(row.logs); } });
  $('#pageSize').addEventListener('change', function () { state.size = Number(this.value); state.page = 1; render(); });
  [['pickupToggle', 'pickupWrap'], ['exportToggle', 'exportWrap'], ['printToggle', 'printWrap']].forEach(function (item) { $('#' + item[0]).addEventListener('click', function () { $('#' + item[1]).classList.toggle('open'); }); });
  $('#oneClickPickup').addEventListener('click', function () { $('#pickupWrap').classList.remove('open'); openPickup('pickup'); });
  $('#modifyPickupTime').addEventListener('click', function () { $('#pickupWrap').classList.remove('open'); openPickup('modify'); });
  $('#closePickup').addEventListener('click', closePickup); $('#cancelPickup').addEventListener('click', closePickup); $('#pickupMask').addEventListener('click', function (event) { if (event.target === this) closePickup(); }); $('#confirmPickup').addEventListener('click', confirmPickup);
  $('#scanPrint').addEventListener('click', function () { $('#printWrap').classList.remove('open'); toast('扫描打印设置将在后续原型中补充'); });
  $('#printerSettings').addEventListener('click', function () { $('#printWrap').classList.remove('open'); toast('打印机设置将在后续原型中补充'); });
  $('#exportBtn').addEventListener('click', function () { var rows = state.selected.size ? selectedRows() : state.filtered; csv(rows); exportTasks.unshift({ name: '订单出库日志导出', operator: 'XWD', time: formatTime(new Date()), status: '成功' }); $('#exportWrap').classList.remove('open'); toast('导出成功'); });
  $('#historyBtn').addEventListener('click', function () { $('#exportWrap').classList.remove('open'); $('#historyBody').innerHTML = exportTasks.map(function (task) { return '<tr><td>' + esc(task.name) + '</td><td>' + esc(task.operator) + '</td><td>' + esc(task.time) + '</td><td>' + esc(task.status) + '</td><td>--</td></tr>'; }).join('') || '<tr><td colspan="5" class="center">暂无导出任务</td></tr>'; $('#historyMask').classList.add('show'); });
  $('#closeHistory').addEventListener('click', function () { $('#historyMask').classList.remove('show'); }); $('#historyMask').addEventListener('click', function (event) { if (event.target === this) this.classList.remove('show'); });
  $('#addQuickSearch').addEventListener('click', function () { var name = prompt('快捷搜索名称（最多15个字符）'); if (!name) return; name = name.trim().slice(0, 15); if (!name) return; var button = document.createElement('button'); button.className = 'btn'; button.type = 'button'; button.textContent = name; button.addEventListener('click', query); $('#quickSearchList').appendChild(button); toast('已添加快捷搜索：' + name); });
  query();
})();
