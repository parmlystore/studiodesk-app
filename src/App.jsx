import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient.js';
import Booking from './Booking.jsx';
import Login from './Login.jsx';
import Dashboard from './Dashboard.jsx';
import Demo from './Demo.jsx';

function ResetPassword() {
const [password, setPassword] = useState('');
const [showPassword, setShowPassword] = useState(false);
const [saving, setSaving] = useState(false);
const [error, setError] = useState('');
const [done, setDone] = useState(false);

async function handleSubmit(e) {
e.preventDefault();
setError('');
setSaving(true);
const { error } = await supabase.auth.updateUser({ password });
setSaving(false);
if (error) { setError(error.message); return; }
setDone(true);
}

return (
<div className="login-shell">
<div className="login-card">
<div className="login-brand">StudioDesk<span style={{color:'var(--plum)'}}>.</span></div>
<div className="login-sub">Set a new password</div>
{done ? (
<>
<p className="sub center" style={{margin:'16px 0 20px'}}>Your password has been updated.</p>
<button className="btn btn-solid" style={{width:'100%', justifyContent:'center'}} onClick={() => { window.location.hash = ''; window.location.href = '/login'; }}>Continue to dashboard</button>
</>
) : (
<form onSubmit={handleSubmit}>
<div className="field">
<label>New password</label>
<div style={{position:'relative'}}>
<input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required minLength={6} style={{paddingRight:52}} />
<button type="button" onClick={() => setShowPassword(s => !s)}
style={{position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:'0.72rem', letterSpacing:'0.04em', textTransform:'uppercase', color:'var(--plum)', padding:4}}>
{showPassword ? 'Hide' : 'Show'}
</button>
</div>
</div>
{error && <div className="error-msg">{error}</div>}
<button className="btn btn-solid" type="submit" style={{width:'100%', justifyContent:'center'}} disabled={saving}>
{saving ? 'Saving…' : 'Save new password'}
</button>
</form>
)}
</div>
</div>
);
}

export default function App() {
const [session, setSession] = useState(undefined); // undefined = loading, null = logged out
const [isRecovery, setIsRecovery] = useState(() => typeof window !== 'undefined' && window.location.hash.includes('type=recovery'));
const params = new URLSearchParams(window.location.search);
const bookingSlug = params.get('book');
const path = window.location.pathname;

useEffect(() => {
supabase.auth.getSession().then(({ data }) => setSession(data.session));
const { data: listener } = supabase.auth.onAuthStateChange((event, sess) => {
setSession(sess);
if (event === 'PASSWORD_RECOVERY') setIsRecovery(true);
});
return () => listener.subscription.unsubscribe();
}, []);

// Public booking page: /?book=willow-vine OR /book/willow-vine (real, Supabase-backed)
if (bookingSlug) {
return <Booking slug={bookingSlug} />;
}
const pathMatch = path.match(/^\/book\/([a-zA-Z0-9-]+)/);
if (pathMatch) {
return <Booking slug={pathMatch[1]} />;
}

// Real login/dashboard only at /login — not linked from the public demo
if (path === '/login') {
if (session === undefined) {
return <div className="login-shell"><div className="login-brand">StudioDesk<span style={{color:'var(--plum)'}}>.</span></div></div>;
}
// A password-reset email link lands here with a recovery session — show the
// set-new-password form instead of dropping straight into the dashboard.
if (isRecovery && session) {
return <ResetPassword />;
}
if (!session) {
return <Login />;
}
return <Dashboard session={session} />;
}

// Public interactive demos with fake data, no login wall.
// /demo/basic -> Basic plan demo, /demo/pro (or default '/') -> Pro plan demo
if (path === '/demo/basic') {
return <Demo plan="basic" />;
}
return <Demo plan="pro" />;
}
