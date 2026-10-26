/* ACE CLUB — بازی کلاسیک (کوریور) */
(function(){
  const fa=n=>Number(n||0).toLocaleString('fa-IR');
  const icon=n=>`<img class="classic-icon" src="/assets/ace-ui/${n}.svg" alt="">`;
  let classicPoll=null, classicChatPoll=null, classicChatSeen=0;
  const clearTimers=()=>{if(classicPoll){clearInterval(classicPoll);classicPoll=null}if(classicChatPoll){clearInterval(classicChatPoll);classicChatPoll=null}};
  const guideText=`<h2>راهنمای بازی</h2><button class="classic-guide-close" data-classic-guide-close>×</button><section><h3>هدف</h3><p>مهره ی آبی رنگت از پایین شروع میکنه و باید بره بالا مهره ی قرمز رنگ حریف از بالا شروع میکنه و باید بیاد پایین تو بازی حرفه ای (۲) به (۲) اولین هم تیمی ای که به خط پایان برسه تیمش برنده میشه.</p></section><section><h3>حرکت</h3><p>هر نوبت مهره ات رو به یکی از خونههای اطرافت در چهار جهت اصلی بالا پایین چپ یا راست حرکت بده یا از روی حریف بپر.</p><p>تو بازی حرفه ای (۲) به (۲) هم تیمیها میتونن از روی هم رد بشن.</p></section><section><h3>دیوار</h3><p>تو نوبت خودت میتونی بجای حرکت کردن به دیوار افقی یا عمودی به اندازه ۲ خونه بذاری دیوارها نباید همه ی راه های رسیدن به هدف رو ببندن.</p></section><section><h3>مدها</h3><p>مد کلاسیک برای بازی تک نفره مناسبه تخته ۹ در ۹ داره و هر بازیکن ۱۰ دیوار داره</p><p>مد حرفه ای برای بازی تیمی ۲ به ۲ ساخته شده تخته ۱۱ در ۱۱ داره و ۲۰ دیوار بصورت مشترک در اختیار دو بازیکن قرار میگیره</p></section><section><h3>با دوستات بازی کن</h3><p>تو قسمت بازی با دوستان میتونی تا ۳ دوست رو به بازی دعوت کنی قبل از شروع بازی مشخص کن کی هم تیمیه و کی حریف</p></section>`;
  function gameGuide(){
    document.querySelector('.classic-guide-overlay')?.remove();
    const layer=document.createElement('div');layer.className='classic-guide-overlay';
    layer.innerHTML=`<section class="classic-guide-sheet">${guideText}</section>`;
    layer.addEventListener('click',e=>{if(e.target===layer||e.target.closest('[data-classic-guide-close]'))layer.remove()});document.body.append(layer);
  }
  function gameSettings(){
    document.querySelector('.classic-soon-overlay')?.remove();
    const layer=document.createElement('div');layer.className='classic-soon-overlay';layer.innerHTML=`<section class="classic-soon-sheet">${icon('game-settings')}<h3>تنظیمات بازی</h3><b>آپدیت به‌زودی</b><p>تنظیمات اختصاصی بازی در بروزرسانی بعدی فعال می‌شود.</p><button class="btn" data-classic-soon-close>متوجه شدم</button></section>`;
    layer.addEventListener('click',e=>{if(e.target===layer||e.target.closest('[data-classic-soon-close]'))layer.remove()});document.body.append(layer);
  }
  function gameReport(){
    document.querySelector('.classic-report-overlay')?.remove();
    const layer=document.createElement('div');layer.className='classic-report-overlay';
    layer.innerHTML=`<section class="classic-report-sheet"><button class="classic-report-close" data-report-close>×</button>${icon('game-report')}<h3>گزارش بازی</h3><p class="muted">موضوع گزارش را انتخاب کن.</p><div class="classic-report-options"><button data-game-report="gameplay"><span>⚖️</span><b>گزارش نحوه بازی</b><small>مشکل یا رفتار نادرست در روند بازی</small></button><button data-game-report="inappropriate"><span>💬</span><b>پیام نامناسب در بازی</b><small>گزارش پیام توهین‌آمیز یا نامناسب</small></button><button data-game-report="cheating"><span>🛡️</span><b>تقلب در بازی</b><small>مشکوک به استفاده از تقلب یا سوءاستفاده</small></button></div><div class="classic-report-form" hidden><b id="classicReportTitle">گزارش</b><textarea id="classicReportDetails" maxlength="1000" placeholder="توضیحات (اختیاری)..."></textarea><div class="classic-report-form-actions"><button class="btn secondary" data-report-back>بازگشت</button><button class="btn" data-report-submit>ارسال گزارش</button></div></div></section>`;
    let selected='';
    layer.addEventListener('click',async e=>{
      if(e.target===layer||e.target.closest('[data-report-close]')){layer.remove();return}
      const option=e.target.closest('[data-game-report]');
      if(option){selected=option.dataset.gameReport;const labels={gameplay:'گزارش نحوه بازی',inappropriate:'پیام نامناسب در بازی',cheating:'تقلب در بازی'};$('#classicReportTitle').textContent=labels[selected];layer.querySelector('.classic-report-options').hidden=true;layer.querySelector('.classic-report-form').hidden=false;layer.querySelector('#classicReportDetails')?.focus();return}
      if(e.target.closest('[data-report-back]')){layer.querySelector('.classic-report-options').hidden=false;layer.querySelector('.classic-report-form').hidden=true;return}
      if(e.target.closest('[data-report-submit]')){const details=layer.querySelector('#classicReportDetails')?.value?.trim()||'';try{await api(`/games/room/${window.activeGameRoom}/report`,{method:'POST',body:{kind:selected,details}});layer.remove();toast('گزارش بازی ثبت شد')}catch(err){toast(err.message)}}
    });
    document.body.append(layer);
  }
  function gameComingSoon(title,iconName){return `<button class="classic-action-card classic-disabled" type="button" disabled>${icon(iconName)}<span><b>${title}</b><small>آپدیت به‌زودی</small></span><em>به‌زودی</em></button>`}
  window.gamesScreen=async function(){
    clearTimers();view='games';
    shell(`${topbar('بازی‌ها')}<main class="content classic-games-page">
      <section class="classic-games-hero"><div class="classic-games-logo">${icon('game-classic')}</div><div><span class="classic-update-badge">آپدیت شد</span><h1>بازی‌ها</h1><p>رقابت آنلاین، نوبتی و استراتژیک</p></div></section>
      <section class="classic-game-list">
        <h2 class="classic-mode-heading">🎲 بازی تصادفی</h2>
        <button class="classic-action-card classic-active" data-classic-start><span class="classic-action-logo">${icon('game-classic')}</span><span><b>کلاسیک</b><small>۱ به ۱ آنلاین · تخته ۹×۹ · ۱۰ دیوار</small></span><em>شروع بازی ←</em></button>
        ${gameComingSoon('پیشرفته','game-settings')}
        <h2 class="classic-mode-heading">👥 بازی با دوستان</h2>
        ${gameComingSoon('بازی با دوستان','game-friends')}
        <h2 class="classic-mode-heading">⚙️ تنظیمات و راهنما</h2>
        ${gameComingSoon('تنظیمات بازی','game-settings')}
        <button class="classic-action-card" data-classic-guide><span class="classic-action-logo">${icon('game-guide')}</span><span><b>راهنما</b><small>قوانین و روش بازی</small></span><em>مشاهده ←</em></button>
      </section>

    </main>`);
    $('[data-classic-start]')?.addEventListener('click',async()=>{try{const d=await api('/games/join',{method:'POST',body:{gameType:'classic'}});window.activeGameRoom=d.room.id;viewStack.push('games');view='gameRoom';await classicGameRoomScreen(d.room.id)}catch(err){toast(err.message)}});
    $('[data-classic-guide]')?.addEventListener('click',gameGuide);
    document.querySelectorAll('[data-classic-coming]').forEach(btn=>btn.addEventListener('click',()=>gameSettings()));
    
  };
  function playersMap(room){return room.players||[]}
  function stateOf(room){return room.state||{}}
  function wallKey(w){return `${w.o[0]}:${w.r}:${w.c}`}
  function hasWall(state,o,r,c){return (state.walls||[]).some(w=>w.o===o&&Number(w.r)===r&&Number(w.c)===c)}
  function moveBlocked(state,r1,c1,r2,c2){const dr=r2-r1,dc=c2-c1,w=state.walls||[],h=(r,c)=>w.some(x=>x.o==='h'&&Number(x.r)===r&&Number(x.c)===c),v=(r,c)=>w.some(x=>x.o==='v'&&Number(x.r)===r&&Number(x.c)===c);if(dr===-1)return h(r2,c2)||h(r2,c2-1);if(dr===1)return h(r1,c1)||h(r1,c1-1);if(dc===-1)return v(r2,c2)||v(r2-1,c2);if(dc===1)return v(r1,c1)||v(r1-1,c1);return true;}
  function legalMoves(room){
    const st=stateOf(room),meP=room.players.find(p=>Number(p.user_id)===Number(me.id)),opp=room.players.find(p=>Number(p.user_id)!==Number(me.id));if(!meP)return [];
    const out=[];const r=Number(meP.position?.r??8),c=Number(meP.position?.c??4);const dirs=[[-1,0],[1,0],[0,-1],[0,1]];
    for(const [dr,dc] of dirs){let nr=r+dr,nc=c+dc;if(nr<0||nr>8||nc<0||nc>8||moveBlocked(st,r,c,nr,nc))continue;
      if(opp&&Number(opp.position?.r)===nr&&Number(opp.position?.c)===nc){const jr=nr+dr,jc=nc+dc;if(jr>=0&&jr<9&&jc>=0&&jc<9&&!moveBlocked(st,nr,nc,jr,jc)){out.push([jr,jc]);continue}
        for(const [sr,sc] of [[-dc,dr],[dc,-dr]]){const sr0=nr+sr,sc0=nc+sc;if(sr0>=0&&sr0<9&&sc0>=0&&sc0<9&&!moveBlocked(st,nr,nc,sr0,sc0))out.push([sr0,sc0]);}
      } else out.push([nr,nc]);
    }return out;
  }
  function reachesGoal(st,start,goal){
    const q=[start],seen=new Set([start.join(',')]);while(q.length){const [r,c]=q.shift();if(r===goal)return true;for(const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]){const nr=r+dr,nc=c+dc;if(nr<0||nr>8||nc<0||nc>8||moveBlocked(st,r,c,nr,nc))continue;const k=`${nr},${nc}`;if(!seen.has(k)){seen.add(k);q.push([nr,nc])}}}return false;
  }
  function clientWallLegal(room,o,r,c){
    const st=stateOf(room);if(r<0||r>7||c<0||c>7)return false;
    if(hasWall(st,o,r,c))return false;
    // دیوارهای هم‌جهت نباید روی هم بیفتند و دو دیوار عمود نباید از وسط هم عبور کنند.
    if(o==='h' && (hasWall(st,'h',r,c-1)||hasWall(st,'h',r,c+1)||hasWall(st,'v',r,c)))return false;
    if(o==='v' && (hasWall(st,'v',r-1,c)||hasWall(st,'v',r+1,c)||hasWall(st,'h',r,c)))return false;
    const walls=[...(st.walls||[]),{o,r,c}];const test={...st,walls};const ps=room.players;
    for(const p of ps){const pr=Number(p.position?.r??(p===ps[0]?8:0)),pc=Number(p.position?.c??4),goal=p.goal==='top'?0:8;if(!reachesGoal(test,[pr,pc],goal))return false;}
    return true;
  }
  function wallSlots(room){
    const slots=[];for(let r=0;r<8;r++)for(let c=0;c<8;c++){if(clientWallLegal(room,'h',r,c))slots.push(`h:${r}:${c}`);if(clientWallLegal(room,'v',r,c))slots.push(`v:${r}:${c}`)}return slots;
  }
  function boardHtml(room,wallMode){
    const st=stateOf(room),players=playersMap(room),lm=new Set(legalMoves(room).map(x=>x.join(','))),orientation=window.classicWallOrientation||'h';
    const legalWallKeys=wallMode?new Set(wallSlots(room).filter(k=>k.startsWith(orientation+':'))):new Set();
    let cells='';
    for(let r=0;r<9;r++)for(let c=0;c<9;c++){
      const p=players.find(x=>Number(x.position?.r)===r&&Number(x.position?.c)===c),goal=r===0||r===8;
      const cls=['classic-cell',goal?'goal-cell':'',p?'occupied':'',p&&Number(p.user_id)===Number(me.id)?'blue-piece':'',p&&Number(p.user_id)!==Number(me.id)?'red-piece':'',lm.has(`${r},${c}`)?'move-target':''].filter(Boolean).join(' ');
      cells+=`<button class="${cls}" data-classic-cell="${r}:${c}" style="grid-column:${c*2+1};grid-row:${r*2+1};" aria-label="خانه ${fa(r+1)} ${fa(c+1)}">${p?`<span class="classic-piece ${Number(p.user_id)===Number(me.id)?'blue':'red'}"></span>`:''}</button>`;
    }
    let walls='';
    for(const w of (st.walls||[])){
      const o=w.o,r=Number(w.r),c=Number(w.c);
      if(o==='h') walls+=`<span class="classic-wall-visual horizontal" style="grid-column:${c*2+1} / span 3;grid-row:${r*2+2};" aria-hidden="true"></span>`;
      else walls+=`<span class="classic-wall-visual vertical" style="grid-column:${c*2+2};grid-row:${r*2+1} / span 3;" aria-hidden="true"></span>`;
    }
    if(wallMode){
      for(const key of legalWallKeys){const [o,r,c]=key.split(':');const pos=o==='h'?`grid-column:${Number(c)*2+1} / span 3;grid-row:${Number(r)*2+2};`:`grid-column:${Number(c)*2+2};grid-row:${Number(r)*2+1} / span 3;`;walls+=`<button class="classic-wall-target ${o==='h'?'horizontal':'vertical'}" data-classic-wall="${o}:${r}:${c}" style="${pos}" aria-label="جای مجاز دیوار"></button>`;}
    }
    return `<div class="classic-board-frame"><div class="classic-board-grid">${cells}<div class="classic-wall-layer">${walls}</div></div></div>`;
  }

  function classicRoomMarkup(room){
    const st=stateOf(room),players=playersMap(room),mine=players.find(p=>Number(p.user_id)===Number(me.id)),other=players.find(p=>Number(p.user_id)!==Number(me.id));
    if(room.status==='waiting')return `<section class="classic-waiting-page"><header class="classic-match-head">${icon('game-classic')}<div><span class="classic-update-badge">آپدیت شد</span><h2>در انتظار حریف...</h2><small>وقتی دو بازیکن کامل شوند، بازی خودکار شروع می‌شود.</small></div></header><div class="classic-waiting-art">${icon('game-classic')}</div><div class="classic-vs-card"><div class="classic-player-slot blue-slot">${avatar(mine||me)}<b>${esc((mine||me).display_name||'تو')}</b><small>بازیکن ۱ · آماده</small></div><div class="classic-vs-logo">VS</div><div class="classic-player-slot red-slot">${other?avatar(other):'<span class="classic-empty-avatar">?</span>'}<b>${other?esc(other.display_name):'در انتظار حریف'}</b><small>${other?'بازیکن ۲ · آماده':'هنوز وارد نشده'}</small></div></div><div class="classic-wait-note">${icon('game-classic')} <span>با ورود بازیکن دوم، بازی بدون تأخیر آغاز می‌شود.</span></div><button class="btn secondary block" data-classic-leave-wait>خروج از اتاق انتظار</button></section>`;
    const turn=Number(st.turn)===Number(me.id),left=Math.max(0,15000-(Date.now()-Number(st.turnStartedAt||Date.now()))),secs=Math.ceil(left/1000),wallMode=window.classicWallMode===true,meWalls=Number(mine?.walls??10),oppWalls=Number(other?.walls??10);
    return `<section class="classic-game-page"><header class="classic-game-top"><div class="classic-top-actions"><button class="classic-top-btn" data-classic-guide>${icon('game-guide')}<span>راهنما</span></button><button class="classic-top-btn" data-classic-settings>${icon('game-settings')}<span>تنظیمات</span><small>آپدیت به‌زودی</small></button></div><div><div class="classic-turn-title ${turn?'your-turn':''}">${turn?'نوبت تو':'نوبت حریف'}<span class="classic-timer">${fa(secs)}</span></div><button class="classic-report-link" data-classic-report>${icon('game-report')} گزارش بازی</button></div></header><div class="classic-board-wrap">${boardHtml(room,wallMode)}</div><div class="classic-instruction">${turn?(wallMode?'برای گذاشتن دیوار، جای روشن را لمس کن.':'مهره را حرکت بده یا حالت دیوار را انتخاب کن.'):'صبر کن تا نوبت حریف تمام شود.'}</div><div class="classic-actions"><button class="classic-wall-choice ${wallMode&&window.classicWallOrientation==='v'?'active':''}" data-classic-wall-mode data-orientation="v" ${!turn||meWalls<=0?'disabled':''}>${icon('game-wall-v')}<span>دیوار عمودی</span><small>${fa(meWalls)} دیوار</small></button><button class="classic-wall-choice ${wallMode&&window.classicWallOrientation==='h'?'active':''}" data-classic-wall-mode data-orientation="h" ${!turn||meWalls<=0?'disabled':''}>${icon('game-wall-h')}<span>دیوار افقی</span><small>${fa(meWalls)} دیوار</small></button><button class="classic-wall-choice ${!wallMode?'active':''}" data-classic-move-mode ${!turn?'disabled':''}>${icon('game-classic')}<span>حرکت مهره</span><small>${turn?'انتخاب حرکت':'نوبت حریف'}</small></button></div><div class="classic-chat-card"><div class="classic-quick"><button data-classic-quick="موفق باشی! 🍀">موفق باشی! 🍀</button><button data-classic-quick="حرکت خوبی بود 🔥">حرکت خوبی بود 🔥</button><button data-classic-quick="زودتر بازی کن ⏳">زودتر بازی کن ⏳</button></div><div id="classicChatMessages"></div><form id="classicChatForm"><textarea id="classicChatInput" maxlength="300" rows="1" enterkeyhint="send" autocomplete="off" autocorrect="on" spellcheck="true" placeholder="پیامت رو بنویس..."></textarea><button type="submit">➤</button></form></div><button class="classic-leave-btn" data-classic-leave>خروج از بازی</button></section>`;
  }
  async function renderClassicRoot(room){
    const root=$('#classicRoot');if(!root)return;root.innerHTML=classicRoomMarkup(room);
    // Waiting rooms return before the gameplay handlers are installed, so bind the
    // leave action explicitly here. This fixes the inert "خروج از اتاق انتظار" button.
    if(room.status==='waiting'){
      root.onclick=async e=>{
        const leave=e.target.closest('[data-classic-leave-wait]');
        if(!leave)return;
        if(leave.disabled)return;
        leave.disabled=true;leave.textContent='در حال خروج…';
        try{
          const out=await api(`/games/room/${room.id}/leave`,{method:'POST',body:{}});
          clearTimers();window.activeGameRoom=null;document.body.classList.remove('classic-game-mode');view='games';
          toast(out.message||'از اتاق انتظار خارج شدی');
          await gamesScreen();
        }catch(err){
          toast(err.message||'خروج از اتاق انتظار انجام نشد');
          leave.disabled=false;leave.textContent='خروج از اتاق انتظار';
        }
      };
      return;
    }
    const mine=room.players.find(p=>Number(p.user_id)===Number(me.id));if(!mine)return;
    $('#classicRoot').onclick=async e=>{
      const g=e.target.closest('[data-classic-guide]');if(g){gameGuide();return}
      const s=e.target.closest('[data-classic-settings]');if(s){gameSettings();return}const rp=e.target.closest('[data-classic-report]');if(rp){gameReport();return}
      const lm=e.target.closest('[data-classic-move-mode]');if(lm){window.classicWallMode=false;window.classicWallOrientation='h';refreshClassic();return}
      const wm=e.target.closest('[data-classic-wall-mode]');if(wm){window.classicWallMode=true;window.classicWallOrientation=wm.dataset.orientation||'h';refreshClassic();return}
      const cell=e.target.closest('[data-classic-cell]');if(cell&&!window.classicWallMode){const [r,c]=cell.dataset.classicCell.split(':').map(Number);try{const out=await api(`/games/room/${room.id}/action`,{method:'POST',body:{action:'move',row:r,col:c}});if(out.room?.status==='finished')return showClassicFinished(out.room);await refreshClassic(out.room)}catch(err){toast(err.message)}return}
      const wall=e.target.closest('[data-classic-wall]');if(wall&&window.classicWallMode){const [o,r,c]=wall.dataset.classicWall.split(':');try{const out=await api(`/games/room/${room.id}/action`,{method:'POST',body:{action:'wall',orientation:o,row:Number(r),col:Number(c)}});window.classicWallMode=false;if(out.room?.status==='finished')return showClassicFinished(out.room);await refreshClassic(out.room)}catch(err){toast(err.message)}return}
      const q=e.target.closest('[data-classic-quick]');if(q){sendClassicChat(q.dataset.classicQuick);return}
      const leave=e.target.closest('[data-classic-leave]');if(leave){confirmClassicLeave(room.id);return}
      const lw=e.target.closest('[data-classic-leave-wait]');if(lw){try{await api(`/games/room/${room.id}/leave`,{method:'POST',body:{}});clearTimers();view='games';window.activeGameRoom=null;gamesScreen()}catch(err){toast(err.message)}return}
    };
    const chatForm=$('#classicChatForm');if(chatForm)chatForm.onsubmit=e=>{e.preventDefault();const v=$('#classicChatInput')?.value?.trim();if(v)sendClassicChat(v)};const chatInput=$('#classicChatInput');if(chatInput){chatInput.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();chatForm?.requestSubmit();}});}
    loadClassicChat(room.id);classicChatPoll=setInterval(()=>loadClassicChat(room.id),1200);
  }
  function updateClassicPlayingUi(room){
    const root=$('#classicRoot');if(!root)return;
    const st=stateOf(room),players=playersMap(room),mine=players.find(p=>Number(p.user_id)===Number(me.id)),turn=Number(st.turn)===Number(me.id),left=Math.max(0,15000-(Date.now()-Number(st.turnStartedAt||Date.now()))),secs=Math.ceil(left/1000),wallMode=window.classicWallMode===true,meWalls=Number(mine?.walls??10);
    const title=root.querySelector('.classic-turn-title');if(title){title.classList.toggle('your-turn',turn);title.innerHTML=`${turn?'نوبت تو':'نوبت حریف'}<span class="classic-timer">${fa(secs)}</span>`;}
    const board=root.querySelector('.classic-board-wrap');if(board)board.innerHTML=boardHtml(room,wallMode);
    const instruction=root.querySelector('.classic-instruction');if(instruction)instruction.textContent=turn?(wallMode?'برای گذاشتن دیوار، جای روشن را لمس کن.':'مهره را حرکت بده یا حالت دیوار را انتخاب کن.'):'صبر کن تا نوبت حریف تمام شود.';
    root.querySelectorAll('[data-classic-wall-mode]').forEach(btn=>{btn.disabled=!turn||meWalls<=0;btn.classList.toggle('active',wallMode&&(window.classicWallOrientation||'h')===btn.dataset.orientation);const small=btn.querySelector('small');if(small)small.textContent=`${fa(meWalls)} دیوار`;});
    const moveBtn=root.querySelector('[data-classic-move-mode]');if(moveBtn){moveBtn.disabled=!turn;moveBtn.classList.toggle('active',!wallMode);const small=moveBtn.querySelector('small');if(small)small.textContent=turn?'انتخاب حرکت':'نوبت حریف';}
  }
  async function refreshClassic(roomFrom){try{const d=roomFrom?{room:roomFrom}:await api('/games/room/'+window.activeGameRoom);const room=d.room;if(room.status==='finished')return showClassicFinished(room);const root=$('#classicRoot');if(!root)return;if(room.status==='playing'){updateClassicPlayingUi(room);}else{root.innerHTML=classicRoomMarkup(room);bindClassicRoot(room);}}catch(err){toast(err.message)}}
  function bindClassicRoot(room){const root=$('#classicRoot');if(!root)return;root.onclick=async e=>{
    const g=e.target.closest('[data-classic-guide]');if(g)return gameGuide();const s=e.target.closest('[data-classic-settings]');if(s)return gameSettings();const rp=e.target.closest('[data-classic-report]');if(rp)return gameReport();const wm=e.target.closest('[data-classic-wall-mode]');if(wm){window.classicWallMode=true;window.classicWallOrientation=wm.dataset.orientation||'h';refreshClassic();return}const mm=e.target.closest('[data-classic-move-mode]');if(mm){window.classicWallMode=false;refreshClassic();return}
    const cell=e.target.closest('[data-classic-cell]');if(cell&&!window.classicWallMode){const [r,c]=cell.dataset.classicCell.split(':').map(Number);try{const out=await api(`/games/room/${room.id}/action`,{method:'POST',body:{action:'move',row:r,col:c}});if(out.room.status==='finished')showClassicFinished(out.room);else refreshClassic(out.room)}catch(err){toast(err.message)}return}
    const wall=e.target.closest('[data-classic-wall]');if(wall&&window.classicWallMode){const [o,r,c]=wall.dataset.classicWall.split(':');try{const out=await api(`/games/room/${room.id}/action`,{method:'POST',body:{action:'wall',orientation:o,row:Number(r),col:Number(c)}});window.classicWallMode=false;if(out.room.status==='finished')showClassicFinished(out.room);else refreshClassic(out.room)}catch(err){toast(err.message)}return}
    const q=e.target.closest('[data-classic-quick]');if(q){sendClassicChat(q.dataset.classicQuick);return}const leave=e.target.closest('[data-classic-leave]');if(leave){confirmClassicLeave(room.id);return}
  };const f=$('#classicChatForm');if(f)f.onsubmit=e=>{e.preventDefault();const v=$('#classicChatInput')?.value?.trim();if(v)sendClassicChat(v)};const ci=$('#classicChatInput');if(ci){ci.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();f?.requestSubmit();}});}
  }
  async function loadClassicChat(roomId){try{const d=await api(`/games/room/${roomId}/messages`);const box=$('#classicChatMessages');if(!box)return;box.innerHTML=(d.messages||[]).map(m=>`<div class="classic-chat-line ${Number(m.user_id)===Number(me.id)?'mine':''}"><b>${esc(m.display_name)}</b><span>${esc(m.body)}</span></div>`).join('');box.scrollTop=box.scrollHeight}catch{}}
  async function sendClassicChat(body){try{const i=$('#classicChatInput');const keepFocus=document.activeElement===i;await api(`/games/room/${window.activeGameRoom}/messages`,{method:'POST',body:{body}});if(i){i.value='';if(keepFocus)i.focus({preventScroll:true});}loadClassicChat(window.activeGameRoom)}catch(err){toast(err.message)}}
  async function confirmClassicLeave(id){
    const layer=document.createElement('div');layer.className='classic-confirm-overlay';layer.innerHTML=`<section class="classic-confirm"><div class="classic-confirm-icon">⚠</div><h3>خروج از بازی</h3><p>با خروج از بازی، هزینه خروج از موجودی‌ات کم می‌شود.</p><div class="classic-cost-list"><span>اولویت ۱: <b>۱ الماس</b></span><span>اگر الماس نداشتی: <b>۱۰۰ سکه</b></span><span>اگر سکه هم نداشتی: <b>۲۰۰۰ شهرت</b></span></div><div class="classic-confirm-actions"><button class="btn secondary" data-classic-cancel>لغو</button><button class="btn danger" data-classic-confirm>تأیید</button></div></section>`;layer.onclick=async e=>{if(e.target===layer||e.target.closest('[data-classic-cancel]')){layer.remove();return}if(e.target.closest('[data-classic-confirm]')){try{const out=await api(`/games/room/${id}/leave`,{method:'POST',body:{}});layer.remove();clearTimers();toast(out.message||'خروج انجام شد');view='games';window.activeGameRoom=null;gamesScreen()}catch(err){toast(err.message)}}};document.body.append(layer);
  }
  function showClassicFinished(room){clearTimers();const won=Number(room.winnerId)===Number(me.id);const root=$('#classicRoot');if(!root)return;root.innerHTML=`<section class="classic-result"><div class="classic-result-logo">${icon(won?'game-win':'game-classic')}</div><span class="classic-update-badge">بازی تمام شد</span><h1>${won?'🎉 بردی!':'این بازی تمام شد'}</h1><p>${won?'۵ الماس و ۵۰۰ شهرت به حسابت اضافه شد.':'حریف برنده شد.'}</p><div class="classic-result-rewards">${won?'<b>💎 +۵ الماس</b><b>✨ +۵۰۰ شهرت</b>':''}</div><button class="btn block" data-classic-back>بازگشت به بازی‌ها</button></section>`;root.onclick=e=>{if(e.target.closest('[data-classic-back]')){view='games';window.activeGameRoom=null;gamesScreen()}}}
  async function classicGameRoomScreen(id){
    clearTimers();window.activeGameRoom=id;window.classicWallMode=false;document.body.classList.add('classic-game-mode');shell(`<main id="classicRoot" class="classic-root"><div class="empty">در حال ورود به بازی…</div></main>`);
    try{const d=await api('/games/room/'+id);if(d.room.gameType!=='classic'){toast('این نوع بازی دیگر در برنامه فعال نیست');view='games';return gamesScreen()};await renderClassicRoot(d.room);if(d.room.status==='waiting'){classicPoll=setInterval(async()=>{try{const x=await api('/games/room/'+id);if(x.room.status==='playing'){clearTimers();await renderClassicRoot(x.room);classicPoll=setInterval(()=>refreshClassic(),1000)}else if(x.room.status==='finished'){clearTimers();showClassicFinished(x.room)}}catch{}},1000)}else{classicPoll=setInterval(()=>refreshClassic(),1000)}}catch(err){toast(err.message);view='games';gamesScreen()}
  }
  window.gameRoomScreen=async function(id){try{const d=await api('/games/room/'+id);if(d.room.gameType==='classic')return classicGameRoomScreen(id);toast('این نوع بازی دیگر در برنامه فعال نیست');view='games';return gamesScreen()}catch(err){toast('این نوع بازی دیگر در برنامه فعال نیست');view='games';return gamesScreen()}};
  window.addEventListener('beforeunload',clearTimers);
})();
