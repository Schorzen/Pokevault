// Explore: walk around a map, find Pokémon in tall grass, throw balls to catch them
let VW=14,VH=7;const TS=32,MW=96,MH=64,CP={common:.7,rare:.5,epic:.3,legendary:.12};
const EMAP=(()=>{let s=7;const r=()=>(s=(s*1103515245+12345)&0x7fffffff)/0x7fffffff;
const m=Array.from({length:MH},()=>Array(MW).fill(0));
for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)if(x<2||y<2||x>=MW-2||y>=MH-2||r()<.1)m[y][x]=1;
for(let k=0;k<90;k++){const w=3+Math.floor(r()*5),h=2+Math.floor(r()*4),x0=2+Math.floor(r()*(MW-w-4)),y0=2+Math.floor(r()*(MH-h-4));for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++)m[y][x]=2}
[[22,8,6,4],[60,20,9,6],[30,44,8,6],[80,40,9,6],[10,28,6,5],[50,50,7,5]].forEach(([a,b,w,h])=>{for(let y=b;y<b+h;y++)for(let x=a;x<a+w;x++)m[y][x]=5});
const px=MW>>1;for(let y=2;y<MH-2;y++){m[y][px]=3;m[y][px+1]=3}for(let x=2;x<MW-2;x++){m[14][x]=3;m[15][x]=3;m[40][x]=3;m[41][x]=3}for(let y=2;y<MH-2;y++)[20,21,76,77].forEach(q=>m[y][q]=3);
for(let i=0;i<320;i++){const x=2+Math.floor(r()*(MW-4)),y=2+Math.floor(r()*(MH-4));if(m[y][x]==0)m[y][x]=4}
[[9,110],[10,150],[11,220],[12,110]].forEach(([tt,n])=>{for(let i=0;i<n;i++){const x=2+Math.floor(r()*(MW-4)),y=2+Math.floor(r()*(MH-4));if(m[y][x]==0)m[y][x]=tt}});
for(let y=9;y<=13;y++)for(let x=8;x<=16;x++)m[y][x]=0;
for(let x=10;x<=14;x++){m[10][x]=6;m[11][x]=6;m[12][x]=8;m[13][x]=8}m[13][12]=7;[[9,13],[15,13],[9,12],[15,12],[8,11],[16,11]].forEach(([x,y])=>m[y][x]=4);
for(let y=16;y<=27;y++)for(let x=23;x<=37;x++)m[y][x]=0;
for(let x=22;x<=38;x++)m[16][x]=3;
for(let y=17;y<=26;y++)for(let x=24;x<=36;x++)m[y][x]=14;
[[29,21],[30,21],[29,22],[30,22]].forEach(([x,y])=>m[y][x]=15);
[[24,17],[36,17],[24,26],[36,26],[24,21],[36,21]].forEach(([x,y])=>m[y][x]=16);
[[27,19],[32,19],[27,24],[32,24]].forEach(([x,y])=>m[y][x]=17);
return m})();
const DIRS=[[0,-1],[1,0],[0,1],[-1,0]];
let LITE=false,LMODE="auto";try{LMODE=localStorage.getItem("pv_lite")||"auto"}catch(e){}LITE=LMODE=="on";
const TCH=new Map(),TRS={};let VIG=null,VIGK="",MINI=null;
function applyLite(){document.body.classList.toggle("lite",LITE);const b=document.getElementById("ltb");if(b)b.textContent="Lite: "+(LMODE=="auto"?"Auto"+(LITE?" ✓":""):LMODE=="on"?"On":"Off")}
function toggleLite(){LMODE=LMODE=="auto"?"on":LMODE=="on"?"off":"auto";LITE=LMODE=="on";E.fa=16;E.fc=0;TCH.clear();try{localStorage.setItem("pv_lite",LMODE)}catch(e){}applyLite()}
function tileImg(t,x,y,fr){const k=((y+2)*(MW+6)+(x+2))*4+fr;let c=TCH.get(k);if(c)return c;c=document.createElement("canvas");c.width=c.height=TS;ground(c.getContext("2d"),t,x,y,0,0,fr*(t==5?.78:.52));
TCH.set(k,c);if(TCH.size>2400)TCH.delete(TCH.keys().next().value);return c}
function treeImg(x,y){const v=hs(x,y)>.5?1:0;return TRS[v]||(TRS[v]=(()=>{const c=document.createElement("canvas");c.width=32;c.height=44;tree(c.getContext("2d"),x,y,0,10,0);return c})())}
const MCOL=["#6bbf5f","#2f7d3b","#3f9e4f","#e6d79c","#7ccb6c","#4aa3df","#2a9d8f","#ffd43b","#eceff4","#8b8f98","#2f7d3b","#6bbf5f","#6bbf5f","#6bbf5f","#cfc9e0","#4aa3df","#444","#8b5a2b"];
function drawMini(){const cv=document.getElementById("mini");if(!cv)return;if(!MINI){MINI=document.createElement("canvas");MINI.width=MW;MINI.height=MH;const m=MINI.getContext("2d");for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){m.fillStyle=MCOL[EMAP[y][x]];m.fillRect(x,y,1,1)}}
const c=cv.getContext("2d");c.drawImage(MINI,0,0);c.fillStyle="#3b82f6";for(const u in others)c.fillRect(Math.round(others[u].px)-1,Math.round(others[u].py)-1,3,3);c.fillStyle="#ef4444";c.fillRect(Math.round(E.px)-2,Math.round(E.py)-2,5,5);c.fillStyle="#fff";c.fillRect(Math.round(E.px)-1,Math.round(E.py)-1,3,3)}
let others={};
let E={x:17,y:14,tx:16.5,ty:13.5,px:17.5,py:14.5,vx:0,vy:0,sp:0,wt:0,jx:0,jy:0,joy:false,cx:0,cy:0,t:1,d:2,hold:null,step:0,enc:null,last:0},runId=0,busyE=false;
function eb(){if(S.balls==null){S.balls=10;S.bl=Date.now()}const n=Date.now();
if(S.balls>=10)S.bl=n;else{const g=Math.floor((n-S.bl)/24e4);if(g>0){S.balls=Math.min(10,S.balls+g);S.bl=S.balls>=10?n:S.bl+g*24e4}}}
function hud0(){eb();const e=document.getElementById("exb");if(e)e.textContent="Poké Balls "+S.balls+"/10"+(S.balls<10?" · +1 in "+Math.max(1,Math.ceil((24e4-(Date.now()-S.bl))/6e4))+" min":"")}
const ch=d=>`<svg viewBox="0 0 24 24" style="transform:rotate(${d}deg)"><path d="M6 15l6-6 6 6"/></svg>`;
function exploreView(){VH=7;VW=Math.max(10,Math.min(26,Math.round(VH*innerWidth/innerHeight)));
document.getElementById("app").innerHTML=`<div class="ex"><canvas id="cv" width="${VW*TS}" height="${VH*TS}"></canvas>
<div class="exhud"><button class="xb" onclick="go('home')">‹ Lobby</button><div class="exr"><span id="exb"></span><button class="xb" id="mu2" onclick="toggleMute()"></button><button class="xb" id="ltb" onclick="toggleLite()"></button><button class="xb" onclick="go('store')">Store</button></div></div>
<canvas id="mini" width="${MW}" height="${MH}"></canvas><div id="plz">Plaza · trade with friends</div><button class="emb" id="emb" onclick="toggleEm()"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 14a4.5 4.5 0 008 0M9 10h.01M15 10h.01"/></svg></button><div id="emw"></div><div id="chal"></div><div id="enc"></div><div class="joy" id="joy"><div class="knob" id="knob"></div></div></div>`;
bindJoy();paintMute();applyLite();hud();others={};E.ls=0;E.cx=0;E.jx=E.jy=0;E.joy=false;PT.length=0;E.ck="";window.mp&&mp.start(syncOthers);E.hold=null;E.last=0;runId++;const id=runId;requestAnimationFrame(t=>loop(t,id))}
const hold=d=>{const v=DIRS[d];E.joy=true;E.jx=v[0];E.jy=v[1]},rel=()=>{E.joy=false;E.jx=E.jy=0};
const KEYS={},PT=[];
const walk=(x,y)=>x>=0&&y>=0&&x<MW&&y<MH&&[0,2,3,4,7,11,12,14].includes(EMAP[y][x])&&!(EMAP[y][x]==7&&Date.now()<(E.labOut||0));
addEventListener("keydown",e=>{if(view=="explore"&&/^(Arrow|[wasd]$)/.test(e.key)){KEYS[e.key]=1;e.preventDefault()}});
addEventListener("keyup",e=>{delete KEYS[e.key]});
// smooth free movement: speed ramps up and down, slides along walls, runs when the stick is pushed fully
function move(dt){const s=dt/1000;let jx=E.jx,jy=E.jy;
if(!E.joy){jx=(KEYS.ArrowRight||KEYS.d?1:0)-(KEYS.ArrowLeft||KEYS.a?1:0);jy=(KEYS.ArrowDown||KEYS.s?1:0)-(KEYS.ArrowUp||KEYS.w?1:0)}
if(E.enc||busyE){jx=jy=0}
let m=Math.hypot(jx,jy);if(m>1){jx/=m;jy/=m;m=1}
const spd=m<.12?0:m>.86?6.6:4.4*Math.min(1,m/.6),tx=m?jx/m*spd:0,ty=m?jy/m*spd:0,k=Math.min(1,s*(spd?12:16));
E.vx+=(tx-E.vx)*k;E.vy+=(ty-E.vy)*k;
const hw=.2,hh=.1,bl=(x,y)=>!walk(Math.floor(x-hw),Math.floor(y-hh))||!walk(Math.floor(x+hw),Math.floor(y-hh))||!walk(Math.floor(x-hw),Math.floor(y+hh))||!walk(Math.floor(x+hw),Math.floor(y+hh));
let nx=E.px+E.vx*s;if(bl(nx,E.py)){nx=E.px;E.vx=0}E.px=nx;let ny=E.py+E.vy*s;if(bl(E.px,ny)){ny=E.py;E.vy=0}E.py=ny;
E.sp=Math.hypot(E.vx,E.vy);E.ds=s;
if(E.sp>.3){E.d=Math.abs(E.vx)>Math.abs(E.vy)*1.15?(E.vx>0?1:3):(E.vy>0?2:0);E.wt+=s*E.sp*.42}
E.tx=Math.round((E.px-.5)*4)/4;E.ty=Math.round((E.py-.5)*4)/4;
const gx=Math.floor(E.px),gy=Math.floor(E.py);if(gx!=E.x||gy!=E.y){E.x=gx;E.y=gy;arrive()}
const cx=E.px*TS,cy=(E.py-.15)*TS;if(!E.cx){E.cx=cx;E.cy=cy}else{const q=Math.min(1,s*7);E.cx+=(cx-E.cx)*q;E.cy+=(cy-E.cy)*q}
if(!LITE){if(E.sp>.3){E.pc=(E.pc||0)-s;if(E.pc<=0){E.pc=E.sp>5?.08:.15;const g=at(gx,gy)==2;PT.push({x:E.px*TS+Math.random()*8-4,y:E.py*TS+Math.random()*3,vx:(Math.random()-.5)*22-E.vx*3,vy:-(10+Math.random()*14),l:.42,m:.42,c:g?"#58b862":"#e6d79c",r:g?2:3});if(PT.length>40)PT.shift()}}
for(const p of PT){p.l-=s;p.x+=p.vx*s;p.y+=p.vy*s;p.vy+=40*s}while(PT.length&&PT[0].l<=0)PT.shift()}else PT.length=0}
function loop(ts,id){if(view!="explore"){if(id===runId){window.mp&&(mp.stop(),mp.leave());others={}}return}if(id!==runId)return;if(LITE&&E.last&&ts-E.last<31){requestAnimationFrame(t=>loop(t,id));return}const dt=E.last?Math.min(50,ts-E.last):16;E.last=ts;
if(LMODE=="auto"&&!LITE){E.fa=(E.fa||16)*.96+dt*.04;E.fc=(E.fc||0)+1;if(E.fc>150&&E.fa>27){LITE=true;applyLite()}}
move(dt);
if(ts-(E.hs||0)>1000){E.hs=ts;hud()}if(ts-(E.ms||0)>300){E.ms=ts;drawMini()}social();const cv=document.getElementById("cv");if(!cv)return;draw(cv.getContext("2d"));requestAnimationFrame(t=>loop(t,id))}
function arrive(){if(EMAP[E.y][E.x]==7){if(Date.now()>(E.labOut||0))enterLab();return}if(EMAP[E.y][E.x]==2)sfx("grass");if(EMAP[E.y][E.x]==2&&Math.random()<(S.lure>Date.now()?.28:.14))encounter()}
async function encounter(){busyE=true;{const n=document.getElementById("cv");n&&(n.classList.add("flash"),setTimeout(()=>n.classList.remove("flash"),520))}try{const ids=[];while(ids.length<4){const i=1+Math.floor(Math.random()*TOTAL);if(!ids.includes(i))ids.push(i)}
const c=await Promise.all(ids.map(getP)),W={common:62,rare:25,epic:10,legendary:3},tot=c.reduce((a,p)=>a+W[p.rar],0);let q=Math.random()*tot,k=0;for(;k<c.length-1;k++){q-=W[c[k].rar];if(q<=0)break}
await new Promise(r=>setTimeout(r,450));E.enc=c[k];const p=c[k];const el=document.getElementById("enc");if(!el||view!="explore"){E.enc=null;busyE=false;return}
wildBattle(p)}catch(e){}busyE=false}
function endEnc(){E.enc=null;E.hold=null;document.getElementById("enc").classList.remove("show");hud()}
const ballBtns=()=>`<button class="alt" onclick="throwBall('p')">Poké ×${S.balls}</button>${S.gb>0?`<button class="alt" onclick="throwBall('g')">Great ×${S.gb}</button>`:""}${S.ub>0?`<button class="alt" onclick="throwBall('u')">Ultra ×${S.ub}</button>`:""}<button class="alt" onclick="endEnc()">Run</button>`;
function throwBall(t){eb();const p=E.enc,m=document.getElementById("em"),k={p:"balls",g:"gb",u:"ub"}[t];if(!p||!k)return;
if((S[k]||0)<1){m.textContent="None left. Visit the Store.";return}
S[k]--;const done=x=>{m.textContent=x;document.getElementById("eb").innerHTML=`<button class="alt" onclick="endEnc()">Continue</button>`;save();hdr()};
if(Math.random()<Math.min(.95,CP[p.rar]*{p:1,g:1.5,u:2}[t])){addCard(slim(p));done("Gotcha! "+cap(p.name)+" was caught!")}
else if(Math.random()<.35)done(cap(p.name)+" ran away!");else{m.textContent="It broke free!";document.getElementById("eb").innerHTML=ballBtns();save()}}
const hs=(x,y,k=0)=>{let h=Math.imul(x+k*131,374761393)^Math.imul(y+k*17,668265263);h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967295};
const at=(x,y)=>EMAP[y]&&EMAP[y][x]!=null?EMAP[y][x]:1;
function draw(c){const fx=E.px-.5,fy=E.py-.5,tm=performance.now()/1000,nowE=Date.now();
const ox=Math.round(Math.max(0,Math.min(MW*TS-VW*TS,E.cx-VW*TS/2))),oy=Math.round(Math.max(0,Math.min(MH*TS-VH*TS,E.cy-VH*TS/2)));
const x0=Math.floor(ox/TS),x1=Math.ceil((ox+VW*TS)/TS),y0=Math.floor(oy/TS),y1=Math.ceil((oy+VH*TS)/TS)+1;
c.imageSmoothingEnabled=false;
for(let y=y0-1;y<=y1;y++)for(let x=x0;x<=x1;x++){const t=at(x,y),an=!LITE&&(t==2||t==5),fr=an?Math.floor(tm*5)%4:0;c.drawImage(tileImg(t,x,y,fr),x*TS-ox,y*TS-oy)}
const px=Math.round(fx*TS-ox),py=Math.round(E.py*TS-29-oy),objs=[];
for(let y=y0;y<=y1+1;y++)for(let x=x0-1;x<=x1;x++)if(at(x,y)==1&&y>=0&&x>=0&&y<MH&&x<MW)objs.push([y,0,x]);
objs.push([E.py,1]);for(const u in others)objs.push([others[u].py+.5,2,others[u]]);objs.sort((a,b)=>a[0]-b[0]);
for(const o of objs){if(o[1]==1){player(c,px,py,tm);if(E.em!=null&&nowE<E.eUntil)ebub(c,px,py,E.em,(E.eUntil-nowE)/3e3)}else if(o[1]==2){const u=o[2],qx=Math.round(u.px*TS-ox),qy=Math.round((u.py+.5)*TS-29-oy);player(c,qx,qy,tm,{d:u.d,mv:u.mv,k:"#3b82f6"});tag(c,qx,qy,u.name);if(u.em!=null&&nowE<u.eUntil)ebub(c,qx,qy-12,u.em,(u.eUntil-nowE)/3e3)}else c.drawImage(treeImg(o[2],o[0]),o[2]*TS-ox,o[0]*TS-oy-10)}
{const gx=Math.floor(E.px),gy=Math.floor(E.py);if(at(gx,gy)==2)blades(c,gx,gy,px,py+14,tm,true)}
for(const p of PT){c.globalAlpha=Math.max(0,p.l/p.m);c.fillStyle=p.c;c.fillRect(Math.round(p.x-ox),Math.round(p.y-oy),p.r,p.r)}c.globalAlpha=1;
if(!LITE){const k=VW+"x"+VH;if(VIGK!=k){VIG=document.createElement("canvas");VIG.width=VW*TS;VIG.height=VH*TS;const g=VIG.getContext("2d"),gr=g.createRadialGradient(VW*TS/2,VH*TS/2,VH*TS*.45,VW*TS/2,VH*TS/2,VW*TS*.75);gr.addColorStop(0,"#0000");gr.addColorStop(1,"#0a1a2a55");g.fillStyle=gr;g.fillRect(0,0,VW*TS,VH*TS);VIGK=k}c.drawImage(VIG,0,0)}}
function blades(c,x,y,px,py,tm,front){const cols=["#2f8a44","#43b05a","#7fd678"];
for(let i=0;i<8;i++){const bx=Math.floor(hs(x,y,i)*26)+2,by=Math.floor(hs(x,y,i+9)*14)+(front?0:10),sw=Math.round(Math.sin(tm*3+x*.9+i)*1.4),h=front?8:9+Math.floor(hs(x,y,i+3)*5);
c.fillStyle=cols[i%3];c.fillRect(px+bx+sw,py+by,2,h);c.fillRect(px+bx+sw-2,py+by+3,2,h-3);c.fillRect(px+bx+sw+2,py+by+2,2,h-2)}}
function ground(c,t,x,y,px,py,tm){const r=hs(x,y);
if(t>=14){const fill=(a,b,w,h,col)=>{c.fillStyle=col;c.fillRect(px+a,py+b,w,h)},circ=(a,b,rad,col)=>{c.fillStyle=col;c.beginPath();c.arc(px+a,py+b,rad,0,7);c.fill()};
fill(0,0,TS,TS,(x+y)&1?"#e1dcec":"#d6d0e4");fill(0,0,TS,1,"#c3bcd6");fill(0,0,1,TS,"#c3bcd6");
if(t==14&&x==30&&y==17){c.fillStyle="#8a7fb0";c.font="bold 10px sans-serif";c.textAlign="center";c.fillText("PLAZA",px+16,py+20);c.textAlign="left"}
if(t==15){const cx=x==29?TS:0,cy=y==21?TS:0;circ(cx,cy,30,"#b5aecb");circ(cx,cy,26,"#9fd8f5");circ(cx,cy,22,"#7cc4ee");circ(cx,cy,9,"#b5aecb");circ(cx,cy,5,"#e6f6ff");circ(cx,cy,2,"#fff")}
if(t==16){fill(0,0,TS,TS,(x+y)&1?"#e1dcec":"#d6d0e4");circ(16,28,6,"#0002");fill(13,10,6,18,"#4a4560");circ(16,9,9,"#ffe58a44");circ(16,9,6,"#ffe58a");circ(16,9,3,"#fff7c4");fill(11,26,10,3,"#5d5778")}
if(t==17){fill(3,24,26,3,"#0002");fill(4,12,24,5,"#a06a35");fill(4,18,24,5,"#8b5a2b");fill(6,23,3,6,"#5d4524");fill(23,23,3,6,"#5d4524")}return}
if(t==6){c.fillStyle="#2a9d8f";c.fillRect(px,py,TS,TS);c.fillStyle="#238a7e";for(let i=0;i<4;i++)c.fillRect(px,py+i*8+6,TS,2);c.fillStyle="#1f7a70";
if(at(x-1,y)!=6)c.fillRect(px,py,3,TS);if(at(x+1,y)!=6)c.fillRect(px+TS-3,py,3,TS);if(at(x,y-1)!=6)c.fillRect(px,py,TS,3);if(y==11)c.fillRect(px,py+TS-5,TS,5);
if(x==12&&y==10){c.fillStyle="#fff";c.beginPath();c.arc(px+16,py+20,11,0,7);c.fill();c.fillStyle="#e03131";c.beginPath();c.arc(px+16,py+20,11,Math.PI,0);c.fill();c.fillStyle="#111";c.fillRect(px+5,py+19,22,2);c.fillStyle="#fff";c.beginPath();c.arc(px+16,py+20,4,0,7);c.fill();c.strokeStyle="#111";c.lineWidth=1.5;c.stroke()}return}
if(t==8||t==7){c.fillStyle="#eceff4";c.fillRect(px,py,TS,TS);c.fillStyle="#d5dae3";c.fillRect(px,py+10,TS,1);c.fillRect(px,py+21,TS,1);if(y==13){c.fillStyle="#c3cad6";c.fillRect(px,py+TS-4,TS,4)}
if(t==8&&y==12&&(x==10||x==14)){c.fillStyle="#35597a";c.fillRect(px+4,py+4,24,24);c.fillStyle="#9fe3f2";c.fillRect(px+6,py+6,20,20);c.fillStyle="#35597a";c.fillRect(px+15,py+6,2,20);c.fillRect(px+6,py+15,20,2)}
if(t==8&&y==12&&x==12){c.fillStyle="#2a9d8f";c.fillRect(px+2,py+8,28,16);c.fillStyle="#fff";c.font="bold 11px sans-serif";c.textAlign="center";c.fillText("LAB",px+16,py+20);c.textAlign="left"}
if(t==7){c.fillStyle="#35597a";c.fillRect(px+3,py+2,26,30);c.fillStyle="#9fe3f2";c.fillRect(px+6,py+5,20,27);c.fillStyle="#35597a";c.fillRect(px+15,py+5,2,27);c.fillStyle="#ffd43b";c.fillRect(px+12,py+19,2,4);c.fillRect(px+18,py+19,2,4);c.fillStyle="#ffffff55";c.fillRect(px+7,py+6,5,12)}return}
if(t==3){c.fillStyle="#ebdfae";c.fillRect(px,py,TS,TS);c.fillStyle="#d9c98f";for(let i=0;i<4;i++)c.fillRect(px+Math.floor(hs(x,y,i)*28)+1,py+Math.floor(hs(x,y,i+5)*28)+1,2,2);
c.fillStyle="#c9b77c";if(at(x,y-1)!=3&&at(x,y-1)!=2)c.fillRect(px,py,TS,3);if(at(x,y+1)!=3&&at(x,y+1)!=2)c.fillRect(px,py+TS-3,TS,3);if(at(x-1,y)!=3&&at(x-1,y)!=2)c.fillRect(px,py,3,TS);if(at(x+1,y)!=3&&at(x+1,y)!=2)c.fillRect(px+TS-3,py,3,TS);return}
if(t==5){c.fillStyle="#3d9be0";c.fillRect(px,py,TS,TS);c.fillStyle="#58b0ee";c.fillRect(px,py+8,TS,6);c.fillRect(px,py+22,TS,6);
const w=Math.sin(tm*2+x*1.7+y*1.1);c.fillStyle="#bfe6ff";c.fillRect(px+8+Math.round(w*5),py+10,8,2);c.fillRect(px+4-Math.round(w*4),py+24,10,2);
c.fillStyle="#d9f0ff";if(at(x,y-1)!=5)c.fillRect(px,py,TS,3);if(at(x,y+1)!=5)c.fillRect(px,py+TS-3,TS,3);if(at(x-1,y)!=5)c.fillRect(px,py,3,TS);if(at(x+1,y)!=5)c.fillRect(px+TS-3,py,3,TS);return}
c.fillStyle=t==2?"#5aa84e":(x+y)&1?"#7ccb6c":"#76c466";c.fillRect(px,py,TS,TS);
if(t!=2){c.fillStyle="#63b055";for(let i=0;i<3;i++)c.fillRect(px+Math.floor(hs(x,y,i)*28)+1,py+Math.floor(hs(x,y,i+4)*28)+1,2,2);c.fillStyle="#9be28a";c.fillRect(px+Math.floor(r*24)+3,py+Math.floor(hs(x,y,7)*24)+3,2,2)}
if(t==4){const col=["#ff6b6b","#ffd43b","#f783ac","#74c0fc"][Math.floor(r*4)];for(const[a,b]of[[8,10],[20,19]]){c.fillStyle="#2f8a44";c.fillRect(px+a+1,py+b+3,2,6);c.fillStyle=col;c.fillRect(px+a-1,py+b,6,2);c.fillRect(px+a+1,py+b-2,2,6);c.fillStyle="#ffe066";c.fillRect(px+a+1,py+b,2,2)}}
const ell=(a,b,w,h,col)=>{c.fillStyle=col;c.beginPath();c.ellipse(px+a,py+b,w,h,0,0,7);c.fill()};
if(t==9){ell(16,27,13,5,"#0003");c.fillStyle="#7d828c";c.beginPath();c.moveTo(px+4,py+26);c.lineTo(px+6,py+14);c.lineTo(px+14,py+6);c.lineTo(px+24,py+8);c.lineTo(px+29,py+18);c.lineTo(px+27,py+27);c.fill();
c.fillStyle="#9aa0ab";c.beginPath();c.moveTo(px+8,py+15);c.lineTo(px+14,py+9);c.lineTo(px+22,py+10);c.lineTo(px+16,py+17);c.fill();c.fillStyle="#5f646e";c.beginPath();c.moveTo(px+28,py+18);c.lineTo(px+27,py+27);c.lineTo(px+14,py+27);c.lineTo(px+20,py+19);c.fill();c.fillStyle="#4b5059";c.fillRect(px+12,py+19,5,1);c.fillRect(px+16,py+20,1,4)}
if(t==10){ell(16,27,13,4,"#0003");ell(10,19,9,8,"#2d7f3e");ell(22,19,9,8,"#2d7f3e");ell(16,14,10,9,"#3a9a4c");ell(13,11,4,3,"#5cbc6c");c.fillStyle="#e8473d";c.fillRect(px+19,py+16,3,3);c.fillRect(px+9,py+21,3,3);c.fillRect(px+24,py+22,3,3)}
if(t==11){for(let i=0;i<5;i++){const a=4+hs(x,y,20+i)*24,b=6+hs(x,y,30+i)*22;ell(a+1,b+1,3.5,2.5,"#6f747d");ell(a,b,3.5,2.5,"#b9bec7")}}
if(t==12){for(const[a,b,cl]of[[10,20,"#e8473d"],[21,14,"#f59f00"]]){c.fillStyle="#f1ebdd";c.fillRect(px+a-1,py+b,3,6);ell(a,b,6,4,cl);c.fillStyle="#fff";c.fillRect(px+a-3,py+b-2,2,2);c.fillRect(px+a+1,py+b-1,2,2)}}
if(t==2)blades(c,x,y,px,py,tm,false)}
function tree(c,x,y,px,py,tm){const v=hs(x,y);c.fillStyle="#0003";c.beginPath();c.ellipse(px+16,py+29,13,5,0,0,7);c.fill();
c.fillStyle="#5a3a1e";c.fillRect(px+13,py+20,7,11);c.fillStyle="#7b5230";c.fillRect(px+13,py+20,3,11);
c.fillStyle=v>.5?"#1d6a34":"#1b6330";c.beginPath();c.arc(px+16,py+10,15,0,7);c.fill();
c.fillStyle="#2c8a46";c.beginPath();c.arc(px+13,py+8,11,0,7);c.fill();c.fillStyle="#4db366";c.beginPath();c.arc(px+9,py+4,5,0,7);c.fill();
c.fillStyle="#1d6a34";c.fillRect(px+20,py+10,2,2);c.fillRect(px+10,py+14,2,2);c.fillRect(px+22,py+16,2,2)}
function player(c,x,y,tm,o){const d=o?o.d:E.d,mv=o?o.mv:E.sp>.3,run=!o&&E.sp>5,k=o?o.k:"#e03131",ph=o?(tm*2.4)%1:E.wt%1,fr=mv?Math.floor(ph*4)%4:0,
sw=[-1,0,1,0][fr],bob=mv?(fr%2?-1:0):(Math.sin(tm*2.4)>.7?-1:0),ln=run?(d==1?2:d==3?-2:0):0,Y=y+bob,R=(a,b,w,h,col)=>{c.fillStyle=col;c.fillRect(a,b,w,h)};
c.fillStyle="#0004";c.beginPath();c.ellipse(x+16,y+29,9,3.5,0,0,7);c.fill();
const sk="#f2c9a0",jk="#3b5bdb",jd="#2f49b0",pn="#2b2f45",sh="#f3f3f3";
if(d==1||d==3){const f=d==1?1:-1;
R(x+14-f*sw*3,Y+24,5,6,"#1f2335");R(x+14-f*sw*3+(f>0?1:-1),Y+29,5,2,"#cfd2dc");R(x+14+f*sw*3-1,Y+16,4,9,"#2a3f9e");
R(f>0?x+8+ln:x+20+ln,Y+15,4,9,"#f5c518");R(x+11+ln,Y+14,10,11,jk);R(x+11+ln,Y+22,10,3,jd);
R(x+13+f*sw*3,Y+24,5,6,pn);R(x+13+f*sw*3+(f>0?1:-1),Y+29,5,2,sh);R(x+14-f*sw*3,Y+16,4,9,jd);R(x+14-f*sw*3,Y+24,4,3,sk);
R(x+11+ln,Y+5,11,11,sk);R(f>0?x+11+ln:x+18+ln,Y+5,4,8,"#3a2a1a");R(x+10+ln,Y+1,13,6,k);R(f>0?x+20+ln:x+5+ln,Y+6,6,2,k);R(f>0?x+19+ln:x+12+ln,Y+10,2,3,"#1f1f2e")}
else{const ly=[-1,0,1,0][fr],ry=-ly;
R(x+10,Y+24,5,6,pn);R(x+17,Y+24,5,6,pn);R(x+9,Y+29+ly,6,2,sh);R(x+17,Y+29+ry,6,2,sh);R(x+9,Y+14,14,11,jk);R(x+9,Y+22,14,3,jd);
if(d==0)R(x+11,Y+15,10,8,"#f5c518");
R(x+6,Y+16-ly,3,8,jd);R(x+23,Y+16-ry,3,8,jd);R(x+6,Y+23-ly,3,3,sk);R(x+23,Y+23-ry,3,3,sk);
R(x+10,Y+5,12,11,sk);if(d==0)R(x+10,Y+5,12,9,"#3a2a1a");R(x+8,Y+1,16,7,k);R(x+9,Y,14,2,k);
if(d==2){R(x+9,Y+7,14,2,k);R(x+14,Y+2,4,4,"#fff");R(x+12,Y+11,2,3,"#1f1f2e");R(x+18,Y+11,2,3,"#1f1f2e")}}}
function tag(c,x,y,n){c.font="bold 9px sans-serif";const w=c.measureText(n).width+8;c.fillStyle="#000b";c.fillRect(x+16-w/2,y-10,w,12);c.fillStyle="#fff";c.textAlign="center";c.fillText(n,x+16,y-1);c.textAlign="left"}
function syncOthers(list){const me=mp.uid(),now=Date.now();for(const p of list){if(p.uid==me)continue;const o=others[p.uid];
if(o){if(o.ts!=p.ts)o.rx=now;o.ts=p.ts;o.tx=p.x;o.ty=p.y;o.d=p.d;o.name=p.name}else if(now-p.ts<6e4)others[p.uid]={uid:p.uid,name:p.name,tx:p.x,ty:p.y,px:p.x,py:p.y,d:p.d,mv:false,ts:p.ts,rx:now};const q=others[p.uid];if(q&&p.et&&p.et!=q.et0){const fresh=q.et0!==undefined||now-p.et<6e3;q.et0=p.et;if(fresh&&p.em!=null){q.em=p.em;q.eUntil=now+3000;sfx("pop")}}}}
function social(){const now=Date.now();
for(const u in others){const o=others[u];if(now-o.rx>4e4){delete others[u];continue}const q=Math.min(1,(E.ds||.016)*4.5);o.px+=(o.tx-o.px)*q;o.py+=(o.ty-o.py)*q;o.mv=Math.abs(o.tx-o.px)+Math.abs(o.ty-o.py)>.08}
if(window.mp&&(E.tx!=E.lx||E.ty!=E.ly||E.d!=E.ld||now-E.ls>8e3)&&now-E.ls>450){E.lx=E.tx;E.ly=E.ty;E.ld=E.d;E.ls=now;mp.pos(E.tx,E.ty,E.d)}
const fx=E.px-.5,fy=E.py-.5;let best=null,bd=2.2;
for(const u in others){const o=others[u],d=Math.hypot(o.px-fx,o.py-fy);if(d<bd){bd=d;best=o}}
const el=document.getElementById("chal");if(!el)return;const w=typeof pendCh!="undefined"&&pendCh&&pendCh.until>now,pz=inPlaza(E.px-.5,E.py-.5),pb=document.getElementById("plz");if(pb)pb.style.display=pz?"block":"none";
const tp=best&&pz&&inPlaza(best.tx,best.ty),key=best?best.uid+(w?"w":"")+(tp?"t":""):"";
if(key!==E.ck){E.ck=key;el.innerHTML=best?(w?`<p class="sub">Waiting for ${esc(best.name)} to accept…</p>`:`<button class="go" onclick="startDuel('${best.uid}')">Challenge ${esc(best.name)}</button>`+(tp?`<button class="go tr" onclick="startTrade('${best.uid}')">Trade with ${esc(best.name)}</button>`:"")):""}}

function bindJoy(){const j=document.getElementById("joy"),k=document.getElementById("knob");if(!j)return;let on=false;
const mv=e=>{const r=j.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let dx=e.clientX-cx,dy=e.clientY-cy;const m=r.width/2-k.offsetWidth/2,d=Math.hypot(dx,dy);if(d>m){dx*=m/d;dy*=m/d}
k.style.transform=`translate(${dx}px,${dy}px)`;E.joy=true;E.jx=d<14?0:dx/m;E.jy=d<14?0:dy/m};
const up=()=>{on=false;E.joy=false;E.jx=E.jy=0;k.style.transition="";k.style.transform=""};
j.onpointerdown=e=>{on=true;j.setPointerCapture(e.pointerId);k.style.transition="none";mv(e)};
j.onpointermove=e=>{if(on)mv(e)};j.onpointerup=up;j.onpointercancel=up;j.oncontextmenu=()=>false}

function hud(){eb();const e=document.getElementById("exb");if(e){const l=S.lure>Date.now()?" · Lure "+Math.ceil((S.lure-Date.now())/6e4)+"m":"";e.textContent="Poké ×"+S.balls+(S.gb>0?" · Great ×"+S.gb:"")+(S.ub>0?" · Ultra ×"+S.ub:"")+l}}

applyLite();

function placePlayer(x,y,d){E.px=x+.5;E.py=y+.5;E.x=x;E.y=y;E.tx=x;E.ty=y;E.vx=E.vy=0;E.sp=0;E.d=d==null?2:d;E.cx=0}
