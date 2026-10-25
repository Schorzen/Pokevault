// Plaza: live face-to-face trading with friends (both players must be inside the plaza)
const PZ={x0:24,x1:36,y0:17,y1:26},inPlaza=(x,y)=>x>=PZ.x0&&x<PZ.x1+1&&y>=PZ.y0&&y<PZ.y1+1;
let LT=null;const lseen=new Set(),$p=id=>document.getElementById(id);
const other=d=>d.players.find(p=>p!=mp.uid());
function note(t){const e=$p("inv");e.innerHTML=t;e.classList.add("show");setTimeout(()=>e.classList.remove("show"),4000)}
async function startTrade(uid){const o=others[uid];if(!o)return;if(!Object.keys(S.col).length){alert("You need at least one card to trade.");return}
try{await mp.liveInvite(uid,o.name);pendCh={until:Date.now()+6e4}}catch(e){alert("Could not send the trade invite.")}}
function liveInv(d){const e=$p("inv");e.innerHTML=`<b>${esc(d.fromName)}</b> wants to trade with you in the Plaza<div class="two"><button class="alt" onclick="ansLive('${d.id}',1)">Accept</button><button class="alt" onclick="ansLive('${d.id}',0)">Decline</button></div>`;e.classList.add("show");setTimeout(()=>e.classList.remove("show"),6e4)}
async function ansLive(id,yes){$p("inv").classList.remove("show");try{await mp.liveSet(id,yes?{st:"open",ot:Date.now()}:{st:"decl"})}catch(e){}}
window.onLive=d=>{const now=Date.now(),me=mp.uid(),k=d.id+d.ts;
if(d.st=="invite"&&d.from!=me&&now-d.ts<9e4&&!lseen.has(k+"i")){lseen.add(k+"i");liveInv(d)}
if(d.st=="open"&&now-(d.ot||0)<6e5){if(!LT||LT.id!=d.id){if(!lseen.has(k+"o")){lseen.add(k+"o");openTrade(d)}}else{LT.d=d;tradeDraw();
 if(d.from==me&&d.players.every(p=>d.conf&&d.conf[p]))mp.liveFinish(d.id).catch(()=>{})}}
if(d.st=="done"&&now-(d.t2||0)<864e5&&S.ld!=k){S.ld=k;tradeApply(d)}
if(d.st=="decl"&&d.from==me&&now-d.ts<9e4&&!lseen.has(k+"x")){lseen.add(k+"x");pendCh=null;note(esc(d.toName)+" declined the trade.")}
if(d.st=="cancel"&&LT&&LT.id==d.id)tradeClose("Trade cancelled.")};
function openTrade(d){pendCh=null;LT={id:d.id,d};E.enc={trade:true};E.hold=null;let e=$p("tw");if(!e){e=document.createElement("div");e.id="tw";document.body.appendChild(e)}e.classList.add("show");sfx("door");tradeDraw()}
function tradeClose(msg){LT=null;E.enc=null;const e=$p("tw");e&&e.classList.remove("show");pendCh=null;if(msg)note(msg)}
function tradeApply(d){const me=mp.uid(),o=other(d),mine=(d.offer&&d.offer[me])||[],theirs=(d.offer&&d.offer[o])||[];
mine.forEach(c=>{const q=S.col[c.id];if(q){q.n--;if(q.n<=0)delete S.col[c.id]}});theirs.forEach(c=>addCard(c));
save();hdr();sfx("catch");tradeClose("Trade complete! You got "+(theirs.map(c=>cap(c.name)).join(", ")||"nothing")+".")}
async function tradePick(id){if(!LT)return;const d=LT.d,me=mp.uid(),o=other(d);let list=((d.offer&&d.offer[me])||[]).slice();
const i=list.findIndex(c=>c.id==id);if(i>=0)list.splice(i,1);else{if(list.length>=3||!S.col[id])return;list.push(slim(S.col[id]))}
try{await mp.liveSet(d.id,{["offer."+me]:list,["conf."+me]:false,["conf."+o]:false})}catch(e){}}
async function tradeConfirm(){if(!LT)return;const d=LT.d,me=mp.uid(),mine=(d.offer&&d.offer[me])||[],theirs=(d.offer&&d.offer[other(d)])||[];
if(!mine.length&&!theirs.length)return;try{await mp.liveSet(d.id,{["conf."+me]:!(d.conf&&d.conf[me])})}catch(e){}}
async function tradeCancel(){if(!LT)return;const id=LT.id;try{await mp.liveSet(id,{st:"cancel"})}catch(e){}tradeClose("Trade cancelled.")}
function tradeDraw(){if(!LT)return;const e=$p("tw"),d=LT.d,me=mp.uid(),o=other(d),mine=(d.offer&&d.offer[me])||[],theirs=(d.offer&&d.offer[o])||[],cm=d.conf&&d.conf[me],ct=d.conf&&d.conf[o];
const name=esc(me==d.from?d.toName:d.fromName),slot=c=>`<div class="tsl"><img src="${img(c.id)}" alt=""><b>${cap(c.name)}</b><span>${c.rar}</span></div>`,empty=`<div class="tsl em">empty</div>`;
const mineH=[0,1,2].map(i=>mine[i]?slot(mine[i]):empty).join(""),thH=[0,1,2].map(i=>theirs[i]?slot(theirs[i]):empty).join("");
const all=Object.values(S.col).map(eff).sort((a,b)=>pw(b)-pw(a));
e.innerHTML=`<div class="twtop"><b>Live trade with ${name}</b><button class="xb" onclick="tradeCancel()">Cancel</button></div>
<div class="twbody"><div class="twcol"><h4>You offer ${cm?'<u>✓ ready</u>':""}</h4>${mineH}</div>
<div class="twpick"><h4>Tap your cards to offer (max 3)</h4><div class="lablist" style="width:100%">${all.map(q=>`<div class="lm ${mine.some(c=>c.id==q.id)?"on":""}" onclick="tradePick(${q.id})"><img src="${img(q.id)}" alt=""><b>${cap(q.name)}</b><span>Lv ${q.lv||1}</span></div>`).join("")}</div></div>
<div class="twcol"><h4>${name} offers ${ct?'<u>✓ ready</u>':""}</h4>${thH}</div></div>
<div class="twbar"><span>Changing an offer clears both confirmations.</span><button class="go" ${mine.length||theirs.length?"":"disabled"} onclick="tradeConfirm()">${cm?"Waiting… tap to undo":"Confirm trade"}</button></div>`}
