import React, { useState } from 'react';

const NAV = [
  { key: 'overview', label: 'Dashboard' },
  { key: 'booking', label: 'Booking page' },
  { key: 'clients', label: 'Clients' },
  { key: 'finance', label: 'Income & Expenses' },
  { key: 'pricelist', label: 'Price list' },
  { key: 'todo', label: 'To-do' },
  { key: 'stock', label: 'Stock' },
];

export default function Demo() {
  const [page, setPage] = useState('overview');

  return (
    <div>
      <div className="demo-topbanner">
        StudioDesk Demo — Sample data only.{' '}
        <a href="https://studiodesk.store" style={{color:'#fff', textDecoration:'underline'}}>Get your own →</a>
      </div>
      <div className="app">
        <nav className="sidebar">
          <div className="brand">StudioDesk<span style={{color:'var(--plum)'}}>.</span></div>
          <span className="brand-sub">Willow &amp; Vine Studio</span>
          {NAV.map(item => (
            <div key={item.key} className={'nav-item' + (page === item.key ? ' active' : '')} onClick={() => setPage(item.key)}>
              <span className="nav-dot"></span>{item.label}
            </div>
          ))}
        </nav>
        <div className="main">
          {page === 'overview' && <Overview />}
          {page === 'booking' && <BookingDemo />}
          {page === 'clients' && <ClientsDemo />}
          {page === 'finance' && <FinanceDemo />}
          {page === 'pricelist' && <PriceListDemo />}
          {page === 'todo' && <TodoDemo />}
          {page === 'stock' && <StockDemo />}
          <div className="demo-footnote">StudioDesk Demo · studiodesk.store · Data resets on refresh</div>
        </div>
      </div>
    </div>
  );
}

function Overview() {
  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Overview</span>
        <h1>Good morning, Willow &amp; Vine.</h1>
        <p className="sub">Everything about your studio in one place.</p>
      </div>
      <div className="stat-grid">
        <div className="stat"><div className="num">6</div><div className="lbl">Bookings today</div></div>
        <div className="stat"><div className="num">$3,240</div><div className="lbl">Income this month</div></div>
        <div className="stat"><div className="num">2</div><div className="lbl">Low stock items</div></div>
        <div className="stat"><div className="num">3</div><div className="lbl">Open to-dos</div></div>
      </div>
      <div className="activity">
        <div className="row"><span>New booking — Reformer Pilates, 5:30pm</span><span>2 min ago</span></div>
        <div className="row"><span>Deposit received — Priya Nair, $15</span><span>38 min ago</span></div>
        <div className="row"><span>Client note added — Marcus (knee injury)</span><span>Today, 9:12am</span></div>
        <div className="row"><span>Stock low — Lavender candles (2 left)</span><span>Yesterday</span></div>
      </div>
    </>
  );
}

function ClientsDemo() {
  const rows = [
    ['Priya Nair', '0412 345 678', '2 days ago', 'Prefers back-row mat spot'],
    ['Marcus Ito', '0433 210 998', 'Today', 'Knee injury — avoid deep lunges'],
    ['Sana Aziz', '0401 776 234', '1 week ago', '10-class pack, 3 remaining'],
    ['Bea Thornton', '0455 129 887', '3 weeks ago', 'Pregnant — modified poses only'],
  ];
  return (
    <>
      <div className="page-head"><span className="eyebrow">Clients</span><h1>Every client, one record</h1></div>
      <table>
        <thead><tr><th>Name</th><th>Phone</th><th>Last visit</th><th>Notes</th></tr></thead>
        <tbody>{rows.map((r,i) => <tr key={i}>{r.map((c,j)=><td key={j}>{c}</td>)}</tr>)}</tbody>
      </table>
    </>
  );
}

function FinanceDemo() {
  const initial = [
    { date: 'Jul 1', desc: 'Rent', amt: -1800 },
    { date: 'Jul 3', desc: '5-Class Pack sold — Sana Aziz', amt: 125 },
    { date: 'Jul 5', desc: 'Cleaning supplies', amt: -64 },
    { date: 'Jul 8', desc: 'Unlimited Monthly — Marcus Ito', amt: 189 },
    { date: 'Jul 12', desc: 'Instructor pay — Anya', amt: -780 },
  ];
  const [rows, setRows] = useState(initial);
  const [type, setType] = useState('income');
  const [desc, setDesc] = useState('');
  const [amt, setAmt] = useState('');
  const total = rows.reduce((s, t) => s + t.amt, 0);
  function add() {
    if (!desc || !amt) return;
    const val = type === 'expense' ? -Math.abs(Number(amt)) : Math.abs(Number(amt));
    setRows([...rows, { date: 'Today', desc, amt: val }]);
    setDesc(''); setAmt('');
  }
  return (
    <>
      <div className="page-head"><span className="eyebrow">Income &amp; Expenses</span><h1>See your real profit</h1></div>
      <div className="inline-form">
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="income">Income</option><option value="expense">Expense</option>
        </select>
        <input type="text" placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />
        <input type="number" placeholder="Amount" value={amt} onChange={e => setAmt(e.target.value)} style={{maxWidth:120}} />
        <button className="btn btn-solid" onClick={add}>Add entry</button>
      </div>
      <table>
        <thead><tr><th>Date</th><th>Description</th><th>Amount</th></tr></thead>
        <tbody>
          {rows.map((r,i) => (
            <tr key={i}><td>{r.date}</td><td>{r.desc}</td>
              <td className={r.amt >= 0 ? 'amt-in' : 'amt-out'}>{r.amt >= 0 ? '+' : '−'}${Math.abs(r.amt)}</td></tr>
          ))}
        </tbody>
      </table>
      <div className="stat-grid" style={{marginTop:18, marginBottom:0}}>
        <div className="stat"><div className="num">${total}</div><div className="lbl">Net total</div></div>
      </div>
    </>
  );
}

function PriceListDemo() {
  const services = [
    { name: 'Vinyasa Flow Yoga', meta: '60 min', price: 28 },
    { name: 'Reformer Pilates', meta: '50 min', price: 35 },
    { name: 'Lagree Sculpt', meta: '45 min', price: 32 },
    { name: '5-Class Pack', meta: 'valid 8 weeks', price: 125 },
    { name: '10-Class Pack', meta: 'valid 12 weeks', price: 230 },
    { name: 'Unlimited Monthly', meta: 'billed monthly', price: 189 },
  ];
  return (
    <>
      <div className="page-head"><span className="eyebrow">Price list</span><h1>Your classes &amp; packages</h1></div>
      <div className="toolbar"><button className="btn btn-outline" onClick={() => window.print()}>Print price list</button></div>
      <div className="price-sheet">
        <h2 style={{fontFamily:'var(--fd)', fontStyle:'italic', marginBottom:20}}>Willow &amp; Vine Studio</h2>
        {services.map((s,i) => (
          <div className="price-row" key={i}>
            <div><div className="pname">{s.name}</div><span className="pmeta">{s.meta}</span></div>
            <div className="pval">${s.price}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function TodoDemo() {
  const [rows, setRows] = useState([
    { text: 'Restock lavender candles', done: false },
    { text: 'Confirm Thursday sub-instructor', done: false },
    { text: 'Post the new class schedule', done: true },
    { text: 'Email late-cancellation client', done: false },
  ]);
  const [text, setText] = useState('');
  function add() { if (!text) return; setRows([...rows, { text, done: false }]); setText(''); }
  function toggle(i) { const r = [...rows]; r[i].done = !r[i].done; setRows(r); }
  return (
    <>
      <div className="page-head"><span className="eyebrow">To-do</span><h1>The small stuff, tracked</h1></div>
      <div className="inline-form">
        <input type="text" placeholder="Add a task" value={text} onChange={e => setText(e.target.value)} />
        <button className="btn btn-solid" onClick={add}>Add task</button>
      </div>
      <div className="todo-list">
        {rows.map((r,i) => (
          <div className={'todo-item' + (r.done ? ' done' : '')} key={i}>
            <input type="checkbox" checked={r.done} onChange={() => toggle(i)} /><span>{r.text}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function StockDemo() {
  const rows = [
    ['Yoga mats', 12, 5, 'ok'],
    ['Cork blocks', 3, 5, 'low'],
    ['Bolsters', 8, 4, 'ok'],
    ['Lavender candles', 2, 6, 'low'],
    ['Herbal tea sachets', 40, 20, 'ok'],
  ];
  return (
    <>
      <div className="page-head"><span className="eyebrow">Stock</span><h1>Know what's running low</h1></div>
      <table>
        <thead><tr><th>Item</th><th>On hand</th><th>Reorder at</th><th>Status</th></tr></thead>
        <tbody>
          {rows.map((r,i) => (
            <tr key={i}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td>
              <td><span className={'tag ' + r[3]}>{r[3] === 'low' ? 'Low' : 'OK'}</span></td></tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function BookingDemo() {
  const services = [
    { name: 'Vinyasa Flow Yoga', meta: '60 min · with Anya', price: 28 },
    { name: 'Reformer Pilates', meta: '50 min · with Marcus', price: 35 },
    { name: 'Lagree Sculpt', meta: '45 min · with Bea', price: 32 },
  ];
  const dates = ['Mon 20','Tue 21','Wed 22','Thu 23','Fri 24'];
  const dateLabels = ['MON','TUE','WED','THU','FRI'];
  const slotsByDate = [
    ['7:00am','8:15am','12:00pm','5:30pm','6:45pm'],
    ['7:00am','9:00am','5:30pm','6:45pm'],
    ['8:15am','12:00pm','5:30pm','6:45pm','7:45pm'],
    ['7:00am','8:15am','5:30pm'],
    ['7:00am','9:00am','12:00pm','5:30pm','6:45pm'],
  ];
  const fullSlots = { 0:[2], 1:[1], 2:[0,3], 3:[2], 4:[1,4] };

  const [step, setStep] = useState(1);
  const [service, setService] = useState(null);
  const [dateIdx, setDateIdx] = useState(0);
  const [slot, setSlot] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Public booking link</span>
        <h1>What your clients see</h1>
        <p className="sub">This is the exact page your clients use to book a class online — try it below.</p>
      </div>
      <div className="bf-shell">
        <div className="bf-topbar">
          <div className="bf-steps">
            {['Class','Time','Details','Confirmed'].map((label,i) => {
              const n = i+1;
              return (
                <div key={label} className={'bf-step-pill' + (n===step?' active':'') + (n<step?' done':'')}>
                  <span className="n">{n<step?'✓':n}</span>{label}
                </div>
              );
            })}
          </div>
        </div>
        <div className="bf-body">
          {step === 1 && (
            <section>
              <span className="eyebrow">Step 1 of 4</span>
              <h2 className="bf-h1">Pick a class</h2>
              <div className="bf-services">
                {services.map((s,i) => (
                  <div key={i} className={'bf-svc' + (service===i?' selected':'')} onClick={() => setService(i)}>
                    <div><div className="bf-svc-name">{s.name}</div><div className="bf-svc-meta">{s.meta}</div></div>
                    <div className="bf-svc-price">${s.price}</div>
                  </div>
                ))}
              </div>
              <div className="bf-row"><span></span><button className="btn btn-solid" disabled={service===null} onClick={() => setStep(2)}>Continue</button></div>
            </section>
          )}
          {step === 2 && (
            <section>
              <span className="eyebrow">Step 2 of 4</span>
              <h2 className="bf-h1">Pick a time</h2>
              <div className="bf-date-strip">
                {dates.map((d,i) => (
                  <div key={i} className={'bf-date-chip' + (dateIdx===i?' selected':'')} onClick={() => { setDateIdx(i); setSlot(null); }}>
                    <div className="d">{dateLabels[i]}</div><div className="n">{d.split(' ')[1]}</div>
                  </div>
                ))}
              </div>
              <div className="bf-slot-grid">
                {slotsByDate[dateIdx].map((t,i) => {
                  const isFull = (fullSlots[dateIdx]||[]).includes(i);
                  return (
                    <div key={t} className={'bf-slot' + (isFull?' full':'') + (slot===t?' selected':'')} onClick={() => !isFull && setSlot(t)}>
                      {t}{isFull ? ' · Full' : ''}
                    </div>
                  );
                })}
              </div>
              <div className="bf-row">
                <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                <button className="btn btn-solid" disabled={!slot} onClick={() => setStep(3)}>Continue</button>
              </div>
            </section>
          )}
          {step === 3 && (
            <section>
              <span className="eyebrow">Step 3 of 4</span>
              <h2 className="bf-h1">Confirm your details</h2>
              <div className="bf-field"><label>Full name</label><input value={name} onChange={e=>setName(e.target.value)} /></div>
              <div className="bf-field"><label>Mobile</label><input value={phone} onChange={e=>setPhone(e.target.value)} /></div>
              <div className="bf-field"><label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} /></div>
              <div className="bf-deposit"><strong>Deposit — $15</strong>Transfer to Willow &amp; Vine Studio · BSB 062-000 · Acc 1234 5678.</div>
              <div className="bf-row">
                <button className="btn btn-outline" onClick={() => setStep(2)}>← Back</button>
                <button className="btn btn-solid" disabled={!name||!phone||!email} onClick={() => setStep(4)}>Confirm booking</button>
              </div>
            </section>
          )}
          {step === 4 && (
            <section style={{textAlign:'center'}}>
              <div className="bf-check">✓</div>
              <span className="eyebrow">Step 4 of 4</span>
              <h2 className="bf-h1">Booking confirmed</h2>
              <div className="bf-confirm-card">
                <div className="cline"><span>Class</span><span>{services[service].name}</span></div>
                <div className="cline"><span>When</span><span>{dates[dateIdx]}, {slot}</span></div>
                <div className="cline"><span>Client</span><span>{name}</span></div>
              </div>
              <div className="bf-row" style={{justifyContent:'center'}}>
                <button className="btn btn-outline" onClick={() => { setStep(1); setService(null); setSlot(null); setName(''); setPhone(''); setEmail(''); }}>Start again</button>
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
