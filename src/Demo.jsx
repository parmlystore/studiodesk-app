<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Parmly — Software built for one industry at a time</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Jost:wght@400;500;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  :root{
    --paper: #F3EEE3;
    --paper-raised: #FBF8F1;
    --ink: #2B2822;
    --ink-soft: #6B6456;
    --line: rgba(43,40,34,0.14);

    --moss:      #4F5B3E;
    --cream:     #E7DFCC;
    --terracotta:#B5674A;
    --taupe:     #A6947E;
    --sage:      #7C8C6B;
    --cream2:    #EFE7D6;
    --charcoal:  #2A2823;
    --clay:      #96543D;
  }

  *{box-sizing:border-box; margin:0; padding:0;}
  html{scroll-behavior:smooth;}
  body{
    background:var(--paper);
    color:var(--ink);
    font-family:'Inter', sans-serif;
    -webkit-font-smoothing:antialiased;
    line-height:1.55;
  }
  img,svg{max-width:100%; display:block;}
  a{color:inherit;}

  .eyebrow{
    font-family:'Jost', sans-serif;
    font-size:0.75rem;
    letter-spacing:0.22em;
    text-transform:uppercase;
    color:var(--ink-soft);
  }
  h1,h2{
    font-family:'Fraunces', serif;
    font-weight:500;
    letter-spacing:-0.01em;
    line-height:1.06;
  }
  h1 em, h2 em{font-style:italic; font-weight:500;}

  .wrap{max-width:1180px; margin:0 auto; padding:0 24px;}

  /* ---------- Header ---------- */
  header{
    position:sticky; top:0; z-index:50;
    background:rgba(243,238,227,0.86);
    backdrop-filter:blur(10px);
    border-bottom:1px solid var(--line);
  }
  .nav{
    display:flex; align-items:center; justify-content:space-between;
    padding:22px 24px;
    max-width:1180px; margin:0 auto;
  }
  .logo{
    font-family:'Fraunces', serif;
    font-style:italic;
    font-weight:500;
    font-size:1.45rem;
    letter-spacing:0.01em;
  }
  .logo .dot{color:var(--terracotta); font-style:normal;}
  .nav-links{
    display:flex; gap:32px; align-items:center;
    font-family:'Jost', sans-serif;
    font-size:0.85rem;
    letter-spacing:0.04em;
    text-transform:uppercase;
  }
  .nav-links a{text-decoration:none; color:var(--ink-soft); transition:color .15s;}
  .nav-links a:hover{color:var(--ink);}
  .btn{
    font-family:'Jost', sans-serif;
    font-weight:500;
    font-size:0.82rem;
    letter-spacing:0.06em;
    text-transform:uppercase;
    border:none;
    border-radius:2px;
    padding:13px 26px;
    cursor:pointer;
    text-decoration:none;
    display:inline-flex;
    align-items:center;
    justify-content:center;
    transition:transform .15s ease, background .15s ease, color .15s ease;
  }
  .btn:hover{transform:translateY(-1px);}
  .btn-solid{background:var(--ink); color:var(--paper-raised);}
  .btn-outline{background:transparent; color:var(--ink); border:1px solid var(--line);}

  @media (max-width:720px){ .nav-links{display:none;} }

  /* ---------- Hero ---------- */
  .hero{padding:110px 0 70px; text-align:center;}
  .hero .eyebrow{display:block; margin-bottom:26px;}
  .hero h1{
    font-size:clamp(2.5rem, 6.4vw, 4.8rem);
    max-width:860px;
    margin:0 auto 26px;
  }
  .hero p{
    max-width:500px;
    margin:0 auto 40px;
    color:var(--ink-soft);
    font-size:1.02rem;
  }
  .hero-ctas{display:flex; gap:16px; justify-content:center; flex-wrap:wrap;}

  /* ---------- Directory: flush mosaic ---------- */
  .directory{padding:70px 0 0;}
  .section-head{max-width:620px; margin:0 auto 56px; text-align:center;}
  .section-head .eyebrow{margin-bottom:16px;}
  .section-head h2{font-size:clamp(1.9rem, 3.8vw, 2.7rem); margin-bottom:16px;}
  .section-head p{color:var(--ink-soft); font-size:1rem;}

  .mosaic{
    display:grid;
    grid-template-columns:repeat(3, 1fr);
  }
  @media (max-width:860px){ .mosaic{grid-template-columns:repeat(2,1fr);} }
  @media (max-width:520px){ .mosaic{grid-template-columns:1fr;} }

  .tile{
    position:relative;
    aspect-ratio:1 / 1.05;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    text-align:center;
    padding:30px 22px;
    overflow:hidden;
    opacity:0;
    transform:translateY(16px);
    transition:opacity .6s ease, transform .6s ease;
  }
  .tile.show{opacity:1; transform:translateY(0);}

  /* soft dappled light overlay */
  .tile::before{
    content:"";
    position:absolute; inset:0;
    background:repeating-linear-gradient(
      100deg,
      rgba(255,255,255,0.05) 0px,
      rgba(255,255,255,0.05) 2px,
      transparent 2px,
      transparent 46px
    );
    pointer-events:none;
  }

  .tile .status{
    position:absolute;
    top:18px; right:20px;
    font-family:'Jost', sans-serif;
    font-size:0.62rem;
    letter-spacing:0.14em;
    text-transform:uppercase;
    opacity:0.75;
  }

  .tile .icon{
    width:34px; height:34px;
    margin-bottom:18px;
    opacity:0.9;
  }
  .tile .name{
    font-family:'Fraunces', serif;
    font-weight:500;
    font-size:1.5rem;
    letter-spacing:0.02em;
    margin-bottom:8px;
  }
  .tile .vertical{
    font-family:'Jost', sans-serif;
    font-size:0.68rem;
    letter-spacing:0.16em;
    text-transform:uppercase;
    opacity:0.7;
    margin-bottom:16px;
  }
  .tile .copy{
    font-size:0.86rem;
    max-width:220px;
    opacity:0.85;
    margin-bottom:20px;
  }
  .tile .tile-cta{
    font-family:'Jost', sans-serif;
    font-size:0.72rem;
    letter-spacing:0.1em;
    text-transform:uppercase;
    text-decoration:none;
    border-bottom:1px solid currentColor;
    padding-bottom:2px;
    opacity:0.9;
    transition:opacity .15s ease;
  }
  .tile .tile-cta:hover{opacity:1;}

  .tile.on-light{background:var(--cream); color:var(--ink);}
  .tile.on-light2{background:var(--cream2); color:var(--ink);}
  .tile.on-dark{background:var(--moss); color:var(--paper-raised);}
  .tile.on-terra{background:var(--terracotta); color:var(--paper-raised);}
  .tile.on-taupe{background:var(--taupe); color:var(--ink);}
  .tile.on-sage{background:var(--sage); color:var(--paper-raised);}
  .tile.on-charcoal{background:var(--charcoal); color:var(--paper-raised);}
  .tile.on-clay{background:var(--clay); color:var(--paper-raised);}

  /* ---------- Features ---------- */
  .features{padding:110px 0; border-top:1px solid var(--line); margin-top:0;}
  .feat-grid{display:grid; grid-template-columns:repeat(3,1fr); gap:44px;}
  @media (max-width:820px){ .feat-grid{grid-template-columns:1fr;} }
  .feat-dot{width:8px; height:8px; border-radius:50%; margin-bottom:18px;}
  .feat h3{font-family:'Fraunces', serif; font-weight:500; font-size:1.2rem; margin-bottom:10px;}
  .feat p{color:var(--ink-soft); font-size:0.94rem;}

  /* ---------- CTA band ---------- */
  .cta-band{
    background:var(--moss);
    color:var(--paper-raised);
    margin:0 24px 110px;
    padding:74px 40px;
    text-align:center;
    max-width:1132px;
    margin-left:auto; margin-right:auto;
  }
  .cta-band h2{color:var(--paper-raised); font-size:clamp(1.8rem,3.6vw,2.4rem); margin-bottom:18px;}
  .cta-band p{color:rgba(251,248,241,0.75); max-width:460px; margin:0 auto 32px;}
  .cta-band .btn-solid{background:var(--paper-raised); color:var(--ink);}

  footer{border-top:1px solid var(--line); padding:44px 0 60px;}
  .foot-row{
    display:flex; justify-content:space-between; align-items:center;
    flex-wrap:wrap; gap:14px;
    font-family:'Jost', sans-serif;
    font-size:0.78rem;
    letter-spacing:0.04em;
    color:var(--ink-soft);
  }
</style>
</head>
<body>

<header>
  <div class="nav">
    <div class="logo">Parmly<span class="dot">.</span></div>
    <div class="nav-links">
      <a href="#directory">Products</a>
      <a href="#features">Why Parmly</a>
      <a href="#">Pricing</a>
    </div>
    <a href="https://buy.stripe.com/cNi3cv3pO9W9261b0E6c001" class="btn btn-solid">Get started</a>
  </div>
</header>

<section class="hero">
  <div class="wrap">
    <span class="eyebrow">You do operation, we do management</span>
    <h1>Running a service business?<br><em>There's a Desk</em> for that.</h1>
    <p>One focused booking, client and finance app per industry — nothing bloated, nothing you don't need.</p>
    <div class="hero-ctas">
      <a href="https://buy.stripe.com/cNi3cv3pO9W9261b0E6c001" class="btn btn-solid">Get started</a>
      <a href="#directory" class="btn btn-outline">See all Desks</a>
    </div>
  </div>
</section>

<section class="directory" id="directory">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">The desk directory</span>
      <h2>Find the Desk<br>built for you.</h2>
      <p>Every Desk is built for one type of business — same login, same finance backbone, a workflow shaped for how that trade actually runs.</p>
    </div>
  </div>

  <div class="mosaic" id="mosaic"></div>
</section>

<section class="features" id="features">
  <div class="wrap">
    <div class="feat-grid">
      <div class="feat">
        <div class="feat-dot" style="background:var(--moss)"></div>
        <h3>One price, one Desk</h3>
        <p>Each Desk has a single flat price — no per-seat fees, no hidden tiers. Add another Desk only when your business needs it.</p>
      </div>
      <div class="feat">
        <div class="feat-dot" style="background:var(--terracotta)"></div>
        <h3>Set up in 3 days</h3>
        <p>No lengthy onboarding calls or configuration. Import your clients, pick your calendar, and start taking bookings.</p>
      </div>
      <div class="feat">
        <div class="feat-dot" style="background:var(--sage)"></div>
        <h3>One account, every Desk</h3>
        <p>Your Parmly login carries across every Desk product as you add them — one bill, one client list, no re-signup.</p>
      </div>
    </div>
  </div>
</section>

<div class="cta-band">
  <h2>Find the Desk built for your business.</h2>
  <p>Join the list for your industry and we'll email you the day it opens.</p>
  <a href="https://buy.stripe.com/cNi3cv3pO9W9261b0E6c001" class="btn btn-solid">Get started free</a>
</div>

<footer>
  <div class="wrap foot-row">
    <div>Parmly. — Australia</div>
    <div>© 2026 Parmly Store. All rights reserved.</div>
  </div>
</footer>

<script>
  // minimal thin-line icons, single stroke, matching the editorial reference style
  const icons = {
    lotus: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M20 6c0 10-8 12-8 20a8 8 0 0016 0c0-8-8-10-8-20z"/><path d="M8 20c4 0 6 4 6 8M32 20c-4 0-6 4-6 8"/></svg>`,
    polish: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="16" y="6" width="8" height="5" rx="1"/><path d="M18 11v4M22 11v4"/><path d="M14 15h12l-2 17.5a2 2 0 01-2 1.8h-4a2 2 0 01-2-1.8L14 15z"/></svg>`,
    scissors: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M8 24c6-8 18-8 24 0"/><path d="M14 20l-2-5"/><path d="M20 18v-6"/><path d="M26 20l2-5"/></svg>`,
    dumbbell: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="6" y="15" width="5" height="10" rx="1"/><rect x="29" y="15" width="5" height="10" rx="1"/><path d="M11 20h18"/></svg>`,
    book: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M20 12c-3-2-8-3-12-2v20c4-1 9 0 12 2 3-2 8-3 12-2V10c-4-1-9 0-12 2z"/><path d="M20 12v20"/></svg>`,
    paw: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="14" cy="12" r="2.6"/><circle cx="26" cy="12" r="2.6"/><circle cx="9" cy="19" r="2.4"/><circle cx="31" cy="19" r="2.4"/><path d="M20 20c-5 0-9 4-9 8a5 5 0 009 3 5 5 0 009-3c0-4-4-8-9-8z"/></svg>`,
    spray: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="13" y="17" width="10" height="15" rx="2"/><path d="M17 17v-4h6l3-3M26 8l3 3M28 4l2 2M24 3l1.5 2.5"/></svg>`,
    leaf: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M10 30c0-12 9-20 20-20-1 12-9 20-20 20z"/><path d="M10 30c4-6 9-10 14-13"/></svg>`,
    camera: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="6" y="12" width="28" height="20" rx="3"/><path d="M14 12l3-5h6l3 5"/><circle cx="20" cy="22" r="6"/></svg>`,
  };

  const desks = [
    {name:"StudioDesk", vertical:"Yoga · Pilates · Lagree", copy:"Class scheduling, memberships and studio finances together.", cls:"on-dark", icon:"lotus", status:"Live", cta:"Explore StudioDesk", link:"https://studiodesk.store"},
    {name:"NailDesk", vertical:"Nail salons", copy:"Bookings, clients and finances built for one chair or ten.", cls:"on-light", icon:"polish", status:"Live · Most popular", cta:"Explore NailDesk", link:"https://naildesk.shop"},
    {name:"BeautyDesk", vertical:"Hair & beauty salons", copy:"Chair bookings, client history and payroll, unified.", cls:"on-terra", icon:"scissors", status:"Coming soon", cta:"Notify me"},
    {name:"TrainDesk", vertical:"Personal trainers", copy:"Sessions, packages and payments, all in one calendar.", cls:"on-taupe", icon:"dumbbell", status:"Coming soon", cta:"Notify me"},
    {name:"TutorDesk", vertical:"Tutors", copy:"Lesson bookings, student records and invoicing, simplified.", cls:"on-sage", icon:"book", status:"Coming soon", cta:"Notify me"},
    {name:"PetDesk", vertical:"Groomers & pet care", copy:"Appointments, vaccination records and reminders in one place.", cls:"on-light2", icon:"paw", status:"Coming soon", cta:"Notify me"},
    {name:"CleanDesk", vertical:"Cleaning services", copy:"Job scheduling, routes and client invoicing on the go.", cls:"on-charcoal", icon:"spray", status:"Coming soon", cta:"Notify me"},
    {name:"TherapyDesk", vertical:"Massage & wellness", copy:"Session bookings, intake notes and packages, kept simple.", cls:"on-clay", icon:"leaf", status:"Coming soon", cta:"Notify me"},
    {name:"PhotoDesk", vertical:"Photographers", copy:"Bookings, galleries and client proofing, all in one place.", cls:"on-sage", icon:"camera", status:"Coming soon", cta:"Notify me"},
  ];

  const mosaic = document.getElementById('mosaic');
  desks.forEach(d => {
    const tile = document.createElement('div');
    tile.className = `tile ${d.cls}`;
    tile.innerHTML = `
      <span class="status">${d.status}</span>
      <div class="icon">${icons[d.icon]}</div>
      <div class="name">${d.name}</div>
      <div class="vertical">${d.vertical}</div>
      <p class="copy">${d.copy}</p>
      <a href="${d.link || '#'}" class="tile-cta">${d.cta}</a>
    `;
    mosaic.appendChild(tile);
  });

  const tiles = document.querySelectorAll('.tile');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach((e,i)=>{
      if(e.isIntersecting){
        setTimeout(()=>e.target.classList.add('show'), i*70);
        io.unobserve(e.target);
      }
    });
  }, {threshold:0.15});
  tiles.forEach(t=>io.observe(t));
</script>

</body>
</html>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Parmly — Software built for one industry at a time</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Jost:wght@400;500;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  :root{
    --paper: #F3EEE3;
    --paper-raised: #FBF8F1;
    --ink: #2B2822;
    --ink-soft: #6B6456;
    --line: rgba(43,40,34,0.14);

    --moss:      #4F5B3E;
    --cream:     #E7DFCC;
    --terracotta:#B5674A;
    --taupe:     #A6947E;
    --sage:      #7C8C6B;
    --cream2:    #EFE7D6;
    --charcoal:  #2A2823;
    --clay:      #96543D;
  }

  *{box-sizing:border-box; margin:0; padding:0;}
  html{scroll-behavior:smooth;}
  body{
    background:var(--paper);
    color:var(--ink);
    font-family:'Inter', sans-serif;
    -webkit-font-smoothing:antialiased;
    line-height:1.55;
  }
  img,svg{max-width:100%; display:block;}
  a{color:inherit;}

  .eyebrow{
    font-family:'Jost', sans-serif;
    font-size:0.75rem;
    letter-spacing:0.22em;
    text-transform:uppercase;
    color:var(--ink-soft);
  }
  h1,h2{
    font-family:'Fraunces', serif;
    font-weight:500;
    letter-spacing:-0.01em;
    line-height:1.06;
  }
  h1 em, h2 em{font-style:italic; font-weight:500;}

  .wrap{max-width:1180px; margin:0 auto; padding:0 24px;}

  /* ---------- Header ---------- */
  header{
    position:sticky; top:0; z-index:50;
    background:rgba(243,238,227,0.86);
    backdrop-filter:blur(10px);
    border-bottom:1px solid var(--line);
  }
  .nav{
    display:flex; align-items:center; justify-content:space-between;
    padding:22px 24px;
    max-width:1180px; margin:0 auto;
  }
  .logo{
    font-family:'Fraunces', serif;
    font-style:italic;
    font-weight:500;
    font-size:1.45rem;
    letter-spacing:0.01em;
  }
  .logo .dot{color:var(--terracotta); font-style:normal;}
  .nav-links{
    display:flex; gap:32px; align-items:center;
    font-family:'Jost', sans-serif;
    font-size:0.85rem;
    letter-spacing:0.04em;
    text-transform:uppercase;
  }
  .nav-links a{text-decoration:none; color:var(--ink-soft); transition:color .15s;}
  .nav-links a:hover{color:var(--ink);}
  .btn{
    font-family:'Jost', sans-serif;
    font-weight:500;
    font-size:0.82rem;
    letter-spacing:0.06em;
    text-transform:uppercase;
    border:none;
    border-radius:2px;
    padding:13px 26px;
    cursor:pointer;
    text-decoration:none;
    display:inline-flex;
    align-items:center;
    justify-content:center;
    transition:transform .15s ease, background .15s ease, color .15s ease;
  }
  .btn:hover{transform:translateY(-1px);}
  .btn-solid{background:var(--ink); color:var(--paper-raised);}
  .btn-outline{background:transparent; color:var(--ink); border:1px solid var(--line);}

  @media (max-width:720px){ .nav-links{display:none;} }

  /* ---------- Hero ---------- */
  .hero{padding:110px 0 70px; text-align:center;}
  .hero .eyebrow{display:block; margin-bottom:26px;}
  .hero h1{
    font-size:clamp(2.5rem, 6.4vw, 4.8rem);
    max-width:860px;
    margin:0 auto 26px;
  }
  .hero p{
    max-width:500px;
    margin:0 auto 40px;
    color:var(--ink-soft);
    font-size:1.02rem;
  }
  .hero-ctas{display:flex; gap:16px; justify-content:center; flex-wrap:wrap;}

  /* ---------- Directory: flush mosaic ---------- */
  .directory{padding:70px 0 0;}
  .section-head{max-width:620px; margin:0 auto 56px; text-align:center;}
  .section-head .eyebrow{margin-bottom:16px;}
  .section-head h2{font-size:clamp(1.9rem, 3.8vw, 2.7rem); margin-bottom:16px;}
  .section-head p{color:var(--ink-soft); font-size:1rem;}

  .mosaic{
    display:grid;
    grid-template-columns:repeat(3, 1fr);
  }
  @media (max-width:860px){ .mosaic{grid-template-columns:repeat(2,1fr);} }
  @media (max-width:520px){ .mosaic{grid-template-columns:1fr;} }

  .tile{
    position:relative;
    aspect-ratio:1 / 1.05;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    text-align:center;
    padding:30px 22px;
    overflow:hidden;
    opacity:0;
    transform:translateY(16px);
    transition:opacity .6s ease, transform .6s ease;
  }
  .tile.show{opacity:1; transform:translateY(0);}

  /* soft dappled light overlay */
  .tile::before{
    content:"";
    position:absolute; inset:0;
    background:repeating-linear-gradient(
      100deg,
      rgba(255,255,255,0.05) 0px,
      rgba(255,255,255,0.05) 2px,
      transparent 2px,
      transparent 46px
    );
    pointer-events:none;
  }

  .tile .status{
    position:absolute;
    top:18px; right:20px;
    font-family:'Jost', sans-serif;
    font-size:0.62rem;
    letter-spacing:0.14em;
    text-transform:uppercase;
    opacity:0.75;
  }

  .tile .icon{
    width:34px; height:34px;
    margin-bottom:18px;
    opacity:0.9;
  }
  .tile .name{
    font-family:'Fraunces', serif;
    font-weight:500;
    font-size:1.5rem;
    letter-spacing:0.02em;
    margin-bottom:8px;
  }
  .tile .vertical{
    font-family:'Jost', sans-serif;
    font-size:0.68rem;
    letter-spacing:0.16em;
    text-transform:uppercase;
    opacity:0.7;
    margin-bottom:16px;
  }
  .tile .copy{
    font-size:0.86rem;
    max-width:220px;
    opacity:0.85;
    margin-bottom:20px;
  }
  .tile .tile-cta{
    font-family:'Jost', sans-serif;
    font-size:0.72rem;
    letter-spacing:0.1em;
    text-transform:uppercase;
    text-decoration:none;
    border-bottom:1px solid currentColor;
    padding-bottom:2px;
    opacity:0.9;
    transition:opacity .15s ease;
  }
  .tile .tile-cta:hover{opacity:1;}

  .tile.on-light{background:var(--cream); color:var(--ink);}
  .tile.on-light2{background:var(--cream2); color:var(--ink);}
  .tile.on-dark{background:var(--moss); color:var(--paper-raised);}
  .tile.on-terra{background:var(--terracotta); color:var(--paper-raised);}
  .tile.on-taupe{background:var(--taupe); color:var(--ink);}
  .tile.on-sage{background:var(--sage); color:var(--paper-raised);}
  .tile.on-charcoal{background:var(--charcoal); color:var(--paper-raised);}
  .tile.on-clay{background:var(--clay); color:var(--paper-raised);}

  /* ---------- Features ---------- */
  .features{padding:110px 0; border-top:1px solid var(--line); margin-top:0;}
  .feat-grid{display:grid; grid-template-columns:repeat(3,1fr); gap:44px;}
  @media (max-width:820px){ .feat-grid{grid-template-columns:1fr;} }
  .feat-dot{width:8px; height:8px; border-radius:50%; margin-bottom:18px;}
  .feat h3{font-family:'Fraunces', serif; font-weight:500; font-size:1.2rem; margin-bottom:10px;}
  .feat p{color:var(--ink-soft); font-size:0.94rem;}

  /* ---------- CTA band ---------- */
  .cta-band{
    background:var(--moss);
    color:var(--paper-raised);
    margin:0 24px 110px;
    padding:74px 40px;
    text-align:center;
    max-width:1132px;
    margin-left:auto; margin-right:auto;
  }
  .cta-band h2{color:var(--paper-raised); font-size:clamp(1.8rem,3.6vw,2.4rem); margin-bottom:18px;}
  .cta-band p{color:rgba(251,248,241,0.75); max-width:460px; margin:0 auto 32px;}
  .cta-band .btn-solid{background:var(--paper-raised); color:var(--ink);}

  footer{border-top:1px solid var(--line); padding:44px 0 60px;}
  .foot-row{
    display:flex; justify-content:space-between; align-items:center;
    flex-wrap:wrap; gap:14px;
    font-family:'Jost', sans-serif;
    font-size:0.78rem;
    letter-spacing:0.04em;
    color:var(--ink-soft);
  }
</style>
</head>
<body>

<header>
  <div class="nav">
    <div class="logo">Parmly<span class="dot">.</span></div>
    <div class="nav-links">
      <a href="#directory">Products</a>
      <a href="#features">Why Parmly</a>
      <a href="#">Pricing</a>
    </div>
    <a href="https://buy.stripe.com/cNi3cv3pO9W9261b0E6c001" class="btn btn-solid">Get started</a>
  </div>
</header>

<section class="hero">
  <div class="wrap">
    <span class="eyebrow">You do operation, we do management</span>
    <h1>Running a service business?<br><em>There's a Desk</em> for that.</h1>
    <p>One focused booking, client and finance app per industry — nothing bloated, nothing you don't need.</p>
    <div class="hero-ctas">
      <a href="https://buy.stripe.com/cNi3cv3pO9W9261b0E6c001" class="btn btn-solid">Get started</a>
      <a href="#directory" class="btn btn-outline">See all Desks</a>
    </div>
  </div>
</section>

<section class="directory" id="directory">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">The desk directory</span>
      <h2>Find the Desk<br>built for you.</h2>
      <p>Every Desk is built for one type of business — same login, same finance backbone, a workflow shaped for how that trade actually runs.</p>
    </div>
  </div>

  <div class="mosaic" id="mosaic"></div>
</section>

<section class="features" id="features">
  <div class="wrap">
    <div class="feat-grid">
      <div class="feat">
        <div class="feat-dot" style="background:var(--moss)"></div>
        <h3>One price, one Desk</h3>
        <p>Each Desk has a single flat price — no per-seat fees, no hidden tiers. Add another Desk only when your business needs it.</p>
      </div>
      <div class="feat">
        <div class="feat-dot" style="background:var(--terracotta)"></div>
        <h3>Set up in 3 days</h3>
        <p>No lengthy onboarding calls or configuration. Import your clients, pick your calendar, and start taking bookings.</p>
      </div>
      <div class="feat">
        <div class="feat-dot" style="background:var(--sage)"></div>
        <h3>One account, every Desk</h3>
        <p>Your Parmly login carries across every Desk product as you add them — one bill, one client list, no re-signup.</p>
      </div>
    </div>
  </div>
</section>

<div class="cta-band">
  <h2>Find the Desk built for your business.</h2>
  <p>Join the list for your industry and we'll email you the day it opens.</p>
  <a href="https://buy.stripe.com/cNi3cv3pO9W9261b0E6c001" class="btn btn-solid">Get started free</a>
</div>

<footer>
  <div class="wrap foot-row">
    <div>Parmly. — Australia</div>
    <div>© 2026 Parmly Store. All rights reserved.</div>
  </div>
</footer>

<script>
  // minimal thin-line icons, single stroke, matching the editorial reference style
  const icons = {
    lotus: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M20 6c0 10-8 12-8 20a8 8 0 0016 0c0-8-8-10-8-20z"/><path d="M8 20c4 0 6 4 6 8M32 20c-4 0-6 4-6 8"/></svg>`,
    polish: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="16" y="6" width="8" height="5" rx="1"/><path d="M18 11v4M22 11v4"/><path d="M14 15h12l-2 17.5a2 2 0 01-2 1.8h-4a2 2 0 01-2-1.8L14 15z"/></svg>`,
    scissors: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M8 24c6-8 18-8 24 0"/><path d="M14 20l-2-5"/><path d="M20 18v-6"/><path d="M26 20l2-5"/></svg>`,
    dumbbell: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="6" y="15" width="5" height="10" rx="1"/><rect x="29" y="15" width="5" height="10" rx="1"/><path d="M11 20h18"/></svg>`,
    book: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M20 12c-3-2-8-3-12-2v20c4-1 9 0 12 2 3-2 8-3 12-2V10c-4-1-9 0-12 2z"/><path d="M20 12v20"/></svg>`,
    paw: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="14" cy="12" r="2.6"/><circle cx="26" cy="12" r="2.6"/><circle cx="9" cy="19" r="2.4"/><circle cx="31" cy="19" r="2.4"/><path d="M20 20c-5 0-9 4-9 8a5 5 0 009 3 5 5 0 009-3c0-4-4-8-9-8z"/></svg>`,
    spray: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="13" y="17" width="10" height="15" rx="2"/><path d="M17 17v-4h6l3-3M26 8l3 3M28 4l2 2M24 3l1.5 2.5"/></svg>`,
    leaf: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M10 30c0-12 9-20 20-20-1 12-9 20-20 20z"/><path d="M10 30c4-6 9-10 14-13"/></svg>`,
    camera: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="6" y="12" width="28" height="20" rx="3"/><path d="M14 12l3-5h6l3 5"/><circle cx="20" cy="22" r="6"/></svg>`,
  };

  const desks = [
    {name:"StudioDesk", vertical:"Yoga · Pilates · Lagree", copy:"Class scheduling, memberships and studio finances together.", cls:"on-dark", icon:"lotus", status:"Live", cta:"Explore StudioDesk", link:"https://studiodesk.store"},
    {name:"NailDesk", vertical:"Nail salons", copy:"Bookings, clients and finances built for one chair or ten.", cls:"on-light", icon:"polish", status:"Live · Most popular", cta:"Explore NailDesk", link:"https://naildesk.shop"},
    {name:"BeautyDesk", vertical:"Hair & beauty salons", copy:"Chair bookings, client history and payroll, unified.", cls:"on-terra", icon:"scissors", status:"Coming soon", cta:"Notify me"},
    {name:"TrainDesk", vertical:"Personal trainers", copy:"Sessions, packages and payments, all in one calendar.", cls:"on-taupe", icon:"dumbbell", status:"Coming soon", cta:"Notify me"},
    {name:"TutorDesk", vertical:"Tutors", copy:"Lesson bookings, student records and invoicing, simplified.", cls:"on-sage", icon:"book", status:"Coming soon", cta:"Notify me"},
    {name:"PetDesk", vertical:"Groomers & pet care", copy:"Appointments, vaccination records and reminders in one place.", cls:"on-light2", icon:"paw", status:"Coming soon", cta:"Notify me"},
    {name:"CleanDesk", vertical:"Cleaning services", copy:"Job scheduling, routes and client invoicing on the go.", cls:"on-charcoal", icon:"spray", status:"Coming soon", cta:"Notify me"},
    {name:"TherapyDesk", vertical:"Massage & wellness", copy:"Session bookings, intake notes and packages, kept simple.", cls:"on-clay", icon:"leaf", status:"Coming soon", cta:"Notify me"},
    {name:"PhotoDesk", vertical:"Photographers", copy:"Bookings, galleries and client proofing, all in one place.", cls:"on-sage", icon:"camera", status:"Coming soon", cta:"Notify me"},
  ];

  const mosaic = document.getElementById('mosaic');
  desks.forEach(d => {
    const tile = document.createElement('div');
    tile.className = `tile ${d.cls}`;
    tile.innerHTML = `
      <span class="status">${d.status}</span>
      <div class="icon">${icons[d.icon]}</div>
      <div class="name">${d.name}</div>
      <div class="vertical">${d.vertical}</div>
      <p class="copy">${d.copy}</p>
      <a href="${d.link || '#'}" class="tile-cta">${d.cta}</a>
    `;
    mosaic.appendChild(tile);
  });

  const tiles = document.querySelectorAll('.tile');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach((e,i)=>{
      if(e.isIntersecting){
        setTimeout(()=>e.target.classList.add('show'), i*70);
        io.unobserve(e.target);
      }
    });
  }, {threshold:0.15});
  tiles.forEach(t=>io.observe(t));
</script>

</body>
</html>
