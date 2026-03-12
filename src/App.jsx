import { useState, useContext, createContext } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

/* ═══════════════════════ GLOBAL CSS ═══════════════════════ */
const CSS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    html,body{height:100%;overflow-x:hidden}
    ::-webkit-scrollbar{width:5px;height:5px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:linear-gradient(180deg,rgba(99,102,241,0.5),rgba(139,92,246,0.5));border-radius:4px}
    ::-webkit-scrollbar-thumb:hover{background:linear-gradient(180deg,rgba(99,102,241,0.8),rgba(139,92,246,0.8))}
    @keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes slideL{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}
    @keyframes slideR2{from{opacity:0;transform:translateX(-24px)}to{opacity:1;transform:translateX(0)}}
    @keyframes float{0%,100%{transform:translateY(0px)}50%{transform:translateY(-8px)}}
    @keyframes pulse2{0%,100%{opacity:1}50%{opacity:0.35}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
    @keyframes glowPulse{0%,100%{box-shadow:0 0 8px rgba(99,102,241,0.2)}50%{box-shadow:0 0 22px rgba(99,102,241,0.5)}}
    @keyframes borderGlow{0%,100%{border-color:rgba(99,102,241,0.2)}50%{border-color:rgba(139,92,246,0.6)}}
    @keyframes gradShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
    .fu{animation:fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both}
    .fi{animation:fadeIn 0.35s ease both}
    .sl{animation:slideL 0.45s cubic-bezier(0.16,1,0.3,1) both}
    .sr{animation:slideR2 0.45s cubic-bezier(0.16,1,0.3,1) both}
    .hov{transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1)}
    .hov:hover{transform:translateY(-5px) scale(1.02);box-shadow:0 16px 40px rgba(99,102,241,0.2)!important}
    .press{transition:transform 0.1s ease,opacity 0.1s ease}
    .press:active{transform:scale(0.95)!important;opacity:0.8}
    input,select{outline:none;font-family:'Space Grotesk',sans-serif}
    input[type=date]::-webkit-calendar-picker-indicator{filter:invert(0.5);cursor:pointer}
    .tab-active{color:#818cf8!important;border-bottom-color:#6366f1!important;background:rgba(99,102,241,0.1)!important;font-weight:600!important}
    .gdot{animation:pulse2 2s ease-in-out infinite}
    button:disabled{cursor:not-allowed!important;opacity:0.45}
    .nosel{user-select:none;-webkit-user-select:none}
    .glowing{animation:glowPulse 2.5s ease-in-out infinite}
    .grad-animate{background-size:200% 200%;animation:gradShift 4s ease infinite}
  `}</style>
);

/* ═══════════════════════ THEME ═══════════════════════ */
const mk = (d) => ({
  d,
  bg:    d?"#08080f":"#f0f0f8",
  bg2:   d?"#0d0d1a":"#e4e4f0",
  card:  d?"#111120":"#ffffff",
  card2: d?"#16162a":"#f5f5ff",
  card3: d?"#1c1c35":"#ededff",
  bord:  d?"rgba(99,102,241,0.18)":"rgba(99,102,241,0.16)",
  bord2: d?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.07)",
  tx:    d?"#e8e8ff":"#0f0f28",
  tx2:   d?"#a0a0c8":"#4a4a7a",
  muted: d?"#4a4a70":"#9090b8",
  ind:   "#6366f1", vio:"#8b5cf6", pink:"#ec4899",
  teal:  "#14b8a6", sky:"#0ea5e9", gold:"#f59e0b",
  lime:  "#84cc16", red:"#ef4444", green:"#22c55e", coral:"#f97316",
  gradH: d?"linear-gradient(135deg,#0d0d1a,#111120)":"linear-gradient(135deg,#1e1b4b,#312e81)",
  gradC: d?"linear-gradient(135deg,#111120,#16162a)":"linear-gradient(135deg,#ffffff,#f0f0ff)",
  shad:  d?"0 8px 32px rgba(0,0,0,0.6)":"0 4px 24px rgba(99,102,241,0.1)",
  shad2: d?"0 20px 60px rgba(0,0,0,0.8)":"0 20px 60px rgba(99,102,241,0.15)",
});

/* ═══════════════════════ UTILS ═══════════════════════ */
const td  = () => new Date().toISOString().slice(0,10);
const od  = (n) => { const d=new Date(); d.setDate(d.getDate()+n); return d.toISOString().slice(0,10); };
const fS  = (n) => new Intl.NumberFormat("uz-UZ").format(Math.round(n||0)) + " so'm";
const fD  = (s) => new Date(s+"T00:00:00").toLocaleDateString("uz-UZ",{day:"2-digit",month:"short",year:"numeric"});
const fDs = (s) => new Date(s+"T00:00:00").toLocaleDateString("uz-UZ",{day:"2-digit",month:"short"});
const pct = (a,b) => b?Math.round(a/b*100):0;

/* ═══════════════════════ FLOWER DATA ═══════════════════════ */
const FDB = {
  "Atirgul":       {e:"🌹",c:"#f43f5e",bg:"#f43f5e18"},
  "Qizil Atirgul": {e:"🌹",c:"#dc2626",bg:"#dc262618"},
  "Oq Atirgul":    {e:"🥀",c:"#94a3b8",bg:"#94a3b818"},
  "Sariq Atirgul": {e:"💛",c:"#eab308",bg:"#eab30818"},
  "Lola":          {e:"🌷",c:"#f97316",bg:"#f9731618"},
  "Qizil Lola":    {e:"🌷",c:"#ef4444",bg:"#ef444418"},
  "Binafsha":      {e:"🪻",c:"#a855f7",bg:"#a855f718"},
  "Marvarid gul":  {e:"🌸",c:"#ec4899",bg:"#ec489918"},
  "Yasmin":        {e:"🌼",c:"#facc15",bg:"#facc1518"},
  "Qoqio":         {e:"🌻",c:"#f59e0b",bg:"#f59e0b18"},
  "Nargiz":        {e:"🌺",c:"#fb7185",bg:"#fb718518"},
  "Lilyum":        {e:"💐",c:"#818cf8",bg:"#818cf818"},
  "Gerbera":       {e:"🌸",c:"#f472b6",bg:"#f472b618"},
  "Xrizantema":    {e:"🌼",c:"#fde047",bg:"#fde04718"},
  "Lavanda":       {e:"💜",c:"#c084fc",bg:"#c084fc18"},
  "Magnoliya":     {e:"🌸",c:"#fda4af",bg:"#fda4af18"},
  "Orkide":        {e:"🪷",c:"#d946ef",bg:"#d946ef18"},
  "Pion":          {e:"🌸",c:"#fb7185",bg:"#fb718518"},
  "Tulpan":        {e:"🌷",c:"#e879f9",bg:"#e879f918"},
  "Boshqa":        {e:"🌸",c:"#94a3b8",bg:"#94a3b818"},
};
const gE  = (n="") => { for(const[k,v] of Object.entries(FDB)) if(n.toLowerCase().includes(k.toLowerCase())) return v.e; return "🌸"; };
const gC  = (n="") => { for(const[k,v] of Object.entries(FDB)) if(n.toLowerCase().includes(k.toLowerCase())) return v.c; return "#6366f1"; };
const gBg = (n="") => { for(const[k,v] of Object.entries(FDB)) if(n.toLowerCase().includes(k.toLowerCase())) return v.bg; return "#6366f118"; };

const PRESETS = [
  {n:"Atirgul",p:9000},{n:"Qizil Atirgul",p:10000},{n:"Oq Atirgul",p:8500},{n:"Sariq Atirgul",p:8000},
  {n:"Lola",p:5500},{n:"Qizil Lola",p:6000},{n:"Binafsha",p:6500},{n:"Marvarid gul",p:7000},
  {n:"Yasmin",p:7500},{n:"Qoqio",p:5000},{n:"Nargiz",p:8500},{n:"Lilyum",p:12000},
  {n:"Gerbera",p:6000},{n:"Xrizantema",p:5500},{n:"Lavanda",p:9500},{n:"Magnoliya",p:11000},
  {n:"Orkide",p:18000},{n:"Pion",p:13000},{n:"Tulpan",p:7000},
];

const SEED = [
  {id:1, name:"Atirgul",      arrived:80, sold:62, price:9000,  date:td()},
  {id:2, name:"Lola",         arrived:55, sold:38, price:5500,  date:td()},
  {id:3, name:"Yasmin",       arrived:30, sold:22, price:7500,  date:td()},
  {id:4, name:"Lilyum",       arrived:20, sold:15, price:12000, date:td()},
  {id:5, name:"Orkide",       arrived:12, sold:10, price:18000, date:od(-1)},
  {id:6, name:"Nargiz",       arrived:25, sold:21, price:8500,  date:od(-1)},
  {id:7, name:"Qoqio",        arrived:40, sold:28, price:5000,  date:od(-1)},
  {id:8, name:"Atirgul",      arrived:70, sold:58, price:9000,  date:od(-2)},
  {id:9, name:"Binafsha",     arrived:35, sold:28, price:6500,  date:od(-2)},
  {id:10,name:"Lola",         arrived:50, sold:42, price:5500,  date:od(-3)},
  {id:11,name:"Pion",         arrived:15, sold:13, price:13000, date:od(-3)},
  {id:12,name:"Qizil Atirgul",arrived:45, sold:40, price:10000, date:od(-4)},
  {id:13,name:"Lilyum",       arrived:18, sold:16, price:12000, date:od(-4)},
  {id:14,name:"Marvarid gul", arrived:30, sold:24, price:7000,  date:od(-5)},
  {id:15,name:"Atirgul",      arrived:75, sold:65, price:9000,  date:od(-6)},
  {id:16,name:"Magnoliya",    arrived:10, sold:8,  price:11000, date:od(-6)},
  {id:17,name:"Gerbera",      arrived:40, sold:33, price:6000,  date:od(-7)},
  {id:18,name:"Lavanda",      arrived:22, sold:18, price:9500,  date:od(-7)},
  {id:19,name:"Oq Atirgul",   arrived:35, sold:28, price:8500,  date:od(-8)},
  {id:20,name:"Xrizantema",   arrived:45, sold:38, price:5500,  date:od(-8)},
  {id:21,name:"Tulpan",       arrived:28, sold:22, price:7000,  date:od(-9)},
  {id:22,name:"Orkide",       arrived:8,  sold:7,  price:18000, date:od(-10)},
  {id:23,name:"Atirgul",      arrived:90, sold:75, price:9000,  date:od(-11)},
  {id:24,name:"Lola",         arrived:60, sold:52, price:5500,  date:od(-12)},
  {id:25,name:"Binafsha",     arrived:25, sold:20, price:6500,  date:od(-13)},
];
const USERS = {
  admin:  {pw:"admin123", role:"admin",  name:"Boshqaruvchi", av:"👑"},
  ishchi: {pw:"ishchi123",role:"worker", name:"Ishchi",        av:"🌷"},
};

const Ctx = createContext();

/* ═══════════════════════ APP ═══════════════════════ */
export default function App() {
  const [dark,setDark] = useState(true);
  const [user,setUser] = useState(null);
  const [page,setPage] = useState("dashboard");
  const [flowers,setF] = useState(SEED);
  const [nid,setNid]   = useState(26);
  const [toast,setToast]= useState(null);
  const [open,setOpen] = useState(true);
  const T = mk(dark);

  const toast_ = (msg,type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };
  const addF   = (f) => { setF(p=>[...p,{...f,id:nid}]); setNid(p=>p+1); };
  const delF   = (id) => setF(p=>p.filter(f=>f.id!==id));

  const todayF    = flowers.filter(f=>f.date===td());
  const todayInc  = todayF.reduce((s,f)=>s+f.sold*f.price,0);
  const todayArr  = todayF.reduce((s,f)=>s+f.arrived,0);
  const todaySold = todayF.reduce((s,f)=>s+f.sold,0);
  const todayKind = todayF.length;
  const totalInc  = flowers.reduce((s,f)=>s+f.sold*f.price,0);

  const dailyMap = {};
  flowers.forEach(f=>{ dailyMap[f.date]=(dailyMap[f.date]||0)+f.sold*f.price; });
  const dailyChart = Object.entries(dailyMap).sort((a,b)=>a[0].localeCompare(b[0])).slice(-14)
    .map(([d,v])=>({date:fDs(d),val:v}));

  if(!user) return (
    <div style={{background:T.bg,minHeight:"100vh"}}><CSS/>
      <LoginPage T={T} dark={dark} setDark={setDark} onLogin={u=>{setUser(u);setPage("dashboard");}}/>
    </div>
  );

  const ctx={flowers,addF,delF,todayF,todayInc,todayArr,todaySold,todayKind,totalInc,dailyChart,dailyMap,T,user,toast_,setPage};

  return (
    <Ctx.Provider value={ctx}>
      <div style={{display:"flex",minHeight:"100vh",background:T.bg,color:T.tx,fontFamily:"'Space Grotesk',sans-serif",transition:"background 0.3s,color 0.3s"}}>
        <CSS/>
        <Sidebar page={page} setPage={setPage} dark={dark} setDark={setDark}
          onLogout={()=>{setUser(null);setPage("dashboard");}} open={open} setOpen={setOpen}/>
        <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0,marginLeft:open?224:66,transition:"margin-left 0.3s ease"}}>
          <TopBar open={open} setOpen={setOpen} page={page}/>
          <main style={{flex:1,padding:"24px 28px 60px",overflowY:"auto"}}>
            {user.role==="admin" ? (
              <>
                {page==="dashboard"&&<AdminDash key="ad"/>}
                {page==="flowers"  &&<FlowerGrid key="fg"/>}
                {page==="add"      &&<AddForm key="af"/>}
                {page==="daily"    &&<DailyRep key="dr"/>}
                {page==="yearly"   &&<YearlyRep key="yr"/>}
              </>
            ):(
              <>
                {page==="dashboard"&&<WorkerHome key="wh"/>}
                {page==="add"      &&<AddForm workerMode key="waf"/>}
              </>
            )}
          </main>
        </div>
        {toast&&<Toast t={toast} T={T}/>}
      </div>
    </Ctx.Provider>
  );
}

/* ═══════════════════════ SIDEBAR ═══════════════════════ */
function Sidebar({page,setPage,dark,setDark,onLogout,open,setOpen}){
  const {T,user,todayInc,todayArr,todayKind}=useContext(Ctx);
  const adminNav=[{id:"dashboard",i:"◈",l:"Dashboard"},{id:"flowers",i:"✦",l:"Gullar"},{id:"add",i:"⊕",l:"Kiritish"},{id:"daily",i:"◷",l:"Kunlik"},{id:"yearly",i:"◎",l:"Yillik"}];
  const workerNav=[{id:"dashboard",i:"◈",l:"Asosiy"},{id:"add",i:"⊕",l:"Gul kiritish"}];
  const nav=user.role==="admin"?adminNav:workerNav;
  const SB=open?224:66;
  return (
    <div style={{position:"fixed",top:0,left:0,height:"100vh",width:SB,background:"linear-gradient(180deg,#080812,#0c0c1e,#0a0a18)",borderRight:`1px solid rgba(99,102,241,0.15)`,display:"flex",flexDirection:"column",zIndex:200,transition:"width 0.3s cubic-bezier(0.4,0,0.2,1)",overflow:"hidden"}}>
      {/* Animated background */}
      <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(ellipse at 50% 0%,rgba(99,102,241,0.1) 0%,transparent 60%),radial-gradient(ellipse at 0% 100%,rgba(139,92,246,0.06) 0%,transparent 50%)",pointerEvents:"none"}}/>
      {/* Right glow line */}
      <div style={{position:"absolute",top:0,right:0,width:1,height:"100%",background:"linear-gradient(180deg,transparent,rgba(99,102,241,0.4),rgba(139,92,246,0.25),transparent)",pointerEvents:"none"}}/>
      {/* Logo */}
      <div style={{padding:"18px 14px 14px",borderBottom:"1px solid rgba(99,102,241,0.12)",flexShrink:0,position:"relative"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:38,height:38,borderRadius:11,background:"linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0,boxShadow:"0 4px 18px rgba(99,102,241,0.55),0 0 0 1px rgba(99,102,241,0.2)",animation:"float 3s ease-in-out infinite"}}>🌸</div>
          {open&&<div className="fi">
            <div style={{fontSize:12,fontWeight:700,color:"#fff",letterSpacing:"0.06em",fontFamily:"'Space Mono',monospace",textShadow:"0 0 20px rgba(99,102,241,0.5)"}}>GUL DO'KONI</div>
            <div style={{fontSize:8,color:"rgba(139,92,246,0.6)",marginTop:1,letterSpacing:"0.04em"}}>v2.0 · PREMIUM</div>
          </div>}
        </div>
      </div>
      {/* User */}
      {open&&(
        <div className="fi" style={{padding:"10px 12px",borderBottom:"1px solid rgba(99,102,241,0.1)",flexShrink:0}}>
          <div style={{background:"linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.06))",borderRadius:11,padding:"9px 11px",border:"1px solid rgba(99,102,241,0.18)"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:30,height:30,borderRadius:8,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0,boxShadow:"0 2px 10px rgba(99,102,241,0.4)"}}>{user.av}</div>
              <div>
                <div style={{fontSize:12,fontWeight:600,color:"#e8e8ff"}}>{user.name}</div>
                <div style={{display:"flex",alignItems:"center",gap:4,marginTop:1}}>
                  <div className="gdot" style={{width:5,height:5,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 6px #22c55e"}}/>
                  <span style={{fontSize:9,color:"rgba(255,255,255,0.3)"}}>Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Nav */}
      <div style={{flex:1,padding:"10px 8px",overflowY:"auto",overflowX:"hidden"}}>
        {open&&<div style={{fontSize:8,color:"rgba(255,255,255,0.18)",fontWeight:700,letterSpacing:"0.12em",padding:"4px 7px 9px",textTransform:"uppercase"}}>Navigatsiya</div>}
        {nav.map((n,i)=>{
          const a=page===n.id;
          return (
            <button key={n.id} onClick={()=>setPage(n.id)} className="press nosel"
              style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:open?"9px 11px":"9px",background:a?"linear-gradient(135deg,rgba(99,102,241,0.22),rgba(139,92,246,0.12))":"transparent",border:`1px solid ${a?"rgba(99,102,241,0.35)":"transparent"}`,borderRadius:10,cursor:"pointer",marginBottom:3,color:a?"#a5b4fc":"rgba(255,255,255,0.38)",transition:"all 0.2s",justifyContent:open?"flex-start":"center",boxShadow:a?"inset 0 1px 0 rgba(255,255,255,0.04),0 4px 12px rgba(99,102,241,0.15)":"none",animationDelay:`${i*0.04}s`}}
              onMouseEnter={e=>{if(!a){e.currentTarget.style.background="rgba(99,102,241,0.08)";e.currentTarget.style.color="rgba(255,255,255,0.6)";}}}
              onMouseLeave={e=>{if(!a){e.currentTarget.style.background="transparent";e.currentTarget.style.color="rgba(255,255,255,0.38)";}}} >
              <span style={{fontSize:14,fontFamily:"'Space Mono',monospace",flexShrink:0,color:a?"#818cf8":"rgba(255,255,255,0.3)"}}>{n.i}</span>
              {open&&<span className="fi" style={{fontSize:12,fontWeight:a?600:400,letterSpacing:"0.01em"}}>{n.l}</span>}
              {a&&open&&<div style={{marginLeft:"auto",width:5,height:5,borderRadius:"50%",background:"#818cf8",boxShadow:"0 0 10px #818cf8,0 0 4px #6366f1"}}/>}
            </button>
          );
        })}
      </div>
      {/* Stats */}
      {open&&(
        <div className="fi" style={{padding:"10px 12px",borderTop:"1px solid rgba(99,102,241,0.1)",flexShrink:0}}>
          <div style={{fontSize:8,color:"rgba(255,255,255,0.18)",fontWeight:700,letterSpacing:"0.12em",marginBottom:9,textTransform:"uppercase"}}>Bugungi holat</div>
          {user.role==="admin"&&[
            {l:"Daromat",v:fS(todayInc),c:"#818cf8"},
            {l:"Chiqqan",v:`${todayArr} ta`,c:"#4ade80"},
            {l:"Gul turi",v:`${todayKind} xil`,c:"#f472b6"},
          ].map(x=>(
            <div key={x.l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6,background:"rgba(255,255,255,0.02)",borderRadius:6,padding:"3px 6px"}}>
              <span style={{fontSize:9,color:"rgba(255,255,255,0.25)"}}>{x.l}</span>
              <span style={{fontSize:9,fontWeight:700,color:x.c,fontFamily:"'Space Mono',monospace",textShadow:`0 0 10px ${x.c}44`}}>{x.v}</span>
            </div>
          ))}
          {user.role==="worker"&&[
            {l:"Chiqqan",v:`${todayArr} ta`,c:"#4ade80"},
            {l:"Gul turi",v:`${todayKind} xil`,c:"#f472b6"},
          ].map(x=>(
            <div key={x.l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6,background:"rgba(255,255,255,0.02)",borderRadius:6,padding:"3px 6px"}}>
              <span style={{fontSize:9,color:"rgba(255,255,255,0.25)"}}>{x.l}</span>
              <span style={{fontSize:9,fontWeight:700,color:x.c,fontFamily:"'Space Mono',monospace"}}>{x.v}</span>
            </div>
          ))}
        </div>
      )}
      {/* Bottom btns */}
      <div style={{padding:"8px",borderTop:"1px solid rgba(99,102,241,0.1)",flexShrink:0,display:"flex",flexDirection:"column",gap:5}}>
        <button className="press" onClick={()=>setDark(!dark)}
          style={{width:"100%",display:"flex",alignItems:"center",justifyContent:open?"flex-start":"center",gap:8,padding:"7px 10px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:9,cursor:"pointer",color:"rgba(255,255,255,0.4)",fontSize:12,transition:"all 0.2s"}}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.07)"}
          onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.03)"}>
          <span>{dark?"☀️":"🌙"}</span>
          {open&&<span className="fi" style={{fontSize:11}}>{dark?"Yorug' rejim":"Qorong'i rejim"}</span>}
        </button>
        <button className="press" onClick={onLogout}
          style={{width:"100%",display:"flex",alignItems:"center",justifyContent:open?"flex-start":"center",gap:8,padding:"7px 10px",background:"rgba(239,68,68,0.07)",border:"1px solid rgba(239,68,68,0.14)",borderRadius:9,cursor:"pointer",color:"rgba(239,68,68,0.65)",fontSize:12,transition:"all 0.2s"}}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(239,68,68,0.14)"}
          onMouseLeave={e=>e.currentTarget.style.background="rgba(239,68,68,0.07)"}>
          <span>↩</span>
          {open&&<span className="fi" style={{fontSize:11}}>Chiqish</span>}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════ TOPBAR ═══════════════════════ */
function TopBar({open,setOpen,page}){
  const {T,user,todayInc,todayArr,todayKind,todaySold,flowers}=useContext(Ctx);
  const titles={dashboard:"Dashboard",flowers:"Gullar",add:"Kiritish",daily:"Kunlik hisobot",yearly:"Yillik hisobot"};
  const totalFlowers=flowers.length;
  const todayRem=todayArr-todaySold;
  return (
    <div style={{background:T.d?`linear-gradient(135deg,${T.card},${T.card2})`:`linear-gradient(135deg,#fff,#f8f8ff)`,borderBottom:`1px solid ${T.bord}`,padding:"10px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexShrink:0,position:"sticky",top:0,zIndex:100,boxShadow:T.d?"0 2px 20px rgba(0,0,0,0.4)":"0 2px 12px rgba(99,102,241,0.08)"}}>
      {/* Left: toggle + title */}
      <div style={{display:"flex",alignItems:"center",gap:10,minWidth:0}}>
        <button className="press" onClick={()=>setOpen(p=>!p)}
          style={{width:32,height:32,borderRadius:9,background:`linear-gradient(135deg,${T.ind}14,${T.vio}0a)`,border:`1px solid ${T.ind}28`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:T.ind,fontFamily:"'Space Mono',monospace",flexShrink:0,boxShadow:`0 2px 8px ${T.ind}18`}}>
          {open?"‹":"›"}
        </button>
        <div style={{minWidth:0}}>
          <div style={{fontSize:14,fontWeight:700,color:T.tx,letterSpacing:"-0.01em",fontFamily:"'Space Mono',monospace",whiteSpace:"nowrap"}}>{titles[page]||"Panel"}</div>
          <div style={{fontSize:9,color:T.muted,display:"flex",alignItems:"center",gap:5,marginTop:1}}>
            <div className="gdot" style={{width:5,height:5,borderRadius:"50%",background:"#22c55e",flexShrink:0}}/>
            {fD(td())}
          </div>
        </div>
      </div>
      {/* Center: stat badges */}
      <div style={{display:"flex",gap:6,flex:1,justifyContent:"center",flexWrap:"wrap",alignItems:"center"}}>
        {user.role==="admin"&&<>
          <TBStat label="Kunlik daromat" val={fS(todayInc)}       c="#818cf8" ico="💰"/>
          <TBStat label="Bugun chiqqan"  val={`${todayArr} ta`}   c="#4ade80" ico="🌷"/>
          <TBStat label="Bugun sotildi"  val={`${todaySold} ta`}  c="#14b8a6" ico="✅"/>
          <TBStat label="Qolgan"         val={`${todayRem} ta`}   c="#f59e0b" ico="📦"/>
          <TBStat label="Gul turlari"    val={`${todayKind} xil`} c="#f472b6" ico="🌸"/>
          <TBStat label="Jami yozuv"     val={`${totalFlowers} ta`}c="#a78bfa" ico="📋"/>
        </>}
        {user.role==="worker"&&<>
          <TBStat label="Bugun chiqqan"  val={`${todayArr} ta`}   c="#4ade80" ico="🌷"/>
          <TBStat label="Bugun sotildi"  val={`${todaySold} ta`}  c="#14b8a6" ico="✅"/>
          <TBStat label="Gul turlari"    val={`${todayKind} xil`} c="#f472b6" ico="🌸"/>
          <TBStat label="Jami yozuv"     val={`${totalFlowers} ta`}c="#a78bfa" ico="📋"/>
        </>}
      </div>
      {/* Right: user badge */}
      <div style={{display:"flex",alignItems:"center",gap:7,background:`linear-gradient(135deg,${T.ind}12,${T.vio}08)`,border:`1px solid ${T.ind}28`,borderRadius:12,padding:"6px 12px",flexShrink:0,boxShadow:`0 2px 12px ${T.ind}14`}}>
        <div style={{width:28,height:28,borderRadius:8,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0,boxShadow:"0 2px 8px rgba(99,102,241,0.4)"}}>{user.av}</div>
        <div>
          <div style={{fontSize:11,fontWeight:700,color:T.tx,lineHeight:1.2}}>{user.name}</div>
          <div style={{fontSize:8,color:T.muted,fontFamily:"'Space Mono',monospace"}}>{user.role==="admin"?"ADMIN":"ISHCHI"}</div>
        </div>
      </div>
    </div>
  );
}
function TBStat({label,val,c,ico}){
  return (
    <div style={{background:`${c}0e`,border:`1px solid ${c}22`,borderRadius:10,padding:"5px 10px",textAlign:"center",position:"relative",overflow:"hidden",transition:"all 0.2s",cursor:"default"}}
      onMouseEnter={e=>e.currentTarget.style.transform="translateY(-1px)"}
      onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
      <div style={{position:"absolute",right:-2,top:-2,fontSize:22,opacity:0.06,lineHeight:1}}>{ico}</div>
      <div style={{fontSize:7,color:`${c}aa`,textTransform:"uppercase",letterSpacing:"0.09em",marginBottom:2,fontWeight:700}}>{label}</div>
      <div style={{color:c,fontFamily:"'Space Mono',monospace",fontWeight:700,fontSize:11,letterSpacing:"-0.01em"}}>{val}</div>
    </div>
  );
}

/* ═══════════════════════ LOGIN ═══════════════════════ */
function LoginPage({T,dark,setDark,onLogin}){
  const [u,setU]=useState(""); const [p,setP]=useState(""); const [err,setErr]=useState(""); const [ld,setLd]=useState(false);
  const go=()=>{
    if(!u||!p) return setErr("Login va parolni kiriting!");
    setLd(true);
    setTimeout(()=>{const usr=USERS[u];if(usr&&usr.pw===p)onLogin({...usr,username:u});else{setErr("Login yoki parol noto'g'ri!");setLd(false);}},500);
  };
  return (
    <div style={{minHeight:"100vh",display:"flex",fontFamily:"'Space Grotesk',sans-serif"}}>
      {/* Left */}
     
      {/* Right */}
      <div style={{flex:1,background:T.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:40,position:"relative"}}>
        <div style={{position:"absolute",top:18,right:18}}>
          <button className="press" onClick={()=>setDark(!dark)} style={{width:36,height:36,borderRadius:9,background:T.card,border:`1px solid ${T.bord}`,cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}}>{dark?"☀️":"🌙"}</button>
        </div>
        <div style={{width:"100%",maxWidth:340,animation:"fadeUp 0.5s ease"}}>
          <div style={{marginBottom:32}}>
            <h2 style={{fontSize:24,fontWeight:700,color:T.tx,letterSpacing:"-0.02em",marginBottom:5}}>Tizimga kiring</h2>
            <p style={{fontSize:12,color:T.muted}}>Hisobingiz ma'lumotlarini kiriting</p>
          </div>
          <LInp label="Login" val={u} set={setU} ph="admin yoki ishchi" T={T} ico="◈"/>
          <LInp label="Parol" val={p} set={setP} ph="••••••••" type="password" T={T} ico="◉" onEnter={go}/>
          {err&&<div style={{background:"rgba(239,68,68,0.06)",color:"#ef4444",border:"1px solid rgba(239,68,68,0.2)",padding:"9px 12px",borderRadius:9,marginBottom:12,fontSize:11,display:"flex",gap:6,alignItems:"center"}}><span>⚠</span>{err}</div>}
          <button className="press" onClick={go} disabled={ld}
            style={{width:"100%",padding:"12px",background:ld?"rgba(99,102,241,0.4)":"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:10,fontSize:13,fontWeight:600,cursor:"pointer",letterSpacing:"0.02em",boxShadow:ld?"none":"0 4px 18px rgba(99,102,241,0.4)",transition:"all 0.2s",marginBottom:18}}>
            {ld?<span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><span style={{animation:"spin 0.7s linear infinite",display:"inline-block"}}>◌</span>Kirish...</span>:"Kirish  →"}
          </button>
          <div style={{borderTop:`1px solid ${T.bord}`,paddingTop:18}}>
            <div style={{fontSize:9,color:T.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:9}}>Tez kirish</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
              {[{r:"👑 Admin",l:"admin",pw:"admin123",c:"#818cf8"},{r:"🌷 Ishchi",l:"ishchi",pw:"ishchi123",c:"#f472b6"}].map(x=>(
                <button key={x.l} className="press" onClick={()=>{setU(x.l);setP(x.pw);setErr("");}}
                  style={{padding:"9px 11px",background:u===x.l?`${x.c}14`:T.card,border:`1px solid ${u===x.l?x.c+"44":T.bord}`,borderRadius:9,cursor:"pointer",textAlign:"left",transition:"all 0.2s"}}>
                  <div style={{fontSize:11,fontWeight:600,color:T.tx,marginBottom:2}}>{x.r}</div>
                  <div style={{fontSize:9,color:T.muted,fontFamily:"'Space Mono',monospace"}}>{x.l} / {x.pw}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function LInp({label,val,set,ph,type="text",T,ico,onEnter}){
  return (
    <div style={{marginBottom:13}}>
      <label style={{display:"block",fontSize:9,fontWeight:700,color:T.muted,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.08em"}}>{label}</label>
      <div style={{position:"relative"}}>
        <span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",fontSize:12,color:T.muted,pointerEvents:"none",fontFamily:"'Space Mono',monospace"}}>{ico}</span>
        <input type={type} value={val} onChange={e=>set(e.target.value)} placeholder={ph} onKeyDown={e=>e.key==="Enter"&&onEnter&&onEnter()}
          style={{width:"100%",padding:"10px 12px 10px 31px",borderRadius:9,border:`1.5px solid ${T.bord}`,background:T.card,color:T.tx,fontSize:12,fontWeight:500,boxSizing:"border-box",transition:"border-color 0.2s,box-shadow 0.2s"}}
          onFocus={e=>{e.target.style.borderColor="#6366f1";e.target.style.boxShadow="0 0 0 3px rgba(99,102,241,0.1)";}}
          onBlur={e=>{e.target.style.borderColor=T.bord;e.target.style.boxShadow="none";}}/>
      </div>
    </div>
  );
}

/* ═══════════════════════ ADMIN DASHBOARD ═══════════════════════ */
function AdminDash(){
  const {todayF,todayInc,todayArr,todaySold,todayKind,totalInc,dailyChart,flowers,T,setPage}=useContext(Ctx);
  const rem=flowers.reduce((s,f)=>s+f.arrived-f.sold,0);
  const avgP=flowers.length?flowers.reduce((s,f)=>s+f.price,0)/flowers.length:0;
  const byF={};flowers.forEach(f=>{byF[f.name]=(byF[f.name]||0)+f.sold*f.price;});
  const pie=Object.entries(byF).map(([n,v])=>({name:n,value:v,pct:Math.round(v/totalInc*100)})).sort((a,b)=>b.value-a.value).slice(0,6);
  const PC=["#6366f1","#8b5cf6","#ec4899","#14b8a6","#f59e0b","#22c55e"];
  return (
    <div className="fu">
      <Ptitle T={T} title="Dashboard" sub={`Bugun — ${fD(td())}`}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:11,marginBottom:22}}>
        <KCard T={T} ico="💰" l="Kunlik daromat" v={fS(todayInc)}      c={T.ind}   badge="Bugun" onClick={()=>setPage("daily")}/>
        <KCard T={T} ico="📈" l="Jami daromat"   v={fS(totalInc)}      c={T.vio}   badge="Jami"  onClick={()=>setPage("yearly")}/>
        <KCard T={T} ico="🌷" l="Bugun chiqqan"  v={`${todayArr} ta`}  c={T.teal}  badge={`${todayKind} tur`}/>
        <KCard T={T} ico="✅" l="Bugun sotilgan" v={`${todaySold} ta`} c={T.green} badge={pct(todaySold,todayArr)+"%"}/>
        <KCard T={T} ico="📦" l="Ombor qoldig'i" v={`${rem} ta`}       c={T.gold}  badge="Ombor"/>
        <KCard T={T} ico="💎" l="O'rtacha narx"  v={fS(avgP)}          c={T.sky}   badge="Birlik"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:14,marginBottom:16}}>
        <Crd T={T}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div><div style={{fontSize:12,fontWeight:700,color:T.tx}}>14 kunlik daromat</div><div style={{fontSize:10,color:T.muted}}>So'm</div></div>
            <span style={{background:`${T.ind}12`,border:`1px solid ${T.ind}28`,borderRadius:7,padding:"3px 9px",fontSize:9,color:T.ind,fontWeight:700}}>Area chart</span>
          </div>
          <ResponsiveContainer width="100%" height={175}>
            <AreaChart data={dailyChart} margin={{top:4,right:4,left:0,bottom:0}}>
              <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.35}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
              <XAxis dataKey="date" tick={{fill:T.muted,fontSize:9,fontFamily:"'Space Grotesk'"}} axisLine={false} tickLine={false}/>
              <YAxis hide/>
              <Tooltip contentStyle={{background:T.card,border:`1px solid ${T.bord}`,borderRadius:9,color:T.tx,fontSize:10,fontFamily:"'Space Grotesk'"}} formatter={v=>[fS(v),"Daromat"]}/>
              <Area type="monotone" dataKey="val" stroke="#6366f1" strokeWidth={2.5} fill="url(#ag)" dot={false} activeDot={{r:4,fill:"#6366f1"}}/>
            </AreaChart>
          </ResponsiveContainer>
        </Crd>
        <Crd T={T}>
          <div style={{fontSize:12,fontWeight:700,color:T.tx,marginBottom:12}}>Top gullar (daromat %)</div>
          <ResponsiveContainer width="100%" height={125}>
            <PieChart><Pie data={pie} cx="50%" cy="50%" innerRadius={38} outerRadius={56} paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270}>{pie.map((_,i)=><Cell key={i} fill={PC[i%6]}/>)}</Pie><Tooltip contentStyle={{background:T.card,border:`1px solid ${T.bord}`,borderRadius:8,color:T.tx,fontSize:10}} formatter={v=>[fS(v)]}/></PieChart>
          </ResponsiveContainer>
          <div style={{display:"flex",flexDirection:"column",gap:5,marginTop:6}}>
            {pie.slice(0,5).map((d,i)=>(
              <div key={d.name} style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:6,height:6,borderRadius:2,background:PC[i],flexShrink:0}}/>
                <span style={{flex:1,fontSize:10,color:T.tx2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.name}</span>
                <span style={{fontSize:9,fontWeight:700,color:PC[i],fontFamily:"'Space Mono',monospace"}}>{d.pct}%</span>
              </div>
            ))}
          </div>
        </Crd>
      </div>
      <Crd T={T}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontSize:12,fontWeight:700,color:T.tx}}>Bugungi gullar</div>
          <span style={{fontSize:9,color:T.muted,background:T.card2,padding:"2px 8px",borderRadius:12,border:`1px solid ${T.bord}`}}>{todayF.length} ta yozuv</span>
        </div>
        {todayF.length===0?<Mpty T={T} txt="Bugun ma'lumot kiritilmagan"/>:<FTbl flowers={todayF} T={T}/>}
      </Crd>
    </div>
  );
}

/* ═══════════════════════ FLOWER GRID ═══════════════════════ */
function FlowerGrid(){
  const {flowers,delF,T,toast_}=useContext(Ctx);
  const [q,setQ]=useState(""); const [srt,setSrt]=useState("date"); const [view,setView]=useState("grid");
  let list=[...flowers];
  if(q) list=list.filter(f=>f.name.toLowerCase().includes(q.toLowerCase())||f.date.includes(q));
  if(srt==="date") list.sort((a,b)=>b.date.localeCompare(a.date));
  if(srt==="inc")  list.sort((a,b)=>b.sold*b.price-a.sold*a.price);
  if(srt==="arr")  list.sort((a,b)=>b.arrived-a.arrived);
  return (
    <div className="fu">
      <Ptitle T={T} title="Gullar" sub={`${list.length} ta yozuv`}/>
      <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{flex:1,minWidth:190,position:"relative"}}>
          <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",fontSize:11,color:T.muted,pointerEvents:"none"}}>◎</span>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Qidirish..."
            style={{width:"100%",padding:"8px 11px 8px 28px",borderRadius:8,border:`1.5px solid ${T.bord}`,background:T.card,color:T.tx,fontSize:12,boxSizing:"border-box",transition:"border-color 0.2s"}}
            onFocus={e=>e.target.style.borderColor=T.ind} onBlur={e=>e.target.style.borderColor=T.bord}/>
        </div>
        <select value={srt} onChange={e=>setSrt(e.target.value)}
          style={{padding:"8px 12px",borderRadius:8,border:`1.5px solid ${T.bord}`,background:T.card,color:T.tx,fontSize:11,cursor:"pointer"}}>
          <option value="date">Sana ↓</option><option value="inc">Daromat ↓</option><option value="arr">Miqdor ↓</option>
        </select>
        <div style={{display:"flex",background:T.card,border:`1px solid ${T.bord}`,borderRadius:8,overflow:"hidden"}}>
          {["grid","list"].map(v=>(
            <button key={v} className="press" onClick={()=>setView(v)}
              style={{padding:"7px 11px",background:view===v?T.ind:"transparent",color:view===v?"#fff":T.muted,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,transition:"all 0.15s"}}>
              {v==="grid"?"⊞":"≡"}
            </button>
          ))}
        </div>
      </div>
      {view==="grid"?(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(265px,1fr))",gap:11}}>
          {list.map((f,i)=>(
            <div key={f.id} className="fu" style={{animationDelay:`${i*0.03}s`}}>
              <FCard f={f} onDel={()=>{delF(f.id);toast_(`${f.name} o'chirildi`,"info");}} T={T}/>
            </div>
          ))}
        </div>
      ):(
        <Crd T={T}><FTbl flowers={list} T={T}/></Crd>
      )}
      {list.length===0&&<Mpty T={T} txt="Gul topilmadi"/>}
    </div>
  );
}
function FCard({f,onDel,T}){
  const p2=pct(f.sold,f.arrived); const fc=gC(f.name);
  return (
    <div className="hov" style={{background:T.gradC,borderRadius:14,border:`1px solid ${T.bord}`,boxShadow:T.shad,overflow:"hidden",position:"relative"}}>
      <div style={{height:2,background:`linear-gradient(90deg,${fc},${fc}55)`}}/>
      <div style={{padding:"14px 14px 12px",position:"relative"}}>
        <div style={{position:"absolute",right:10,top:10,fontSize:54,opacity:0.04,lineHeight:1}}>{gE(f.name)}</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:11}}>
          <div style={{display:"flex",gap:9,alignItems:"center"}}>
            <div style={{width:42,height:42,borderRadius:11,background:gBg(f.name),border:`1.5px solid ${fc}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:21,flexShrink:0}}>{gE(f.name)}</div>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:T.tx,letterSpacing:"-0.01em"}}>{f.name}</div>
              <div style={{fontSize:9,color:T.muted,marginTop:1}}>{fD(f.date)}</div>
            </div>
          </div>
          <button onClick={onDel} className="press" style={{width:26,height:26,borderRadius:6,background:"rgba(239,68,68,0.08)",color:T.red,border:"1px solid rgba(239,68,68,0.18)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,flexShrink:0}}>✕</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:5,marginBottom:10}}>
          <SS l="Chiqqan"  v={f.arrived}        c={T.sky}   T={T}/>
          <SS l="Sotilgan" v={f.sold}            c={T.green} T={T}/>
          <SS l="Qolgan"   v={f.arrived-f.sold}  c={T.gold}  T={T}/>
        </div>
        <div style={{marginBottom:9}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:8,marginBottom:3}}>
            <span style={{color:T.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em"}}>Sotish koeff.</span>
            <span style={{fontWeight:700,fontSize:9,color:p2>80?T.green:p2>50?T.gold:T.red}}>{p2}%</span>
          </div>
          <div style={{height:3,background:T.card3,borderRadius:2,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${p2}%`,borderRadius:2,transition:"width 0.9s",background:p2>80?`linear-gradient(90deg,${T.green},${T.teal})`:p2>50?`linear-gradient(90deg,${T.gold},${T.coral})`:`linear-gradient(90deg,${T.red},${T.pink})`}}/>
          </div>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",paddingTop:9,borderTop:`1px solid ${T.bord2}`}}>
          <div>
            <div style={{fontSize:7,color:T.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:1}}>Birlik narxi</div>
            <div style={{fontSize:11,fontWeight:600,color:T.tx2,fontFamily:"'Space Mono',monospace"}}>{fS(f.price)}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:7,color:T.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:1}}>Daromat</div>
            <div style={{fontSize:14,fontWeight:700,color:fc,fontFamily:"'Space Mono',monospace"}}>{fS(f.sold*f.price)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════ ADD FORM ═══════════════════════ */
function AddForm({workerMode}){
  const {addF,T,toast_}=useContext(Ctx);
  const ini={name:"",arrived:"",sold:"",price:"",date:td()};
  const [form,setForm]=useState(ini);
  const [cards,setCards]=useState([]);
  const [err,setErr]=useState("");
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  const save=()=>{
    if(!form.name.trim())           return setErr("Gul nomini kiriting!");
    if(!form.arrived||+form.arrived<=0) return setErr("Chiqqan sonni kiriting!");
    if(!form.price||+form.price<=0) return setErr("Narxni kiriting!");
    if(form.sold&&+form.sold>+form.arrived) return setErr("Sotilgan chiqqandan ko'p bo'lolmaydi!");
    setErr("");
    const fl={name:form.name.trim(),arrived:+form.arrived,sold:+form.sold||0,price:+form.price,date:form.date};
    addF(fl);
    setCards(p=>[{...fl,cid:Date.now()},...p]);
    setForm(ini);
    toast_(`${fl.name} muvaffaqiyatli saqlandi ✅`);
  };
  const delCard=(cid,nm)=>{setCards(p=>p.filter(c=>c.cid!==cid));toast_(`${nm} o'chirildi`,"info");};
  const prev=form.name||form.arrived||form.price;
  return (
    <div className="fu">
      <Ptitle T={T} title={workerMode?"Gul kiritish":"Yangi gul"} sub="Ma'lumot qo'shish"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 360px",gap:16,alignItems:"start"}}>
        <Crd T={T}>
          <div style={{fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.09em",marginBottom:16}}>⊕ Ma'lumot kiritish</div>
          {/* Presets */}
          <div style={{marginBottom:16}}>
            <div style={{fontSize:9,color:T.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:7}}>⚡ Tezkor tanlash — narx avtomatik</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:4,maxHeight:104,overflowY:"auto"}}>
              {PRESETS.map(pr=>{
                const a=form.name===pr.n; const c=gC(pr.n);
                return (
                  <button key={pr.n} className="press" onClick={()=>setForm(p=>({...p,name:pr.n,price:String(pr.p)}))}
                    style={{background:a?`${c}18`:T.card2,color:a?c:T.tx2,border:`1.5px solid ${a?c+"55":T.bord}`,borderRadius:16,padding:"3px 9px",cursor:"pointer",fontSize:10,fontWeight:a?700:400,display:"flex",alignItems:"center",gap:3,transition:"all 0.15s",boxShadow:a?`0 0 8px ${c}33`:"none"}}>
                    <span style={{fontSize:12}}>{gE(pr.n)}</span>{pr.n}
                    <span style={{fontSize:8,opacity:0.5,fontFamily:"'Space Mono',monospace"}}>{(pr.p/1000).toFixed(0)}k</span>
                  </button>
                );
              })}
            </div>
          </div>
          <FInp label="🌸 Gul nomi" val={form.name} set={v=>f("name",v)} ph="Masalan: Atirgul" T={T}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}>
            <FInp label="📦 Chiqqan (ta)"  val={form.arrived} set={v=>f("arrived",v)} type="number" ph="50"   T={T}/>
            <FInp label="✅ Sotilgan (ta)" val={form.sold}    set={v=>f("sold",v)}    type="number" ph="0"    T={T}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}>
            <FInp label="💰 Narx (so'm)"  val={form.price} set={v=>f("price",v)} type="number" ph="9000" T={T}/>
            <FInp label="📅 Sana"         val={form.date}  set={v=>f("date",v)}  type="date"           T={T}/>
          </div>
          {prev&&(
            <div style={{background:`linear-gradient(135deg,${T.ind}0d,${T.vio}07)`,border:`1px dashed ${T.ind}3a`,borderRadius:10,padding:12,marginBottom:12}}>
              <div style={{fontSize:8,color:T.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:7}}>Ko'rinish</div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:40,height:40,borderRadius:10,background:gBg(form.name),border:`1.5px solid ${gC(form.name)}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{gE(form.name||"")}</div>
                <div>
                  <div style={{fontWeight:700,fontSize:13,color:T.tx}}>{form.name||"Gul nomi"}</div>
                  <div style={{fontSize:10,color:T.tx2,marginTop:2}}>📦 {form.arrived||0} · ✅ {form.sold||0} · Qoldi: {(+form.arrived||0)-(+form.sold||0)}</div>
                  {form.price&&<div style={{fontSize:11,fontWeight:700,color:gC(form.name),marginTop:2,fontFamily:"'Space Mono',monospace"}}>{fS((+form.sold||0)*(+form.price||0))}</div>}
                </div>
              </div>
            </div>
          )}
          {err&&<div style={{background:"rgba(239,68,68,0.06)",color:"#ef4444",border:"1px solid rgba(239,68,68,0.2)",padding:"9px 12px",borderRadius:9,marginBottom:11,fontSize:11,display:"flex",gap:5,alignItems:"center"}}><span>⚠</span>{err}</div>}
          <button className="press" onClick={save}
            style={{width:"100%",padding:"12px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:10,fontSize:13,fontWeight:600,cursor:"pointer",letterSpacing:"0.02em",boxShadow:"0 4px 16px rgba(99,102,241,0.35)",transition:"all 0.2s"}}>
            💾 Saqlash
          </button>
        </Crd>
        {/* Saved cards */}
        <div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:11}}>
            <div style={{fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.09em"}}>⊞ Saqlangan</div>
            {cards.length>0&&<span style={{background:`${T.ind}14`,color:T.ind,border:`1px solid ${T.ind}2e`,borderRadius:12,padding:"1px 8px",fontSize:10,fontWeight:700,fontFamily:"'Space Mono',monospace"}}>{cards.length}</span>}
          </div>
          {cards.length===0?(
            <div style={{background:T.card,borderRadius:12,padding:32,textAlign:"center",border:`2px dashed ${T.bord}`,color:T.muted}}>
              <div style={{fontSize:34,marginBottom:7,animation:"float 3s ease-in-out infinite"}}>🌱</div>
              <div style={{fontSize:11,marginBottom:3}}>Hali kartochka yo'q</div>
              <div style={{fontSize:9,opacity:0.5}}>"Saqlash" tugmasini bosing</div>
            </div>
          ):cards.map((c,i)=>{
            const fc=gC(c.name);
            return (
              <div key={c.cid} className="sl" style={{background:T.gradC,borderRadius:13,marginBottom:9,border:`1px solid ${T.bord}`,overflow:"hidden",animationDelay:`${i*0.04}s`,boxShadow:T.shad}}>
                <div style={{height:2,background:`linear-gradient(90deg,${fc},${fc}55)`}}/>
                <div style={{padding:"11px 12px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:9}}>
                    <div style={{width:36,height:36,borderRadius:9,background:gBg(c.name),border:`1.5px solid ${fc}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{gE(c.name)}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,fontWeight:700,color:T.tx}}>{c.name}</div>
                      <div style={{fontSize:8,color:T.muted,fontFamily:"'Space Mono',monospace",marginTop:1}}>📦 {c.arrived} · ✅ {c.sold} · {fS(c.price)}</div>
                    </div>
                    <div style={{fontSize:12,fontWeight:700,color:fc,fontFamily:"'Space Mono',monospace",flexShrink:0}}>{fS(c.sold*c.price)}</div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4,marginBottom:9}}>
                    <SS l="Chiqqan"  v={c.arrived}       c={T.sky}   T={T}/>
                    <SS l="Sotilgan" v={c.sold}           c={T.green} T={T}/>
                    <SS l="Qolgan"   v={c.arrived-c.sold} c={T.gold}  T={T}/>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
                    <button className="press"
                      onClick={()=>{addF({name:c.name,arrived:c.arrived,sold:c.sold,price:c.price,date:c.date||td()});toast_(`${c.name} qayta saqlandi ✅`);}}
                      style={{padding:"7px",background:`${T.ind}10`,color:T.ind,border:`1px solid ${T.ind}2e`,borderRadius:7,cursor:"pointer",fontSize:10,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:4,transition:"all 0.15s"}}
                      onMouseEnter={e=>e.currentTarget.style.background=`${T.ind}20`}
                      onMouseLeave={e=>e.currentTarget.style.background=`${T.ind}10`}>
                      💾 Saqlash
                    </button>
                    <button className="press" onClick={()=>delCard(c.cid,c.name)}
                      style={{padding:"7px",background:"rgba(239,68,68,0.06)",color:"#ef4444",border:"1px solid rgba(239,68,68,0.18)",borderRadius:7,cursor:"pointer",fontSize:10,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:4,transition:"all 0.15s"}}
                      onMouseEnter={e=>e.currentTarget.style.background="rgba(239,68,68,0.13)"}
                      onMouseLeave={e=>e.currentTarget.style.background="rgba(239,68,68,0.06)"}>
                      🗑️ O'chirish
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════ DAILY REPORT ═══════════════════════ */
function DailyRep(){
  const {flowers,dailyMap,T}=useContext(Ctx);
  const [sel,setSel]=useState(td());
  const df=flowers.filter(f=>f.date===sel);
  const inc=df.reduce((s,f)=>s+f.sold*f.price,0); const arr=df.reduce((s,f)=>s+f.arrived,0); const sol=df.reduce((s,f)=>s+f.sold,0);
  const wk=[];
  for(let i=-3;i<=3;i++){const d=new Date(sel+"T00:00:00");d.setDate(d.getDate()+i);const ds=d.toISOString().slice(0,10);wk.push({date:fDs(ds),val:dailyMap[ds]||0,isSel:ds===sel});}
  return (
    <div className="fu">
      <Ptitle T={T} title="Kunlik hisobot" sub="Sana tanlang"/>
      <div style={{display:"flex",gap:9,alignItems:"center",marginBottom:20,flexWrap:"wrap"}}>
        <input type="date" value={sel} onChange={e=>setSel(e.target.value)}
          style={{padding:"8px 12px",borderRadius:8,border:`1.5px solid ${T.bord}`,background:T.card,color:T.tx,fontSize:12,cursor:"pointer",transition:"border-color 0.2s"}}
          onFocus={e=>e.target.style.borderColor=T.ind} onBlur={e=>e.target.style.borderColor=T.bord}/>
        <span style={{fontSize:12,color:T.muted}}>{fD(sel)}</span>
        {inc>0&&<span style={{background:`${T.ind}10`,color:T.ind,padding:"4px 12px",borderRadius:16,fontSize:10,fontWeight:700,border:`1px solid ${T.ind}28`,fontFamily:"'Space Mono',monospace"}}>💰 {fS(inc)}</span>}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(148px,1fr))",gap:10,marginBottom:16}}>
        <KCard T={T} ico="💰" l="Daromat"    v={fS(inc)}         c={T.ind}/>
        <KCard T={T} ico="🌷" l="Chiqqan"    v={`${arr} ta`}     c={T.teal}/>
        <KCard T={T} ico="✅" l="Sotilgan"   v={`${sol} ta`}     c={T.green}/>
        <KCard T={T} ico="📦" l="Qolgan"     v={`${arr-sol} ta`} c={T.gold}/>
        <KCard T={T} ico="🌸" l="Gul turlari"v={`${df.length} xil`}c={T.pink}/>
      </div>
      <Crd T={T} style={{marginBottom:14}}>
        <div style={{fontSize:11,fontWeight:700,color:T.tx,marginBottom:11}}>Haftalik ko'rinish</div>
        <ResponsiveContainer width="100%" height={110}>
          <BarChart data={wk} margin={{top:0,right:0,left:0,bottom:0}}>
            <XAxis dataKey="date" tick={{fill:T.muted,fontSize:9}} axisLine={false} tickLine={false}/>
            <YAxis hide/>
            <Tooltip contentStyle={{background:T.card,border:`1px solid ${T.bord}`,borderRadius:8,color:T.tx,fontSize:10}} formatter={v=>[fS(v),"Daromat"]}/>
            <Bar dataKey="val" radius={[4,4,0,0]}>{wk.map((d,i)=><Cell key={i} fill={d.isSel?"#6366f1":T.bord}/>)}</Bar>
          </BarChart>
        </ResponsiveContainer>
      </Crd>
      <Crd T={T}>
        <div style={{fontSize:11,fontWeight:700,color:T.tx,marginBottom:11}}>Gullar ro'yxati</div>
        {df.length===0?<Mpty T={T} txt="Bu kunda ma'lumot yo'q"/>:<FTbl flowers={df} T={T}/>}
      </Crd>
    </div>
  );
}

/* ═══════════════════════ YEARLY REPORT ═══════════════════════ */
function YearlyRep(){
  const {flowers,totalInc,dailyMap,T}=useContext(Ctx);
  const MN=["Yanvar","Fevral","Mart","April","May","Iyun","Iyul","Avgust","Sentabr","Oktabr","Noyabr","Dekabr"];
  const mm={};flowers.forEach(f=>{const m=f.date.slice(0,7);if(!mm[m])mm[m]={income:0,arrived:0,sold:0,kinds:new Set()};mm[m].income+=f.sold*f.price;mm[m].arrived+=f.arrived;mm[m].sold+=f.sold;mm[m].kinds.add(f.name);});
  const months=Object.entries(mm).sort((a,b)=>a[0].localeCompare(b[0]));
  const cData=months.map(([m,d])=>({m:MN[+m.split("-")[1]-1].slice(0,3),inc:d.income,arr:d.arrived,sol:d.sold}));
  return (
    <div className="fu">
      <Ptitle T={T} title="Yillik hisobot" sub="To'liq statistika"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:10,marginBottom:18}}>
        <KCard T={T} ico="💰" l="Jami daromat"  v={fS(totalInc)} c={T.ind}/>
        <KCard T={T} ico="📅" l="Faol kunlar"   v={`${Object.keys(dailyMap).length} kun`} c={T.vio}/>
        <KCard T={T} ico="🌷" l="Jami chiqqan"  v={`${flowers.reduce((s,f)=>s+f.arrived,0)} ta`} c={T.teal}/>
        <KCard T={T} ico="✅" l="Jami sotilgan" v={`${flowers.reduce((s,f)=>s+f.sold,0)} ta`} c={T.green}/>
        <KCard T={T} ico="📦" l="Jami qolgan"   v={`${flowers.reduce((s,f)=>s+f.arrived-f.sold,0)} ta`} c={T.gold}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:14,marginBottom:16}}>
        <Crd T={T}>
          <div style={{fontSize:11,fontWeight:700,color:T.tx,marginBottom:12}}>Oylik daromat</div>
          <ResponsiveContainer width="100%" height={185}>
            <BarChart data={cData} margin={{top:4,right:4,left:0,bottom:0}}>
              <defs><linearGradient id="yg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={1}/><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.7}/></linearGradient></defs>
              <XAxis dataKey="m" tick={{fill:T.muted,fontSize:9}} axisLine={false} tickLine={false}/>
              <YAxis hide/>
              <Tooltip contentStyle={{background:T.card,border:`1px solid ${T.bord}`,borderRadius:9,color:T.tx,fontSize:10}} formatter={v=>[fS(v),"Daromat"]}/>
              <Bar dataKey="inc" fill="url(#yg)" radius={[5,5,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </Crd>
        <Crd T={T}>
          <div style={{fontSize:11,fontWeight:700,color:T.tx,marginBottom:12}}>Chiqqan vs Sotilgan</div>
          <ResponsiveContainer width="100%" height={185}>
            <BarChart data={cData} margin={{top:4,right:4,left:0,bottom:0}}>
              <XAxis dataKey="m" tick={{fill:T.muted,fontSize:9}} axisLine={false} tickLine={false}/>
              <YAxis hide/>
              <Tooltip contentStyle={{background:T.card,border:`1px solid ${T.bord}`,borderRadius:9,color:T.tx,fontSize:10}} formatter={(v,n)=>[`${v} ta`,n==="arr"?"Chiqqan":"Sotilgan"]}/>
              <Bar dataKey="arr" fill="#14b8a6" radius={[4,4,0,0]} opacity={0.85}/>
              <Bar dataKey="sol" fill="#22c55e" radius={[4,4,0,0]} opacity={0.85}/>
            </BarChart>
          </ResponsiveContainer>
        </Crd>
      </div>
      <Crd T={T} style={{marginBottom:14}}>
        <div style={{fontSize:11,fontWeight:700,color:T.tx,marginBottom:11}}>Oylik jadval</div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
            <thead><tr style={{borderBottom:`1.5px solid ${T.bord}`}}>{["Oy","Daromat","Chiqqan","Sotilgan","Qolgan","Gul turlari"].map(h=><th key={h} style={{padding:"7px 9px",textAlign:"left",color:T.muted,fontWeight:700,fontSize:8,textTransform:"uppercase",letterSpacing:"0.07em"}}>{h}</th>)}</tr></thead>
            <tbody>{[...months].reverse().map(([m,d])=>{const[y,mo]=m.split("-");return(
              <tr key={m} style={{borderBottom:`1px solid ${T.bord2}`,transition:"background 0.15s"}} onMouseEnter={e=>e.currentTarget.style.background=T.card2} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{padding:"9px 9px",fontWeight:600,fontSize:11}}>{MN[+mo-1].slice(0,3)} {y}</td>
                <td style={{padding:"9px 9px",fontFamily:"'Space Mono',monospace",fontWeight:700,color:T.ind,fontSize:10}}>{fS(d.income)}</td>
                <td style={{padding:"9px 9px",color:T.sky,  fontWeight:600}}>{d.arrived} ta</td>
                <td style={{padding:"9px 9px",color:T.green,fontWeight:600}}>{d.sold} ta</td>
                <td style={{padding:"9px 9px",color:T.gold, fontWeight:600}}>{d.arrived-d.sold} ta</td>
                <td style={{padding:"9px 9px",color:T.pink, fontWeight:600}}>{d.kinds.size} xil</td>
              </tr>
            );})}
            </tbody>
          </table>
        </div>
      </Crd>
      <Crd T={T}><div style={{fontSize:11,fontWeight:700,color:T.tx,marginBottom:11}}>Barcha yozuvlar</div><FTbl flowers={flowers} T={T}/></Crd>
    </div>
  );
}

/* ═══════════════════════ WORKER HOME ═══════════════════════ */
function WorkerHome(){
  const {todayF,todayInc,todayArr,todaySold,todayKind,T}=useContext(Ctx);
  return (
    <div className="fu">
      <Ptitle T={T} title="Bugungi holat" sub={fD(td())}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(145px,1fr))",gap:10,marginBottom:20}}>
        <KCard T={T} ico="💰" l="Daromat"      v={fS(todayInc)}              c={T.ind}/>
        <KCard T={T} ico="🌷" l="Chiqqan"      v={`${todayArr} ta`}          c={T.teal}/>
        <KCard T={T} ico="✅" l="Sotilgan"     v={`${todaySold} ta`}         c={T.green}/>
        <KCard T={T} ico="📦" l="Qolgan"       v={`${todayArr-todaySold} ta`}c={T.gold}/>
        <KCard T={T} ico="🌸" l="Gul turlari"  v={`${todayKind} xil`}       c={T.pink}/>
      </div>
      <Crd T={T}>
        <div style={{fontSize:11,fontWeight:700,color:T.tx,marginBottom:14}}>🌸 Bugun kiritilgan gullar</div>
        {todayF.length===0?<Mpty T={T} txt="Bugun hali gul kiritilmagan"/>:(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(235px,1fr))",gap:10}}>
            {todayF.map(f=>{const fc=gC(f.name);return(
              <div key={f.id} style={{background:T.card2,borderRadius:12,padding:12,border:`1px solid ${T.bord}`,position:"relative",overflow:"hidden"}}>
                <div style={{height:2,background:`linear-gradient(90deg,${fc},${fc}44)`,position:"absolute",top:0,left:0,right:0}}/>
                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:9}}>
                  <div style={{width:38,height:38,borderRadius:9,background:gBg(f.name),border:`1.5px solid ${fc}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,flexShrink:0}}>{gE(f.name)}</div>
                  <div><div style={{fontWeight:700,fontSize:13,color:T.tx}}>{f.name}</div><div style={{fontSize:9,color:T.muted}}>{fD(f.date)}</div></div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4,marginBottom:7}}>
                  <SS l="Chiqqan"  v={f.arrived}       c={T.sky}   T={T}/>
                  <SS l="Sotilgan" v={f.sold}           c={T.green} T={T}/>
                  <SS l="Qolgan"   v={f.arrived-f.sold} c={T.gold}  T={T}/>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",paddingTop:7,borderTop:`1px solid ${T.bord2}`}}>
                  <span style={{fontSize:9,color:T.muted,fontFamily:"'Space Mono',monospace"}}>{fS(f.price)}</span>
                  <span style={{fontSize:12,fontWeight:700,color:fc,fontFamily:"'Space Mono',monospace"}}>{fS(f.sold*f.price)}</span>
                </div>
              </div>
            );})}
          </div>
        )}
      </Crd>
    </div>
  );
}

/* ═══════════════════════ SHARED COMPONENTS ═══════════════════════ */
function FTbl({flowers,T}){
  const {delF,toast_}=useContext(Ctx);
  return (
    <div style={{overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
        <thead><tr style={{borderBottom:`1.5px solid ${T.bord}`}}>{["Gul","Sana","Chiqqan","Sotilgan","Qolgan","Narx","Daromat",""].map(h=>(
          <th key={h} style={{padding:"6px 8px",textAlign:"left",color:T.muted,fontWeight:700,fontSize:8,textTransform:"uppercase",letterSpacing:"0.07em"}}>{h}</th>
        ))}</tr></thead>
        <tbody>{[...flowers].sort((a,b)=>b.date.localeCompare(a.date)).map(f=>(
          <tr key={f.id} style={{borderBottom:`1px solid ${T.bord2}`,transition:"background 0.15s"}}
            onMouseEnter={e=>e.currentTarget.style.background=T.card2}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <td style={{padding:"8px 8px"}}><div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:5,height:5,borderRadius:1,background:gC(f.name),flexShrink:0}}/><span style={{fontSize:14}}>{gE(f.name)}</span><span style={{fontWeight:600,fontSize:11}}>{f.name}</span></div></td>
            <td style={{padding:"8px 8px",color:T.muted,fontSize:9}}>{fD(f.date)}</td>
            <td style={{padding:"8px 8px",color:T.sky,  fontWeight:700,fontFamily:"'Space Mono',monospace"}}>{f.arrived}</td>
            <td style={{padding:"8px 8px",color:T.green,fontWeight:700,fontFamily:"'Space Mono',monospace"}}>{f.sold}</td>
            <td style={{padding:"8px 8px",color:T.gold, fontWeight:700,fontFamily:"'Space Mono',monospace"}}>{f.arrived-f.sold}</td>
            <td style={{padding:"8px 8px",color:T.tx2,  fontSize:10,  fontFamily:"'Space Mono',monospace"}}>{fS(f.price)}</td>
            <td style={{padding:"8px 8px",fontWeight:700,color:gC(f.name),fontFamily:"'Space Mono',monospace",fontSize:10}}>{fS(f.sold*f.price)}</td>
            <td style={{padding:"8px 8px"}}><button className="press" onClick={()=>{delF(f.id);toast_("O'chirildi","info");}} style={{width:24,height:24,borderRadius:5,background:"rgba(239,68,68,0.07)",color:"#ef4444",border:"1px solid rgba(239,68,68,0.18)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9}}>✕</button></td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}
function KCard({T,ico,l,v,c,onClick,badge}){
  return (
    <div className="hov" onClick={onClick}
      style={{background:T.d?`linear-gradient(145deg,${T.card},${T.card2})`:`linear-gradient(145deg,#fff,#f5f5ff)`,borderRadius:14,padding:"15px 15px",border:`1px solid ${c}22`,boxShadow:T.d?`0 4px 24px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.04)`:`0 4px 20px ${c}18`,cursor:onClick?"pointer":"default",position:"relative",overflow:"hidden",transition:"all 0.3s cubic-bezier(0.34,1.56,0.64,1)"}}>
      {/* Top glow line */}
      <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${c},${c}88,transparent)`}}/>
      {/* Corner glow */}
      <div style={{position:"absolute",top:-18,right:-18,width:54,height:54,borderRadius:"50%",background:`radial-gradient(circle,${c}28 0%,transparent 70%)`,pointerEvents:"none"}}/>
      {/* Ghost emoji */}
      <div style={{position:"absolute",right:-4,bottom:-4,fontSize:52,opacity:0.045,lineHeight:1,transform:"rotate(-10deg)"}}>{ico}</div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
        <div className="glowing" style={{width:34,height:34,borderRadius:9,background:`linear-gradient(135deg,${c}22,${c}0a)`,border:`1px solid ${c}35`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{ico}</div>
        {badge&&<span style={{background:`linear-gradient(135deg,${c}18,${c}0a)`,color:c,border:`1px solid ${c}28`,borderRadius:8,padding:"2px 7px",fontSize:8,fontWeight:700,letterSpacing:"0.03em"}}>{badge}</span>}
      </div>
      <div style={{fontSize:8,color:T.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>{l}</div>
      <div style={{fontSize:17,fontWeight:700,color:c,fontFamily:"'Space Mono',monospace",letterSpacing:"-0.02em",lineHeight:1,textShadow:T.d?`0 0 20px ${c}44`:"none"}}>{v}</div>
    </div>
  );
}
function SS({l,v,c,T}){
  return (
    <div style={{background:T.d?`linear-gradient(145deg,${T.card3},rgba(0,0,0,0.2))`:`linear-gradient(145deg,#f0f0ff,#e8e8ff)`,borderRadius:8,padding:"7px 5px",textAlign:"center",border:`1px solid ${c}20`,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:1.5,background:`linear-gradient(90deg,transparent,${c},transparent)`,opacity:0.7}}/>
      <div style={{fontSize:15,fontWeight:700,color:c,fontFamily:"'Space Mono',monospace",textShadow:T.d?`0 0 12px ${c}44`:"none"}}>{v}</div>
      <div style={{fontSize:7,color:T.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",marginTop:2}}>{l}</div>
    </div>
  );
}
function Crd({T,children,style={}}){
  return (
    <div style={{background:T.d?`linear-gradient(145deg,${T.card},${T.card2})`:`linear-gradient(145deg,#fff,#f8f8ff)`,borderRadius:16,padding:20,border:`1px solid ${T.bord}`,boxShadow:T.d?"0 8px 32px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.03)":"0 4px 20px rgba(99,102,241,0.07)",position:"relative",overflow:"hidden",...style}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,rgba(99,102,241,0.2),rgba(139,92,246,0.15),transparent)`,pointerEvents:"none"}}/>
      {children}
    </div>
  );
}
function Ptitle({T,title,sub}){
  return (
    <div style={{marginBottom:24}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:3}}>
        <div style={{width:3,height:22,borderRadius:3,background:"linear-gradient(180deg,#6366f1,#8b5cf6)",flexShrink:0,boxShadow:"0 0 10px rgba(99,102,241,0.5)"}}/>
        <h2 style={{fontSize:22,fontWeight:700,color:T.tx,letterSpacing:"-0.02em",fontFamily:"'Space Mono',monospace"}}>{title}</h2>
      </div>
      {sub&&<p style={{fontSize:11,color:T.muted,paddingLeft:13}}>{sub}</p>}
    </div>
  );
}
function FInp({label,val,set,ph,type="text",T}){
  return (
    <div style={{marginBottom:12}}>
      <label style={{display:"block",fontSize:8,fontWeight:700,color:T.muted,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.09em"}}>{label}</label>
      <input type={type} value={val} onChange={e=>set(e.target.value)} placeholder={ph}
        style={{width:"100%",padding:"9px 11px",borderRadius:8,border:`1.5px solid ${T.bord}`,background:T.bg,color:T.tx,fontSize:12,fontWeight:500,boxSizing:"border-box",transition:"border-color 0.2s,box-shadow 0.2s"}}
        onFocus={e=>{e.target.style.borderColor="#6366f1";e.target.style.boxShadow="0 0 0 3px rgba(99,102,241,0.1)";}}
        onBlur={e=>{e.target.style.borderColor=T.bord;e.target.style.boxShadow="none";}}/>
    </div>
  );
}
function Toast({t,T}){
  const colors={success:"#22c55e",info:"#818cf8",error:"#ef4444"};
  const c=colors[t.type]||colors.success;
  return (
    <div className="sl" style={{position:"fixed",bottom:22,right:22,zIndex:9999,background:T.d?`linear-gradient(135deg,${T.card},${T.card2})`:"#fff",border:`1px solid ${c}35`,borderRadius:14,padding:"13px 18px",boxShadow:`0 8px 32px rgba(0,0,0,0.4),0 0 0 1px ${c}18`,display:"flex",alignItems:"center",gap:11,minWidth:240,maxWidth:340}}>
      <div style={{width:32,height:32,borderRadius:9,background:`${c}18`,border:`1px solid ${c}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>{t.type==="success"?"✅":t.type==="info"?"ℹ️":"⚠️"}</div>
      <div style={{flex:1}}>
        <div style={{fontSize:9,fontWeight:700,color:c,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:2}}>{t.type==="success"?"Muvaffaqiyat":t.type==="info"?"Ma'lumot":"Xato"}</div>
        <div style={{fontSize:12,color:T.tx,fontWeight:500}}>{t.msg}</div>
      </div>
      <div style={{width:3,height:"100%",position:"absolute",left:0,top:0,bottom:0,background:`linear-gradient(180deg,${c},${c}55)`,borderRadius:"14px 0 0 14px"}}/>
    </div>
  );
}
function Mpty({T,txt}){
  return (
    <div style={{textAlign:"center",padding:"36px 20px",color:T.muted}}>
      <div style={{fontSize:40,marginBottom:10,animation:"float 3s ease-in-out infinite"}}>🌱</div>
      <div style={{fontSize:13,fontWeight:600,color:T.tx2,marginBottom:4}}>{txt||"Ma'lumot yo'q"}</div>
      <div style={{fontSize:10,opacity:0.5}}>Hali hech narsa kiritilmagan</div>
    </div>
  );
}