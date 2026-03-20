import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { recipeAPI } from "./api/services";

/* ─── Google Fonts + Global CSS ─────────────────────── */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { font-family: 'DM Sans', sans-serif; background: #FAFAF7; color: #1C2B1E; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #F0F4ED; }
    ::-webkit-scrollbar-thumb { background: #52B788; border-radius: 99px; }
    @keyframes fadeUp   { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }
    @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
    .fade-up   { animation: fadeUp 0.6s ease both; }
    .fade-up-1 { animation: fadeUp 0.6s 0.1s ease both; }
    .fade-up-2 { animation: fadeUp 0.6s 0.2s ease both; }
    .fade-up-3 { animation: fadeUp 0.6s 0.3s ease both; }
    .fade-up-4 { animation: fadeUp 0.6s 0.4s ease both; }
    .float     { animation: float 4s ease-in-out infinite; }
    .btn-hover:hover  { transform: translateY(-2px) !important; box-shadow: 0 8px 28px rgba(45,106,79,0.35) !important; }
    .card-hover:hover { transform: translateY(-4px) !important; box-shadow: 0 16px 48px rgba(0,0,0,0.12) !important; }
    input:focus, select:focus { outline: 2px solid #52B788; outline-offset: 1px; }
    input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
  `}</style>
);

/* ─── Static Data ────────────────────────────────────── */
const STATIC_RECIPES = [
  { id:1, name:"Grilled Salmon Bowl",     tag:"High Protein", cal:520, time:"25 min", emoji:"🐟", diet:["gluten-free"], goal:"bulk",         color:"#E8F4F8" },
  { id:2, name:"Avocado Quinoa Salad",    tag:"Vegan",        cal:380, time:"15 min", emoji:"🥑", diet:["vegan"],       goal:"cut",          color:"#E8F5E9" },
  { id:3, name:"Chicken Sweet Potato",    tag:"Balanced",     cal:610, time:"35 min", emoji:"🍗", diet:[],              goal:"bulk",         color:"#FFF3E0" },
  { id:4, name:"Overnight Chia Oats",     tag:"Vegetarian",   cal:290, time:"5 min",  emoji:"🥣", diet:["vegetarian"],  goal:"maintain",     color:"#F3E5F5" },
  { id:5, name:"Beef Stir Fry",           tag:"High Protein", cal:680, time:"20 min", emoji:"🥩", diet:[],              goal:"bodybuilding", color:"#FFEBEE" },
  { id:6, name:"Lentil Curry Bowl",       tag:"Vegan",        cal:420, time:"30 min", emoji:"🍛", diet:["vegan"],       goal:"maintain",     color:"#FFF8E1" },
  { id:7, name:"Greek Yogurt Parfait",    tag:"Vegetarian",   cal:310, time:"5 min",  emoji:"🫙", diet:["vegetarian"],  goal:"cut",          color:"#E8EAF6" },
  { id:8, name:"Tuna Protein Wrap",       tag:"High Protein", cal:490, time:"10 min", emoji:"🌯", diet:[],              goal:"bulk",         color:"#E0F7FA" },
];

const DAYS  = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const MEALS = ["Breakfast","Lunch","Dinner","Snack"];
const FEATURES = [
  { emoji:"🧠", title:"Smart Planning",      desc:"AI-driven meal suggestions tailored to your exact goals, body metrics, and lifestyle." },
  { emoji:"🛒", title:"Auto Grocery Lists",  desc:"One click generates a complete, categorised shopping list from your weekly plan." },
  { emoji:"🔬", title:"Verified Nutrition",  desc:"Every meal is backed by Edamam & Spoonacular data — calories, macros, allergens." },
  { emoji:"🎯", title:"Goal-Aligned Meals",  desc:"Whether you're cutting, bulking, or maintaining — your meals match your mission." },
  { emoji:"🌱", title:"Dietary Inclusive",   desc:"Vegan, keto, gluten-free, paleo — we handle every dietary need with ease." },
  { emoji:"📉", title:"Waste Reduction",     desc:"Optimised ingredient overlap means less food wasted and more money saved." },
];
const TESTIMONIALS = [
  { name:"Sarah K.", goal:"Cut 8kg",       text:"I lost 8kg in 3 months just by following the meal plans. The grocery list feature saves me hours every week!", avatar:"👩‍🦱" },
  { name:"James T.", goal:"Bulking Phase", text:"As a bodybuilder, finding high-protein vegan meals was a nightmare. Balanced Bites solved that completely.",   avatar:"👨‍🦲" },
  { name:"Priya M.", goal:"Gluten-Free",   text:"Finally an app that actually understands dietary restrictions. My whole family eats from these plans now.",     avatar:"👩‍🦳" },
];
const GOALS = [
  { id:"cut",          label:"Cut",            sub:"Fat Loss",         emoji:"🔥", color:"#FF6B6B" },
  { id:"bulk",         label:"Bulk",           sub:"Muscle Gain",      emoji:"💪", color:"#4ECDC4" },
  { id:"bodybuilding", label:"Body Building",  sub:"Sculpt & Define",  emoji:"🏆", color:"#FFD93D" },
  { id:"fitness",      label:"Improve Fitness",sub:"Cardio & Endurance",emoji:"⚡",color:"#A8E6CF" },
  { id:"maintain",     label:"Maintain",       sub:"Stay Balanced",    emoji:"⚖️", color:"#C3B1E1" },
];
const OB_STEPS = ["Gender","Body Stats","Your Goal","Workout","Diet","Allergies"];

/* ═══════════════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════════════ */
function Navbar({ page, setPage }) {
  const { user, logout } = useAuth();

  const go = (p) => setPage(p);

  return (
    <nav style={{ position:"sticky", top:0, zIndex:100, background:"rgba(250,250,247,0.93)", backdropFilter:"blur(16px)", borderBottom:"1px solid #E8F0E5", padding:"0 5%" }}>
      <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", height:68 }}>
        <div onClick={()=>go("home")} style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:8, flex:1 }}>
          <span style={{ fontSize:26 }}>🌿</span>
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:900, color:"#1B4332" }}>The Balanced Bites</span>
        </div>
        <div style={{ display:"flex", gap:28, alignItems:"center" }}>
          {[["home","Home"],["recipes","Recipes"],["why-us","Why Us"]].map(([p,label])=>(
            <span key={p} onClick={()=>go(p)} style={{ cursor:"pointer", fontSize:14, fontWeight:600, color:page===p?"#2D6A4F":"#52796F", borderBottom:page===p?"2px solid #52B788":"2px solid transparent", paddingBottom:2, transition:"all 0.2s" }}>{label}</span>
          ))}
          {user && (
            <span onClick={()=>go("planner")} style={{ cursor:"pointer", fontSize:14, fontWeight:600, color:page==="planner"?"#2D6A4F":"#52796F", borderBottom:page==="planner"?"2px solid #52B788":"2px solid transparent", paddingBottom:2 }}>Planner</span>
          )}
          {user ? (
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div onClick={()=>go("profile")} style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#40916C,#2D6A4F)", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontWeight:800, fontSize:14, boxShadow:"0 2px 8px rgba(45,106,79,0.3)" }}>
                {user.name?.[0]?.toUpperCase()||"U"}
              </div>
            </div>
          ) : (
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>go("login")}    style={{ padding:"9px 20px", borderRadius:99, border:"2px solid #2D6A4F", background:"transparent", color:"#2D6A4F", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Login</button>
              <button onClick={()=>go("register")} className="btn-hover" style={{ padding:"9px 20px", borderRadius:99, border:"none", background:"linear-gradient(135deg,#40916C,#2D6A4F)", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit", transition:"all 0.2s" }}>Sign Up</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════════════════ */
function HomePage({ setPage }) {
  return (
    <div>
      {/* HERO */}
      <section style={{ minHeight:"92vh", display:"flex", alignItems:"center", position:"relative", overflow:"hidden", padding:"0 5%" }}>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,#F0F7EE,#FAFAF7,#E8F5E9)", zIndex:0 }} />
        <div style={{ position:"absolute", top:"-10%", right:"-5%",  width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle,#B7E4C766,transparent 70%)", zIndex:0 }} />
        <div style={{ position:"absolute", bottom:"-15%", left:"-8%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,#95D5B244,transparent 70%)", zIndex:0 }} />
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", gap:60, zIndex:1, width:"100%", flexWrap:"wrap" }}>
          <div style={{ flex:1, minWidth:300 }}>
            <div className="fade-up" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#D8F3DC", borderRadius:99, padding:"6px 16px", marginBottom:24 }}>
              <span style={{ fontSize:12 }}>✨</span>
              <span style={{ fontSize:12, fontWeight:700, color:"#2D6A4F", letterSpacing:"0.5px" }}>SMART MEAL PLANNING</span>
            </div>
            <h1 className="fade-up-1" style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(42px,5vw,72px)", fontWeight:900, lineHeight:1.08, color:"#1B4332", marginBottom:24, letterSpacing:"-2px" }}>
              Eat Smart.<br/><span style={{ color:"#52B788" }}>Live Better.</span><br/>Feel Amazing.
            </h1>
            <p className="fade-up-2" style={{ fontSize:17, color:"#52796F", lineHeight:1.7, marginBottom:36, maxWidth:480 }}>
              Personalised weekly meal plans based on your body, goals, and lifestyle — with automatic grocery list generation.
            </p>
            <div className="fade-up-3" style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
              <button onClick={()=>setPage("register")} className="btn-hover" style={{ padding:"16px 36px", borderRadius:99, background:"linear-gradient(135deg,#40916C,#1B4332)", color:"#fff", fontWeight:800, fontSize:16, border:"none", cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 24px rgba(45,106,79,0.35)", transition:"all 0.2s" }}>Start For Free →</button>
              <button onClick={()=>setPage("recipes")} className="btn-hover" style={{ padding:"16px 32px", borderRadius:99, background:"transparent", color:"#2D6A4F", fontWeight:700, fontSize:15, border:"2px solid #B7E4C7", cursor:"pointer", fontFamily:"inherit", transition:"all 0.2s" }}>Browse Recipes</button>
            </div>
            <div className="fade-up-4" style={{ display:"flex", gap:32, marginTop:40 }}>
              {[["2,400+","Recipes"],["98%","Satisfaction"],["0 Waste","Philosophy"]].map(([num,label])=>(
                <div key={label}>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:900, color:"#1B4332" }}>{num}</div>
                  <div style={{ fontSize:12, color:"#74A08A", fontWeight:600 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Hero card */}
          <div className="float fade-up-2" style={{ flex:1, minWidth:280, display:"flex", justifyContent:"center" }}>
            <div style={{ width:320, background:"linear-gradient(145deg,#fff,#F0F7EE)", borderRadius:28, boxShadow:"0 32px 80px rgba(45,106,79,0.2)", padding:24 }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:700, color:"#1B4332", marginBottom:16 }}>🗓️ This Week's Plan</div>
              {[["🥑","Avocado Toast","320 cal","10 min","Breakfast","#2D6A4F",true],["🐟","Salmon Bowl","520 cal","25 min","Lunch","#F7F9F5",false],["🍛","Lentil Curry","420 cal","30 min","Dinner","#F7F9F5",false]].map(([emoji,name,cal,time,meal,bg,active])=>(
                <div key={name} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10, padding:"11px 12px", background:bg, borderRadius:12 }}>
                  <span style={{ fontSize:20 }}>{emoji}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:active?"#fff":"#1B4332" }}>{name}</div>
                    <div style={{ fontSize:10, color:active?"#B7E4C7":"#74A08A" }}>{cal} · {time}</div>
                  </div>
                  <span style={{ fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:99, background:active?"rgba(255,255,255,0.2)":"#E8F5E9", color:active?"#fff":"#2D6A4F" }}>{meal}</span>
                </div>
              ))}
              <div style={{ marginTop:12, padding:"11px 14px", background:"#D8F3DC", borderRadius:12, display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:16 }}>🛒</span>
                <div><div style={{ fontSize:12, fontWeight:700, color:"#1B4332" }}>Grocery List Ready</div><div style={{ fontSize:10, color:"#52796F" }}>14 items · Est. £32</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding:"100px 5%", background:"#fff" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#E8F5E9", borderRadius:99, padding:"6px 16px", marginBottom:14 }}>
              <span style={{ fontSize:12, fontWeight:700, color:"#2D6A4F" }}>WHY WE'RE DIFFERENT</span>
            </div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(32px,4vw,52px)", fontWeight:900, color:"#1B4332", letterSpacing:"-1px" }}>Everything you need.<br/>Nothing you don't.</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:24 }}>
            {FEATURES.map((f,i)=>(
              <div key={i} className="card-hover" style={{ padding:"32px 28px", background:"#F7F9F5", borderRadius:24, border:"1px solid #E8F0E5", transition:"all 0.25s" }}>
                <div style={{ fontSize:36, marginBottom:14 }}>{f.emoji}</div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:"#1B4332", marginBottom:8 }}>{f.title}</h3>
                <p style={{ fontSize:14, color:"#52796F", lineHeight:1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding:"100px 5%", background:"linear-gradient(135deg,#1B4332,#2D6A4F)" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", textAlign:"center" }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(32px,4vw,48px)", fontWeight:900, color:"#fff", marginBottom:12, letterSpacing:"-1px" }}>How it works</h2>
          <p style={{ color:"#B7E4C7", fontSize:15, marginBottom:56 }}>Three simple steps to your perfect meal week</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:28 }}>
            {[["01","📋","Tell Us About You","Share your goals, body stats, dietary preferences and workout schedule."],["02","🤖","We Build Your Plan","Our system crafts a personalised weekly meal plan aligned to your targets."],["03","🛒","Shop & Cook","Get your grocery list instantly and follow easy step-by-step recipes."]].map(([step,emoji,title,desc])=>(
              <div key={step} style={{ padding:"36px 24px", background:"rgba(255,255,255,0.08)", borderRadius:24, border:"1px solid rgba(255,255,255,0.12)" }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:44, fontWeight:900, color:"rgba(255,255,255,0.12)", marginBottom:6 }}>{step}</div>
                <div style={{ fontSize:38, marginBottom:14 }}>{emoji}</div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, color:"#fff", marginBottom:8 }}>{title}</h3>
                <p style={{ fontSize:13, color:"#95D5B2", lineHeight:1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding:"100px 5%", background:"#FAFAF7" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(28px,4vw,44px)", fontWeight:900, color:"#1B4332", textAlign:"center", marginBottom:52, letterSpacing:"-1px" }}>Real people. Real results.</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:24 }}>
            {TESTIMONIALS.map((t,i)=>(
              <div key={i} className="card-hover" style={{ padding:"32px 28px", background:"#fff", borderRadius:24, border:"1px solid #E8F0E5", transition:"all 0.25s" }}>
                <div style={{ fontSize:28, marginBottom:14 }}>{"⭐".repeat(5)}</div>
                <p style={{ fontSize:14, color:"#52796F", lineHeight:1.7, marginBottom:20, fontStyle:"italic" }}>"{t.text}"</p>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:32 }}>{t.avatar}</span>
                  <div>
                    <div style={{ fontWeight:700, color:"#1B4332", fontSize:14 }}>{t.name}</div>
                    <div style={{ fontSize:12, color:"#52B788", fontWeight:600 }}>{t.goal}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:"80px 5%", background:"linear-gradient(135deg,#52B788,#2D6A4F)", textAlign:"center" }}>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(28px,4vw,48px)", fontWeight:900, color:"#fff", marginBottom:14, letterSpacing:"-1px" }}>Ready to transform your eating?</h2>
        <p style={{ color:"#D8F3DC", fontSize:16, marginBottom:32 }}>Join thousands already eating smarter.</p>
        <button onClick={()=>setPage("register")} className="btn-hover" style={{ padding:"18px 48px", borderRadius:99, background:"#fff", color:"#2D6A4F", fontWeight:800, fontSize:17, border:"none", cursor:"pointer", fontFamily:"inherit", boxShadow:"0 8px 32px rgba(0,0,0,0.15)", transition:"all 0.2s" }}>
          Get Started — It's Free 🚀
        </button>
      </section>

      {/* FOOTER */}
      <footer style={{ padding:"36px 5%", background:"#1B4332", textAlign:"center" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:10 }}>
          <span style={{ fontSize:18 }}>🌿</span>
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:900, color:"#fff" }}>The Balanced Bites</span>
        </div>
        <p style={{ color:"#74A08A", fontSize:12 }}>© 2025 The Balanced Bites · Eat well, live well.</p>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   AUTH PAGE (Login + Register)
═══════════════════════════════════════════════════════ */
function AuthPage({ mode, setPage }) {
  const { login, register, error, setError, loading } = useAuth();
  const [form, setForm]     = useState({ name:"", email:"", password:"" });
  const [busy, setBusy]     = useState(false);
  const [localErr, setLocalErr] = useState("");
  const isLogin = mode === "login";

  useEffect(() => { setLocalErr(""); setError?.(null); }, [mode]);

  const handleSubmit = async () => {
    setLocalErr("");
    if (!form.email || !form.password) return setLocalErr("Please fill in all fields.");
    if (!isLogin && !form.name)        return setLocalErr("Please enter your name.");
    setBusy(true);
    try {
      if (isLogin) {
        const data = await login(form.email, form.password);
        setPage(data.user.isOnboarded ? "planner" : "onboarding");
      } else {
        await register(form.name, form.email, form.password);
        setPage("onboarding");
      }
    } catch (err) {
      setLocalErr(err.message);
    } finally { setBusy(false); }
  };

  const displayErr = localErr || error;

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 5%", background:"linear-gradient(135deg,#F0F7EE,#FAFAF7,#E8F5E9)", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:"-15%", right:"-10%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,#B7E4C766,transparent 70%)" }} />
      <div style={{ position:"absolute", bottom:"-10%", left:"-8%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,#95D5B244,transparent 70%)" }} />
      <div className="fade-up" style={{ width:"100%", maxWidth:440, background:"#fff", borderRadius:32, boxShadow:"0 32px 80px rgba(45,106,79,0.15)", padding:"48px 40px", zIndex:1, position:"relative" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontSize:38, marginBottom:10 }}>🌿</div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:900, color:"#1B4332", marginBottom:6 }}>
            {isLogin ? "Welcome back!" : "Join the family"}
          </h2>
          <p style={{ color:"#74A08A", fontSize:14 }}>{isLogin ? "Sign in to your meal plan" : "Start your healthy journey today"}</p>
        </div>

        {displayErr && (
          <div style={{ background:"#FFEBEE", border:"1px solid #FFCDD2", borderRadius:12, padding:"12px 16px", marginBottom:20, fontSize:13, color:"#C62828", fontWeight:600 }}>
            ⚠️ {displayErr}
          </div>
        )}

        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {!isLogin && (
            <div>
              <label style={labelStyle}>Full Name</label>
              <input placeholder="e.g. Alex Johnson" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} style={inputStyle} />
            </div>
          )}
          <div>
            <label style={labelStyle}>Email</label>
            <input type="email" placeholder="you@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} style={inputStyle} onKeyDown={e=>e.key==="Enter"&&handleSubmit()} />
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <input type="password" placeholder="••••••••" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} style={inputStyle} onKeyDown={e=>e.key==="Enter"&&handleSubmit()} />
          </div>
          <button onClick={handleSubmit} disabled={busy} className="btn-hover" style={{ marginTop:8, padding:"15px", borderRadius:14, background:"linear-gradient(135deg,#40916C,#1B4332)", color:"#fff", fontWeight:800, fontSize:16, border:"none", cursor:busy?"not-allowed":"pointer", fontFamily:"inherit", boxShadow:"0 4px 20px rgba(45,106,79,0.3)", transition:"all 0.2s", opacity:busy?0.7:1 }}>
            {busy ? "Please wait..." : isLogin ? "Sign In →" : "Create Account →"}
          </button>
        </div>
        <p style={{ textAlign:"center", marginTop:24, fontSize:14, color:"#74A08A" }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={()=>setPage(isLogin?"register":"login")} style={{ color:"#2D6A4F", fontWeight:700, cursor:"pointer" }}>
            {isLogin ? "Sign Up" : "Sign In"}
          </span>
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ONBOARDING PAGE
═══════════════════════════════════════════════════════ */
function OnboardingPage({ setPage }) {
  const { updateProfile, user } = useAuth();
  const [step,      setStep]    = useState(0);
  const [animating, setAnim]    = useState(false);
  const [busy,      setBusy]    = useState(false);
  const [form,      setForm]    = useState({ gender:"", age:"", weight:"", weightUnit:"kg", height:"", heightUnit:"cm", goal:"", workoutFreq:"", workoutDuration:"", diet:[], allergies:[] });

  const goTo = (n) => {
    if (animating) return;
    setAnim(true);
    setTimeout(() => { setStep(n); setAnim(false); }, 260);
  };

  const toggle = (field, val) => {
    setForm(f => {
      if (val === "none") return { ...f, [field]: ["none"] };
      const without = f[field].filter(v => v !== "none");
      return { ...f, [field]: without.includes(val) ? without.filter(v=>v!==val) : [...without, val] };
    });
  };

  const canNext = () => {
    if (step===0) return !!form.gender;
    if (step===1) return form.age && form.weight && form.height;
    if (step===2) return !!form.goal;
    if (step===3) return form.workoutFreq && form.workoutDuration;
    if (step===4) return form.diet.length > 0;
    if (step===5) return form.allergies.length > 0;
    return false;
  };

  const finish = async () => {
    setBusy(true);
    try {
      await updateProfile(form);
      setPage("planner");
    } catch { setBusy(false); }
  };

  const progress = (step / (OB_STEPS.length - 1)) * 100;

  return (
    <div style={{ minHeight:"100vh", background:"#F7F9F5", display:"flex", alignItems:"center", justifyContent:"center", padding:"24px 5%", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:"-10%", right:"-5%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,#B7E4C766,transparent 70%)" }} />
      <div style={{ position:"absolute", bottom:"-10%", left:"-5%", width:350, height:350, borderRadius:"50%", background:"radial-gradient(circle,#D8F3DC88,transparent 70%)" }} />
      <div style={{ width:"100%", maxWidth:560, position:"relative", zIndex:1 }}>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:4 }}>
            <span style={{ fontSize:22 }}>🌿</span>
            <span style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:900, color:"#1B4332" }}>The Balanced Bites</span>
          </div>
          {user && <p style={{ color:"#52796F", fontSize:13 }}>Hey {user.name?.split(" ")[0]}! Let's personalise your plan 👋</p>}
        </div>

        {/* Pills */}
        <div style={{ display:"flex", gap:6, justifyContent:"center", marginBottom:12 }}>
          {OB_STEPS.map((_,i)=>(
            <div key={i} style={{ width:32, height:32, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, transition:"all 0.25s",
              background:i<step?"#52B788":i===step?"#2D6A4F":"#E8F5E9",
              color:i<=step?"#fff":"#74A08A",
              transform:i===step?"scale(1.15)":"scale(1)",
              boxShadow:i===step?"0 4px 12px rgba(45,106,79,0.35)":"none"
            }}>{i<step?"✓":i+1}</div>
          ))}
        </div>

        <div style={{ height:4, background:"#D8F3DC", borderRadius:99, marginBottom:8, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${progress}%`, background:"linear-gradient(90deg,#52B788,#2D6A4F)", borderRadius:99, transition:"width 0.4s ease" }} />
        </div>
        <p style={{ textAlign:"center", fontSize:12, color:"#74A08A", marginBottom:18 }}>Step {step+1} of {OB_STEPS.length} — <strong style={{color:"#2D6A4F"}}>{OB_STEPS[step]}</strong></p>

        {/* Card */}
        <div style={{ background:"#fff", borderRadius:28, padding:"32px 32px 24px", boxShadow:"0 8px 48px rgba(45,106,79,0.10)", border:"1px solid #E8F5E9", marginBottom:18, opacity:animating?0:1, transform:animating?"translateX(20px)":"translateX(0)", transition:"all 0.26s ease" }}>

          {step===0 && (
            <div>
              <h2 style={cardTitle}>What's your gender?</h2>
              <p style={cardSub}>Helps calibrate your nutrition targets accurately.</p>
              <div style={{ display:"flex", gap:12 }}>
                {[["Male","👨"],["Female","👩"],["Other","🧑"]].map(([g,emoji])=>(
                  <button key={g} onClick={()=>setForm({...form,gender:g})} style={{ flex:1, padding:"20px 10px", borderRadius:16, border:`2px solid ${form.gender===g?"#2D6A4F":"#E8F5E9"}`, background:form.gender===g?"#E8F5E9":"#F7F9F5", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:8, transition:"all 0.2s", transform:form.gender===g?"translateY(-2px)":"none" }}>
                    <span style={{ fontSize:36 }}>{emoji}</span>
                    <span style={{ fontSize:13, fontWeight:700, color:"#1B4332" }}>{g}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step===1 && (
            <div>
              <h2 style={cardTitle}>Your body stats</h2>
              <p style={cardSub}>Used to calculate your daily caloric needs.</p>
              <div style={{ marginBottom:16 }}>
                <label style={obLabel}>Age</label>
                <input type="number" placeholder="e.g. 25" value={form.age} onChange={e=>setForm({...form,age:e.target.value})} min="10" max="100" style={{ ...inputStyle, width:"100%" }} />
              </div>
              <div style={{ display:"flex", gap:12 }}>
                {[["weight","weightUnit","Weight",["kg","lbs"],"75"],["height","heightUnit","Height",["cm","ft"],"175"]].map(([field,unit,label,opts,ph])=>(
                  <div key={field} style={{ flex:1 }}>
                    <label style={obLabel}>{label}</label>
                    <div style={{ display:"flex" }}>
                      <input type="number" placeholder={`e.g. ${ph}`} value={form[field]} onChange={e=>setForm({...form,[field]:e.target.value})} style={{ ...inputStyle, flex:1, borderRadius:"12px 0 0 12px", borderRight:"none" }} />
                      <select value={form[unit]} onChange={e=>setForm({...form,[unit]:e.target.value})} style={{ padding:"12px 8px", border:"2px solid #E8F5E9", borderRadius:"0 12px 12px 0", background:"#D8F3DC", color:"#2D6A4F", fontWeight:700, fontSize:12, cursor:"pointer", outline:"none" }}>
                        {opts.map(o=><option key={o}>{o}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step===2 && (
            <div>
              <h2 style={cardTitle}>What's your main goal?</h2>
              <p style={cardSub}>Your meal plan is built entirely around this.</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {GOALS.map(g=>(
                  <button key={g.id} onClick={()=>setForm({...form,goal:g.id})} style={{ padding:"16px 12px", borderRadius:16, border:`2px solid ${form.goal===g.id?g.color:"#E8F5E9"}`, background:form.goal===g.id?g.color+"18":"#F7F9F5", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"flex-start", gap:3, transition:"all 0.22s", position:"relative", transform:form.goal===g.id?"scale(1.03)":"scale(1)" }}>
                    <span style={{ fontSize:24 }}>{g.emoji}</span>
                    <span style={{ fontSize:13, fontWeight:800, color:"#1B4332" }}>{g.label}</span>
                    <span style={{ fontSize:10, color:"#74A08A" }}>{g.sub}</span>
                    {form.goal===g.id && <span style={{ position:"absolute", top:8, right:8, width:18, height:18, borderRadius:"50%", background:g.color, color:"#fff", fontSize:10, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800 }}>✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step===3 && (
            <div>
              <h2 style={cardTitle}>Workout schedule</h2>
              <p style={cardSub}>Helps match calories to your activity level.</p>
              <label style={obLabel}>How often?</label>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:20 }}>
                {[["1-2","1–2x/week","Light"],["3-4","3–4x/week","Moderate"],["5-6","5–6x/week","Active"],["7","Every day","Intense"]].map(([id,label,sub])=>(
                  <button key={id} onClick={()=>setForm({...form,workoutFreq:id})} style={{ padding:"10px 14px", borderRadius:99, border:`2px solid ${form.workoutFreq===id?"#2D6A4F":"#E8F5E9"}`, background:form.workoutFreq===id?"#2D6A4F":"#F7F9F5", color:form.workoutFreq===id?"#fff":"#52796F", cursor:"pointer", fontFamily:"inherit", fontWeight:700, fontSize:12, transition:"all 0.2s" }}>
                    {label} · <span style={{ opacity:0.75 }}>{sub}</span>
                  </button>
                ))}
              </div>
              <label style={obLabel}>Session duration</label>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {["15–30 min","30–45 min","45–60 min","60+ min"].map(d=>(
                  <button key={d} onClick={()=>setForm({...form,workoutDuration:d})} style={{ padding:"10px 16px", borderRadius:99, border:`2px solid ${form.workoutDuration===d?"#2D6A4F":"#E8F5E9"}`, background:form.workoutDuration===d?"#2D6A4F":"#F7F9F5", color:form.workoutDuration===d?"#fff":"#52796F", cursor:"pointer", fontFamily:"inherit", fontWeight:700, fontSize:12, transition:"all 0.2s" }}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step===4 && (
            <div>
              <h2 style={cardTitle}>Dietary preferences</h2>
              <p style={cardSub}>Select all that apply to you.</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {[["none","No Preference","🍽️"],["vegan","Vegan","🌱"],["vegetarian","Vegetarian","🥦"],["glutenfree","Gluten-Free","🌾"],["keto","Keto","🥑"],["paleo","Paleo","🍖"]].map(([id,label,emoji])=>(
                  <button key={id} onClick={()=>toggle("diet",id)} style={{ padding:"10px 16px", borderRadius:99, border:`2px solid ${form.diet.includes(id)?"#52B788":"#E8F5E9"}`, background:form.diet.includes(id)?"#D8F3DC":"#F7F9F5", color:form.diet.includes(id)?"#1B4332":"#52796F", cursor:"pointer", fontFamily:"inherit", fontWeight:600, fontSize:12, display:"flex", alignItems:"center", gap:5, transition:"all 0.2s" }}>
                    {emoji} {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step===5 && (
            <div>
              <h2 style={cardTitle}>Food allergies?</h2>
              <p style={cardSub}>We'll keep these completely out of your plan.</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {[["none","None","✅"],["nuts","Nuts","🥜"],["dairy","Dairy","🥛"],["eggs","Eggs","🥚"],["shellfish","Shellfish","🦐"],["soy","Soy","🫘"],["wheat","Wheat","🌾"]].map(([id,label,emoji])=>(
                  <button key={id} onClick={()=>toggle("allergies",id)} style={{ padding:"10px 16px", borderRadius:99, border:`2px solid ${form.allergies.includes(id)?"#52B788":"#E8F5E9"}`, background:form.allergies.includes(id)?"#D8F3DC":"#F7F9F5", color:form.allergies.includes(id)?"#1B4332":"#52796F", cursor:"pointer", fontFamily:"inherit", fontWeight:600, fontSize:12, display:"flex", alignItems:"center", gap:5, transition:"all 0.2s" }}>
                    {emoji} {label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {step > 0 && <button onClick={()=>goTo(step-1)} style={{ padding:"12px 20px", borderRadius:12, border:"2px solid #E8F5E9", background:"transparent", color:"#52796F", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>← Back</button>}
          <div style={{ flex:1 }} />
          {step < OB_STEPS.length-1
            ? <button onClick={()=>canNext()&&goTo(step+1)} className="btn-hover" style={{ padding:"13px 28px", borderRadius:12, background:"linear-gradient(135deg,#40916C,#2D6A4F)", color:"#fff", fontWeight:800, fontSize:14, border:"none", cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 16px rgba(45,106,79,0.3)", opacity:canNext()?1:0.4, transition:"all 0.2s" }}>Continue →</button>
            : <button onClick={()=>canNext()&&!busy&&finish()} className="btn-hover" style={{ padding:"13px 28px", borderRadius:12, background:"linear-gradient(135deg,#52B788,#2D6A4F)", color:"#fff", fontWeight:800, fontSize:14, border:"none", cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 16px rgba(45,106,79,0.3)", opacity:canNext()&&!busy?1:0.4, transition:"all 0.2s" }}>
                {busy ? "Saving..." : "Build My Plan 🚀"}
              </button>
          }
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   RECIPES PAGE
═══════════════════════════════════════════════════════ */
function RecipesPage({ setPage, setSelectedRecipe }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [recipes, setRecipes] = useState(STATIC_RECIPES);
  const [loading, setLoading] = useState(false);

  // Try loading from backend, fallback to static
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await recipeAPI.getAll();
        if (data.recipes?.length > 0) setRecipes(data.recipes);
      } catch { /* use static data */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const filtered = recipes.filter(r => {
    const name = r.name || "";
    const tag  = r.tag  || "";
    const matchSearch = name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || tag.toLowerCase().includes(filter) || (r.diet||[]).includes(filter);
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"60px 5%" }}>
      <div className="fade-up" style={{ marginBottom:40 }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(36px,4vw,52px)", fontWeight:900, color:"#1B4332", marginBottom:8, letterSpacing:"-1px" }}>Discover Recipes 🍽️</h1>
        <p style={{ color:"#52796F", fontSize:15 }}>Nutritionist-verified meals tailored to your goals.</p>
      </div>
      <div className="fade-up-1" style={{ marginBottom:36 }}>
        <input placeholder="🔍  Search recipes..." value={search} onChange={e=>setSearch(e.target.value)} style={{ width:"100%", padding:"14px 20px", border:"2px solid #E8F0E5", borderRadius:14, fontSize:14, fontFamily:"inherit", color:"#1B4332", background:"#fff", marginBottom:14, boxShadow:"0 2px 12px rgba(0,0,0,0.04)" }} />
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {["all","vegan","gluten-free","high protein","vegetarian"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{ padding:"8px 18px", borderRadius:99, border:`2px solid ${filter===f?"#2D6A4F":"#E8F0E5"}`, background:filter===f?"#2D6A4F":"#fff", color:filter===f?"#fff":"#52796F", fontWeight:600, fontSize:12, cursor:"pointer", fontFamily:"inherit", textTransform:"capitalize", transition:"all 0.2s" }}>
              {f}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <div style={{ textAlign:"center", padding:"60px 0", color:"#74A08A" }}>Loading recipes...</div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))", gap:20 }}>
          {filtered.map((r,i)=>(
            <div key={r.id||r._id||i} className="card-hover" onClick={()=>{ setSelectedRecipe(r); setPage("recipe-detail"); }} style={{ background:r.color||"#E8F5E9", borderRadius:22, padding:"24px 20px", cursor:"pointer", border:"1px solid #E8F0E5", transition:"all 0.25s" }}>
              <div style={{ fontSize:48, marginBottom:12 }}>{r.emoji||"🍽️"}</div>
              <div style={{ display:"inline-block", padding:"3px 10px", borderRadius:99, background:"rgba(255,255,255,0.7)", fontSize:10, fontWeight:700, color:"#2D6A4F", marginBottom:10, textTransform:"uppercase" }}>{r.tag}</div>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:700, color:"#1B4332", marginBottom:10 }}>{r.name}</h3>
              <div style={{ display:"flex", gap:14 }}>
                <span style={{ fontSize:12, color:"#52796F", fontWeight:600 }}>🔥 {r.cal||r.calories} cal</span>
                <span style={{ fontSize:12, color:"#52796F", fontWeight:600 }}>⏱️ {r.time||r.prepTime}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && filtered.length === 0 && (
        <div style={{ textAlign:"center", padding:"60px 0", color:"#74A08A", fontSize:15 }}>No recipes found. Try a different search! 🌿</div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   RECIPE DETAIL PAGE
═══════════════════════════════════════════════════════ */
function RecipeDetailPage({ recipe, setPage }) {
  if (!recipe) { setPage("recipes"); return null; }
  const cal = recipe.cal || recipe.calories || 0;
  const time = recipe.time || recipe.prepTime || "30 min";
  const ingredients = recipe.ingredients?.length
    ? recipe.ingredients.map(i => `${i.amount||""} ${i.name||i}`.trim())
    : ["2 cups quinoa","1 avocado, sliced","200g grilled protein","1 cup cherry tomatoes","2 tbsp olive oil","Lemon juice","Salt & pepper","Fresh herbs"];
  const steps = recipe.steps?.length
    ? recipe.steps
    : ["Prepare all ingredients.","Cook grains according to package instructions.","Grill or cook your protein of choice.","Slice vegetables and assemble bowl.","Drizzle with olive oil and lemon juice.","Season with salt and pepper.","Top with fresh herbs and serve immediately."];

  return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:"60px 5%" }}>
      <button onClick={()=>setPage("recipes")} style={{ display:"inline-flex", alignItems:"center", gap:8, marginBottom:28, padding:"10px 18px", borderRadius:99, border:"2px solid #E8F0E5", background:"#fff", color:"#52796F", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>← Back to Recipes</button>
      <div style={{ background:"#fff", borderRadius:28, overflow:"hidden", boxShadow:"0 8px 48px rgba(0,0,0,0.08)" }}>
        <div style={{ background:recipe.color||"#E8F5E9", padding:"52px 40px", textAlign:"center" }}>
          <div style={{ fontSize:72, marginBottom:16 }}>{recipe.emoji||"🍽️"}</div>
          <div style={{ display:"inline-block", padding:"5px 14px", borderRadius:99, background:"rgba(255,255,255,0.7)", fontSize:11, fontWeight:700, color:"#2D6A4F", marginBottom:14, textTransform:"uppercase" }}>{recipe.tag}</div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(24px,4vw,40px)", fontWeight:900, color:"#1B4332", marginBottom:18 }}>{recipe.name}</h1>
          <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
            {[["🔥",`${cal} calories`],["⏱️",time],["👤","2 Servings"]].map(([icon,label])=>(
              <div key={label} style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(255,255,255,0.6)", padding:"7px 14px", borderRadius:99, fontSize:12, fontWeight:600, color:"#1B4332" }}>{icon} {label}</div>
            ))}
          </div>
        </div>
        <div style={{ padding:"40px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:40, flexWrap:"wrap" }}>
          <div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:"#1B4332", marginBottom:18 }}>Ingredients</h2>
            {ingredients.map((ing,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 0", borderBottom:"1px solid #F0F4ED" }}>
                <div style={{ width:7, height:7, borderRadius:"50%", background:"#52B788", flexShrink:0 }} />
                <span style={{ fontSize:13, color:"#52796F" }}>{ing}</span>
              </div>
            ))}
          </div>
          <div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:"#1B4332", marginBottom:18 }}>Nutrition Facts</h2>
            {[["Calories",`${cal} kcal`,"#FF6B6B"],["Protein",recipe.nutrition?.protein?`${recipe.nutrition.protein}g`:"42g","#4ECDC4"],["Carbs",recipe.nutrition?.carbs?`${recipe.nutrition.carbs}g`:"38g","#FFD93D"],["Fat",recipe.nutrition?.fat?`${recipe.nutrition.fat}g`:"18g","#95D5B2"],["Fibre",recipe.nutrition?.fibre?`${recipe.nutrition.fibre}g`:"8g","#C3B1E1"]].map(([label,val,color])=>(
              <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid #F0F4ED" }}>
                <span style={{ fontSize:13, color:"#52796F" }}>{label}</span>
                <span style={{ fontSize:13, fontWeight:800, color, background:color+"18", padding:"3px 10px", borderRadius:99 }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding:"0 40px 40px" }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:"#1B4332", marginBottom:20 }}>Instructions</h2>
          {steps.map((s,i)=>(
            <div key={i} style={{ display:"flex", gap:14, marginBottom:18 }}>
              <div style={{ width:30, height:30, borderRadius:"50%", background:"#2D6A4F", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:12, flexShrink:0 }}>{i+1}</div>
              <p style={{ fontSize:14, color:"#52796F", lineHeight:1.7, paddingTop:4 }}>{s}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PLANNER PAGE
═══════════════════════════════════════════════════════ */
function PlannerPage() {
  const [plan,         setPlan]        = useState({});
  const [groceryView,  setGroceryView] = useState(false);

  const addMeal = (day, meal) => {
    const key  = `${day}-${meal}`;
    const pick = STATIC_RECIPES[Math.floor(Math.random()*STATIC_RECIPES.length)];
    setPlan(p => ({ ...p, [key]: pick }));
  };

  const removeMeal = (key) => setPlan(p => { const n={...p}; delete n[key]; return n; });
  const totalCals  = Object.values(plan).reduce((s,r) => s + (r?.cal||r?.calories||0), 0);

  const groceries = ["🥑 2 Avocados","🐟 400g Salmon fillet","🍋 3 Lemons","🌿 Fresh herbs","🧅 2 Onions","🫑 Bell peppers x3","🧄 Garlic bulb","🥗 Mixed salad leaves","🥚 6 Free-range eggs","🍅 Cherry tomatoes 250g","🧴 Olive oil 500ml","🌾 Quinoa 500g","🥛 Oat milk 1L","🫙 Greek yogurt 400g"];

  if (groceryView) return (
    <div style={{ maxWidth:680, margin:"0 auto", padding:"60px 5%" }}>
      <button onClick={()=>setGroceryView(false)} style={{ display:"inline-flex", alignItems:"center", gap:8, marginBottom:28, padding:"10px 18px", borderRadius:99, border:"2px solid #E8F0E5", background:"#fff", color:"#52796F", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>← Back to Planner</button>
      <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:40, fontWeight:900, color:"#1B4332", marginBottom:6 }}>🛒 Grocery List</h1>
      <p style={{ color:"#52796F", marginBottom:28 }}>Auto-generated from your weekly meal plan</p>
      <div style={{ background:"#fff", borderRadius:24, padding:"28px", boxShadow:"0 4px 32px rgba(0,0,0,0.06)", border:"1px solid #E8F0E5" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, padding:"14px 18px", background:"#D8F3DC", borderRadius:14 }}>
          <span style={{ fontWeight:700, color:"#1B4332", fontSize:14 }}>📦 {groceries.length} items</span>
          <span style={{ fontWeight:700, color:"#2D6A4F", fontSize:14 }}>Est. £28–35</span>
        </div>
        {groceries.map((item,i) => <GroceryItem key={i} item={item} />)}
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"60px 5%" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:36, flexWrap:"wrap", gap:16 }}>
        <div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(28px,4vw,48px)", fontWeight:900, color:"#1B4332", marginBottom:6, letterSpacing:"-1px" }}>Weekly Planner 🗓️</h1>
          <p style={{ color:"#52796F", fontSize:14 }}>Click any slot to add a meal. Build your perfect week!</p>
        </div>
        <div style={{ display:"flex", gap:12, alignItems:"center" }}>
          <div style={{ padding:"12px 18px", background:"#D8F3DC", borderRadius:14, textAlign:"center" }}>
            <div style={{ fontSize:10, fontWeight:700, color:"#52796F", textTransform:"uppercase", marginBottom:2 }}>Week Cals</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:900, color:"#1B4332" }}>{totalCals.toLocaleString()}</div>
          </div>
          <button onClick={()=>setGroceryView(true)} className="btn-hover" style={{ padding:"13px 22px", borderRadius:14, background:"linear-gradient(135deg,#40916C,#2D6A4F)", color:"#fff", fontWeight:700, fontSize:13, border:"none", cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 16px rgba(45,106,79,0.3)", transition:"all 0.2s" }}>🛒 Grocery List</button>
        </div>
      </div>
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"separate", borderSpacing:6, minWidth:700 }}>
          <thead>
            <tr>
              <th style={{ padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:700, color:"#74A08A", textTransform:"uppercase", letterSpacing:"0.6px", whiteSpace:"nowrap" }}>Meal</th>
              {DAYS.map(d=><th key={d} style={{ padding:"10px 14px", textAlign:"center", fontSize:13, fontWeight:800, color:"#1B4332", background:"#fff", borderRadius:10 }}>{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {MEALS.map(meal=>(
              <tr key={meal}>
                <td style={{ padding:"6px 14px", fontSize:12, fontWeight:700, color:"#52796F", whiteSpace:"nowrap" }}>{meal}</td>
                {DAYS.map(day=>{
                  const key    = `${day}-${meal}`;
                  const recipe = plan[key];
                  return (
                    <td key={day} style={{ padding:3 }}>
                      {recipe ? (
                        <div style={{ background:recipe.color||"#E8F5E9", borderRadius:12, padding:"10px 12px", position:"relative" }}>
                          <div style={{ fontSize:18, marginBottom:3 }}>{recipe.emoji||"🍽️"}</div>
                          <div style={{ fontSize:10, fontWeight:700, color:"#1B4332", lineHeight:1.3 }}>{recipe.name}</div>
                          <div style={{ fontSize:9, color:"#52796F", marginTop:3 }}>{recipe.cal||recipe.calories} cal</div>
                          <button onClick={()=>removeMeal(key)} style={{ position:"absolute", top:4, right:4, width:16, height:16, borderRadius:"50%", border:"none", background:"rgba(0,0,0,0.15)", color:"#fff", fontSize:9, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", lineHeight:1 }}>×</button>
                        </div>
                      ) : (
                        <button onClick={()=>addMeal(day,meal)} style={{ width:"100%", minHeight:64, borderRadius:12, border:"2px dashed #D8F3DC", background:"#F7F9F5", color:"#B7E4C7", fontSize:18, cursor:"pointer", transition:"all 0.2s" }}
                          onMouseEnter={e=>{e.currentTarget.style.background="#E8F5E9";e.currentTarget.style.borderColor="#52B788";e.currentTarget.style.color="#52B788"}}
                          onMouseLeave={e=>{e.currentTarget.style.background="#F7F9F5";e.currentTarget.style.borderColor="#D8F3DC";e.currentTarget.style.color="#B7E4C7"}}>
                          +
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GroceryItem({ item }) {
  const [checked, setChecked] = useState(false);
  return (
    <div onClick={()=>setChecked(!checked)} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 0", borderBottom:"1px solid #F0F4ED", cursor:"pointer" }}>
      <div style={{ width:20, height:20, borderRadius:6, border:`2px solid ${checked?"#52B788":"#D8F3DC"}`, background:checked?"#52B788":"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.2s" }}>
        {checked && <span style={{ color:"#fff", fontSize:11, fontWeight:800 }}>✓</span>}
      </div>
      <span style={{ fontSize:14, color:checked?"#B7E4C7":"#1B4332", textDecoration:checked?"line-through":"none", transition:"all 0.2s" }}>{item}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   WHY US PAGE
═══════════════════════════════════════════════════════ */
function WhyUsPage({ setPage }) {
  return (
    <div>
      <section style={{ padding:"100px 5% 80px", background:"linear-gradient(135deg,#1B4332,#2D6A4F)", textAlign:"center" }}>
        <div style={{ maxWidth:780, margin:"0 auto" }}>
          <div className="fade-up" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.12)", borderRadius:99, padding:"6px 16px", marginBottom:20 }}>
            <span style={{ fontSize:11, fontWeight:700, color:"#B7E4C7", letterSpacing:"0.5px" }}>WHY CHOOSE US</span>
          </div>
          <h1 className="fade-up-1" style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(36px,5vw,60px)", fontWeight:900, color:"#fff", marginBottom:18, letterSpacing:"-2px" }}>
            We're not just another<br/><span style={{ color:"#52B788" }}>recipe app.</span>
          </h1>
          <p className="fade-up-2" style={{ color:"#95D5B2", fontSize:17, lineHeight:1.7 }}>The Balanced Bites is a decision-support system built around you — not a content repository built around clicks.</p>
        </div>
      </section>

      <section style={{ padding:"80px 5%", background:"#fff" }}>
        <div style={{ maxWidth:880, margin:"0 auto" }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(26px,3vw,38px)", fontWeight:900, color:"#1B4332", textAlign:"center", marginBottom:44, letterSpacing:"-0.5px" }}>The difference is clear</h2>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
            {[["❌ Others","#FFF5F5","#FFE0E0","#C62828","#7F3B3B","✗","#EF5350",["Overwhelming choice with no personalisation","You manually write your own grocery lists","No goal-alignment or body metrics used","Static content, no intelligent filtering","No verified nutritional information"]],
              ["✅ The Balanced Bites","#E8F5E9","#A5D6A7","#1B4332","#2D5016","✓","#2D6A4F",["Curated meals aligned to your exact goals","Automatic grocery list generation","Personalised to your body stats & targets","Smart dietary & allergy filtering","Verified nutrition via Edamam & Spoonacular"]]
            ].map(([title,bg,border,titleColor,textColor,icon,iconColor,items])=>(
              <div key={title} style={{ padding:"32px 28px", background:bg, borderRadius:24, border:`2px solid ${border}` }}>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, color:titleColor, marginBottom:20 }}>{title}</h3>
                {items.map((t,i)=>(
                  <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:12 }}>
                    <span style={{ color:iconColor, fontSize:14, flexShrink:0, marginTop:1 }}>{icon}</span>
                    <span style={{ fontSize:13, color:textColor, lineHeight:1.6 }}>{t}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding:"80px 5%", background:"#F7F9F5" }}>
        <div style={{ maxWidth:1000, margin:"0 auto" }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(26px,3vw,40px)", fontWeight:900, color:"#1B4332", textAlign:"center", marginBottom:48 }}>Our core values</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:20 }}>
            {[["🎯","Clarity","Structured planning cuts through the noise."],["⚡","Efficiency","Automate the tedious, focus on living."],["🛡️","Trust","Every data point is verified and transparent."],["🌍","Inclusivity","Every diet, every lifestyle, welcome here."]].map(([emoji,title,desc])=>(
              <div key={title} className="card-hover" style={{ padding:"32px 24px", background:"#fff", borderRadius:22, textAlign:"center", border:"1px solid #E8F0E5", transition:"all 0.25s" }}>
                <div style={{ fontSize:40, marginBottom:14 }}>{emoji}</div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:"#1B4332", marginBottom:8 }}>{title}</h3>
                <p style={{ fontSize:13, color:"#52796F", lineHeight:1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding:"72px 5%", textAlign:"center", background:"linear-gradient(135deg,#F0F7EE,#D8F3DC)" }}>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(24px,3vw,40px)", fontWeight:900, color:"#1B4332", marginBottom:14 }}>Convinced? Let's get started.</h2>
        <p style={{ color:"#52796F", fontSize:15, marginBottom:28 }}>Your personalised meal plan is 2 minutes away.</p>
        <button onClick={()=>setPage("register")} className="btn-hover" style={{ padding:"16px 44px", borderRadius:99, background:"linear-gradient(135deg,#40916C,#1B4332)", color:"#fff", fontWeight:800, fontSize:16, border:"none", cursor:"pointer", fontFamily:"inherit", boxShadow:"0 8px 24px rgba(45,106,79,0.35)", transition:"all 0.2s" }}>
          Start For Free →
        </button>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PROFILE PAGE
═══════════════════════════════════════════════════════ */
function ProfilePage({ setPage }) {
  const { user, logout, updateProfile } = useAuth();
  const goalMap = { cut:"Cut (Fat Loss)", bulk:"Bulk (Muscle Gain)", bodybuilding:"Body Building", fitness:"Improve Fitness", maintain:"Maintain Weight" };

  const handleLogout = async () => { await logout(); setPage("home"); };

  return (
    <div style={{ maxWidth:780, margin:"0 auto", padding:"60px 5%" }}>
      <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:42, fontWeight:900, color:"#1B4332", marginBottom:6, letterSpacing:"-1px" }}>My Profile 👤</h1>
      <p style={{ color:"#52796F", marginBottom:36 }}>Your personalised health dashboard</p>

      <div style={{ background:"linear-gradient(135deg,#1B4332,#2D6A4F)", borderRadius:26, padding:"36px", marginBottom:20, display:"flex", alignItems:"center", gap:24, flexWrap:"wrap" }}>
        <div style={{ width:72, height:72, borderRadius:"50%", background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, flexShrink:0, fontWeight:800, color:"#fff" }}>
          {user?.name?.[0]?.toUpperCase()||"U"}
        </div>
        <div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:900, color:"#fff", marginBottom:3 }}>{user?.name}</h2>
          <p style={{ color:"#95D5B2", fontSize:13 }}>{user?.email}</p>
          {user?.profile?.goal && <div style={{ marginTop:8, display:"inline-block", padding:"4px 12px", borderRadius:99, background:"rgba(255,255,255,0.15)", color:"#fff", fontSize:12, fontWeight:700 }}>🎯 {goalMap[user.profile.goal]||user.profile.goal}</div>}
        </div>
      </div>

      {user?.profile && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:14, marginBottom:20 }}>
          {[["Age",user.profile.age||"–","yrs"],["Weight",user.profile.weight||"–",user.profile.weightUnit||"kg"],["Height",user.profile.height||"–",user.profile.heightUnit||"cm"],["Workout",user.profile.workoutFreq||"–","x/wk"]].map(([label,val,unit])=>(
            <div key={label} style={{ background:"#fff", borderRadius:18, padding:"22px 16px", textAlign:"center", border:"1px solid #E8F0E5", boxShadow:"0 2px 12px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize:10, fontWeight:700, color:"#74A08A", textTransform:"uppercase", letterSpacing:"0.6px", marginBottom:6 }}>{label}</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:900, color:"#1B4332" }}>{val}</div>
              <div style={{ fontSize:10, color:"#74A08A", marginTop:3 }}>{unit}</div>
            </div>
          ))}
        </div>
      )}

      {user?.profile?.diet?.length > 0 && (
        <div style={{ background:"#fff", borderRadius:22, padding:"28px", border:"1px solid #E8F0E5", marginBottom:20 }}>
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:"#1B4332", marginBottom:16 }}>Dietary Preferences</h3>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {user.profile.diet.map(d=><span key={d} style={{ padding:"7px 14px", borderRadius:99, background:"#D8F3DC", color:"#2D6A4F", fontWeight:600, fontSize:12 }}>{d}</span>)}
          </div>
          {user.profile.allergies?.length > 0 && user.profile.allergies[0] !== "none" && (
            <div style={{ marginTop:16 }}>
              <p style={{ fontSize:11, fontWeight:700, color:"#74A08A", textTransform:"uppercase", letterSpacing:"0.6px", marginBottom:10 }}>Allergies</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {user.profile.allergies.map(a=><span key={a} style={{ padding:"7px 14px", borderRadius:99, background:"#FFEBEE", color:"#C62828", fontWeight:600, fontSize:12 }}>{a}</span>)}
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
        <button onClick={()=>setPage("planner")} className="btn-hover" style={{ padding:"13px 24px", borderRadius:14, background:"linear-gradient(135deg,#40916C,#2D6A4F)", color:"#fff", fontWeight:700, fontSize:13, border:"none", cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 16px rgba(45,106,79,0.3)", transition:"all 0.2s" }}>🗓️ View Planner</button>
        <button onClick={()=>setPage("onboarding")} style={{ padding:"13px 24px", borderRadius:14, border:"2px solid #E8F0E5", background:"#fff", color:"#52796F", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>✏️ Update Profile</button>
        <button onClick={handleLogout} style={{ padding:"13px 24px", borderRadius:14, border:"2px solid #FFCDD2", background:"#fff", color:"#EF5350", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Sign Out</button>
      </div>
    </div>
  );
}

/* ─── Shared style objects ───────────────────────────── */
const labelStyle = { fontSize:11, fontWeight:700, color:"#52796F", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.6px" };
const inputStyle = { padding:"12px 16px", border:"2px solid #E8F5E9", borderRadius:12, fontSize:14, fontFamily:"inherit", color:"#1B4332", background:"#F7F9F5", width:"100%" };
const cardTitle  = { fontFamily:"'Playfair Display',serif", fontSize:21, fontWeight:700, color:"#1B4332", marginBottom:6 };
const cardSub    = { fontSize:13, color:"#74A08A", marginBottom:24 };
const obLabel    = { fontSize:10, fontWeight:700, color:"#52796F", display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.6px" };

/* ═══════════════════════════════════════════════════════
   APP ROOT — Router + Auth Guard
═══════════════════════════════════════════════════════ */
export default function App() {
  const [page,           setPage]           = useState("home");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const { user, loading }                   = useAuth();

  const navigate = (p) => {
    // Guard protected routes
    if (["planner","profile"].includes(p) && !user) { setPage("login"); return; }
    setPage(p);
    window.scrollTo({ top:0, behavior:"smooth" });
  };

  if (loading) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#F7F9F5" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:16 }}>🌿</div>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:900, color:"#1B4332" }}>The Balanced Bites</div>
        <div style={{ color:"#74A08A", fontSize:14, marginTop:8 }}>Loading your experience...</div>
      </div>
    </div>
  );

  const hideNav = ["login","register","onboarding"].includes(page);

  return (
    <div>
      <GlobalStyle />
      {!hideNav && <Navbar page={page} setPage={navigate} />}
      {page === "home"          && <HomePage         setPage={navigate} />}
      {page === "login"         && <AuthPage         mode="login"    setPage={navigate} />}
      {page === "register"      && <AuthPage         mode="register" setPage={navigate} />}
      {page === "onboarding"    && <OnboardingPage   setPage={navigate} />}
      {page === "recipes"       && <RecipesPage      setPage={navigate} setSelectedRecipe={setSelectedRecipe} />}
      {page === "recipe-detail" && <RecipeDetailPage recipe={selectedRecipe} setPage={navigate} />}
      {page === "planner"       && <PlannerPage      setPage={navigate} />}
      {page === "why-us"        && <WhyUsPage        setPage={navigate} />}
      {page === "profile"       && <ProfilePage      setPage={navigate} />}
    </div>
  );
}
