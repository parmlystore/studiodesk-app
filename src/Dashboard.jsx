import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient.js';

const NAV = [
{ key: 'overview', label: 'Dashboard' },
{ key: 'bookings', label: 'Bookings' },
{ key: 'clients', label: 'Clients' },
{ key: 'finance', label: 'Income & Expenses' },
{ key: 'pricelist', label: 'Price list' },
{ key: 'todo', label: 'To-do' },
{ key: 'stock', label: 'Stock' },
{ key: 'branding', label: 'Branding' },
];

const PLANS = [
{ key: 'basic', label: 'Basic', price: '$399', blurb: 'Full studio management app. Clients, finances, price list. Manual calendar entry.' },
{ key: 'pro', label: 'Pro', price: '$799', blurb: 'Everything in Basic, plus 24/7 online booking, email confirmations and deposit handling.' },
{ key: 'studio', label: 'Studio', price: '$1,299', blurb: 'Everything in Pro, plus custom branding, business setup, payroll & super, and tax/BAS support.' },
];

export default function Dashboard({ session }) {
const [page, setPage] = useState('overview');
const [studio, setStudio] = useState(null);
const [loadingStudio, setLoadingStudio] = useState(true);

useEffect(() => {
(async () => {
const { data } = await supabase.from('studios').select('*').eq('owner_email', session.user.email).maybeSingle();
setStudio(data);
setLoadingStudio(false);
})();
}, [session]);

useEffect(() => {
if (studio) document.title = studio.name + ' · Dashboard';
}, [studio]);

if (loadingStudio) return <div className="main">Loading…</div>;

if (!studio) {
return <Onboarding session={session} onCreated={setStudio} />;
}

if (!studio.unlocked) {
const checkoutStatus = new URLSearchParams(window.location.search).get('checkout');
return <Locked studio={studio} onUpdate={setStudio} checkoutStatus={checkoutStatus} />;
}

return (
<div className="app">
<nav className="sidebar">
{studio.logo_url ? (
<img src={studio.logo_url} alt={studio.name} className="brand-logo" />
) : (
<div className="brand">{studio.name}<span style={{color:'var(--plum)'}}>.</span></div>
)}
<span className="brand-sub">Powered by StudioDesk</span>
{NAV.map(item => (
<div key={item.key} className={'nav-item' + (page === item.key ? ' active' : '')} onClick={() => setPage(item.key)}>
<span className="nav-dot"></span>{item.label}
</div>
))}
<div className="nav-item logout-item" onClick={() => supabase.auth.signOut()}>
<span className="nav-dot"></span>Sign out
</div>
</nav>
<div className="main">
{page === 'overview' && <Overview studio={studio} />}
{page === 'bookings' && <Bookings studio={studio} />}
{page === 'clients' && <Clients studio={studio} />}
{page === 'finance' && <Finance studio={studio} />}
{page === 'pricelist' && <PriceList studio={studio} />}
{page === 'todo' && <Todo studio={studio} />}
{page === 'stock' && <Stock studio={studio} />}
{page === 'branding' && <Branding studio={studio} onUpdate={setStudio} />}
</div>
</div>
);
}

function Onboarding({ session, onCreated }) {
const [name, setName] = useState('');
const [slug, setSlug] = useState('');
const [error, setError] = useState('');
const [saving, setSaving] = useState(false);

async function create(e) {
e.preventDefault();
setSaving(true);
setError('');
const { data, error } = await supabase.from('studios').insert({
name,
owner_email: session.user.email,
booking_slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
}).select().single();
if (error) {
setError(error.message.includes('duplicate') ? 'That booking link is already taken — try another.' : error.message);
setSaving(false);
return;
}
await supabase.from('booking_settings').insert({ studio_id: data.id });
onCreated(data);
setSaving(false);
}

return (
<div className="login-shell">
<div className="login-card">
<div className="login-brand">Set up your studio</div>
<p className="sub center" style={{margin:'0 0 24px'}}>Just the basics — you can change everything later.</p>
<form onSubmit={create}>
<div className="field"><label>Studio name</label><input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Willow & Vine Studio" required /></div>
<div className="field"><label>Booking link</label><input value={slug} onChange={e => setSlug(e.target.value)} placeholder="e.g. willow-vine" required /></div>
{error && <div className="error-msg">{error}</div>}
<button className="btn btn-solid" type="submit" style={{width:'100%', justifyContent:'center'}} disabled={saving}>{saving ? 'Creating…' : 'Create studio'}</button>
</form>
</div>
</div>
);
}

function Locked({ studio, onUpdate, checkoutStatus }) {
const [selectedTier, setSelectedTier] = useState(studio.tier || 'pro');
const [redirecting, setRedirecting] = useState(false);
const [error, setError] = useState('');
const [confirming, setConfirming] = useState(checkoutStatus === 'success');

useEffect(() => {
if (checkoutStatus !== 'success') return;
let attempts = 0;
const interval = setInterval(async () => {
attempts += 1;
const { data } = await supabase.from('studios').select('*').eq('id', studio.id).maybeSingle();
if (data?.unlocked) {
clearInterval(interval);
onUpdate(data);
} else if (attempts >= 10) {
clearInterval(interval);
setConfirming(false);
}
}, 2000);
return () => clearInterval(interval);
}, [checkoutStatus, studio.id, onUpdate]);

async function goToCheckout() {
setRedirecting(true);
setError('');
try {
const res = await fetch('/api/create-checkout-session', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ studioId: studio.id, tier: selectedTier, ownerEmail: studio.owner_email }),
});
const data = await res.json();
if (!res.ok || !data.url) {
setError('Something went wrong starting checkout — please try again.');
setRedirecting(false);
return;
}
window.location.href = data.url;
} catch (e) {
setError('Something went wrong starting checkout — please try again.');
setRedirecting(false);
}
}

if (confirming) {
return (
<div className="login-shell">
<div className="login-card center">
<div className="login-brand">StudioDesk<span style={{color:'var(--plum)'}}>.</span></div>
<p className="sub" style={{margin:'16px 0 0'}}>Confirming your payment…</p>
</div>
</div>
);
}

return (
<div className="login-shell">
<div className="login-card" style={{maxWidth:640}}>
<div className="login-brand">{studio.name}<span style={{color:'var(--plum)'}}>.</span></div>
<p className="sub center" style={{margin:'8px 0 28px'}}>Pick a plan to unlock your dashboard.</p>
{checkoutStatus === 'cancelled' && <div className="error-msg" style={{marginBottom:16}}>Payment was cancelled — pick a plan below to try again.</div>}
<div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:12, marginBottom:24}}>
{PLANS.map(p => (
<div key={p.key} onClick={() => setSelectedTier(p.key)}
style={{
border: selectedTier === p.key ? '2px solid var(--plum)' : '1px solid var(--hairline-strong)',
borderRadius:6, padding:16, cursor:'pointer', background: selectedTier === p.key ? 'var(--band-light)' : 'transparent',
}}>
<div style={{fontFamily:'var(--font-label)', fontSize:'0.72rem', letterSpacing:'0.06em', textTransform:'uppercase', color:'var(--body-soft)'}}>{p.label}</div>
<div style={{fontFamily:'var(--font-display)', fontWeight:500, fontSize:'1.6rem', margin:'6px 0'}}>{p.price}</div>
<div style={{fontSize:'0.8rem', color:'var(--body-soft)', lineHeight:1.5}}>{p.blurb}</div>
</div>
))}
</div>
{error && <div className="error-msg">{error}</div>}
<button className="btn btn-solid" style={{width:'100%', justifyContent:'center'}} onClick={goToCheckout} disabled={redirecting}>
{redirecting ? 'Redirecting to payment…' : `Continue to payment — ${PLANS.find(p => p.key === selectedTier)?.price}`}
</button>
<div style={{textAlign:'center', marginTop:16}}>
<span className="nav-item logout-item" style={{display:'inline', cursor:'pointer'}} onClick={() => supabase.auth.signOut()}>Sign out</span>
</div>
</div>
</div>
);
}

function Branding({ studio, onUpdate }) {
const [name, setName] = useState(studio.name || '');
const [logoUrl, setLogoUrl] = useState(studio.logo_url || '');
const [saving, setSaving] = useState(false);
const [saved, setSaved] = useState(false);
const [error, setError] = useState('');

async function save(e) {
e.preventDefault();
setSaving(true);
setSaved(false);
setError('');
const { data, error } = await supabase.from('studios').update({ name, logo_url: logoUrl || null }).eq('id', studio.id).select().single();
setSaving(false);
if (error) { setError(error.message); return; }
onUpdate(data);
setSaved(true);
}

return (
<>
<div className="page-head">
<span className="eyebrow">Branding</span>
<h1>Make it yours</h1>
<p className="sub">Your name and logo appear on your dashboard and on your public booking page.</p>
</div>
<div className="settings-card" style={{maxWidth:480}}>
<form onSubmit={save}>
<div className="field">
<label>Studio name</label>
<input value={name} onChange={e => setName(e.target.value)} required />
</div>
<div className="field">
<label>Logo URL (optional)</label>
<input value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="https://... (paste a hosted image link)" />
</div>
{logoUrl && (
<div style={{margin:'6px 0 20px'}}>
<span className="brand-sub" style={{display:'block', marginBottom:8}}>Preview</span>
<img src={logoUrl} alt="Logo preview" style={{maxHeight:60, maxWidth:220, objectFit:'contain'}} />
</div>
)}
{error && <div className="error-msg">{error}</div>}
<button className="btn btn-solid" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save branding'}</button>
{saved && <span style={{marginLeft:12, color:'var(--plum)', fontSize:'0.85rem'}}>Saved ✓</span>}
</form>
</div>
</>
);
}

function Overview({ studio }) {
const [stats, setStats] = useState({ todayBookings: 0, monthIncome: 0, lowStock: 0, openTodos: 0 });
const [recent, setRecent] = useState([]);
useEffect(() => {
(async () => {
const today = new Date().toISOString().slice(0, 10);
const monthStart = new Date(); monthStart.setDate(1);
const [{ count: todayBookings }, { data: tx }, { data: stock }, { count: openTodos }, { data: appts }] = await Promise.all([
supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('studio_id', studio.id).eq('appointment_date', today),
supabase.from('transactions').select('type, amount').eq('studio_id', studio.id).gte('created_at', monthStart.toISOString()),
supabase.from('stock_items').select('id').eq('studio_id', studio.id).lte('qty', 0),
supabase.from('todos').select('id', { count: 'exact', head: true }).eq('studio_id', studio.id).eq('done', false),
supabase.from('appointments').select('service_name, appointment_date, appointment_time, created_at').eq('studio_id', studio.id).order('created_at', { ascending: false }).limit(5),
]);
const monthIncome = (tx || []).reduce((sum, t) => sum + (t.type === 'income' ? Number(t.amount) : -Number(t.amount)), 0);
setStats({ todayBookings: todayBookings || 0, monthIncome, lowStock: (stock || []).length, openTodos: openTodos || 0 });
setRecent(appts || []);
})();
}, [studio]);

const hour = new Date().getHours();
const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

return (
<>
<div className="page-head">
<span className="eyebrow">Overview</span>
<h1>{greeting}, {studio.name}.</h1>
<p className="sub">Everything about your studio in one place.</p>
</div>
<div className="stat-grid">
<div className="stat"><div className="num">{stats.todayBookings}</div><div className="lbl">Bookings today</div></div>
<div className="stat"><div className="num">$" + "{stats.monthIncome.toFixed(0)}</div><div className="lbl">Net this month</div></div>
<div className="stat"><div className="num">{stats.lowStock}</div><div className="lbl">Low stock items</div></div>
<div className="stat"><div className="num">{stats.openTodos}</div><div className="lbl">Open to-dos</div></div>
</div>
<div className="activity">
{recent.map((a, i) => (
<div className="row" key={i}><span>{a.service_name} — {a.appointment_date} {a.appointment_time}</span><span>booked</span></div>
))}
{recent.length === 0 && <div className="row"><span>No bookings yet</span><span></span></div>}
</div>
</>
);
}

function Bookings({ studio }) {
const [rows, setRows] = useState([]);
useEffect(() => {
(async () => {
const { data } = await supabase.from('appointments').select('*').eq('studio_id', studio.id).order('appointment_date', { ascending: false }).order('appointment_time');
setRows(data || []);
})();
}, [studio]);
return (
<>
<div className="page-head"><span className="eyebrow">Bookings</span><h1>Upcoming &amp; past classes</h1></div>
<table>
<thead><tr><th>Date</th><th>Time</th><th>Class</th><th>Price</th><th>Status</th></tr></thead>
<tbody>
{rows.map(r => (
<tr key={r.id}><td>{r.appointment_date}</td><td>{r.appointment_time}</td><td>{r.service_name}</td><td>$" + "{Number(r.price).toFixed(0)}</td><td>{r.status}</td></tr>
))}
{rows.length === 0 && <tr><td colSpan={5}>No bookings yet.</td></tr>}
</tbody>
</table>
</>
);
}

function Clients({ studio }) {
const [rows, setRows] = useState([]);
useEffect(() => {
(async () => {
const { data } = await supabase.from('clients').select('*').eq('studio_id', studio.id).order('created_at', { ascending: false });
setRows(data || []);
})();
}, [studio]);
return (
<>
<div className="page-head"><span className="eyebrow">Clients</span><h1>Every client, one record</h1></div>
<table>
<thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>Notes</th></tr></thead>
<tbody>
{rows.map(r => (
<tr key={r.id}><td>{r.name}</td><td>{r.phone}</td><td>{r.email}</td><td>{r.notes}</td></tr>
))}
{rows.length === 0 && <tr><td colSpan={4}>No clients yet.</td></tr>}
</tbody>
</table>
</>
);
}

function Finance({ studio }) {
const [rows, setRows] = useState([]);
const [type, setType] = useState('income');
const [category, setCategory] = useState('');
const [amount, setAmount] = useState('');

async function load() {
const { data } = await supabase.from('transactions').select('*').eq('studio_id', studio.id).order('created_at', { ascending: false });
setRows(data || []);
}
useEffect(() => { load(); }, [studio]);

async function addEntry() {
if (!category || !amount) return;
await supabase.from('transactions').insert({ studio_id: studio.id, type, category, amount: Number(amount) });
setCategory(''); setAmount('');
load();
}
const total = rows.reduce((sum, t) => sum + (t.type === 'income' ? Number(t.amount) : -Number(t.amount)), 0);

return (
<>
<div className="page-head"><span className="eyebrow">Income &amp; Expenses</span><h1>See your real profit</h1></div>
<div className="inline-form">
<select value={type} onChange={e => setType(e.target.value)}>
<option value="income">Income</option>
<option value="expense">Expense</option>
</select>
<input type="text" placeholder="Description, e.g. Rent" value={category} onChange={e => setCategory(e.target.value)} />
<input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} style={{maxWidth:120}} />
<button className="btn btn-solid" onClick={addEntry}>Add entry</button>
</div>
<table>
<thead><tr><th>Date</th><th>Description</th><th>Amount</th></tr></thead>
<tbody>
{rows.map(r => (
<tr key={r.id}><td>{new Date(r.created_at).toLocaleDateString('en-AU')}</td><td>{r.category}</td>
<td className={r.type === 'income' ? 'amt-in' : 'amt-out'}>{r.type === 'income' ? '+' : '−'}$" + "{Number(r.amount).toFixed(0)}</td></tr>
))}
</tbody>
</table>
<div className="stat-grid" style={{marginTop:18, marginBottom:0}}>
<div className="stat"><div className="num">$" + "{total.toFixed(0)}</div><div className="lbl">Net total</div></div>
</div>
</>
);
}

function PriceList({ studio }) {
const [rows, setRows] = useState([]);
const [name, setName] = useState('');
const [price, setPrice] = useState('');
const [duration, setDuration] = useState('');

async function load() {
const { data } = await supabase.from('services').select('*').eq('studio_id', studio.id).order('sort_order');
setRows(data || []);
}
useEffect(() => { load(); }, [studio]);

async function addService() {
if (!name || !price) return;
await supabase.from('services').insert({ studio_id: studio.id, name, price: Number(price), duration_mins: duration ? Number(duration) : null });
setName(''); setPrice(''); setDuration('');
load();
}

return (
<>
<div className="page-head"><span className="eyebrow">Price list</span><h1>Your classes &amp; packages</h1><p className="sub">This is exactly what shows on your public booking page.</p></div>
<div className="inline-form">
<input type="text" placeholder="Class or package name" value={name} onChange={e => setName(e.target.value)} />
<input type="number" placeholder="Duration (mins)" value={duration} onChange={e => setDuration(e.target.value)} style={{maxWidth:160}} />
<input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} style={{maxWidth:120}} />
<button className="btn btn-solid" onClick={addService}>Add</button>
</div>
<div className="toolbar"><button className="btn btn-outline" onClick={() => window.print()}>Print price list</button></div>
<div className="price-sheet">
<h2 style={{fontFamily:'var(--fd)', fontStyle:'italic', marginBottom:20}}>{studio.name}</h2>
{rows.map(r => (
<div className="price-row" key={r.id}>
<div><div className="pname">{r.name}</div>{r.duration_mins && <span className="pmeta">{r.duration_mins} min</span>}</div>
<div className="pval">$" + "{Number(r.price).toFixed(0)}</div>
</div>
))}
{rows.length === 0 && <p className="sub">No services yet — add one above.</p>}
</div>
</>
);
}

function Todo({ studio }) {
const [rows, setRows] = useState([]);
const [text, setText] = useState('');

async function load() {
const { data } = await supabase.from('todos').select('*').eq('studio_id', studio.id).order('created_at');
setRows(data || []);
}
useEffect(() => { load(); }, [studio]);

async function addTodo() {
if (!text) return;
await supabase.from('todos').insert({ studio_id: studio.id, text });
setText('');
load();
}
async function toggle(row) {
await supabase.from('todos').update({ done: !row.done }).eq('id', row.id);
load();
}

return (
<>
<div className="page-head"><span className="eyebrow">To-do</span><h1>The small stuff, tracked</h1></div>
<div className="inline-form">
<input type="text" placeholder="Add a task" value={text} onChange={e => setText(e.target.value)} />
<button className="btn btn-solid" onClick={addTodo}>Add task</button>
</div>
<div className="todo-list">
{rows.map(r => (
<div className={'todo-item' + (r.done ? ' done' : '')} key={r.id}>
<input type="checkbox" checked={r.done} onChange={() => toggle(r)} /><span style={{flex:1}}>{r.text}</span>
<span style={{fontSize:'0.75rem', color:'var(--body-soft)', flexShrink:0, marginLeft:10}}>{new Date(r.created_at).toLocaleDateString('en-AU')}</span>
</div>
))}
{rows.length === 0 && <div className="todo-item">Nothing to do yet.</div>}
</div>
</>
);
}

function Stock({ studio }) {
const [rows, setRows] = useState([]);
const [name, setName] = useState('');
const [qty, setQty] = useState('');
const [reorderAt, setReorderAt] = useState('');

async function load() {
const { data } = await supabase.from('stock_items').select('*').eq('studio_id', studio.id).order('name');
setRows(data || []);
}
useEffect(() => { load(); }, [studio]);

async function addItem() {
if (!name) return;
await supabase.from('stock_items').insert({ studio_id: studio.id, name, qty: Number(qty) || 0, reorder_at: Number(reorderAt) || 0 });
setName(''); setQty(''); setReorderAt('');
load();
}

return (
<>
<div className="page-head"><span className="eyebrow">Stock</span><h1>Know what's running low</h1></div>
<div className="inline-form">
<input type="text" placeholder="Item name" value={name} onChange={e => setName(e.target.value)} />
<input type="number" placeholder="Qty on hand" value={qty} onChange={e => setQty(e.target.value)} style={{maxWidth:140}} />
<input type="number" placeholder="Reorder at" value={reorderAt} onChange={e => setReorderAt(e.target.value)} style={{maxWidth:140}} />
<button className="btn btn-solid" onClick={addItem}>Add item</button>
</div>
<table>
<thead><tr><th>Item</th><th>On hand</th><th>Reorder at</th><th>Status</th></tr></thead>
<tbody>
{rows.map(r => (
<tr key={r.id}>
<td>{r.name}</td><td>{r.qty}</td><td>{r.reorder_at}</td>
<td><span className={'tag ' + (r.qty <= r.reorder_at ? 'low' : 'ok')}>{r.qty <= r.reorder_at ? 'Low' : 'OK'}</span></td>
</tr>
))}
{rows.length === 0 && <tr><td colSpan={4}>No stock items yet.</td></tr>}
</tbody>
</table>
</>
);
}
