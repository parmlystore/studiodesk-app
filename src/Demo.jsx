import React, { useState } from 'react';

const NAV = [
  { key: 'overview', label: 'Dashboard' },
  { key: 'bookings', label: 'Bookings' },
  { key: 'clients', label: 'Clients' },
  { key: 'finance', label: 'Income & Expenses' },
  { key: 'pricelist', label: 'Price list' },
  { key: 'todo', label: 'To-do' },
  { key: 'stock', label: 'Stock' },
  { key: 'support', label: 'Support' },
  { key: 'bookingsettings', label: 'Booking Settings', pro: true },
];

export default function Demo({ plan = 'pro' }) {
  const [page, setPage] = useState('overview');
  const navItems = NAV.filter(item => !item.pro || plan === 'pro');

  return (
    <div>
      <div className="demo-topbanner">
        StudioDesk Demo — Sample data only.{' '}
        <a href="https://studiodesk.store/#pricing" style={{color:'#fff', textDecoration:'underline'}}>Get your own →</a>
      </div>
      <div className="app">
        <nav className="sidebar">
          <div className="brand">StudioDesk<span style={{color:'var(--plum)'}}>.</span></div>
          <span className="brand-sub">Willow &amp; Vine Studio</span>
          {navItems.map(item => (
            <div key={item.key} className={'nav-item' + (page === item.key ? ' active' : '')} onClick={() => setPage(item.key)}>
              <span className="nav-dot"></span>{item.label}
            </div>
          ))}
        </nav>
        <div className="main">
          {page === 'overview' && <Overview />}
          {page === 'bookings' && <BookingsDemo plan={plan} />}
          {page === 'clients' && <ClientsDemo />}
          {page === 'finance' && <FinanceDemo />}
          {page === 'pricelist' && <PriceListDemo />}
          {page === 'todo' && <TodoDemo />}
          {page === 'stock' && <StockDemo />}
          {page === 'support' && <SupportDemo />}
          {page === 'bookingsettings' && <BookingSettingsDemo />}
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
  const [rows, setRows] = useState([
    { name: 'Priya Nair', phone: '0412 345 678', lastVisit: '2 days ago', notes: 'Prefers back-row mat spot' },
    { name: 'Marcus Ito', phone: '0433 210 998', lastVisit: 'Today', notes: 'Knee injury — avoid deep lunges' },
    { name: 'Sana Aziz', phone: '0401 776 234', lastVisit: '1 week ago', notes: '10-class pack, 3 remaining' },
    { name: 'Bea Thornton', phone: '0455 129 887', lastVisit: '3 weeks ago', notes: 'Pregnant — modified poses only' },
  ]);
  const [editIdx, setEditIdx] = useState(null);
  const [editRow, setEditRow] = useState({ name:'', phone:'', lastVisit:'', notes:'' });
  const [showAdd, setShowAdd] = useState(false);
  const [newRow, setNewRow] = useState({ name:'', phone:'', lastVisit:'', notes:'' });

  function startEdit(i) {
    setEditIdx(i); setEditRow({ ...rows[i] });
  }
  function saveEdit(i) {
    const r = [...rows]; r[i] = editRow; setRows(r); setEditIdx(null);
  }
  function removeRow(i) {
    setRows(rows.filter((_, idx) => idx !== i));
    if (editIdx === i) setEditIdx(null);
  }
  function addRow() {
    if (!newRow.name) return;
    setRows([...rows, newRow]);
    setNewRow({ name:'', phone:'', lastVisit:'', notes:'' });
    setShowAdd(false);
  }

  return (
    <>
      <div className="page-head"><span className="eyebrow">Clients</span><h1>Every client, one record</h1></div>
      <div className="toolbar"><button className="btn btn-solid" onClick={() => setShowAdd(true)}>+ Add client</button></div>
      {showAdd && (
        <div className="manual-form">
          <div className="two-col">
            <div className="field"><label>Name</label><input value={newRow.name} onChange={e=>setNewRow({...newRow, name:e.target.value})} placeholder="e.g. Alex Chen" /></div>
            <div className="field"><label>Phone</label><input value={newRow.phone} onChange={e=>setNewRow({...newRow, phone:e.target.value})} /></div>
          </div>
          <div className="two-col">
            <div className="field"><label>Last visit</label><input value={newRow.lastVisit} onChange={e=>setNewRow({...newRow, lastVisit:e.target.value})} placeholder="e.g. Today" /></div>
            <div className="field"><label>Notes</label><input value={newRow.notes} onChange={e=>setNewRow({...newRow, notes:e.target.value})} /></div>
          </div>
          <div className="bk-row" style={{marginTop:14}}>
            <button className="btn btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
            <button className="btn btn-solid" disabled={!newRow.name} onClick={addRow}>Add client</button>
          </div>
        </div>
      )}
      <div className="table-wrap">
        <table>
          <thead><tr><th>Name</th><th>Phone</th><th>Last visit</th><th>Notes</th><th></th></tr></thead>
          <tbody>
            {rows.map((r,i) => (
              <tr key={i}>
                {editing && editIdx === i ? (
                  <>
                    <td data-label="Name"><input className="row-edit-input" value={editRow.name} onChange={e=>setEditRow({...editRow, name:e.target.value})} /></td>
                    <td data-label="Phone"><input className="row-edit-input" value={editRow.phone} onChange={e=>setEditRow({...editRow, phone:e.target.value})} /></td>
                    <td data-label="Last visit"><input className="row-edit-input" value={editRow.lastVisit} onChange={e=>setEditRow({...editRow, lastVisit:e.target.value})} /></td>
                    <td data-label="Notes"><input className="row-edit-input" value={editRow.notes} onChange={e=>setEditRow({...editRow, notes:e.target.value})} /></td>
                    <td className="row-actions">
                      <button className="icon-btn" onClick={() => saveEdit(i)} title="Save">✓</button>
                      <button className="icon-btn" onClick={() => setEditIdx(null)} title="Cancel">✕</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td data-label="Name">{r.name}</td>
                    <td data-label="Phone" style={{whiteSpace:'nowrap'}}>{r.phone}</td>                    <td data-label="Phone">{r.phone}</td>
                    <td data-label="Last visit">{r.lastVisit}</td>
                    <td data-label="Notes">{r.notes}</td>
                    <td className="row-actions">
                      <button className="icon-btn" onClick={() => startEdit(i)} title="Edit">✎</button>
                      <button className="icon-btn" onClick={() => removeRow(i)} title="Delete">🗑</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
  const [editIdx, setEditIdx] = useState(null);
  const [editDesc, setEditDesc] = useState('');
  const [editAmt, setEditAmt] = useState('');
  const [filterStart, setFilterStart] = useState('');
  const [filterEnd, setFilterEnd] = useState('');

  function parseRowDate(dateStr) {
    if (dateStr === 'Today') return new Date();
    const d = new Date(dateStr + ', 2026');
    return isNaN(d) ? null : d;
  }

  const filteredRows = rows
    .map((r, i) => ({ ...r, _idx: i }))
    .filter(r => {
      if (!filterStart && !filterEnd) return true;
      const d = parseRowDate(r.date);
      if (!d) return true;
      if (filterStart && d < new Date(filterStart)) return false;
      if (filterEnd && d > new Date(filterEnd)) return false;
      return true;
    });
  const total = filteredRows.reduce((s, t) => s + t.amt, 0);

  function add() {
    if (!desc || !amt) return;
    const val = type === 'expense' ? -Math.abs(Number(amt)) : Math.abs(Number(amt));
    setRows([...rows, { date: 'Today', desc, amt: val }]);
    setDesc(''); setAmt('');
  }
  function startEdit(i) {
    setEditIdx(i); setEditDesc(rows[i].desc); setEditAmt(String(Math.abs(rows[i].amt)));
  }
  function saveEdit(i) {
    const sign = rows[i].amt < 0 ? -1 : 1;
    const r = [...rows];
    r[i] = { ...r[i], desc: editDesc, amt: sign * Math.abs(Number(editAmt) || 0) };
    setRows(r); setEditIdx(null);
  }
  function remove(i) {
    setRows(rows.filter((_, idx) => idx !== i));
    if (editIdx === i) setEditIdx(null);
  }
  function exportCSV() {
    const header = ['Date','Description','Amount'];
    const csvRows = [header, ...filteredRows.map(r => [r.date, r.desc, r.amt])];
    const csv = csvRows.map(row => row.map(cell => '"' + String(cell).replace(/"/g,'""') + '"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'income-expenses.csv';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
      <div className="inline-form" style={{marginTop:10}}>
        <label style={{fontSize:'0.8rem', color:'var(--body-soft)'}}>From</label>
        <input type="date" value={filterStart} onChange={e=>setFilterStart(e.target.value)} />
        <label style={{fontSize:'0.8rem', color:'var(--body-soft)'}}>To</label>
        <input type="date" value={filterEnd} onChange={e=>setFilterEnd(e.target.value)} />
        {(filterStart || filterEnd) && <button className="btn btn-outline" onClick={() => { setFilterStart(''); setFilterEnd(''); }}>Clear filter</button>}
        <button className="btn btn-outline" onClick={exportCSV}>Export CSV</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Date</th><th>Description</th><th>Amount</th><th></th></tr></thead>
          <tbody>
            {filteredRows.map((r) => (
              <tr key={r._idx}>
                <td data-label="Date">{r.date}</td>
                <td data-label="Description">
                  {editIdx === r._idx
                    ? <input className="row-edit-input" value={editDesc} onChange={e=>setEditDesc(e.target.value)} />
                    : r.desc}
                </td>
                <td data-label="Amount" className={r.amt >= 0 ? 'amt-in' : 'amt-out'}>
                  {editIdx === r._idx
                    ? <input className="row-edit-input row-edit-amt" type="number" value={editAmt} onChange={e=>setEditAmt(e.target.value)} />
                    : (r.amt >= 0 ? '+' : '−') + '$' + Math.abs(r.amt)}
                </td>
                <td className="row-actions">
                  {editIdx === r._idx ? (
                    <>
                      <button className="icon-btn" onClick={() => saveEdit(r._idx)} title="Save">✓</button>
                      <button className="icon-btn" onClick={() => setEditIdx(null)} title="Cancel">✕</button>
                    </>
                  ) : (
                    <>
                      <button className="icon-btn" onClick={() => startEdit(r._idx)} title="Edit">✎</button>
                      <button className="icon-btn" onClick={() => remove(r._idx)} title="Delete">🗑</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="stat-grid" style={{marginTop:18, marginBottom:0}}>
        <div className="stat"><div className="num">${total}</div><div className="lbl">Net total</div></div>
      </div>
    </>
  );
}

function PriceListDemo() {
  const [services, setServices] = useState([
    { name: 'Vinyasa Flow Yoga', meta: '60 min', price: 28 },
    { name: 'Reformer Pilates', meta: '50 min', price: 35 },
    { name: 'Lagree Sculpt', meta: '45 min', price: 32 },
    { name: '5-Class Pack', meta: 'valid 8 weeks', price: 125 },
    { name: '10-Class Pack', meta: 'valid 12 weeks', price: 230 },
    { name: 'Unlimited Monthly', meta: 'billed monthly', price: 189 },
  ]);
  const [editing, setEditing] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [editName, setEditName] = useState('');
  const [editMeta, setEditMeta] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newMeta, setNewMeta] = useState('');
  const [newPrice, setNewPrice] = useState('');

  function toggleEditing() {
    if (editing) { setEditIdx(null); setShowAdd(false); }
    setEditing(!editing);
  }
  function startEdit(i) {
    setEditIdx(i); setEditName(services[i].name); setEditMeta(services[i].meta); setEditPrice(String(services[i].price));
  }
  function saveEdit(i) {
    const s = [...services];
    s[i] = { name: editName || s[i].name, meta: editMeta, price: Number(editPrice) || s[i].price };
    setServices(s); setEditIdx(null);
  }
  function removeItem(i) {
    setServices(services.filter((_, idx) => idx !== i));
    if (editIdx === i) setEditIdx(null);
  }
  function addItem() {
    if (!newName || !newPrice) return;
    setServices([...services, { name: newName, meta: newMeta, price: Number(newPrice) }]);
    setNewName(''); setNewMeta(''); setNewPrice(''); setShowAdd(false);
  }

  return (
    <>
      <div className="page-head"><span className="eyebrow">Price list</span><h1>Your classes &amp; packages</h1></div>
      <div className="toolbar" style={{display:'flex', gap:10}}>
        <button className="btn btn-outline" onClick={() => window.print()}>Print price list</button>
        <button className="btn btn-outline" onClick={toggleEditing}>{editing ? 'Done' : 'Edit'}</button>
        {editing && <button className="btn btn-solid" onClick={() => setShowAdd(true)}>+ Add item</button>}
      </div>
      {editing && showAdd && (
        <div className="manual-form">
          <div className="two-col">
            <div className="field"><label>Name</label><input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="e.g. Barre Sculpt" /></div>
            <div className="field"><label>Details</label><input value={newMeta} onChange={e=>setNewMeta(e.target.value)} placeholder="e.g. 45 min" /></div>
          </div>
          <div className="field" style={{maxWidth:160}}><label>Price ($)</label><input type="number" value={newPrice} onChange={e=>setNewPrice(e.target.value)} /></div>
          <div className="bk-row" style={{marginTop:14}}>
            <button className="btn btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
            <button className="btn btn-solid" disabled={!newName||!newPrice} onClick={addItem}>Add item</button>
          </div>
        </div>
      )}
      <div className="price-sheet">
        <h2 style={{fontFamily:'var(--fd)', fontStyle:'italic', marginBottom:20}}>Willow &amp; Vine Studio</h2>
        {services.map((s,i) => (
          <div className="price-row" key={i}>
            {editing && editIdx === i ? (
              <>
                <div style={{flex:1, display:'flex', gap:10, flexWrap:'wrap'}}>
                  <input className="row-edit-input" value={editName} onChange={e=>setEditName(e.target.value)} style={{maxWidth:200}} />
                  <input className="row-edit-input" value={editMeta} onChange={e=>setEditMeta(e.target.value)} style={{maxWidth:160}} />
                  <input className="row-edit-input" type="number" value={editPrice} onChange={e=>setEditPrice(e.target.value)} style={{maxWidth:90}} />
                </div>
                <div className="row-actions">
                  <button className="icon-btn" onClick={() => saveEdit(i)} title="Save">✓</button>
                  <button className="icon-btn" onClick={() => setEditIdx(null)} title="Cancel">✕</button>
                </div>
              </>
            ) : (
              <>
                <div><div className="pname">{s.name}</div><span className="pmeta">{s.meta}</span></div>
                <div style={{display:'flex', alignItems:'center', gap:10}}>
                  <div className="pval">${s.price}</div>
                  {editing && (
                    <div className="row-actions">
                      <button className="icon-btn" onClick={() => startEdit(i)} title="Edit">✎</button>
                      <button className="icon-btn" onClick={() => removeItem(i)} title="Delete">🗑</button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
        {services.length === 0 && <p className="sub">No items yet.</p>}
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
  const sortedRows = rows
    .map((r, i) => ({ ...r, _idx: i }))
    .sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1));
  return (
    <>
      <div className="page-head"><span className="eyebrow">To-do</span><h1>The small stuff, tracked</h1></div>
      <div className="inline-form">
        <input type="text" placeholder="Add a task" value={text} onChange={e => setText(e.target.value)} />
        <button className="btn btn-solid" onClick={add}>Add task</button>
      </div>
      <div className="todo-list">
        {sortedRows.map((r) => (
          <div className={'todo-item' + (r.done ? ' done' : '')} key={r._idx}>
            <input type="checkbox" checked={r.done} onChange={() => toggle(r._idx)} /><span>{r.text}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function StockDemo() {
  const initial = [
    { name: 'Yoga mats', qty: 12, reorder: 5 },
    { name: 'Cork blocks', qty: 3, reorder: 5 },
    { name: 'Bolsters', qty: 8, reorder: 4 },
    { name: 'Lavender candles', qty: 2, reorder: 6 },
    { name: 'Herbal tea sachets', qty: 40, reorder: 20 },
  ];
  const [rows, setRows] = useState(initial);
  function setQty(i, val) {
    const n = Math.max(0, Number(val) || 0);
    const r = [...rows]; r[i] = { ...r[i], qty: n }; setRows(r);
  }
  return (
    <>
      <div className="page-head"><span className="eyebrow">Stock</span><h1>Know what's running low</h1></div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Item</th><th>On hand</th><th>Reorder at</th><th>Status</th></tr></thead>
          <tbody>
            {rows.map((r,i) => {
              const low = r.qty <= r.reorder;
              return (
                <tr key={i}>
                  <td data-label="Item">{r.name}</td>
                  <td data-label="On hand">
                    <input
                      className="qty-input"
                      type="number"
                      min="0"
                      value={r.qty}
                      onChange={e => setQty(i, e.target.value)}
                    />
                  </td>
                  <td data-label="Reorder at">{r.reorder}</td>
                  <td data-label="Status"><span className={'tag ' + (low ? 'low' : 'ok')}>{low ? 'Low' : 'OK'}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function SupportDemo() {
  const cpaTopics = ['ABN Registration','GST Registration','Payroll Setup','Bookkeeping System Setup','BAS Lodgement','Income Tax Return','Other question'];
  const itTopics = ['Website or booking link issue','Payment / Stripe issue','Login or account access','Data backup question','Other question'];
  const [tab, setTab] = useState('business');
  const [topic, setTopic] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [details, setDetails] = useState('');
  const [sent, setSent] = useState(false);
  const topics = tab === 'business' ? cpaTopics : itTopics;
  function submit() {
    const subject = (tab === 'business' ? 'Business Support' : 'IT Support') + ' — ' + name;
    const body = 'Name: ' + name + '\nEmail: ' + email + '\nPhone: ' + phone + '\nTopic: ' + topic + '\n\nDetails: ' + details;
    window.location.href = 'mailto:account@ollieconsult.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    setSent(true);
  }
  return (
    <>
      <div className="page-head"><span className="eyebrow">Support</span><h1>Get help</h1></div>
      <div className="inline-form">
        <button className={tab === 'business' ? 'btn btn-solid' : 'btn btn-outline'} onClick={() => { setTab('business'); setTopic(''); }}>Business Support</button>
        <button className={tab === 'it' ? 'btn btn-solid' : 'btn btn-outline'} onClick={() => { setTab('it'); setTopic(''); }}>IT Support</button>
      </div>
      <p style={{fontSize:'0.85rem', color:'var(--body-soft)', margin:'14px 0'}}>We can refer you to a registered professional for registration, bookkeeping, payroll, or tax support. Select what you need below.</p>
      <div className="inline-form">
        <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
        <input type="email" placeholder="Your email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="tel" placeholder="Your phone" value={phone} onChange={e => setPhone(e.target.value)} />
      </div>
      <div style={{marginTop:20, marginBottom:16}}>
        <div className="eyebrow" style={{marginBottom:10}}>What do you need help with?</div>
        {topics.map(t => (
          <div key={t} onClick={() => setTopic(t)} style={{padding:'12px 14px', borderRadius:6, border: topic===t ? '1.5px solid var(--plum)' : '1px solid var(--hairline)', background: topic===t ? 'var(--warn-bg)' : 'transparent', marginBottom:8, cursor:'pointer', fontSize:'0.85rem'}}>{t}</div>
        ))}
      </div>
      <textarea placeholder="Additional details (optional)" value={details} onChange={e => setDetails(e.target.value)} style={{width:'100%', minHeight:90, padding:12, borderRadius:6, border:'1px solid var(--hairline)', fontFamily:'inherit', fontSize:'0.9rem', marginBottom:18}} />
      {sent
        ? <p style={{color:'var(--plum)', fontWeight:500}}>Thanks — we'll be in touch!</p>
        : <button className="btn btn-solid" onClick={submit} disabled={!name || !email || !topic}>Send Request →</button>}
    </>
  );
}

function BookingSettingsDemo() {
  const [slotLength, setSlotLength] = useState('1hr');
  const [blocked, setBlocked] = useState([
    { date: '2026-07-25', note: 'Studio closed' },
  ]);
  const [depositOn, setDepositOn] = useState(true);
  const [depositAmt, setDepositAmt] = useState('15');
  const [acctName, setAcctName] = useState('Willow & Vine Studio');
  const [bsb, setBsb] = useState('062-000');
  const [acctNo, setAcctNo] = useState('1234 5678');
  const [message, setMessage] = useState('Please transfer your deposit within 24 hours to secure your booking.');
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [newBlockDate, setNewBlockDate] = useState('');
  const [newBlockNote, setNewBlockNote] = useState('Studio closed');

  function removeBlocked(i) {
    setBlocked(blocked.filter((_, idx) => idx !== i));
  }
  function confirmAddBlocked() {
    if (!newBlockDate) return;
    setBlocked([...blocked, { date: newBlockDate, note: newBlockNote || 'Studio closed' }]);
    setNewBlockDate('');
    setNewBlockNote('Studio closed');
    setShowAddBlock(false);
  }
  function formatDate(iso) {
    const d = new Date(iso + 'T00:00:00');
    if (isNaN(d)) return iso;
    return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  return (
    <>
      <div className="page-head"><span className="eyebrow">Booking Settings</span><h1>Configure how clients book</h1></div>

      <div className="settings-card">
        <div className="settings-card-head">⏱ Time slot length</div>
        <div className="slot-options">
          {['15m','30m','45m','1hr','1h30'].map(opt => (
            <button
              key={opt}
              className={'slot-pill' + (slotLength === opt ? ' selected' : '')}
              onClick={() => setSlotLength(opt)}
            >{opt}</button>
          ))}
        </div>
      </div>

      <div className="settings-card">
        <div className="settings-card-head-row">
          <span className="settings-card-head">🚫 Blocked dates</span>
          <button className="btn btn-solid btn-sm" onClick={() => setShowAddBlock(true)}>+ Block</button>
        </div>
        {showAddBlock && (
          <div className="manual-form" style={{marginBottom:16}}>
            <div className="two-col">
              <div className="field">
                <label>Date</label>
                <input type="date" value={newBlockDate} onChange={e=>setNewBlockDate(e.target.value)} />
              </div>
              <div className="field">
                <label>Reason (optional)</label>
                <input type="text" value={newBlockNote} onChange={e=>setNewBlockNote(e.target.value)} placeholder="e.g. Studio closed" />
              </div>
            </div>
            <div className="bk-row" style={{marginTop:14}}>
              <button className="btn btn-outline" onClick={() => { setShowAddBlock(false); setNewBlockDate(''); }}>Cancel</button>
              <button className="btn btn-solid" disabled={!newBlockDate} onClick={confirmAddBlocked}>Add blocked date</button>
            </div>
          </div>
        )}
        {blocked.map((b,i) => (
          <div className="blocked-row" key={i}>
            <div><strong>{formatDate(b.date)}</strong><div className="blocked-note">{b.note}</div></div>
            <button className="icon-btn" onClick={() => removeBlocked(i)} title="Remove">✕</button>
          </div>
        ))}
        {blocked.length === 0 && <p className="sub" style={{margin:0}}>No blocked dates.</p>}
      </div>

      <div className="settings-card">
        <div className="settings-card-head">💰 Deposit &amp; bank details</div>
        <label className="toggle-row">
          <span className={'toggle-switch' + (depositOn ? ' on' : '')} onClick={() => setDepositOn(!depositOn)}>
            <span className="toggle-knob"></span>
          </span>
          Request a deposit
        </label>
        {depositOn && (
          <div className="settings-fields">
            <div className="field">
              <label>Deposit amount ($)</label>
              <input value={depositAmt} onChange={e=>setDepositAmt(e.target.value)} type="number" />
            </div>
            <div className="field">
              <label>Account name</label>
              <input value={acctName} onChange={e=>setAcctName(e.target.value)} />
            </div>
            <div className="two-col">
              <div className="field">
                <label>BSB</label>
                <input value={bsb} onChange={e=>setBsb(e.target.value)} />
              </div>
              <div className="field">
                <label>Account No.</label>
                <input value={acctNo} onChange={e=>setAcctNo(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label>Custom message</label>
              <textarea rows="2" value={message} onChange={e=>setMessage(e.target.value)} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function BookingsDemo({ plan = 'pro' }) {
  const services = [
    { name: 'Vinyasa Flow Yoga', meta: '60 min · with Anya', price: 28, duration: 60 },
    { name: 'Reformer Pilates', meta: '50 min · with Marcus', price: 35, duration: 50 },
    { name: 'Lagree Sculpt', meta: '45 min · with Bea', price: 32, duration: 45 },
  ];

  const days = ['Mon 29','Tue 30','Wed 1','Thu 2','Fri 3','Sat 4','Sun 5'];
  const initialAppts = [
    [
      { time: '7:00am', duration: 60, client: 'Priya Nair', service: 'Vinyasa Flow Yoga', price: 28, tag: 'online' },
      { time: '5:30pm', duration: 50, client: 'Bea Thornton', service: 'Reformer Pilates', price: 35, tag: 'online' },
    ],
    [
      { time: '9:00am', duration: 45, client: 'Sana Aziz', service: 'Lagree Sculpt', price: 32, tag: 'manual' },
    ],
    [
      { time: '9:00am', duration: 60, client: 'Priya Nair', service: 'Vinyasa Flow Yoga', price: 28, tag: 'online' },
      { time: '11:00am', duration: 50, client: 'Marcus Ito', service: 'Reformer Pilates', price: 35, tag: 'online' },
      { time: '2:00pm', duration: 45, client: 'Sana Aziz', service: 'Lagree Sculpt', price: 32, tag: 'manual' },
    ],
    [
      { time: '7:00am', duration: 60, client: 'Bea Thornton', service: 'Vinyasa Flow Yoga', price: 28, tag: 'online' },
    ],
    [],
    [
      { time: '8:00am', duration: 45, client: 'Marcus Ito', service: 'Lagree Sculpt', price: 32, tag: 'online' },
    ],
    [],
  ];

  const [dayIdx, setDayIdx] = useState(() => { const d = new Date().getDay(); return d === 0 ? 6 : d - 1; });
  const [apptsByDay, setApptsByDay] = useState(initialAppts);
  const [showManual, setShowManual] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [mName, setMName] = useState('');
  const [mService, setMService] = useState(0);
  const [mTime, setMTime] = useState('');

  function addManual() {
    if (!mName || !mTime) return;
    const svc = services[mService];
    const updated = [...apptsByDay];
    updated[dayIdx] = [...updated[dayIdx], {
      time: mTime, duration: svc.duration, client: mName, service: svc.name, price: svc.price, tag: 'manual',
    }];
    setApptsByDay(updated);
    setMName(''); setMTime(''); setShowManual(false);
  }

  const dayAppts = apptsByDay[dayIdx];

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Bookings</span>
        <h1>Appointments</h1>
      </div>

      {plan === 'pro' && (
        <div className="bk-mgmt-toolbar">
          <button className="btn btn-outline" onClick={() => setShowPreview(true)}>🔗 Booking Link</button>
        </div>
      )}

      <div className="bk-day-strip">
        {days.map((d,i) => {
          const [wd, num] = d.split(' ');
          const count = apptsByDay[i].length;
          return (
            <div key={i} className={'bk-day-chip' + (dayIdx===i?' selected':'')} onClick={() => setDayIdx(i)}>
              <div className="d">{wd}</div>
              <div className="n">{num}</div>
              {count > 0 && <div className="c">{count}</div>}
            </div>
          );
        })}
      </div>

      <div className="bk-mgmt-headrow">
        <h3>{days[dayIdx]} · {dayAppts.length} appointment{dayAppts.length===1?'':'s'}</h3>
        <button className="btn btn-solid" onClick={() => setShowManual(true)}>+ Manual</button>
      </div>

      {showManual && (
        <div className="manual-form">
          <div className="field">
            <label>Client name</label>
            <input value={mName} onChange={e=>setMName(e.target.value)} placeholder="e.g. Alex Chen" />
          </div>
          <div className="two-col">
            <div className="field">
              <label>Service</label>
              <select value={mService} onChange={e=>setMService(Number(e.target.value))}>
                {services.map((s,i)=><option key={i} value={i}>{s.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Time</label>
              <input value={mTime} onChange={e=>setMTime(e.target.value)} placeholder="e.g. 3:00pm" />
            </div>
          </div>
          <div className="bk-row" style={{marginTop:14}}>
            <button className="btn btn-outline" onClick={() => setShowManual(false)}>Cancel</button>
            <button className="btn btn-solid" onClick={addManual}>Add appointment</button>
          </div>
        </div>
      )}

      <div className="appt-list">
        {dayAppts.length === 0 && <p className="sub">No appointments booked for this day.</p>}
        {dayAppts.map((a,i) => (
          <div className="appt-card" key={i}>
            <div className="appt-time">
              <div className="t">{a.time}</div>
              <div className="dur">{a.duration}min</div>
            </div>
            <div className="appt-main">
              <div className="appt-client">{a.client}</div>
              <div className="appt-service">{a.service}</div>
              {plan === 'pro'
                ? <span className={'tag appt-tag ' + a.tag}>{a.tag === 'online' ? '🔗 Online' : '✎ Manual'}</span>
                : <span className="tag appt-tag manual">✎ Manual</span>}
            </div>
            <div className="appt-price">${a.price}</div>
          </div>
        ))}
      </div>

      {plan === 'pro' && showPreview && (
        <div className="preview-overlay" onClick={() => setShowPreview(false)}>
          <div className="preview-panel" onClick={e => e.stopPropagation()}>
            <div className="preview-panel-head">
              <span>Public booking link preview</span>
              <button className="icon-btn" onClick={() => setShowPreview(false)}>✕</button>
            </div>
            <div className="preview-panel-body">
              <PublicBookingPreview services={services} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function PublicBookingPreview({ services }) {
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
    <div className="bk-shell bk-shell-inline">
      <div className="bk-topbar">
        <div className="bk-steps">
          {['Class','Time','Details','Confirmed'].map((label,i) => {
            const n = i+1;
            return (
              <div key={label} className={'bk-step-pill' + (n===step?' active':'') + (n<step?' done':'')}>
                <span className="n">{n<step?'✓':n}</span>{label}
              </div>
            );
          })}
        </div>
      </div>
      <div className="bk-body">
        {step === 1 && (
          <section>
            <span className="eyebrow">Step 1 of 4</span>
            <h2 className="bk-h1">Pick a class</h2>
            <div className="bk-services">
              {services.map((s,i) => (
                <div key={i} className={'bk-svc' + (service===i?' selected':'')} onClick={() => setService(i)}>
                  <div><div className="bk-svc-name">{s.name}</div><div className="bk-svc-meta">{s.meta}</div></div>
                  <div className="bk-svc-price">${s.price}</div>
                </div>
              ))}
            </div>
            <div className="bk-row"><span></span><button className="btn btn-solid" disabled={service===null} onClick={() => setStep(2)}>Continue</button></div>
          </section>
        )}
        {step === 2 && (
          <section>
            <span className="eyebrow">Step 2 of 4</span>
            <h2 className="bk-h1">Pick a time</h2>
            <div className="bk-date-strip">
              {dates.map((d,i) => (
                <div key={i} className={'bk-date-chip' + (dateIdx===i?' selected':'')} onClick={() => { setDateIdx(i); setSlot(null); }}>
                  <div className="d">{dateLabels[i]}</div><div className="n">{d.split(' ')[1]}</div>
                </div>
              ))}
            </div>
            <div className="bk-slot-grid">
              {slotsByDate[dateIdx].map((t,i) => {
                const isFull = (fullSlots[dateIdx]||[]).includes(i);
                return (
                  <div key={t} className={'bk-slot' + (isFull?' full':'') + (slot===t?' selected':'')} onClick={() => !isFull && setSlot(t)}>
                    {t}{isFull ? ' · Full' : ''}
                  </div>
                );
              })}
            </div>
            <div className="bk-row">
              <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
              <button className="btn btn-solid" disabled={!slot} onClick={() => setStep(3)}>Continue</button>
            </div>
          </section>
        )}
        {step === 3 && (
          <section>
            <span className="eyebrow">Step 3 of 4</span>
            <h2 className="bk-h1">Confirm your details</h2>
            <div className="bk-field"><label>Full name</label><input value={name} onChange={e=>setName(e.target.value)} /></div>
            <div className="bk-field"><label>Mobile</label><input value={phone} onChange={e=>setPhone(e.target.value)} /></div>
            <div className="bk-field"><label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} /></div>
            <div className="bk-deposit"><strong>Deposit — $15</strong>Transfer to Willow &amp; Vine Studio · BSB 062-000 · Acc 1234 5678.</div>
            <div className="bk-row">
              <button className="btn btn-outline" onClick={() => setStep(2)}>← Back</button>
              <button className="btn btn-solid" disabled={!name||!phone||!email} onClick={() => setStep(4)}>Confirm booking</button>
            </div>
          </section>
        )}
        {step === 4 && (
          <section style={{textAlign:'center'}}>
            <div className="bk-check">✓</div>
            <span className="eyebrow">Step 4 of 4</span>
            <h2 className="bk-h1">Booking confirmed</h2>
            <div className="bk-confirm-card">
              <div className="cline"><span>Class</span><span>{services[service].name}</span></div>
              <div className="cline"><span>When</span><span>{dates[dateIdx]}, {slot}</span></div>
              <div className="cline"><span>Client</span><span>{name}</span></div>
            </div>
            <div className="bk-row" style={{justifyContent:'center'}}>
              <button className="btn btn-outline" onClick={() => { setStep(1); setService(null); setSlot(null); setName(''); setPhone(''); setEmail(''); }}>Start again</button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
