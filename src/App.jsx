import { useState, useContext, createContext, useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";

/* ── utils ── */
const td  = () => new Date().toISOString().slice(0,10);
const od  = n  => { const d=new Date(); d.setDate(d.getDate()+n); return d.toISOString().slice(0,10); };
const fS  = n  => new Intl.NumberFormat("uz-UZ").format(Math.round(n||0))+" so'm";
const fD  = s  => new Date(s+"T00:00:00").toLocaleDateString("uz-UZ",{day:"2-digit",month:"short",year:"numeric"});
const fDs = s  => new Date(s+"T00:00:00").toLocaleDateString("uz-UZ",{day:"2-digit",month:"short"});
const pct = (a,b) => b ? Math.round(a/b*100) : 0;

/* ── flower colors ── */
const FC = {
  "Atirgul":"#f43f5e","Qizil Atirgul":"#dc2626","Oq Atirgul":"#94a3b8",
  "Sariq Atirgul":"#eab308","Lola":"#f97316","Qizil Lola":"#ef4444",
  "Binafsha":"#a855f7","Marvarid gul":"#ec4899","Yasmin":"#facc15",
  "Qoqio":"#f59e0b","Nargiz":"#fb7185","Lilyum":"#818cf8",
  "Gerbera":"#f472b6","Xrizantema":"#fde047","Lavanda":"#c084fc",
  "Magnoliya":"#fda4af","Orkide":"#d946ef","Pion":"#fb7185",
  "Tulpan":"#e879f9","Boshqa":"#94a3b8",
};
const FE = {
  "Atirgul":"🌹","Qizil Atirgul":"🌹","Oq Atirgul":"🥀","Sariq Atirgul":"💛",
  "Lola":"🌷","Qizil Lola":"🌷","Binafsha":"🪻","Marvarid gul":"🌸",
  "Yasmin":"🌼","Qoqio":"🌻","Nargiz":"🌺","Lilyum":"💐",
  "Gerbera":"🌸","Xrizantema":"🌼","Lavanda":"💜","Magnoliya":"🌸",
  "Orkide":"🪷","Pion":"🌸","Tulpan":"🌷","Boshqa":"🌸",
};
const gc = n => { for(const[k,v] of Object.entries(FC)) if(n?.toLowerCase().includes(k.toLowerCase())) return v; return "#818cf8"; };
const ge = n => { for(const[k,v] of Object.entries(FE)) if(n?.toLowerCase().includes(k.toLowerCase())) return v; return "🌸"; };

const PRESETS = [
  "Atirgul","Qizil Atirgul","Oq Atirgul","Sariq Atirgul",
  "Lola","Qizil Lola","Binafsha","Marvarid gul",
  "Yasmin","Qoqio","Nargiz","Lilyum",
  "Gerbera","Xrizantema","Lavanda","Magnoliya","Orkide","Pion","Tulpan",
];
const PRICES = {
  "Atirgul":9000,"Qizil Atirgul":10000,"Oq Atirgul":8500,"Sariq Atirgul":8000,
  "Lola":5500,"Qizil Lola":6000,"Binafsha":6500,"Marvarid gul":7000,
  "Yasmin":7500,"Qoqio":5000,"Nargiz":8500,"Lilyum":12000,
  "Gerbera":6000,"Xrizantema":5500,"Lavanda":9500,"Magnoliya":11000,
  "Orkide":18000,"Pion":13000,"Tulpan":7000,
};

const SEED = [
  {id:1,name:"Atirgul",arrived:80,sold:62,price:9000,date:td()},
  {id:2,name:"Lola",arrived:55,sold:38,price:5500,date:td()},
  {id:3,name:"Yasmin",arrived:30,sold:22,price:7500,date:td()},
  {id:4,name:"Lilyum",arrived:20,sold:15,price:12000,date:td()},
  {id:5,name:"Orkide",arrived:12,sold:10,price:18000,date:od(-1)},
  {id:6,name:"Nargiz",arrived:25,sold:21,price:8500,date:od(-1)},
  {id:7,name:"Qoqio",arrived:40,sold:28,price:5000,date:od(-1)},
  {id:8,name:"Atirgul",arrived:70,sold:58,price:9000,date:od(-2)},
  {id:9,name:"Binafsha",arrived:35,sold:28,price:6500,date:od(-2)},
  {id:10,name:"Lola",arrived:50,sold:42,price:5500,date:od(-3)},
  {id:11,name:"Pion",arrived:15,sold:13,price:13000,date:od(-3)},
  {id:12,name:"Qizil Atirgul",arrived:45,sold:40,price:10000,date:od(-4)},
  {id:13,name:"Lilyum",arrived:18,sold:16,price:12000,date:od(-4)},
  {id:14,name:"Atirgul",arrived:75,sold:65,price:9000,date:od(-5)},
  {id:15,name:"Lola",arrived:60,sold:52,price:5500,date:od(-6)},
  {id:16,name:"Gerbera",arrived:40,sold:33,price:6000,date:od(-7)},
  {id:17,name:"Lavanda",arrived:22,sold:18,price:9500,date:od(-7)},
  {id:18,name:"Atirgul",arrived:90,sold:75,price:9000,date:od(-8)},
];

const USERS = {
  admin:  {pw:"admin123",role:"admin",name:"Admin",av:"👑"},
  ishchi: {pw:"ishchi123",role:"worker",name:"Ishchi",av:"🌷"},
};

const Ctx = createContext();

/* ════════════ STYLES ════════════ */
const S = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
body{font-family:'Inter',sans-serif;background:#0f0f14;color:#f1f1f5;overscroll-behavior:none}
::-webkit-scrollbar{width:3px;height:3px}
::-webkit-scrollbar-thumb{background:rgba(99,102,241,0.35);border-radius:3px}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
@keyframes toast{from{opacity:0;transform:translateY(16px) scale(0.95)}to{opacity:1;transform:translateY(0) scale(1)}}
.fu{animation:fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) both}
.fi{animation:fadeIn 0.25s ease both}
.press{cursor:pointer;transition:transform 0.1s,opacity 0.1s}
.press:active{transform:scale(0.93)!important;opacity:0.75}
.nosel{user-select:none;-webkit-user-select:none}
input,select,button{font-family:'Inter',sans-serif;outline:none;-webkit-appearance:none}
input[type=date]{color-scheme:dark}
input[type=number]{-moz-appearance:textfield}
input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}
`;

/* ════════════ APP ════════════ */
export default function App() {
  const [user,setUser]   = useState(null);
  const [page,setPage]   = useState("home");
  const [flowers,setF]   = useState(SEED);
  const [nid,setNid]     = useState(100);
  const [toast,setToast] = useState(null);
  const [drawer,setDraw] = useState(false);
  const timer = useRef(null);

  const msg = (text, type="ok") => {
    if(timer.current) clearTimeout(timer.current);
    setToast({text,type});
    timer.current = setTimeout(()=>setToast(null),3000);
  };
  const addF = f => { setF(p=>[...p,{...f,id:nid}]); setNid(p=>p+1); };
  const delF = id => setF(p=>p.filter(x=>x.id!==id));
  const go   = p => { setPage(p); setDraw(false); };

  /* derived */
  const todayF    = flowers.filter(f=>f.date===td());
  const todayInc  = todayF.reduce((s,f)=>s+f.sold*f.price,0);
  const todayArr  = todayF.reduce((s,f)=>s+f.arrived,0);
  const todaySold = todayF.reduce((s,f)=>s+f.sold,0);
  const totalInc  = flowers.reduce((s,f)=>s+f.sold*f.price,0);

  const dailyMap = {};
  flowers.forEach(f=>{ dailyMap[f.date]=(dailyMap[f.date]||0)+f.sold*f.price; });
  const chart14 = Object.entries(dailyMap).sort((a,b)=>a[0].localeCompare(b[0])).slice(-14)
    .map(([d,v])=>({d:fDs(d),v}));

  const nav = user?.role==="admin"
    ? [{id:"home",e:"🏠",l:"Asosiy"},{id:"log",e:"📝",l:"Kunlik qayd"},{id:"add",e:"➕",l:"Kiritish"},{id:"report",e:"📊",l:"Hisobot"}]
    : [{id:"home",e:"🏠",l:"Asosiy"},{id:"log",e:"📝",l:"Kunlik qayd"},{id:"add",e:"➕",l:"Kiritish"}];

  const ctx = {flowers,addF,delF,todayF,todayInc,todayArr,todaySold,totalInc,dailyMap,chart14,user,msg,go};

  if(!user) return <><style>{S}</style><Login onLogin={u=>{setUser(u);setPage("home");}}/></>;

  return (
    <Ctx.Provider value={ctx}>
      <style>{S}</style>
      <div style={{display:"flex",flexDirection:"column",height:"100dvh",background:"#0f0f14",overflow:"hidden"}}>

        {/* top bar */}
        <div style={{flexShrink:0,height:52,background:"#17171f",borderBottom:"1px solid #23232f",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 14px",zIndex:40}}>
          <div style={{display:"flex",alignItems:"center",gap:9}}>
            <button className="press nosel" onClick={()=>setDraw(true)}
              style={{width:34,height:34,borderRadius:9,background:"#23232f",border:"1px solid #2e2e3e",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3.5,cursor:"pointer"}}>
              {[18,13,18].map((w,i)=><div key={i} style={{width:w,height:1.5,background:"rgba(255,255,255,0.5)",borderRadius:2}}/>)}
            </button>
            <div>
              <div style={{fontSize:14,fontWeight:700,color:"#f1f1f5",lineHeight:1.2,letterSpacing:"-0.01em"}}>
                {{home:"Asosiy",log:"Kunlik qayd",add:"Kiritish",report:"Hisobot"}[page]}
              </div>
              <div style={{fontSize:9,color:"#4b4b60",display:"flex",alignItems:"center",gap:4,marginTop:1}}>
                <div style={{width:5,height:5,borderRadius:"50%",background:"#22c55e",animation:"blink 2s ease infinite"}}/>
                {fD(td())}
              </div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:7,background:"#23232f",border:"1px solid #2e2e3e",borderRadius:12,padding:"5px 10px"}}>
            <div style={{width:26,height:26,borderRadius:7,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>{user.av}</div>
            <div>
              <div style={{fontSize:11,fontWeight:600,color:"#f1f1f5",lineHeight:1}}>{user.name}</div>
              <div style={{fontSize:8,color:"#6366f1",fontFamily:"'JetBrains Mono',monospace",letterSpacing:"0.04em",marginTop:1}}>{user.role==="admin"?"ADMIN":"ISHCHI"}</div>
            </div>
          </div>
        </div>

        {/* drawer overlay */}
        {drawer && <div onClick={()=>setDraw(false)} className="fi"
          style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:98,backdropFilter:"blur(3px)"}}/>}

        {/* drawer */}
        <div style={{position:"fixed",top:0,left:0,height:"100%",width:255,background:"#13131a",zIndex:99,transform:drawer?"translateX(0)":"translateX(-100%)",transition:"transform 0.28s cubic-bezier(0.4,0,0.2,1)",display:"flex",flexDirection:"column",borderRight:"1px solid #1e1e2a"}}>
          <div style={{padding:"20px 16px 14px",borderBottom:"1px solid #1e1e2a"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
              <div style={{width:44,height:44,borderRadius:14,background:"linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,animation:"float 3s ease infinite",boxShadow:"0 4px 18px rgba(99,102,241,0.4)"}}>🌸</div>
              <div>
                <div style={{fontSize:15,fontWeight:800,color:"#f1f1f5",letterSpacing:"-0.01em"}}>Gul Do'koni</div>
                <div style={{fontSize:9,color:"#6366f1",fontFamily:"'JetBrains Mono',monospace",marginTop:1,letterSpacing:"0.04em"}}>v3.0 PREMIUM</div>
              </div>
            </div>
            <div style={{background:"#1c1c28",borderRadius:12,padding:"10px 12px",border:"1px solid #2a2a3a",display:"flex",alignItems:"center",gap:9}}>
              <div style={{width:34,height:34,borderRadius:9,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{user.av}</div>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:"#f1f1f5"}}>{user.name}</div>
                <div style={{display:"flex",alignItems:"center",gap:5,marginTop:2}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:"#22c55e",animation:"blink 2s ease infinite"}}/>
                  <span style={{fontSize:9,color:"#4b4b60"}}>Online · Faol</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{flex:1,padding:"12px 10px",overflowY:"auto"}}>
            <div style={{fontSize:8,color:"#4b4b60",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",padding:"0 6px 8px"}}>Menyu</div>
            {nav.map(n=>{
              const a=page===n.id;
              return (
                <button key={n.id} onClick={()=>go(n.id)} className="press nosel"
                  style={{width:"100%",display:"flex",alignItems:"center",gap:11,padding:"11px 12px",background:a?"rgba(99,102,241,0.15)":"transparent",border:`1px solid ${a?"rgba(99,102,241,0.35)":"transparent"}`,borderRadius:11,cursor:"pointer",marginBottom:3,color:a?"#a5b4fc":"rgba(255,255,255,0.4)",transition:"all 0.15s",position:"relative"}}>
                  {a && <div style={{position:"absolute",left:0,top:"20%",bottom:"20%",width:3,background:"#6366f1",borderRadius:"0 3px 3px 0"}}/>}
                  <span style={{fontSize:18}}>{n.e}</span>
                  <span style={{fontSize:13,fontWeight:a?700:400}}>{n.l}</span>
                  {a && <div style={{marginLeft:"auto",width:5,height:5,borderRadius:"50%",background:"#6366f1",boxShadow:"0 0 8px #6366f1"}}/>}
                </button>
              );
            })}
          </div>
          <div style={{padding:"10px",borderTop:"1px solid #1e1e2a"}}>
            <button className="press" onClick={()=>{setDraw(false);setTimeout(()=>{setUser(null);setPage("home");},200);}}
              style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"11px 13px",background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.15)",borderRadius:11,cursor:"pointer",color:"rgba(248,113,113,0.8)"}}>
              <span style={{fontSize:16}}>⎋</span>
              <span style={{fontSize:13,fontWeight:600}}>Chiqish</span>
            </button>
          </div>
        </div>

        {/* content */}
        <div style={{flex:1,overflowY:"auto",overflowX:"hidden",WebkitOverflowScrolling:"touch",padding:"14px 13px 76px"}}>
          {user.role==="admin" ? <>
            {page==="home"   && <Home key="h"/>}
            {page==="log"    && <DailyLog key="l"/>}
            {page==="add"    && <AddPage key="a"/>}
            {page==="report" && <Report key="r"/>}
          </> : <>
            {page==="home"   && <Home key="h"/>}
            {page==="log"    && <DailyLog key="l"/>}
            {page==="add"    && <AddPage key="a"/>}
          </>}
        </div>

        {/* bottom nav */}
        <div style={{position:"fixed",bottom:0,left:0,right:0,height:"calc(58px + env(safe-area-inset-bottom,0px))",background:"#17171f",borderTop:"1px solid #23232f",display:"flex",justifyContent:"space-around",alignItems:"center",zIndex:40,paddingBottom:"env(safe-area-inset-bottom,0px)"}}>
          {nav.map(n=>{
            const a=page===n.id;
            return (
              <button key={n.id} className="press nosel" onClick={()=>go(n.id)}
                style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"6px 14px",background:a?"rgba(99,102,241,0.12)":"transparent",border:`1px solid ${a?"rgba(99,102,241,0.28)":"transparent"}`,borderRadius:12,cursor:"pointer",position:"relative",minWidth:50,transition:"all 0.18s"}}>
                {a && <div style={{position:"absolute",top:-1,left:"25%",right:"25%",height:2,background:"linear-gradient(90deg,transparent,#6366f1,transparent)",borderRadius:2}}/>}
                <span style={{fontSize:20,lineHeight:1}}>{n.e}</span>
                <span style={{fontSize:8,fontWeight:700,color:a?"#818cf8":"rgba(255,255,255,0.28)",letterSpacing:"0.02em"}}>{n.l}</span>
              </button>
            );
          })}
        </div>

        {toast && <Toast t={toast}/>}
      </div>
    </Ctx.Provider>
  );
}

/* ════════════ LOGIN ════════════ */
function Login({onLogin}) {
  const [u,setU]=useState(""); const [p,setP]=useState(""); const [err,setErr]=useState(""); const [ld,setLd]=useState(false);
  const go = () => {
    if(!u||!p) return setErr("Login va parolni kiriting");
    setLd(true);
    setTimeout(()=>{ const usr=USERS[u]; if(usr&&usr.pw===p) onLogin({...usr,username:u}); else {setErr("Noto'g'ri login yoki parol");setLd(false);} },500);
  };
  return (
    <div style={{height:"100dvh",background:"#0f0f14",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-80,right:-80,width:260,height:260,borderRadius:"50%",background:"radial-gradient(circle,rgba(99,102,241,0.12),transparent 70%)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:-60,left:-60,width:200,height:200,borderRadius:"50%",background:"radial-gradient(circle,rgba(139,92,246,0.08),transparent 70%)",pointerEvents:"none"}}/>
      <div style={{width:"100%",maxWidth:340}} className="fu">
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:72,height:72,borderRadius:22,background:"linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,margin:"0 auto 14px",boxShadow:"0 8px 32px rgba(99,102,241,0.45)",animation:"float 3s ease infinite"}}>🌸</div>
          <h1 style={{fontSize:24,fontWeight:800,color:"#f1f1f5",letterSpacing:"-0.02em"}}>Gul Do'koni</h1>
          <p style={{fontSize:12,color:"#4b4b60",marginTop:5}}>Boshqaruv tizimi</p>
        </div>
        <div style={{background:"#17171f",borderRadius:20,padding:22,border:"1px solid #23232f",boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}>
          <Inp label="Foydalanuvchi" val={u} set={setU} ph="admin / ishchi" ico="👤"/>
          <Inp label="Parol" val={p} set={setP} ph="••••••••" type="password" ico="🔑" onEnter={go}/>
          {err && <div style={{background:"rgba(239,68,68,0.08)",color:"#fca5a5",border:"1px solid rgba(239,68,68,0.2)",padding:"10px 13px",borderRadius:10,marginBottom:13,fontSize:12,display:"flex",gap:7,alignItems:"center"}}><span>⚠️</span>{err}</div>}
          <button className="press" onClick={go} disabled={ld}
            style={{width:"100%",padding:"14px",background:ld?"rgba(99,102,241,0.4)":"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:12,fontSize:14,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 20px rgba(99,102,241,0.4)",marginBottom:18,letterSpacing:"0.01em"}}>
            {ld ? <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><span style={{animation:"spin 0.8s linear infinite",display:"inline-block"}}>◌</span>Tekshirilmoqda...</span> : "Kirish →"}
          </button>
          <div style={{borderTop:"1px solid #23232f",paddingTop:15}}>
            <p style={{fontSize:9,color:"#4b4b60",textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:700,marginBottom:9,textAlign:"center"}}>Tez kirish</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[{r:"👑 Admin",l:"admin",pw:"admin123"},{r:"🌷 Ishchi",l:"ishchi",pw:"ishchi123"}].map(x=>(
                <button key={x.l} className="press" onClick={()=>{setU(x.l);setP(x.pw);setErr("");}}
                  style={{padding:"10px 11px",background:u===x.l?"rgba(99,102,241,0.1)":"#1c1c28",border:`1px solid ${u===x.l?"rgba(99,102,241,0.4)":"#2a2a3a"}`,borderRadius:11,cursor:"pointer",textAlign:"left"}}>
                  <div style={{fontSize:12,fontWeight:700,color:"#f1f1f5",marginBottom:2}}>{x.r}</div>
                  <div style={{fontSize:9,color:"#4b4b60",fontFamily:"'JetBrains Mono',monospace"}}>{x.l} · {x.pw}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function Inp({label,val,set,ph,type="text",ico,onEnter}) {
  const [f,setF]=useState(false);
  return (
    <div style={{marginBottom:12}}>
      <label style={{display:"block",fontSize:9,fontWeight:700,color:"#4b4b60",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:5}}>{label}</label>
      <div style={{position:"relative"}}>
        <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:14,pointerEvents:"none",opacity:0.45}}>{ico}</span>
        <input type={type} value={val} onChange={e=>set(e.target.value)} placeholder={ph} onKeyDown={e=>e.key==="Enter"&&onEnter?.()}
          onFocus={()=>setF(true)} onBlur={()=>setF(false)}
          style={{width:"100%",padding:"12px 12px 12px 38px",borderRadius:11,border:`1.5px solid ${f?"#6366f1":"#2a2a3a"}`,background:"#1c1c28",color:"#f1f1f5",fontSize:13,fontWeight:500,boxSizing:"border-box",transition:"all 0.18s",boxShadow:f?"0 0 0 3px rgba(99,102,241,0.12)":"none"}}/>
      </div>
    </div>
  );
}

/* ════════════ HOME ════════════ */
function Home() {
  const {todayF,todayInc,todayArr,todaySold,totalInc,chart14,user,go}=useContext(Ctx);
  const rem = todayArr-todaySold;
  const soldPct = pct(todaySold,todayArr);
  return (
    <div className="fu">
      {/* Hero */}
      <div style={{background:"linear-gradient(135deg,#1a1a2e,#16213e,#1a1a2e)",borderRadius:18,padding:18,marginBottom:12,border:"1px solid #2a2a45",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-30,right:-30,width:130,height:130,borderRadius:"50%",background:"rgba(99,102,241,0.08)",filter:"blur(20px)"}}/>
        <div style={{fontSize:10,fontWeight:700,color:"rgba(165,180,252,0.6)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:7}}>Kunlik daromat</div>
        <div style={{fontSize:30,fontWeight:800,color:"#c7d2fe",fontFamily:"'JetBrains Mono',monospace",letterSpacing:"-0.02em",marginBottom:12}}>{fS(todayInc)}</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {[{l:`${todayArr} keldi`,c:"#818cf8"},{l:`${todaySold} sotildi`,c:"#34d399"},{l:`${rem} qoldi`,c:"#fbbf24"},{l:`${soldPct}%`,c:"#f472b6"}].map(x=>(
            <span key={x.l} style={{background:`${x.c}18`,border:`1px solid ${x.c}30`,borderRadius:16,padding:"3px 10px",fontSize:10,fontWeight:600,color:x.c}}>{x.l}</span>
          ))}
        </div>
      </div>

      {/* Stats 2x2 */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:12}}>
        {[
          {ico:"📈",l:"Jami daromat",v:fS(totalInc),c:"#818cf8"},
          {ico:"📦",l:"Bugun keldi",v:`${todayArr} ta`,c:"#60a5fa"},
          {ico:"✅",l:"Bugun sotildi",v:`${todaySold} ta`,c:"#34d399"},
          {ico:"🌸",l:"Gul turlari",v:`${todayF.length} xil`,c:"#f472b6"},
        ].map(x=>(
          <div key={x.l} style={{background:"#17171f",borderRadius:14,padding:"13px",border:`1px solid ${x.c}18`,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${x.c},transparent)`}}/>
            <div style={{fontSize:20,marginBottom:7}}>{x.ico}</div>
            <div style={{fontSize:8,color:"#4b4b60",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.09em",marginBottom:4}}>{x.l}</div>
            <div style={{fontSize:15,fontWeight:800,color:x.c,fontFamily:"'JetBrains Mono',monospace",letterSpacing:"-0.01em"}}>{x.v}</div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div style={{background:"#17171f",borderRadius:14,padding:14,marginBottom:12,border:"1px solid #23232f"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <span style={{fontSize:12,fontWeight:600,color:"#f1f1f5"}}>Bugungi sotuv</span>
          <span style={{fontSize:16,fontWeight:800,fontFamily:"'JetBrains Mono',monospace",color:soldPct>80?"#34d399":soldPct>50?"#fbbf24":"#f87171"}}>{soldPct}%</span>
        </div>
        <div style={{height:7,background:"#23232f",borderRadius:6,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${soldPct}%`,borderRadius:6,transition:"width 0.8s",background:soldPct>80?"linear-gradient(90deg,#22c55e,#34d399)":soldPct>50?"linear-gradient(90deg,#f59e0b,#fbbf24)":"linear-gradient(90deg,#ef4444,#f87171)"}}/>
        </div>
        <div style={{fontSize:9,color:"#4b4b60",marginTop:5}}>{todaySold} ta sotildi / {todayArr} ta keldi</div>
      </div>

      {/* Chart */}
      {chart14.length>1 && (
        <div style={{background:"#17171f",borderRadius:14,padding:14,marginBottom:12,border:"1px solid #23232f"}}>
          <div style={{fontSize:12,fontWeight:600,color:"#f1f1f5",marginBottom:10}}>14 kunlik trend</div>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={chart14} margin={{top:2,right:0,left:0,bottom:0}}>
              <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366f1" stopOpacity={0.4}/><stop offset="100%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
              <XAxis dataKey="d" tick={{fill:"#4b4b60",fontSize:8}} axisLine={false} tickLine={false}/>
              <YAxis hide/>
              <Tooltip contentStyle={{background:"#1c1c28",border:"1px solid #2a2a3a",borderRadius:9,color:"#f1f1f5",fontSize:11}} formatter={v=>[fS(v),"Daromat"]}/>
              <Area type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={2} fill="url(#ag)" dot={false} activeDot={{r:4,fill:"#6366f1"}}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Today list */}
      <div style={{background:"#17171f",borderRadius:14,padding:14,border:"1px solid #23232f"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:11}}>
          <span style={{fontSize:12,fontWeight:600,color:"#f1f1f5"}}>Bugun kiritilgan</span>
          <span style={{fontSize:10,fontWeight:700,color:"#818cf8",background:"rgba(99,102,241,0.12)",border:"1px solid rgba(99,102,241,0.25)",borderRadius:8,padding:"2px 8px",fontFamily:"'JetBrains Mono',monospace"}}>{todayF.length} ta</span>
        </div>
        {todayF.length===0 ? <Empty txt="Bugun hali kiritilmagan"/> : todayF.map(f=><FRow key={f.id} f={f}/>)}
      </div>
    </div>
  );
}

/* ════════════ DAILY LOG — yangi page ════════════ */
function DailyLog() {
  const {flowers,dailyMap,delF,msg}=useContext(Ctx);
  const [selDate,setSelDate]=useState(td());

  /* all unique dates sorted desc */
  const allDates = [...new Set(flowers.map(f=>f.date))].sort((a,b)=>b.localeCompare(a));

  const dayFlowers = flowers.filter(f=>f.date===selDate);
  const dayInc  = dayFlowers.reduce((s,f)=>s+f.sold*f.price,0);
  const dayArr  = dayFlowers.reduce((s,f)=>s+f.arrived,0);
  const daySold = dayFlowers.reduce((s,f)=>s+f.sold,0);

  /* week chart around selected date */
  const wk=[];
  for(let i=-3;i<=3;i++){
    const d=new Date(selDate+"T00:00:00"); d.setDate(d.getDate()+i);
    const ds=d.toISOString().slice(0,10);
    wk.push({d:fDs(ds),v:dailyMap[ds]||0,sel:ds===selDate,ds});
  }

  return (
    <div className="fu">
      <div style={{marginBottom:16}}>
        <h2 style={{fontSize:20,fontWeight:800,color:"#f1f1f5",letterSpacing:"-0.01em",marginBottom:3}}>📝 Kunlik qayd</h2>
        <p style={{fontSize:10,color:"#4b4b60"}}>Har kungi mahsulotlar jurnali</p>
      </div>

      {/* Date selector */}
      <div style={{background:"#17171f",borderRadius:14,padding:14,marginBottom:12,border:"1px solid #23232f"}}>
        <div style={{fontSize:10,fontWeight:700,color:"#4b4b60",textTransform:"uppercase",letterSpacing:"0.09em",marginBottom:8}}>Sana tanlash</div>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginBottom:10}}>
          <input type="date" value={selDate} onChange={e=>setSelDate(e.target.value)}
            style={{flex:1,minWidth:140,padding:"10px 12px",borderRadius:11,border:"1.5px solid #2a2a3a",background:"#1c1c28",color:"#f1f1f5",fontSize:12,cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all 0.18s"}}
            onFocus={e=>{e.target.style.borderColor="#6366f1";e.target.style.boxShadow="0 0 0 3px rgba(99,102,241,0.1)";}}
            onBlur={e=>{e.target.style.borderColor="#2a2a3a";e.target.style.boxShadow="none";}}/>
          <button className="press" onClick={()=>setSelDate(td())}
            style={{padding:"10px 14px",background:"rgba(99,102,241,0.12)",border:"1px solid rgba(99,102,241,0.28)",borderRadius:11,cursor:"pointer",color:"#818cf8",fontSize:12,fontWeight:600,flexShrink:0}}>Bugun</button>
        </div>

        {/* quick date chips */}
        <div style={{display:"flex",gap:5,flexWrap:"nowrap",overflowX:"auto",paddingBottom:2}}>
          {allDates.slice(0,10).map(d=>(
            <button key={d} onClick={()=>setSelDate(d)} className="press nosel"
              style={{flexShrink:0,padding:"5px 11px",background:selDate===d?"rgba(99,102,241,0.18)":"#1c1c28",border:`1px solid ${selDate===d?"rgba(99,102,241,0.45)":"#2a2a3a"}`,borderRadius:20,cursor:"pointer",fontSize:10,fontWeight:selDate===d?700:400,color:selDate===d?"#a5b4fc":"#4b4b60",transition:"all 0.15s",whiteSpace:"nowrap"}}>
              {d===td()?"Bugun":fDs(d)}
            </button>
          ))}
        </div>
      </div>

      {/* Day summary */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
        {[
          {ico:"💰",l:"Daromat",v:fS(dayInc),c:"#818cf8"},
          {ico:"📦",l:"Keldi",v:`${dayArr} ta`,c:"#60a5fa"},
          {ico:"✅",l:"Sotildi",v:`${daySold} ta`,c:"#34d399"},
          {ico:"📋",l:"Qoldi",v:`${dayArr-daySold} ta`,c:"#fbbf24"},
        ].map(x=>(
          <div key={x.l} style={{background:"#17171f",borderRadius:12,padding:"11px 12px",border:`1px solid ${x.c}18`,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${x.c},transparent)`}}/>
            <div style={{fontSize:18,marginBottom:5}}>{x.ico}</div>
            <div style={{fontSize:8,color:"#4b4b60",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.09em",marginBottom:3}}>{x.l}</div>
            <div style={{fontSize:14,fontWeight:800,color:x.c,fontFamily:"'JetBrains Mono',monospace"}}>{x.v}</div>
          </div>
        ))}
      </div>

      {/* mini bar chart */}
      <div style={{background:"#17171f",borderRadius:14,padding:14,marginBottom:12,border:"1px solid #23232f"}}>
        <div style={{fontSize:11,fontWeight:600,color:"#f1f1f5",marginBottom:10}}>7 kunlik taqqoslama</div>
        <ResponsiveContainer width="100%" height={90}>
          <BarChart data={wk} margin={{top:0,right:0,left:0,bottom:0}}>
            <XAxis dataKey="d" tick={{fill:"#4b4b60",fontSize:8}} axisLine={false} tickLine={false}/>
            <YAxis hide/>
            <Tooltip contentStyle={{background:"#1c1c28",border:"1px solid #2a2a3a",borderRadius:9,color:"#f1f1f5",fontSize:11}} formatter={v=>[fS(v),"Daromat"]} cursor={{fill:"rgba(99,102,241,0.07)"}}/>
            <Bar dataKey="v" radius={[5,5,0,0]} maxBarSize={30}>
              {wk.map((d,i)=><Cell key={i} fill={d.sel?"#6366f1":"#2a2a3a"}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Flower list for the day */}
      <div style={{background:"#17171f",borderRadius:14,padding:14,border:"1px solid #23232f"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div>
            <div style={{fontSize:12,fontWeight:700,color:"#f1f1f5"}}>{fD(selDate)} — gullar</div>
            <div style={{fontSize:9,color:"#4b4b60",marginTop:2}}>{dayFlowers.length} ta yozuv · {dayFlowers.length} xil tur</div>
          </div>
          {dayFlowers.length>0 && (
            <span style={{fontSize:10,fontWeight:700,color:"#818cf8",background:"rgba(99,102,241,0.1)",border:"1px solid rgba(99,102,241,0.2)",borderRadius:8,padding:"2px 9px",fontFamily:"'JetBrains Mono',monospace"}}>{fS(dayInc)}</span>
          )}
        </div>

        {dayFlowers.length===0 ? (
          <Empty txt="Bu kunda ma'lumot yo'q"/>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {dayFlowers.map((f,i)=>{
              const c=gc(f.name); const p2=pct(f.sold,f.arrived);
              return (
                <div key={f.id} className="fu" style={{animationDelay:`${i*0.04}s`,background:"#1c1c28",borderRadius:13,padding:13,border:"1px solid #2a2a3a",position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",left:0,top:0,bottom:0,width:3,background:c,borderRadius:"13px 0 0 13px"}}/>
                  <div style={{marginLeft:8}}>
                    {/* header */}
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                      <div style={{display:"flex",alignItems:"center",gap:9}}>
                        <div style={{width:40,height:40,borderRadius:11,background:`${c}18`,border:`1px solid ${c}28`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{ge(f.name)}</div>
                        <div>
                          <div style={{fontSize:14,fontWeight:700,color:"#f1f1f5"}}>{f.name}</div>
                          <div style={{fontSize:9,color:"#4b4b60",marginTop:1,display:"flex",gap:6,alignItems:"center"}}>
                            <span style={{color:p2>80?"#34d399":p2>50?"#fbbf24":"#f87171",fontWeight:700}}>{p2}% sotildi</span>
                          </div>
                        </div>
                      </div>
                      <button onClick={()=>{delF(f.id);msg(`${f.name} o'chirildi`,"info");}} className="press"
                        style={{width:28,height:28,borderRadius:8,background:"rgba(239,68,68,0.07)",color:"#fca5a5",border:"1px solid rgba(239,68,68,0.15)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,flexShrink:0}}>✕</button>
                    </div>
                    {/* stats row */}
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:9}}>
                      {[{l:"Keldi",v:f.arrived,c:"#60a5fa"},{l:"Sotildi",v:f.sold,c:"#34d399"},{l:"Qoldi",v:f.arrived-f.sold,c:"#fbbf24"}].map(x=>(
                        <div key={x.l} style={{background:"#23232f",borderRadius:9,padding:"7px 5px",textAlign:"center",border:`1px solid ${x.c}15`}}>
                          <div style={{fontSize:15,fontWeight:800,color:x.c,fontFamily:"'JetBrains Mono',monospace",lineHeight:1}}>{x.v}</div>
                          <div style={{fontSize:7,color:"#4b4b60",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",marginTop:2}}>{x.l}</div>
                        </div>
                      ))}
                    </div>
                    {/* progress */}
                    <div style={{height:4,background:"#23232f",borderRadius:4,overflow:"hidden",marginBottom:9}}>
                      <div style={{height:"100%",width:`${p2}%`,borderRadius:4,background:p2>80?`linear-gradient(90deg,#22c55e,#34d399)`:p2>50?`linear-gradient(90deg,#f59e0b,#fbbf24)`:`linear-gradient(90deg,#ef4444,#f87171)`,transition:"width 0.8s"}}/>
                    </div>
                    {/* price / income */}
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontSize:10,color:"#4b4b60",fontFamily:"'JetBrains Mono',monospace"}}>{fS(f.price)} / ta</span>
                      <span style={{fontSize:14,fontWeight:800,color:c,fontFamily:"'JetBrains Mono',monospace"}}>{fS(f.sold*f.price)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ════════════ ADD PAGE ════════════ */
function AddPage({workerMode}) {
  const {addF,msg}=useContext(Ctx);
  const ini={name:"",arrived:"",sold:"",price:"",date:td()};
  const [form,setForm]=useState(ini); const [saved,setSaved]=useState([]); const [err,setErr]=useState("");
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  const save=()=>{
    if(!form.name.trim()) return setErr("Gul nomini kiriting!");
    if(!form.arrived||+form.arrived<=0) return setErr("Kelgan miqdorni kiriting!");
    if(!form.price||+form.price<=0) return setErr("Narxni kiriting!");
    if(form.sold&&+form.sold>+form.arrived) return setErr("Sotilgan kelgandan ko'p bo'lolmaydi!");
    setErr("");
    const fl={name:form.name.trim(),arrived:+form.arrived,sold:+form.sold||0,price:+form.price,date:form.date};
    addF(fl);
    setSaved(p=>[{...fl,cid:Date.now()},...p]);
    setForm(ini);
    msg(`✅ ${fl.name} saqlandi!`);
  };
  return (
    <div className="fu">
      <div style={{marginBottom:16}}>
        <h2 style={{fontSize:20,fontWeight:800,color:"#f1f1f5",letterSpacing:"-0.01em",marginBottom:3}}>➕ Yangi kiritish</h2>
        <p style={{fontSize:10,color:"#4b4b60"}}>Omborga yangi gul qo'shish</p>
      </div>

      {/* Presets */}
      <div style={{background:"#17171f",borderRadius:14,padding:14,marginBottom:11,border:"1px solid #23232f"}}>
        <div style={{fontSize:9,fontWeight:700,color:"#4b4b60",textTransform:"uppercase",letterSpacing:"0.09em",marginBottom:9}}>⚡ Tezkor tanlash</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:5,maxHeight:95,overflowY:"auto"}}>
          {PRESETS.map(pr=>{
            const a=form.name===pr; const c=gc(pr);
            return (
              <button key={pr} className="press" onClick={()=>setForm(p=>({...p,name:pr,price:String(PRICES[pr]||0)}))}
                style={{background:a?`${c}18`:"#1c1c28",color:a?c:"#6b7280",border:`1px solid ${a?c+"44":"#2a2a3a"}`,borderRadius:18,padding:"5px 11px",cursor:"pointer",fontSize:11,fontWeight:a?700:400,display:"flex",alignItems:"center",gap:4,transition:"all 0.15s"}}>
                <span style={{fontSize:13}}>{ge(pr)}</span>{pr}
              </button>
            );
          })}
        </div>
      </div>

      {/* Form */}
      <div style={{background:"#17171f",borderRadius:14,padding:14,marginBottom:11,border:"1px solid #23232f"}}>
        <FInp label="🌸 Gul nomi" val={form.name} set={v=>f("name",v)} ph="Masalan: Atirgul"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
          <FInp label="📦 Keldi (ta)" val={form.arrived} set={v=>f("arrived",v)} type="number" ph="50"/>
          <FInp label="✅ Sotildi (ta)" val={form.sold} set={v=>f("sold",v)} type="number" ph="0"/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
          <FInp label="💰 Narx (so'm)" val={form.price} set={v=>f("price",v)} type="number" ph="9000"/>
          <FInp label="📅 Sana" val={form.date} set={v=>f("date",v)} type="date"/>
        </div>

        {/* preview */}
        {(form.name||form.arrived) && (
          <div style={{background:"rgba(99,102,241,0.06)",border:"1px dashed rgba(99,102,241,0.25)",borderRadius:11,padding:11,marginBottom:11,display:"flex",alignItems:"center",gap:9}}>
            <div style={{width:38,height:38,borderRadius:10,background:`${gc(form.name)}18`,border:`1px solid ${gc(form.name)}28`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,flexShrink:0}}>{ge(form.name)}</div>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:"#f1f1f5"}}>{form.name||"—"}</div>
              <div style={{fontSize:10,color:"#4b4b60"}}>📦{form.arrived||0} · ✅{form.sold||0} · qoldi {(+form.arrived||0)-(+form.sold||0)}</div>
              {form.price && <div style={{fontSize:12,fontWeight:700,color:gc(form.name),fontFamily:"'JetBrains Mono',monospace",marginTop:2}}>{fS((+form.sold||0)*(+form.price||0))}</div>}
            </div>
          </div>
        )}

        {err && <div style={{background:"rgba(239,68,68,0.07)",color:"#fca5a5",border:"1px solid rgba(239,68,68,0.18)",padding:"10px 13px",borderRadius:10,marginBottom:11,fontSize:12,display:"flex",gap:7,alignItems:"center"}}><span>⚠️</span>{err}</div>}

        <button className="press" onClick={save}
          style={{width:"100%",padding:"14px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:12,fontSize:14,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 18px rgba(99,102,241,0.35)",letterSpacing:"0.01em"}}>
          💾 Saqlash
        </button>
      </div>

      {/* saved list */}
      {saved.length>0 && (
        <div style={{background:"#17171f",borderRadius:14,padding:14,border:"1px solid #23232f"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:11}}>
            <span style={{fontSize:12,fontWeight:700,color:"#f1f1f5"}}>Saqlangan</span>
            <span style={{fontSize:10,fontWeight:700,color:"#34d399",background:"rgba(52,211,153,0.1)",border:"1px solid rgba(52,211,153,0.2)",borderRadius:8,padding:"2px 9px",fontFamily:"'JetBrains Mono',monospace"}}>{saved.length} ta</span>
          </div>
          {saved.map(c=>{
            const fc=gc(c.name);
            return (
              <div key={c.cid} style={{display:"flex",alignItems:"center",gap:9,padding:"10px 0",borderBottom:"1px solid #23232f"}}>
                <div style={{width:36,height:36,borderRadius:10,background:`${fc}18`,border:`1px solid ${fc}28`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{ge(c.name)}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,fontWeight:700,color:"#f1f1f5"}}>{c.name}</div>
                  <div style={{fontSize:9,color:"#4b4b60",fontFamily:"'JetBrains Mono',monospace"}}>📦{c.arrived} · ✅{c.sold} · {fS(c.price)}/ta</div>
                </div>
                <div style={{fontSize:13,fontWeight:800,color:fc,fontFamily:"'JetBrains Mono',monospace",flexShrink:0}}>{fS(c.sold*c.price)}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ════════════ REPORT (admin only) ════════════ */
function Report() {
  const {flowers,totalInc,dailyMap}=useContext(Ctx);
  const MN=["Yan","Fev","Mar","Apr","May","Iyn","Iyl","Avg","Sen","Okt","Noy","Dek"];
  const mm={};
  flowers.forEach(f=>{
    const m=f.date.slice(0,7);
    if(!mm[m]) mm[m]={income:0,arrived:0,sold:0,kinds:new Set()};
    mm[m].income+=f.sold*f.price; mm[m].arrived+=f.arrived; mm[m].sold+=f.sold; mm[m].kinds.add(f.name);
  });
  const months=Object.entries(mm).sort((a,b)=>a[0].localeCompare(b[0]));
  const cData=months.map(([m,d])=>({m:MN[+m.split("-")[1]-1],inc:d.income,arr:d.arrived,sol:d.sold}));
  const totalArr=flowers.reduce((s,f)=>s+f.arrived,0);
  const totalSold=flowers.reduce((s,f)=>s+f.sold,0);

  return (
    <div className="fu">
      <div style={{marginBottom:16}}>
        <h2 style={{fontSize:20,fontWeight:800,color:"#f1f1f5",letterSpacing:"-0.01em",marginBottom:3}}>📊 Hisobot</h2>
        <p style={{fontSize:10,color:"#4b4b60"}}>Umumiy statistika</p>
      </div>

      {/* summary card */}
      <div style={{background:"linear-gradient(135deg,#1a1a2e,#16213e)",borderRadius:16,padding:16,marginBottom:12,border:"1px solid #2a2a45"}}>
        <div style={{fontSize:10,fontWeight:700,color:"rgba(165,180,252,0.6)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:7}}>Jami daromat</div>
        <div style={{fontSize:28,fontWeight:800,color:"#c7d2fe",fontFamily:"'JetBrains Mono',monospace",letterSpacing:"-0.02em",marginBottom:10}}>{fS(totalInc)}</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <span style={{background:"rgba(129,140,248,0.15)",border:"1px solid rgba(129,140,248,0.3)",borderRadius:14,padding:"3px 10px",fontSize:10,fontWeight:600,color:"#818cf8"}}>{Object.keys(dailyMap).length} kun faol</span>
          <span style={{background:"rgba(96,165,250,0.15)",border:"1px solid rgba(96,165,250,0.3)",borderRadius:14,padding:"3px 10px",fontSize:10,fontWeight:600,color:"#60a5fa"}}>{totalArr} ta keldi</span>
          <span style={{background:"rgba(52,211,153,0.15)",border:"1px solid rgba(52,211,153,0.3)",borderRadius:14,padding:"3px 10px",fontSize:10,fontWeight:600,color:"#34d399"}}>{totalSold} ta sotildi</span>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
        {[
          {ico:"🌷",l:"Jami keldi",v:`${totalArr} ta`,c:"#60a5fa"},
          {ico:"✅",l:"Jami sotildi",v:`${totalSold} ta`,c:"#34d399"},
          {ico:"📋",l:"Yozuvlar",v:`${flowers.length} ta`,c:"#fbbf24"},
          {ico:"🎯",l:"Umumiy foiz",v:`${pct(totalSold,totalArr)}%`,c:"#f472b6"},
        ].map(x=>(
          <div key={x.l} style={{background:"#17171f",borderRadius:12,padding:"12px",border:`1px solid ${x.c}18`,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${x.c},transparent)`}}/>
            <div style={{fontSize:18,marginBottom:5}}>{x.ico}</div>
            <div style={{fontSize:8,color:"#4b4b60",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.09em",marginBottom:3}}>{x.l}</div>
            <div style={{fontSize:14,fontWeight:800,color:x.c,fontFamily:"'JetBrains Mono',monospace"}}>{x.v}</div>
          </div>
        ))}
      </div>

      {/* monthly bar chart */}
      {cData.length>0 && (
        <div style={{background:"#17171f",borderRadius:14,padding:14,marginBottom:12,border:"1px solid #23232f"}}>
          <div style={{fontSize:12,fontWeight:600,color:"#f1f1f5",marginBottom:11}}>Oylik daromat</div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={cData} margin={{top:2,right:0,left:0,bottom:0}}>
              <defs><linearGradient id="mbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366f1"/><stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.6}/></linearGradient></defs>
              <XAxis dataKey="m" tick={{fill:"#4b4b60",fontSize:9}} axisLine={false} tickLine={false}/>
              <YAxis hide/>
              <Tooltip contentStyle={{background:"#1c1c28",border:"1px solid #2a2a3a",borderRadius:9,color:"#f1f1f5",fontSize:11}} formatter={v=>[fS(v),"Daromat"]}/>
              <Bar dataKey="inc" fill="url(#mbg)" radius={[5,5,0,0]} maxBarSize={38}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* monthly table */}
      <div style={{background:"#17171f",borderRadius:14,padding:14,border:"1px solid #23232f"}}>
        <div style={{fontSize:12,fontWeight:600,color:"#f1f1f5",marginBottom:11}}>Oylik jadval</div>
        <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:11,minWidth:320}}>
            <thead>
              <tr style={{borderBottom:"1px solid #23232f"}}>
                {["Oy","Daromat","Keldi","Sotildi","%","Tur"].map(h=>(
                  <th key={h} style={{padding:"7px 8px",textAlign:"left",color:"#4b4b60",fontWeight:700,fontSize:8,textTransform:"uppercase",letterSpacing:"0.07em",whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...months].reverse().map(([m,d])=>{
                const [y,mo]=m.split("-"); const p2=pct(d.sold,d.arrived);
                return (
                  <tr key={m} style={{borderBottom:"1px solid #1c1c28",transition:"background 0.12s"}}
                    onMouseEnter={e=>e.currentTarget.style.background="#1c1c28"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{padding:"9px 8px",fontWeight:600,color:"#f1f1f5",whiteSpace:"nowrap"}}>{MN[+mo-1]} {y}</td>
                    <td style={{padding:"9px 8px",fontWeight:700,color:"#818cf8",fontSize:10,fontFamily:"'JetBrains Mono',monospace",whiteSpace:"nowrap"}}>{fS(d.income)}</td>
                    <td style={{padding:"9px 8px",color:"#60a5fa",fontWeight:600,whiteSpace:"nowrap"}}>{d.arrived} ta</td>
                    <td style={{padding:"9px 8px",color:"#34d399",fontWeight:600,whiteSpace:"nowrap"}}>{d.sold} ta</td>
                    <td style={{padding:"9px 8px",whiteSpace:"nowrap"}}>
                      <span style={{background:`${p2>80?"rgba(52,211,153,0.12)":p2>50?"rgba(251,191,36,0.12)":"rgba(248,113,113,0.12)"}`,color:p2>80?"#34d399":p2>50?"#fbbf24":"#f87171",borderRadius:6,padding:"2px 7px",fontSize:9,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{p2}%</span>
                    </td>
                    <td style={{padding:"9px 8px",color:"#f472b6",fontWeight:600,whiteSpace:"nowrap"}}>{d.kinds.size}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ════════════ SHARED ════════════ */
function FRow({f}) {
  const {delF,msg}=useContext(Ctx);
  const c=gc(f.name); const p2=pct(f.sold,f.arrived);
  return (
    <div style={{display:"flex",alignItems:"center",gap:9,padding:"10px 0",borderBottom:"1px solid #1e1e2a"}}>
      <div style={{width:38,height:38,borderRadius:11,background:`${c}15`,border:`1px solid ${c}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,flexShrink:0}}>{ge(f.name)}</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:13,fontWeight:700,color:"#f1f1f5",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.name}</div>
        <div style={{fontSize:9,color:"#4b4b60",display:"flex",gap:7,marginTop:1}}>
          <span>📦{f.arrived}</span><span>✅{f.sold}</span>
          <span style={{color:p2>80?"#34d399":p2>50?"#fbbf24":"#f87171",fontWeight:700}}>{p2}%</span>
        </div>
      </div>
      <div style={{textAlign:"right",flexShrink:0}}>
        <div style={{fontSize:12,fontWeight:800,color:c,fontFamily:"'JetBrains Mono',monospace"}}>{fS(f.sold*f.price)}</div>
        <div style={{fontSize:8,color:"#4b4b60",marginTop:1}}>{fS(f.price)}/ta</div>
      </div>
      <button onClick={()=>{delF(f.id);msg("O'chirildi","info");}} className="press"
        style={{width:26,height:26,borderRadius:7,background:"rgba(239,68,68,0.07)",color:"#fca5a5",border:"1px solid rgba(239,68,68,0.14)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,flexShrink:0}}>✕</button>
    </div>
  );
}
function FInp({label,val,set,ph,type="text"}) {
  const [f,setF]=useState(false);
  return (
    <div style={{marginBottom:11}}>
      <label style={{display:"block",fontSize:9,fontWeight:700,color:"#4b4b60",textTransform:"uppercase",letterSpacing:"0.09em",marginBottom:5}}>{label}</label>
      <input type={type} value={val} onChange={e=>set(e.target.value)} placeholder={ph} inputMode={type==="number"?"numeric":undefined}
        onFocus={()=>setF(true)} onBlur={()=>setF(false)}
        style={{width:"100%",padding:"11px 12px",borderRadius:11,border:`1.5px solid ${f?"#6366f1":"#2a2a3a"}`,background:"#1c1c28",color:"#f1f1f5",fontSize:13,fontWeight:500,boxSizing:"border-box",transition:"all 0.18s",boxShadow:f?"0 0 0 3px rgba(99,102,241,0.1)":"none",fontFamily:"'Inter',sans-serif"}}/>
    </div>
  );
}
function Toast({t}) {
  const clr={ok:"#34d399",info:"#60a5fa",err:"#f87171"};
  const ic={ok:"✅",info:"ℹ️",err:"⚠️"};
  const c=clr[t.type]||clr.ok;
  return (
    <div style={{position:"fixed",bottom:"calc(66px + env(safe-area-inset-bottom,0px))",left:12,right:12,zIndex:9999,background:"#17171f",border:`1px solid ${c}28`,borderRadius:14,padding:"13px 15px",boxShadow:`0 12px 40px rgba(0,0,0,0.7)`,display:"flex",alignItems:"center",gap:11,animation:"toast 0.35s cubic-bezier(0.16,1,0.3,1) both",backdropFilter:"blur(12px)"}}>
      <div style={{position:"absolute",left:0,top:0,bottom:0,width:3,background:c,borderRadius:"14px 0 0 14px"}}/>
      <div style={{width:32,height:32,borderRadius:9,background:`${c}15`,border:`1px solid ${c}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>{ic[t.type]}</div>
      <div>
        <div style={{fontSize:8,fontWeight:700,color:c,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:2}}>{t.type==="ok"?"Muvaffaqiyat":t.type==="info"?"Ma'lumot":"Xato"}</div>
        <div style={{fontSize:12,color:"#f1f1f5",fontWeight:500}}>{t.text}</div>
      </div>
    </div>
  );
}
function Empty({txt}) {
  return (
    <div style={{textAlign:"center",padding:"28px 16px",color:"#4b4b60"}}>
      <div style={{fontSize:36,marginBottom:8,animation:"float 3s ease infinite",display:"inline-block"}}>🌱</div>
      <div style={{fontSize:13,fontWeight:600,color:"#6b7280",marginBottom:3}}>{txt||"Ma'lumot yo'q"}</div>
      <div style={{fontSize:10,opacity:0.5}}>Hali hech narsa yo'q</div>
    </div>
  );
}