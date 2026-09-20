(function () {
  'use strict';
  var view = document.body.dataset.approvalView;
  var app = document.getElementById('approvalApp');
  var STORE = 'erp_warehouse_approval_rules_v1';
  var embedded = new URLSearchParams(location.search).get('_erp_embed') === '1';
  var params = new URLSearchParams(location.search);
  var typeNames = ['调拨审批', '手工入库审批'];
  var people = ['HF', 'wind', '黄小可', 'chen002', 'XWD'];
  var warehouses = ['HF的私人仓库4可选', 'HF的私人仓库3勿选', '中堂仓', 'smile', 'waq-仓库01'];
  function escapeHtml(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) { return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]; }); }
  function now() { var date = new Date(); return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0') + ' ' + String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0') + ':' + String(date.getSeconds()).padStart(2, '0'); }
  function go(file, extra) { var suffix = embedded ? '_erp_embed=1' : ''; if (extra) suffix += (suffix ? '&' : '') + extra; location.href = file + (suffix ? '?' + suffix : ''); }
  function message(text, error) { var box = document.createElement('div'); box.className = 'ap-toast' + (error ? ' error' : ''); box.textContent = text; document.body.appendChild(box); setTimeout(function () { box.remove(); }, 2300); }
  function seed() {
    var names = ['HF仓库调拨规则','HF满足全部条件规则','HF满足部分条件审批规则','中堂3楼','调入审批','HF命中SPU调拨审批规则','HF手工入库审批规则'];
    var dates = ['2023-11-07 19:18:00','2023-11-07 21:04:25','2023-11-07 22:05:01','2023-11-08 23:22:29','2023-11-09 10:08:40','2023-11-24 20:02:20','2023-11-24 20:36:53'];
    var result = [];
    for (var i = 0; i < 73; i += 1) {
      var base = i < 7 ? names[i] : 'HF仓库调拨规则' + Array(i - 5).join('-复制');
      var enabled = i === 6;
      result.push({ id: i + 1, priority: i === 1 ? 50 : 1, name: base, enabled: enabled, type: enabled ? '手工入库审批' : '调拨审批', note: i === 0 || i >= 7 ? 'HF仓库备注' : '', creator: i < 7 ? (i === 3 ? 'chen002' : i === 4 ? '外部CXY-001' : i === 5 ? '黄小可' : 'HF') : 'wind', createdAt: i < 7 ? dates[i] : '2023-11-28 10:' + String(38 + Math.min(i - 7, 21)).padStart(2, '0') + ':38', matchAll: i !== 1, creatorEnabled: i === 0, creatorValue: i === 0 ? 'HF' : '', warehouseEnabled: i === 0, outbound: i === 0 ? warehouses[0] : '', inbound: i === 0 ? warehouses[1] : '', productEnabled: false, productValue: '', nodes: [{ mode:'会签', approver:'HF' }], logs: [{attribute:'创建',description:'创建审批规则',operator:i < 7 ? 'HF' : 'wind',time:i < 7 ? dates[i] : '2023-11-28 10:38:38'}] });
    }
    return result;
  }
  function readRules() { try { var raw = localStorage.getItem(STORE); if (raw) { var value = JSON.parse(raw); if (Array.isArray(value)) return value; } } catch (error) {} return seed(); }
  function saveRules(rules) { try { localStorage.setItem(STORE, JSON.stringify(rules)); } catch (error) { message('浏览器无法保存本地数据', true); } }
  function optionHtml(items, selected, placeholder) { return '<option value="">' + escapeHtml(placeholder || '请选择') + '</option>' + items.map(function (item) { return '<option value="' + escapeHtml(item) + '"' + (item === selected ? ' selected' : '') + '>' + escapeHtml(item) + '</option>'; }).join(''); }
  function selectOptions(items) { return items.map(function (item) { return { value:item, label:item }; }); }
  function addLog(rule, attribute, description) { if (!Array.isArray(rule.logs)) rule.logs = []; rule.logs.unshift({attribute:attribute,description:description,operator:'XWD',time:now()}); }

  if (view === 'list') initList(); else initForm();

  function initList() {
    app.innerHTML = '<section class="ap-card ap-filter"><div class="ap-filter-grid">' +
      '<div class="ap-field"><label>状态</label><div class="ap-selectbox floating-select" id="apStatus"></div></div>' +
      '<div class="ap-field"><label for="apPriority">优先级</label><input id="apPriority" class="ap-input" placeholder="请输入"></div>' +
      '<div class="ap-field"><label for="apName">规则名称</label><input id="apName" class="ap-input" placeholder="请输入"></div>' +
      '<div class="ap-field"><label>类型</label><div class="ap-selectbox floating-select" id="apType"></div></div>' +
      '<div class="ap-actions"><button type="button" class="ap-btn" data-action="reset">重置</button><button type="button" class="ap-btn primary" data-action="query">查询</button></div></div></section>' +
      '<section class="ap-card ap-table-card"><div class="ap-toolbar"><button type="button" class="ap-btn primary" data-action="add">新增规则</button></div>' +
      '<div class="ap-table-wrap"><table class="ap-table"><colgroup><col style="width:4%"><col style="width:29%"><col style="width:4%"><col style="width:6%"><col style="width:29%"><col style="width:9%"><col style="width:10%"><col style="width:9%"></colgroup>' +
      '<thead><tr><th class="ap-sort" data-sort="priority">优先级 <span class="ap-sort-mark">↕</span></th><th>规则名称</th><th>状态</th><th>类型</th><th>备注</th><th>创建人</th><th class="ap-sort" data-sort="createdAt">创建时间 <span class="ap-sort-mark">↕</span></th><th>操作</th></tr></thead><tbody id="apTableBody"></tbody></table></div></section>';
    var pager = document.createElement('div'); pager.className = 'ap-pager'; pager.id = 'apPager'; document.body.appendChild(pager);
    ERPComponents.createStickyTableHeader({table:'.ap-table',wrapper:'.ap-table-wrap',scrollContainer:'.layout > .main',zIndex:20});
    var statusSelect = ERPComponents.createFloatingSelect({ el: document.getElementById('apStatus'), placeholder:'请选择', searchable:false, options:selectOptions(['启用','停用']) });
    var typeSelect = ERPComponents.createFloatingSelect({ el: document.getElementById('apType'), placeholder:'请选择', searchable:false, options:selectOptions(typeNames) });
    var filters = {status:'',priority:'',name:'',type:''};
    var page = 1, size = 100, sortKey = '', sortDirection = 1;
    var operationLog = ERPComponents.createOperationLog({ title:'操作日志', operationAttributes:['创建','编辑','复制','启用','停用'], operators:selectOptions(people) });
    function filtered() {
      var rules = readRules().filter(function (rule) {
        return (!filters.status || (filters.status === '启用') === Boolean(rule.enabled)) && (!filters.priority || String(rule.priority).includes(filters.priority)) && (!filters.name || String(rule.name).toLowerCase().includes(filters.name.toLowerCase())) && (!filters.type || rule.type === filters.type);
      });
      if (sortKey) rules.sort(function (a,b) { var left = a[sortKey], right = b[sortKey]; return (sortKey === 'priority' ? Number(left) - Number(right) : String(left).localeCompare(String(right))) * sortDirection; });
      return rules;
    }
    function render() {
      var rows = filtered(), pages = Math.max(1, Math.ceil(rows.length / size)); page = Math.min(page, pages);
      var visible = rows.slice((page - 1) * size, page * size);
      document.getElementById('apTableBody').innerHTML = visible.length ? visible.map(function (rule) {
        return '<tr><td>' + escapeHtml(rule.priority) + '</td><td><a href="#" data-action="edit" data-id="' + rule.id + '">' + escapeHtml(rule.name) + '</a></td><td><span class="ap-badge' + (rule.enabled ? ' on' : '') + '">' + (rule.enabled ? '启用' : '停用') + '</span></td><td>' + escapeHtml(rule.type) + '</td><td>' + escapeHtml(rule.note) + '</td><td>' + escapeHtml(rule.creator) + '</td><td>' + escapeHtml(rule.createdAt) + '</td><td><div class="ap-ops"><button class="ap-link" data-action="edit" data-id="' + rule.id + '">编辑</button><button class="ap-link" data-action="copy" data-id="' + rule.id + '">复制</button><button class="ap-link" data-action="log" data-id="' + rule.id + '">日志</button><button class="ap-link" data-action="toggle" data-id="' + rule.id + '">' + (rule.enabled ? '停用' : '启用') + '</button><button class="ap-link ap-danger" data-action="delete" data-id="' + rule.id + '">删除</button></div></td></tr>';
      }).join('') : '<tr><td class="ap-empty" colspan="8">暂无数据</td></tr>';
      var pageButtons = ''; for (var p = Math.max(1, page - 2); p <= Math.min(pages, page + 2); p += 1) pageButtons += '<button type="button" class="' + (p === page ? 'active' : '') + '" data-page="' + p + '">' + p + '</button>';
      pager.innerHTML = '<span>共 ' + rows.length + ' 条</span><button type="button" data-page="prev"' + (page <= 1 ? ' disabled' : '') + '>‹</button>' + pageButtons + '<button type="button" data-page="next"' + (page >= pages ? ' disabled' : '') + '>›</button><select aria-label="每页条数" id="apPageSize">' + [10,20,50,100,200].map(function (n) { return '<option value="' + n + '"' + (n === size ? ' selected' : '') + '>' + n + '条/页</option>'; }).join('') + '</select>';
    }
    app.addEventListener('click', function (event) {
      var target = event.target.closest('[data-action],[data-sort]'); if (!target) return; event.preventDefault();
      if (target.dataset.sort) { if (sortKey === target.dataset.sort) sortDirection *= -1; else { sortKey = target.dataset.sort; sortDirection = 1; } render(); return; }
      var action = target.dataset.action, id = Number(target.dataset.id);
      if (action === 'add') return go('仓库审批新增.html');
      if (action === 'reset') { statusSelect.setValue(''); typeSelect.setValue(''); document.getElementById('apPriority').value = ''; document.getElementById('apName').value = ''; filters = {status:'',priority:'',name:'',type:''}; page = 1; render(); return; }
      if (action === 'query') { filters = {status:statusSelect.getValue(),priority:document.getElementById('apPriority').value.trim(),name:document.getElementById('apName').value.trim(),type:typeSelect.getValue()}; page = 1; render(); return; }
      var rules = readRules(), rule = rules.find(function (item) { return item.id === id; }); if (!rule) return;
      if (action === 'edit') return go('仓库审批编辑.html', 'id=' + id);
      if (action === 'copy') return go('仓库审批新增.html', 'copy=' + id);
      if (action === 'log') return operationLog.open(rule.logs || []);
      if (action === 'toggle') { rule.enabled = !rule.enabled; addLog(rule,rule.enabled ? '启用' : '停用', (rule.enabled ? '启用' : '停用') + '审批规则'); saveRules(rules); render(); return; }
      if (action === 'delete' && confirm('确定删除规则“' + rule.name + '”吗？')) { saveRules(rules.filter(function (item) { return item.id !== id; })); render(); message('规则已删除'); }
    });
    pager.addEventListener('click', function (event) { var target = event.target.closest('[data-page]'); if (!target) return; var value = target.dataset.page; page = value === 'prev' ? page - 1 : value === 'next' ? page + 1 : Number(value); render(); });
    pager.addEventListener('change', function (event) { if (event.target.id === 'apPageSize') { size = Number(event.target.value); page = 1; render(); } });
    render();
  }

  function initForm() {
    var rules = readRules();
    var id = Number(params.get('id')), copyId = Number(params.get('copy'));
    var original = rules.find(function (item) { return item.id === (view === 'edit' ? id : copyId); });
    if (view === 'edit' && !original) { go('仓库审批设置.html'); return; }
    var data = original ? JSON.parse(JSON.stringify(original)) : { name:'',priority:'',type:'',note:'',matchAll:false,creatorEnabled:false,creatorValue:'',warehouseEnabled:false,outbound:'',inbound:'',productEnabled:false,productValue:'',nodes:[{mode:'会签',approver:''}] };
    if (view === 'add' && original) data.name += '-复制';
    app.innerHTML = '<section class="ap-card ap-form-card">' +
      '<div class="ap-section-head"><span>规则信息</span><span>⌄</span></div>' +
      '<div class="ap-form-grid"><div class="ap-field"><label for="apRuleName"><span class="ap-required">*</span>规则名称</label><input class="ap-input" id="apRuleName" placeholder="请输入" value="' + escapeHtml(data.name) + '"' + (view === 'edit' ? ' disabled' : '') + '></div>' +
      '<div class="ap-field"><label for="apRulePriority"><span class="ap-required">*</span>优先级</label><input type="number" min="1" step="1" class="ap-input" id="apRulePriority" placeholder="请输入" value="' + escapeHtml(data.priority) + '"></div>' +
      '<div class="ap-field"><label for="apRuleType"><span class="ap-required">*</span>类型</label><select class="ap-select" id="apRuleType">' + optionHtml(typeNames,data.type) + '</select></div>' +
      '<div class="ap-field"><label><span class="ap-required">*</span>满足全部条件 ⓘ</label><div class="ap-radio-line"><label><input type="radio" name="matchAll" value="yes"' + (data.matchAll ? ' checked' : '') + '>是</label><label><input type="radio" name="matchAll" value="no"' + (!data.matchAll ? ' checked' : '') + '>否</label></div></div>' +
      '<div class="ap-field ap-note"><label for="apRuleNote">备注</label><input class="ap-input" id="apRuleNote" placeholder="请输入" value="' + escapeHtml(data.note) + '"></div></div>' +
      '<div class="ap-section-head"><span>条件设置</span><span>⌄</span></div>' +
      '<div class="ap-conditions"><div class="ap-condition"><label><input type="checkbox" id="apCreatorEnabled"' + (data.creatorEnabled ? ' checked' : '') + '>指定创建人</label><div class="ap-condition-content"><select class="ap-select" id="apCreatorValue">' + optionHtml(people,data.creatorValue) + '</select></div></div>' +
      '<div class="ap-condition"><label><input type="checkbox" id="apWarehouseEnabled"' + (data.warehouseEnabled ? ' checked' : '') + '>指定仓库</label><div class="ap-condition-content ap-warehouse-grid" id="apWarehouseFields"><div><label for="apOutbound">出库仓</label><select class="ap-select" id="apOutbound">' + optionHtml(warehouses,data.outbound) + '</select></div><div><label for="apInbound">入库仓</label><select class="ap-select" id="apInbound">' + optionHtml(warehouses,data.inbound) + '</select></div></div></div>' +
      '<div class="ap-condition"><label><input type="checkbox" id="apProductEnabled"' + (data.productEnabled ? ' checked' : '') + '>指定商品</label><div class="ap-condition-content ap-product-inline"><select class="ap-select" id="apProductKind"><option>SKU</option><option>SPU</option></select><button type="button" class="ap-btn tiny" id="apProductEdit">编辑</button><span id="apProductText" style="margin-left:8px;color:#909399">' + escapeHtml(data.productValue) + '</span></div></div></div>' +
      '<div class="ap-section-head"><span>审批节点 ⓘ</span><button type="button" class="ap-btn tiny" data-action="add-node">增加节点</button></div><div class="ap-node-area" id="apNodes"></div></section>' +
      '<div class="ap-form-footer"><button type="button" class="ap-btn" data-action="cancel">取消</button><button type="button" class="ap-btn primary" data-action="save">保存</button></div>';
    function syncConditions() {
      document.getElementById('apCreatorValue').disabled = !document.getElementById('apCreatorEnabled').checked;
      var enabled = document.getElementById('apWarehouseEnabled').checked;
      document.querySelector('.ap-conditions').classList.toggle('ap-warehouse-active', enabled);
      document.getElementById('apWarehouseFields').style.display = enabled ? 'grid' : 'block';
      if (!enabled) document.getElementById('apWarehouseFields').innerHTML = '<select class="ap-select" disabled><option>请选择</option></select>';
      else if (!document.getElementById('apOutbound')) {
        document.getElementById('apWarehouseFields').innerHTML = '<div><label for="apOutbound">出库仓</label><select class="ap-select" id="apOutbound">' + optionHtml(warehouses,data.outbound) + '</select></div><div><label for="apInbound">入库仓</label><select class="ap-select" id="apInbound">' + optionHtml(warehouses,data.inbound) + '</select></div>';
      }
      document.getElementById('apProductKind').disabled = document.getElementById('apProductEdit').disabled = !document.getElementById('apProductEnabled').checked;
    }
    function nodeHtml(node,index) {
      return '<div class="ap-node" data-node-index="' + index + '"><div class="ap-node-head"><span>审批节点' + (index + 1) + '</span><button type="button" class="ap-link ap-danger" data-action="delete-node" data-index="' + index + '">删除</button></div><div class="ap-node-body"><div class="ap-field"><label>审批类型</label><select class="ap-select" data-node-mode>' + optionHtml(['会签','或签','依次审批'],node.mode,'请选择') + '</select></div><div class="ap-field"><select class="ap-select" data-node-approver aria-label="审批人">' + optionHtml(people,node.approver) + '</select></div></div></div>';
    }
    function renderNodes() { document.getElementById('apNodes').innerHTML = data.nodes.map(nodeHtml).join(''); }
    function captureNodes() { data.nodes = Array.from(document.querySelectorAll('.ap-node')).map(function (node) { return {mode:node.querySelector('[data-node-mode]').value,approver:node.querySelector('[data-node-approver]').value}; }); }
    document.querySelectorAll('#apCreatorEnabled,#apWarehouseEnabled,#apProductEnabled').forEach(function (checkbox) { checkbox.addEventListener('change', function () { if (document.getElementById('apOutbound')) { data.outbound = document.getElementById('apOutbound').value; data.inbound = document.getElementById('apInbound').value; } syncConditions(); }); });
    document.getElementById('apProductEdit').addEventListener('click', function () { var value = prompt('输入商品SKU（多个商品可用逗号分隔）',data.productValue || ''); if (value !== null) { data.productValue = value.trim(); document.getElementById('apProductText').textContent = data.productValue; } });
    app.addEventListener('click', function (event) {
      var target = event.target.closest('[data-action]'); if (!target) return;
      var action = target.dataset.action;
      if (action === 'cancel') return go('仓库审批设置.html');
      if (action === 'add-node') { captureNodes(); data.nodes.push({mode:'会签',approver:''}); renderNodes(); return; }
      if (action === 'delete-node') { if (data.nodes.length <= 1) { message('至少保留一个审批节点',true); return; } captureNodes(); data.nodes.splice(Number(target.dataset.index),1); renderNodes(); return; }
      if (action === 'save') {
        var name = document.getElementById('apRuleName').value.trim(), priority = Number(document.getElementById('apRulePriority').value), type = document.getElementById('apRuleType').value;
        if (!name || !Number.isInteger(priority) || priority < 1 || !type) { message('请填写规则名称、有效优先级和类型',true); return; }
        captureNodes(); if (!data.nodes.length || data.nodes.some(function (node) { return !node.approver; })) { message('请选择审批节点的审批人',true); return; }
        data.name = name; data.priority = priority; data.type = type; data.note = document.getElementById('apRuleNote').value.trim(); data.matchAll = document.querySelector('input[name="matchAll"]:checked').value === 'yes';
        data.creatorEnabled = document.getElementById('apCreatorEnabled').checked; data.creatorValue = data.creatorEnabled ? document.getElementById('apCreatorValue').value : '';
        data.warehouseEnabled = document.getElementById('apWarehouseEnabled').checked; data.outbound = data.warehouseEnabled ? document.getElementById('apOutbound').value : ''; data.inbound = data.warehouseEnabled ? document.getElementById('apInbound').value : '';
        data.productEnabled = document.getElementById('apProductEnabled').checked; data.productValue = data.productEnabled ? data.productValue : '';
        if (view === 'edit') { var index = rules.findIndex(function (item) { return item.id === id; }); data.id = id; addLog(data,'编辑','修改审批规则'); rules[index] = data; }
        else { data.id = Math.max(0, ...rules.map(function (rule) { return rule.id; })) + 1; data.enabled = false; data.creator = 'XWD'; data.createdAt = now(); data.logs = []; addLog(data,copyId ? '复制' : '创建',copyId ? '复制审批规则' : '创建审批规则'); rules.unshift(data); }
        saveRules(rules); go('仓库审批设置.html');
      }
    });
    renderNodes(); syncConditions();
  }
})();
