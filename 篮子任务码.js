(function(){
  'use strict';
  const type=document.body.dataset.codePage==='task'?'task':'basket';
  const isTask=type==='task';
  const name=isTask?'任务码':'篮子列表';
  const root=document.getElementById('codePage');
  const modalHost=document.getElementById('codeModalHost');
  const E=window.ERPComponents;
  const storeKey='erp-code-list-'+type+'-v1';
  const basketSeed=[
    ['SXY','发货分拣篮子','smileying123','XWD','2026-08-03 09:35:40'],['47','发货分拣篮子','WSQ','WSQ','2026-07-31 17:21:19'],['AUT','发货分拣篮子','HF','','2026-07-31 15:04:10'],['54','退货分拣篮子','WSQ','','2026-07-21 11:24:36'],['fh','发货分拣篮子','LS','LS','2026-04-14 16:44:10'],['fj','退货分拣篮子','LS','','2026-04-01 17:56:10'],['fj','发货分拣篮子','LS','','2026-03-30 14:52:57'],['SXY','退货分拣篮子','SXY','','2026-03-05 11:10:19'],['3','发货分拣篮子','XWD','','2026-02-08 21:27:54'],['xu','发货分拣篮子','XWD','','2026-01-22 09:25:12'],['clr','发货分拣篮子','HF','','2025-09-11 17:58:21'],['AAA','退货分拣篮子','HF','','2025-08-12 14:48:23'],['AAA','发货分拣篮子','HF','','2025-08-12 14:47:53'],['ddd','发货分拣篮子','HF','','2025-08-12 14:47:11'],['cc','退货分拣篮子','11t','','2025-08-12 14:43:45'],['ypp','发货分拣篮子','Laity','Laity,11t','2025-06-30 11:31:03'],['YCS','发货分拣篮子','YCS','YCS','2025-06-17 14:52:15'],['s','发货分拣篮子','smileying123','','2025-06-14 11:05:35']
  ];
  const taskSeed=[
    ['clfy','配货任务','mysql玲-auto-勿动','2026-09-13 17:06:58'],['wang','上架任务','WSQ','2026-08-20 09:34:49'],['AUTO','配货任务','HF','2026-07-27 15:45:15'],['wsq','配货任务','WSQ','2026-07-20 17:04:24'],['zzy','配货任务','zy','2026-07-08 14:31:03'],['dong','上架任务','smileying123','2026-05-25 11:09:59'],['yz','配货任务','YYT','2026-05-18 11:30:16'],['rkk','上架任务','LS','2026-04-14 17:57:25'],['YCSP','配货任务','YCS','2026-04-07 15:44:37'],['rk','上架任务','LS','2026-04-01 14:23:08'],['ph','配货任务','LS','2026-03-30 14:43:10'],['CD','配货任务','11t','2026-03-25 18:15:07'],['ls','上架任务','LS','2026-03-25 15:25:54'],['ck01','配货任务','LS','2026-03-19 14:13:48'],['SHEN','配货任务','SXY','2026-03-16 02:34:33'],['KOP','上架任务','test006','2026-03-12 17:17:16'],['SXY','上架任务','SXY','2026-03-09 16:42:21'],['ck','配货任务','XWD','2026-01-22 10:27:03']
  ];
  const seed=(isTask?taskSeed:basketSeed).map((entry,i)=>isTask?{id:'t'+i,code:entry[0],category:entry[1],operator:entry[2],time:entry[3]}:{id:'b'+i,code:entry[0],category:entry[1],operator:entry[2],sender:entry[3],time:entry[4]});
  for(let i=seed.length;i<(isTask?104:60);i++){
    const ref=seed[i%seed.length];
    seed.push(Object.assign({},ref,{id:(isTask?'t':'b')+i,code:ref.code+(Math.floor(i/18)+1),time:'2025-05-'+String(30-(i%25)).padStart(2,'0')+' 10:00:00'}));
  }
  let rows;
  try{rows=JSON.parse(localStorage.getItem(storeKey))||seed;}catch(_){rows=seed;}
  if(!Array.isArray(rows))rows=seed;
  let page=1,size=100,filtered=rows.slice(),datePicker,typeSelect;
  const escape=v=>E.escapeHtml(v==null?'':String(v));
  function save(){try{localStorage.setItem(storeKey,JSON.stringify(rows));}catch(_){}}
  function toast(message){const el=document.createElement('div');el.className='cc-toast';el.textContent=message;document.body.appendChild(el);setTimeout(()=>el.remove(),2200);}
  function dateMarkup(){return '<div class="cc-time"><div class="cc-time-trigger" id="ccDateTrigger"><span id="ccDateStart">开始日期　　开始时间</span><span class="dash">~</span><span id="ccDateEnd">结束日期　　结束时间</span></div><div class="erp-date-picker hidden" id="ccDatePanel"><div class="date-shortcuts" id="ccDateShortcuts"><button type="button" data-days="0">今天</button><button type="button" data-days="1">昨天</button><button type="button" data-range="7">近7天</button><button type="button" data-range="30">近30天</button><button type="button" data-range="90">近90天</button></div><div class="calendar"><div class="cal-head"><button type="button" class="cal-nav" id="ccPrevYear">≪</button><button type="button" class="cal-nav" id="ccPrevMonth">‹</button><span class="cal-title" id="ccCalTitle"></span><button type="button" class="cal-nav" id="ccNextMonth">›</button><button type="button" class="cal-nav" id="ccNextYear">≫</button></div><div class="cal-grid" id="ccCalGrid"></div></div></div></div>';}
  function skeleton(){
    const filterName=isTask?'任务头':'篮子头';
    const categories=isTask?['配货任务','上架任务']:['发货分拣篮子','退货分拣篮子'];
    root.innerHTML='<div class="cc-page-'+type+'"><section class="cc-card cc-filter"><div class="cc-filter-grid"><div class="cc-field"><label>'+filterName+'</label><input class="cc-input" id="ccFilterCode" placeholder="请输入"></div><div class="cc-field"><label>'+(!isTask?'篮子类型':'任务类型')+'</label><div class="floating-select" id="ccTypeSelect"></div></div><div class="cc-field cc-time"><label>操作时间</label>'+dateMarkup()+'</div><div class="cc-filter-actions"><button class="cc-btn" id="ccReset">重置</button><button class="cc-btn primary" id="ccSearch">查询</button></div></div></section><section class="cc-card cc-table-card"><div class="cc-toolbar"><button class="cc-btn primary" id="ccAdd">新增'+(isTask?'任务头':'篮子')+'</button><button class="cc-btn link" id="ccPrintSettings">▣ 打印设置</button></div><div class="cc-table-wrap"><table class="cc-table">'+(isTask?'<colgroup><col style="width:42px"><col style="width:84px"><col style="width:84px"><col><col style="width:167px"><col style="width:217px"></colgroup><thead><tr><th>序号</th><th>任务头</th><th>任务类型</th><th>操作人</th><th class="cc-center">操作时间</th><th class="cc-center">操作</th></tr></thead>':'<colgroup><col style="width:67px"><col style="width:66px"><col style="width:100px"><col><col><col style="width:167px"><col style="width:217px"></colgroup><thead><tr><th>序号</th><th>篮子头</th><th>篮子类型</th><th>操作人</th><th>发货员</th><th class="cc-center">操作时间</th><th class="cc-center">操作</th></tr></thead>')+'<tbody id="ccBody"></tbody></table></div></section></div>';
    const pager=document.createElement('div');pager.className='cc-pager';pager.id='ccPager';document.body.appendChild(pager);
    E.createStickyTableHeader({table:'.cc-table',wrapper:'.cc-table-wrap',scrollContainer:'.layout > .main',zIndex:20});
    typeSelect=E.createFloatingSelect({el:root.querySelector('#ccTypeSelect'),placeholder:'请选择',searchable:false,options:categories.map(x=>({value:x,label:x}))});
    datePicker=E.createDateRangePicker({trigger:'#ccDateTrigger',panel:'#ccDatePanel',shortcuts:'#ccDateShortcuts',grid:'#ccCalGrid',title:'#ccCalTitle',startText:'#ccDateStart',endText:'#ccDateEnd',prevMonth:'#ccPrevMonth',nextMonth:'#ccNextMonth',prevYear:'#ccPrevYear',nextYear:'#ccNextYear'});
    document.addEventListener('click',e=>{if(!e.target.closest('.cc-time'))datePicker.close();});
  }
  function applyFilter(){const code=root.querySelector('#ccFilterCode').value.trim().toLowerCase();const category=typeSelect.getValue();const start=datePicker.getStart(),end=datePicker.getEnd();filtered=rows.filter(row=>(!code||row.code.toLowerCase().includes(code))&&(!category||row.category===category)&&(!start||new Date(row.time.replace(/-/g,'/')).getTime()>=start)&&(!end||new Date(row.time.replace(/-/g,'/')).getTime()<=end));page=1;renderTable();}
  function renderTable(){
    const totalPages=Math.max(1,Math.ceil(filtered.length/size));page=Math.max(1,Math.min(page,totalPages));
    const visible=filtered.slice((page-1)*size,page*size);
    root.querySelector('#ccBody').innerHTML=visible.length?visible.map((row,i)=>'<tr><td>'+((page-1)*size+i+1)+'</td><td>'+escape(row.code)+'</td><td>'+escape(row.category)+'</td><td>'+escape(row.operator)+'</td>'+(isTask?'':'<td>'+escape(row.sender||'')+' <a class="cc-edit-person" data-action="edit-sender" data-id="'+escape(row.id)+'" title="编辑发货员">✎</a></td>')+'<td class="cc-center">'+escape(row.time)+'</td><td class="cc-actions"><div class="cc-ops"><a data-action="preview" data-id="'+escape(row.id)+'">有效'+(isTask?'任务码':'篮子码')+'</a><a data-action="print" data-id="'+escape(row.id)+'">打印'+(isTask?'任务':'篮子')+'条码</a><a class="cc-delete" data-action="delete" data-id="'+escape(row.id)+'">删除</a></div></td></tr>').join(''):'<tr><td class="cc-empty" colspan="'+(isTask?6:7)+'">暂无数据</td></tr>';
    const pageButtons=[];const left=Math.max(1,page-2),right=Math.min(totalPages,Math.max(page+2,5));for(let p=left;p<=right;p++)pageButtons.push('<button data-page="'+p+'" class="'+(p===page?'active':'')+'">'+p+'</button>');
    document.getElementById('ccPager').innerHTML='<span>共 '+filtered.length+' 条</span><button data-page="'+(page-1)+'"'+(page<=1?' disabled':'')+'>‹</button>'+pageButtons.join('')+(right<totalPages?'<span>…</span><button data-page="'+totalPages+'">'+totalPages+'</button>':'')+'<button data-page="'+(page+1)+'"'+(page>=totalPages?' disabled':'')+'>›</button><select id="ccPageSize"><option value="20"'+(size===20?' selected':'')+'>20 条/页</option><option value="50"'+(size===50?' selected':'')+'>50 条/页</option><option value="100"'+(size===100?' selected':'')+'>100 条/页</option></select><span>跳至</span><input id="ccJump" type="number" min="1" max="'+totalPages+'"><span>页</span>';
  }
  function modal(title,content,confirm){modalHost.innerHTML='<div class="cc-modal-mask"><div class="cc-modal" role="dialog" aria-modal="true"><div class="cc-modal-head"><span>'+title+'</span><button class="cc-modal-close" data-close>×</button></div>'+content+'<div class="cc-modal-foot"><button class="cc-btn" data-close>取消</button><button class="cc-btn primary" id="ccModalConfirm">确定</button></div></div></div>';modalHost.querySelector('#ccModalConfirm').addEventListener('click',confirm);const first=modalHost.querySelector('input');if(first)first.focus();}
  function closeModal(){modalHost.innerHTML='';}
  function addRow(){
    const categories=isTask?['上架任务','配货任务']:['发货分拣篮子','退货分拣篮子'];
    const content='<div class="cc-modal-field"><label><span class="cc-required">*</span> '+(isTask?'任务头':'篮子头')+'</label><input class="cc-input" id="ccNewCode" placeholder="请输入"></div>'+
      '<div class="cc-modal-field"><label><span class="cc-required">*</span> '+(isTask?'任务类型':'篮子类型')+'</label><select class="cc-select" id="ccNewType">'+categories.map(x=>'<option>'+x+'</option>').join('')+'</select></div>'+
      (isTask?'':'<div class="cc-modal-field"><label>发货员</label><select class="cc-select" id="ccNewSender"><option value="">请选择</option>'+['XWD','WSQ','HF','LS','SXY','Laity'].map(x=>'<option>'+x+'</option>').join('')+'</select></div>');
    modal(isTask?'新增任务类型':'新增篮子',content,()=>{
      const code=modalHost.querySelector('#ccNewCode').value.trim();
      if(!code){toast('请输入'+(isTask?'任务头':'篮子头'));modalHost.querySelector('#ccNewCode').focus();return;}
      const category=modalHost.querySelector('#ccNewType').value;
      if(!category){toast('请选择'+(isTask?'任务类型':'篮子类型'));return;}
      const row={id:type+Date.now(),code,category,operator:'XWD',time:new Date().toLocaleString('sv-SE').replace('T',' ')};
      if(!isTask)row.sender=modalHost.querySelector('#ccNewSender').value;
      rows.unshift(row);save();closeModal();applyFilter();
    });
    modalHost.querySelector('.cc-modal').classList.add('cc-modal-create');
  }
  function preview(row,printing){modal('有效'+(isTask?'任务码':'篮子码'),'<div class="cc-modal-note">'+(isTask?'任务头':'篮子头')+'：'+escape(row.code)+'</div><div class="cc-barcode" aria-hidden="true"></div><div class="cc-code-text">'+escape(row.code)+'</div>',()=>{if(printing)window.print();closeModal();});}
  root.addEventListener('click',e=>{
    const el=e.target.closest('[data-action],#ccSearch,#ccReset,#ccAdd,#ccPrintSettings');if(!el)return;
    if(el.id==='ccSearch')return applyFilter();
    if(el.id==='ccReset'){root.querySelector('#ccFilterCode').value='';typeSelect.setValue('');datePicker.reset();return applyFilter();}
    if(el.id==='ccAdd')return addRow();
    if(el.id==='ccPrintSettings')return modal('打印设置','<div class="cc-modal-field"><label>打印份数</label><input class="cc-input" type="number" min="1" value="1"></div>',()=>{closeModal();toast('打印设置已保存');});
    const row=rows.find(x=>x.id===el.dataset.id);if(!row)return;
    if(el.dataset.action==='delete'){if(!confirm('确定删除 '+row.code+' 吗？'))return;rows=rows.filter(x=>x.id!==row.id);save();applyFilter();return;}
    if(el.dataset.action==='preview')return preview(row,false);
    if(el.dataset.action==='print')return preview(row,true);
    if(el.dataset.action==='edit-sender')return modal('编辑发货员','<div class="cc-modal-field"><label>发货员</label><input class="cc-input" id="ccSender" value="'+escape(row.sender||'')+'" placeholder="请输入"></div>',()=>{row.sender=modalHost.querySelector('#ccSender').value.trim();save();closeModal();renderTable();});
  });
  modalHost.addEventListener('click',e=>{if(e.target.classList.contains('cc-modal-mask')||e.target.closest('[data-close]'))closeModal();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
  document.body.addEventListener('click',e=>{const btn=e.target.closest('#ccPager [data-page]');if(!btn||btn.disabled)return;page=Number(btn.dataset.page);renderTable();});
  document.body.addEventListener('change',e=>{if(e.target.id==='ccPageSize'){size=Number(e.target.value);page=1;renderTable();}});
  document.body.addEventListener('keydown',e=>{if(e.target.id==='ccJump'&&e.key==='Enter'){page=Math.max(1,Number(e.target.value)||1);renderTable();}});
  skeleton();renderTable();
})();
