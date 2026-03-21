import { useState, useRef, useCallback } from "react";

// TheMealDB — 100% free, no API key needed
const MEALDB = "https://www.themealdb.com/api/json/v1/1";

const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Rye&family=Lora:ital,wght@0,400;0,600;1,400&family=Courier+Prime:wght@400;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .root-wrap { position:relative; min-height:100vh; overflow-x:hidden; }
    .app-bg {
      min-height:100vh;
      background:#2c1a0a;
      background-image:
        repeating-linear-gradient(90deg,rgba(0,0,0,0.03) 0px,rgba(0,0,0,0.03) 1px,transparent 1px,transparent 40px),
        repeating-linear-gradient(0deg,rgba(0,0,0,0.03) 0px,rgba(0,0,0,0.03) 1px,transparent 1px,transparent 40px);
      font-family:'Lora',serif;
      color:#f5e6cc;
    }

    /* ── Saloon doors ── */
    .saloon-wrap { position:absolute; top:0; left:0; right:0; height:100vh; z-index:100; }
    .saloon-curtain { position:absolute; inset:0; background:#0e0600; animation:curtainFade 2.8s ease forwards; }
    @keyframes curtainFade { 0%{opacity:1} 65%{opacity:1} 100%{opacity:0} }
    .saloon-title-box {
      position:absolute; top:40%; left:50%; transform:translate(-50%,-50%);
      text-align:center; z-index:10; pointer-events:none;
      animation:titleBurst 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s both;
    }
    @keyframes titleBurst {
      from{opacity:0;transform:translate(-50%,-46%) scale(0.75)}
      to{opacity:1;transform:translate(-50%,-50%) scale(1)}
    }
    .saloon-doors-row { position:absolute; inset:0; display:flex; }
    .sd {
      width:50%; height:100%;
      background:linear-gradient(180deg,#3d2008 0%,#2a1505 55%,#3d2008 100%);
      position:relative; overflow:hidden;
      display:flex; flex-direction:column; justify-content:space-around; padding:8px 0;
    }
    .sd::after {
      content:''; position:absolute; inset:0; pointer-events:none;
      background:repeating-linear-gradient(92deg,transparent 0px,transparent 22px,rgba(0,0,0,0.13) 22px,rgba(0,0,0,0.13) 24px);
    }
    .sd-l { border-right:5px solid #8b5a1a; transform-origin:left center; animation:swingL 1.6s cubic-bezier(0.25,0.46,0.45,0.94) 0.9s both; }
    .sd-r { border-left:5px solid #8b5a1a; transform-origin:right center; animation:swingR 1.6s cubic-bezier(0.25,0.46,0.45,0.94) 0.9s both; }
    @keyframes swingL {
      0%{transform:perspective(900px) rotateY(0deg);opacity:1}
      55%{transform:perspective(900px) rotateY(-108deg)}
      72%{transform:perspective(900px) rotateY(-84deg)}
      88%{transform:perspective(900px) rotateY(-102deg)}
      100%{transform:perspective(900px) rotateY(-98deg);opacity:0}
    }
    @keyframes swingR {
      0%{transform:perspective(900px) rotateY(0deg);opacity:1}
      55%{transform:perspective(900px) rotateY(108deg)}
      72%{transform:perspective(900px) rotateY(84deg)}
      88%{transform:perspective(900px) rotateY(102deg)}
      100%{transform:perspective(900px) rotateY(98deg);opacity:0}
    }
    .door-plank { height:5px; background:#0e0600; margin:0 14px; border-radius:2px; position:relative; z-index:1; }
    .door-arch { width:48%; aspect-ratio:1/1.3; border:4px solid #8b5a1a; border-radius:50% 50% 0 0; margin:0 auto; display:flex; align-items:center; justify-content:center; position:relative; z-index:1; }
    .door-arch-inner { width:78%; height:78%; border:2px solid rgba(139,90,26,0.4); border-radius:50% 50% 0 0; }
    .hinge { width:14px; height:28px; background:linear-gradient(90deg,#6b5010,#c9922a,#6b5010); border:1px solid #3a2008; border-radius:3px; position:absolute; z-index:2; }

    /* ── App styles ── */
    .rye { font-family:'Rye',cursive; }
    .cp  { font-family:'Courier Prime',monospace; }
    .header-plank {
      background:linear-gradient(180deg,#3d2008 0%,#2a1505 40%,#3d2008 100%);
      border-bottom:4px solid #8b5a1a;
      box-shadow:0 6px 24px rgba(0,0,0,0.7);
      position:relative;
    }
    .header-plank::before {
      content:''; position:absolute; inset:0; pointer-events:none;
      background:repeating-linear-gradient(92deg,transparent 0px,transparent 18px,rgba(0,0,0,0.07) 18px,rgba(0,0,0,0.07) 20px);
    }
    .rope { height:8px; background:repeating-linear-gradient(90deg,#8b6914 0px,#c9922a 4px,#8b6914 8px); border-radius:4px; opacity:0.6; }
    .parchment { background:#f2e0b6; color:#3d1f05; border:2px solid #b8832a; box-shadow:inset 0 0 40px rgba(180,120,40,0.15),0 4px 16px rgba(0,0,0,0.4); }
    .wanted-card {
      background:#f0d898; border:3px solid #8b5e1a; position:relative;
      box-shadow:4px 4px 0 #5a3a0a,0 8px 32px rgba(0,0,0,0.5);
      transition:transform 0.2s ease,box-shadow 0.2s ease;
      overflow:hidden;
    }
    .wanted-card:hover { transform:translateY(-3px) rotate(0.3deg); box-shadow:6px 8px 0 #5a3a0a,0 12px 40px rgba(0,0,0,0.6); }
    .wanted-card::before { content:''; position:absolute; inset:6px; border:1px solid rgba(139,94,26,0.4); pointer-events:none; z-index:1; }
    .tab-btn { font-family:'Rye',cursive; font-size:12px; padding:10px 14px; border:2px solid #8b5a1a; background:#3d2008; color:#c9922a; cursor:pointer; transition:all 0.2s; letter-spacing:0.04em; flex:1; }
    .tab-btn:hover { background:#4d2810; color:#f0c060; }
    .tab-btn.on { background:#8b5a1a; color:#f5e6cc; }
    .draw-btn {
      font-family:'Rye',cursive; font-size:18px; letter-spacing:0.08em; padding:16px 40px;
      background:linear-gradient(180deg,#c9501a 0%,#8b2800 100%);
      color:#f5e6cc; border:3px solid #f0c060;
      box-shadow:0 4px 0 #4a1200,0 6px 20px rgba(0,0,0,0.5);
      cursor:pointer; transition:all 0.15s; position:relative; overflow:hidden;
    }
    .draw-btn::before { content:''; position:absolute; inset:3px; border:1px solid rgba(240,192,96,0.3); pointer-events:none; }
    .draw-btn:hover { background:linear-gradient(180deg,#d96020 0%,#9b3810 100%); transform:translateY(-2px); }
    .draw-btn:active { transform:translateY(2px); }
    .draw-btn:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
    .frontier-check { appearance:none; width:18px; height:18px; border:2px solid #8b5a1a; background:#f2e0b6; cursor:pointer; position:relative; flex-shrink:0; margin-top:1px; }
    .frontier-check:checked { background:#8b5a1a; }
    .frontier-check:checked::after { content:'✕'; position:absolute; top:-2px; left:2px; font-size:13px; color:#f5e6cc; font-weight:bold; }
    .fi { background:#f2e0b6; border:2px solid #8b5a1a; color:#3d1f05; font-family:'Lora',serif; font-size:14px; padding:10px 14px; width:100%; outline:none; }
    .fi:focus { border-color:#c9922a; }
    .fi::placeholder { color:#a07840; font-style:italic; }
    .fta { background:#f2e0b6; border:2px solid #8b5a1a; color:#3d1f05; font-family:'Lora',serif; font-size:14px; padding:10px 14px; width:100%; outline:none; resize:vertical; min-height:90px; }
    .fta:focus { border-color:#c9922a; }
    .fta::placeholder { color:#a07840; font-style:italic; }
    .itag { display:inline-flex; align-items:center; gap:6px; background:#8b5a1a; color:#f5e6cc; font-family:'Courier Prime',monospace; font-size:12px; padding:4px 10px; border:1px solid #c9922a; }
    .itag button { background:none; border:none; color:#f0c060; cursor:pointer; font-size:14px; line-height:1; }
    .drop-zone { border:3px dashed #8b5a1a; background:rgba(139,90,26,0.08); transition:all 0.2s; cursor:pointer; }
    .drop-zone:hover,.drop-zone.dov { border-color:#c9922a; background:rgba(201,146,42,0.12); }
    .step-num { width:28px; height:28px; border:2px solid #8b5e1a; border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:'Rye',cursive; font-size:12px; color:#8b5e1a; flex-shrink:0; }
    .sl { font-family:'Courier Prime',monospace; font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:#c9922a; border-bottom:1px solid rgba(201,146,42,0.3); padding-bottom:4px; margin-bottom:10px; }
    .recipe-img { width:100%; height:180px; object-fit:cover; display:block; border-bottom:3px solid #8b5e1a; }
    .visit-btn { display:block; text-align:center; margin-top:10px; background:#8b5e1a; border:1px solid #c9922a; color:#f5e6cc; font-family:'Rye',cursive; font-size:12px; padding:8px 16px; cursor:pointer; text-decoration:none; letter-spacing:0.06em; }
    .visit-btn:hover { background:#a07030; }
    @keyframes spin { to{transform:rotate(360deg)} }
    .spin { animation:spin 1s linear infinite; }
    @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    .fu { animation:fadeUp 0.4s ease forwards; }
    @keyframes campfire { 0%,100%{opacity:1;transform:scaleY(1) translateX(0)} 33%{opacity:.85;transform:scaleY(1.05) translateX(1px)} 66%{opacity:.9;transform:scaleY(.97) translateX(-1px)} }
    .flame { animation:campfire 1.2s ease-in-out infinite; transform-origin:bottom center; }
    ::-webkit-scrollbar { width:8px; }
    ::-webkit-scrollbar-track { background:#1a0f06; }
    ::-webkit-scrollbar-thumb { background:#5a3a10; border-radius:4px; }
  `}</style>
);

/* ── Data ── */
const PANTRY = {
  "Proteins":        ["Chicken","Beef","Pork","Bacon","Eggs","Sausage","Fish","Shrimp","Turkey","Lamb"],
  "Dairy":           ["Milk","Butter","Cheddar","Cream Cheese","Sour Cream","Heavy Cream","Parmesan","Mozzarella"],
  "Vegetables":      ["Onion","Garlic","Potato","Tomato","Bell Pepper","Jalapeño","Corn","Spinach","Mushroom","Zucchini","Carrot","Celery","Broccoli"],
  "Pantry Staples":  ["Flour","Rice","Pasta","Bread","Canned Tomatoes","Chicken Broth","Olive Oil","Vegetable Oil","Beans","Lentils","Canned Corn"],
  "Spices & Sauces": ["Salt","Black Pepper","Cumin","Paprika","Chili Powder","Oregano","Garlic Powder","Hot Sauce","Soy Sauce","Worcestershire","Honey","Mustard"],
  "Baking":          ["Sugar","Brown Sugar","Baking Powder","Baking Soda","Vanilla Extract","Cocoa Powder","Oats"],
};

const CUISINE_TYPES = [
  "American","Asian","British","Caribbean","Chinese","French","Greek",
  "Indian","Italian","Japanese","Korean","Mediterranean","Mexican",
  "Middle Eastern","Moroccan","Polish","Spanish","Thai","Vietnamese",
];
const MEAL_TYPES = ["Breakfast","Brunch","Lunch/Dinner","Snack","Teatime"];
const DISH_TYPES = [
  "Main Course","Salad","Soup","Sandwiches","Pizza","Pasta",
  "Desserts","Egg","Seafood","Side Dish","Starter","Bread",
  "Sweets","Biscuits and Cookies",
];

/* ── TheMealDB area → cuisine map ── */
const CUISINE_MAP = {
  "American":"American","British":"British","Canadian":"American",
  "Chinese":"Chinese","Dutch":"European","Egyptian":"Middle Eastern",
  "French":"French","Greek":"Greek","Indian":"Indian","Irish":"British",
  "Italian":"Italian","Jamaican":"Caribbean","Japanese":"Japanese",
  "Kenyan":"African","Korean":"Korean","Malaysian":"Asian",
  "Mexican":"Mexican","Moroccan":"Moroccan","Polish":"Polish",
  "Portuguese":"European","Russian":"European","Spanish":"Spanish",
  "Thai":"Thai","Tunisian":"African","Turkish":"Middle Eastern",
  "Unknown":"Other","Vietnamese":"Vietnamese",
};

const Star = ({ s=24, c="#f0c060" }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={c} style={{flexShrink:0}}>
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
  </svg>
);

/* ── Saloon Doors ── */
const Saloon = ({ onDone }) => {
  const [alive, setAlive] = useState(true);
  if (!alive) return null;
  const planks = Array.from({ length: 14 });
  const Door = ({ isRight }) => (
    <div
      className={isRight ? "sd sd-r" : "sd sd-l"}
      onAnimationEnd={isRight ? () => { setAlive(false); onDone(); } : undefined}
    >
      {planks.map((_,i) => <div key={i} className="door-plank" style={{opacity:0.4+(i%4)*0.18}}/>)}
      <div className="door-arch"><div className="door-arch-inner"/></div>
      {planks.map((_,i) => <div key={i} className="door-plank" style={{opacity:0.4+(i%4)*0.18}}/>)}
      <div className="hinge" style={{top:"20%",[isRight?"right":"left"]:-2}}/>
      <div className="hinge" style={{bottom:"20%",[isRight?"right":"left"]:-2}}/>
    </div>
  );
  return (
    <div className="saloon-wrap">
      <div className="saloon-curtain"/>
      <div className="saloon-title-box">
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:14,marginBottom:14}}>
          <Star s={34}/><Star s={34}/><Star s={34}/>
        </div>
        <h1 className="rye" style={{fontSize:"clamp(48px,10vw,88px)",color:"#f0c060",textShadow:"0 0 50px rgba(240,160,0,0.3),4px 6px 0 rgba(0,0,0,0.85)",letterSpacing:"0.12em",lineHeight:1}}>
          OASIS
        </h1>
        <p style={{color:"#c9922a",fontSize:13,fontStyle:"italic",marginTop:14,letterSpacing:"0.2em"}}>
          push on through, partner
        </p>
      </div>
      <div className="saloon-doors-row">
        <Door isRight={false}/>
        <Door isRight={true}/>
      </div>
    </div>
  );
};

/* ── Campfire loader ── */
const Campfire = () => (
  <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,padding:"40px 0"}}>
    <svg width="80" height="80" viewBox="0 0 80 80">
      <ellipse cx="40" cy="68" rx="20" ry="4" fill="#5a3a10" opacity="0.5"/>
      <rect x="28" y="52" width="6" height="18" rx="2" fill="#8b4510" transform="rotate(-12 31 61)"/>
      <rect x="38" y="50" width="6" height="20" rx="2" fill="#6b3008"/>
      <rect x="46" y="52" width="6" height="18" rx="2" fill="#8b4510" transform="rotate(12 49 61)"/>
      <g className="flame">
        <ellipse cx="40" cy="48" rx="8"  ry="14" fill="#e85a00" opacity="0.9"/>
        <ellipse cx="36" cy="50" rx="5"  ry="10" fill="#ff8c00" opacity="0.8"/>
        <ellipse cx="44" cy="50" rx="5"  ry="10" fill="#ff8c00" opacity="0.8"/>
        <ellipse cx="40" cy="46" rx="5"  ry="10" fill="#ffb300" opacity="0.85"/>
        <ellipse cx="40" cy="44" rx="3"  ry="7"  fill="#ffe066" opacity="0.9"/>
      </g>
    </svg>
    <p className="rye" style={{color:"#c9922a",fontSize:16,letterSpacing:"0.1em"}}>Cookin' somethin' up...</p>
    <p style={{color:"#8b6830",fontSize:13,fontStyle:"italic"}}>The chuck wagon's workin' its magic</p>
  </div>
);

/* ── Recipe Card ── */
const RecipeCard = ({ meal, idx }) => {
  const [open, setOpen] = useState(false);

  // Extract ingredients from TheMealDB format
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const msr = meal[`strMeasure${i}`];
    if (ing && ing.trim()) ingredients.push(`${msr ? msr.trim() + " " : ""}${ing.trim()}`);
  }

  const steps = meal.strInstructions
    ? meal.strInstructions.split(/\r?\n/).filter(s => s.trim().length > 10).slice(0, 8)
    : [];

  return (
    <div className="wanted-card fu" style={{animationDelay:`${idx*110}ms`}}>
      {meal.strMealThumb && <img src={meal.strMealThumb} alt={meal.strMeal} className="recipe-img"/>}
      <div style={{padding:"16px 20px 20px",color:"#3d1f05",position:"relative",zIndex:2}}>
        <div style={{textAlign:"center",marginBottom:12}}>
          <div className="cp" style={{fontSize:10,letterSpacing:"0.3em",fontWeight:700,borderTop:"2px solid #8b5e1a",borderBottom:"2px solid #8b5e1a",padding:"3px 0",marginBottom:8,color:"#5a3010"}}>
            ✦ FRONTIER RECIPE ✦
          </div>
          <h3 className="rye" style={{fontSize:17,color:"#3d1205",lineHeight:1.2,marginBottom:4}}>{meal.strMeal}</h3>
          <div style={{display:"flex",justifyContent:"center",gap:8,flexWrap:"wrap",marginTop:4}}>
            {meal.strArea && <span className="cp" style={{fontSize:10,background:"rgba(139,90,26,0.15)",border:"1px solid rgba(139,90,26,0.3)",padding:"2px 8px",color:"#5a3010"}}>{meal.strArea}</span>}
            {meal.strCategory && <span className="cp" style={{fontSize:10,background:"rgba(139,90,26,0.15)",border:"1px solid rgba(139,90,26,0.3)",padding:"2px 8px",color:"#5a3010"}}>{meal.strCategory}</span>}
          </div>
        </div>

        <div style={{marginBottom:12}}>
          <p className="sl">Ingredients</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
            {(open ? ingredients : ingredients.slice(0,6)).map((ing,i)=>(
              <span key={i} className="cp" style={{fontSize:11,background:"rgba(139,90,26,0.15)",border:"1px solid rgba(139,90,26,0.3)",padding:"2px 8px",color:"#5a3010"}}>{ing}</span>
            ))}
            {!open && ingredients.length > 6 && (
              <span className="cp" style={{fontSize:11,color:"#8b5a1a",fontStyle:"italic",padding:"2px 4px"}}>+{ingredients.length-6} more</span>
            )}
          </div>
        </div>

        <button onClick={()=>setOpen(o=>!o)} style={{width:"100%",background:"#8b5e1a",border:"1px solid #c9922a",color:"#f5e6cc",fontFamily:"Rye,cursive",fontSize:13,padding:"8px",cursor:"pointer",letterSpacing:"0.06em",marginBottom:8}}>
          {open ? "▲ Hide Instructions" : "▼ Show Instructions"}
        </button>

        {open && steps.length > 0 && (
          <div style={{marginBottom:12,paddingTop:10,borderTop:"1px dashed #c9922a"}}>
            <p className="sl">Method</p>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {steps.map((s,i)=>(
                <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                  <div className="step-num">{i+1}</div>
                  <p style={{fontSize:12,lineHeight:1.6,flex:1,color:"#3d1f05"}}>{s}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {meal.strYoutube && (
          <a href={meal.strYoutube} target="_blank" rel="noreferrer" className="visit-btn">
            ▶ Watch on YouTube
          </a>
        )}
        {meal.strSource && (
          <a href={meal.strSource} target="_blank" rel="noreferrer" className="visit-btn" style={{marginTop:6}}>
            🤠 Full Recipe
          </a>
        )}
      </div>
    </div>
  );
};

const Pill = ({ label, active, onClick }) => (
  <button onClick={onClick} style={{fontFamily:"Courier Prime,monospace",fontSize:12,padding:"5px 14px",border:`2px solid ${active?"#c9501a":"#8b5a1a"}`,background:active?"#c9501a":"transparent",color:active?"#f5e6cc":"#5a3010",cursor:"pointer",transition:"all 0.15s"}}>
    {label}
  </button>
);

/* ── Main App ── */
export default function Oasis() {
  const [doors,      setDoors]      = useState(true);
  const [mode,       setMode]       = useState("checklist");
  const [checked,    setChecked]    = useState({});
  const [txt,        setTxt]        = useState("");
  const [tags,       setTags]       = useState([]);
  const [preview,    setPreview]    = useState(null);
  const [photoIngs,  setPhotoIngs]  = useState([]);
  const [analyzing,  setAnalyzing]  = useState(false);
  const [cuisineType,setCuisineType]= useState([]);
  const [mealType,   setMealType]   = useState([]);
  const [dishType,   setDishType]   = useState([]);
  const [notes,      setNotes]      = useState("");
  const [recipes,    setRecipes]    = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [err,        setErr]        = useState("");
  const [drag,       setDrag]       = useState(false);
  const fileRef = useRef();

  const toggle = item => setChecked(p=>({...p,[item]:!p[item]}));
  const checkedList = Object.keys(checked).filter(k=>checked[k]);

  const addTag = () => {
    const t = txt.trim();
    if (t && !tags.includes(t)) setTags(p=>[...p,t]);
    setTxt("");
  };

  const handleFile = useCallback(async file => {
    if (!file || !file.type.startsWith("image/")) return;
    setPhotoIngs([]);
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target.result);
    reader.readAsDataURL(file);
    setAnalyzing(true);
    try {
      const b64 = await new Promise(res => {
        const r = new FileReader();
        r.onload = e => res(e.target.result.split(",")[1]);
        r.readAsDataURL(file);
      });
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:800,
          messages:[{role:"user",content:[
            {type:"image",source:{type:"base64",media_type:file.type,data:b64}},
            {type:"text",text:'List every food ingredient visible. Return ONLY a JSON array of strings. Example: ["chicken","garlic"]'},
          ]}],
        }),
      });
      const data = await resp.json();
      const raw = (data.content||[]).map(c=>c.text||"").join("");
      const parsed = JSON.parse(raw.replace(/```json|```/g,"").trim());
      setPhotoIngs(Array.isArray(parsed) ? parsed : []);
    } catch { setPhotoIngs([]); }
    setAnalyzing(false);
  }, []);

  const ingredients = mode==="checklist" ? checkedList : mode==="manual" ? tags : photoIngs;

  const fetchRecipes = async () => {
    if (!ingredients.length) { setErr("Round up some ingredients first, partner!"); return; }
    setErr(""); setLoading(true); setRecipes([]);

    try {
      // Search by each ingredient, collect unique meal IDs
      const mealMap = {};
      await Promise.all(ingredients.slice(0, 4).map(async ing => {
        const r = await fetch(`${MEALDB}/filter.php?i=${encodeURIComponent(ing)}`);
        const d = await r.json();
        (d.meals || []).forEach(m => { mealMap[m.idMeal] = m; });
      }));

      let mealIds = Object.keys(mealMap);
      if (!mealIds.length) {
        // Fallback: search by name
        const r = await fetch(`${MEALDB}/search.php?s=${encodeURIComponent(ingredients[0])}`);
        const d = await r.json();
        (d.meals || []).forEach(m => { mealMap[m.idMeal] = m; });
        mealIds = Object.keys(mealMap);
      }

      if (!mealIds.length) {
        setErr("No recipes found for those ingredients. Try different ones, partner.");
        setLoading(false);
        return;
      }

      // Fetch full details for up to 12 meals
      const shuffled = mealIds.sort(() => Math.random() - 0.5).slice(0, 12);
      const details = await Promise.all(
        shuffled.map(id =>
          fetch(`${MEALDB}/lookup.php?i=${id}`).then(r => r.json()).then(d => d.meals?.[0])
        )
      );

      let results = details.filter(Boolean);

      // Apply cuisine filter
      if (cuisineType.length) {
        results = results.filter(m =>
          cuisineType.some(c => {
            const area = (m.strArea||"").toLowerCase();
            return area.includes(c.toLowerCase()) || c.toLowerCase().includes(area);
          })
        );
      }

      // Apply dish/category filter
      if (dishType.length) {
        results = results.filter(m =>
          dishType.some(d => (m.strCategory||"").toLowerCase().includes(d.toLowerCase()) || d.toLowerCase().includes((m.strCategory||"").toLowerCase()))
        );
      }

      // If filters narrowed to 0, use unfiltered
      if (!results.length) results = details.filter(Boolean);

      setRecipes(results.slice(0, 8));
    } catch (e) {
      setErr("The chuck wagon broke down. Check your connection and try again.");
    }
    setLoading(false);
  };

  const togList = (item, setList) =>
    setList(p => p.includes(item) ? p.filter(x=>x!==item) : [...p, item]);

  return (
    <div className="root-wrap">
      <G/>
      {doors && <Saloon onDone={() => setDoors(false)}/>}
      <div className="app-bg">

        {/* Header */}
        <div className="header-plank" style={{padding:"24px 20px",textAlign:"center"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:16,marginBottom:6}}>
            <Star s={32}/>
            <h1 className="rye" style={{fontSize:"clamp(28px,5vw,48px)",color:"#f0c060",textShadow:"2px 3px 0 rgba(0,0,0,0.6)",letterSpacing:"0.1em"}}>Oasis</h1>
            <Star s={32}/>
          </div>
          <p style={{color:"#c9922a",fontSize:14,fontStyle:"italic",letterSpacing:"0.06em"}}>Tell us what's in yer saddlebag — we'll rustle up the grub</p>
          <div className="rope" style={{maxWidth:400,margin:"16px auto 0"}}/>
        </div>

        <div style={{maxWidth:960,margin:"0 auto",padding:"28px 16px",display:"flex",flexDirection:"column",gap:24}}>

          {/* Step 1 */}
          <div className="parchment" style={{borderRadius:4,overflow:"hidden"}}>
            <div style={{background:"#3d2008",padding:"14px 24px",borderBottom:"2px solid #8b5a1a",display:"flex",alignItems:"center",gap:12}}>
              <Star s={18}/>
              <h2 className="rye" style={{color:"#f0c060",fontSize:18,letterSpacing:"0.06em"}}>Step 1 — What's In Yer Pantry?</h2>
            </div>
            <div style={{display:"flex",borderBottom:"2px solid #8b5a1a"}}>
              {[["checklist","☑  Checklist"],["manual","✏  Type It Out"],["photo","📷  Show Us"]].map(([m,l])=>(
                <button key={m} className={`tab-btn${mode===m?" on":""}`} onClick={()=>setMode(m)}>{l}</button>
              ))}
            </div>
            <div style={{padding:"20px 24px"}}>
              {mode==="checklist" && (
                <div>{Object.entries(PANTRY).map(([cat,items])=>(
                  <div key={cat} style={{marginBottom:18}}>
                    <p className="sl">{cat}</p>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(138px,1fr))",gap:"6px 12px"}}>
                      {items.map(item=>(
                        <label key={item} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",userSelect:"none",fontSize:13,color:"#3d1f05"}}>
                          <input type="checkbox" className="frontier-check" checked={!!checked[item]} onChange={()=>toggle(item)}/>{item}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}</div>
              )}
              {mode==="manual" && (
                <div>
                  <p style={{fontSize:13,marginBottom:12,color:"#5a3010",fontStyle:"italic"}}>Type each ingredient and press Enter — one at a time, like loading a six-shooter.</p>
                  <div style={{display:"flex",gap:8,marginBottom:14}}>
                    <input className="fi" placeholder="e.g. chicken, garlic, tomato..." value={txt} onChange={e=>setTxt(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTag()} style={{flex:1}}/>
                    <button onClick={addTag} style={{background:"#8b5a1a",border:"2px solid #c9922a",color:"#f5e6cc",fontFamily:"Rye,cursive",fontSize:13,padding:"0 20px",cursor:"pointer",whiteSpace:"nowrap"}}>+ Add</button>
                  </div>
                  {tags.length>0
                    ? <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{tags.map(t=><span key={t} className="itag">{t}<button onClick={()=>setTags(p=>p.filter(x=>x!==t))}>×</button></span>)}</div>
                    : <p style={{fontSize:12,color:"#a07840",fontStyle:"italic"}}>No ingredients yet, partner.</p>}
                </div>
              )}
              {mode==="photo" && (
                <div>
                  <p style={{fontSize:13,marginBottom:14,color:"#5a3010",fontStyle:"italic"}}>Snap a picture of yer fridge — our cook'll figure out what's in there.</p>
                  {!preview ? (
                    <div className={`drop-zone${drag?" dov":""}`} style={{padding:"40px 20px",textAlign:"center",borderRadius:2}}
                      onClick={()=>fileRef.current?.click()}
                      onDragOver={e=>{e.preventDefault();setDrag(true)}}
                      onDragLeave={()=>setDrag(false)}
                      onDrop={e=>{e.preventDefault();setDrag(false);handleFile(e.dataTransfer.files[0])}}>
                      <div style={{fontSize:40,marginBottom:10}}>📷</div>
                      <p className="rye" style={{fontSize:15,color:"#8b5a1a",marginBottom:6}}>Drop yer photo here</p>
                      <p style={{fontSize:12,color:"#a07840",fontStyle:"italic"}}>or click to browse</p>
                      <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
                    </div>
                  ) : (
                    <div style={{display:"flex",gap:20,flexWrap:"wrap",alignItems:"flex-start"}}>
                      <div style={{position:"relative"}}>
                        <img src={preview} alt="fridge" style={{width:200,height:160,objectFit:"cover",border:"3px solid #8b5a1a",display:"block"}}/>
                        <button onClick={()=>{setPreview(null);setPhotoIngs([])}} style={{position:"absolute",top:4,right:4,background:"#8b2800",border:"1px solid #f0c060",color:"#f5e6cc",fontSize:12,padding:"2px 8px",cursor:"pointer"}}>✕</button>
                      </div>
                      <div style={{flex:1,minWidth:180}}>
                        {analyzing
                          ? <div style={{display:"flex",alignItems:"center",gap:8,color:"#8b5a1a"}}><svg width="20" height="20" viewBox="0 0 20 20" className="spin"><circle cx="10" cy="10" r="8" stroke="#c9922a" strokeWidth="2.5" fill="none" strokeDasharray="30 10"/></svg><span style={{fontStyle:"italic",fontSize:13}}>Squintin' at yer photo...</span></div>
                          : photoIngs.length>0
                            ? <><p className="sl">Spotted These</p><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{photoIngs.map(i=><span key={i} className="itag">{i}<button onClick={()=>setPhotoIngs(p=>p.filter(x=>x!==i))}>×</button></span>)}</div></>
                            : <p style={{fontSize:13,color:"#8b5a1a",fontStyle:"italic"}}>Couldn't spot any. Try a clearer shot.</p>}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            {ingredients.length>0 && (
              <div style={{borderTop:"1px solid #c9922a",background:"rgba(139,90,26,0.08)",padding:"10px 24px",display:"flex",alignItems:"center",gap:8}}>
                <Star s={14}/>
                <span className="cp" style={{fontSize:12,color:"#8b5a1a",fontWeight:700}}>{ingredients.length} ingredient{ingredients.length!==1?"s":""} rounded up</span>
              </div>
            )}
          </div>

          {/* Step 2 */}
          <div className="parchment" style={{borderRadius:4,overflow:"hidden"}}>
            <div style={{background:"#3d2008",padding:"14px 24px",borderBottom:"2px solid #8b5a1a",display:"flex",alignItems:"center",gap:12}}>
              <Star s={18}/>
              <h2 className="rye" style={{color:"#f0c060",fontSize:18,letterSpacing:"0.06em"}}>Step 2 — Whatcha Hankerin' For?</h2>
              <span style={{marginLeft:"auto",fontFamily:"Courier Prime,monospace",fontSize:11,color:"#8b5a1a"}}>(optional)</span>
            </div>
            <div style={{padding:"20px 24px",display:"flex",flexDirection:"column",gap:20}}>
              <div>
                <p className="sl">Cuisine Type</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {CUISINE_TYPES.map(c=><Pill key={c} label={c} active={cuisineType.includes(c)} onClick={()=>togList(c,setCuisineType)}/>)}
                </div>
              </div>
              <div>
                <p className="sl">Meal Type</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {MEAL_TYPES.map(m=><Pill key={m} label={m} active={mealType.includes(m)} onClick={()=>togList(m,setMealType)}/>)}
                </div>
              </div>
              <div>
                <p className="sl">Dish Type</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {DISH_TYPES.map(d=><Pill key={d} label={d} active={dishType.includes(d)} onClick={()=>togList(d,setDishType)}/>)}
                </div>
              </div>
              <div>
                <p className="sl">Anything Else, Cowpoke?</p>
                <textarea className="fta" placeholder="e.g. need to feed 8, no nuts, quick weeknight dinner..." value={notes} onChange={e=>setNotes(e.target.value)} rows={3}/>
              </div>
            </div>
          </div>

          {err && (
            <div style={{background:"rgba(139,40,0,0.2)",border:"2px solid #8b2800",padding:"12px 20px",textAlign:"center"}}>
              <p className="cp" style={{fontSize:13,color:"#c9501a"}}>⚠ {err}</p>
            </div>
          )}

          <div style={{textAlign:"center"}}>
            <button className="draw-btn" onClick={fetchRecipes} disabled={loading||!ingredients.length}>
              {loading ? "🔥  Heatin' Up the Skillet..." : "🤠  Draw! Rustle Me Some Recipes"}
            </button>
            {!ingredients.length && <p style={{marginTop:8,fontSize:12,color:"#8b5a1a",fontStyle:"italic"}}>Add some ingredients above first, partner.</p>}
          </div>

          {loading && <Campfire/>}

          {recipes.length>0 && (
            <div>
              <div style={{textAlign:"center",marginBottom:20}}>
                <div className="rope" style={{margin:"0 auto 16px",maxWidth:320}}/>
                <h2 className="rye" style={{color:"#f0c060",fontSize:24,letterSpacing:"0.08em",textShadow:"2px 2px 0 rgba(0,0,0,0.6)"}}>✦ Tonight's Grub ✦</h2>
                <p style={{fontSize:13,color:"#c9922a",fontStyle:"italic",marginTop:4}}>{recipes.length} recipes wrangled from the frontier</p>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:20}}>
                {recipes.map((r,i)=><RecipeCard key={r.idMeal} meal={r} idx={i}/>)}
              </div>
              <div style={{marginTop:24,textAlign:"center"}}>
                <button className="draw-btn" onClick={fetchRecipes} style={{fontSize:15,padding:"12px 30px"}}>🔄 Ride Again — New Recipes</button>
              </div>
            </div>
          )}

          <div style={{textAlign:"center",padding:"16px 0",borderTop:"1px solid rgba(139,90,26,0.3)"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:4}}>
              <Star s={14}/><Star s={14}/><Star s={14}/>
            </div>
            <p className="cp" style={{fontSize:11,color:"#5a3a10",letterSpacing:"0.1em"}}>OASIS — EST. ON THE OPEN RANGE</p>
          </div>

        </div>
      </div>
    </div>
  );
}
