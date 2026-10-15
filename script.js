'use strict';
/* SmartVillage 360 - DEMO version. Data lives only in this browser (localStorage).
   Login here is a DEMO, not secure. Real security needs a server (see README). */
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const today=()=>new Date().toISOString().slice(0,10);
const L={
en:{home:'Home',schemes:'Schemes',agri:'Agriculture',complaints:'Complaints',news:'Notices',dir:'Directory',dash:'Dashboard',admin:'Admin',login:'Login',reg:'Register',logout:'Logout',hello:'Welcome',tag:'Your village services in one place',search:'Search…',all:'All',submit:'Submit',save:'Save',del:'Delete',edit:'Edit',none:'Nothing found.',demo:'DEMO DATA',saved:'Saved',cat:'Category',desc:'Description',status:'Status',resp:'Admin response',name:'Name',email:'Email',phone:'Phone',pass:'Password',notes:'Notifications',mine:'My complaints',export:'Export CSV',verify:'Always confirm eligibility and benefits with the official department.',priv:'Privacy: demo data stays only in your own browser.',users:'Users',stats:'Statistics',imp:'Important',title:'Title',date:'Date',open:'Official site',markread:'Mark all read',profile:'Profile',needlogin:'Please log in to continue.',photo:'Photo (optional)'},
ta:{home:'முகப்பு',schemes:'திட்டங்கள்',agri:'விவசாயம்',complaints:'புகார்கள்',news:'அறிவிப்புகள்',dir:'தொடர்பு',dash:'டாஷ்போர்டு',admin:'நிர்வாகி',login:'உள்நுழை',reg:'பதிவு',logout:'வெளியேறு',hello:'வணக்கம்',tag:'உங்கள் கிராம சேவைகள் ஒரே இடத்தில்',search:'தேடுக…',all:'அனைத்தும்',submit:'சமர்ப்பி',save:'சேமி',del:'நீக்கு',edit:'திருத்து',none:'எதுவும் இல்லை.',demo:'டெமோ தரவு',saved:'சேமிக்கப்பட்டது',cat:'வகை',desc:'விவரம்',status:'நிலை',resp:'நிர்வாகி பதில்',name:'பெயர்',email:'மின்னஞ்சல்',phone:'தொலைபேசி',pass:'கடவுச்சொல்',notes:'அறிவிப்புகள்',mine:'என் புகார்கள்',export:'CSV பதிவிறக்கம்',verify:'தகுதி, பலன்களை அதிகாரப்பூர்வ துறையில் உறுதிசெய்யவும்.',priv:'தனியுரிமை: டெமோ தரவு உங்கள் உலாவியில் மட்டுமே இருக்கும்.',users:'பயனர்கள்',stats:'புள்ளிவிவரங்கள்',imp:'முக்கியம்',title:'தலைப்பு',date:'தேதி',open:'அதிகாரப்பூர்வ தளம்',markread:'அனைத்தும் படித்தது',profile:'சுயவிவரம்',needlogin:'தொடர உள்நுழையவும்.',photo:'புகைப்படம் (விருப்பம்)'}};
const ST={Submitted:'சமர்ப்பிக்கப்பட்டது','In Progress':'நடைபெறுகிறது',Resolved:'தீர்க்கப்பட்டது'};
const STS=['Submitted','In Progress','Resolved'];
const CC=['Road','Drinking water','Streetlight','Sanitation','Drainage','Other'];
const AC=['Event','Notice','Health','Agriculture'];
let S,view='home',tab='stats',q={};
const T=k=>(L[S.lang]||L.en)[k]||L.en[k]||k;
const stt=s=>S.lang==='ta'?ST[s]||s:s;

function seed(){return{lang:'en',theme:'light',session:null,editA:null,
users:[{id:1,name:'Demo Villager',email:'demo@village.test',phone:'9876500001',role:'villager',salt:'s1',h:''},{id:2,name:'Village Admin',email:'admin@village.test',phone:'9876500002',role:'admin',salt:'s2',h:''}],
ann:[{id:1,title:'Gram Sabha meeting',body:'All villagers are invited to the Gram Sabha at the panchayat office. Agenda: water supply and road repair.',cat:'Event',date:today(),imp:true,demo:true},
{id:2,title:'Health camp at the village health centre',body:'Free general check-up and blood pressure screening for all ages.',cat:'Health',date:today(),imp:false,demo:true},
{id:3,title:'Soil testing awareness session',body:'Learn how to collect a soil sample and read a soil health card.',cat:'Agriculture',date:today(),imp:false,demo:true},
{id:4,title:'Water tank cleaning notice',body:'Overhead tank will be cleaned. Store drinking water for one day.',cat:'Notice',date:today(),imp:true,demo:true}],
sch:[{id:1,name:'PM-KISAN',cat:'Farmers',elig:'Landholding farmer families, subject to government exclusion rules.',docs:'Aadhaar, bank passbook, land records.',ben:'Income support paid in instalments directly to bank account.',how:'Register through the official portal or the nearest Common Service Centre.',url:'https://pmkisan.gov.in'},
{id:2,name:'MGNREGA',cat:'Employment',elig:'Adult members of rural households willing to do unskilled manual work.',docs:'Job card application, ID proof, photo.',ben:'Guaranteed days of wage employment per year.',how:'Apply for a job card at the Gram Panchayat.',url:'https://nrega.nic.in'},
{id:3,name:'Ayushman Bharat PM-JAY',cat:'Health',elig:'Families identified under the scheme database.',docs:'Aadhaar, ration card or other ID.',ben:'Health cover for listed hospital treatments.',how:'Check eligibility on the official site or at an empanelled hospital help desk.',url:'https://pmjay.gov.in'},
{id:4,name:'Rural housing support (example)',cat:'Housing',elig:'Sample entry: check the rules with the Block Development Office.',docs:'Sample: ID proof, land or house details.',ben:'Sample: financial assistance for house construction.',how:'Contact the Block Development Office.',url:''},
{id:5,name:'Crop insurance (example)',cat:'Farmers',elig:'Sample entry: farmers growing notified crops.',docs:'Sample: land records, bank details, sowing proof.',ben:'Sample: protection against crop loss.',how:'Ask the Agriculture Office or your bank.',url:''}],
cmp:[{id:'SV-2026-1001',uid:1,cat:'Drinking water',desc:'Water supply is irregular in North Street.',photo:'',status:'In Progress',resp:'Pipe repair has started.',date:today(),demo:true},
{id:'SV-2026-1002',uid:1,cat:'Streetlight',desc:'Streetlight near the school is not working.',photo:'',status:'Submitted',resp:'',date:today(),demo:true}],
dir:[{n:'Police',c:'Emergency',p:'100',d:0},{n:'Ambulance',c:'Emergency',p:'108',d:0},{n:'Fire service',c:'Emergency',p:'101',d:0},{n:'National emergency number',c:'Emergency',p:'112',d:0},
{n:'Government Primary School',c:'School',p:'Example only – add real number',d:1},{n:'Primary Health Centre',c:'Health',p:'Example only – add real number',d:1},{n:'Panchayat Office',c:'Office',p:'Example only – add real number',d:1},{n:'Community Hall',c:'Community',p:'Example only – add real number',d:1}],
notes:[{uid:1,msg:'Welcome to SmartVillage 360 (demo).',date:today(),read:false}],saved:{}}}
const load=()=>{try{return JSON.parse(localStorage.getItem('sv360'))}catch{return null}};
const save=()=>{try{localStorage.setItem('sv360',JSON.stringify(S))}catch{toast('Storage is full',1)}};
async function hash(p,salt){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(salt+p));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
const cur=()=>S.users.find(u=>u.id===S.session);
function toast(m,err){const t=$('#toast');t.textContent=m;t.className=err?'show err':'show';clearTimeout(toast.i);toast.i=setTimeout(()=>t.className='',3200)}
function notify(uid,msg){S.notes.push({uid,msg,date:today(),read:false})}

/* ---------- view helpers ---------- */
const fld=(id,l,type='text',v='',x='')=>`<label>${l}<input id="${id}" name="${id}" type="${type}" value="${esc(v)}" ${x}></label>`;
const pw=(ac)=>`<label>${T('pass')}<span class="pw"><input name="pw" type="password" autocomplete="${ac}" required><button type="button" data-a="eye" aria-label="Show or hide password">👁</button></span></label>`;
const opts=(a,sel)=>a.map(x=>`<option ${x===sel?'selected':''}>${esc(x)}</option>`).join('');
const tags=(a)=>a.demo?`<span class="tag d">${T('demo')}</span>`:'';
const annItem=a=>`<article class="card ${a.imp?'imp':''}"><span class="tag">${esc(a.cat)}</span>${a.imp?`<span class="tag w">⭐ ${T('imp')}</span>`:''}${tags(a)}<small>${a.date}</small><h3>${esc(a.title)}</h3><p>${esc(a.body)}</p></article>`;
const gate=role=>{const u=cur();if(!u)return`<div class="card"><p>${T('needlogin')}</p><button class="btn" data-go="login">${T('login')}</button></div>`;if(role&&u.role!==role)return`<div class="card">Admins only. (In the real version the server enforces this.)</div>`;return''};
const verify=()=>`<p class="note">⚠️ ${T('verify')}</p>`;
const bars=(o,tot)=>Object.entries(o).map(([k,v])=>`<p>${esc(k)}: <b>${v}</b></p><div class="bar"><i style="width:${tot?v*100/tot:0}%"></i></div>`).join('');
const stepper=s=>`<div class="steps">${STS.map(x=>`<span class="${STS.indexOf(x)<=STS.indexOf(s)?'on':''}">${esc(stt(x))}</span>`).join('')}</div>`;
const cmpItem=c=>`<article class="card"><b>${esc(c.id)}</b> <span class="tag">${esc(c.cat)}</span>${tags(c)}<small>${c.date}</small><p>${esc(c.desc)}</p>${c.photo?`<small>📷 ${esc(c.photo)}</small>`:''}${stepper(c.status)}${c.resp?`<p><b>${T('resp')}:</b> ${esc(c.resp)}</p>`:''}</article>`;

/* ---------- filtered lists ---------- */
const LS={
schemes(){const s=(q.s||'').toLowerCase(),c=q.sc||'';const r=S.sch.filter(x=>(!c||x.cat===c)&&(x.name+x.elig+x.ben).toLowerCase().includes(s));const u=cur(),sv=(S.saved[u&&u.id]||[]);
return r.length?r.map(x=>`<article class="card"><span class="tag">${esc(x.cat)}</span><h3>${esc(x.name)}</h3><p><b>Eligibility:</b> ${esc(x.elig)}</p><p><b>Documents:</b> ${esc(x.docs)}</p><p><b>Benefits:</b> ${esc(x.ben)}</p><p><b>How to apply:</b> ${esc(x.how)}</p>${x.url?`<a class="btn s" href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${T('open')} ↗</a> `:''}<button class="btn o s" data-a="save" data-id="${x.id}">${sv.includes(x.id)?'★ '+T('saved'):'☆ '+T('save')}</button></article>`).join(''):`<p>${T('none')}</p>`},
news(){const s=(q.n||'').toLowerCase(),c=q.nc||'',d=q.nd||'';const r=S.ann.filter(a=>(!c||a.cat===c)&&(!d||a.date>=d)&&(a.title+a.body).toLowerCase().includes(s)).sort((a,b)=>b.imp-a.imp||b.date.localeCompare(a.date));return r.length?r.map(annItem).join(''):`<p>${T('none')}</p>`},
dir(){const s=(q.d||'').toLowerCase(),c=q.dc||'';const r=S.dir.filter(x=>(!c||x.c===c)&&(x.n+x.c).toLowerCase().includes(s));return r.length?r.map(x=>`<article class="card"><span class="tag">${esc(x.c)}</span>${x.d?`<span class="tag d">Example – verify</span>`:''}<h3>${esc(x.n)}</h3><p>📞 ${x.d?esc(x.p):`<a href="tel:${esc(x.p)}">${esc(x.p)}</a>`}</p></article>`).join(''):`<p>${T('none')}</p>`}};

/* ---------- views ---------- */
const V={
home(){const u=cur();return`<section class="hero"><div><h1>${u?T('hello')+', '+esc(u.name):'SmartVillage 360'}</h1><p>${T('tag')}</p>${u?'':`<button class="btn" data-go="reg">${T('reg')}</button> <button class="btn o" style="color:#fff;border-color:#fff" data-go="login">${T('login')}</button>`}</div>
<svg viewBox="0 0 300 150" role="img" aria-label="Village illustration"><rect width="300" height="150" fill="#bfe8ff"/><circle cx="250" cy="30" r="18" fill="#ffd54f"/><path d="M0 110 Q80 60 160 105 T300 95 V150 H0Z" fill="#2e9e4f"/><path d="M0 130 Q100 100 300 130 V150 H0Z" fill="#1b7f3b"/><rect x="60" y="85" width="40" height="30" fill="#fff3e0"/><path d="M55 85 L80 65 L105 85Z" fill="#c0522b"/><rect x="75" y="98" width="10" height="17" fill="#6d4c41"/><rect x="170" y="92" width="34" height="25" fill="#fff3e0"/><path d="M165 92 L187 75 L209 92Z" fill="#c0522b"/><rect x="30" y="95" width="5" height="20" fill="#6d4c41"/><circle cx="32" cy="90" r="12" fill="#0b3d1e"/></svg></section>
<h2>Quick services</h2><div class="grid">${[['schemes','📜'],['agri','🌱'],['complaints','📝'],['news','📢'],['dir','📞']].map(([k,i])=>`<button class="card q" data-go="${k}"><b>${i}</b>${T(k)}</button>`).join('')}</div>
<h2>📢 ${T('news')}</h2><div class="grid">${S.ann.slice().sort((a,b)=>b.imp-a.imp).slice(0,3).map(annItem).join('')}</div>
<h2>🌱 ${T('agri')}</h2><div class="grid">${CROPS.slice(0,2).map(c=>`<article class="card"><h3>${c.n}</h3><p>${c.t}</p></article>`).join('')}</div>
<h2>📜 ${T('schemes')}</h2><div class="grid">${S.sch.slice(0,3).map(x=>`<article class="card"><h3>${esc(x.name)}</h3><p>${esc(x.ben)}</p></article>`).join('')}</div>${verify()}
<h2>Contact</h2><div class="card"><p>Panchayat Office (example – add real details): Email: example@village.test</p><p>Emergency: 112</p></div>`},
login(){return`<div class="card"><h2>${T('login')}</h2><p class="note">DEMO login only – not secure. Demo villager: demo@village.test / Demo@123. Admin: admin@village.test / Admin@123.</p><form data-f="login" novalidate>${fld('email',T('email'),'email','','autocomplete="username" required')}${pw('current-password')}<p class="msg" role="alert"></p><button class="btn">${T('login')}</button> <button type="button" class="btn o" data-go="reg">${T('reg')}</button></form></div>`},
reg(){return`<div class="card"><h2>${T('reg')}</h2><p class="note">Demo only. Do not enter real or sensitive data. Everything stays in this browser.</p><form data-f="reg" novalidate>${fld('name',T('name'),'text','','required minlength="2"')}${fld('email',T('email'),'email','','required')}${fld('phone',T('phone'),'tel','','required inputmode="numeric" maxlength="10"')}${pw('new-password')}<p class="msg" role="alert"></p><button class="btn">${T('reg')}</button></form></div>`},
schemes(){const c=[...new Set(S.sch.map(x=>x.cat))];return`<h2>📜 ${T('schemes')}</h2>${verify()}<div class="tools"><input data-q="s" placeholder="${T('search')}" aria-label="Search"><select data-q="sc" aria-label="Category"><option value="">${T('all')}</option>${opts(c)}</select></div><div class="grid" id="list">${LS.schemes()}</div>`},
agri(){return`<h2>🌱 ${T('agri')}</h2><div class="grid">${CROPS.map(c=>`<article class="card"><h3>${c.n}</h3><span class="tag">${c.s}</span><p>${c.t}</p></article>`).join('')}</div>
<h2>Irrigation & soil care</h2><div class="grid"><article class="card"><h3>💧 Irrigation</h3><p>Water early morning or evening. Drip or furrow methods waste less water. Check soil moisture by hand before watering.</p></article><article class="card"><h3>🪱 Soil care</h3><p>Get your soil tested at the local agriculture office. Add compost, rotate crops, and use mulch to keep soil moist.</p></article><article class="card"><h3>⚠️ Fertilizer safety</h3><p>Follow the label and soil-test advice. Wear gloves and a mask, never mix chemicals, store away from children and water sources, wash hands after use.</p></article></div>
<h2>Weather</h2><div class="card"><p>Live weather is not connected. It needs a real weather API called through a secure backend (never put API keys in frontend code).</p></div>
<h2>Market prices</h2><div class="card"><p>No verified price source is connected, so no prices are shown. A real version would show the source and last-updated date.</p></div><p class="note">General guidance only. Ask your local agriculture officer for advice for your crop and soil.</p>`},
complaints(){const g=gate();if(g)return g;const u=cur(),m=S.cmp.filter(c=>c.uid===u.id);return`<h2>📝 ${T('complaints')}</h2><div class="card"><form data-f="cmp" novalidate><label>${T('cat')}<select name="cat">${opts(CC)}</select></label><label>${T('desc')}<textarea name="desc" rows="4" required minlength="10" maxlength="500"></textarea></label><label>${T('photo')}<input type="file" name="photo" accept="image/*"></label><p class="note">Demo: only the photo file name is saved, not the image.</p><p class="msg" role="alert"></p><button class="btn">${T('submit')}</button></form></div><h3>${T('mine')}</h3><div class="grid">${m.length?m.map(cmpItem).join(''):`<p>${T('none')}</p>`}</div>`},
news(){return`<h2>📢 ${T('news')}</h2><div class="tools"><input data-q="n" placeholder="${T('search')}" aria-label="Search"><select data-q="nc" aria-label="Category"><option value="">${T('all')}</option>${opts(AC)}</select><input type="date" data-q="nd" aria-label="From date"></div><div class="grid" id="list">${LS.news()}</div>`},
dir(){const c=[...new Set(S.dir.map(x=>x.c))];return`<h2>📞 ${T('dir')}</h2><p class="note">Entries marked "Example" are samples. Replace them with verified details.</p><div class="tools"><input data-q="d" placeholder="${T('search')}" aria-label="Search"><select data-q="dc" aria-label="Category"><option value="">${T('all')}</option>${opts(c)}</select></div><div class="grid" id="list">${LS.dir()}</div>`},
dash(){const g=gate();if(g)return g;const u=cur(),m=S.cmp.filter(c=>c.uid===u.id),n=S.notes.filter(x=>x.uid===u.id).reverse(),sv=S.sch.filter(x=>(S.saved[u.id]||[]).includes(x.id));
return`<h2>${T('hello')}, ${esc(u.name)}</h2><div class="grid"><div class="card"><h3>${T('profile')}</h3><form data-f="prof" novalidate>${fld('name',T('name'),'text',u.name,'required')}${fld('phone',T('phone'),'tel',u.phone,'required inputmode="numeric" maxlength="10"')}<p>${esc(u.email)} · <span class="tag">${u.role}</span></p><p class="msg" role="alert"></p><button class="btn s">${T('save')}</button></form></div>
<div class="card"><h3>${T('mine')}</h3>${bars(Object.fromEntries(STS.map(s=>[stt(s),m.filter(c=>c.status===s).length])),m.length)}<button class="btn o s" data-go="complaints">+ ${T('complaints')}</button></div></div>
<h3>🔔 ${T('notes')}</h3><div class="card">${n.length?n.map(x=>`<p>${x.read?'':'🔵 '}${esc(x.msg)} <small>${x.date}</small></p>`).join('')+`<button class="btn o s" data-a="readall">${T('markread')}</button>`:T('none')}</div>
<h3>★ ${T('schemes')}</h3><div class="grid">${sv.length?sv.map(x=>`<article class="card"><b>${esc(x.name)}</b><p>${esc(x.ben)}</p></article>`).join(''):`<p>${T('none')}</p>`}</div>
<h3>${T('complaints')}</h3><div class="grid">${m.map(cmpItem).join('')}</div>${verify()}`},
admin(){const g=gate('admin');if(g)return g;
const tabs=['stats','complaints','news','schemes','users'];let h=`<h2>🛠️ ${T('admin')}</h2><div class="tools">${tabs.map(t=>`<button class="btn ${t===tab?'':'o'} s" data-a="tab" data-id="${t}">${T(t==='stats'?'stats':t==='users'?'users':t)}</button>`).join('')}</div><br>`;
if(tab==='stats'){const by={};S.cmp.forEach(c=>by[c.cat]=(by[c.cat]||0)+1);const st=Object.fromEntries(STS.map(s=>[s,S.cmp.filter(c=>c.status===s).length]));
h+=`<div class="grid"><div class="card"><h3>Users</h3><b>${S.users.length}</b></div><div class="card"><h3>${T('complaints')}</h3><b>${S.cmp.length}</b></div><div class="card"><h3>${T('news')}</h3><b>${S.ann.length}</b></div><div class="card"><h3>${T('schemes')}</h3><b>${S.sch.length}</b></div></div><div class="grid"><div class="card"><h3>${T('status')}</h3>${bars(st,S.cmp.length)}</div><div class="card"><h3>${T('cat')}</h3>${bars(by,S.cmp.length)}</div></div>`}
if(tab==='complaints')h+=`<button class="btn s" data-a="exp" data-id="cmp">${T('export')}</button><div class="grid">${S.cmp.map(c=>{const u=S.users.find(x=>x.id===c.uid);return`<article class="card" data-cid="${esc(c.id)}"><b>${esc(c.id)}</b> <span class="tag">${esc(c.cat)}</span>${tags(c)}<p>${esc(c.desc)}</p><small>${esc(u?u.name:'?')}</small><label>${T('status')}<select class="cs">${opts(STS,c.status)}</select></label><label>${T('resp')}<input class="cr" maxlength="300" value="${esc(c.resp)}"></label><button class="btn s" data-a="cupd" data-id="${esc(c.id)}">${T('save')}</button></article>`}).join('')||T('none')}</div>`;
if(tab==='news'){const e=S.ann.find(a=>a.id===S.editA)||{};h+=`<div class="card"><form data-f="ann" novalidate>${fld('title',T('title'),'text',e.title||'','required maxlength="100"')}<label>${T('desc')}<textarea name="body" rows="3" required maxlength="500">${esc(e.body||'')}</textarea></label><label>${T('cat')}<select name="cat">${opts(AC,e.cat)}</select></label>${fld('date',T('date'),'date',e.date||today(),'required')}<label><input type="checkbox" name="imp" style="width:auto" ${e.imp?'checked':''}> ${T('imp')}</label><p class="msg" role="alert"></p><button class="btn s">${T('save')}</button>${e.id?` <button type="button" class="btn o s" data-a="acancel">Cancel</button>`:''}</form></div><div class="grid">${S.ann.map(a=>annItem(a)+`<div><button class="btn o s" data-a="aedit" data-id="${a.id}">${T('edit')}</button> <button class="btn r s" data-a="adel" data-id="${a.id}">${T('del')}</button></div>`).join('')}</div>`}
if(tab==='schemes')h+=`<div class="card"><form data-f="sch" novalidate>${fld('name',T('name'),'text','','required maxlength="80"')}${fld('cat',T('cat'),'text','','required maxlength="30"')}${fld('elig','Eligibility','text','','required maxlength="200"')}${fld('docs','Documents','text','','required maxlength="200"')}${fld('ben','Benefits','text','','required maxlength="200"')}${fld('how','How to apply','text','','required maxlength="200"')}${fld('url','Official link (https, only if verified)','url','')}<p class="msg" role="alert"></p><button class="btn s">${T('save')}</button></form></div><div class="grid">${S.sch.map(x=>`<article class="card"><b>${esc(x.name)}</b><br><button class="btn r s" data-a="sdel" data-id="${x.id}">${T('del')}</button></article>`).join('')}</div>`;
if(tab==='users')h+=`<button class="btn s" data-a="exp" data-id="users">${T('export')}</button><div class="scroll"><table><tr><th>${T('name')}</th><th>${T('email')}</th><th>Role</th><th></th></tr>${S.users.map(u=>`<tr><td>${esc(u.name)}</td><td>${esc(u.email)}</td><td>${u.role}</td><td>${u.role==='admin'?'':`<button class="btn r s" data-a="udel" data-id="${u.id}">${T('del')}</button>`}</td></tr>`).join('')}</table></div>`;
return h}};
const CROPS=[{n:'Paddy (Rice)',s:'Kharif / Rabi',t:'Needs standing water in early growth. Use certified seed and level fields for even watering.'},{n:'Groundnut',s:'Kharif / Rabi',t:'Prefers well-drained sandy loam. Avoid waterlogging and rotate with cereals.'},{n:'Millets (Ragi, Bajra)',s:'Kharif',t:'Hardy, low-water crops that suit dry areas and are rich in nutrients.'},{n:'Sugarcane',s:'Year-round planting windows',t:'Needs regular irrigation and good drainage. Trash mulching saves water.'},{n:'Vegetables',s:'Seasonal',t:'Grow in raised beds, mulch, and check leaves often for pests.'}];

/* ---------- rendering ---------- */
function nav(){const u=cur();const it=[['home','🏠'],['schemes','📜'],['agri','🌱'],['complaints','📝'],['news','📢'],['dir','📞']];if(u)it.push(['dash','👤']);if(u&&u.role==='admin')it.push(['admin','🛠️']);it.push(u?['logout','🚪']:['login','🔑']);
$('#nav').innerHTML=it.map(([k,i])=>`<button ${k==='logout'?'data-a="logout"':`data-go="${k}"`} class="${view===k?'on':''}"><span>${i}</span>${esc(T(k))}</button>`).join('')}
function render(){document.documentElement.lang=S.lang;document.documentElement.dataset.theme=S.theme;$('#lang').textContent=S.lang==='ta'?'English':'தமிழ்';$('#theme').textContent=S.theme==='dark'?'☀️':'🌙';nav();
const u=cur(),n=u?S.notes.filter(x=>x.uid===u.id&&!x.read).length:0,b=$('#nb');b.hidden=!n;b.textContent=n;
let h;try{h=(V[view]||V.home)()}catch(e){h=`<div class="card">Something went wrong: ${esc(e.message)}</div>`}
$('#app').innerHTML=h+`<footer><p>© SmartVillage 360 – college demo project. Not connected to any government system.</p><p>${T('priv')}</p></footer>`}
function go(v){view=v;q={};render();scrollTo(0,0)}

/* ---------- events ---------- */
document.addEventListener('click',e=>{const b=e.target.closest('[data-go],[data-a],#lang,#theme');if(!b)return;const d=b.dataset,u=cur();
if(b.id==='lang'){S.lang=S.lang==='ta'?'en':'ta';save();return render()}
if(b.id==='theme'){S.theme=S.theme==='dark'?'light':'dark';save();return render()}
if(d.go)return go(d.go);
const id=d.id;
switch(d.a){
case'logout':S.session=null;save();toast('Logged out');return go('home');
case'eye':{const i=b.previousElementSibling;i.type=i.type==='password'?'text':'password';return}
case'save':{if(!u){toast(T('needlogin'),1);return go('login')}const a=S.saved[u.id]=S.saved[u.id]||[];const x=+id;const k=a.indexOf(x);k<0?a.push(x):a.splice(k,1);save();return $('#list').innerHTML=LS.schemes()}
case'readall':S.notes.forEach(n=>{if(n.uid===u.id)n.read=true});save();return render();
case'tab':tab=id;return render();
case'cupd':{const c=S.cmp.find(x=>x.id===id),r=b.closest('[data-cid]');c.status=r.querySelector('.cs').value;c.resp=r.querySelector('.cr').value.trim();notify(c.uid,`Complaint ${c.id} is now: ${c.status}`);save();toast('Complaint updated');return render()}
case'aedit':S.editA=+id;return render();
case'acancel':S.editA=null;return render();
case'adel':if(confirm('Delete this announcement?')){S.ann=S.ann.filter(a=>a.id!==+id);save();toast('Deleted');render()}return;
case'sdel':if(confirm('Delete this scheme?')){S.sch=S.sch.filter(a=>a.id!==+id);save();toast('Deleted');render()}return;
case'udel':if(confirm('Delete this user?')){S.users=S.users.filter(a=>a.id!==+id);save();toast('Deleted');render()}return;
case'exp':return id==='cmp'?csv('complaints',S.cmp.map(c=>({id:c.id,category:c.cat,description:c.desc,status:c.status,response:c.resp,date:c.date,demo:c.demo}))):csv('users',S.users.map(x=>({id:x.id,name:x.name,email:x.email,phone:x.phone,role:x.role})))}});
document.addEventListener('input',e=>{const k=e.target.dataset.q;if(!k)return;q[k]=e.target.value;const l=$('#list');if(l)l.innerHTML=LS[view]()});
function csv(name,rows){if(!rows.length)return toast('Nothing to export',1);const k=Object.keys(rows[0]);const c=v=>{v=String(v??'');if(/^[=+\-@]/.test(v))v="'"+v;return'"'+v.replace(/"/g,'""')+'"'};
const t=[k.join(','),...rows.map(r=>k.map(x=>c(r[x])).join(','))].join('\r\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+t],{type:'text/csv'}));a.download=name+'.csv';document.body.appendChild(a);a.click();a.remove();toast('Downloaded '+name+'.csv')}
document.addEventListener('submit',async e=>{e.preventDefault();const f=e.target,k=f.dataset.f;if(!k)return;const v=Object.fromEntries(new FormData(f)),u=cur();
const bad=m=>{const p=f.querySelector('.msg');if(p)p.textContent=m;toast(m,1)};const em=/^[^\s@]+@[^\s@]+\.[^\s@]+$/,ph=/^[6-9]\d{9}$/;
if(k==='login'){const x=S.users.find(a=>a.email===(v.email||'').trim().toLowerCase());if(!x||x.h!==await hash(v.pw,x.salt))return bad('Wrong email or password.');S.session=x.id;save();toast('Logged in (demo)');return go(x.role==='admin'?'admin':'dash')}
if(k==='reg'){const name=(v.name||'').trim(),email=(v.email||'').trim().toLowerCase();if(name.length<2)return bad('Enter your name.');if(!em.test(email))return bad('Enter a valid email.');if(!ph.test(v.phone))return bad('Phone must be 10 digits starting with 6-9.');if(!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(v.pw))return bad('Password needs 8+ characters with a letter and a number.');if(S.users.some(a=>a.email===email))return bad('This email is already registered.');
const salt=Math.random().toString(36).slice(2),id=Date.now();S.users.push({id,name,email,phone:v.phone,role:'villager',salt,h:await hash(v.pw,salt)});S.session=id;notify(id,'Welcome to SmartVillage 360 (demo).');save();toast('Registered (demo)');return go('dash')}
if(!u)return bad(T('needlogin'));
if(k==='prof'){if(v.name.trim().length<2)return bad('Enter your name.');if(!ph.test(v.phone))return bad('Phone must be 10 digits starting with 6-9.');u.name=v.name.trim();u.phone=v.phone;save();toast('Profile updated');return render()}
if(k==='cmp'){const d=(v.desc||'').trim();if(d.length<10)return bad('Please describe the problem (at least 10 characters).');const file=f.photo.files[0];if(file&&file.size>2e6)return bad('Photo must be under 2 MB.');
const id='SV-'+new Date().getFullYear()+'-'+Math.floor(1000+Math.random()*9000);S.cmp.push({id,uid:u.id,cat:v.cat,desc:d,photo:file?file.name:'',status:'Submitted',resp:'',date:today(),demo:false});notify(u.id,'Complaint '+id+' submitted.');save();toast('Submitted. Your ID: '+id);return render()}
if(u.role!=='admin')return bad('Admins only.');
if(k==='ann'){if(!v.title.trim()||!v.body.trim()||!v.date)return bad('Fill in all fields.');const o={title:v.title.trim(),body:v.body.trim(),cat:v.cat,date:v.date,imp:v.imp==='on',demo:false},e2=S.ann.find(a=>a.id===S.editA);e2?Object.assign(e2,o):S.ann.push({id:Date.now(),...o});S.editA=null;save();toast('Announcement saved');return render()}
if(k==='sch'){if(v.url&&!/^https:\/\//.test(v.url))return bad('Link must start with https://');S.sch.push({id:Date.now(),name:v.name.trim(),cat:v.cat.trim(),elig:v.elig.trim(),docs:v.docs.trim(),ben:v.ben.trim(),how:v.how.trim(),url:v.url||''});save();toast('Scheme added');return render()}});

(async function init(){S=load()||seed();const pwd={1:'Demo@123',2:'Admin@123'};let ch=0;for(const u of S.users)if(!u.h&&pwd[u.id]){u.h=await hash(pwd[u.id],u.salt);ch=1}if(ch)save();render()})();
