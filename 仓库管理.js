(function () {
  'use strict';
  const root = document.getElementById('warehouseApp');
  if (!root) return;
  const view = document.body.dataset.view || 'warehouse-list';
  const params = new URLSearchParams(location.search);
  const storeKey = 'erp-warehouse-management-v1';
  const seed = { warehouses: [
    { id:'w1', name:'smile', code:'sm1', group:'中堂仓', province:'', city:'', district:'', address:'', postal:'', contact:'', phone:'', mobile:'', note:'默认仓库19823081290381903810923801238', singleLimit:'1', multiLimit:'0', enabled:true, isDefault:true, shelves:[
      {id:'s1',code:'gm1',name:'gm1',prefix:'gm1-',cols:3,levels:1,linker:'-',enabled:true,stock:1,positions:[{id:'p1',code:'gm1-01-01',col:1,level:1},{id:'p2',code:'gm1-02-01',col:2,level:1},{id:'p3',code:'gm1-03-01',col:3,level:1}]}
    ] },
    { id:'w2', name:'waq-仓库01', code:'waq01', group:'', province:'', city:'', district:'', address:'', postal:'', contact:'', phone:'', mobile:'', note:'', singleLimit:'', multiLimit:'', enabled:true, shelves:[
      {id:'s2',code:'W01',name:'W01',prefix:'W01-',cols:5,levels:5,linker:'-',enabled:true,stock:0,positions:Array.from({length:25},(_,i)=>({id:'w01-p'+i,code:'W01-'+String(Math.floor(i/5)+1).padStart(2,'0')+'-'+String(i%5+1).padStart(2,'0'),col:Math.floor(i/5)+1,level:i%5+1}))}
    ] },
    { id:'w3', name:'云县中心仓', code:'YXZX', group:'', province:'', city:'', district:'', address:'', postal:'', contact:'', phone:'', mobile:'', note:'', singleLimit:'', multiLimit:'', enabled:true, shelves:[] }
  ]};
  let data;
  try { data = JSON.parse(localStorage.getItem(storeKey)) || structuredClone(seed); } catch (_) { data = structuredClone(seed); }
  if (!Array.isArray(data.warehouses)) data = structuredClone(seed);
  if (!data.warehouses.some(w=>w.isDefault) && data.warehouses.length) data.warehouses[0].isDefault=true;
  const sampleWarehouse=data.warehouses.find(w=>w.id==='w2');
  if(sampleWarehouse && !data.sampleShelfMigrated) {
    sampleWarehouse.shelves=sampleWarehouse.shelves||[];
    if(!sampleWarehouse.shelves.some(s=>s.code==='W01'))sampleWarehouse.shelves.push(structuredClone(seed.warehouses[1].shelves[0]));
    data.sampleShelfMigrated=true;
    try { localStorage.setItem(storeKey, JSON.stringify(data)); } catch (_) {}
  }
  let state = { edit:false, tab:'shelves', positionTab:'list', search:'', selection:new Set(), shelfSelection:new Set() };
  const id = params.get('id') || 'w1';
  const warehouseId = params.get('warehouse') || 'w1';
  function warehouse() { return data.warehouses.find(w => w.id === (view.startsWith('shelf-') ? warehouseId : id)) || data.warehouses[0]; }
  function shelf() { const w = warehouse(); return w && (w.shelves || []).find(s => s.id === id) || (w && w.shelves || [])[0]; }
  function save() { try { localStorage.setItem(storeKey, JSON.stringify(data)); } catch (_) {} }
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function href(file, query) { return file + (query ? '?' + new URLSearchParams(query) : ''); }
  function go(file, query) { location.href = href(file, query); }
  function toast(message, error) { const box=document.getElementById('toastWrap'); if(!box) return; const el=document.createElement('div'); el.className='wm-toast'+(error?' error':''); el.textContent=message; box.appendChild(el); setTimeout(()=>el.remove(),2400); }
  function button(label, action, cls, extra) { return '<button type="button" class="wm-btn '+(cls||'')+'" data-action="'+action+'" '+(extra||'')+'>'+label+'</button>'; }
  function head(title, right, subtitle) { return '<div class="wm-section-head"><span class="wm-heading">'+title+(subtitle?'<small>'+subtitle+'</small>':'')+'</span>'+(right||'<span class="wm-chevron">⌄</span>')+'</div>'; }
  function page(html) { root.innerHTML='<div class="wm-page">'+html+'</div>'; }
  function field(key, label, value, options) {
    options=options||{}; const disabled=options.disabled?' disabled':'';
    const required=options.required?'<span class="wm-req">*</span>':'';
    let control;
    if(options.select){ control='<select class="wm-select" data-field="'+key+'"'+disabled+'><option value="">请选择</option>'+options.select.map(x=>'<option value="'+esc(x)+'"'+(String(value||'')===String(x)?' selected':'')+'>'+esc(x)+'</option>').join('')+'</select>'; }
    else control='<input class="wm-input" data-field="'+key+'" value="'+esc(value)+'" placeholder="请输入"'+disabled+(options.type?' type="'+options.type+'"':'')+'>';
    if(options.unit) control='<div class="wm-unit">'+control+'<span>'+options.unit+'</span></div>';
    return '<div class="wm-field"><label>'+required+label+'</label>'+control+'</div>';
  }
  function warehouseFields(w, disabled) {
    const f=(k,l,o)=>field(k,l,w[k],Object.assign({disabled},o||{}));
    return '<div class="wm-form-grid">'+
      f('name','仓库名称',{required:true})+f('code','仓库编码',{required:true})+
      f('group','仓库分组',{select:['中堂仓','其他仓']})+f('province','省')+
      f('city','市')+f('district','区')+
      f('address','街道地址')+f('postal','邮编')+
      f('contact','联系人')+f('phone','联系电话')+
      f('mobile','手机')+f('note','仓库备注')+
      f('singleLimit','单品订单可发货上限',{unit:'单',type:'number'})+f('multiLimit','多品订单可发货上限',{unit:'单',type:'number'})+'</div>';
  }
  function values(keys) { const result={}; keys.forEach(k=>{const el=root.querySelector('[data-field="'+k+'"]');result[k]=el?el.value.trim():'';});return result; }
  const warehouseKeys=['name','code','group','province','city','district','address','postal','contact','phone','mobile','note','singleLimit','multiLimit'];
  function listPage() {
    const matching=data.warehouses.filter(w=>!state.search || [w.name,w.code,w.group].some(v=>String(v||'').toLowerCase().includes(state.search.toLowerCase())));
    page('<section class="wm-card">'+head('仓库列表')+'<div class="wm-list-filters">'+field('filter-name','仓库名称 / 编码',state.search)+field('filter-group','仓库分组','',{select:['中堂仓','其他仓']})+'</div><div class="wm-right">'+button('重置','reset-list')+button('查询','search-list','wm-btn--primary')+'</div></section>'+
      '<section class="wm-card"><div class="wm-toolbar">'+button('新增仓库','add-warehouse','wm-btn--primary')+'<span class="wm-spacer"></span>'+button('导出','export-warehouses')+'</div><div class="wm-table-wrap"><table class="wm-table"><colgroup><col style="width:42px"><col style="width:65px"><col><col><col><col style="width:100px"><col style="width:230px"></colgroup><thead><tr><th class="wm-center"><input type="checkbox" class="wm-check" data-select-all="warehouse"></th><th class="wm-center">序号</th><th>仓库名称</th><th>仓库编码</th><th>仓库分组</th><th>状态</th><th>操作</th></tr></thead><tbody>'+matching.map((w,i)=>'<tr><td class="wm-center"><input class="wm-check" type="checkbox" data-select="warehouse" value="'+esc(w.id)+'"></td><td class="wm-center">'+(i+1)+'</td><td><a href="'+href('仓库详情.html',{id:w.id})+'">'+esc(w.name)+'</a>'+(w.isDefault?' <span class="wm-default-tag">默认仓库</span>':'')+'</td><td>'+esc(w.code)+'</td><td>'+esc(w.group||'--')+'</td><td><span class="wm-status'+(w.enabled?'':' off')+'">'+(w.enabled?'启用':'停用')+'</span></td><td><div class="wm-actions"><a href="'+href('仓库详情.html',{id:w.id})+'">详情</a><a data-action="toggle-warehouse" data-id="'+w.id+'">'+(w.enabled?'停用':'启用')+'</a>'+(w.isDefault?'<span class="wm-muted">默认仓库</span>':'<a data-action="set-default-warehouse" data-id="'+w.id+'">设为默认仓库</a>')+'</div></td></tr>').join('')+'</tbody></table>'+(matching.length?'':'<div class="wm-empty"><span class="wm-empty-icon">▱</span>暂无数据</div>')+'</div><div class="wm-pager">共 '+matching.length+' 条 <span class="wm-page-no">1</span> 100 条/页</div></section>');
  }
  function warehousePage(add) {
    const w=add?{name:'',code:'',group:'',province:'',city:'',district:'',address:'',postal:'',contact:'',phone:'',mobile:'',note:'',singleLimit:'',multiLimit:''}:warehouse();
    if(!w){page('<section class="wm-card">仓库不存在</section>');return;}
    const editing=add||state.edit||params.get('edit')==='1';
    const right=add?'':button(w.enabled?'停用':'启用','toggle-warehouse','wm-btn--small','data-id="'+esc(w.id)+'"')+(w.isDefault?'<span class="wm-default-tag">默认仓库</span>':button('设为默认仓库','set-default-warehouse','wm-btn--primary wm-btn--small','data-id="'+esc(w.id)+'"'))+'<span class="wm-chevron">⌄</span>';
    let html='<section class="wm-card">'+head('基本信息',right)+warehouseFields(w,!editing)+'</section>';
    if(add) html+='<div class="wm-footer">'+button('取消','cancel-warehouse')+button('保存','save-warehouse','wm-btn--primary')+'</div>';
    else {
      if(editing)html+='<div class="wm-footer"><span class="wm-hint">ⓘ 正在编辑基本信息，修改后请保存</span>'+button('取消','cancel-warehouse')+button('保存','save-warehouse','wm-btn--primary')+'</div>';
      html+=shelfSection(w);
    }
    page(html);
  }
  function shelfSection(w) {
    const shelves=(w.shelves||[]).filter(s=>!state.search || [s.code,s.name].some(v=>String(v||'').toLowerCase().includes(state.search.toLowerCase())));
    return '<section class="wm-card">'+head('货架设置',null,'货架相关操作独立处理，操作成功后立即生效')+
      '<div class="wm-tabs"><button class="wm-tab'+(state.tab==='shelves'?' active':'')+'" data-action="tab-shelves">货架管理</button><button class="wm-tab'+(state.tab==='logs'?' active':'')+'" data-action="tab-logs">操作日志</button></div>'+
      (state.tab==='logs'?'<div class="wm-table-wrap"><table class="wm-table"><thead><tr><th>操作类型</th><th>操作内容</th><th>操作人</th><th>操作时间</th></tr></thead><tbody><tr><td>创建仓库</td><td>'+esc(w.name)+'</td><td>XWD</td><td>2026-09-19 10:00:00</td></tr></tbody></table></div>':
      '<div class="wm-toolbar"><input class="wm-search" data-field="shelf-search" placeholder="输入货架编号/货架名称进行搜索" value="'+esc(state.search)+'"><button class="wm-btn wm-btn--small" data-action="search-shelves">⌕</button><span class="wm-spacer"></span>'+button('导出','export-shelves')+button('打印设置','print-settings','wm-btn--link')+button('批量删除','delete-shelves')+button('新增货架','add-shelf','wm-btn--primary')+'</div>'+
      '<div class="wm-table-wrap"><table class="wm-table"><colgroup><col style="width:50px"><col style="width:65px"><col><col><col><col style="width:105px"><col style="width:105px"><col style="width:105px"><col style="width:105px"><col style="width:90px"><col style="width:265px"></colgroup><thead><tr><th class="wm-center"><input type="checkbox" class="wm-check" data-select-all="shelf"></th><th class="wm-center">序号</th><th>货架编号</th><th>货架名称</th><th>仓位前缀</th><th>库存总量</th><th>列数</th><th>层数</th><th>仓位数</th><th>状态</th><th>操作</th></tr></thead><tbody>'+shelves.map((s,i)=>'<tr><td class="wm-center"><input type="checkbox" class="wm-check" data-select="shelf" value="'+esc(s.id)+'"></td><td class="wm-center">'+(i+1)+'</td><td><a href="'+href('货架详情.html',{id:s.id,warehouse:w.id})+'">'+esc(s.code)+'</a></td><td>'+esc(s.name)+'</td><td>'+esc(s.prefix)+'</td><td>'+esc(s.stock||0)+'</td><td>'+esc(s.cols)+'</td><td>'+esc(s.levels)+'</td><td>'+esc((s.positions||[]).length)+'</td><td><span class="wm-status'+(s.enabled?'':' off')+'">'+(s.enabled?'启用':'停用')+'</span></td><td><div class="wm-actions"><a href="'+href('货架详情.html',{id:s.id,warehouse:w.id})+'">详情</a><a data-action="position-query" data-id="'+s.id+'">空间仓位查询</a><a data-action="print-position" data-id="'+s.id+'">打印仓位条码</a><a data-action="toggle-shelf" data-id="'+s.id+'">'+(s.enabled?'停用':'启用')+'</a><a class="wm-btn--danger" data-action="delete-shelf" data-id="'+s.id+'">删除</a></div></td></tr>').join('')+'</tbody></table>'+(shelves.length?'':'<div class="wm-empty"><span class="wm-empty-icon">▱</span>暂无数据</div>')+'</div><div class="wm-pager">共 '+shelves.length+' 条 <span class="wm-page-no">1</span> 100 条/页</div>')+'</section>';
  }
  function shelfFields(s, disabled, w) {
    const f=(k,l,o)=>field(k,l,s[k],Object.assign({disabled},o||{}));
    return '<div class="wm-form-grid wm-form-grid--shelf">'+f('code','货架编号',{required:true})+f('name','货架名称',{required:true})+f('prefix','仓位前缀',{required:true})+field('warehouse','所属仓库',w.name,{disabled:true})+'</div>';
  }
  function specFields(s, disabled) {
    return '<div class="wm-specs"><div><div class="wm-subtitle">货架规格 ⓘ '+(disabled?'<a class="wm-btn--link" style="margin-left:30px" data-action="edit-specs">✎ 编辑</a>':'')+'</div><div class="wm-spec-line"><label>列:</label><input class="wm-input" data-field="cols" type="number" min="1" value="'+esc(s.cols||1)+'"'+(disabled?' disabled':'')+'><label>连接符:</label><input class="wm-input" data-field="linker" value="'+esc(s.linker||'-')+'"'+(disabled?' disabled':'')+'><label>层:</label><input class="wm-input" data-field="levels" type="number" min="1" value="'+esc(s.levels||1)+'"'+(disabled?' disabled':'')+'></div></div><div><div class="wm-subtitle">仓位数量 ⓘ</div><div class="wm-spec-count"><span id="positionCount">'+(view==='shelf-add'&&!s.positions.length?(Number(s.cols)||1)*(Number(s.levels)||1):(s.positions||[]).length)+'</span>'+button('批量生成仓位','generate-positions','wm-btn--primary wm-btn--small')+'</div></div></div>';
  }
  function planMarkup(s) {
    const positions=s.positions||[];
    if(!positions.length)return '<div class="wm-plan-empty">暂无数据</div>';
    const cols=Math.max(1,Math.min(100,Number(s.cols)||1));
    const levels=Math.max(1,Math.min(100,Number(s.levels)||1));
    let cells='';
    for(let level=levels;level>=1;level--)for(let col=1;col<=cols;col++){
      const p=positions.find(x=>Number(x.col)===col&&Number(x.level)===level);
      cells+='<div class="wm-plan-slot">'+(p?'<button type="button" class="wm-plan-pill" data-action="rename-position" data-id="'+esc(p.id)+'" title="编辑仓位 '+esc(p.code)+'">'+esc(p.code)+'</button>':'')+'</div>';
    }
    return '<div class="wm-plan-scroll"><div class="wm-plan-grid" style="grid-template-columns:repeat('+cols+',minmax(140px,1fr));min-width:'+Math.max(0,cols*145)+'px">'+cells+'</div></div>';
  }
  function positionsSection(s, add) {
    let positions=s.positions||[];
    return '<section class="wm-card">'+head('仓位管理',null,add?'':'仓位相关操作独立处理，操作成功后立即生效')+(add?'':specFields(s,view==='shelf-detail'))+
      '<div class="wm-tabs"><button class="wm-tab'+(state.positionTab==='list'?' active':'')+'" data-action="tab-positions">仓位列表</button><button class="wm-tab'+(state.positionTab==='plan'?' active':'')+'" data-action="tab-plan">平面图</button></div>'+
      (state.positionTab==='plan'?planMarkup(s):
      '<div class="wm-toolbar"><span class="wm-spacer"></span>'+(add?'':button('打印设置','print-settings','wm-btn--link')+button('打印仓位条码','print-positions')+button('仓位使用情况','position-usage')+button('导出仓位','export-positions')+button('批量删除仓位','delete-positions')+button('更新自定义仓位','update-positions'))+button('新增仓位','add-position')+'</div><div class="wm-table-wrap"><table class="wm-table"><colgroup><col style="width:42px"><col><col><col><col></colgroup><thead><tr><th class="wm-center"><input type="checkbox" class="wm-check" data-select-all="position"></th><th>仓位编号</th><th>所属列</th><th>所属层</th><th>操作</th></tr></thead><tbody>'+positions.map(p=>'<tr><td class="wm-center"><input type="checkbox" class="wm-check" data-select="position" value="'+esc(p.id)+'"></td><td>'+esc(p.code)+' <a data-action="rename-position" data-id="'+p.id+'">✎</a></td><td>'+esc(p.col)+'</td><td>'+esc(p.level)+'</td><td><a class="wm-btn--danger" data-action="delete-position" data-id="'+p.id+'">删除</a></td></tr>').join('')+'</tbody></table>'+(positions.length?'':'<div class="wm-empty"><span class="wm-empty-icon">▱</span>暂无数据</div>')+'</div><div class="wm-pager">共 '+positions.length+' 条 <span class="wm-page-no">1</span> 100 条/页</div>')+'</section>';
  }
  function shelfPage(mode) {
    const w=warehouse(); if(!w){page('<section class="wm-card">仓库不存在</section>');return;}
    const add=mode==='add'; const s=add?(state.draftShelf||{id:'',code:'',name:'',prefix:'',cols:1,levels:1,linker:'-',positions:[],enabled:true,stock:0}):shelf();
    if(!s){page('<section class="wm-card">货架不存在</section>');return;}
    const editing=add||mode==='edit';
    let html='<section class="wm-card">'+head('基本信息',editing?'':button('编辑','edit-shelf','wm-btn--primary wm-btn--small')+'<span class="wm-chevron">⌄</span>')+shelfFields(s,!editing,w)+(add?specFields(s,false):'')+'</section>';
    if(mode==='edit')html+='<div class="wm-footer"><span class="wm-hint">ⓘ 正在编辑基本信息，修改后请保存</span>'+button('取消','cancel-shelf')+button('保存','save-shelf','wm-btn--primary')+'</div>';
    html+=positionsSection(s,add);
    if(add)html+='<div class="wm-footer">'+button('取消','cancel-shelf')+button('保存','save-shelf','wm-btn--primary')+'</div>';
    page(html);
  }
  function render() { if(view==='shelf-add'&&root.querySelector('[data-field="code"]')){const v=values(['code','name','prefix','cols','levels','linker']);Object.assign(state.draftShelf,v);} if(view==='warehouse-list')listPage(); else if(view==='warehouse-add')warehousePage(true); else if(view==='warehouse-detail')warehousePage(false); else shelfPage(view.slice(6)); }
  function updateShelfFields(s) { const v=values(['code','name','prefix','cols','levels','linker']); if(!v.code||!v.name||!v.prefix){toast('请填写货架编号、名称和仓位前缀',true);return false;} if((warehouse().shelves||[]).some(x=>x.id!==s.id&&x.code===v.code)){toast('货架编号已存在',true);return false;} Object.assign(s,v,{cols:Math.max(1,Number(v.cols)||1),levels:Math.max(1,Number(v.levels)||1),linker:v.linker||'-'});return true; }
  function currentShelf() { return view==='shelf-add'?state.draftShelf:shelf(); }
  function exportCsv(filename, headers, rows) { const csv=[headers,...rows].map(row=>row.map(x=>'"'+String(x==null?'':x).replace(/"/g,'""')+'"').join(',')).join('\r\n'); const blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}); const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000); }
  function closeModal() { const old=document.querySelector('.wm-modal-backdrop');if(old)old.remove(); }
  function openModal(kind, position) {
    closeModal();
    const s=currentShelf();
    const isSpecs=kind==='specs';
    const title=isSpecs?'编辑货架规格':(position?'编辑仓位':'新增仓位');
    const content=isSpecs?'<label class="wm-modal-label">货架规格 ⓘ</label><div class="wm-spec-line"><label>列:</label><input class="wm-input" data-modal-field="cols" type="number" min="1" value="'+esc(s.cols||1)+'"><label>连接符:</label><input class="wm-input" data-modal-field="linker" value="'+esc(s.linker||'-')+'"><label>层:</label><input class="wm-input" data-modal-field="levels" type="number" min="1" value="'+esc(s.levels||1)+'"></div>':
      '<label class="wm-modal-label"><span class="wm-req">*</span>仓位编号</label><div class="wm-modal-field"><input class="wm-input" data-modal-field="position-code" value="'+esc(position?position.code:(s.prefix||''))+'" placeholder="请输入"><button type="button" class="wm-modal-clear" data-modal-action="clear" aria-label="清空">×</button></div>';
    const overlay=document.createElement('div');overlay.className='wm-modal-backdrop';overlay.innerHTML='<div class="wm-modal" role="dialog" aria-modal="true" aria-label="'+title+'"><div class="wm-modal-head"><span>'+title+'</span><button type="button" class="wm-modal-close" data-modal-action="close" aria-label="关闭">×</button></div>'+content+'<div class="wm-modal-footer">'+button('取消','modal-cancel')+button('确定','modal-save','wm-btn--primary')+'</div></div>';
    document.body.appendChild(overlay);
    const input=overlay.querySelector('input');if(input)input.focus();
    overlay.addEventListener('click',function(e){
      const clicked=e.target.closest('[data-modal-action],[data-action]');
      if(e.target===overlay||clicked&&(['close','modal-cancel'].includes(clicked.dataset.modalAction||clicked.dataset.action))){closeModal();return;}
      if(!clicked)return;
      if(clicked.dataset.modalAction==='clear'){const field=overlay.querySelector('[data-modal-field="position-code"]');field.value='';field.focus();return;}
      if(clicked.dataset.action!=='modal-save')return;
      if(isSpecs){
        const cols=Number(overlay.querySelector('[data-modal-field="cols"]').value);
        const levels=Number(overlay.querySelector('[data-modal-field="levels"]').value);
        const linker=overlay.querySelector('[data-modal-field="linker"]').value;
        if(!Number.isInteger(cols)||cols<1||cols>100||!Number.isInteger(levels)||levels<1||levels>100){toast('列数和层数需为 1–100 的整数',true);return;}
        Object.assign(s,{cols,levels,linker});
      } else {
        const code=overlay.querySelector('[data-modal-field="position-code"]').value.trim();
        if(!code){toast('请填写仓位编号',true);return;}
        if((s.positions||[]).some(p=>p.code===code&&p.id!==(position&&position.id))){toast('仓位编号已存在',true);return;}
        if(position)position.code=code;else{s.positions=s.positions||[];s.positions.push({id:'p'+Date.now(),code,col:1,level:1});}
      }
      if(view!=='shelf-add')save();closeModal();render();
    });
    overlay.addEventListener('keydown',function(e){if(e.key==='Escape'){closeModal();}else if(e.key==='Enter'){e.preventDefault();overlay.querySelector('[data-action="modal-save"]').click();}});
  }
  root.addEventListener('click',function(e){
    const target=e.target.closest('[data-action]'); if(!target)return; const action=target.dataset.action; const w=warehouse(); const s=currentShelf();
    if(target.tagName==='A')e.preventDefault();
    if(action==='add-warehouse')return go('仓库新增.html');
    if(action==='cancel-warehouse')return go(view==='warehouse-add'?'仓库列表.html':'仓库详情.html',view==='warehouse-add'?null:{id:w.id});
    if(action==='save-warehouse'){
      const v=values(warehouseKeys);if(!v.name||!v.code){toast('请填写仓库名称和仓库编码',true);return;}
      if(data.warehouses.some(x=>x.id!==(view==='warehouse-add'?null:w.id)&&x.code===v.code)){toast('仓库编码已存在',true);return;}
      if(view==='warehouse-add'){const nw=Object.assign({id:'w'+Date.now(),enabled:true,shelves:[]},v);data.warehouses.push(nw);save();toast('保存成功');return go('仓库详情.html',{id:nw.id});}
      Object.assign(w,v);save();state.edit=false;return go('仓库详情.html',{id:w.id});
    }
    if(action==='search-list'){state.search=(root.querySelector('[data-field="filter-name"]')||{}).value||'';return render();}
    if(action==='reset-list'){state.search='';return render();}
    if(action==='toggle-warehouse'){const x=data.warehouses.find(y=>y.id===target.dataset.id);if(x){if(x.enabled&&x.isDefault)return toast('默认仓库不能停用，请先设置其他默认仓库',true);x.enabled=!x.enabled;save();render();}return;}
    if(action==='set-default-warehouse'){const x=data.warehouses.find(y=>y.id===target.dataset.id);if(!x)return;if(!x.enabled)return toast('请先启用该仓库',true);data.warehouses.forEach(y=>y.isDefault=y.id===x.id);save();render();toast('已设为默认仓库');return;}
    if(action==='export-warehouses')return exportCsv('仓库列表.csv',['仓库名称','仓库编码','仓库分组','状态'],data.warehouses.map(x=>[x.name,x.code,x.group,x.enabled?'启用':'停用']));
    if(action==='tab-shelves'){state.tab='shelves';return render();}if(action==='tab-logs'){state.tab='logs';return render();}
    if(action==='search-shelves'){state.search=(root.querySelector('[data-field="shelf-search"]')||{}).value||'';return render();}
    if(action==='add-shelf')return go('货架新增.html',{warehouse:w.id});
    if(action==='edit-shelf')return go('货架编辑.html',{warehouse:w.id,id:s.id});
    if(action==='edit-specs')return openModal('specs');
    if(action==='cancel-shelf')return go(view==='shelf-add'?'仓库详情.html':'货架详情.html',view==='shelf-add'?{id:w.id}:{warehouse:w.id,id:s.id});
    if(action==='save-shelf'){
      const x=view==='shelf-add'?state.draftShelf:s;
      if(!updateShelfFields(x))return;
      if(view==='shelf-add'){x.id='s'+Date.now();w.shelves=w.shelves||[];w.shelves.push(x);}
      save();return go('货架详情.html',{warehouse:w.id,id:x.id});
    }
    if(action==='toggle-shelf'){const x=w.shelves.find(y=>y.id===target.dataset.id);if(x){x.enabled=!x.enabled;save();render();}return;}
    if(action==='delete-shelf'){if(!confirm('确定删除该货架？'))return;w.shelves=w.shelves.filter(y=>y.id!==target.dataset.id);save();return render();}
    if(action==='delete-shelves'){const selected=[...root.querySelectorAll('[data-select="shelf"]:checked')].map(x=>x.value);if(!selected.length)return toast('请先选择货架',true);if(!confirm('确定删除选中的货架？'))return;w.shelves=w.shelves.filter(x=>!selected.includes(x.id));save();return render();}
    if(action==='export-shelves')return exportCsv('货架列表.csv',['货架编号','货架名称','仓位前缀','列数','层数','仓位数'],(w.shelves||[]).map(x=>[x.code,x.name,x.prefix,x.cols,x.levels,(x.positions||[]).length]));
    if(action==='position-query')return go('货架详情.html',{warehouse:w.id,id:target.dataset.id});
    if(action==='tab-positions'){state.positionTab='list';return render();}if(action==='tab-plan'){state.positionTab='plan';return render();}
    if(action==='generate-positions'){
      const x=view==='shelf-add'?state.draftShelf:s;const v=values(['code','prefix','cols','levels','linker']);
      const code=v.prefix||x.prefix||v.code+'-';const cols=Math.min(100,Math.max(1,Number(v.cols)||1));const levels=Math.min(100,Math.max(1,Number(v.levels)||1));
      if(cols*levels>1000){toast('最多一次生成 1000 个仓位',true);return;}
      if((x.positions||[]).length&&!confirm('重新生成将覆盖现有仓位，是否继续？'))return;
      x.positions=[];for(let c=1;c<=cols;c++)for(let l=1;l<=levels;l++)x.positions.push({id:'p'+Date.now()+'-'+c+'-'+l,code:code+String(c).padStart(2,'0')+(v.linker||'-')+String(l).padStart(2,'0'),col:c,level:l});
      x.cols=cols;x.levels=levels;x.linker=v.linker||'-';x.prefix=code;const prefixInput=root.querySelector('[data-field="prefix"]');if(prefixInput)prefixInput.value=code;if(view!=='shelf-add')save();render();return;
    }
    if(action==='add-position')return openModal('position');
    if(action==='rename-position'){const p=(s.positions||[]).find(y=>y.id===target.dataset.id);if(p)return openModal('position',p);return;}
    if(action==='delete-position'){const x=view==='shelf-add'?state.draftShelf:s;if(!confirm('确定删除该仓位？'))return;x.positions=x.positions.filter(y=>y.id!==target.dataset.id);if(view!=='shelf-add')save();return render();}
    if(action==='delete-positions'){const x=view==='shelf-add'?state.draftShelf:s;const selected=[...root.querySelectorAll('[data-select="position"]:checked')].map(y=>y.value);if(!selected.length)return toast('请先选择仓位',true);if(!confirm('确定删除选中的仓位？'))return;x.positions=x.positions.filter(y=>!selected.includes(y.id));if(view!=='shelf-add')save();return render();}
    if(action==='export-positions')return exportCsv('仓位列表.csv',['仓位编号','所属列','所属层'],(s.positions||[]).map(x=>[x.code,x.col,x.level]));
    if(action==='print-settings'||action==='print-position'||action==='print-positions')return toast('打印设置已打开，请使用浏览器打印');
    if(action==='position-usage'||action==='update-positions')return toast('可在仓位列表中管理仓位');
  });
  root.addEventListener('change',function(e){if(e.target.matches('[data-select-all]')){root.querySelectorAll('[data-select="'+e.target.dataset.selectAll+'"]').forEach(x=>x.checked=e.target.checked);}});
  state.draftShelf={id:'',code:'',name:'',prefix:'',cols:1,levels:1,linker:'-',positions:[],enabled:true,stock:0};
  render();
})();
